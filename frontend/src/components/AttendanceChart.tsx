
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, CheckCircle, XCircle } from 'lucide-react';

const AttendanceChart = () => {
  // Mock attendance data for the week
  const weeklyData = [
    { day: 'Mon', present: 42, absent: 5, late: 3 },
    { day: 'Tue', present: 44, absent: 3, late: 2 },
    { day: 'Wed', present: 43, absent: 4, late: 1 },
    { day: 'Thu', present: 45, absent: 2, late: 4 },
    { day: 'Fri', present: 41, absent: 6, late: 2 }
  ];

  // Today's attendance summary
  const todayAttendance = [
    { name: 'Present', value: 42, color: '#22c55e' },
    { name: 'Absent', value: 3, color: '#ef4444' },
    { name: 'Late', value: 2, color: '#f59e0b' }
  ];

  // Recent attendance records
  const recentAttendance = [
    { name: 'Thai Ba Hung', timeIn: '09:00', timeOut: '18:00', status: 'On Time', dept: 'Engineering' },
    { name: 'Le Nguyen Gia Binh', timeIn: '09:15', timeOut: '18:05', status: 'Late', dept: 'Product' },
    { name: 'Nguyen Quoc Dang', timeIn: '08:55', timeOut: '17:50', status: 'Early', dept: 'QA' },
    { name: 'Anh Tran', timeIn: '09:10', timeOut: '18:10', status: 'Late', dept: 'Engineering' },
    { name: 'Chi Le', timeIn: '09:00', timeOut: '18:00', status: 'On Time', dept: 'HR' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'On Time': return 'bg-green-100 text-green-700';
      case 'Late': return 'bg-orange-100 text-orange-700';
      case 'Early': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Present Today</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">42</div>
            <p className="text-xs text-gray-500">89% attendance rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Absent Today</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">3</div>
            <p className="text-xs text-gray-500">6% of workforce</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Late Arrivals</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">2</div>
            <p className="text-xs text-gray-500">4% late today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Hours</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">8.2</div>
            <p className="text-xs text-gray-500">Hours per day</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Attendance Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Attendance Trend</CardTitle>
            <CardDescription>Attendance patterns for this week</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="present" fill="#22c55e" name="Present" />
                <Bar dataKey="late" fill="#f59e0b" name="Late" />
                <Bar dataKey="absent" fill="#ef4444" name="Absent" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Today's Attendance Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Today's Attendance Breakdown</CardTitle>
            <CardDescription>Current attendance status</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={todayAttendance}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {todayAttendance.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Attendance Records */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Attendance Records</CardTitle>
          <CardDescription>Latest check-in and check-out times</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentAttendance.map((record, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{record.name}</p>
                    <p className="text-sm text-gray-500">{record.dept}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm font-medium">In: {record.timeIn}</p>
                    <p className="text-sm text-gray-500">Out: {record.timeOut}</p>
                  </div>
                  <Badge className={getStatusColor(record.status)}>
                    {record.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AttendanceChart;
