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
If the dataset sample is insufficient, say that clearly.

Column summaries:
${JSON.stringify(body.columns, null, 2)}

Dataset sample rows:
${JSON.stringify(body.rows, null, 2)}

User question:
${body.question}
`;

    const result = await model.generateContent(prompt);
    const answer = result.response.text();

    return NextResponse.json({
      success: true,
      answer,
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