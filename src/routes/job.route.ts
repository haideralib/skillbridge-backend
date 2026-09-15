import { Router } from "express";
import { getAllJobs, getEmployerJobs, getJobById, searchJobs, uploadJob } from "../controllers/job.controller";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { AuthorizationMiddleware } from "../middlewares/authorization.middleware";
import { applyForJob, getReceivedApplicationById, getReceivedApplications } from "../controllers/application.controller";

const router = Router();

router.get("/", getAllJobs);
router.get("/search", searchJobs);
router.get("/mine", AuthMiddleware, AuthorizationMiddleware("employer"), getEmployerJobs);
router.get("/applications/received", AuthMiddleware, AuthorizationMiddleware("employer"), getReceivedApplications);
router.get("/applications/:id", AuthMiddleware, AuthorizationMiddleware("employer"), getReceivedApplicationById);
router.post("/:id/applications", AuthMiddleware, AuthorizationMiddleware("candidate"), applyForJob);
router.get("/:id", getJobById);
router.post("/", AuthMiddleware, AuthorizationMiddleware("employer"), uploadJob);

export default router;