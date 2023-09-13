import { Request } from "express";
import { PermissionType, UserType } from "./model";

export type TPayload = { id: string };
export type TRequest = Request & {
  cacher?: any;
  user?: TPayload;
  perms?: PermissionType[];
  groups?: UserType[];
};

export interface EmailOptions {
  from: string;
  to: string;
  subject: string;
  html: string;
}

export enum FileType {
  FILE,
  IMAGE,
  VIDEO,
  AUDIO,
}
