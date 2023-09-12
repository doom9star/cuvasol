import { Column, Entity, ManyToMany } from "typeorm";
import Base from "./Base";
import Group from "./Group";
import { PermissionType } from "../lib/types/model";

@Entity("permission")
export default class Permission extends Base {
  @Column({ type: "enum", enum: PermissionType })
  name: PermissionType;

  @Column("text")
  description: string;

  @ManyToMany(() => Group, (g) => g.permissions)
  groups: Group[];
}
