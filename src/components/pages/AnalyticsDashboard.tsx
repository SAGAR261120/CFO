import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, Area, AreaChart, ReferenceLine, RadarChart,
  Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ComposedChart
} from 'recharts';
import {
  TrendingUp, DollarSign, Target, Activity, Settings, RefreshCw,
  ChevronDown, ChevronUp, AlertTriangle, Clock, ArrowUp,
  Info, Sparkles, Zap, BarChart3, Loader2, AlertCircle,
  IndianRupee, Euro, PoundSterling
} from 'lucide-react';

// --- TYPES ---
interface DashboardConfig {
  measure: string;
  comparison: string;
  granularity: string;
  benchmark: string;
  currency: string;
}

interface DashboardData {
  trendData: any[];
  varianceData: any[];
  anomalyData: any[];
  performanceMetrics: any[];
  monthlyRevenue: any[];
  sparklineData: any[];
  kpi: {
    current: number;
    vsTarget: number;
    avg3m: number;
    mape: number;
  };
}

// --- CURRENCY CONFIGURATION ---
const CURRENCY_CONFIG: Record<string, { label: string, symbol: string, rate: number, suffix: string, icon: any }> = {
  INR: { label: 'INR (₹)', symbol: '₹', rate: 1, suffix: 'L', icon: IndianRupee },
  USD: { label: 'USD ($)', symbol: '$', rate: 0.012, suffix: 'M', icon: DollarSign },
  GBP: { label: 'GBP (£)', symbol: '£', rate: 0.0095, suffix: 'M', icon: PoundSterling },
  EUR: { label: 'EUR (€)', symbol: '€', rate: 0.011, suffix: 'M', icon: Euro }
};

