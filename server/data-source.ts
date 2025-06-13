import "reflect-metadata";
import { DataSource } from "typeorm";
import { configDotenv } from "dotenv";

configDotenv();

const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "5432", 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PSWD,
  database: process.env.DB_NAME,
  synchronize: false,
  logging: true,
  entities: ["src/**/*.entity.ts"],
  migrations: ["src/database/migrations/*.ts"],
});

export default AppDataSource;
