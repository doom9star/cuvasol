import { Column, Entity, ManyToOne } from "typeorm";
import Base from "./Base";
import Report from "./Report";

@Entity("task")
export default class Task extends Base {
  @Column()
  name: string;

  @Column("text")
  description: string;

  @Column({ default: false })
  completed: boolean;

  @ManyToOne(() => Report, { onDelete: "CASCADE" })
  report: Report;
}
