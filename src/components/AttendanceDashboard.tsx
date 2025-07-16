import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { useToast } from "@/hooks/use-toast";
import { getStudents, addStudent, formatDate, formatDisplayDate, getAttendanceForDate, updateAttendance } from "@/lib/attendance";

const PIE_COLORS = ["#4ade80", "#f87171"];

export const AttendanceDashboard = ({ onViewReports, onLogout, selectedDate, onDateChange }) => {
  const [attendance, setAttendance] = useState({});
  const [students, setStudents] = useState(getStudents());
  const [newStudentName, setNewStudentName] = useState("");
  const { toast } = useToast();
  const dateStr = formatDate(selectedDate);
  const [sortOption, setSortOption] = useState("rollNo");

  useEffect(() => {
    setAttendance(getAttendanceForDate(dateStr));
    setStudents(getStudents());
  }, [dateStr]);

  // Sort students
  const sortedStudents = [...students].sort((a, b) => {
    if (sortOption === "rollNo") {
      return a.rollNo.localeCompare(b.rollNo, undefined, { numeric: true });
    } else {
      return a.name.localeCompare(b.name);
    }
  });

  // Attendance submission logic
  const todayStr = formatDate(new Date());
  const isToday = dateStr === todayStr;
  const attendanceMarkedToday = isToday && Object.keys(getAttendanceForDate(todayStr)).length > 0;
  const isPastDate = selectedDate < new Date(new Date().toDateString());

  const handleSubmitAttendance = () => {
    if (attendanceMarkedToday) {
      toast({ title: "Attendance already marked", description: "Attendance for today has already been submitted.", variant: "destructive" });
      return;
    }
    students.forEach(student => {
      if (!(student.id in attendance)) {
        updateAttendance(student.id, dateStr, "Absent");
      }
    });
    setAttendance(getAttendanceForDate(dateStr));
    toast({ title: "Attendance Submitted", description: `Attendance for ${formatDisplayDate(selectedDate)} has been saved.`, variant: "default" });
  };

  const handleAttendanceToggle = (studentId, isPresent) => {
    const status = isPresent ? "Present" : "Absent";
    updateAttendance(studentId, dateStr, status);
    setAttendance(prev => ({ ...prev, [studentId]: status }));
  };

  // Add student logic (auto roll number)
  const handleAddStudent = () => {
    if (!newStudentName.trim()) {
      toast({ title: "Error", description: "Please fill in the student name.", variant: "destructive" });
      return;
    }
    const nextRollNo = String(students.length + 1).padStart(3, "0");
    const existingStudent = students.find(student => student.name.toLowerCase() === newStudentName.trim().toLowerCase());
    if (existingStudent) {
      toast({ title: "Error", description: "A student with this name already exists.", variant: "destructive" });
      return;
    }
    const newStudent = addStudent(newStudentName.trim(), nextRollNo);
    setStudents(prev => [...prev, newStudent]);
    setNewStudentName("");
    toast({ title: "Success", description: `Student added successfully! Roll No: ${nextRollNo}`, variant: "default" });
  };

  const presentCount = Object.values(attendance).filter(status => status === "Present").length;
  const absentCount = students.length - presentCount;
  const totalMarked = students.length;

  // Pie chart data
  const pieData = [
    { name: "Present", value: presentCount },
    { name: "Absent", value: absentCount }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-accent shadow-medium">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Attendance Dashboard</h1>
            <p className="text-primary-light mt-1">{formatDisplayDate(selectedDate)}</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Button onClick={onLogout} variant="secondary" className="bg-white/10 hover:bg-white/20 text-white border-white/20 w-full sm:w-auto">Logout</Button>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Calendar className="w-4 h-4 text-white" />
              <input type="date" value={dateStr} onChange={e => onDateChange(new Date(e.target.value))} className="bg-white/10 border border-white/20 rounded-md px-3 py-2 text-white placeholder-primary-light focus:outline-none focus:ring-2 focus:ring-white/50 w-full sm:w-auto" />
            </div>
            <Button onClick={onViewReports} variant="secondary" className="bg-white/10 hover:bg-white/20 text-white border-white/20 w-full sm:w-auto">View Reports</Button>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8">
        {/* Stats Cards & Pie Chart */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card className="bg-card shadow-soft col-span-1 md:col-span-1"><CardContent className="p-4 sm:p-6"><div className="flex items-center justify-between"><div><p className="text-xs sm:text-sm text-muted-foreground">Total Students</p><p className="text-2xl sm:text-3xl font-bold text-foreground">{students.length}</p></div><div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary-light rounded-full flex items-center justify-center"><span className="text-primary font-bold text-lg">{students.length}</span></div></div></CardContent></Card>
          <Card className="bg-card shadow-soft col-span-1 md:col-span-1"><CardContent className="p-4 sm:p-6"><div className="flex items-center justify-between"><div><p className="text-xs sm:text-sm text-muted-foreground">Present Today</p><p className="text-2xl sm:text-3xl font-bold text-success">{presentCount}</p></div><div className="w-10 h-10 sm:w-12 sm:h-12 bg-success-light rounded-full flex items-center justify-center"><span className="text-success font-bold text-lg">{presentCount}</span></div></div></CardContent></Card>
          <Card className="bg-card shadow-soft col-span-1 md:col-span-1"><CardContent className="p-4 sm:p-6"><div className="flex items-center justify-between"><div><p className="text-xs sm:text-sm text-muted-foreground">Attendance Rate</p><p className="text-2xl sm:text-3xl font-bold text-primary">{totalMarked > 0 ? Math.round((presentCount / totalMarked) * 100) : 0}%</p></div><div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary-light rounded-full flex items-center justify-center"><span className="text-primary font-bold text-sm">{totalMarked > 0 ? Math.round((presentCount / totalMarked) * 100) : 0}%</span></div></div></CardContent></Card>
          <Card className="bg-card shadow-soft col-span-1 md:col-span-1 flex items-center justify-center"><CardContent className="p-2 sm:p-4 flex flex-col items-center justify-center h-full"><div className="w-full h-40 sm:h-48"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} innerRadius={30} label><Cell key="present" fill={PIE_COLORS[0]} /><Cell key="absent" fill={PIE_COLORS[1]} /></Pie><Tooltip /><Legend verticalAlign="bottom" height={36} /></PieChart></ResponsiveContainer></div></CardContent></Card>
        </div>
        {/* Add Student Form */}
        <Card className="bg-card shadow-soft mb-6">
          <CardHeader className="bg-gradient-to-r from-muted to-muted/50"><CardTitle className="text-lg sm:text-xl font-bold">Add New Student</CardTitle></CardHeader>
          <CardContent className="p-4 sm:p-6"><div className="grid grid-cols-1 md:grid-cols-3 gap-4"><div><Label htmlFor="studentName">Student Name</Label><Input id="studentName" type="text" placeholder="Enter student name" value={newStudentName} onChange={e => setNewStudentName(e.target.value)} /></div><div className="flex items-end"><Button onClick={handleAddStudent} className="w-full">Add Student</Button></div></div></CardContent>
        </Card>
        {/* Student List */}
        <Card className="bg-card shadow-soft">
          <CardHeader className="bg-gradient-to-r from-muted to-muted/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0"><CardTitle className="text-lg sm:text-xl font-bold">Student Attendance</CardTitle><div className="mt-2 sm:mt-0 flex gap-2 items-center"><Label htmlFor="sortOption">Sort by:</Label><select id="sortOption" value={sortOption} onChange={e => setSortOption(e.target.value)} className="border rounded px-2 py-1"><option value="rollNo">Roll Number</option><option value="name">Name</option></select></div></CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border overflow-x-auto">
              {sortedStudents.map(student => {
                const isPresent = attendance[student.id] === "Present";
                const isMarked = student.id in attendance;
                return (
                  <div key={student.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 gap-2 hover:bg-muted/30 transition-colors min-w-[320px]">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-primary-light rounded-full flex items-center justify-center"><span className="text-primary font-bold text-sm">{student.rollNo}</span></div>
                      <div><h3 className="font-medium text-foreground">{student.name}</h3><p className="text-xs text-muted-foreground">Roll No: {student.rollNo}</p></div>
                    </div>
                    <div className="flex items-center gap-4">
                      {isMarked && (<Badge variant={isPresent ? "default" : "destructive"} className={isPresent ? "bg-success hover:bg-success/80" : ""}>{isPresent ? "Present" : "Absent"}</Badge>)}
                      <div className="flex items-center gap-3"><span className="text-xs text-muted-foreground">Absent</span><Switch checked={isPresent} onCheckedChange={checked => handleAttendanceToggle(student.id, checked)} /><span className="text-xs text-muted-foreground">Present</span></div>
                    </div>
                  </div>
                );
              })}
            </div>
            {/* Submit Attendance Button */}
            <div className="p-4 flex justify-end">
              <Button onClick={handleSubmitAttendance} disabled={isPastDate || attendanceMarkedToday} className="bg-primary text-white px-6" title={isPastDate ? "Cannot submit attendance for past dates" : attendanceMarkedToday ? "Attendance already marked for today" : "Submit today's attendance"}>Submit Attendance</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};