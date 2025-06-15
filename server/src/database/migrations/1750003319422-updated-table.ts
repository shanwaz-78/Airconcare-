import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatedTable1750003319422 implements MigrationInterface {
    name = 'UpdatedTable1750003319422'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "contract" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "clientId" uuid NOT NULL, "status" "public"."contract_status_enum" NOT NULL DEFAULT 'Quote Requested', "acType" character varying(100) NOT NULL, "unitCount" integer NOT NULL, "address" character varying(255) NOT NULL, "preferredDate" TIMESTAMP NOT NULL, "serviceDate" TIMESTAMP, "quoteAmount" numeric(10,2), "notes" text array NOT NULL DEFAULT '{}', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_17c3a89f58a2997276084e706e8" PRIMARY KEY ("id")); COMMENT ON COLUMN "contract"."acType" IS 'Type of AC unit (e.g. Split, Window, Central)'; COMMENT ON COLUMN "contract"."unitCount" IS 'Number of AC units to be serviced'; COMMENT ON COLUMN "contract"."address" IS 'Full address where the service will take place'; COMMENT ON COLUMN "contract"."preferredDate" IS 'Preferred date for the service by the client'; COMMENT ON COLUMN "contract"."serviceDate" IS 'Actual service date assigned by technician'; COMMENT ON COLUMN "contract"."quoteAmount" IS 'Quoted amount in INR'; COMMENT ON COLUMN "contract"."notes" IS 'Internal notes or updates from team'`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(15) NOT NULL, "email" character varying(100) NOT NULL, "password" character varying(60) NOT NULL, "role" "public"."user_role_enum" NOT NULL DEFAULT 'client', CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "contract" ADD CONSTRAINT "FK_549fe94002a48f41e53ae210830" FOREIGN KEY ("clientId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contract" DROP CONSTRAINT "FK_549fe94002a48f41e53ae210830"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "contract"`);
    }

}
