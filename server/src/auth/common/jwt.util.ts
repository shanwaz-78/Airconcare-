import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export interface JWTPayload {
  sub: string;
  email: string;
  role: string;
}

@Injectable()
export class JWT {
  constructor(private readonly jwtService: JwtService) {}

  generateToken(payload: JWTPayload): string {
    const token = this.jwtService.sign(payload);
    return token;
  }
}
