import {
  Controller,
  Post,
  Body,
  Res,
  Get,
  UseGuards,
  Req,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { Response, Request } from "express";
import { User as CurrentUser, DecodedUser } from "./decorators/user.decorator";
import { User } from "src/user/entities/user.entity";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("register")
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post("login")
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response
  ) {
    const user = await this.authService.login(dto, res);
    return user;
  }

  @Get("me")
  me(@CurrentUser() decodedUser: DecodedUser) {
    return {
      message: "Active session",
      user: decodedUser.sub,
      role: decodedUser.role,
    };
  }

  @Post("logout")
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie("token", { maxAge: 0 });
    return { message: "Logged out" };
  }
}
