import { PublicUser } from "../repositories/user.repository";

declare global {
  namespace Express {
    interface Request {
      user?: PublicUser;
    }
  }
}

export {};
