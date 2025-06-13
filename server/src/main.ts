import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";
import { ValidationPipe } from "@nestjs/common";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import * as cookieParser from "cookie-parser";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const PORT = app.get(ConfigService).get<string>("APP_PORT");
  app.use(helmet());
  app.use(
    rateLimit({
      windowMs: 24 * 60 * 60 * 1000,
      max: 100,
      standardHeaders: true,
      legacyHeaders: false,
      message: "Too many requests, Please try again later.",
    })
  );
  app.enableCors({ origin: process.env.CORS_ORIGIN, credentials: true });
  app.use(cookieParser());
  app.setGlobalPrefix("/api");
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      enableDebugMessages: true,
    })
  );

  await app.listen(PORT ?? 3000);
}
bootstrap();
