import { MigrationInterface, QueryRunner } from "typeorm";

export class UserTable1749789207130 implements MigrationInterface {
  name = "UserTable1749789207130";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "name"`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD "name" character varying(15) NOT NULL`
    );

    await queryRunner.query(`
      DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role_enum') THEN
          CREATE TYPE "user_role_enum" AS ENUM ('ADMIN', 'CLIENT');
        END IF;
      END $$;
    `);

    await queryRunner.query(`
      ALTER TABLE "user"
      ADD COLUMN IF NOT EXISTS "email" character varying(100) NOT NULL,
      ADD COLUMN IF NOT EXISTS "password" character varying(60) NOT NULL,
      ADD COLUMN IF NOT EXISTS "role" "user_role_enum" NOT NULL DEFAULT 'CLIENT'
    `);

    await queryRunner.query(`
      DO $$ BEGIN
        IF NOT EXISTS (
          SELECT constraint_name FROM information_schema.table_constraints
          WHERE table_name = 'user' AND constraint_type = 'UNIQUE' AND constraint_name = 'UQ_user_email'
        ) THEN
          ALTER TABLE "user" ADD CONSTRAINT "UQ_user_email" UNIQUE ("email");
        END IF;
      END $$;
    `);

    await queryRunner.query(`
      DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'contract_status_enum') THEN
          CREATE TYPE "contract_status_enum" AS ENUM (
            'QUOTE_REQUESTED',
            'QUOTE_SENT',
            'ACCEPTED_BY_CLIENT',
            'PAYMENT_COMPLETED',
            'SERVICE_SCHEDULED',
            'IN_PROGRESS',
            'COMPLETED',
            'CANCELLED'
          );
        END IF;
      END $$;
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "contract" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "clientId" uuid NOT NULL,
        "status" "contract_status_enum" NOT NULL DEFAULT 'QUOTE_REQUESTED',
        "acType" character varying(100) NOT NULL,
        "unitCount" integer NOT NULL,
        "address" character varying(255) NOT NULL,
        "preferredDate" TIMESTAMP NOT NULL,
        "serviceDate" TIMESTAMP,
        "quoteAmount" decimal(10,2),
        "notes" text[] DEFAULT '{}',
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_contract_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_contract_client" FOREIGN KEY ("clientId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "contract"`);

    await queryRunner.query(`DROP TYPE IF EXISTS "contract_status_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "user_role_enum"`);

    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN IF EXISTS "role"`);
    await queryRunner.query(
      `ALTER TABLE "user" DROP COLUMN IF EXISTS "password"`
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN IF EXISTS "email"`);
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT IF EXISTS "UQ_user_email"`
    );

    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "name"`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD "name" character varying(20) NOT NULL`
    );
  }
}
