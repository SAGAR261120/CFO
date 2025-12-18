// Location: src/components/layout/Sidebar.tsx

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, BarChart2, ArrowUpDown, Users, AlertTriangle, 
  DollarSign, Globe, TrendingUp, Target, ShoppingCart, Activity, 
  Settings 
} from 'lucide-react';

// Import the logo
import cfoLogo from "../../assets/images/CFO.png";


const menuItems = [
  { label: 'Executive Summary', icon: LayoutDashboard, path: '/dashboard' },
  { label: 'Analytics', icon: BarChart2, path: '/analytics' },
  { label: 'Cashflow', icon: ArrowUpDown, path: '/cashflow' },
  { label: 'Client Distribution', icon: Users, path: '/clients' },
  { label: 'Exception', icon: AlertTriangle, path: '/exception' },
  { label: 'Financial Overview', icon: DollarSign, path: '/financial' },
  { label: 'Geo Mix', icon: Globe, path: '/geo' },
  { label: 'Investment', icon: TrendingUp, path: '/investment' },
  { label: 'KPI', icon: Target, path: '/kpi' },
  { label: 'Sales Insight', icon: ShoppingCart, path: '/sales' },
  { label: 'Utilization', icon: Activity, path: '/utilization' },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const styles = {
    container: {
      width: '260px',
      height: '100vh',
      backgroundColor: '#ffffff',
      borderRight: '1px solid #e2e8f0',
      display: 'flex',
      flexDirection: 'column' as const,
      flexShrink: 0,
      position: 'sticky' as const,
      top: 0,
    },
    header: {
      height: '80px',
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      padding: '0 24px',
      borderBottom: '1px solid #f1f5f9',
    },
    logo: {
      height: '55px',
      width: 'auto',
      objectFit: 'contain' as const,
    },
    title: {
      fontWeight: '800',
      fontSize: '22px',
      color: '#1e293b',
      letterSpacing: '-0.5px'
    },
    nav: {
      flex: 1,
      overflowY: 'auto' as const,
      padding: '16px 0',
    },
    button: (isActive: boolean) => ({
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px 24px',
      fontSize: '14px',
      fontWeight: isActive ? '500' : '400',
      cursor: 'pointer',
      border: 'none',
      backgroundColor: isActive ? '#eff6ff' : 'transparent',
      color: isActive ? '#2563eb' : '#64748b',
      borderLeft: isActive ? '4px solid #2563eb' : '4px solid transparent',
      transition: 'all 0.2s',
      textAlign: 'left' as const,
    }),
    footer: {
      padding: '16px 24px',
      borderTop: '1px solid #f1f5f9',
    }
  };

  return (
    <div style={styles.container}>
      {/* Header / Logo Area */}
      <div style={styles.header}>
        <img 
          src={cfoLogo} 
          alt="CFOsync Logo" 
          style={styles.logo} 
        />
        <span style={styles.title}>CFOsync.ai</span>
      </div>

      {/* Navigation Menu */}
      <nav style={styles.nav}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path || (location.pathname === '/' && item.path === '/dashboard');
          
          return (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              style={styles.button(isActive)}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.backgroundColor = '#f8fafc';
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <item.icon 
                size={18} 
                color={isActive ? '#2563eb' : '#94a3b8'} 
              />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Footer / Settings */}
      <div style={styles.footer}>
        <button 
          onClick={() => navigate('/settings')}
          style={{ ...styles.button(false), padding: '8px 0', borderLeft: 'none' }}
        >
          <Settings size={18} color="#94a3b8" />
          Settings
        </button>
      </div>
    </div>
  );
}