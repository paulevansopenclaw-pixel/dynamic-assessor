import { Router, type IRouter } from "express";
import healthRouter from "./health";
import sitesRouter from "./sites";
import incidentsRouter from "./incidents";
import hazardsRouter from "./hazards";
import nearMissesRouter from "./near-misses";
import dashboardRouter from "./dashboard";
import guidanceRouter from "./guidance";

const router: IRouter = Router();

router.use(healthRouter);
router.use(sitesRouter);
router.use(incidentsRouter);
router.use(hazardsRouter);
router.use(nearMissesRouter);
router.use(dashboardRouter);
router.use(guidanceRouter);

export default router;
