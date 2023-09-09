import { Column, Entity } from "typeorm";
import Base from "./Base";
import { EmployeeType } from "../lib/types/model";

@Entity("employee")
export default class Employee extends Base {
  @Column({
    type: "enum",
    enum: EmployeeType,
    default: EmployeeType.CONSULTANT,
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
}
