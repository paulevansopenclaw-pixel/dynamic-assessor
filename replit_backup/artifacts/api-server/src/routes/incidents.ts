import { Router, type IRouter } from "express";
import { eq, and, desc } from "drizzle-orm";
import { db, incidentsTable, sitesTable } from "@workspace/db";
import {
  CreateIncidentBody,
  GetIncidentParams,
  UpdateIncidentParams,
  UpdateIncidentBody,
  ListIncidentsQueryParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

function getRiskLevel(riskRating: number): string {
  if (riskRating <= 4) return "low";
  if (riskRating <= 9) return "medium";
  if (riskRating <= 16) return "high";
  return "extreme";
}

async function buildIncidentResponse(incident: typeof incidentsTable.$inferSelect) {
  const [site] = await db.select().from(sitesTable).where(eq(sitesTable.id, incident.siteId));
  return {
    ...incident,
    siteName: site?.name ?? "Unknown",
    dateOccurred: incident.dateOccurred.toISOString(),
    createdAt: incident.createdAt.toISOString(),
  };
}

router.get("/incidents", async (req, res): Promise<void> => {
  const query = ListIncidentsQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: query.error.message });
    return;
  }

  const conditions = [];
  if (query.data.siteId !== undefined) conditions.push(eq(incidentsTable.siteId, query.data.siteId));
  if (query.data.status) conditions.push(eq(incidentsTable.status, query.data.status));

  const incidents = await db
    .select()
    .from(incidentsTable)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(incidentsTable.createdAt));

  const result = await Promise.all(incidents.map(buildIncidentResponse));
  res.json(result);
});

router.post("/incidents", async (req, res): Promise<void> => {
  const parsed = CreateIncidentBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [incident] = await db
    .insert(incidentsTable)
    .values({
      ...parsed.data,
      dateOccurred: new Date(parsed.data.dateOccurred),
      status: "open",
    })
    .returning();

  const response = await buildIncidentResponse(incident);
  res.status(201).json(response);
});

router.get("/incidents/:id", async (req, res): Promise<void> => {
  const params = GetIncidentParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [incident] = await db.select().from(incidentsTable).where(eq(incidentsTable.id, params.data.id));
  if (!incident) {
    res.status(404).json({ error: "Incident not found" });
    return;
  }

  const response = await buildIncidentResponse(incident);
  res.json(response);
});

router.patch("/incidents/:id", async (req, res): Promise<void> => {
  const params = UpdateIncidentParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateIncidentBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const updates: Record<string, unknown> = {};
  if (parsed.data.status !== undefined) updates.status = parsed.data.status;
  if (parsed.data.correctiveActions !== undefined) updates.correctiveActions = parsed.data.correctiveActions;

  const [incident] = await db
    .update(incidentsTable)
    .set(updates)
    .where(eq(incidentsTable.id, params.data.id))
    .returning();

  if (!incident) {
    res.status(404).json({ error: "Incident not found" });
    return;
  }

  const response = await buildIncidentResponse(incident);
  res.json(response);
});

export { getRiskLevel };
export default router;
