
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Award, TrendingUp, Users, Calendar } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

const PerformanceMetrics = () => {
  // Mock performance review data
  const performanceData = [
    {
      employeeId: 1,
      name: 'Thai Ba Hung',
      department: 'Engineering',
      score: 8,
      comments: 'Good performance, met all deadlines.',
      workingHours: 480,
      reviewDate: '2025-03-31'
    },
    {
      employeeId: 2,
      name: 'Le Nguyen Gia Binh',
      department: 'Product Management',
      score: 7,
      comments: 'Reliable but needs improvement in communication.',
      workingHours: 470,
      reviewDate: '2025-03-31'
    },
    {
      employeeId: 3,
      name: 'Nguyen Quoc Dang',
      department: 'Quality Assurance',
      score: 9,
      comments: 'Excellent problem-solving skills.',
      workingHours: 490,
      reviewDate: '2025-03-31'
    },
    {
      employeeId: 4,
      name: 'Anh Tran',
      department: 'Engineering',
      score: 6,
      comments: 'Average performance, should be more proactive.',
      workingHours: 460,
      reviewDate: '2025-03-31'
    },
    {
      employeeId: 5,
      name: 'Chi Le',
      department: 'Human Resources',
      score: 8,
      comments: 'Consistent and dependable.',
      workingHours: 480,
      reviewDate: '2025-03-31'
    }
  ];

  // Department performance summary
  const departmentPerformance = [
    { department: 'Engineering', avgScore: 7.0, employees: 2 },
    { department: 'Product Management', avgScore: 7.0, employees: 1 },
    { department: 'Quality Assurance', avgScore: 9.0, employees: 1 },
    { department: 'Human Resources', avgScore: 8.0, employees: 1 }
  ];

  // Performance distribution
  const performanceDistribution = [
    { range: '9-10', count: 1, label: 'Excellent' },
    { range: '7-8', count: 3, label: 'Good' },
    { range: '5-6', count: 1, label: 'Needs Improvement' },
    { range: '1-4', count: 0, label: 'Poor' }
  ];

  // Skills radar chart data
  const skillsData = [
    { skill: 'Technical Skills', value: 8.2 },
    { skill: 'Communication', value: 7.5 },
    { skill: 'Problem Solving', value: 8.8 },
    { skill: 'Teamwork', value: 7.8 },
    { skill: 'Leadership', value: 6.5 },
    { skill: 'Innovation', value: 7.2 }
  ];

  const getScoreColor = (score: number) => {
    if (score >= 9) return 'bg-green-100 text-green-700 border-green-200';
    if (score >= 7) return 'bg-blue-100 text-blue-700 border-blue-200';
    if (score >= 5) return 'bg-orange-100 text-orange-700 border-orange-200';
    return 'bg-red-100 text-red-700 border-red-200';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 9) return 'Excellent';
    if (score >= 7) return 'Good';
    if (score >= 5) return 'Needs Improvement';
    return 'Poor';
  };

  const getDepartmentColor = (dept: string) => {
    const colors: { [key: string]: string } = {
      'Engineering': 'bg-blue-100 text-blue-700',
      'Product Management': 'bg-green-100 text-green-700',
      'Quality Assurance': 'bg-purple-100 text-purple-700',
      'Human Resources': 'bg-orange-100 text-orange-700'
    };
    return colors[dept] || 'bg-gray-100 text-gray-700';
  };

  const avgScore = performanceData.reduce((sum, emp) => sum + emp.score, 0) / performanceData.length;
  const avgHours = performanceData.reduce((sum, emp) => sum + emp.workingHours, 0) / performanceData.length;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Performance</CardTitle>
            <Award className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{avgScore.toFixed(1)}/10</div>
            <p className="text-xs text-gray-500">Company average</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Performers</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {performanceData.filter(emp => emp.score >= 9).length}
            </div>
            <p className="text-xs text-gray-500">Score 9+ employees</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reviewed</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{performanceData.length}</div>
            <p className="text-xs text-gray-500">Q1 2025 reviews</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Hours</CardTitle>
            <Calendar className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{avgHours.toFixed(0)}</div>
            <p className="text-xs text-gray-500">Working hours/month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Performance Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Performance by Department</CardTitle>
            <CardDescription>Average performance scores by department</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={departmentPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="department" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis domain={[0, 10]} />
                <Tooltip 
                  formatter={(value) => [`${value}/10`, 'Avg Score']}
                />
                <Bar dataKey="avgScore" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Skills Radar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Skills Assessment</CardTitle>
            <CardDescription>Company-wide skills evaluation</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={skillsData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="skill" />
                <PolarRadiusAxis domain={[0, 10]} />
                <Radar
                  name="Skills"
                  dataKey="value"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.3}
                />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Performance Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Distribution</CardTitle>
          <CardDescription>Distribution of performance scores across the organization</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {performanceDistribution.map((dist, index) => (
              <div key={index} className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-gray-900">{dist.count}</div>
                <div className="text-sm font-medium text-gray-600">{dist.label}</div>
                <div className="text-xs text-gray-500">{dist.range} score</div>
                <Progress 
                  value={(dist.count / performanceData.length) * 100} 
                  className="mt-2"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Individual Performance Reviews</CardTitle>
          <CardDescription>Latest performance review details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold">Employee</TableHead>
                  <TableHead className="font-semibold">Department</TableHead>
                  <TableHead className="font-semibold">Score</TableHead>
                  <TableHead className="font-semibold">Working Hours</TableHead>
                  <TableHead className="font-semibold">Comments</TableHead>
                  <TableHead className="font-semibold">Review Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {performanceData.map((employee) => (
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
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Badge className={getScoreColor(employee.score)}>
                          {employee.score}/10
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {getScoreLabel(employee.score)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{employee.workingHours}h</span>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-gray-700 max-w-xs truncate">
                        {employee.comments}
                      </p>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-600">{employee.reviewDate}</span>
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

export default PerformanceMetrics;
