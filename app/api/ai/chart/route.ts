import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY || ""
);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const prompt = `
You are an analytics assistant.

Given:
- dataset columns
- a user request

Return ONLY valid JSON in this format:

{
  "chartType": "bar",
  "xAxis": "Region",
  "yAxis": "Sales"
}

Allowed chart types:
- bar
- line
- pie

Dataset columns:
${JSON.stringify(body.columns)}

User request:
${body.command}
`;

    const result = await model.generateContent(prompt);

    const text = result.response.text();

    const cleaned = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const parsed = JSON.parse(cleaned);

    return NextResponse.json({
      success: true,
      result: parsed,
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