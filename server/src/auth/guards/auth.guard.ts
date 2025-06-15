import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request, Response, NextFunction } from "express";

declare module "express" {
  interface Request {
    user?: { sub: string; email: string; role: string };
  }
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly jwt: JwtService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const token =
      req.cookies?.token ||
      (req.headers.authorization
        ? req.headers.authorization.split(" ")[1]
        : undefined);

    if (!token) throw new UnauthorizedException("No token provided");

    try {
      const payload = this.jwt.verify(token, {
        secret: process.env.JWT_SECRET,
      });

      req.user = payload;
      next();
    } catch {
      throw new UnauthorizedException("Invalid or expired token");
    }
  }
}
