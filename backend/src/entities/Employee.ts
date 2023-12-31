import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import Base from "./Base";
import { EmployeeType } from "../lib/types/model";
import User from "./User";
import Report from "./Report";

@Entity("employee")
export default class Employee extends Base {
  @Column({
    type: "enum",
    enum: EmployeeType,
  })
  type: EmployeeType;

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

  report?: Report;
}
