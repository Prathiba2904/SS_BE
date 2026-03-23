import { Router } from "express";
import { fetchSonarIssues, listNotifications } from "../controller/sonar.controller";

const router = Router();

router.post("/fetch-sonar-issues", fetchSonarIssues);
router.get("/notifications", listNotifications);

export default router;
