import { z } from "zod";

const locationValidation = z.object({
    latitude: z.number().min(-90).max(90).optional(),
    longitude: z.number().min(-180).max(180).optional(),
    city: z.string().trim().min(1).max(100),
    address: z.string().trim().min(1).max(250),
});

const salaryValidation = z.object({
    min: z.number().min(0).optional(),
    max: z.number().min(0).optional(),
    currency: z.string().trim().min(1).max(10).default("PKR"),
}).refine(({ min, max }) => min === undefined || max === undefined || min <= max, {
    message: "Minimum salary cannot be greater than maximum salary",
    path: ["max"],
});

export const CreateJobValidation = z.object({
    title: z.string().trim().min(2).max(150),
    description: z.string().trim().min(10).max(5000),
    location: locationValidation,
    jobType: z.enum(["Full-time", "Part-time", "Contract", "Internship"]),
    workplace: z.enum(["On-site", "Hybrid", "Remote"]),
    salary: salaryValidation.optional(),
    skills: z.array(z.string().trim().min(1).max(80)).default([]),
    experienceLevel: z.enum(["Entry-level", "Mid-level", "Senior-level"]),
    experienceYears: z.number().min(0).default(0),
    education: z.string().trim().max(200).optional(),
    responsibilities: z.array(z.string().trim().min(1).max(500)).default([]),
    requirements: z.array(z.string().trim().min(1).max(500)).default([]),
    benefits: z.array(z.string().trim().min(1).max(300)).default([]),
    applicationDeadline: z.coerce.date().optional(),
    vacancies: z.number().int().min(1).default(1),
    status: z.enum(["draft", "active", "closed"]).default("active"),
});