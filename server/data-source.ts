import "reflect-metadata";
import { DataSource } from "typeorm";
import { configDotenv } from "dotenv";
import { User } from "./src/user/entities/user.entity";
import { Contract } from "./src/contract/entities/contract.entity";

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
  entities: [User, Contract],
  migrations: ["src/database/migrations/*.ts"],
});

export default AppDataSource;
