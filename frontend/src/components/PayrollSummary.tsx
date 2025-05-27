
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DollarSign, Download, TrendingUp, TrendingDown } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const PayrollSummary = () => {
  // Mock payroll data from your database
  const payrollData = [
    {
      employeeId: 1,
      name: 'Thai Ba Hung',
      department: 'Engineering',
      salary: 20000000,
      bonus: 1000000,
      deduction: 0,
      netPay: 21000000,
      payDate: '2025-05-31'
    },
    {
      employeeId: 2,
      name: 'Le Nguyen Gia Binh',
      department: 'Product Management',
      salary: 18000000,
      bonus: 0,
      deduction: 500000,
      netPay: 17500000,
      payDate: '2025-05-31'
    },
    {
      employeeId: 3,
      name: 'Nguyen Quoc Dang',
      department: 'Quality Assurance',
      salary: 22000000,
      bonus: 1500000,
      deduction: 0,
      netPay: 23500000,
      payDate: '2025-05-31'
    },
    {
      employeeId: 4,
      name: 'Anh Tran',
      department: 'Engineering',
      salary: 21000000,
      bonus: 0,
      deduction: 0,
      netPay: 21000000,
      payDate: '2025-05-31'
    },
    {
      employeeId: 5,
      name: 'Chi Le',
      department: 'Human Resources',
      salary: 19000000,
      bonus: 1000000,
      deduction: 0,
      netPay: 20000000,
      payDate: '2025-05-31'
    }
  ];

  // Department salary breakdown
  const departmentSummary = [
    { department: 'Engineering', totalPay: 42000000, employees: 2 },
    { department: 'Product Management', totalPay: 17500000, employees: 1 },
    { department: 'Quality Assurance', totalPay: 23500000, employees: 1 },
    { department: 'Human Resources', totalPay: 20000000, employees: 1 }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const totalPayroll = payrollData.reduce((sum, emp) => sum + emp.netPay, 0);
  const totalBonus = payrollData.reduce((sum, emp) => sum + emp.bonus, 0);
  const totalDeductions = payrollData.reduce((sum, emp) => sum + emp.deduction, 0);

  const getDepartmentColor = (dept: string) => {
    const colors: { [key: string]: string } = {
      'Engineering': 'bg-blue-100 text-blue-700',
      'Product Management': 'bg-green-100 text-green-700',
      'Quality Assurance': 'bg-purple-100 text-purple-700',
      'Human Resources': 'bg-orange-100 text-orange-700'
    };
    return colors[dept] || 'bg-gray-100 text-gray-700';
  };

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
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(totalPayroll)}
            </div>
            <p className="text-xs text-gray-500">May 2025</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bonuses</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(totalBonus)}
            </div>
            <p className="text-xs text-gray-500">Performance bonuses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Deductions</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(totalDeductions)}
            </div>
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
              {formatCurrency(totalPayroll / payrollData.length)}
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
                <XAxis 
                  dataKey="department" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis 
                  tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
                />
                <Tooltip 
                  formatter={(value) => [formatCurrency(value as number), 'Total Pay']}
                />
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
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              <Download className="w-4 h-4 mr-2" />
              Generate Payroll Report
            </Button>
            <Button variant="outline" className="w-full">
              <DollarSign className="w-4 h-4 mr-2" />
              Process Next Payroll
            </Button>
            <div className="pt-4 border-t">
              <h4 className="font-medium mb-3">Department Summary</h4>
              <div className="space-y-2">
                {departmentSummary.map((dept, index) => (
                  <div key={index} className="flex justify-between items-center">
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

      {/* Detailed Payroll Table */}
      <Card>
        <CardHeader>
          <CardTitle>Employee Payroll Details</CardTitle>
          <CardDescription>Detailed breakdown for May 2025</CardDescription>
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
                {payrollData.map((employee) => (
                  <TableRow key={employee.employeeId} className="hover:bg-gray-50">
                    <TableCell>
                      <div>
                        <p className="font-medium text-gray-900">{employee.name}</p>
                        <p className="text-sm text-gray-500">ID: {employee.employeeId}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getDepartmentColor(employee.department)}>
                        {employee.department}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(employee.salary)}
                    </TableCell>
                    <TableCell className="text-right">
                      {employee.bonus > 0 ? (
                        <span className="text-green-600 font-medium">
                          +{formatCurrency(employee.bonus)}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {employee.deduction > 0 ? (
                        <span className="text-red-600 font-medium">
                          -{formatCurrency(employee.deduction)}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right font-bold text-green-600">
                      {formatCurrency(employee.netPay)}
                    </TableCell>
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
