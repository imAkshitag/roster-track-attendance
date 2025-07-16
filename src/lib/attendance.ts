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

export const STUDENTS: Student[] = [
  { id: '1', rollNo: '001', name: 'Alice Johnson' },
  { id: '2', rollNo: '002', name: 'Bob Smith' },
  { id: '3', rollNo: '003', name: 'Charlie Brown' },
  { id: '4', rollNo: '004', name: 'Diana Ross' },
  { id: '5', rollNo: '005', name: 'Edward Wilson' },
  { id: '6', rollNo: '006', name: 'Fiona Davis' },
  { id: '7', rollNo: '007', name: 'George Miller' },
  { id: '8', rollNo: '008', name: 'Hannah Taylor' },
  { id: '9', rollNo: '009', name: 'Ivan Rodriguez' },
  { id: '10', rollNo: '010', name: 'Julia Martinez' },
];

const STORAGE_KEY = 'school-attendance-data';

export const getAttendanceData = (): AttendanceRecord => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error('Error reading attendance data:', error);
    return {};
  }
};

export const saveAttendanceData = (data: AttendanceRecord): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
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
  const stats: { [studentId: string]: { present: number; total: number; percentage: number } } = {};
  
  STUDENTS.forEach(student => {
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