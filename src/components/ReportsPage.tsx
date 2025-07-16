import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, TrendingUp, Users, Calendar } from "lucide-react";
import { getStudents, getAttendanceStats, getAttendanceData } from "@/lib/attendance";

interface ReportsPageProps {
  onBack: () => void;
  onLogout: () => void;
}

export const ReportsPage = ({ onBack, onLogout }: ReportsPageProps) => {
  const students = getStudents();
  const stats = getAttendanceStats();
  const attendanceData = getAttendanceData();
  const totalDays = Object.keys(attendanceData).length;

  const getPerformanceColor = (percentage: number) => {
    if (percentage >= 90) return "bg-success";
    if (percentage >= 75) return "bg-warning";
    return "bg-destructive";
  };

  const getPerformanceText = (percentage: number) => {
    if (percentage >= 90) return "Excellent";
    if (percentage >= 75) return "Good";
    if (percentage >= 60) return "Average";
    return "Poor";
  };

  const averageAttendance = students.reduce((acc, student) => 
    acc + (stats[student.id]?.percentage || 0), 0
  ) / students.length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-accent shadow-medium">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-4">
              <Button
                onClick={onBack}
                variant="secondary"
                size="sm"
                className="bg-white/10 hover:bg-white/20 text-white border-white/20"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">
                  Attendance Reports
                </h1>
                <p className="text-primary-light mt-1">
                  Overview and analytics
                </p>
              </div>
            </div>
            <Button
              onClick={onLogout}
              variant="secondary"
              className="bg-white/10 hover:bg-white/20 text-white border-white/20"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-card shadow-soft">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Days Tracked</p>
                  <p className="text-3xl font-bold text-foreground">{totalDays}</p>
                </div>
                <div className="w-12 h-12 bg-primary-light rounded-full flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card shadow-soft">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Average Attendance</p>
                  <p className="text-3xl font-bold text-success">
                    {Math.round(averageAttendance)}%
                  </p>
                </div>
                <div className="w-12 h-12 bg-success-light rounded-full flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card shadow-soft">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Students Tracked</p>
                  <p className="text-3xl font-bold text-foreground">{students.length}</p>
                </div>
                <div className="w-12 h-12 bg-accent-light rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Student Performance Table */}
        <Card className="bg-card shadow-soft">
          <CardHeader className="bg-gradient-to-r from-muted to-muted/50">
            <CardTitle className="text-xl font-bold">Student Performance Report</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {/* Table Header */}
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4 p-4 bg-muted/30 border-b border-border font-medium text-sm">
              <div className="md:col-span-2">Student Details</div>
              <div className="text-center">Days Present</div>
              <div className="text-center">Total Days</div>
              <div className="text-center">Attendance %</div>
              <div className="text-center">Performance</div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-border">
              {students.map((student) => {
                const studentStats = stats[student.id] || { present: 0, total: 0, percentage: 0 };
                const performance = getPerformanceText(studentStats.percentage);
                
                return (
                  <div
                    key={student.id}
                    className="grid grid-cols-1 md:grid-cols-6 gap-4 p-4 hover:bg-muted/20 transition-colors"
                  >
                    <div className="md:col-span-2 flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary-light rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-primary font-bold text-sm">
                          {student.rollNo}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-medium text-foreground">{student.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Roll No: {student.rollNo}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <span className="text-lg font-semibold text-success">
                        {studentStats.present}
                      </span>
                    </div>
                    
                    <div className="text-center">
                      <span className="text-lg font-semibold text-foreground">
                        {studentStats.total}
                      </span>
                    </div>
                    
                    <div className="text-center">
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-xl font-bold text-foreground">
                          {studentStats.percentage}%
                        </span>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-300 ${getPerformanceColor(studentStats.percentage)}`}
                            style={{ width: `${studentStats.percentage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <Badge
                        className={`${getPerformanceColor(studentStats.percentage)} text-white`}
                      >
                        {performance}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Summary */}
        {totalDays === 0 && (
          <Card className="bg-warning-light border-warning mt-6">
            <CardContent className="p-6 text-center">
              <p className="text-warning-foreground">
                No attendance data available yet. Start marking attendance to see reports.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};