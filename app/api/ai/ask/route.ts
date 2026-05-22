import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});

const HISTORY_WINDOW = 20;

type StoredMessage = {
  role: string;
  content: string;
};

function formatHistory(history: StoredMessage[]): string {
  if (history.length === 0) return "(no prior messages)";

  return history
    .map((msg) => {
      const speaker = msg.role === "user" ? "User" : "Assistant";
      return `${speaker}: ${msg.content}`;
    })
    .join("\n\n");
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const body = await request.json();

    const datasetId = body.datasetId;
    const userMessage = body.message;
    const rows = body.rows;
    const columns = body.columns;

    if (typeof datasetId !== "string" || datasetId.length === 0) {
      return NextResponse.json(
        { success: false, message: "Missing datasetId" },
        { status: 400 }
      );
    }

    if (typeof userMessage !== "string" || userMessage.trim().length === 0) {
      return NextResponse.json(
        { success: false, message: "Missing message" },
        { status: 400 }
      );
    }

    const dataset = await prisma.dataset.findUnique({
      where: { id: datasetId },
      select: { id: true, userId: true },
    });

    if (!dataset) {
      return NextResponse.json(
        { success: false, message: "Dataset not found" },
        { status: 404 }
      );
    }

    if (dataset.userId !== user.id) {
      return NextResponse.json(
        { success: false, message: "Forbidden" },
        { status: 403 }
      );
    }

    await prisma.chatMessage.create({
      data: {
        datasetId,
        role: "user",
        content: userMessage,
      },
    });

    const history = await prisma.chatMessage.findMany({
      where: { datasetId },
      orderBy: { createdAt: "desc" },
      take: HISTORY_WINDOW,
      select: { role: true, content: true },
    });

    const chronologicalHistory = [...history].reverse();

    const prompt = `
You are Auralith, an AI analytics assistant.

You are having an ongoing conversation with the user about a specific dataset. Use the column summaries, dataset sample rows, and conversation history to answer the user's latest message.

Be concise, clear, and analytical.
Do not use Markdown formatting. Do not use asterisks, bold text, or headings.
If the question asks for a calculation, compute it from the provided rows when possible.
If the dataset sample is insufficient to compute an answer, say that clearly.
When the user uses pronouns like "it", "that", or "those", resolve them from the prior conversation turns.

Be tolerant of typos and synonyms in the user's question. Examples: "ragion" should be interpreted as "region"; "salse" as "sales"; "revenue" might map to a "sales" column. Use the column summaries as the source of truth for what data exists.

IMPORTANT: If — and only if — the user's latest message references columns, fields, or concepts that have no plausible match in this dataset (even allowing for typos and synonyms), respond with EXACTLY this format on a single line and nothing else:

UNSUPPORTED: <one short sentence naming the unmatched terms and listing the dataset's actual columns>

Do NOT use the UNSUPPORTED prefix when the dataset simply doesn't have enough rows or detail to answer a well-formed question — in that case, just say so in plain prose. UNSUPPORTED is only for questions that don't match the dataset at all.

Column summaries:
${JSON.stringify(columns, null, 2)}

Dataset sample rows (first 50):
${JSON.stringify(Array.isArray(rows) ? rows.slice(0, 50) : [], null, 2)}

Conversation history (oldest to newest, including the latest user message):
${formatHistory(chronologicalHistory)}

Reply to the latest user message now.
`;

    let assistantContent: string;

    try {
      const result = await model.generateContent(prompt);
      const rawAnswer = result.response.text();
      const trimmed = rawAnswer.trim();

      if (trimmed.startsWith("UNSUPPORTED:")) {
        const reason = trimmed.slice("UNSUPPORTED:".length).trim();
        assistantContent =
          reason || "Your question doesn't match this dataset's columns.";
      } else {
        assistantContent = rawAnswer;
      }
    } catch (geminiError) {
      console.error("Gemini call failed:", geminiError);

      return NextResponse.json(
        {
          success: false,
          message: "AI request failed. Please try again.",
        },
        { status: 500 }
      );
    }

    await prisma.chatMessage.create({
      data: {
        datasetId,
        role: "assistant",
        content: assistantContent,
      },
    });

    return NextResponse.json({
      success: true,
      message: assistantContent,
    });
  } catch (error) {
    console.error("AI question failed:", error);

    return NextResponse.json(
      {
        success: false,
        message: "AI request failed. Please try again.",
      },
      { status: 500 }
    );
  }
}
