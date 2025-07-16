import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "lucide-react";
import { 
  STUDENTS, 
  formatDate, 
  formatDisplayDate, 
  getAttendanceForDate, 
  updateAttendance 
} from "@/lib/attendance";

interface AttendanceDashboardProps {
  onViewReports: () => void;
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export const AttendanceDashboard = ({ 
  onViewReports, 
  selectedDate, 
  onDateChange 
}: AttendanceDashboardProps) => {
  const [attendance, setAttendance] = useState<{ [key: string]: 'Present' | 'Absent' }>({});
  const dateStr = formatDate(selectedDate);

  useEffect(() => {
    setAttendance(getAttendanceForDate(dateStr));
  }, [dateStr]);

  const handleAttendanceToggle = (studentId: string, isPresent: boolean) => {
    const status = isPresent ? 'Present' : 'Absent';
    updateAttendance(studentId, dateStr, status);
    setAttendance(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const presentCount = Object.values(attendance).filter(status => status === 'Present').length;
  const totalMarked = Object.keys(attendance).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-accent shadow-medium">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">
                Attendance Dashboard
              </h1>
              <p className="text-primary-light mt-1">
                {formatDisplayDate(selectedDate)}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-white" />
                <input
                  type="date"
                  value={dateStr}
                  onChange={(e) => onDateChange(new Date(e.target.value))}
                  className="bg-white/10 border border-white/20 rounded-md px-3 py-2 text-white placeholder-primary-light focus:outline-none focus:ring-2 focus:ring-white/50"
                />
              </div>
              <Button
                onClick={onViewReports}
                variant="secondary"
                className="bg-white/10 hover:bg-white/20 text-white border-white/20"
              >
                View Reports
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-card shadow-soft">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Students</p>
                  <p className="text-3xl font-bold text-foreground">{STUDENTS.length}</p>
                </div>
                <div className="w-12 h-12 bg-primary-light rounded-full flex items-center justify-center">
                  <span className="text-primary font-bold text-lg">{STUDENTS.length}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card shadow-soft">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Present Today</p>
                  <p className="text-3xl font-bold text-success">{presentCount}</p>
                </div>
                <div className="w-12 h-12 bg-success-light rounded-full flex items-center justify-center">
                  <span className="text-success font-bold text-lg">{presentCount}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card shadow-soft">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Attendance Rate</p>
                  <p className="text-3xl font-bold text-primary">
                    {totalMarked > 0 ? Math.round((presentCount / totalMarked) * 100) : 0}%
                  </p>
                </div>
                <div className="w-12 h-12 bg-primary-light rounded-full flex items-center justify-center">
                  <span className="text-primary font-bold text-sm">
                    {totalMarked > 0 ? Math.round((presentCount / totalMarked) * 100) : 0}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Student List */}
        <Card className="bg-card shadow-soft">
          <CardHeader className="bg-gradient-to-r from-muted to-muted/50">
            <CardTitle className="text-xl font-bold">Student Attendance</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {STUDENTS.map((student) => {
                const isPresent = attendance[student.id] === 'Present';
                const isMarked = student.id in attendance;
                
                return (
                  <div
                    key={student.id}
                    className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-primary-light rounded-full flex items-center justify-center">
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
                    
                    <div className="flex items-center gap-4">
                      {isMarked && (
                        <Badge 
                          variant={isPresent ? "default" : "destructive"}
                          className={isPresent ? "bg-success hover:bg-success/80" : ""}
                        >
                          {isPresent ? 'Present' : 'Absent'}
                        </Badge>
                      )}
                      
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-muted-foreground">Absent</span>
                        <Switch
                          checked={isPresent}
                          onCheckedChange={(checked) => 
                            handleAttendanceToggle(student.id, checked)
                          }
                        />
                        <span className="text-sm text-muted-foreground">Present</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};