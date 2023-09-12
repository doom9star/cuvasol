import { MigrationInterface, QueryRunner } from "typeorm";

export class PermAdmin1694520302274 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
            INSERT INTO users_groups (userId, groupId) VALUES
            ("RWSD8qJXzlezRIvA06MxzOw74WYh09B2", "2PmWfoDzw4bNb3dn0kTnXO075I64WIIF");
            `
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM users_groups;`);
  }
}
