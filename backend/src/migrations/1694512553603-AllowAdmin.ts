import { MigrationInterface, QueryRunner } from "typeorm";

export class AllowAdmin1694512553603 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
            INSERT INTO groups_permissions (groupId, permissionId) VALUES
            ("2PmWfoDzw4bNb3dn0kTnXO075I64WIIF", "gJ7Rf72xFtACkTrRUplZ02BdiLxehPXd");
            `
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM groups_permissions;`);
  }
}
