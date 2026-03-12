import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    const apiKey = process.env.NANO_BANANA_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "Missing Image API Key" }, { status: 500 });
    }

    // Google Imagen / Vertex / AI Studio integration stub
    // Using the official generative language API for Imagen (if available on the key)
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-fast-generate-001:predict?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        instances: [{ prompt: `Photorealistic, mobile phone photo from a construction site, 4k resolution: ${prompt}` }],
        parameters: { sampleCount: 1 }
      })
    });

    if (!response.ok) {
      const errorMsg = await response.text();
      console.error("Image API Error:", errorMsg);
      return NextResponse.json({ error: "Image Generation Failed" }, { status: response.status });
    }

    const data = await response.json();
    const base64Image = data?.predictions?.[0]?.bytesBase64Encoded || null;

    if (base64Image) {
      return NextResponse.json({ imageUrl: `data:image/jpeg;base64,${base64Image}` });
    }

    return NextResponse.json({ error: "No image generated" }, { status: 500 });

  } catch (error) {
    console.error("Server Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
