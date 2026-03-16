import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { sitesTable } from "./sites";

export const hazardsTable = pgTable("hazards", {
  id: serial("id").primaryKey(),
  siteId: integer("site_id").notNull().references(() => sitesTable.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  hazardType: text("hazard_type").notNull(),
  likelihood: integer("likelihood").notNull(),
  consequence: integer("consequence").notNull(),
  riskRating: integer("risk_rating").notNull(),
  riskLevel: text("risk_level").notNull(),
  status: text("status").notNull().default("open"),
  location: text("location").notNull(),
  reportedBy: text("reported_by").notNull(),
  controlMeasures: text("control_measures"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertHazardSchema = createInsertSchema(hazardsTable).omit({ id: true, createdAt: true });
export type InsertHazard = z.infer<typeof insertHazardSchema>;
export type Hazard = typeof hazardsTable.$inferSelect;
