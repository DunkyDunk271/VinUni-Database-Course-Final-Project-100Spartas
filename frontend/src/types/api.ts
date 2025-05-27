
export interface Employee {
  EmployeeID: number;
  FirstName: string;
  LastName: string;
  DOB?: string;
  Phone?: string;
  Email?: string;
  Gender?: number; // 0 or 1
  DepartmentID?: number;
}

export interface Department {
  DepartmentID: number;
  DeptName: string;
}

export interface Attendance {
  AttendanceID: number;
  EmployeeID: number;
  Date: string;
  timeIn?: string;
  timeOut?: string;
}

export interface Payroll {
  PayrollID: number;
  EmployeeID: number;
  Salary: number;
  Bonus: number;
  Deduction: number;
  PayDate: string;
}

export interface PerformanceReview {
  ReviewID: number;
  EmployeeID: number;
  ReviewDate: string;
  Score: number;
  Comments?: string;
  WorkingHours: number;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}
