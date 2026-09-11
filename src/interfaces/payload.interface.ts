

export type UserRole = "candidate" | "employer" | "admin";

export interface IPayload {
    id: string;
    email: string;
    role: UserRole;
}