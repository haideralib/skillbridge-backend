export interface IJobLocation {
    latitude?: number;
    longitude?: number;
    city: string;
    address: string;
}

export interface IJobSalary {
    min?: number;
    max?: number;
    currency: string;
}

export interface IJobEmployer {
    _id: string;
    company: string;
    industry?: string;
}

export interface IJob {
    _id: string;
    title: string;
    description: string;
    employer: string | IJobEmployer;
    location: IJobLocation;
    jobType: "Full-time" | "Part-time" | "Contract" | "Internship";
    workplace: "On-site" | "Hybrid" | "Remote";
    salary?: IJobSalary;
    skills: string[];
    experienceLevel: "Entry-level" | "Mid-level" | "Senior-level";
    experienceYears: number;
    education?: string;
    responsibilities: string[];
    requirements: string[];
    benefits: string[];
    applicationDeadline?: string | Date;
    vacancies: number;
    status: "draft" | "active" | "closed";
    createdAt: string | Date;
    updatedAt: string | Date;
    applicationsCount?: number;
}