import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import Base from "./Base";
import { EmployeeRole } from "../lib/types/model";
import User from "./User";

@Entity("employee")
export default class Employee extends Base {
  @Column({
    type: "enum",
    enum: EmployeeRole,
  })
  role: EmployeeRole;

  @Column({ default: 0 })
  salary: number;

  @Column("datetime")
  startTime: Date;

  @Column("datetime")
  endTime: Date;

  @Column("datetime")
  joinedAt: Date;

  @Column({ type: "datetime", nullable: true })
  endedAt: Date;

  @Column({ type: "datetime", nullable: true })
  leftAt: Date;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;
}
