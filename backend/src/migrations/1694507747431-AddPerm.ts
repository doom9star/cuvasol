import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPerm1694507747431 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
            INSERT INTO permission (id, name, description) VALUES
            ("gJ7Rf72xFtACkTrRUplZ02BdiLxehPXd", "MANAGE_ALL", "can manage all"),
            ("B2GI8txVRJg12JEGDNgNaxlhHI41uQep", "MANAGE_CLIENT", "can manage clients"),
            ("CGjmzKyit4eUA1tQqMdW93msggh8G3as", "MANAGE_EMPLOYEE", "can manage employees"),
            ("MRUnjeF7K16V2ThnWlFNVLKEn2KthH9i", "MANAGE_CONSULTANT", "can manage only consultants"),
            ("lRUzBuds8WPSKWARHoXLp74F8pTabiig", "MANAGE_INTERN", "can manage only interns"),
            ("F2sw171L7dnRcRapioaZRjMioAzWsXDZ", "MANAGE_REPORT", "can manage reports"),
            ("W9WUKj1WdO3AMty38byrzyi9Ciwkqu47", "CREATE_REPORT", "can create reports");
            `
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM permission;`);
  }
}
