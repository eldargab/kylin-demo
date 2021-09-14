import {MigrationInterface, QueryRunner} from "typeorm";

export class Initial1631605571250 implements MigrationInterface {
    name = 'Initial1631605571250'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "swap" ("id" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by_id" character varying NOT NULL, "updated_at" TIMESTAMP DEFAULT now(), "updated_by_id" character varying, "deleted_at" TIMESTAMP, "deleted_by_id" character varying, "version" integer NOT NULL, "timestamp" numeric NOT NULL, "from_currency" character varying NOT NULL, "to_currency" character varying NOT NULL, "from_amount" numeric NOT NULL, "to_amount" numeric NOT NULL, CONSTRAINT "PK_4a10d0f359339acef77e7f986d9" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "swap"`);
    }

}
