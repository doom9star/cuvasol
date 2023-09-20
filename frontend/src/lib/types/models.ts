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

export enum ReportStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
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
  birthstring: string;
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
  startTime: string;
  endTime: string;
  joinedAt: string;
  endedAt: string | null;
  leftAt: string | null;
  report?: IReport;
}

export interface IReport extends ICommon {
  summary: string;
  status: ReportStatus;
  submittedAt: string | null;
  tasks: ITask[];
  user: IUser;
}

export interface ITask extends ICommon {
  name: string;
  description: string;
  completed: boolean;
}
