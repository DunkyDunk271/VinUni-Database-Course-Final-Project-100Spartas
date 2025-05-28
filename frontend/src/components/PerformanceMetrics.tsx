import React, { useEffect, useState } from "react";
import axios from "axios";
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
import { Progress } from "@/components/ui/progress";
import {
  Award,
  TrendingUp,
  Users,
  Calendar,
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

interface PerformanceReviewSummary {
  reviewId: number;
  employeeId: number;
  name: string;
  department: string;
  score: number;
  comments?: string;
  workingHours: number;
  reviewDate: string;
}

const PerformanceMetrics = () => {
  const [reviews, setReviews] = useState<PerformanceReviewSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const token = localStorage.getItem("access_token");

  useEffect(() => {
    if (!token) {
      setError("No auth token found. Please login.");
      setLoading(false);
      return;
    }
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get<PerformanceReviewSummary[]>(`${API_URL}/performance_reviews/summary`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setReviews(res.data);
      } catch (err: any) {
        setError(err.response?.data?.detail || err.message || "Failed to load performance reviews");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  if (loading) return <div>Loading performance data...</div>;
  if (error)
  return (
    <div className="text-red-600">
      Error: {typeof error === "string" ? error : JSON.stringify(error)}
    </div>
  );


  // Calculate summary metrics
  const avgScore = reviews.length
    ? reviews.reduce((sum, r) => sum + r.score, 0) / reviews.length
    : 0;

  const topPerformers = reviews.filter(r => r.score >= 9).length;

  // Aggregate by department for bar chart
  const deptMap = new Map<string, { totalScore: number; count: number }>();
  reviews.forEach(r => {
    const dept = r.department || "Unknown";
    if (!deptMap.has(dept)) {
      deptMap.set(dept, { totalScore: 0, count: 0 });
    }
    const entry = deptMap.get(dept)!;
    entry.totalScore += r.score;
    entry.count += 1;
  });
  const departmentPerformance = Array.from(deptMap.entries()).map(([department, { totalScore, count }]) => ({
    department,
    avgScore: count ? totalScore / count : 0,
    employees: count,
  }));

  // Performance distribution buckets
  const buckets = [
    { label: "Excellent", range: [9, 10], count: 0 },
    { label: "Good", range: [7, 8], count: 0 },
    { label: "Needs Improvement", range: [5, 6], count: 0 },
    { label: "Poor", range: [1, 4], count: 0 },
  ];

  reviews.forEach(r => {
    for (const bucket of buckets) {
      if (r.score >= bucket.range[0] && r.score <= bucket.range[1]) {
        bucket.count++;
        break;
      }
    }
  });

  const getScoreColor = (score: number) => {
    if (score >= 9) return "bg-green-100 text-green-700 border-green-200";
    if (score >= 7) return "bg-blue-100 text-blue-700 border-blue-200";
    if (score >= 5) return "bg-orange-100 text-orange-700 border-orange-200";
    return "bg-red-100 text-red-700 border-red-200";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 9) return "Excellent";
    if (score >= 7) return "Good";
    if (score >= 5) return "Needs Improvement";
    return "Poor";
  };

  const getDepartmentColor = (dept: string) => {
    const colors: Record<string, string> = {
      Engineering: "bg-blue-100 text-blue-700",
      "Product Management": "bg-green-100 text-green-700",
      "Quality Assurance": "bg-purple-100 text-purple-700",
      "Human Resources": "bg-orange-100 text-orange-700",
    };
    return colors[dept] || "bg-gray-100 text-gray-700";
  };

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
            <div className="text-2xl font-bold text-purple-600">
              {avgScore.toFixed(1)}/10
            </div>
            <p className="text-xs text-gray-500">Company average</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Performers</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{topPerformers}</div>
            <p className="text-xs text-gray-500">Score 9+ employees</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reviewed</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{reviews.length}</div>
            <p className="text-xs text-gray-500">Latest reviews</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Hours</CardTitle>
            <Calendar className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {(
                reviews.reduce((sum, r) => sum + r.workingHours, 0) / reviews.length
              ).toFixed(0)}
            </div>
            <p className="text-xs text-gray-500">Working hours/month</p>
          </CardContent>
        </Card>
      </div>

      {/* Department Performance Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Performance by Department</CardTitle>
          <CardDescription>Average performance scores by department</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={departmentPerformance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="department" angle={-45} textAnchor="end" height={80} />
              <YAxis domain={[0, 10]} />
              <Tooltip formatter={(value) => [`${value}/10`, "Avg Score"]} />
              <Bar dataKey="avgScore" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Performance Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Distribution</CardTitle>
          <CardDescription>
            Distribution of performance scores across the organization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {buckets.map((dist, i) => (
              <div key={i} className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-gray-900">{dist.count}</div>
                <div className="text-sm font-medium text-gray-600">{dist.label}</div>
                <div className="text-xs text-gray-500">{dist.range[0]}-{dist.range[1]} score</div>
                <Progress value={(dist.count / reviews.length) * 100} className="mt-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Table */}
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
                {reviews.map((rev) => (
                  <TableRow key={rev.reviewId} className="hover:bg-gray-50">
                    <TableCell>
                      <div>
                        <p className="font-medium text-gray-900">{rev.name}</p>
                        <p className="text-sm text-gray-500">ID: {rev.employeeId}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getDepartmentColor(rev.department)}>
                        {rev.department}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getScoreColor(rev.score)}>
                        {rev.score}/10
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{rev.workingHours}h</span>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-gray-700 max-w-xs truncate">
                        {rev.comments}
                      </p>
                    </TableCell>
                    <TableCell>{rev.reviewDate}</TableCell>
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
