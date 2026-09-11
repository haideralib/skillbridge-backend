import type { IPayload } from "../interfaces/payload.interface";

declare global {
  namespace Express {
    interface Request {
      user?: IPayload;
    }
  }
}

export {};