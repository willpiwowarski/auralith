import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});

type ChartFilter = {
  column: string;
  op: "equals";
  value: string;
};

type ChartConfig = {
  chartType: "bar" | "line" | "pie";
  xAxis: string;
  yAxis: string;
  agg?: "sum" | "avg" | "count" | "min" | "max";
  filter?: ChartFilter;
};

type ValidationResult =
  | { ok: true; value: ChartConfig }
  | { ok: false; reason: string; rejected?: boolean };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function validateChartConfig(parsed: unknown): ValidationResult {
  if (!isRecord(parsed)) {
    return { ok: false, reason: "response must be a JSON object" };
  }

  const { chartType, xAxis, yAxis, agg, filter } = parsed;

  if (chartType !== "bar" && chartType !== "line" && chartType !== "pie") {
    return {
      ok: false,
      reason: `chartType must be one of "bar", "line", "pie"; got ${JSON.stringify(chartType)}`,
    };
  }

  if (typeof xAxis !== "string" || xAxis.length === 0) {
    return { ok: false, reason: "xAxis must be a non-empty string" };
  }

  if (typeof yAxis !== "string" || yAxis.length === 0) {
    return { ok: false, reason: "yAxis must be a non-empty string" };
  }

  if (agg !== undefined) {
    if (
      agg !== "sum" &&
      agg !== "avg" &&
      agg !== "count" &&
      agg !== "min" &&
      agg !== "max"
    ) {
      return {
        ok: false,
        reason: `agg, if present, must be one of "sum", "avg", "count", "min", "max"; got ${JSON.stringify(agg)}`,
      };
    }
  }

  let validatedFilter: ChartFilter | undefined;

  if (filter !== undefined) {
    if (!isRecord(filter)) {
      return { ok: false, reason: "filter, if present, must be an object" };
    }

    if (typeof filter.column !== "string" || filter.column.length === 0) {
      return {
        ok: false,
        reason: "filter.column must be a non-empty string",
      };
    }

    if (filter.op !== "equals") {
      return {
        ok: false,
        reason: `filter.op must be "equals"; got ${JSON.stringify(filter.op)}`,
      };
    }

    if (typeof filter.value !== "string") {
      return { ok: false, reason: "filter.value must be a string" };
    }

    validatedFilter = {
      column: filter.column,
      op: "equals",
      value: filter.value,
    };
  }

  return {
    ok: true,
    value: {
      chartType,
      xAxis,
      yAxis,
      agg: agg as ChartConfig["agg"],
      filter: validatedFilter,
    },
  };
}

function stripFences(text: string): string {
  return text.replace(/```json/g, "").replace(/```/g, "").trim();
}

function tryParseAndValidate(text: string): ValidationResult {
  let parsed: unknown;

  try {
    parsed = JSON.parse(stripFences(text));
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    return { ok: false, reason: `response was not valid JSON: ${detail}` };
  }

  if (
    isRecord(parsed) &&
    typeof parsed.error === "string" &&
    parsed.error.length > 0
  ) {
    return { ok: false, rejected: true, reason: parsed.error };
  }

  return validateChartConfig(parsed);
}

function buildBasePrompt(columns: unknown, command: unknown): string {
  return `
You are an analytics assistant.

Given:
- dataset columns
- a user request

Your job: map the user's request to a chart over those columns. If — and only if — the request cannot reasonably be mapped to the dataset columns, return a rejection instead.

Be tolerant of typos, synonyms, and minor variations. Examples: "ragion" should match a "region" column; "salse" should match "sales"; "revenue" might map to a "sales" column; "avg" / "average" / "mean" all mean agg "avg". Use the column names below as the source of truth.

Return ONLY a single JSON object with no commentary and no markdown.

Happy-path shape:

{
  "chartType": "bar" | "line" | "pie",
  "xAxis": "<column name>",
  "yAxis": "<column name>",
  "agg": "sum" | "avg" | "count" | "min" | "max",
  "filter": { "column": "<column name>", "op": "equals", "value": "<value>" }
}

Rejection shape (use when the request references terms that have no plausible match to any of the columns, even allowing for typos and synonyms):

{
  "error": "<one short sentence naming the unmatched terms and listing the dataset's actual columns>"
}

Rules:
- chartType MUST be one of "bar", "line", "pie".
- xAxis, yAxis, and filter.column MUST be exact names from the columns list below.
- agg controls how y-axis values are aggregated per x-axis group. Default to "sum" for bar/line. Omit agg entirely for pie unless the user asks for counts. Example: "average profit by region" → agg: "avg".
- filter is optional. Use it only when the user asks to restrict to a single value. op must be "equals". Example: "sales by month in 2024" → filter: {column: "year", op: "equals", value: "2024"}.
- Do NOT invent column names. If you would have to invent a column name to satisfy the request, return the rejection shape instead.

Dataset columns:
${JSON.stringify(columns)}

User request:
${command}
`;
}

function buildRetryPrompt(
  columns: unknown,
  command: unknown,
  failureReason: string
): string {
  return `
${buildBasePrompt(columns, command)}

Your previous response was rejected for this reason: ${failureReason}
Return ONLY valid JSON matching the shape above. Do not include explanation, markdown fences, or any text outside the JSON object.
`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const columns = body.columns;
    const command = body.command;

    const firstResult = await model.generateContent(
      buildBasePrompt(columns, command)
    );
    const firstText = firstResult.response.text();

    let validation = tryParseAndValidate(firstText);

    if (!validation.ok && validation.rejected) {
      return NextResponse.json(
        {
          success: false,
          message: validation.reason,
        },
        { status: 422 }
      );
    }

    if (!validation.ok) {
      const retryResult = await model.generateContent(
        buildRetryPrompt(columns, command, validation.reason)
      );
      const retryText = retryResult.response.text();
      validation = tryParseAndValidate(retryText);
    }

    if (!validation.ok && validation.rejected) {
      return NextResponse.json(
        {
          success: false,
          message: validation.reason,
        },
        { status: 422 }
      );
    }

    if (!validation.ok) {
      return NextResponse.json(
        {
          success: false,
          message: `Chart AI returned an invalid response: ${validation.reason}`,
        },
        { status: 422 }
      );
    }

    const config = validation.value;

    const columnNames = new Set<string>(
      Array.isArray(columns)
        ? columns
            .map((c: unknown) =>
              isRecord(c) && typeof c.name === "string" ? c.name : null
            )
            .filter((name): name is string => name !== null)
        : []
    );

    const referencedColumns: string[] = [config.xAxis, config.yAxis];
    if (config.filter) referencedColumns.push(config.filter.column);

    for (const colName of referencedColumns) {
      if (!columnNames.has(colName)) {
        return NextResponse.json(
          {
            success: false,
            message: `Gemini referenced a column that does not exist: ${colName}`,
          },
          { status: 422 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      result: config,
    });
  } catch (error) {
    console.error("Gemini chart generation failed:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to generate chart config",
      },
      { status: 500 }
    );
  }
}
