import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NANO_BANANA_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { image, text } = await req.json();

    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

    const prompt = `You are an expert environmental consultant for Australian construction sites, specialized in the Landcom Blue Book. 
    Review this image of a site condition and the user's input: "${text}".
    Provide a professional, condensed technical assessment. Identify if the current controls are compliant with the Blue Book. 
    State specific technical requirements (e.g., Star picket spacing, trench depth, basin capacity) and provide a corrective action if needed. 
    Always cite the Blue Book. Keep it under 100 words.`;

    // Assuming image is base64 encoded string
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: image.split(",")[1] || image,
          mimeType: "image/jpeg",
        },
      },
    ]);

    const response = await result.response;
    return NextResponse.json({ analysis: response.text() });
  } catch (error: any) {
    console.error("Vision API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
