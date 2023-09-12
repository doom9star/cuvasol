import { MigrationInterface, QueryRunner } from "typeorm";

export class AddGrp1694507939389 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
            INSERT INTO \`group\` (id, name) VALUES
            ("2PmWfoDzw4bNb3dn0kTnXO075I64WIIF", "ADMIN"),
            ("KTu0xx55HraNLiuTamgBahNCkf0Zbng4", "MANAGER"),
            ("RLRVpLkuVfKPhk3H8lOXAogAcmmUuSux", "CLIENT"),
            ("RLRVpLkuVfKPhk3H8lOXAogAcmuaywiq", "EMPLOYEE");            
            `
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM \`group\`;`);
  }
}
