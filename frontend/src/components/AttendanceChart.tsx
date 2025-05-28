import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, CheckCircle, XCircle } from 'lucide-react';

const API_URL = 'http://localhost:8000';

type AttendanceRecord = {
  AttendanceID: number;
  EmployeeID: number;
  Date: string;
  timeIn?: string | null;
  timeOut?: string | null;
  EmployeeName: string;
  DepartmentName?: string | null;
};

type Employee = {
  EmployeeID: number;
  FirstName: string;
  LastName: string;
  DepartmentID?: number;
};

const AttendanceChart = () => {
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const token = localStorage.getItem('access_token');

  useEffect(() => {
    setLoading(true);
    setError(null);

    // Fetch employees and attendance in parallel
    Promise.all([
      axios.get<Employee[]>(`${API_URL}/employees/`, { headers: { Authorization: token ? `Bearer ${token}` : '' } }),
      axios.get<AttendanceRecord[]>(`${API_URL}/attendances/`, { headers: { Authorization: token ? `Bearer ${token}` : '' } }),
    ])
      .then(([empRes, attRes]) => {
        setEmployees(empRes.data);
        setAttendanceRecords(attRes.data);
      })
      .catch(err => {
        console.error(err);
        setError('Failed to load data');
      })
      .finally(() => setLoading(false));
  }, [token]);

  // Utility to parse HH:mm:ss into minutes
  const timeToMinutes = (timeStr?: string | null) => {
    if (!timeStr) return null;
    const [h, m, s] = timeStr.split(':').map(Number);
    return h * 60 + m + s / 60;
  };

  // Group attendance by date for aggregation
  const attendanceByDate = attendanceRecords.reduce((acc, record) => {
    acc[record.Date] = acc[record.Date] || [];
    acc[record.Date].push(record);
    return acc;
  }, {} as Record<string, AttendanceRecord[]>);

  // Get all unique dates sorted ascending
  const allDates = Object.keys(attendanceByDate).sort();

  // Calculate attendance status per employee per date
  // Status: "On Time" (timeIn <= 09:00), "Late" (timeIn > 09:00), "Absent" (no attendance record)
  const getStatusForEmployee = (employeeID: number, date: string) => {
    const records = attendanceByDate[date] || [];
    const rec = records.find(r => r.EmployeeID === employeeID);
    if (!rec || !rec.timeIn) return 'Absent';
    return rec.timeIn <= '09:00:00' ? 'On Time' : 'Late';
  };

  // Calculate weeklyData for charts: counts of present/late/absent per day (Mon-Fri)
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const weeklyData = allDates.map(date => {
    const dayName = dayNames[new Date(date).getDay()];
    let present = 0;
    let late = 0;
    let absent = 0;
    employees.forEach(emp => {
      const status = getStatusForEmployee(emp.EmployeeID, date);
      if (status === 'On Time') present++;
      else if (status === 'Late') late++;
      else absent++;
    });
    return { day: dayName, present, late, absent, date };
  });

  // Today's date (most recent in data)
  const todayDate = allDates.length ? allDates[allDates.length - 1] : null;

  // Today's attendance summary
  const todaySummary = todayDate
    ? {
        present: weeklyData.find(d => d.date === todayDate)?.present ?? 0,
        late: weeklyData.find(d => d.date === todayDate)?.late ?? 0,
        absent: weeklyData.find(d => d.date === todayDate)?.absent ?? 0,
      }
    : { present: 0, late: 0, absent: 0 };

  // Calculate average hours per employee today (timeOut - timeIn)
  let totalMinutes = 0;
  let countedEmployees = 0;
  if (todayDate) {
    employees.forEach(emp => {
      const rec = attendanceByDate[todayDate]?.find(r => r.EmployeeID === emp.EmployeeID);
      if (rec?.timeIn && rec.timeOut) {
        const inM = timeToMinutes(rec.timeIn);
        const outM = timeToMinutes(rec.timeOut);
        if (inM !== null && outM !== null && outM > inM) {
          totalMinutes += outM - inM;
          countedEmployees++;
        }
      }
    });
  }
  const avgHours = countedEmployees > 0 ? (totalMinutes / countedEmployees / 60).toFixed(1) : '--';

  // Recent attendance records (last 10)
  const recentRecords = [...attendanceRecords]
    .sort((a, b) => new Date(b.Date).getTime() - new Date(a.Date).getTime())
    .slice(0, 10);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'On Time':
        return 'bg-green-100 text-green-700';
      case 'Late':
        return 'bg-orange-100 text-orange-700';
      case 'Absent':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) return <div className="text-center py-8">Loading attendance data...</div>;
  if (error) return <div className="text-center py-8 text-red-600">{error}</div>;

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
            <div className="text-2xl font-bold text-green-600">{todaySummary.present}</div>
            <p className="text-xs text-gray-500">Attendance rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Absent Today</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{todaySummary.absent}</div>
            <p className="text-xs text-gray-500">Of workforce</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Late Arrivals</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{todaySummary.late}</div>
            <p className="text-xs text-gray-500">Late today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Hours</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{avgHours}</div>
            <p className="text-xs text-gray-500">Hours per day</p>
          </CardContent>
        </Card>
      </div>

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
                data={[
                  { name: 'Present', value: todaySummary.present, color: '#22c55e' },
                  { name: 'Late', value: todaySummary.late, color: '#f59e0b' },
                  { name: 'Absent', value: todaySummary.absent, color: '#ef4444' },
                ]}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {[
                  { color: '#22c55e' },
                  { color: '#f59e0b' },
                  { color: '#ef4444' },
                ].map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recent Attendance Records */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Attendance Records</CardTitle>
          <CardDescription>Latest check-in and check-out times</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentRecords.map(record => {
              const status = getStatusForEmployee(record.EmployeeID, record.Date);
              return (
                <div
                  key={record.AttendanceID}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{record.EmployeeName}</p>
                      <p className="text-sm text-gray-500">{record.DepartmentName}</p>
                      <p className="text-sm text-gray-400">{record.Date}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm font-medium">In: {record.timeIn ?? '-'}</p>
                      <p className="text-sm text-gray-500">Out: {record.timeOut ?? '-'}</p>
                    </div>
                    <Badge className={getStatusColor(status)}>{status}</Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AttendanceChart;
