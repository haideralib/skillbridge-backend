import asyncHandler from "express-async-handler";
import { AppError } from "../utils/App.util";
import { StatusCodes } from "../constants/statusCodes.constant";
import User from "../models/user.model";
import Candidate from "../models/candidate.model";
import Resume from "../models/resume.model";
import type { IBaseResponse } from "../interfaces/base.interface";
import type { IResume } from "../interfaces/resume.interface";

export const uploadResume = asyncHandler(async (req, res) => {
    const userId = req.user?.id;

    if (!userId) throw new AppError("Unauthorized", StatusCodes.UNAUTHORIZED);
    if (!req.file) throw new AppError("No file uploaded", StatusCodes.BAD_REQUEST);

    const user = await User.findById(userId);
    if (!user) throw new AppError("User not found", StatusCodes.NOT_FOUND);
    if (user.role !== "candidate") throw new AppError("Only candidates can upload resumes", StatusCodes.FORBIDDEN);

    const candidate = await Candidate.findOne({ user: userId });
    if (!candidate) throw new AppError("Candidate profile not found", StatusCodes.NOT_FOUND);

    const resume = await Resume.create({
        candidate: candidate._id,
        filename: req.file.originalname,
        url: req.file.path,
        filesize: req.file.size,
        filetype: req.file.mimetype,
    });

    const baseResponse: IBaseResponse<void> = {
        status: StatusCodes.CREATED,
        data: undefined,
        message: "Resume uploaded successfully",
    };

    res.status(baseResponse.status).json(baseResponse);
});


export const getResume = asyncHandler(async (req, res) => {
    const userId = req.user?.id;

    if (!userId) throw new AppError("Unauthorized", StatusCodes.UNAUTHORIZED);

    const user = await User.findById(userId);
    if (!user) throw new AppError("User not found", StatusCodes.NOT_FOUND);
    if (user.role !== "candidate") throw new AppError("Only candidates can retrieve resumes", StatusCodes.FORBIDDEN);

    const candidate = await Candidate.findOne({ user: userId });
    if (!candidate) throw new AppError("Candidate profile not found", StatusCodes.NOT_FOUND);

    const resume = await Resume.findOne({ candidate: candidate._id });
    if (!resume) throw new AppError("Resume not found", StatusCodes.NOT_FOUND);

    const resumeData: IResume = {
        url: resume.url,
        filename: resume.filename,
        filesize: resume.filesize,
        filetype: resume.filetype,
    };

    const baseResponse: IBaseResponse<IResume> = {
        status: StatusCodes.OK,
        data: resumeData,
        message: "Resume retrieved successfully",
    };

    res.status(baseResponse.status).json(baseResponse);
});
