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

    // PDF
    if (file.type === "application/pdf") {
      const uint8Array = new Uint8Array(await file.arrayBuffer());

      const pdf = await pdfjsLib.getDocument({
        data: uint8Array,
      }).promise;

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);

        const content = await page.getTextContent();

        const strings = content.items.map(
          (item: any) => item.str || ""
        );

        text += strings.join(" ") + "\n";
      }
    }

    // TXT
    else if (file.type === "text/plain") {
      text = await file.text();
    }

    // DOCX
    else if (
      file.type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      const result = await mammoth.extractRawText({
        buffer,
      });

      text = result.value;
    }

    // Unsupported
    else {
      return NextResponse.json(
        { error: "Unsupported file type" },
        { status: 400 }
      );
    }

    // Empty text
    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        { error: "Could not extract text from file" },
        { status: 400 }
      );
    }

    const trimmedText = text.slice(0, 6000);

    console.log(
      "KEY EXISTS:",
      !!process.env.OPENROUTER_API_KEY
    );

    // AI CALL
    const aiResponse = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",

        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY?.trim()}`,
          "Content-Type": "application/json",
          "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL,
          "X-Title": "AI File Analyzer",
        },

        body: JSON.stringify({
          model: "openrouter/free",

          messages: [
            {
              role: "system",

              content: `
You are a technical analyst.

Return ONLY valid JSON.

Required keys:
- summary
- keyPoints
- risks
- importantDates

Rules:
- keyPoints must be array
- risks must be array
- importantDates must be object
- no markdown
- no extra text
`,
            },

            {
              role: "user",
              content: trimmedText,
            },
          ],

          response_format: {
            type: "json_object",
          },
        }),
      }
    );

    // HANDLE API ERRORS
    if (!aiResponse.ok) {
      const errText = await aiResponse.text();

      console.error("OPENROUTER ERROR:", errText);

      return NextResponse.json(
        {
          error: "AI request failed",
          details: errText,
        },
        { status: 500 }
      );
    }

    const data = await aiResponse.json();

    console.log(
      "FULL AI RESPONSE:",
      JSON.stringify(data, null, 2)
    );

    const content =
      data?.choices?.[0]?.message?.content;

    // SAFE PARSE
    let parsed: any = {};

    try {
      parsed = JSON.parse(content || "{}");
    } catch (err) {
      console.error("JSON PARSE ERROR:", err);

      parsed = {};
    }

    // SAFE RESPONSE
    const safeResponse = {
      summary:
        typeof parsed.summary === "string"
          ? parsed.summary
          : "No summary available.",

      keyPoints: Array.isArray(parsed.keyPoints)
        ? parsed.keyPoints
        : [],

      risks: Array.isArray(parsed.risks)
        ? parsed.risks
        : [],

      importantDates:
        parsed.importantDates &&
        typeof parsed.importantDates === "object" &&
        !Array.isArray(parsed.importantDates)
          ? parsed.importantDates
          : {},
    };

    return NextResponse.json({
      ...safeResponse,
      rawTextLength: text.length,
    });
  } catch (error) {
    console.error("SERVER ERROR:", error);

    return NextResponse.json(
      {
        error: "Something went wrong",
      },
      { status: 500 }
    );
  }
}
