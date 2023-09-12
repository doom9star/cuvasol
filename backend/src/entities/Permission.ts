import { Column, Entity, ManyToMany } from "typeorm";
import Base from "./Base";
import Group from "./Group";

@Entity("permission")
export default class Permission extends Base {
  @Column({ unique: true })
  name: string;

  @Column("text")
  description: string;

  @ManyToMany(() => Group, (g) => g.permissions)
  groups: Group[];
}