// --- MOCK API GENERATOR ---
const mockFetchData = (config: DashboardConfig): Promise<DashboardData> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // 1. Simulate randomized failure
      if (Math.random() > 0.99) {
        reject("API Gateway Timeout: Failed to fetch analytic cube data.");
        return;
      }

      // 2. Adjust base multipliers based on Measure & Currency
      let measureMultiplier = 1; 
      if (config.measure === 'ebitda') measureMultiplier = 0.25;
      if (config.measure === 'expenses') measureMultiplier = 0.75;

      const currencyRate = CURRENCY_CONFIG[config.currency]?.rate || 1;
      const combinedMultiplier = measureMultiplier * currencyRate;

      // 3. Generate Trend Data based on Granularity
      let trendData = [];
      if (config.granularity === 'quarterly') {
        const quarters = ['Q1', 'Q2', 'Q3', 'Q4', 'Q1 \'25'];
        trendData = quarters.map((q, i) => ({
          month: q,
          actual: i === 4 ? 0 : parseFloat(((280 + Math.random() * 40) * combinedMultiplier).toFixed(2)),
          budget: parseFloat(((270 + Math.random() * 30) * combinedMultiplier).toFixed(2)),
          forecast: i === 4 ? parseFloat(((320) * combinedMultiplier).toFixed(2)) : 0,
          yoy: parseFloat(((250 + (i * 10)) * combinedMultiplier).toFixed(2))
        }));
      } else {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan \'25', 'Feb \'25'];
        trendData = months.map((m, i) => {
          const isFuture = i > 11;
          const baseVal = 85 + (i * 2);
          return {
            month: m,
            actual: isFuture ? 0 : parseFloat(((baseVal + Math.random() * 10) * combinedMultiplier).toFixed(2)),
            budget: parseFloat(((baseVal) * combinedMultiplier).toFixed(2)),
            forecast: isFuture ? parseFloat(((baseVal + 5) * combinedMultiplier).toFixed(2)) : 0,
            yoy: parseFloat(((baseVal - 10) * combinedMultiplier).toFixed(2))
          };
        });
      }

      // 4. Adjust Comparison Data
      if (config.comparison === 'forecast') {
        trendData = trendData.map(d => ({
          ...d,
          budget: parseFloat((d.budget * 1.05).toFixed(2))
        }));
      }

      // 5. Generate Variance Data
      const categories = ['Sales & Mkt', 'Operations', 'R&D', 'Admin', 'CS', 'Product'];
      const varianceData = categories.map(cat => {
        const budget = parseFloat(((Math.random() * 50 + 20) * combinedMultiplier).toFixed(2));
        const actual = parseFloat((budget * (0.8 + Math.random() * 0.4)).toFixed(2));
        const variance = parseFloat((actual - budget).toFixed(2));
        return {
          category: cat,
          budget,
          actual,
          variance,
          variancePct: parseFloat(((variance / budget) * 100).toFixed(1))
        };
      });

      // 6. Generate Anomalies
      const anomalyData = [
        { metric: `Daily ${config.measure === 'ebitda' ? 'Margin' : 'Revenue'}`, expected: (3.5 * combinedMultiplier).toFixed(2), actual: (4.2 * combinedMultiplier).toFixed(2), deviation: 0.7, zScore: 2.8, significance: 'High', rootCause: 'New enterprise deal closed', action: 'Monitor pipeline' },
        { metric: 'COGS %', expected: 55, actual: 65, deviation: 10, zScore: 2.4, significance: 'Medium', rootCause: 'Vendor pricing ↑12%', action: 'Renegotiate terms' },
        { metric: 'Churn', expected: 2.1, actual: 3.8, deviation: 1.7, zScore: 3.2, significance: 'High', rootCause: 'Feature delays', action: 'Retention campaign' },
      ];

      // 7. KPIs
      const kpi = {
        current: parseFloat(((110 * combinedMultiplier)).toFixed(2)),
        vsTarget: config.benchmark === 'industry' ? -2.5 : 0.0,
        avg3m: parseFloat(((106.3 * combinedMultiplier)).toFixed(2)),
        mape: config.comparison === 'forecast' ? 4.2 : 8.5
      };

      resolve({
        trendData,
        varianceData,
        anomalyData,
        performanceMetrics: [
          { metric: 'Growth', value: 92, target: config.benchmark === 'industry' ? 95 : 85 },
          { metric: 'Margin', value: 78, target: 75 },
          { metric: 'Retention', value: 68, target: 80 },
          { metric: 'Efficiency', value: 85, target: 80 },
          { metric: 'Mkt Share', value: 72, target: 70 },
          { metric: 'Innovation', value: 88, target: 85 },
        ],
        monthlyRevenue: [
          { month: 'Jul', revenue: parseFloat((245 * combinedMultiplier).toFixed(2)), expenses: parseFloat((198 * combinedMultiplier).toFixed(2)), profit: parseFloat((47 * combinedMultiplier).toFixed(2)) },
          { month: 'Aug', revenue: parseFloat((265 * combinedMultiplier).toFixed(2)), expenses: parseFloat((205 * combinedMultiplier).toFixed(2)), profit: parseFloat((60 * combinedMultiplier).toFixed(2)) },
          { month: 'Sep', revenue: parseFloat((285 * combinedMultiplier).toFixed(2)), expenses: parseFloat((215 * combinedMultiplier).toFixed(2)), profit: parseFloat((70 * combinedMultiplier).toFixed(2)) },
          { month: 'Oct', revenue: parseFloat((275 * combinedMultiplier).toFixed(2)), expenses: parseFloat((210 * combinedMultiplier).toFixed(2)), profit: parseFloat((65 * combinedMultiplier).toFixed(2)) },
          { month: 'Nov', revenue: parseFloat((270 * combinedMultiplier).toFixed(2)), expenses: parseFloat((208 * combinedMultiplier).toFixed(2)), profit: parseFloat((62 * combinedMultiplier).toFixed(2)) },
          { month: 'Dec', revenue: parseFloat((295 * combinedMultiplier).toFixed(2)), expenses: parseFloat((220 * combinedMultiplier).toFixed(2)), profit: parseFloat((75 * combinedMultiplier).toFixed(2)) },
        ],
        sparklineData: [
          { value: 98 }, { value: 102 }, { value: 108 }, { value: 105 }, { value: 104 }, { value: 110 }, { value: 115 }
        ],
        kpi
      });
    }, 600);
  });
};

// --- DYNAMIC STYLE HELPERS ---
const getKpiCardStyle = (color: string): React.CSSProperties => ({
  backgroundColor: '#fff',
  borderRadius: '12px',
  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.025)',
  padding: '20px',
  borderLeft: `4px solid ${color}`,
  position: 'relative',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between'
});

const getBadgeStyle = (type: string): React.CSSProperties => ({
  display: 'inline-flex',
  alignItems: 'center',
  padding: '2px 8px',
  borderRadius: '9999px',
  fontSize: '12px',
  fontWeight: 400,
  fontFamily: 'Inter, sans-serif',
  backgroundColor: type === 'High' ? '#fee2e2' : '#fef3c7',
  color: type === 'High' ? '#991b1b' : '#92400e',
});

const getIconBoxStyle = (bg: string, color: string): React.CSSProperties => ({
  padding: '10px',
  backgroundColor: bg,
  borderRadius: '10px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: color,
});

