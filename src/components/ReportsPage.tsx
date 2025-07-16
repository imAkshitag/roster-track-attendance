import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { getStudents, getAttendanceStats, getAttendanceData } from "@/lib/attendance";
import { Calendar, TrendingUp, Users } from "lucide-react";

const PIE_COLORS = ["#4ade80", "#f87171"];

export const ReportsPage = ({ onBack, onLogout }) => {
  const students = getStudents();
  const stats = getAttendanceStats();
  const attendanceData = getAttendanceData();
  const totalDays = Object.values(attendanceData).filter(dayData => Object.keys(dayData).length > 0).length;
  const averageAttendance = students.length > 0 ? Math.round(students.reduce((acc, student) => acc + (stats[student.id]?.percentage || 0), 0) / students.length) : 0;

  // Prepare data for daily attendance rate chart
  const dailyAttendance = Object.entries(attendanceData).map(([date, dayData]) => {
    const total = Object.keys(dayData).length;
    const present = Object.values(dayData).filter((s) => s === "Present").length;
    return {
      date,
      rate: total > 0 ? Math.round((present / total) * 100) : 0,
      present,
      absent: total - present,
      total,
    };
  });

  // Pie chart for latest day
  const latestDay = dailyAttendance.length > 0 ? dailyAttendance[dailyAttendance.length - 1] : null;
  const pieData = latestDay ? [
    { name: "Present", value: latestDay.present },
    { name: "Absent", value: latestDay.absent }
  ] : [];

  // State for day details modal
  const [selectedDay, setSelectedDay] = useState(null);
  const selectedDayData = selectedDay ? attendanceData[selectedDay] : null;
  const selectedDayPresent = selectedDayData ? Object.values(selectedDayData).filter(s => s === 'Present').length : 0;
  const selectedDayTotal = selectedDayData ? Object.keys(selectedDayData).length : 0;

  // Handler for clicking a bar in the chart
  const handleBarClick = useCallback((data) => {
    if (data && data.activeLabel) {
      setSelectedDay(data.activeLabel);
    }
  }, []);

  const getPerformanceColor = (percentage) => {
    if (percentage >= 90) return "bg-success";
    if (percentage >= 75) return "bg-warning";
    return "bg-destructive";
  };

  const getPerformanceText = (percentage) => {
    if (percentage >= 90) return "Excellent";
    if (percentage >= 75) return "Good";
    if (percentage >= 60) return "Average";
    return "Poor";
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-accent shadow-medium">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <Button onClick={onBack} variant="secondary" size="sm" className="bg-white/10 hover:bg-white/20 text-white border-white/20">Back</Button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Attendance Reports</h1>
              <p className="text-primary-light mt-1">Overview and analytics</p>
            </div>
          </div>
          <Button onClick={onLogout} variant="secondary" className="bg-white/10 hover:bg-white/20 text-white border-white/20">Logout</Button>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card className="bg-card shadow-soft"><CardContent className="p-4 sm:p-6"><div className="flex items-center justify-between"><div><p className="text-xs sm:text-sm text-muted-foreground">Total Days Tracked</p><p className="text-2xl sm:text-3xl font-bold text-foreground">{totalDays}</p></div><div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary-light rounded-full flex items-center justify-center"><Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-primary" /></div></div></CardContent></Card>
          <Card className="bg-card shadow-soft"><CardContent className="p-4 sm:p-6"><div className="flex items-center justify-between"><div><p className="text-xs sm:text-sm text-muted-foreground">Average Attendance</p><p className="text-2xl sm:text-3xl font-bold text-success">{averageAttendance}%</p></div><div className="w-10 h-10 sm:w-12 sm:h-12 bg-success-light rounded-full flex items-center justify-center"><TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-success" /></div></div></CardContent></Card>
          <Card className="bg-card shadow-soft"><CardContent className="p-4 sm:p-6"><div className="flex items-center justify-between"><div><p className="text-xs sm:text-sm text-muted-foreground">Students Tracked</p><p className="text-2xl sm:text-3xl font-bold text-foreground">{students.length}</p></div><div className="w-10 h-10 sm:w-12 sm:h-12 bg-accent-light rounded-full flex items-center justify-center"><Users className="w-5 h-5 sm:w-6 sm:h-6 text-accent" /></div></div></CardContent></Card>
        </div>
        {/* Charts Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card className="bg-card shadow-soft"><CardHeader className="bg-gradient-to-r from-muted to-muted/50"><CardTitle className="text-lg sm:text-xl font-bold">Attendance Trend</CardTitle></CardHeader><CardContent className="p-2 sm:p-4"><div className="w-full h-56 sm:h-72"><ResponsiveContainer width="100%" height="100%"><BarChart data={dailyAttendance} margin={{ left: 10, right: 10, top: 10, bottom: 10 }} onClick={handleBarClick}><XAxis dataKey="date" tick={{ fontSize: 10 }} /><YAxis domain={[0, 100]} tickFormatter={v => `${v}%`} /><Tooltip formatter={value => `${value}%`} /><Bar dataKey="rate" fill="#4ade80" name="Attendance %" /></BarChart></ResponsiveContainer></div></CardContent></Card>
          <Card className="bg-card shadow-soft"><CardHeader className="bg-gradient-to-r from-muted to-muted/50"><CardTitle className="text-lg sm:text-xl font-bold">Latest Day Breakdown</CardTitle></CardHeader><CardContent className="p-2 sm:p-4 flex flex-col items-center justify-center h-full"><div className="w-full h-56 sm:h-72 flex items-center justify-center">{pieData.length > 0 ? (<ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} innerRadius={30} label>{pieData.map((entry, idx) => (<Cell key={entry.name} fill={PIE_COLORS[idx % PIE_COLORS.length]} />))}</Pie><Tooltip /><Legend verticalAlign="bottom" height={36} /></PieChart></ResponsiveContainer>) : (<div className="text-muted-foreground text-center">No data for latest day</div>)}</div></CardContent></Card>
        </div>
        {/* Day Details Dialog */}
        <Dialog open={!!selectedDay} onOpenChange={open => !open && setSelectedDay(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Attendance Details for {selectedDay}</DialogTitle>
            </DialogHeader>
            {selectedDayData ? (
              <div>
                <div className="mb-2">Present: {selectedDayPresent} / {selectedDayTotal}</div>
                <div className="divide-y divide-border max-h-64 overflow-y-auto">
                  {Object.entries(selectedDayData).map(([studentId, status]) => {
                    const student = students.find(s => s.id === studentId);
                    return (
                      <div key={studentId} className="flex justify-between py-2 text-sm sm:text-base">
                        <span>{student ? student.name : studentId}</span>
                        <span className={status === 'Present' ? 'text-success' : 'text-destructive'}>{status}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : <div>No data for this day.</div>}
          </DialogContent>
        </Dialog>
        {/* Student Performance Table */}
        <Card className="bg-card shadow-soft">
          <CardHeader className="bg-gradient-to-r from-muted to-muted/50"><CardTitle className="text-lg sm:text-xl font-bold">Student Performance Report</CardTitle></CardHeader>
          <CardContent className="p-0">
            <div className="w-full overflow-x-auto">
              {/* Table Header */}
              <div className="grid grid-cols-1 md:grid-cols-6 gap-2 sm:gap-4 p-2 sm:p-4 bg-muted/30 border-b border-border font-medium text-xs sm:text-sm min-w-[600px]">
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
                      className="grid grid-cols-1 md:grid-cols-6 gap-2 sm:gap-4 p-2 sm:p-4 hover:bg-muted/20 transition-colors text-xs sm:text-base min-w-[600px]"
                    >
                      <div className="md:col-span-2 flex items-center gap-2 sm:gap-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary-light rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-primary font-bold text-xs sm:text-sm">
                            {student.rollNo}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-medium text-foreground text-xs sm:text-base">{student.name}</h3>
                          <p className="text-xs text-muted-foreground">Roll No: {student.rollNo}</p>
                        </div>
                      </div>
                      <div className="text-center">
                        <span className="text-base font-semibold text-success">
                          {studentStats.present}
                        </span>
                      </div>
                      <div className="text-center">
                        <span className="text-base font-semibold text-foreground">
                          {studentStats.total}
                        </span>
                      </div>
                      <div className="text-center">
                        <div className="flex flex-col items-center gap-1">
                          <span className="text-base font-bold text-foreground">
                            {studentStats.percentage}%
                          </span>
                          <div className="w-full bg-muted rounded-full h-1 sm:h-2">
                            <div
                              className={`h-1 sm:h-2 rounded-full transition-all duration-300 ${getPerformanceColor(studentStats.percentage)}`}
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
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};