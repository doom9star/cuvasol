import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
} from "typeorm";
import bcrypt from "bcryptjs";
import Base from "./Base";
import File from "./File";
import Report from "./Report";
import Employee from "./Employee";
import Group from "./Group";

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

  @Column()
  location: string;

  @Column()
  phoneNumber: string;

  @Column("datetime")
  birthDate: Date;

  @Column({ type: "simple-array", nullable: true })
  urls: string[];

  @Column({ default: false })
  activated: boolean;

  @OneToMany(() => Report, (report) => report.user, { cascade: true })
  reports: Report[];

  @ManyToMany(() => Group, (g) => g.members)
  @JoinTable({ name: "users_groups" })
  groups: Group[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  async checkPassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }

  employee?: Employee;
}
