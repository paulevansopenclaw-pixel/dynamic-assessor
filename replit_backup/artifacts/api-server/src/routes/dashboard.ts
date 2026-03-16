import { Router, type IRouter } from "express";
import { eq, count, and, desc } from "drizzle-orm";
import { db, incidentsTable, hazardsTable, nearMissesTable, sitesTable } from "@workspace/db";
import { GetDashboardQueryParams } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/dashboard", async (req, res): Promise<void> => {
  const query = GetDashboardQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: query.error.message });
    return;
  }

  const siteFilter = query.data.siteId;

  const [totalIncidentsResult] = await db
    .select({ count: count() })
    .from(incidentsTable)
    .where(siteFilter ? eq(incidentsTable.siteId, siteFilter) : undefined);

  const [openIncidentsResult] = await db
    .select({ count: count() })
    .from(incidentsTable)
    .where(
      siteFilter
        ? and(eq(incidentsTable.siteId, siteFilter), eq(incidentsTable.status, "open"))
        : eq(incidentsTable.status, "open")
    );

  const [criticalIncidentsResult] = await db
    .select({ count: count() })
    .from(incidentsTable)
    .where(
      siteFilter
        ? and(eq(incidentsTable.siteId, siteFilter), eq(incidentsTable.severity, "critical"))
        : eq(incidentsTable.severity, "critical")
    );

  const [totalHazardsResult] = await db
    .select({ count: count() })
    .from(hazardsTable)
    .where(siteFilter ? eq(hazardsTable.siteId, siteFilter) : undefined);

  const [openHazardsResult] = await db
    .select({ count: count() })
    .from(hazardsTable)
    .where(
      siteFilter
        ? and(eq(hazardsTable.siteId, siteFilter), eq(hazardsTable.status, "open"))
        : eq(hazardsTable.status, "open")
    );

  const [extremeHazardsResult] = await db
    .select({ count: count() })
    .from(hazardsTable)
    .where(
      siteFilter
        ? and(eq(hazardsTable.siteId, siteFilter), eq(hazardsTable.riskLevel, "extreme"))
        : eq(hazardsTable.riskLevel, "extreme")
    );

  const [totalNearMissesResult] = await db
    .select({ count: count() })
    .from(nearMissesTable)
    .where(siteFilter ? eq(nearMissesTable.siteId, siteFilter) : undefined);

  const recentIncidents = await db
    .select()
    .from(incidentsTable)
    .where(siteFilter ? eq(incidentsTable.siteId, siteFilter) : undefined)
    .orderBy(desc(incidentsTable.createdAt))
    .limit(5);

  const recentHazards = await db
    .select()
    .from(hazardsTable)
    .where(siteFilter ? eq(hazardsTable.siteId, siteFilter) : undefined)
    .orderBy(desc(hazardsTable.createdAt))
    .limit(5);

  const siteNames = await db.select().from(sitesTable);
  const siteMap = new Map(siteNames.map(s => [s.id, s.name]));

  const enrichedIncidents = recentIncidents.map(i => ({
    ...i,
    siteName: siteMap.get(i.siteId) ?? "Unknown",
    dateOccurred: i.dateOccurred.toISOString(),
    createdAt: i.createdAt.toISOString(),
  }));

  const enrichedHazards = recentHazards.map(h => ({
    ...h,
    siteName: siteMap.get(h.siteId) ?? "Unknown",
    createdAt: h.createdAt.toISOString(),
  }));

  res.json({
    totalIncidents: totalIncidentsResult?.count ?? 0,
    openIncidents: openIncidentsResult?.count ?? 0,
    criticalIncidents: criticalIncidentsResult?.count ?? 0,
    totalHazards: totalHazardsResult?.count ?? 0,
    openHazards: openHazardsResult?.count ?? 0,
    extremeRiskHazards: extremeHazardsResult?.count ?? 0,
    totalNearMisses: totalNearMissesResult?.count ?? 0,
    recentIncidents: enrichedIncidents,
    recentHazards: enrichedHazards,
  });
});

export default router;
