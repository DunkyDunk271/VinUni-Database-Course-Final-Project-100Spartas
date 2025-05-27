import { useState, useEffect } from 'react';
import axios from 'axios';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Plus, Edit, User } from 'lucide-react';

const API_URL = 'http://localhost:8000';

interface Employee {
  EmployeeID: number;
  FirstName: string;
  LastName: string;
  Email?: string;
  Phone?: string;
  Gender?: number;
  DepartmentID?: number;
}

interface Department {
  DepartmentID: number;
  DeptName: string;
}

const EmployeeTable = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);

  // Get JWT token from localStorage
  const token = localStorage.getItem('access_token');
  console.log('JWT Token:', token);

  // Fetch employees from backend API
  const fetchEmployees = async () => {
    console.log('Fetching employees with token:', token);
    try {
      const response = await axios.get(`${API_URL}/employees`, {
        headers: {
          "Authorization": token ? `Bearer ${token}` : '',
        },
      });
      console.log('Fetched Employees:', response.data);
      setEmployees(response.data);
    } catch (error) {
      console.error('Failed to fetch employees', error);
      setEmployees([]);
    }
  };

  // Fetch departments from backend API
  const fetchDepartments = async () => {
    try {
      const response = await axios.get<Department[]>(`${API_URL}/departments/`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
        },
      });
      setDepartments(response.data);
    } catch (error) {
      console.error('Failed to fetch departments', error);
      setDepartments([]);
    }
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchEmployees(), fetchDepartments()])
      .finally(() => setLoading(false));
  }, []);

  // Filter employees by search term and department filter
  const filteredEmployees = employees.filter((employee) => {
    const fullName = `${employee.FirstName} ${employee.LastName}`.toLowerCase();
    const matchesSearch =
      fullName.includes(searchTerm.toLowerCase()) ||
      (employee.Email && employee.Email.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesDepartment =
      departmentFilter === 'all' || employee.DepartmentID?.toString() === departmentFilter;
    return matchesSearch && matchesDepartment;
  });

  const getDepartmentName = (deptId?: number) => {
    if (!deptId) return 'No Department';
    const dept = departments.find((d) => d.DepartmentID === deptId);
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
      'Marketing': 'bg-pink-100 text-pink-700',
    };
    return colors[deptName] || 'bg-gray-100 text-gray-700';
  };

  if (loading) {
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
              {departments.map((dept) => (
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
            {filteredEmployees.map((employee) => (
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
                    {employee.Gender === 1
                      ? 'Male'
                      : employee.Gender === 0
                      ? 'Female'
                      : 'Not specified'}
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
