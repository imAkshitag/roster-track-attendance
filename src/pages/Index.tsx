import { useState } from "react";
import { LoginPage } from "@/components/LoginPage";
import { AttendanceDashboard } from "@/components/AttendanceDashboard";
import { ReportsPage } from "@/components/ReportsPage";

type View = 'login' | 'dashboard' | 'reports';

const Index = () => {
  const [currentView, setCurrentView] = useState<View>('login');
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleLogin = () => {
    setCurrentView('dashboard');
  };

  const handleViewReports = () => {
    setCurrentView('reports');
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
  };

  switch (currentView) {
    case 'login':
      return <LoginPage onLogin={handleLogin} />;
    
    case 'dashboard':
      return (
        <AttendanceDashboard
          onViewReports={handleViewReports}
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
        />
      );
    
    case 'reports':
      return <ReportsPage onBack={handleBackToDashboard} />;
    
    default:
      return <LoginPage onLogin={handleLogin} />;
  }
};

export default Index;
