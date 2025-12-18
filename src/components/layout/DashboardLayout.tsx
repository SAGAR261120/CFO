import React from 'react';
import Sidebar from './Sidebar.tsx'; // Removed .tsx extension
import Header from './Header.tsx';   // Removed .tsx extension

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const styles = {
    wrapper: {
      display: 'flex',
      height: '100vh',
      backgroundColor: '#f8fafc',
      overflow: 'hidden',
      fontFamily: '"Inter", "Segoe UI", sans-serif',
    },
    mainContainer: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column' as const,
      minWidth: 0,
    },
    contentArea: {
      flex: 1,
      overflowY: 'auto' as const,
      padding: '0', 
      backgroundColor: '#f8fafc',
    }
  };

  return (
    <div style={styles.wrapper}>
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content Area */}
      <div style={styles.mainContainer}>
        <Header />
        
        {/* Scrollable Content */}
        <main style={styles.contentArea}>
          {children}
        </main>
      </div>
    </div>
  );
}