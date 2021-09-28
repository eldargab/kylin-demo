import {MigrationInterface, QueryRunner} from "typeorm";

export class AddLiquidity1632818988245 implements MigrationInterface {
    name = 'AddLiquidity1632818988245'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "liquidity_change" ("id" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by_id" character varying NOT NULL, "updated_at" TIMESTAMP DEFAULT now(), "updated_by_id" character varying, "deleted_at" TIMESTAMP, "deleted_by_id" character varying, "version" integer NOT NULL, "timestamp" numeric NOT NULL, "block_number" numeric NOT NULL, "event_idx" numeric NOT NULL, "currency_zero" character varying NOT NULL, "balance_zero" numeric NOT NULL, "currency_one" character varying NOT NULL, "balance_one" numeric NOT NULL, "liquidity" numeric NOT NULL, CONSTRAINT "PK_470573b79a4d135580c7e7c8179" PRIMARY KEY ("id"))`);
        await queryRunner.query(`create index liquidity_change__pair__idx on liquidity_change (currency_zero, currency_one)`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`drop index liquidity_change__pair__idx`)
        await queryRunner.query(`DROP TABLE "liquidity_change"`);
    }

}
