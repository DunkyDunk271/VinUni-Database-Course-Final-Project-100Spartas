
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Users, Calendar, DollarSign, TrendingUp, Clock, Award, LogOut } from 'lucide-react';
import EmployeeTable from '@/components/EmployeeTable';
import AttendanceChart from '@/components/AttendanceChart';
import PayrollSummary from '@/components/PayrollSummary';
import PerformanceMetrics from '@/components/PerformanceMetrics';
import { authService } from '@/services/authService';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    authService.logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
    navigate('/login');
  };

  // Mock data for dashboard metrics
  const metrics = [
    {
      title: 'Total Employees',
      value: '47',
      change: '+3 this month',
      icon: Users,
      color: 'text-blue-600'
    },
    {
      title: 'Present Today',
      value: '42',
      change: '89% attendance',
      icon: Calendar,
      color: 'text-green-600'
    },
    {
      title: 'Monthly Payroll',
      value: '$945K',
      change: '+5.2% from last month',
      icon: DollarSign,
      color: 'text-purple-600'
    },
    {
      title: 'Avg Performance',
      value: '7.8/10',
      change: '+0.3 this quarter',
      icon: TrendingUp,
      color: 'text-orange-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">HRIS Dashboard</h1>
              <p className="text-gray-600 mt-1">Human Resources Information System</p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="text-green-600 border-green-200">
                <Clock className="w-3 h-3 mr-1" />
                System Online
              </Badge>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="employees">Employees</TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="payroll">Payroll</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <div className="space-y-8">
              {/* Metrics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {metrics.map((metric, index) => {
                  const IconComponent = metric.icon;
                  return (
                    <Card key={index} className="relative overflow-hidden">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">
                          {metric.title}
                        </CardTitle>
                        <IconComponent className={`h-5 w-5 ${metric.color}`} />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-gray-900">{metric.value}</div>
                        <p className="text-xs text-gray-500 mt-1">{metric.change}</p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Charts and Quick Actions */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                      Weekly Attendance
                    </CardTitle>
                    <CardDescription>Employee attendance for the current week</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <AttendanceChart />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Award className="w-5 h-5 mr-2 text-purple-600" />
                      Top Performers
                    </CardTitle>
                    <CardDescription>Employees with highest performance scores</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { name: 'Nguyen Quoc Dang', score: 9.0, dept: 'QA' },
                        { name: 'Thai Ba Hung', score: 8.5, dept: 'Engineering' },
                        { name: 'Tuan Le', score: 8.2, dept: 'Engineering' }
                      ].map((employee, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900">{employee.name}</p>
                            <p className="text-sm text-gray-500">{employee.dept}</p>
                          </div>
                          <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                            {employee.score}/10
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="employees">
            <Card>
              <CardHeader>
                <CardTitle>Employee Management</CardTitle>
                <CardDescription>
                  View and manage employee information across all departments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <EmployeeTable />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="attendance">
            <Card>
              <CardHeader>
                <CardTitle>Attendance Tracking</CardTitle>
                <CardDescription>
                  Monitor employee attendance and working hours
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AttendanceChart />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payroll">
            <Card>
              <CardHeader>
                <CardTitle>Payroll Summary</CardTitle>
                <CardDescription>
                  Review salary, bonuses, and deductions for all employees
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PayrollSummary />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance">
            <Card>
              <CardHeader>
                <CardTitle>Performance Reviews</CardTitle>
                <CardDescription>
                  Track employee performance metrics and reviews
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PerformanceMetrics />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
