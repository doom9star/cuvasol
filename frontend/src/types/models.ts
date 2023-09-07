interface ICommon {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface IUser extends ICommon {
  name: string;
  email: string;
}
