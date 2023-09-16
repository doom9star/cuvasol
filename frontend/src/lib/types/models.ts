export enum UserType {
  ADMIN = "ADMIN",
  MANAGER = "MANAGER",
  CLIENT = "CLIENT",
  EMPLOYEE = "EMPLOYEE",
}

export enum EmployeeType {
  CONSULTANT = "CONSULTANT",
  INTERN = "EMPLOYEE",
}

export enum GenderType {
  MALE = "MALE",
  FEMALE = "FEMALE",
  OTHER = "OTHER",
}

interface ICommon {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface IUser extends ICommon {
  name: string;
  email: string;
  designation: string;
  location: string;
  phoneNumber: string;
  birthDate: Date;
  gender: GenderType;
  urls: string[];
  groups: IGroup[];
  employee?: IEmployee;
}

export interface IGroup extends ICommon {
  name: UserType;
}

export interface IEmployee extends ICommon {
  type: EmployeeType;
  salary: number;
  startTime: Date;
  endTime: Date;
  joinedAt: Date;
  endedAt: Date | null;
  leftAt: Date | null;
  report?: IReport;
}

export interface IReport extends ICommon {
  summary: string;
  submitted: boolean;
  approved: boolean;
  submittedAt: Date | null;
  tasks: ITask[];
}

export interface ITask extends ICommon {
  name: string;
  description: string;
  completed: boolean;
}
