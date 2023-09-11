export enum UserType {
  DIRECTOR = 1,
  CLIENT = 2,
  EMPLOYEE = 3,
}

interface ICommon {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface IUser extends ICommon {
  name: string;
  email: string;
}
