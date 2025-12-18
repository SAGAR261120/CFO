import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Search, Bell, ChevronDown, LayoutGrid, ArrowRight, 
  Settings as SettingsIcon, FileText, BarChart2, Users, 
  AlertTriangle, DollarSign, PieChart 
} from 'lucide-react';

// --- TYPES ---
interface SearchItem {
  id: string;
  name: string;
  path: string;
  category: string;
  type: 'page' | 'setting' | 'metric' | 'report';
  description?: string; // Optional context for the user
  tab?: string;       // Only for type 'setting'
  highlight?: string; // Only for type 'setting'
}

// --- GLOBAL SEARCH INDEX (Simulates Full App Search) ---
const searchIndex: SearchItem[] = [
  // --- 1. MAIN PAGES ---
  { id: 'p-dash', name: 'Executive Summary', path: '/dashboard', category: 'Page', type: 'page' },
  { id: 'p-ana', name: 'Analytics Dashboard', path: '/analytics', category: 'Page', type: 'page' },
  { id: 'p-fin', name: 'Financial Overview', path: '/financial', category: 'Page', type: 'page' },
  { id: 'p-cli', name: 'Client Distribution', path: '/clients', category: 'Page', type: 'page' },
  { id: 'p-sales', name: 'Sales Insight', path: '/sales', category: 'Page', type: 'page' },

  // --- 2. METRICS & DATA (Deep links to specific dashboards) ---
  // Searching "Revenue" or "EBITDA" takes you to Financials
  { id: 'm-rev', name: 'Total Revenue', path: '/financial', category: 'Metric', type: 'metric', description: 'Financial Overview > Revenue' },
  { id: 'm-ebitda', name: 'EBITDA', path: '/financial', category: 'Metric', type: 'metric', description: 'Financial Overview > Profitability' },
  { id: 'm-net', name: 'Net Profit Margin', path: '/financial', category: 'Metric', type: 'metric', description: 'Financial Overview > Margins' },
  
  // Searching "Cash" or "Liquidity" takes you to Cashflow
  { id: 'm-cash', name: 'Cash Position', path: '/cashflow', category: 'Metric', type: 'metric', description: 'Cashflow > Current Status' },
  { id: 'm-inflow', name: 'Monthly Inflows', path: '/cashflow', category: 'Metric', type: 'metric', description: 'Cashflow > Inflows' },
  
  // Searching "Churn" or "Clients" takes you to CRM
  { id: 'm-churn', name: 'Client Churn Rate', path: '/clients', category: 'Metric', type: 'metric', description: 'Clients > Retention' },
  { id: 'm-acq', name: 'Customer Acquisition Cost (CAC)', path: '/clients', category: 'Metric', type: 'metric', description: 'Clients > Acquisition' },
  
  // Searching "Pipeline" takes you to Sales
  { id: 'm-pipe', name: 'Sales Pipeline Value', path: '/sales', category: 'Metric', type: 'metric', description: 'Sales > Forecast' },
  { id: 'm-conv', name: 'Lead Conversion Rate', path: '/sales', category: 'Metric', type: 'metric', description: 'Sales > Performance' },

  // Searching "Utilization" takes you to Operations
  { id: 'm-util', name: 'Resource Utilization', path: '/utilization', category: 'Metric', type: 'metric', description: 'Utilization > Bench Strength' },

  // --- 3. REPORTS & EXCEPTIONS ---
  { id: 'r-risk', name: 'High Risk Accounts', path: '/exception', category: 'Report', type: 'report', description: 'Exception > Risk' },
  { id: 'r-budget', name: 'Budget Variances', path: '/exception', category: 'Report', type: 'report', description: 'Exception > Budget' },
  { id: 'r-geo', name: 'Geographic Revenue Map', path: '/geo', category: 'Report', type: 'report', description: 'Geo Mix > Global' },

  // --- 4. SETTINGS (Deep Links) ---
  { id: 's-curr', name: 'Change Currency', path: '/settings', category: 'Settings', type: 'setting', tab: 'general', highlight: 'currency' },
  { id: 's-theme', name: 'Dark Mode / Theme', path: '/settings', category: 'Settings', type: 'setting', tab: 'display', highlight: 'theme' },
  { id: 's-lang', name: 'Language Settings', path: '/settings', category: 'Settings', type: 'setting', tab: 'general', highlight: 'language' },
  { id: 's-notif', name: 'Notification Preferences', path: '/settings', category: 'Settings', type: 'setting', tab: 'notifications', highlight: 'notifications' },
  { id: 's-pass', name: 'Two-Factor Authentication', path: '/settings', category: 'Settings', type: 'setting', tab: 'security', highlight: '2fa' },
  { id: 's-export', name: 'Data Export Format', path: '/settings', category: 'Settings', type: 'setting', tab: 'data', highlight: 'export' },
];

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchItem[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // --- Handle Search Logic ---
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(e.target.value);

    if (query.length > 0) {
      const filtered = searchIndex.filter(item => 
        // Search in Name
        item.name.toLowerCase().includes(query) ||
        // Search in Category
        item.category.toLowerCase().includes(query) ||
        // Search in Description (if exists)
        (item.description && item.description.toLowerCase().includes(query))
      );
      // Limit to 8 results for better UI
      setSearchResults(filtered.slice(0, 8));
    } else {
      setSearchResults([]);
    }
  };

  // --- Handle Navigation ---
  const handleResultClick = (item: SearchItem) => {
    if (item.type === 'setting') {
      // Deep link to settings with highlight logic
      navigate('/settings', { 
        state: { 
          targetTab: item.tab, 
          highlightId: item.highlight 
        } 
      });
    } else {
      // Standard navigation
      navigate(item.path);
    }
    setSearchQuery(''); 
    setIsFocused(false); 
  };

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Helper: Get Icon based on type
  const getResultIcon = (type: string) => {
    switch (type) {
      case 'setting': return <SettingsIcon size={16} color="#64748b" />;
      case 'metric': return <BarChart2 size={16} color="#2563eb" />;
      case 'report': return <AlertTriangle size={16} color="#f59e0b" />; // Amber for reports/alerts
      case 'page': default: return <FileText size={16} color="#64748b" />;
    }
  };

  // Breadcrumb Title Logic
  const getPageTitle = (path: string) => {
    const found = searchIndex.find(p => p.path === path && p.type === 'page');
    if (found) return found.name;
    if (path === '/') return 'Analytics Dashboard';
    if (path.includes('settings')) return 'Settings';
    return path.substring(1).charAt(0).toUpperCase() + path.slice(2);
  };

  const currentPageName = getPageTitle(location.pathname);

  // --- STYLES ---
  const styles = {
    container: {
      height: '64px',
      backgroundColor: '#ffffff',
      borderBottom: '1px solid #e2e8f0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 32px',
      position: 'sticky' as const,
      top: 0,
      zIndex: 40
    },
    breadcrumbs: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      color: '#64748b',
      fontSize: '14px'
    },
    searchContainer: {
      position: 'relative' as const,
      width: '400px' // Slightly wider for better results view
    },
    input: {
      height: '40px',
      width: '100%',
      backgroundColor: '#f8fafc',
      border: isFocused ? '1px solid #2563eb' : '1px solid #e2e8f0',
      borderRadius: '8px',
      paddingLeft: '40px',
      paddingRight: '12px',
      fontSize: '14px',
      outline: 'none',
      color: '#0f172a',
      transition: 'all 0.2s ease',
      boxShadow: isFocused ? '0 0 0 2px rgba(37,99,235,0.1)' : 'none'
    },
    dropdown: {
      position: 'absolute' as const,
      top: '48px',
      left: 0,
      width: '100%',
      backgroundColor: '#ffffff',
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      zIndex: 50,
      maxHeight: '400px',
      overflowY: 'auto' as const,
      padding: '8px 0',
    },
    resultItem: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '10px 16px',
      cursor: 'pointer',
      borderBottom: '1px solid #f8fafc',
      transition: 'background-color 0.15s ease'
    },
    resultContent: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    iconWrapper: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '32px',
      height: '32px',
      borderRadius: '6px',
      backgroundColor: '#f1f5f9',
    },
    textGroup: {
      display: 'flex',
      flexDirection: 'column' as const,
    },
    resultName: {
      fontSize: '14px',
      color: '#0f172a',
      fontWeight: '500',
    },
    resultMeta: {
      fontSize: '11px',
      color: '#64748b',
      marginTop: '2px',
    },
    badge: {
      position: 'absolute' as const, 
      top: '-6px', 
      right: '-4px', 
      backgroundColor: '#ef4444', 
      color: 'white', 
      fontSize: '10px', 
      width: '16px', 
      height: '16px', 
      borderRadius: '50%', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      fontWeight: 'bold'
    },
    avatar: { 
      width: '32px', 
      height: '32px', 
      borderRadius: '50%', 
      backgroundColor: '#2563eb', 
      color: 'white', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      fontWeight: '600', 
      fontSize: '14px'
    }
  };

  return (
    <div style={styles.container}>
      {/* Breadcrumbs */}
      <div style={styles.breadcrumbs}>
        <LayoutGrid size={18} />
        <span>CFO Dashboard</span>
        <span style={{ color: '#cbd5e1' }}>{'>'}</span>
        <span style={{ color: '#0f172a', fontWeight: '500' }}>{currentPageName}</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        
        {/* Search Bar */}
        <div style={styles.searchContainer} ref={searchRef}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input 
            type="text" 
            placeholder="Search metrics, reports, settings..." 
            style={styles.input}
            value={searchQuery}
            onChange={handleSearch}
            onFocus={() => setIsFocused(true)}
            autoComplete="off"
          />

          {isFocused && searchQuery.length > 0 && (
            <div style={styles.dropdown}>
              {searchResults.length > 0 ? (
                <>
                  <div style={{ padding: '8px 16px', fontSize: '11px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase' }}>
                    Results
                  </div>
                  {searchResults.map((result) => (
                    <div 
                      key={result.id}
                      style={styles.resultItem}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      onClick={() => handleResultClick(result)}
                    >
                      <div style={styles.resultContent}>
                          <div style={styles.iconWrapper}>
                            {getResultIcon(result.type)}
                          </div>
                          <div style={styles.textGroup}>
                            <span style={styles.resultName}>{result.name}</span>
                            <span style={styles.resultMeta}>
                              {result.description ? result.description : result.category}
                            </span>
                          </div>
                      </div>
                      <ArrowRight size={14} color="#cbd5e1" />
                    </div>
                  ))}
                </>
              ) : (
                <div style={{ padding: '24px', textAlign: 'center', color: '#94a3b8' }}>
                  <p style={{ fontSize: '14px', marginBottom: '4px' }}>No results found</p>
                  <p style={{ fontSize: '12px' }}>Try searching for "Revenue", "Theme", or "Clients"</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ position: 'relative', cursor: 'pointer' }}>
            <Bell size={20} color="#64748b" />
            <span style={styles.badge}>3</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <div style={styles.avatar}>D</div>
            <ChevronDown size={16} color="#64748b" />
          </div>
        </div>
      </div>
    </div>
  );
}