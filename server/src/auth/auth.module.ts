import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../user/entities/user.entity";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { UserService } from "../user/user.service";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JWT } from "./common/jwt.util";
import { AuthMiddleware } from "./guards/auth.guard";

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>("JWT_SECRET"),
        signOptions: { expiresIn: configService.get<string>("TOKEN_EXPIRY") },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, UserService, JWT],
  exports: [AuthService, JwtModule],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes({ path: "auth/me", method: RequestMethod.GET });
  }
}
