import { Column, Entity, ManyToMany } from "typeorm";
import Base from "./Base";
import User from "./User";
import { UserRole } from "../lib/types/model";

@Entity("group")
export default class Group extends Base {
  @Column({ type: "enum", enum: UserRole })
  name: UserRole;

  @ManyToMany(() => User, (u) => u.groups, { cascade: true })
  members: User[];

  @Column("simple-array", { nullable: true })
  permissions: string[];
}
