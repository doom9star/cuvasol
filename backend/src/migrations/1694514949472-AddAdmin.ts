import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAdmin1694514949472 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
            INSERT INTO user (id, name, email, password, designation, location, phoneNumber, birthDate, activated) 
            VALUES ("RWSD8qJXzlezRIvA06MxzOw74WYh09B2", "admin", "admin@gmail.com", "$2y$10$oBarxynZoKs2wwGHdy1OJ.NJRwtQGZog8Dj5LUiOBGSo5rJyKPoZm", "Site Administrator", "Bangalore, India", "9928485910", "2002-06-29 14:54:07.967467", 1);
            `
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM user where id="RWSD8qJXzlezRIvA06MxzOw74WYh09B2";`
    );
  }
}
