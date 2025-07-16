// Attendance management utilities

export interface Student {
  id: string;
  rollNo: string;
  name: string;
}

export interface AttendanceRecord {
  [date: string]: {
    [studentId: string]: 'Present' | 'Absent';
  };
}

const DEFAULT_STUDENTS: Student[] = [
  { id: '1', rollNo: '001', name: 'Alice Johnson' },
  { id: '2', rollNo: '002', name: 'Bob Smith' },
  { id: '3', rollNo: '003', name: 'Charlie Brown' },
  { id: '4', rollNo: '004', name: 'Diana Ross' },
  { id: '5', rollNo: '005', name: 'Edward Wilson' },
];

const STUDENTS_STORAGE_KEY = 'school-students-data';

const ATTENDANCE_STORAGE_KEY = 'school-attendance-data';

export const getStudents = (): Student[] => {
  try {
    const data = localStorage.getItem(STUDENTS_STORAGE_KEY);
    return data ? JSON.parse(data) : DEFAULT_STUDENTS;
  } catch (error) {
    console.error('Error reading students data:', error);
    return DEFAULT_STUDENTS;
  }
};

export const saveStudents = (students: Student[]): void => {
  try {
    localStorage.setItem(STUDENTS_STORAGE_KEY, JSON.stringify(students));
  } catch (error) {
    console.error('Error saving students data:', error);
  }
};

export const addStudent = (name: string, rollNo: string): Student => {
  const students = getStudents();
  const newStudent: Student = {
    id: Date.now().toString(),
    rollNo,
    name
  };
  
  const updatedStudents = [...students, newStudent];
  saveStudents(updatedStudents);
  return newStudent;
};

export const getAttendanceData = (): AttendanceRecord => {
  try {
    const data = localStorage.getItem(ATTENDANCE_STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error('Error reading attendance data:', error);
    return {};
  }
};

export const saveAttendanceData = (data: AttendanceRecord): void => {
  try {
    localStorage.setItem(ATTENDANCE_STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving attendance data:', error);
  }
};

export const updateAttendance = (
  studentId: string,
  date: string,
  status: 'Present' | 'Absent'
): void => {
  const data = getAttendanceData();
  if (!data[date]) {
    data[date] = {};
  }
  data[date][studentId] = status;
  saveAttendanceData(data);
};

export const getAttendanceForDate = (date: string): { [studentId: string]: 'Present' | 'Absent' } => {
  const data = getAttendanceData();
  return data[date] || {};
};

export const getAttendanceStats = (): { [studentId: string]: { present: number; total: number; percentage: number } } => {
  const data = getAttendanceData();
  const students = getStudents();
  const stats: { [studentId: string]: { present: number; total: number; percentage: number } } = {};
  
  students.forEach(student => {
    stats[student.id] = { present: 0, total: 0, percentage: 0 };
  });

  Object.values(data).forEach(dayData => {
    Object.entries(dayData).forEach(([studentId, status]) => {
      if (stats[studentId]) {
        stats[studentId].total++;
        if (status === 'Present') {
          stats[studentId].present++;
        }
      }
    });
  });

  Object.keys(stats).forEach(studentId => {
    const { present, total } = stats[studentId];
    stats[studentId].percentage = total > 0 ? Math.round((present / total) * 100) : 0;
  });

  return stats;
};

export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const formatDisplayDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};