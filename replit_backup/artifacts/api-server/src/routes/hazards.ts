import { Router, type IRouter } from "express";
import { eq, and, desc } from "drizzle-orm";
import { db, hazardsTable, sitesTable } from "@workspace/db";
import {
  CreateHazardBody,
  UpdateHazardParams,
  UpdateHazardBody,
  ListHazardsQueryParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

function getRiskLevel(riskRating: number): string {
  if (riskRating <= 4) return "low";
  if (riskRating <= 9) return "medium";
  if (riskRating <= 16) return "high";
  return "extreme";
}

async function buildHazardResponse(hazard: typeof hazardsTable.$inferSelect) {
  const [site] = await db.select().from(sitesTable).where(eq(sitesTable.id, hazard.siteId));
  return {
    ...hazard,
    siteName: site?.name ?? "Unknown",
    createdAt: hazard.createdAt.toISOString(),
  };
}

router.get("/hazards", async (req, res): Promise<void> => {
  const query = ListHazardsQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: query.error.message });
    return;
  }

  const conditions = [];
  if (query.data.siteId !== undefined) conditions.push(eq(hazardsTable.siteId, query.data.siteId));
  if (query.data.status) conditions.push(eq(hazardsTable.status, query.data.status));

  const hazards = await db
    .select()
    .from(hazardsTable)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(hazardsTable.createdAt));

  const result = await Promise.all(hazards.map(buildHazardResponse));
  res.json(result);
});

router.post("/hazards", async (req, res): Promise<void> => {
  const parsed = CreateHazardBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const riskRating = parsed.data.likelihood * parsed.data.consequence;
  const riskLevel = getRiskLevel(riskRating);

  const [hazard] = await db
    .insert(hazardsTable)
    .values({
      ...parsed.data,
      riskRating,
      riskLevel,
      status: "open",
    })
    .returning();

  const response = await buildHazardResponse(hazard);
  res.status(201).json(response);
});

router.patch("/hazards/:id", async (req, res): Promise<void> => {
  const params = UpdateHazardParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateHazardBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const updates: Record<string, unknown> = {};
  if (parsed.data.status !== undefined) updates.status = parsed.data.status;
  if (parsed.data.controlMeasures !== undefined) updates.controlMeasures = parsed.data.controlMeasures;

  const [hazard] = await db
    .update(hazardsTable)
    .set(updates)
    .where(eq(hazardsTable.id, params.data.id))
    .returning();

  if (!hazard) {
    res.status(404).json({ error: "Hazard not found" });
    return;
  }

  const response = await buildHazardResponse(hazard);
  res.json(response);
});

export default router;
