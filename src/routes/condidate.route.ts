import {Router} from "express";
import { uploadResume } from "../utils/cloudnary.util";
import { getResume, uploadResume as uploadResumeController } from "../controllers/condidate.controller";
import { AuthMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.post("/upload-resume", AuthMiddleware, uploadResume.single("resume"), uploadResumeController);
router.get("/get-resume", AuthMiddleware, getResume);


export default router;