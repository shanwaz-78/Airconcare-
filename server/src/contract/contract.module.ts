import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Contract } from "./entities/contract.entity";
import { ContractService } from "./contract.service";
import { ContractController } from "./contract.controller";
import { User } from "../user/entities/user.entity";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { UserService } from "src/user/user.service";
import { JWT } from "src/auth/common/jwt.util";
import { AuthMiddleware } from "src/auth/guards/auth.guard";

@Module({
  imports: [
    TypeOrmModule.forFeature([Contract, User]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>("JWT_SECRET"),
        signOptions: { expiresIn: configService.get<string>("TOKEN_EXPIRY") },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [ContractController],
  providers: [ContractService, UserService, JWT],
})
export class ContractModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(ContractController);
  }
}
