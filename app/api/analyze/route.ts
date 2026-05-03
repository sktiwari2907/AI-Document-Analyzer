import { NextRequest, NextResponse } from "next/server";
import mammoth from "mammoth";
// @ts-ignore
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    let text = "";

    if (file.type === "application/pdf") {
        const uint8Array = new Uint8Array(await file.arrayBuffer());

        const pdf = await pdfjsLib.getDocument({ data: uint8Array }).promise;

        text = ""; // ✅ FIX

        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();

            const strings = content.items.map((item: any) => item.str);
            text += strings.join(" ") + "\n";
        }
    }
    else if (file.type === "text/plain") {
      text = await file.text();
    } 
    else if (
      file.type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      const result = await mammoth.extractRawText({ buffer });
      text = result.value;
    } 
    else {
      return NextResponse.json(
        { error: "Unsupported file type" },
        { status: 400 }
      );
    }

    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        { error: "Could not extract text from file" },
        { status: 400 }
      );
    }

    const trimmedText = text.slice(0, 6000);

    console.log("ENV:", process.env.OPENROUTER_API_KEY);

    const aiResponse = await fetch(
  "https://openrouter.ai/api/v1/chat/completions",
  {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY?.trim()}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "http://localhost:3000", 
    },
    body: JSON.stringify({
      model: "openrouter/free",
      messages: [
  {
    role: "system",
    content: `You are a technical analyst. 
    Output your analysis in STRICT JSON format. 
    Required keys: "summary", "keyPoints", "risks", "importantDates". 
    Do not include any markdown formatting like \`\`\`json or extra text.`
  },
  {
    role: "user",
    content: trimmedText
  }
],
      response_format: { type: "json_object" } 
    }),
  }
);

    const data = await aiResponse.json();
    console.log("FULL AI RESPONSE:", JSON.stringify(data, null, 2));

    const content = data?.choices?.[0]?.message?.content;

    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch {
      parsed = {
        summary: content,
        keyPoints: [],
        risks: [],
        importantDates: [],
      };
    }

    return NextResponse.json({
      ...parsed,
      rawTextLength: text.length,
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
};