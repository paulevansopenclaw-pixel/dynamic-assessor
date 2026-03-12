import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { transcript, technicalSpecs } = await req.json();

    if (!transcript) {
      return NextResponse.json({ verified: false, feedback: "I didn't hear anything. Can you explain the fix again?" });
    }

    // Logic: Check if the transcript contains key technical indicators from the specs
    // This is a "fuzzy" match to simulate Wolf's technical oversight
    const specs = technicalSpecs.toLowerCase();
    const input = transcript.toLowerCase();

    // Extract numbers and key technical terms
    const numbersInSpecs = specs.match(/\d+/g) || [];
    const keywords = ["trench", "spacing", "hectares", "compacted", "mm", "meters", "depth", "cover"];
    
    const requiredKeywords = keywords.filter(word => specs.includes(word));
    
    const matchedNumbers = numbersInSpecs.filter((num: string) => input.includes(num));
    const matchedKeywords = requiredKeywords.filter(word => input.includes(word));

    const score = (matchedNumbers.length + matchedKeywords.length) / (numbersInSpecs.length + requiredKeywords.length);

    if (score >= 0.5) {
      return NextResponse.json({ 
        verified: true, 
        feedback: "Spot on. You clearly know the standard. Access granted." 
      });
    } else {
      return NextResponse.json({ 
        verified: false, 
        feedback: `Not quite. You missed some critical details. Remember the requirement: ${technicalSpecs}. Try explaining it again.` 
      });
    }
  } catch (error) {
    console.error("Competency check error:", error);
    return NextResponse.json({ verified: false, feedback: "Error processing your response." }, { status: 500 });
  }
}
