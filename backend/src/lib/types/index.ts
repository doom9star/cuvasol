import { Request } from "express";
import { PermissionType } from "./model";

export type TPayload = { id: string };
export type TAuthRequest = Request & {
  redclient?: any;
  user?: TPayload;
  perms?: PermissionType[];
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
