import asyncHandler from "express-async-handler";
import type { Request, Response } from "express";
import Application from "../models/application.model";
import Candidate from "../models/candidate.model";
import Employer from "../models/employer.model";
import { Job } from "../models/job.model";
import { StatusCodes } from "../constants/statusCodes.constant";
import { AppError } from "../utils/App.util";
import type { IBaseResponse } from "../interfaces/base.interface";
import type { IApplication } from "../interfaces/application.interface";

export const applyForJob = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new AppError("Unauthorized", StatusCodes.UNAUTHORIZED);
    const coverLetter = typeof req.body.coverLetter === "string" ? req.body.coverLetter.trim() : "";
    if (coverLetter.length < 20 || coverLetter.length > 5000) {
        throw new AppError("Cover letter must be between 20 and 5,000 characters", StatusCodes.BAD_REQUEST);
    }

    const candidate = await Candidate.findOne({ user: userId }).select("_id");
    if (!candidate) throw new AppError("Candidate profile not found", StatusCodes.NOT_FOUND);

    const job = await Job.findOne({ _id: req.params.id, status: "active" }).select("_id applicationDeadline");
    if (!job) throw new AppError("Active job not found", StatusCodes.NOT_FOUND);
    if (job.applicationDeadline && job.applicationDeadline < new Date()) {
        throw new AppError("The application deadline has passed", StatusCodes.BAD_REQUEST);
    }

    const existingApplication = await Application.exists({ job: job._id, candidate: candidate._id });
    if (existingApplication) throw new AppError("You have already applied for this job", StatusCodes.CONFLICT);

    const application = await Application.create({ job: job._id, candidate: candidate._id, coverLetter });
    const response: IBaseResponse<IApplication> = {
        status: StatusCodes.CREATED,
        message: "Application submitted successfully",
        data: application.toObject() as unknown as IApplication,
    };

    res.status(StatusCodes.CREATED).json(response);
});

export const getReceivedApplications = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new AppError("Unauthorized", StatusCodes.UNAUTHORIZED);

    const employer = await Employer.findOne({ user: userId }).select("_id");
    if (!employer) throw new AppError("Employer profile not found", StatusCodes.NOT_FOUND);

    const jobs = await Job.find({ employer: employer._id }).select("_id title");
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 10));
    const skip = (page - 1) * limit;
    const sortBy = req.query.sortBy === "status" ? "status" : "createdAt";
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;
    const applicationQuery = { job: { $in: jobs.map((job) => job._id) } };
    const [applications, total] = await Promise.all([
        Application.find(applicationQuery)
        .populate("job", "title")
        .populate({
            path: "candidate",
            select: "skills experience bio user",
            populate: { path: "user", select: "name email" },
        })
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(limit),
        Application.countDocuments(applicationQuery),
    ]);

    const response: IBaseResponse<{
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        data: IApplication[];
    }> = {
        status: StatusCodes.OK,
        message: "Applications retrieved successfully",
        data: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
            data: applications.map((application) => application.toObject() as unknown as IApplication),
        },
    };

    res.status(StatusCodes.OK).json(response);
});

export const getReceivedApplicationById = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new AppError("Unauthorized", StatusCodes.UNAUTHORIZED);

    const employer = await Employer.findOne({ user: userId }).select("_id");
    if (!employer) throw new AppError("Employer profile not found", StatusCodes.NOT_FOUND);

    const jobs = await Job.find({ employer: employer._id }).select("_id");
    const application = await Application.findOne({
        _id: req.params.id,
        job: { $in: jobs.map((job) => job._id) },
    })
        .populate("job", "title description location workplace jobType")
        .populate({
            path: "candidate",
            select: "skills experience bio user",
            populate: { path: "user", select: "name email" },
        });

    if (!application) throw new AppError("Application not found", StatusCodes.NOT_FOUND);

    const response: IBaseResponse<IApplication> = {
        status: StatusCodes.OK,
        message: "Application retrieved successfully",
        data: application.toObject() as unknown as IApplication,
    };

    res.status(StatusCodes.OK).json(response);
});