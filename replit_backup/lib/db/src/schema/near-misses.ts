import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { sitesTable } from "./sites";

export const nearMissesTable = pgTable("near_misses", {
  id: serial("id").primaryKey(),
  siteId: integer("site_id").notNull().references(() => sitesTable.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  potentialConsequence: text("potential_consequence").notNull(),
  location: text("location").notNull(),
  reportedBy: text("reported_by").notNull(),
  immediateActions: text("immediate_actions"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertNearMissSchema = createInsertSchema(nearMissesTable).omit({ id: true, createdAt: true });
export type InsertNearMiss = z.infer<typeof insertNearMissSchema>;
export type NearMiss = typeof nearMissesTable.$inferSelect;
