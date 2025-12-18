import React, { useState, CSSProperties } from 'react';
import { 
  Bell, Globe, Palette, Database, Shield, Eye, 
  Save, RefreshCw, Download, Lock, ChevronDown 
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext.tsx';

// --- TYPE DEFINITIONS ---
interface ColorPalette {
  bg: string;
  cardBg: string;
  textMain: string;
  textMuted: string;
  border: string;
  primary: string;
  inputBg: string;
}

interface ThemeClasses {
  [key: string]: CSSProperties;
}

interface NotificationState {
  email: boolean;
  push: boolean;
  alerts: boolean;
  reports: boolean;
}

// --- STYLES & COLORS GENERATOR ---
const getTheme = (mode: 'light' | 'dark') => {
  const isDark = mode === 'dark';
  
  // 1. Define Colors
  const colors: ColorPalette = {
    bg: isDark ? '#0f172a' : '#f8fafc',
    cardBg: isDark ? '#1e293b' : '#ffffff',
    textMain: isDark ? '#ffffff' : '#0f172a',
    textMuted: isDark ? '#94a3b8' : '#64748b',
    border: isDark ? '#334155' : '#e2e8f0',
    primary: '#2563eb',
    inputBg: isDark ? '#020617' : '#ffffff',
  };

  // 2. Define Classes (Styles)
  const classes: ThemeClasses = {
    wrapper: {
      padding: '24px',
      maxWidth: '1200px',
      margin: '0 auto',
      fontFamily: 'Inter, sans-serif',
      color: colors.textMain,
      backgroundColor: colors.bg,
      minHeight: '100vh',
      transition: 'background-color 0.3s ease, color 0.3s ease',
    },
    header: {
      display: 'flex',
      justifyContent: 'flex-end', // Changed to flex-end to push buttons to the right
      alignItems: 'center',
      marginBottom: '32px',
      flexWrap: 'wrap',
      gap: '16px',
    },
    buttonGroup: {
      display: 'flex',
      gap: '12px',
    },
    btnBase: {
      display: 'flex',
      alignItems: 'center',
      padding: '8px 16px',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: 500,
      cursor: 'pointer',
      border: '1px solid transparent',
      transition: 'all 0.2s',
      fontFamily: 'Inter, sans-serif'
    },
    btnGhost: {
      backgroundColor: isDark ? 'transparent' : '#fff',
      border: `1px solid ${colors.border}`,
      color: colors.textMain,
    },
    btnPrimary: {
      backgroundColor: colors.primary,
      color: '#fff',
      border: 'none',
    },
    tabs: {
      display: 'flex',
      borderBottom: `1px solid ${colors.border}`,
      marginBottom: '24px',
      overflowX: 'auto',
      gap: '24px',
    },
    tabBtnBase: {
      background: 'none',
      border: 'none',
      padding: '12px 4px',
      fontSize: '14px',
      fontWeight: 500,
      cursor: 'pointer',
      whiteSpace: 'nowrap',
      fontFamily: 'Inter, sans-serif'
    },
    card: {
      backgroundColor: colors.cardBg,
      borderRadius: '12px',
      border: `1px solid ${colors.border}`,
      marginBottom: '24px',
      overflow: 'hidden',
    },
    cardHeader: {
      padding: '20px 24px',
      borderBottom: `1px solid ${colors.border}`,
    },
    cardTitleRow: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginBottom: '4px',
    },
    cardTitle: {
      fontSize: '16px',
      fontWeight: 500,
      margin: 0,
      color: colors.textMain,
      fontFamily: 'Poppins, sans-serif',
      lineHeight: 1.5
    },
    cardDesc: {
      fontSize: '14px',
      color: colors.textMuted,
      margin: 0,
      paddingLeft: '28px',
      fontFamily: 'Inter, sans-serif'
    },
    cardContent: {
      padding: '24px',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '24px',
    },
    formGroup: {
      marginBottom: '16px',
    },
    label: {
      display: 'block',
      fontSize: '14px',
      fontWeight: 500,
      marginBottom: '8px',
      color: colors.textMain,
    },
    selectContainer: {
      position: 'relative',
    },
    select: {
      width: '100%',
      padding: '10px 12px',
      paddingRight: '32px',
      borderRadius: '8px',
      border: `1px solid ${colors.border}`,
      backgroundColor: colors.inputBg,
      color: colors.textMain,
      fontSize: '14px',
      appearance: 'none',
      outline: 'none',
      fontFamily: 'Inter, sans-serif'
    },
    selectIcon: {
      position: 'absolute',
      right: '10px',
      top: '50%',
      transform: 'translateY(-50%)',
      pointerEvents: 'none',
      color: colors.textMuted,
    },
    row: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '16px 0',
    },
    separator: {
      height: '1px',
      backgroundColor: colors.border,
      margin: '0',
    }
  };

  return { colors, classes };
};

