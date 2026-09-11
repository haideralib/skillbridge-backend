import { Router } from "express";
import { getAllJobs, getJobById, searchJobs, uploadJob } from "../controllers/job.controller";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { AuthorizationMiddleware } from "../middlewares/authorization.middleware";

const router = Router();

router.get("/", getAllJobs);
router.get("/search", searchJobs);
router.get("/:id", getJobById);
router.post("/", AuthMiddleware, AuthorizationMiddleware("employer"), uploadJob);

export default router;