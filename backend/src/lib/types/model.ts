export enum UserType {
  ADMIN = "ADMIN",
  MANAGER = "MANAGER",
  CLIENT = "CLIENT",
  EMPLOYEE = "EMPLOYEE",
}

export enum PermissionType {
  // ADMIN
  MANAGE_ALL = "MANAGE_ALL",

  // MANAGER
  MANAGE_CLIENT = "MANAGE_CLIENT",
  MANAGE_EMPLOYEE = "MANAGE_EMPLOYEE",
  MANAGE_REPORT = "MANAGE_REPORT",

  // EMPLOYEE
  CREATE_REPORT = "CREATE_REPORT",
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
