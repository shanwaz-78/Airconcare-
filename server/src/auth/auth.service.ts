import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  InternalServerErrorException,
  Res,
  Req,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { User } from '../user/entities/user.entity';
import { JWT } from './common/jwt.util';

declare module 'express' {
  interface Request {
    user?: {
      sub: string;
      email: string;
      role: string;
    };
  }
}

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtUtils: JWT,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  async register(registerDto: RegisterDto): Promise<{
    message: string;
    user: Omit<User, 'password' | 'contracts'>;
  }> {
    try {
      const existingUser = await this.userService.findOneByEmail(
        registerDto.email,
      );
      if (existingUser) {
        throw new ConflictException(
          `Email ${registerDto.email} already in use. Please try with another email.`,
        );
      }

      const saltRounds = parseInt(process.env.SALT_OF_ROUNDS || '10', 10);
      const hashedPassword = await bcrypt.hash(
        registerDto.password,
        saltRounds,
      );

      const newUser = await this.userService.create({
        ...registerDto,
        password: hashedPassword,
      });

      return {
        message: 'Registration successful',
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
        },
      };
    } catch (err) {
      console.error(`[Error]: Registration failed. ${err}`);
      if (err instanceof ConflictException) throw err;
      throw new InternalServerErrorException('Registration failed');
    }
  }

  async login(
    loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ message: string; user: Omit<User, 'password' | 'email'> }> {
    try {
      const user = await this.validateUser(loginDto.email, loginDto.password);

      const payload = { sub: user.id, email: user.email, role: user.role };
      const token = this.jwtUtils.generateToken(payload);

      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: parseInt(process.env.TOKEN_LIMIT || '', 10),
        sameSite: 'lax',
      });

      return {
        message: 'Login successful',
        user: {
          id: user.id,
          name: user.name,
          role: user.role,
          contracts: user.contracts || [],
        },
      };
    } catch (err) {
      console.error(`[Error]: Login failed. ${err}`);
      if (err instanceof UnauthorizedException) throw err;
      throw new InternalServerErrorException(`Login failed. ${err}`);
    }
  }
}
