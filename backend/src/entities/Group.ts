import { Column, Entity, JoinTable, ManyToMany, OneToMany } from "typeorm";
import Base from "./Base";
import User from "./User";
import { UserType } from "../lib/types/model";
import Permission from "./Permission";

@Entity("group")
export default class Group extends Base {
  @Column({ type: "enum", enum: UserType })
  name: UserType;

  @ManyToMany(() => User, (u) => u.groups, { cascade: true })
  members: User[];

  @ManyToMany(() => Permission, (p) => p.groups, { cascade: true })
  @JoinTable({ name: "groups_permissons" })
  permissions: Permission[];
}
