import {MigrationInterface, QueryRunner} from "typeorm";

export class Initial1632917957784 implements MigrationInterface {
    name = 'Initial1632917957784'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "liquidity_change" ("id" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by_id" character varying NOT NULL, "updated_at" TIMESTAMP DEFAULT now(), "updated_by_id" character varying, "deleted_at" TIMESTAMP, "deleted_by_id" character varying, "version" integer NOT NULL, "timestamp" numeric NOT NULL, "block_number" integer NOT NULL, "event_idx" integer NOT NULL, "step" integer NOT NULL, "reason" character varying NOT NULL, "currency_zero" character varying NOT NULL, "amount_zero" numeric NOT NULL, "balance_zero" numeric NOT NULL, "currency_one" character varying NOT NULL, "amount_one" numeric NOT NULL, "balance_one" numeric NOT NULL, CONSTRAINT "PK_470573b79a4d135580c7e7c8179" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "swap" ("id" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by_id" character varying NOT NULL, "updated_at" TIMESTAMP DEFAULT now(), "updated_by_id" character varying, "deleted_at" TIMESTAMP, "deleted_by_id" character varying, "version" integer NOT NULL, "timestamp" numeric NOT NULL, "block_number" integer NOT NULL, "event_idx" integer NOT NULL, "step" integer NOT NULL, "from_currency" character varying NOT NULL, "to_currency" character varying NOT NULL, "from_amount" numeric NOT NULL, "to_amount" numeric NOT NULL, CONSTRAINT "PK_4a10d0f359339acef77e7f986d9" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "swap"`);
        await queryRunner.query(`DROP TABLE "liquidity_change"`);
    }

}
