import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const prompt = `
You are Auralith, an AI analytics assistant.

Answer the user's question based only on the dataset sample and column summaries provided.

Be concise, clear, and analytical.
Do not use Markdown formatting. Do not use asterisks, bold text, or headings.
If the question asks for a calculation, compute it from the provided rows when possible.
If the dataset sample is insufficient to compute an answer, say that clearly.

Be tolerant of typos and synonyms in the user's question. Examples: "ragion" should be interpreted as "region"; "salse" as "sales"; "revenue" might map to a "sales" column. Use the column summaries below as the source of truth for what data exists.

IMPORTANT: If — and only if — the user's question references columns, fields, or concepts that have no plausible match in this dataset (even allowing for typos and synonyms), respond with EXACTLY this format on a single line and nothing else:

UNSUPPORTED: <one short sentence naming the unmatched terms and listing the dataset's actual columns>

Do NOT use the UNSUPPORTED prefix when the dataset simply doesn't have enough rows or detail to answer a well-formed question — in that case, just say so in plain prose. UNSUPPORTED is only for questions that don't match the dataset at all.

Column summaries:
${JSON.stringify(body.columns, null, 2)}

Dataset sample rows:
${JSON.stringify(body.rows, null, 2)}

User question:
${body.question}
`;

    const result = await model.generateContent(prompt);
    const rawAnswer = result.response.text();
    const trimmed = rawAnswer.trim();

    if (trimmed.startsWith("UNSUPPORTED:")) {
      const reason = trimmed.slice("UNSUPPORTED:".length).trim();

      return NextResponse.json({
        success: false,
        rejected: true,
        answer:
          reason ||
          "Your question doesn't match this dataset's columns.",
      });
    }

    return NextResponse.json({
      success: true,
      answer: rawAnswer,
    });
  } catch (error) {
    console.error("AI question failed:", error);

    return NextResponse.json(
      {
        success: false,
        answer: "AI request failed. Please try again.",
      },
      { status: 500 }
    );
  }
}