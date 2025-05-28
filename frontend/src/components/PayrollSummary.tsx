import React, { useEffect, useState } from "react";
import axios from "axios";
import { saveAs } from "file-saver";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DollarSign,
  Download,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const API_URL = "http://localhost:8000";

interface PayrollRecord {
  payrollId: number;
  employeeId: number;
  name: string;
  department: string;
  salary: number;
  bonus: number;
  deduction: number;
  netPay: number;
  payDate: string;
}

interface DepartmentSummary {
  department: string;
  totalPay: number;
  employees: number;
}

const PayrollSummary = () => {
  const [payrollData, setPayrollData] = useState<PayrollRecord[]>([]);
  const [departmentSummary, setDepartmentSummary] = useState<DepartmentSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [processingPayroll, setProcessingPayroll] = useState(false);
  const [generatingReport, setGeneratingReport] = useState(false);

  const token = localStorage.getItem("access_token");

  const fetchPayrollData = async () => {
    try {
      const res = await axios.get<PayrollRecord[]>(`${API_URL}/payrolls/summary`, {
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      });
      setPayrollData(res.data);
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || "Failed to load payroll data");
    }
  };

  const fetchDepartmentSummary = async () => {
    try {
      const res = await axios.get<DepartmentSummary[]>(`${API_URL}/payrolls/department-summary`, {
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      });
      setDepartmentSummary(res.data);
    } catch (err) {
      console.error("Failed to fetch department summary", err);
    }
  };

  useEffect(() => {
    if (token) {
      setLoading(true);
      Promise.all([fetchPayrollData(), fetchDepartmentSummary()])
        .finally(() => setLoading(false));
    } else {
      setError("No auth token found. Please login.");
      setLoading(false);
    }
  }, [token]);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);

  const totalPayroll = payrollData.reduce((sum, rec) => sum + rec.netPay, 0);
  const totalBonus = payrollData.reduce((sum, rec) => sum + rec.bonus, 0);
  const totalDeductions = payrollData.reduce((sum, rec) => sum + rec.deduction, 0);

  const getDepartmentColor = (dept: string) => {
    const colors: Record<string, string> = {
      Engineering: "bg-blue-100 text-blue-700",
      "Product Management": "bg-green-100 text-green-700",
      "Quality Assurance": "bg-purple-100 text-purple-700",
      "Human Resources": "bg-orange-100 text-orange-700",
    };
    return colors[dept] || "bg-gray-100 text-gray-700";
  };

  const handleGenerateReport = async () => {
    setGeneratingReport(true);
    try {
      const res = await axios.get(`${API_URL}/payrolls/report`, {
        headers: { Authorization: token ? `Bearer ${token}` : "" },
        responseType: "blob",
      });
      const blob = new Blob([res.data], { type: "application/pdf" });
      saveAs(blob, `Payroll_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch {
      alert("Failed to generate payroll report.");
    } finally {
      setGeneratingReport(false);
    }
  };

  const handleProcessNextPayroll = async () => {
    setProcessingPayroll(true);
    try {
      await axios.post(
        `${API_URL}/payrolls/process-next`,
        {},
        { headers: { Authorization: token ? `Bearer ${token}` : "" } }
      );
      alert("Next payroll processed successfully!");
      await Promise.all([fetchPayrollData(), fetchDepartmentSummary()]);
    } catch {
      alert("Failed to process next payroll.");
    } finally {
      setProcessingPayroll(false);
    }
  };

  if (loading) return <div>Loading payroll data...</div>;
  if (error)
    return (
      <div className="text-red-600">
        Error: {typeof error === "string" ? error : JSON.stringify(error)}
      </div>
    );

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Payroll</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(totalPayroll)}</div>
            <p className="text-xs text-gray-500">
              {payrollData[0]?.payDate
                ? new Date(payrollData[0].payDate).toLocaleDateString("vi-VN", {
                    year: "numeric",
                    month: "long",
                  })
                : "N/A"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bonuses</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{formatCurrency(totalBonus)}</div>
            <p className="text-xs text-gray-500">Performance bonuses</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Deductions</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{formatCurrency(totalDeductions)}</div>
            <p className="text-xs text-gray-500">Various deductions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Salary</CardTitle>
            <DollarSign className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {payrollData.length > 0
                ? formatCurrency(totalPayroll / payrollData.length)
                : formatCurrency(0)}
            </div>
            <p className="text-xs text-gray-500">Per employee</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Payroll Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Payroll by Department</CardTitle>
            <CardDescription>Total compensation by department</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={departmentSummary}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="department" angle={-45} textAnchor="end" height={80} />
                <YAxis tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`} />
                <Tooltip formatter={(value) => [formatCurrency(value as number), "Total Pay"]} />
                <Bar dataKey="totalPay" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Payroll Actions</CardTitle>
            <CardDescription>Quick payroll management actions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700"
              onClick={handleGenerateReport}
              disabled={generatingReport}
            >
              <Download className="w-4 h-4 mr-2" />
              {generatingReport ? "Generating..." : "Generate Payroll Report"}
            </Button>

            <div className="pt-4 border-t">
              <h4 className="font-medium mb-3">Department Summary</h4>
              <div className="space-y-2">
                {departmentSummary.map((dept, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <span className="text-sm">{dept.department}</span>
                    <div className="text-right">
                      <p className="text-sm font-medium">{formatCurrency(dept.totalPay)}</p>
                      <p className="text-xs text-gray-500">{dept.employees} employees</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payroll Table */}
      <Card>
        <CardHeader>
          <CardTitle>Employee Payroll Details</CardTitle>
          <CardDescription>
            Detailed breakdown for{" "}
            {payrollData[0]
              ? new Date(payrollData[0].payDate).toLocaleDateString("vi-VN", {
                  year: "numeric",
                  month: "long",
                })
              : "N/A"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold">Employee</TableHead>
                  <TableHead className="font-semibold">Department</TableHead>
                  <TableHead className="font-semibold text-right">Base Salary</TableHead>
                  <TableHead className="font-semibold text-right">Bonus</TableHead>
                  <TableHead className="font-semibold text-right">Deductions</TableHead>
                  <TableHead className="font-semibold text-right">Net Pay</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payrollData.map((emp) => (
                  <TableRow key={emp.employeeId} className="hover:bg-gray-50">
                    <TableCell>
                      <div>
                        <p className="font-medium text-gray-900">{emp.name}</p>
                        <p className="text-sm text-gray-500">ID: {emp.employeeId}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getDepartmentColor(emp.department)}>{emp.department}</Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(emp.salary)}</TableCell>
                    <TableCell className="text-right">
                      {emp.bonus > 0 ? (
                        <span className="text-green-600 font-medium">+{formatCurrency(emp.bonus)}</span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {emp.deduction > 0 ? (
                        <span className="text-red-600 font-medium">-{formatCurrency(emp.deduction)}</span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right font-bold text-green-600">{formatCurrency(emp.netPay)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PayrollSummary;
