import {MigrationInterface, QueryRunner} from "typeorm";

export class Indexes1632918019103 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`create index swap__block_idx on swap(block_number, event_idx)`)
        await queryRunner.query(`create index swap__timestamp_idx on swap("timestamp")`)
        await queryRunner.query(`create index liquidity_change__block_idx on liquidity_change(block_number, event_idx)`)
        await queryRunner.query(`create index liquidity_change__timestamp_idx on liquidity_change("timestamp")`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`drop index swap__block_idx`)
        await queryRunner.query(`drop index swap__timestamp_idx`)
        await queryRunner.query(`drop index liquidity_change__block_idx`)
        await queryRunner.query(`drop index liquidity_change__timestamp_idx`)
    }

}
