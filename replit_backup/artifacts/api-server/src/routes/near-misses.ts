import { Router, type IRouter } from "express";
import { eq, and, desc } from "drizzle-orm";
import { db, nearMissesTable, sitesTable } from "@workspace/db";
import { CreateNearMissBody, ListNearMissesQueryParams } from "@workspace/api-zod";

const router: IRouter = Router();

async function buildNearMissResponse(nm: typeof nearMissesTable.$inferSelect) {
  const [site] = await db.select().from(sitesTable).where(eq(sitesTable.id, nm.siteId));
  return {
    ...nm,
    siteName: site?.name ?? "Unknown",
    createdAt: nm.createdAt.toISOString(),
  };
}

router.get("/nearmisses", async (req, res): Promise<void> => {
  const query = ListNearMissesQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: query.error.message });
    return;
  }

  const conditions = [];
  if (query.data.siteId !== undefined) conditions.push(eq(nearMissesTable.siteId, query.data.siteId));

  const items = await db
    .select()
    .from(nearMissesTable)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(nearMissesTable.createdAt));

  const result = await Promise.all(items.map(buildNearMissResponse));
  res.json(result);
});

router.post("/nearmisses", async (req, res): Promise<void> => {
  const parsed = CreateNearMissBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [nm] = await db.insert(nearMissesTable).values(parsed.data).returning();
  const response = await buildNearMissResponse(nm);
  res.status(201).json(response);
});

export default router;
