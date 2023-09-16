import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import Base from "./Base";
import Task from "./Task";
import User from "./User";

@Entity("report")
export default class Report extends Base {
  @Column("text", { nullable: true })
  summary: string;

  @Column({ default: false })
  submitted: boolean;

  @Column({ default: false })
  approved: boolean;

  @Column({ type: "datetime", nullable: true })
  submittedAt: Date;

  @OneToMany(() => Task, (task) => task.report, { cascade: true })
  tasks: Task[];

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  user: User;
}
