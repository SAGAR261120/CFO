import { useState, useEffect } from 'react';
import { Login } from './components/Login';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { EditProfile } from './components/EditProfile';
import { Settings } from './components/Settings';
import { AnalyticsDashboard } from './components/dashboards/AnalyticsDashboard';
import { CashflowDashboard } from './components/dashboards/CashflowDashboard';
import { ClientDistributionDashboard } from './components/dashboards/ClientDistributionDashboard';
import { ExceptionDashboard } from './components/dashboards/ExceptionDashboard';
import { ExecutiveSummaryDashboard } from './components/dashboards/ExecutiveSummaryDashboard';
import { FinancialOverviewDashboard } from './components/dashboards/FinancialOverviewDashboard';
import { GeoMixDashboard } from './components/dashboards/GeoMixDashboard';
import { InvestmentDashboard } from './components/dashboards/InvestmentDashboard';
import { KPIDashboard } from './components/dashboards/KPIDashboard';
import { SalesInsightDashboard } from './components/dashboards/SalesInsightDashboard';
import { UtilizationDashboard } from './components/dashboards/UtilizationDashboard';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner@2.0.3';

const pageLabels: Record<string, string> = {
  'analytics': 'Analytics Dashboard',
  'cashflow': 'Cashflow Dashboard',
  'client-distribution': 'Client Distribution Dashboard',
  'exception': 'Exception Dashboard',
  'executive-summary': 'Executive Summary Dashboard',
  'financial-overview': 'Financial Overview Dashboard',
  'geo-mix': 'Geo Mix Dashboard',
  'investment': 'Investment Dashboard',
  'kpi': 'KPI Dashboards',
  'sales-insight': 'Sales Insight Dashboards',
  'utilization': 'Utilization Dashboard',
  'settings': 'Settings',
  'edit-profile': 'Edit Profile',
};

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [activePage, setActivePage] = useState('analytics');

  useEffect(() => {
    // Check if user is already logged in
    const storedAuth = localStorage.getItem('cfo_auth');
    const storedEmail = localStorage.getItem('cfo_email');
    if (storedAuth === 'true' && storedEmail) {
      setIsAuthenticated(true);
      setUserEmail(storedEmail);
    }
  }, []);

  const handleLogin = (email: string, password: string) => {
    // Simple authentication - in production, this would validate against a backend
    if (email && password) {
      setIsAuthenticated(true);
      setUserEmail(email);
      localStorage.setItem('cfo_auth', 'true');
      localStorage.setItem('cfo_email', email);
      toast.success('Login successful! Welcome to CFO Dashboard.');
    } else {
      toast.error('Please enter valid credentials.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserEmail('');
    localStorage.removeItem('cfo_auth');
    localStorage.removeItem('cfo_email');
    setActivePage('analytics');
    toast.success('You have been logged out successfully.');
  };

  const handleNavigate = (page: string) => {
    setActivePage(page);
  };

  const handleNavigateToProfile = () => {
    setActivePage('edit-profile');
  };

  const renderDashboard = () => {
    switch (activePage) {
      case 'analytics':
        return <AnalyticsDashboard />;
      case 'cashflow':
        return <CashflowDashboard />;
      case 'client-distribution':
        return <ClientDistributionDashboard />;
      case 'exception':
        return <ExceptionDashboard />;
      case 'executive-summary':
        return <ExecutiveSummaryDashboard />;
      case 'financial-overview':
        return <FinancialOverviewDashboard />;
      case 'geo-mix':
        return <GeoMixDashboard />;
      case 'investment':
        return <InvestmentDashboard />;
      case 'kpi':
        return <KPIDashboard />;
      case 'sales-insight':
        return <SalesInsightDashboard />;
      case 'utilization':
        return <UtilizationDashboard />;
      case 'settings':
        return <Settings />;
      case 'edit-profile':
        return <EditProfile userEmail={userEmail} onBack={() => setActivePage('executive-summary')} />;
      default:
        return <AnalyticsDashboard />;
    }
  };

  if (!isAuthenticated) {
    return (
      <>
        <Login onLogin={handleLogin} />
        <Toaster position="top-right" />
      </>
    );
  }

  return (
    <>
      <div className="flex h-screen bg-slate-50">
        <Sidebar 
          activePage={activePage} 
          onNavigate={handleNavigate}
        />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header 
            onLogout={handleLogout}
            onNavigateToProfile={handleNavigateToProfile}
            onNavigateToSettings={() => setActivePage('settings')}
            userEmail={userEmail}
            currentPage={activePage}
            currentPageLabel={pageLabels[activePage]}
          />
          <main className="flex-1 overflow-y-auto bg-slate-50">
            {renderDashboard()}
          </main>
        </div>
      </div>
      <Toaster position="top-right" />
    </>
  );
}
