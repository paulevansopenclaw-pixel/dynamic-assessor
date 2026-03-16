import { Router } from "express";
import OpenAI from "openai";

const router = Router();

const openai = new OpenAI({
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
});

const BLUEBOOK_CONTEXT = `
You are an expert environmental compliance assistant for NSW construction sites, with deep knowledge of the Blue Book ("Managing Urban Stormwater: Soils and Construction").

The 13 Blue Book environmental controls are:
1. Silt Fence — geotextile barrier to intercept sediment-laden runoff
2. Sediment Basin — detention pond to settle suspended sediment from runoff
3. Sediment Trap — smaller basin for lesser catchments
4. Stabilised Entry/Exit — crushed rock pad to clean truck tyres and reduce tracking
5. Erosion Blanket — jute/coir mat to protect exposed slopes from raindrop erosion
6. Mulching — straw or hydromulch to protect bare soil surfaces
7. Concrete Washout Area — lined, bunded pit for concrete washwater disposal
8. Fuel Bunding — impermeable bunded enclosure for fuel storage
9. Dust Suppression — water carts, suppressants and stockpile management
10. Stormwater Drain Protection — filter bags and covers over inlets
11. Diversion Drain — upslope channel to divert clean run-on around disturbed areas
12. Vegetation Buffer / Tree Protection Zone — orange fencing protecting vegetation
13. Topsoil Stockpile Management — height limits, silt fencing and cover requirements

When a site worker describes an environmental issue, you must:
- Analyse the issue and identify which Blue Book controls are relevant
- Provide specific, practical recommended actions they should take immediately
- Reference which control(s) apply and why
- Keep language simple and direct — workers may be reading this on a phone on-site
`;

router.post("/api/guidance", async (req, res) => {
  try {
    const { description, impacts } = req.body as {
      description: string;
      impacts: string[];
    };

    if (!description?.trim()) {
      return res.status(400).json({ error: "Description is required" });
    }

    const impactText =
      impacts?.length > 0
        ? `\n\nIdentified environmental impacts:\n${impacts.map((i) => `• ${i}`).join("\n")}`
        : "";

    const userPrompt = `A site worker has reported the following issue:\n"${description.trim()}"${impactText}\n\nProvide guidance in this exact JSON format:
{
  "summary": "One sentence summary of the environmental risk",
  "relevantControls": [
    {
      "controlName": "Name from the Blue Book control list",
      "controlId": "slug (e.g. silt-fence, mulching, dust-suppression etc)",
      "reason": "Why this control applies to this specific issue"
    }
  ],
  "immediateActions": [
    "Specific action 1",
    "Specific action 2"
  ],
  "suggestedMeasures": [
    {
      "action": "Specific recommended measure",
      "priority": "immediate|today|this-week"
    }
  ],
  "regulatoryNote": "Any relevant regulatory or notification obligation if applicable, or null"
}

Return only valid JSON, no markdown.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-5-mini",
      max_completion_tokens: 1500,
      messages: [
        { role: "system", content: BLUEBOOK_CONTEXT },
        { role: "user", content: userPrompt },
      ],
    });

    const raw = completion.choices[0]?.message?.content ?? "{}";

    let guidance;
    try {
      guidance = JSON.parse(raw);
    } catch {
      // Attempt to extract JSON from response
      const match = raw.match(/\{[\s\S]*\}/);
      guidance = match ? JSON.parse(match[0]) : { error: "Could not parse guidance" };
    }

    return res.json({ guidance });
  } catch (err: any) {
    console.error("Guidance error:", err?.message ?? err);
    return res.status(500).json({ error: "Failed to generate guidance" });
  }
});

export default router;
