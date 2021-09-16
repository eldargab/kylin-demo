import {MigrationInterface, QueryRunner} from "typeorm";

export class TimestampIndex1631760776168 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('create index swap__timestamp_idx on swap (timestamp)')
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('drop index swap__timestamp_idx')
    }

}