export default function AnalyticsDashboard() {
  // --- STATE ---
  const [isSettingsOpen, setIsSettingsOpen] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState('Jan 24, 2025 – 09:42 AM IST');
  const [showYoY, setShowYoY] = useState(false);
  const [sortBy, setSortBy] = useState('variance');
  const [error, setError] = useState<string | null>(null);

  // Configuration State
  const [config, setConfig] = useState<DashboardConfig>({
    measure: 'revenue',
    comparison: 'budget',
    granularity: 'monthly',
    benchmark: 'internal',
    currency: localStorage.getItem('currency') || 'INR'
  });

  // Data State
  const [data, setData] = useState<DashboardData | null>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // --- Global Event Listener for Currency Change (Optional sync with Header) ---
  useEffect(() => {
    const handleCurrencyChange = (e: CustomEvent) => {
      setConfig(prev => ({ ...prev, currency: e.detail }));
    };

    window.addEventListener('currency-change', handleCurrencyChange as EventListener);
    return () => {
      window.removeEventListener('currency-change', handleCurrencyChange as EventListener);
    };
  }, []);

  // --- FETCHING LOGIC ---
  const fetchData = useCallback(async (currentConfig: DashboardConfig) => {
    setIsRefreshing(true);
    setError(null);
    try {
      const result = await mockFetchData(currentConfig);
      setData(result);
      setLastRefresh(new Date().toLocaleString());
    } catch (err: any) {
      setError(err.toString());
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  // Debounced Effect for Config Changes
  useEffect(() => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);

    debounceTimerRef.current = setTimeout(() => {
      fetchData(config);
    }, 500);

    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [config, fetchData]);

  // Manual Refresh Handler
  const handleManualRefresh = () => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    fetchData(config);
  };

  const handleConfigChange = (key: keyof DashboardConfig, value: string) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  // --- HELPERS ---
  const getCurrency = () => CURRENCY_CONFIG[config.currency] || CURRENCY_CONFIG.INR;
  const CurrencyIcon = getCurrency().icon;

  const formatCurrencyVal = (val: number) => {
    const { symbol, suffix } = getCurrency();
    return `${symbol}${val}${suffix}`;
  };

  // Derived State
  const sortedVarianceData = data ? [...data.varianceData].sort((a, b) => {
    if (sortBy === 'variance') return Math.abs(b.variance) - Math.abs(a.variance);
    return Math.abs(b.variancePct) - Math.abs(a.variancePct);
  }) : [];

  // --- STATIC STYLES ---
  const styles: { [key: string]: React.CSSProperties } = {
    container: {
      padding: '24px',
      maxWidth: '1600px',
      margin: '0 auto',
      fontFamily: 'Inter, sans-serif',
      backgroundColor: '#f8fafc',
      minHeight: '100vh',
      color: '#0f172a',
      position: 'relative',
    },
    card: {
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
      border: '1px solid #e2e8f0',
      marginBottom: '24px',
      overflow: 'hidden',
    },
    cardHeader: {
      padding: '20px',
      borderBottom: '1px solid #f1f5f9',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      background: 'linear-gradient(to right, #f8fafc, #ffffff)',
    },
    cardTitle: {
      fontSize: '15px',
      fontWeight: 500,
      fontFamily: 'Poppins, sans-serif',
      color: '#334155',
      margin: 0,
      lineHeight: '1.5',
    },
    subTitle: {
        fontSize: '13px',
        fontWeight: 400,
        fontFamily: 'Inter, sans-serif',
        color: '#64748b',
        margin: '4px 0 0 0',
        lineHeight: '1.4',
    },
    cardContent: {
      padding: '24px',
      position: 'relative',
    },
    grid5: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '24px',
      marginBottom: '24px',
    },
    grid4: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '24px',
      marginBottom: '24px',
    },
    grid2: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
      gap: '24px',
      marginBottom: '24px',
    },
    label: {
      display: 'block',
      fontSize: '13px',
      fontWeight: 400,
      fontFamily: 'Inter, sans-serif',
      color: '#64748b',
      marginBottom: '8px',
      lineHeight: '1.4',
    },
    select: {
      width: '100%',
      padding: '8px 12px',
      borderRadius: '6px',
      border: '1px solid #e2e8f0',
      fontSize: '14px',
      fontFamily: 'Inter, sans-serif',
      fontWeight: 400,
      backgroundColor: '#fff',
      color: '#334155',
      outline: 'none',
      lineHeight: '1.5',
      cursor: isRefreshing ? 'not-allowed' : 'pointer',
      opacity: isRefreshing ? 0.7 : 1,
    },
    tableHeader: {
      padding: '12px 16px',
      textAlign: 'left',
      fontSize: '12px',
      fontWeight: 500,
      fontFamily: 'Poppins, sans-serif',
      color: '#64748b',
      textTransform: 'uppercase',
      backgroundColor: '#f8fafc',
      borderBottom: '1px solid #e2e8f0',
      lineHeight: '1.4',
    },
    tableCell: {
      padding: '16px',
      fontSize: '13px',
      fontFamily: 'Inter, sans-serif',
      fontWeight: 400,
      borderBottom: '1px solid #f1f5f9',
      color: '#334155',
      lineHeight: '1.5',
    },
    button: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '8px 16px',
      borderRadius: '6px',
      fontSize: '13px',
      fontWeight: 400,
      fontFamily: 'Inter, sans-serif',
      cursor: 'pointer',
      border: 'none',
      backgroundColor: '#2563eb',
      color: 'white',
      transition: 'background 0.2s',
      lineHeight: '1.5',
    },
    loadingOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(255,255,255,0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10,
      backdropFilter: 'blur(1px)'
    }
  };

  // Safe Render helper to handle null data during first load
  if (!data && !error) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px' }}>
        <Loader2 className="animate-spin" color="#2563eb" size={48} />
        <span style={{ fontFamily: 'Inter, sans-serif', color: '#64748b' }}>Initializing Dashboard...</span>
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } } .animate-spin { animation: spin 1s linear infinite; }`}</style>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400&family=Poppins:wght@400;500&display=swap');
          @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } } 
          .animate-spin { animation: spin 1s linear infinite; }
        `}
      </style>

      {/* ERROR ALERT */}
      {error && (
        <div style={{ 
          marginBottom: '24px', padding: '16px', backgroundColor: '#fef2f2', 
          border: '1px solid #fee2e2', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '12px', color: '#991b1b' 
        }}>
          <AlertCircle size={20} />
          <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px' }}>{error}</span>
          <button onClick={handleManualRefresh} style={{ marginLeft: 'auto', background: 'white', border: '1px solid #fca5a5', padding: '4px 12px', borderRadius: '4px', cursor: 'pointer', color: '#991b1b' }}>Retry</button>
        </div>
      )}
      
      {/* --- CONFIGURATION SETTINGS --- */}
      <div style={styles.card}>
        <div 
          style={{ ...styles.cardHeader, cursor: 'pointer' }} 
          onClick={() => setIsSettingsOpen(!isSettingsOpen)}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={getIconBoxStyle('#dbeafe', '#2563eb')}>
              <Settings size={18} />
            </div>
            <span style={styles.cardTitle}>Configuration Settings</span>
          </div>
          {isSettingsOpen ? <ChevronUp size={18} color="#64748b" /> : <ChevronDown size={18} color="#64748b" />}
        </div>
        
        {isSettingsOpen && (
          <div style={styles.cardContent}>
            <div style={styles.grid5}>
              <div>
                <label style={styles.label}>Measure</label>
                <select 
                  style={styles.select} 
                  value={config.measure} 
                  onChange={(e) => handleConfigChange('measure', e.target.value)}
                  disabled={isRefreshing}
                >
                  <option value="revenue">Revenue</option>
                  <option value="ebitda">EBITDA</option>
                  <option value="expenses">Expenses</option>
                </select>
              </div>
              <div>
                <label style={styles.label}>Comparison</label>
                <select 
                  style={styles.select} 
                  value={config.comparison}
                  onChange={(e) => handleConfigChange('comparison', e.target.value)}
                  disabled={isRefreshing}
                >
                  <option value="budget">Actual vs Budget</option>
                  <option value="forecast">Actual vs Forecast</option>
                </select>
              </div>
              <div>
                <label style={styles.label}>Granularity</label>
                <select 
                  style={styles.select} 
                  value={config.granularity}
                  onChange={(e) => handleConfigChange('granularity', e.target.value)}
                  disabled={isRefreshing}
                >
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                </select>
              </div>
              <div>
                <label style={styles.label}>Benchmark Source</label>
                <select 
                  style={styles.select} 
                  value={config.benchmark}
                  onChange={(e) => handleConfigChange('benchmark', e.target.value)}
                  disabled={isRefreshing}
                >
                  <option value="internal">Internal Target</option>
                  <option value="industry">Industry Avg</option>
                </select>
              </div>
              <div>
                <label style={styles.label}>Currency</label>
                <select 
                  style={styles.select} 
                  value={config.currency}
                  onChange={(e) => handleConfigChange('currency', e.target.value)}
                  disabled={isRefreshing}
                >
                  {Object.keys(CURRENCY_CONFIG).map((key) => (
                    <option key={key} value={key}>{CURRENCY_CONFIG[key].label}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #e2e8f0', paddingTop: '16px', marginTop: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontFamily: 'Inter, sans-serif', fontWeight: 400, color: '#64748b', lineHeight: '1.4' }}>
                <Clock size={14} />
                <span>Last refreshed: {lastRefresh}</span>
              </div>
              <button 
                onClick={handleManualRefresh} 
                style={{ ...styles.button, backgroundColor: '#2563eb', opacity: isRefreshing ? 0.7 : 1, cursor: isRefreshing ? 'not-allowed' : 'pointer' }}
                disabled={isRefreshing}
              >
                <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
                {isRefreshing ? 'Refreshing...' : 'Refresh Analysis'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Global Loading Overlay for Dashboard Content */}
      <div style={{ position: 'relative', minHeight: '600px', opacity: isRefreshing ? 0.6 : 1, transition: 'opacity 0.2s' }}>
        {isRefreshing && (
          <div style={styles.loadingOverlay}>
             <Loader2 className="animate-spin" color="#2563eb" size={48} />
          </div>
        )}

        {/* --- KPI CARDS ROW --- */}
        <div style={styles.grid4}>
          
          {/* Card 1: Measure Value */}
          <div style={getKpiCardStyle('#2563eb')}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
              <span style={{ fontSize: '14px', fontFamily: 'Poppins, sans-serif', color: '#64748b', fontWeight: 400, lineHeight: '1.5' }}>
                Current {config.measure.charAt(0).toUpperCase() + config.measure.slice(1)}
              </span>
              <div style={getIconBoxStyle('#eff6ff', '#2563eb')}>
                <CurrencyIcon size={18} />
              </div>
            </div>
            <div>
              <div style={{ fontSize: '28px', fontFamily: 'Inter, sans-serif', fontWeight: 400, color: '#0f172a', lineHeight: '1.2' }}>
                {formatCurrencyVal(data?.kpi.current || 0)}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                <ArrowUp size={14} color="#16a34a" />
                <span style={{ fontSize: '13px', fontFamily: 'Inter, sans-serif', fontWeight: 400, color: '#16a34a', lineHeight: '1.4' }}>6% vs Nov 2024</span>
              </div>
              <div style={{ height: '40px', marginTop: '12px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data?.sparklineData || []}>
                    <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} dot={false} />
                    <Area type="monotone" dataKey="value" fill="#10b981" fillOpacity={0.2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Card 2: vs Comparison */}
          <div style={getKpiCardStyle('#16a34a')}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
              <span style={{ fontSize: '14px', fontFamily: 'Poppins, sans-serif', color: '#64748b', fontWeight: 400, lineHeight: '1.5' }}>
                vs {config.comparison.charAt(0).toUpperCase() + config.comparison.slice(1)}
              </span>
              <div style={getIconBoxStyle('#f0fdf4', '#16a34a')}>
                <Target size={18} />
              </div>
            </div>
            <div>
              <div style={{ fontSize: '28px', fontFamily: 'Inter, sans-serif', fontWeight: 400, color: '#0f172a', lineHeight: '1.2' }}>
                {data?.kpi.vsTarget}%
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px', color: '#16a34a', fontSize: '13px', fontFamily: 'Inter, sans-serif', fontWeight: 400, lineHeight: '1.4' }}>
                <Zap size={14} />
                <span>{config.benchmark === 'internal' ? 'On Target' : 'Vs Industry'}</span>
              </div>
              <div style={{ marginTop: '24px', height: '8px', backgroundColor: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '100%', height: '100%', backgroundColor: '#16a34a' }}></div>
              </div>
            </div>
          </div>

          {/* Card 3: 3M Avg */}
          <div style={getKpiCardStyle('#9333ea')}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
              <span style={{ fontSize: '14px', fontFamily: 'Poppins, sans-serif', color: '#64748b', fontWeight: 400, lineHeight: '1.5' }}>3M Avg</span>
              <div style={getIconBoxStyle('#f3e8ff', '#9333ea')}>
                <TrendingUp size={18} />
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                <div style={{ fontSize: '28px', fontFamily: 'Inter, sans-serif', fontWeight: 400, color: '#0f172a', lineHeight: '1.2' }}>
                  {formatCurrencyVal(data?.kpi.avg3m || 0)}
                </div>
                <ArrowUp size={16} color="#9333ea" />
              </div>
              <span style={{ fontSize: '13px', fontFamily: 'Inter, sans-serif', color: '#64748b', lineHeight: '1.4' }}>Rolling trend up</span>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '30px', marginTop: '16px' }}>
                {[40, 60, 50, 80, 70, 100].map((h, i) => (
                  <div key={i} style={{ flex: 1, backgroundColor: '#a855f7', opacity: 0.6, borderRadius: '2px', height: `${h}%` }}></div>
                ))}
              </div>
            </div>
          </div>

          {/* Card 4: Forecast MAPE */}
          <div style={getKpiCardStyle('#f97316')}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '14px', fontFamily: 'Poppins, sans-serif', color: '#64748b', fontWeight: 400, lineHeight: '1.5' }}>Forecast MAPE</span>
                <Info size={14} color="#94a3b8" />
              </div>
              <div style={getIconBoxStyle('#fff7ed', '#f97316')}>
                <Activity size={18} />
              </div>
            </div>
            <div>
              <div style={{ fontSize: '28px', fontFamily: 'Inter, sans-serif', fontWeight: 400, color: '#ea580c', lineHeight: '1.2' }}>
                {data?.kpi.mape}%
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px', color: '#64748b', fontSize: '13px', fontFamily: 'Inter, sans-serif', fontWeight: 400, lineHeight: '1.4' }}>
                <BarChart3 size={14} />
                <span>{data?.kpi.mape && data.kpi.mape < 10 ? 'Excellent' : 'Needs Review'}</span>
              </div>
              <div style={{ position: 'relative', marginTop: '24px', height: '8px', borderRadius: '4px', background: 'linear-gradient(90deg, #22c55e 0%, #eab308 50%, #ef4444 100%)' }}>
                <div style={{ position: 'absolute', top: '-3px', left: `${data?.kpi.mape ? data.kpi.mape * 4 : 35}%`, width: '14px', height: '14px', borderRadius: '50%', backgroundColor: '#fff', border: '3px solid #475569', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* --- AI INSIGHT --- */}
        <div style={{ ...styles.card, background: 'linear-gradient(to right, #eff6ff, #f5f3ff)', border: '1px solid #bfdbfe' }}>
          <div style={{ padding: '16px', display: 'flex', gap: '16px' }}>
            <div style={getIconBoxStyle('#dbeafe', '#2563eb')}>
              <Sparkles size={20} />
            </div>
            <p style={{ fontSize: '13px', fontFamily: 'Inter, sans-serif', fontWeight: 400, lineHeight: '1.6', color: '#1e3a8a', margin: 0 }}>
              <strong style={{ fontWeight: 500, fontFamily: 'Poppins, sans-serif' }}>AI Insight:</strong> {config.measure.charAt(0).toUpperCase() + config.measure.slice(1)} is tracking on target against {config.comparison}. 
              Forecast accuracy is {(data?.kpi?.mape ?? 0) < 10 ? 'strong' : 'volatile'}. 
              Detected {data?.anomalyData?.length ?? 0} anomalies, specifically in {data?.anomalyData?.[0]?.metric ?? 'N/A'}, requiring {data?.anomalyData?.[0]?.significance === 'High' ? 'urgent' : 'routine'} attention.
            </p>
          </div>
        </div>

        {/* --- TREND ANALYSIS CHART --- */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <div>
              <h3 style={styles.cardTitle}>Trend Analysis - {config.measure.charAt(0).toUpperCase() + config.measure.slice(1)} vs {config.comparison.charAt(0).toUpperCase() + config.comparison.slice(1)}</h3>
              <p style={styles.subTitle}>Historical performance with forecast and 95% confidence interval</p>
            </div>
            <button 
              onClick={() => setShowYoY(!showYoY)}
              style={{ padding: '6px 12px', border: '1px solid #e2e8f0', backgroundColor: '#fff', borderRadius: '6px', fontSize: '13px', fontFamily: 'Inter, sans-serif', fontWeight: 400, cursor: 'pointer', color: '#475569', lineHeight: '1.4' }}
            >
              {showYoY ? 'Hide YoY' : 'Show YoY'}
            </button>
          </div>
          <div style={styles.cardContent}>
            <ResponsiveContainer width="100%" height={400}>
              <ComposedChart data={data?.trendData}>
                <defs>
                  <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 12, fontFamily: 'Inter, sans-serif' }} axisLine={{ stroke: '#e2e8f0' }} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 12, fontFamily: 'Inter, sans-serif' }} axisLine={false} tickLine={false} tickFormatter={formatCurrencyVal} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', fontFamily: 'Inter, sans-serif' }}
                  itemStyle={{ fontSize: '13px' }}
                />
                <Legend wrapperStyle={{ fontFamily: 'Inter, sans-serif', fontSize: '12px' }} />
                <ReferenceLine x={config.granularity === 'quarterly' ? "Q4" : "Dec"} stroke="#94a3b8" strokeDasharray="3 3" label={{ value: 'Current', position: 'insideTopLeft', fill: '#64748b', fontSize: 12, fontFamily: 'Inter, sans-serif' }} />
                <Area type="monotone" dataKey="actual" stroke="#3b82f6" strokeWidth={3} fill="url(#colorActual)" name="Actual" />
                <Line type="monotone" dataKey="budget" name={config.comparison === 'budget' ? 'Budget' : 'Baseline'} stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 5" dot={{ fill: '#94a3b8', r: 4 }} />
                <Line type="monotone" dataKey="forecast" stroke="#8b5cf6" strokeWidth={3} strokeDasharray="8 4" name="Forecast" dot={false} />
                {showYoY && <Line type="monotone" dataKey="yoy" stroke="#10b981" strokeWidth={2} name="YoY" dot={false} />}
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* --- REVENUE & PERFORMANCE GRID --- */}
        <div style={styles.grid2}>
          {/* Bar Chart */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <h3 style={styles.cardTitle}>Monthly Breakdown: Revenue vs Expenses</h3>
            </div>
            <div style={styles.cardContent}>
              <p style={{ fontSize: '13px', fontFamily: 'Inter, sans-serif', fontWeight: 400, color: '#64748b', marginBottom: '16px', lineHeight: '1.4' }}>Breakdown of key financial components</p>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={data?.monthlyRevenue} barGap={0}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 12, fontFamily: 'Inter, sans-serif' }} axisLine={false} tickLine={false} />
                  <YAxis tickFormatter={formatCurrencyVal} tick={{ fill: '#64748b', fontSize: 12, fontFamily: 'Inter, sans-serif' }} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontFamily: 'Inter, sans-serif' }} />
                  <Legend iconType="circle" wrapperStyle={{ fontFamily: 'Inter, sans-serif', fontSize: '12px' }} />
                  <Bar dataKey="expenses" name="Expenses" fill="#fbbf24" radius={[4, 4, 0, 0]} barSize={20} />
                  <Bar dataKey="profit" name="Profit" fill="#10b981" radius={[4, 4, 0, 0]} barSize={20} />
                  <Bar dataKey="revenue" name="Revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Radar Chart */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <h3 style={styles.cardTitle}>Performance Metrics Overview</h3>
            </div>
            <div style={styles.cardContent}>
              <p style={{ fontSize: '13px', fontFamily: 'Inter, sans-serif', fontWeight: 400, color: '#64748b', marginBottom: '16px', lineHeight: '1.4' }}>Multi-dimensional assessment against {config.benchmark}</p>
              <ResponsiveContainer width="100%" height={350}>
                <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data?.performanceMetrics}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="metric" tick={{ fill: '#475569', fontSize: 11, fontFamily: 'Inter, sans-serif' }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar name="Current" dataKey="value" stroke="#3b82f6" strokeWidth={2} fill="#3b82f6" fillOpacity={0.4} />
                  <Radar name="Target" dataKey="target" stroke="#94a3b8" strokeWidth={2} fill="#94a3b8" fillOpacity={0.1} />
                  <Legend wrapperStyle={{ fontFamily: 'Inter, sans-serif', fontSize: '12px' }} />
                  <Tooltip contentStyle={{ fontFamily: 'Inter, sans-serif' }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* --- VARIANCE ANALYSIS --- */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h3 style={styles.cardTitle}>{config.comparison.charAt(0).toUpperCase() + config.comparison.slice(1)} Variance Analysis</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '12px', fontFamily: 'Inter, sans-serif', color: '#64748b', lineHeight: '1.4' }}>Sort by:</span>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                style={{ padding: '6px', borderRadius: '4px', border: '1px solid #e2e8f0', fontSize: '13px', fontFamily: 'Inter, sans-serif', fontWeight: 400, lineHeight: '1.4' }}
              >
                <option value="variance">Variance Amt</option>
                <option value="pct">Variance %</option>
              </select>
            </div>
          </div>
          <div style={styles.cardContent}>
            <p style={{ fontSize: '13px', fontFamily: 'Inter, sans-serif', fontWeight: 400, color: '#64748b', marginBottom: '10px', lineHeight: '1.4' }}>Click on a category for detailed drill-through analysis</p>
            <div style={{ height: '350px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sortedVarianceData}>
                  <defs>
                    <linearGradient id="colorVarBudget" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#94a3b8" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorVarActual" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="category" tick={{ fontSize: 12, fill: '#64748b', fontFamily: 'Inter, sans-serif' }} axisLine={{ stroke: '#e2e8f0' }} tickLine={false} />
                  <YAxis tickFormatter={formatCurrencyVal} tick={{ fontSize: 12, fill: '#64748b', fontFamily: 'Inter, sans-serif' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: '8px', fontFamily: 'Inter, sans-serif' }} />
                  <Legend verticalAlign="top" height={36} wrapperStyle={{ fontFamily: 'Inter, sans-serif', fontSize: '12px' }} />
                  <Area type="monotone" dataKey="actual" stroke="#0ea5e9" strokeWidth={2} fill="url(#colorVarActual)" name="Actual" />
                  <Area type="monotone" dataKey="budget" stroke="#94a3b8" strokeWidth={2} fill="url(#colorVarBudget)" name={config.comparison === 'budget' ? "Budget" : "Forecast"} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* --- ANOMALY DETECTION TABLE --- */}
        <div style={{ ...styles.card, border: '1px solid #fee2e2' }}>
          <div style={{ ...styles.cardHeader, backgroundColor: '#fef2f2', borderBottom: '1px solid #fee2e2' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ padding: '8px', backgroundColor: '#fee2e2', borderRadius: '50%', color: '#ef4444' }}>
                <AlertTriangle size={18} />
              </div>
              <div>
                <h3 style={{ ...styles.cardTitle, color: '#991b1b' }}>Anomaly Detection</h3>
                <p style={{ margin: 0, fontSize: '13px', fontFamily: 'Inter, sans-serif', fontWeight: 400, color: '#b91c1c', lineHeight: '1.4' }}>Detected {data?.anomalyData.length} anomalies this {config.granularity === 'quarterly' ? 'quarter' : 'month'}</p>
              </div>
            </div>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={styles.tableHeader}>Metric</th>
                  <th style={styles.tableHeader}>Expected</th>
                  <th style={styles.tableHeader}>Actual</th>
                  <th style={styles.tableHeader}>Deviation</th>
                  <th style={styles.tableHeader}>Z-Score</th>
                  <th style={styles.tableHeader}>Significance</th>
                  <th style={styles.tableHeader}>Severity Score</th>
                  <th style={styles.tableHeader}>Action Required</th>
                </tr>
              </thead>
              <tbody>
                {data?.anomalyData.map((item, index) => (
                  <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#fff' : '#fcfcfc' }}>
                    <td style={styles.tableCell}>
                      <div style={{ fontWeight: 400, color: '#0f172a', fontFamily: 'Inter, sans-serif' }}>{item.metric}</div>
                      <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px', fontFamily: 'Inter, sans-serif', lineHeight: '1.4' }}>{item.rootCause}</div>
                    </td>
                    <td style={styles.tableCell}>{formatCurrencyVal(parseFloat(item.expected))}</td>
                    <td style={styles.tableCell}>
                      <span style={{ fontWeight: 400, fontFamily: 'Inter, sans-serif' }}>{formatCurrencyVal(parseFloat(item.actual))}</span>
                    </td>
                    <td style={styles.tableCell}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 400, fontFamily: 'Inter, sans-serif', color: item.deviation > 0 ? '#dc2626' : '#ea580c' }}>
                        {item.deviation > 0 ? <ArrowUp size={14} /> : <ChevronDown size={14} />}
                        {Math.abs(item.deviation)}
                      </div>
                    </td>
                    <td style={styles.tableCell}>
                      <span style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #e2e8f0', fontSize: '12px', fontWeight: 400, fontFamily: 'Inter, sans-serif' }}>{item.zScore} σ</span>
                    </td>
                    <td style={styles.tableCell}>
                      <span style={getBadgeStyle(item.significance)}>{item.significance}</span>
                    </td>
                    <td style={styles.tableCell}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '60px', height: '8px', backgroundColor: item.zScore > 2.5 ? '#fee2e2' : '#fef3c7', borderRadius: '4px' }}>
                            <div style={{ height: '100%', width: `${(item.zScore / 4) * 100}%`, backgroundColor: item.zScore > 2.5 ? '#dc2626' : '#d97706', borderRadius: '4px' }}></div>
                          </div>
                          <span style={{ fontSize: '12px', fontWeight: 400, fontFamily: 'Inter, sans-serif' }}>{item.zScore > 2.5 ? '8.4' : '6.2'}</span>
                      </div>
                    </td>
                    <td style={styles.tableCell}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#475569', fontFamily: 'Inter, sans-serif' }}>
                        <Zap size={14} color="#f59e0b" fill="#f59e0b" />
                        {item.action}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}