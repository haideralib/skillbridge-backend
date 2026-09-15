export type ApplicationStatus = "pending" | "reviewed" | "rejected" | "accepted";

export interface IApplicationJob {
    _id: string;
    title: string;
}

export interface IApplicationCandidateUser {
    _id: string;
    name: string;
    email: string;
}

export interface IApplicationCandidate {
    _id: string;
    skills: string[];
    experience: number;
    bio: string;
    user: IApplicationCandidateUser;
}

export interface IApplication {
    _id: string;
    job: string | IApplicationJob;
    candidate: string | IApplicationCandidate;
    coverLetter: string;
    status: ApplicationStatus;
    createdAt: string | Date;
    updatedAt: string | Date;
}