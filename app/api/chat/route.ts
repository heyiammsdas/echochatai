
// import { NextResponse } from "next/server";

import { openrouter } from "@openrouter/ai-sdk-provider";
import {
  createUIMessageStreamResponse,
  toUIMessageStream, streamText,
  convertToModelMessages
} from "ai";


export async function POST(request: Request) {

    const { messages } = await request.json() ;

    const modelMessage = await convertToModelMessages(messages) ;

    const result = await streamText({
        model: openrouter("openrouter/free"),
        messages: modelMessage ,
    });

    return createUIMessageStreamResponse({
        stream: toUIMessageStream({
            stream: result.stream,
        }),
    }) ;
        



}