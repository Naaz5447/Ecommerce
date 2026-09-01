import { PublicUser } from "../modules/auth/auth.repository";

declare global {
  namespace Express {
    interface Request {
      user?: PublicUser;
    }
  }
}

export { };
