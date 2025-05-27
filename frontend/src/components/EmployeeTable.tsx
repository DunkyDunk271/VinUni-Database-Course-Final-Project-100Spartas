
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Plus, Edit, User } from 'lucide-react';
import { employeeService } from '@/services/employeeService';
import { departmentService } from '@/services/departmentService';
import { Employee, Department } from '@/types/api';

const EmployeeTable = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');

  const { data: employees = [], isLoading: employeesLoading } = useQuery({
    queryKey: ['employees'],
    queryFn: employeeService.getEmployees,
  });

  const { data: departments = [] } = useQuery({
    queryKey: ['departments'],
    queryFn: departmentService.getDepartments,
  });

  const filteredEmployees = employees.filter((employee: Employee) => {
    const fullName = `${employee.FirstName} ${employee.LastName}`.toLowerCase();
    const matchesSearch = fullName.includes(searchTerm.toLowerCase()) ||
                         (employee.Email && employee.Email.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesDepartment = departmentFilter === 'all' || employee.DepartmentID?.toString() === departmentFilter;
    return matchesSearch && matchesDepartment;
  });

  const getDepartmentName = (deptId?: number) => {
    if (!deptId) return 'No Department';
    const dept = departments.find((d: Department) => d.DepartmentID === deptId);
    return dept?.DeptName || 'Unknown';
  };

  const getDepartmentColor = (deptId?: number) => {
    const deptName = getDepartmentName(deptId);
    const colors: { [key: string]: string } = {
      'Engineering': 'bg-blue-100 text-blue-700',
      'Product Management': 'bg-green-100 text-green-700',
      'Quality Assurance': 'bg-purple-100 text-purple-700',
      'Human Resources': 'bg-orange-100 text-orange-700',
      'Sales': 'bg-red-100 text-red-700',
      'Marketing': 'bg-pink-100 text-pink-700'
    };
    return colors[deptName] || 'bg-gray-100 text-gray-700';
  };

  if (employeesLoading) {
    return <div className="text-center py-8">Loading employees...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Filter by department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departments.map((dept: Department) => (
                <SelectItem key={dept.DepartmentID} value={dept.DepartmentID.toString()}>
                  {dept.DeptName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Employee
        </Button>
      </div>

      {/* Employee Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold">Employee</TableHead>
              <TableHead className="font-semibold">Contact</TableHead>
              <TableHead className="font-semibold">Department</TableHead>
              <TableHead className="font-semibold">Gender</TableHead>
              <TableHead className="font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEmployees.map((employee: Employee) => (
              <TableRow key={employee.EmployeeID} className="hover:bg-gray-50">
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {employee.FirstName} {employee.LastName}
                      </p>
                      <p className="text-sm text-gray-500">ID: {employee.EmployeeID}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="text-sm text-gray-900">{employee.Email || 'No email'}</p>
                    <p className="text-sm text-gray-500">{employee.Phone || 'No phone'}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={getDepartmentColor(employee.DepartmentID)}>
                    {getDepartmentName(employee.DepartmentID)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-gray-700">
                    {employee.Gender === 1 ? 'Male' : employee.Gender === 0 ? 'Female' : 'Not specified'}
                  </span>
                </TableCell>
                <TableCell>
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {filteredEmployees.length === 0 && (
        <div className="text-center py-8">
          <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No employees found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default EmployeeTable;
