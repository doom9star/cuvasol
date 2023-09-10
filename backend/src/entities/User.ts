import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
} from "typeorm";
import bcrypt from "bcryptjs";
import Base from "./Base";
import File from "./File";
import { UserType } from "../lib/types/model";
import Report from "./Report";
import Employee from "./Employee";

@Entity("user")
export default class User extends Base {
  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @OneToOne(() => File, { cascade: true, nullable: true })
  @JoinColumn()
  avatar: File;

  @Column({ type: "enum", enum: UserType, default: UserType.EMPLOYEE })
  type: UserType;

  @Column()
  location: string;

  @Column()
  phoneNumber: string;

  @Column("datetime")
  birthDate: Date;

  @Column({ nullable: true })
  linkedinURL: string;

  @Column({ nullable: true })
  githubURL: string;

  @Column({ default: false })
  activated: boolean;

  @OneToMany(() => Report, (report) => report.user, { cascade: true })
  reports: Report[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  async checkPassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }

  employee?: Employee;
}