// --- HELPER COMPONENT: SWITCH ---
const CustomSwitch = ({ 
  checked, 
  onChange, 
  primaryColor, 
  borderColor 
}: { 
  checked: boolean; 
  onChange: (val: boolean) => void; 
  primaryColor: string; 
  borderColor: string; 
}) => (
  <div 
    onClick={() => onChange(!checked)}
    style={{
      width: '44px',
      height: '24px',
      backgroundColor: checked ? primaryColor : (borderColor === '#334155' ? '#475569' : '#cbd5e1'),
      borderRadius: '999px',
      position: 'relative',
      cursor: 'pointer',
      transition: 'background-color 0.2s',
      flexShrink: 0,
    }}
  >
    <div style={{
      width: '20px',
      height: '20px',
      backgroundColor: '#fff',
      borderRadius: '50%',
      position: 'absolute',
      top: '2px',
      left: checked ? '22px' : '2px',
      transition: 'left 0.2s',
      boxShadow: '0 1px 2px rgba(0,0,0,0.2)'
    }} />
  </div>
);

// --- MAIN COMPONENT ---
export function Settings() {
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('general');
  
  // Safe theme extraction
  const currentTheme = theme === 'dark' ? 'dark' : 'light';
  
  // Extract both colors and classes
  const { colors, classes } = getTheme(currentTheme);

  // States
  const [preferences, setPreferences] = useState({
    currency: 'INR',
    timezone: 'Asia/Kolkata',
    dateFormat: 'DD/MM/YYYY',
    fiscalYearStart: 'April',
    language: 'English',
  });

  const [notifications, setNotifications] = useState<NotificationState>({
    email: true,
    push: true,
    alerts: true,
    reports: false,
  });

  const [display, setDisplay] = useState({
    theme: currentTheme,
    compactView: false,
    showAnimations: true,
    defaultDashboard: 'executive-summary',
  });

  // Handlers
  const handleThemeChange = (newTheme: string) => {
    setDisplay({ ...display, theme: newTheme });
    if (newTheme === 'dark' || newTheme === 'light') {
      setTheme(newTheme);
    }
  };

  const tabs = [
    { id: 'general', label: 'General' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'display', label: 'Display' },
    { id: 'data', label: 'Data & Reports' },
    { id: 'security', label: 'Security' },
  ];

  return (
    <div style={classes.wrapper}>
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Poppins:wght@400;500;600&display=swap');`}
      </style>
      
      {/* HEADER (Buttons Only) */}
      <div style={classes.header}>
        <div style={classes.buttonGroup}>
          <button style={{...classes.btnBase, ...classes.btnGhost}} onClick={() => window.location.reload()}>
            <RefreshCw size={16} style={{marginRight: '8px'}} />
            Reset to Defaults
          </button>
          <button style={{...classes.btnBase, ...classes.btnPrimary}} onClick={() => alert('Saved!')}>
            <Save size={16} style={{marginRight: '8px'}} />
            Save Changes
          </button>
        </div>
      </div>

      {/* TABS */}
      <div style={classes.tabs}>
        {tabs.map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                ...classes.tabBtnBase,
                color: isActive ? colors.primary : colors.textMuted,
                borderBottom: isActive ? `2px solid ${colors.primary}` : '2px solid transparent',
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* CONTENT */}
      
      {/* 1. GENERAL TAB */}
      {activeTab === 'general' && (
        <>
          <div style={classes.card}>
            <div style={classes.cardHeader}>
              <div style={classes.cardTitleRow}>
                <Globe size={18} color={colors.textMuted} />
                <h3 style={classes.cardTitle}>Regional Settings</h3>
              </div>
              <p style={classes.cardDesc}>Configure your regional preferences</p>
            </div>
            <div style={classes.cardContent}>
              <div style={classes.grid}>
                <div style={classes.formGroup}>
                  <label style={classes.label}>Currency</label>
                  <div style={classes.selectContainer}>
                    <select 
                      style={classes.select}
                      value={preferences.currency}
                      onChange={(e) => setPreferences({...preferences, currency: e.target.value})}
                    >
                      <option value="INR">Indian Rupee (₹)</option>
                      <option value="USD">US Dollar ($)</option>
                      <option value="EUR">Euro (€)</option>
                    </select>
                    <ChevronDown size={16} style={classes.selectIcon} />
                  </div>
                </div>
                <div style={classes.formGroup}>
                  <label style={classes.label}>Timezone</label>
                  <div style={classes.selectContainer}>
                    <select 
                      style={classes.select}
                      value={preferences.timezone}
                      onChange={(e) => setPreferences({...preferences, timezone: e.target.value})}
                    >
                      <option value="Asia/Kolkata">IST (Asia/Kolkata)</option>
                      <option value="America/New_York">EST (America/New_York)</option>
                    </select>
                    <ChevronDown size={16} style={classes.selectIcon} />
                  </div>
                </div>
                <div style={classes.formGroup}>
                  <label style={classes.label}>Date Format</label>
                  <div style={classes.selectContainer}>
                    <select 
                      style={classes.select}
                      value={preferences.dateFormat}
                      onChange={(e) => setPreferences({...preferences, dateFormat: e.target.value})}
                    >
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    </select>
                    <ChevronDown size={16} style={classes.selectIcon} />
                  </div>
                </div>
                <div style={classes.formGroup}>
                  <label style={classes.label}>Fiscal Year Start</label>
                  <div style={classes.selectContainer}>
                    <select 
                      style={classes.select}
                      value={preferences.fiscalYearStart}
                      onChange={(e) => setPreferences({...preferences, fiscalYearStart: e.target.value})}
                    >
                      <option value="April">April</option>
                      <option value="January">January</option>
                    </select>
                    <ChevronDown size={16} style={classes.selectIcon} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div style={classes.card}>
            <div style={classes.cardHeader}>
              <div style={classes.cardTitleRow}>
                <Palette size={18} color={colors.textMuted} />
                <h3 style={classes.cardTitle}>Language</h3>
              </div>
              <p style={classes.cardDesc}>Select your preferred language</p>
            </div>
            <div style={classes.cardContent}>
              <div style={{ maxWidth: '400px' }}>
                <label style={classes.label}>Display Language</label>
                <div style={classes.selectContainer}>
                    <select 
                      style={classes.select}
                      value={preferences.language}
                      onChange={(e) => setPreferences({...preferences, language: e.target.value})}
                    >
                      <option value="English">English</option>
                      <option value="Hindi">Hindi</option>
                      <option value="Spanish">Spanish</option>
                    </select>
                    <ChevronDown size={16} style={classes.selectIcon} />
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* 2. NOTIFICATIONS TAB */}
      {activeTab === 'notifications' && (
        <div style={classes.card}>
          <div style={classes.cardHeader}>
            <div style={classes.cardTitleRow}>
              <Bell size={18} color={colors.textMuted} />
              <h3 style={classes.cardTitle}>Notification Preferences</h3>
            </div>
            <p style={classes.cardDesc}>Manage how you receive notifications</p>
          </div>
          <div style={classes.cardContent}>
            {[
              { id: 'email', title: 'Email Notifications', desc: 'Receive notifications via email' },
              { id: 'push', title: 'Push Notifications', desc: 'Receive browser push notifications' },
              { id: 'alerts', title: 'Alert Notifications', desc: 'Get notified about exceptions and alerts' },
              { id: 'reports', title: 'Weekly Reports', desc: 'Receive weekly summary reports' },
            ].map((item, idx) => (
              <div key={item.id}>
                <div style={classes.row}>
                  <div>
                    <div style={{...classes.label, marginBottom: '2px'}}>{item.title}</div>
                    <div style={{fontSize: '13px', color: colors.textMuted}}>{item.desc}</div>
                  </div>
                  <CustomSwitch 
                    primaryColor={colors.primary}
                    borderColor={colors.border}
                    checked={notifications[item.id as keyof NotificationState]} 
                    onChange={(val) => setNotifications(prev => ({...prev, [item.id]: val}))} 
                  />
                </div>
                {idx < 3 && <div style={classes.separator} />}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. DISPLAY TAB */}
      {activeTab === 'display' && (
        <div style={classes.card}>
          <div style={classes.cardHeader}>
            <div style={classes.cardTitleRow}>
              <Eye size={18} color={colors.textMuted} />
              <h3 style={classes.cardTitle}>Display Preferences</h3>
            </div>
            <p style={classes.cardDesc}>Customize your dashboard appearance</p>
          </div>
          <div style={classes.cardContent}>
            
            <div style={classes.formGroup}>
              <label style={classes.label}>Theme</label>
              <div style={{maxWidth: '400px', ...classes.selectContainer}}>
                <select 
                  style={classes.select}
                  value={display.theme}
                  onChange={(e) => handleThemeChange(e.target.value)}
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="auto">Auto (System)</option>
                </select>
                <ChevronDown size={16} style={classes.selectIcon} />
              </div>
            </div>

            <div style={{...classes.separator, margin: '24px 0'}} />

            <div style={classes.formGroup}>
              <label style={classes.label}>Default Dashboard</label>
              <div style={{maxWidth: '400px', ...classes.selectContainer}}>
                <select 
                  style={classes.select}
                  value={display.defaultDashboard}
                  onChange={(e) => setDisplay({...display, defaultDashboard: e.target.value})}
                >
                  <option value="executive-summary">Executive Summary</option>
                  <option value="analytics">Analytics</option>
                </select>
                <ChevronDown size={16} style={classes.selectIcon} />
              </div>
              <p style={{fontSize: '12px', color: colors.textMuted, marginTop: '4px'}}>Dashboard to show on login</p>
            </div>

            <div style={{...classes.separator, margin: '24px 0'}} />

            <div style={classes.row}>
              <div>
                <div style={{...classes.label, marginBottom: '2px'}}>Compact View</div>
                <div style={{fontSize: '13px', color: colors.textMuted}}>Show more content with reduced spacing</div>
              </div>
              <CustomSwitch 
                primaryColor={colors.primary}
                borderColor={colors.border}
                checked={display.compactView} 
                onChange={(val) => setDisplay({...display, compactView: val})} 
              />
            </div>
          </div>
        </div>
      )}

      {/* 4. DATA TAB */}
      {activeTab === 'data' && (
        <div style={classes.card}>
          <div style={classes.cardHeader}>
            <div style={classes.cardTitleRow}>
              <Database size={18} color={colors.textMuted} />
              <h3 style={classes.cardTitle}>Data Management</h3>
            </div>
            <p style={classes.cardDesc}>Configure data refresh and export settings</p>
          </div>
          <div style={classes.cardContent}>
            <div style={{maxWidth: '400px', marginBottom: '24px'}}>
              <label style={classes.label}>Auto Refresh Interval</label>
              <div style={classes.selectContainer}>
                <select style={classes.select} defaultValue="5">
                  <option value="1">1 minute</option>
                  <option value="5">5 minutes</option>
                  <option value="15">15 minutes</option>
                </select>
                <ChevronDown size={16} style={classes.selectIcon} />
              </div>
            </div>

            <div style={{...classes.separator, margin: '24px 0'}} />

            <div>
              <label style={classes.label}>Data Cache</label>
              <p style={{fontSize: '13px', color: colors.textMuted, marginBottom: '12px'}}>
                Clear cached data to free up space
              </p>
              <button style={{...classes.btnBase, ...classes.btnGhost}}>
                <Download size={16} style={{marginRight: '8px'}} />
                Clear Cache
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. SECURITY TAB */}
      {activeTab === 'security' && (
        <div style={classes.card}>
           <div style={classes.cardHeader}>
            <div style={classes.cardTitleRow}>
              <Shield size={18} color={colors.textMuted} />
              <h3 style={classes.cardTitle}>Security & Privacy</h3>
            </div>
            <p style={classes.cardDesc}>Manage your security settings</p>
          </div>
          <div style={classes.cardContent}>
            <div>
              <label style={classes.label}>Two-Factor Authentication</label>
              <p style={{fontSize: '13px', color: colors.textMuted, marginBottom: '12px'}}>
                Add an extra layer of security to your account
              </p>
              <button style={{...classes.btnBase, ...classes.btnGhost}}>
                <Lock size={16} style={{marginRight: '8px'}} />
                Enable 2FA
              </button>
            </div>
            
            <div style={{...classes.separator, margin: '24px 0'}} />

            <div>
              <label style={classes.label}>Active Sessions</label>
              <div style={{
                marginTop: '12px',
                padding: '16px',
                borderRadius: '8px',
                backgroundColor: currentTheme === 'dark' ? '#0f172a' : '#f8fafc',
                border: `1px solid ${colors.border}`,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <div style={{fontSize: '14px', fontWeight: 500}}>Current Session</div>
                  <div style={{fontSize: '12px', color: colors.textMuted}}>Chrome • Mumbai, India</div>
                </div>
                <button style={{
                  background: 'none', border: 'none', color: '#dc2626', fontSize: '13px', fontWeight: 500, cursor: 'pointer'
                }}>
                  Revoke
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}