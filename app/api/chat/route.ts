import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Initialize the Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Messages are required and should be an array." },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Gemini requires the history to start with a 'user' role.
    // We remove the initial 'assistant' greeting if it exists.
    let conversationMessages = [...messages];
    if (conversationMessages.length > 0 && conversationMessages[0].role === 'assistant') {
      conversationMessages.shift();
    }
    
    // If no user messages are left, we can't proceed.
    if (conversationMessages.length === 0) {
      return NextResponse.json({ result: "I'm ready to help! What's your question?" });
    }

    // Convert frontend message format to Gemini's format
    const history = conversationMessages.slice(0, -1).map((msg: any) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    }));

    const lastMessage = conversationMessages[conversationMessages.length - 1];

    const chat = model.startChat({
      history: history,
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.9,
        topK: 1,
        topP: 1,
      },
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        // ... add other safety settings if needed
      ],
    });

    const result = await chat.sendMessage(lastMessage.content);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ result: text });
  } catch (error) {
    console.error("Error in chat API:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json(
      { 
        error: "Failed to generate response from Gemini API",
        details: errorMessage 
      },
      { status: 500 }
    );
  }
} 