import asyncHandler from "express-async-handler";
import type { Request, Response } from "express";
import { Job } from "../models/job.model";
import Employer from "../models/employer.model";
import { CreateJobValidation } from "../validations/job.validation";
import { StatusCodes } from "../constants/statusCodes.constant";
import { AppError } from "../utils/App.util";
import type { IBaseResponse } from "../interfaces/base.interface";
import type { Pagination } from "../interfaces/pagination.interface";
import type { IJob } from "../interfaces/job.interface";

export const uploadJob = asyncHandler(async (req: Request, res: Response) => {
    const result = CreateJobValidation.safeParse(req.body);

    if (!result.success) {
        throw new AppError(result.error.issues[0]?.message ?? "Invalid job data", StatusCodes.BAD_REQUEST);
    }

    const userId = req.user?.id;
    if (!userId) throw new AppError("Unauthorized", StatusCodes.UNAUTHORIZED);

    const employer = await Employer.findOne({ user: userId }).select("_id");
    if (!employer) throw new AppError("Employer profile not found", StatusCodes.NOT_FOUND);

    const { salary, education, applicationDeadline, location, ...jobData } = result.data;
    const normalizedLocation = {
        city: location.city,
        address: location.address,
        ...(location.latitude === undefined ? {} : { latitude: location.latitude }),
        ...(location.longitude === undefined ? {} : { longitude: location.longitude }),
    };
    const normalizedSalary = salary === undefined ? undefined : {
        currency: salary.currency,
        ...(salary.min === undefined ? {} : { min: salary.min }),
        ...(salary.max === undefined ? {} : { max: salary.max }),
    };
    const job = await Job.create({
        ...jobData,
        location: normalizedLocation,
        employer: employer._id,
        ...(normalizedSalary === undefined ? {} : { salary: normalizedSalary }),
        ...(education === undefined ? {} : { education }),
        ...(applicationDeadline === undefined ? {} : { applicationDeadline }),
    });
    const response: IBaseResponse<IJob> = {
        status: StatusCodes.CREATED,
        message: "Job created successfully",
      data: job.toObject() as unknown as IJob,
    };

    res.status(StatusCodes.CREATED).json(response);
});

export const getAllJobs = asyncHandler(async (_req: Request, res: Response) => {
    const jobs = await Job.find({ status: { $ne: "closed" } })
        .populate("employer", "company industry")
        .sort({ createdAt: -1 });

    const response: IBaseResponse<IJob[]> = {
        status: StatusCodes.OK,
        message: "Jobs retrieved successfully",
      data: jobs.map((job) => job.toObject() as unknown as IJob),
    };

    res.status(StatusCodes.OK).json(response);
});

export const getJobById = asyncHandler(async (req: Request, res: Response) => {
    const job = await Job.findById(req.params.id).populate("employer", "company industry");

    if (!job) throw new AppError("Job not found", StatusCodes.NOT_FOUND);

    const response: IBaseResponse<IJob> = {
        status: StatusCodes.OK,
        message: "Job retrieved successfully",
      data: job.toObject() as unknown as IJob,
    };

    res.status(StatusCodes.OK).json(response);
});

export const searchJobs = asyncHandler(async (req: Request, res: Response) => {
  const {
    title,
    location,
    jobType,
    page = 1,
    limit = 10,
  } = req.query;

  const skip = (Number(page) - 1) * Number(limit);

  const query: any = {
    status: { $ne: "closed" },
  };

  if (title) {
    query.title = { $regex: title, $options: "i" };
  }

  if (location) {
    query.$or = [
      { "location.city": { $regex: location, $options: "i" } },
      { "location.address": { $regex: location, $options: "i" } },
    ];
  }

  if (jobType) {
    query.jobType = jobType;
  }

  const [jobs, total] = await Promise.all([
    Job.find(query)
      .populate("employer", "company industry")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),

    Job.countDocuments(query),
  ]);

  const pagination: Pagination<IJob> = {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit)),
      data: jobs.map((job) => job.toObject() as unknown as IJob),
  };

  const response: IBaseResponse<Pagination<IJob>> = {
    status: StatusCodes.OK,
    message: "Jobs retrieved successfully",
    data: pagination,
  };

  res.status(StatusCodes.OK).json(response);
});