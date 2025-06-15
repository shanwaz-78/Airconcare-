import { MigrationInterface, QueryRunner } from "typeorm";

export class NewTables1750003631049 implements MigrationInterface {
    name = 'NewTables1750003631049'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."user_status_enum" AS ENUM('Quote Requested', 'Quote Sent', 'Accepted by Client', 'Payment Completed', 'Service Scheduled', 'In Progress', 'Completed')`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "clientId" uuid NOT NULL, "status" "public"."user_status_enum" NOT NULL DEFAULT 'Quote Requested', "acType" character varying(100) NOT NULL, "unitCount" integer NOT NULL, "address" character varying(255) NOT NULL, "preferredDate" TIMESTAMP NOT NULL, "serviceDate" TIMESTAMP, "quoteAmount" numeric(10,2), "notes" text array NOT NULL DEFAULT '{}', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")); COMMENT ON COLUMN "user"."acType" IS 'Type of AC unit (e.g. Split, Window, Central)'; COMMENT ON COLUMN "user"."unitCount" IS 'Number of AC units to be serviced'; COMMENT ON COLUMN "user"."address" IS 'Full address where the service will take place'; COMMENT ON COLUMN "user"."preferredDate" IS 'Preferred date for the service by the client'; COMMENT ON COLUMN "user"."serviceDate" IS 'Actual service date assigned by technician'; COMMENT ON COLUMN "user"."quoteAmount" IS 'Quoted amount in INR'; COMMENT ON COLUMN "user"."notes" IS 'Internal notes or updates from team'`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "clientId"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "status"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "acType"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "unitCount"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "address"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "preferredDate"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "serviceDate"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "quoteAmount"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "notes"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "clientId" uuid NOT NULL`);
        await queryRunner.query(`CREATE TYPE "public"."user_status_enum" AS ENUM('Quote Requested', 'Quote Sent', 'Accepted by Client', 'Payment Completed', 'Service Scheduled', 'In Progress', 'Completed')`);
        await queryRunner.query(`ALTER TABLE "user" ADD "status" "public"."user_status_enum" NOT NULL DEFAULT 'Quote Requested'`);
        await queryRunner.query(`ALTER TABLE "user" ADD "acType" character varying(100) NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "user"."acType" IS 'Type of AC unit (e.g. Split, Window, Central)'`);
        await queryRunner.query(`ALTER TABLE "user" ADD "unitCount" integer NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "user"."unitCount" IS 'Number of AC units to be serviced'`);
        await queryRunner.query(`ALTER TABLE "user" ADD "address" character varying(255) NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "user"."address" IS 'Full address where the service will take place'`);
        await queryRunner.query(`ALTER TABLE "user" ADD "preferredDate" TIMESTAMP NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "user"."preferredDate" IS 'Preferred date for the service by the client'`);
        await queryRunner.query(`ALTER TABLE "user" ADD "serviceDate" TIMESTAMP`);
        await queryRunner.query(`COMMENT ON COLUMN "user"."serviceDate" IS 'Actual service date assigned by technician'`);
        await queryRunner.query(`ALTER TABLE "user" ADD "quoteAmount" numeric(10,2)`);
        await queryRunner.query(`COMMENT ON COLUMN "user"."quoteAmount" IS 'Quoted amount in INR'`);
        await queryRunner.query(`ALTER TABLE "user" ADD "notes" text array NOT NULL DEFAULT '{}'`);
        await queryRunner.query(`COMMENT ON COLUMN "user"."notes" IS 'Internal notes or updates from team'`);
        await queryRunner.query(`ALTER TABLE "user" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "user" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "user" ADD "name" character varying(15) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD "email" character varying(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email")`);
        await queryRunner.query(`ALTER TABLE "user" ADD "password" character varying(60) NOT NULL`);
        await queryRunner.query(`CREATE TYPE "public"."user_role_enum" AS ENUM('client', 'admin')`);
        await queryRunner.query(`ALTER TABLE "user" ADD "role" "public"."user_role_enum" NOT NULL DEFAULT 'client'`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_56f28841fe433cf13f8685f9bc1" FOREIGN KEY ("clientId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_56f28841fe433cf13f8685f9bc1"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "role"`);
        await queryRunner.query(`DROP TYPE "public"."user_role_enum"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "password"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "email"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "createdAt"`);
        await queryRunner.query(`COMMENT ON COLUMN "user"."notes" IS 'Internal notes or updates from team'`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "notes"`);
        await queryRunner.query(`COMMENT ON COLUMN "user"."quoteAmount" IS 'Quoted amount in INR'`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "quoteAmount"`);
        await queryRunner.query(`COMMENT ON COLUMN "user"."serviceDate" IS 'Actual service date assigned by technician'`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "serviceDate"`);
        await queryRunner.query(`COMMENT ON COLUMN "user"."preferredDate" IS 'Preferred date for the service by the client'`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "preferredDate"`);
        await queryRunner.query(`COMMENT ON COLUMN "user"."address" IS 'Full address where the service will take place'`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "address"`);
        await queryRunner.query(`COMMENT ON COLUMN "user"."unitCount" IS 'Number of AC units to be serviced'`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "unitCount"`);
        await queryRunner.query(`COMMENT ON COLUMN "user"."acType" IS 'Type of AC unit (e.g. Split, Window, Central)'`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "acType"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."user_status_enum"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "clientId"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "user" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "user" ADD "notes" text array NOT NULL DEFAULT '{}'`);
        await queryRunner.query(`ALTER TABLE "user" ADD "quoteAmount" numeric(10,2)`);
        await queryRunner.query(`ALTER TABLE "user" ADD "serviceDate" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "user" ADD "preferredDate" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD "address" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD "unitCount" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD "acType" character varying(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD "status" "public"."user_status_enum" NOT NULL DEFAULT 'Quote Requested'`);
        await queryRunner.query(`ALTER TABLE "user" ADD "clientId" uuid NOT NULL`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TYPE "public"."user_status_enum"`);
    }

}
