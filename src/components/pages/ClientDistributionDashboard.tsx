import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, PieChart, Pie, Cell, BarChart, ReferenceLine,
  LabelList
} from 'recharts';
import { 
  Lightbulb, TrendingUp, TrendingDown, AlertTriangle, 
  Minus, ArrowUpRight, ArrowDownRight, Info, ChevronDown, Check, RefreshCw
} from 'lucide-react';

// --- STYLES & CONSTANTS ---
const colors = {
  slate50: '#f8fafc',
  slate100: '#f1f5f9',
  slate200: '#e2e8f0',
  slate400: '#94a3b8',
  slate500: '#64748b',
  slate600: '#475569',
  slate700: '#334155',
  slate800: '#1e293b',
  slate900: '#0f172a',
  
  blue50: '#eff6ff',
  blue100: '#dbeafe',
  blue200: '#bfdbfe',
  blue500: '#3b82f6',
  blue600: '#2563eb',
  blue700: '#1d4ed8',
  blue900: '#1e3a8a',
  
  amber50: '#fffbeb',
  amber100: '#fef3c7',
  amber200: '#fde68a',
  amber500: '#f59e0b',
  amber600: '#d97706',
  amber700: '#b45309',
  amber800: '#92400e',
  amber900: '#78350f',
  
  red50: '#fef2f2',
  red100: '#fee2e2',
  red200: '#fecaca',
  red500: '#ef4444',
  red600: '#dc2626',
  red700: '#b91c1c',
  red800: '#991b1b',
  
  green50: '#f0fdf4',
  green100: '#dcfce7',
  green200: '#bbf7d0',
  green500: '#22c55e',
  green600: '#16a34a',
  green700: '#15803d',
  green800: '#166534',
  
  white: '#ffffff',
  purple: '#8b5cf6',
};

const baseTextStyle = { fontFamily: 'Inter, sans-serif', color: colors.slate900 };

const CURRENCIES: any = {
  INR: { label: 'INR', symbol: '₹', rate: 1 },
  USD: { label: 'USD', symbol: '$', rate: 0.012 },
  GBP: { label: 'GBP', symbol: '£', rate: 0.0095 },
  EUR: { label: 'EUR', symbol: '€', rate: 0.011 },
};

// --- STATIC DATA (Source of Truth) ---
const RAW_PARETO_DATA = [
  { rank: 1, name: 'TechCorp Solutions', revenue: 12.5, category: 'Enterprise', gm: 48 },
  { rank: 2, name: 'Innovation Labs', revenue: 10.8, category: 'Enterprise', gm: 52 },
  { rank: 3, name: 'Global Systems Inc', revenue: 9.2, category: 'Enterprise', gm: 45 },
  { rank: 4, name: 'Digital Dynamics', revenue: 7.5, category: 'Large Corp', gm: 49 },
  { rank: 5, name: 'Smart Solutions', revenue: 6.3, category: 'Large Corp', gm: 46 },
  { rank: 6, name: 'Tech Innovations', revenue: 5.8, category: 'Large Corp', gm: 44 },
  { rank: 7, name: 'Future Systems', revenue: 5.2, category: 'Large Corp', gm: 47 },
  { rank: 8, name: 'Alpha Technologies', revenue: 4.8, category: 'Large Corp', gm: 43 },
  { rank: 9, name: 'Beta Enterprises', revenue: 4.2, category: 'Mid Market', gm: 41 },
  { rank: 10, name: 'Gamma Corp', revenue: 3.8, category: 'Mid Market', gm: 42 },
  { rank: 11, name: 'Delta Systems', revenue: 3.2, category: 'Mid Market', gm: 40 },
  { rank: 12, name: 'Epsilon Tech', revenue: 2.8, category: 'Mid Market', gm: 39 },
  { rank: 13, name: 'Zeta Solutions', revenue: 2.4, category: 'Mid Market', gm: 38 },
  { rank: 14, name: 'Eta Innovations', revenue: 2.0, category: 'Mid Market', gm: 37 },
  { rank: 15, name: 'Theta Systems', revenue: 1.6, category: 'SMB', gm: 35 },
  { rank: 16, name: 'Iota Tech', revenue: 1.2, category: 'SMB', gm: 34 },
  { rank: 17, name: 'Kappa Corp', revenue: 0.8, category: 'SMB', gm: 32 },
  { rank: 18, name: 'Lambda Ltd', revenue: 0.5, category: 'SMB', gm: 31 },
  { rank: 19, name: 'Mu Solutions', revenue: 0.4, category: 'SMB', gm: 30 },
  { rank: 20, name: 'Nu Enterprises', revenue: 0.2, category: 'SMB', gm: 29 },
];

const RAW_SEGMENTATION_DATA = [
  { name: 'Enterprise', revenue: 58.2, count: 12, avgMargin: 48, growth: 12, color: '#14b8a6' },
  { name: 'Large Corp', revenue: 26.5, count: 28, avgMargin: 45, growth: 8, color: '#3b82f6' },
  { name: 'Mid Market', revenue: 13.8, count: 65, avgMargin: 39, growth: 3, color: '#f59e0b' },
  { name: 'SMB', revenue: 1.5, count: 145, avgMargin: 32, growth: 0, color: '#94a3b8' },
];

const RAW_DECILE_DATA = [
  { decile: 'D1', revenue: 32.5, gm: 49, yoy: 14, profit: 15.9 },
  { decile: 'D2', revenue: 18.2, gm: 46, yoy: 11, profit: 8.4 },
  { decile: 'D3', revenue: 12.8, gm: 44, yoy: 8, profit: 5.6 },
  { decile: 'D4', revenue: 9.5, gm: 42, yoy: 6, profit: 4.0 },
  { decile: 'D5', revenue: 7.3, gm: 40, yoy: 4, profit: 2.9 },
  { decile: 'D6', revenue: 5.8, gm: 38, yoy: 2, profit: 2.2 },
  { decile: 'D7', revenue: 4.6, gm: 36, yoy: 1, profit: 1.7 },
  { decile: 'D8', revenue: 3.8, gm: 34, yoy: -1, profit: 1.3 },
  { decile: 'D9', revenue: 3.2, gm: 32, yoy: -2, profit: 1.0 },
  { decile: 'D10', revenue: 2.3, gm: 28, yoy: -5, profit: 0.6 },
];

const RAW_TOP_CUSTOMERS = [
  { rank: 1, name: 'TechCorp Solutions', revenue: 12.5, profit: 6.0, gm: 48, gmTrend: 'up', invoices: 142, avgTicket: 88, dso: 28, growth: 18, risk: 'Low', lastInvoice: 'Dec 20, 2024' },
  { rank: 2, name: 'Innovation Labs', revenue: 10.8, profit: 5.6, gm: 52, gmTrend: 'up', invoices: 128, avgTicket: 84, dso: 24, growth: 22, risk: 'Low', lastInvoice: 'Dec 22, 2024' },
  { rank: 3, name: 'Global Systems Inc', revenue: 9.2, profit: 4.1, gm: 45, gmTrend: 'same', invoices: 98, avgTicket: 94, dso: 32, growth: 15, risk: 'Low', lastInvoice: 'Dec 18, 2024' },
  { rank: 4, name: 'Digital Dynamics', revenue: 7.5, profit: 3.7, gm: 49, gmTrend: 'up', invoices: 86, avgTicket: 87, dso: 35, growth: 12, risk: 'Medium', lastInvoice: 'Dec 15, 2024' },
  { rank: 5, name: 'Smart Solutions', revenue: 6.3, profit: 2.9, gm: 46, gmTrend: 'same', invoices: 72, avgTicket: 88, dso: 42, growth: 9, risk: 'Medium', lastInvoice: 'Dec 19, 2024' },
  { rank: 6, name: 'Tech Innovations', revenue: 5.8, profit: 2.6, gm: 44, gmTrend: 'down', invoices: 64, avgTicket: 91, dso: 38, growth: 6, risk: 'Medium', lastInvoice: 'Dec 21, 2024' },
  { rank: 7, name: 'Future Systems', revenue: 5.2, profit: 2.4, gm: 47, gmTrend: 'up', invoices: 58, avgTicket: 90, dso: 29, growth: 14, risk: 'Low', lastInvoice: 'Dec 23, 2024' },
  { rank: 8, name: 'Alpha Technologies', revenue: 4.8, profit: 2.1, gm: 43, gmTrend: 'same', invoices: 52, avgTicket: 92, dso: 48, growth: 4, risk: 'High', lastInvoice: 'Dec 12, 2024' },
  { rank: 9, name: 'Beta Enterprises', revenue: 4.2, profit: 1.7, gm: 41, gmTrend: 'down', invoices: 48, avgTicket: 88, dso: 52, growth: -2, risk: 'High', lastInvoice: 'Dec 10, 2024' },
  { rank: 10, name: 'Gamma Corp', revenue: 3.8, profit: 1.6, gm: 42, gmTrend: 'same', invoices: 42, avgTicket: 90, dso: 36, growth: 8, risk: 'Medium', lastInvoice: 'Dec 17, 2024' },
];

// --- MOCK UI COMPONENTS ---

const Card = ({ children, style }: any) => (
  <div style={{ backgroundColor: colors.white, borderRadius: '8px', border: `1px solid ${colors.slate200}`, boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', marginBottom: '24px', display: 'flex', flexDirection: 'column', ...style }}>{children}</div>
);
const CardHeader = ({ children, style }: any) => (<div style={{ padding: '24px 24px 0 24px', display: 'flex', flexDirection: 'column', gap: '6px', ...style }}>{children}</div>);
const CardTitle = ({ children }: any) => (<h3 style={{ margin: 0, fontSize: '15px', fontWeight: 500, lineHeight: 1.5, color: colors.slate900, fontFamily: 'Poppins, sans-serif' }}>{children}</h3>);
const CardContent = ({ children, style }: any) => (<div style={{ padding: '24px', ...style }}>{children}</div>);
const Badge = ({ children, variant = "default", style }: any) => {
  let bg = colors.slate900, text = colors.slate50, border = 'transparent';
  if (variant === 'outline') { bg = colors.white; text = colors.slate900; border = colors.slate200; }
  return (<div style={{ display: 'inline-flex', alignItems: 'center', borderRadius: '9999px', border: `1px solid ${border}`, padding: '2px 10px', fontSize: '12px', fontWeight: 600, backgroundColor: bg, color: text, lineHeight: 1, fontFamily: 'Inter, sans-serif', ...style }}>{children}</div>);
};
const Button = ({ children, variant = "default", size = "default", style, ...props }: any) => {
  const isOutline = variant === 'outline';
  return (<button style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRadius: '6px', fontSize: '14px', fontWeight: 500, padding: size === 'sm' ? '8px 12px' : '10px 16px', height: size === 'sm' ? '36px' : '40px', backgroundColor: isOutline ? colors.white : colors.slate900, color: isOutline ? colors.slate900 : colors.slate50, border: isOutline ? `1px solid ${colors.slate200}` : 'none', cursor: 'pointer', transition: 'background-color 0.2s', fontFamily: 'Inter, sans-serif', ...style }} {...props}>{children}</button>);
};
const Alert = ({ children, style }: any) => (<div style={{ position: 'relative', width: '100%', borderRadius: '8px', border: `1px solid ${colors.blue100}`, backgroundColor: colors.blue50, padding: '16px', display: 'flex', alignItems: 'flex-start', gap: '12px', ...style }}>{children}</div>);
const AlertDescription = ({ children }: any) => (<div style={{ fontSize: '13px', color: colors.slate700, lineHeight: 1.6, fontFamily: 'Inter, sans-serif' }}>{children}</div>);

// Styled Native Select
const StyledSelect = ({ value, onChange, options, width = '200px' }: any) => (
  <div style={{ position: 'relative', width: width }}>
    <select 
      value={value} 
      onChange={(e) => onChange(e.target.value)}
      style={{
        appearance: 'none', width: '100%', height: '36px', padding: '0 32px 0 12px',
        borderRadius: '6px', border: `1px solid ${colors.slate200}`, backgroundColor: colors.white,
        fontSize: '14px', color: colors.slate700, cursor: 'pointer', fontFamily: 'Inter, sans-serif', outline: 'none'
      }}
    >
      {options.map((opt: any) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
    </select>
    <ChevronDown size={16} style={{ position: 'absolute', right: '10px', top: '10px', pointerEvents: 'none', opacity: 0.5 }} />
  </div>
);

// Table Components
const Table = ({ children }: any) => <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', fontFamily: 'Inter, sans-serif' }}>{children}</table>;
const TableHeader = ({ children }: any) => <thead style={{ backgroundColor: colors.slate50 }}>{children}</thead>;
const TableBody = ({ children }: any) => <tbody>{children}</tbody>;
const TableRow = ({ children, style }: any) => (<tr style={{ borderBottom: `1px solid ${colors.slate200}`, transition: 'background-color 0.1s', ...style }}>{children}</tr>);
const TableHead = ({ children, align = 'left' }: any) => (<th style={{ height: '40px', padding: '0 16px', textAlign: align as any, verticalAlign: 'middle', fontWeight: 500, fontFamily: 'Poppins, sans-serif', color: colors.slate500, textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.05em' }}>{children}</th>);
const TableCell = ({ children, align = 'left', style }: any) => (<td style={{ padding: '12px 16px', verticalAlign: 'middle', textAlign: align as any, color: colors.slate700, fontFamily: 'Inter, sans-serif', ...style }}>{children}</td>);

const UITooltip = ({ children, content }: any) => {
  const [show, setShow] = useState(false);
  return (
    <div style={{ position: 'relative', display: 'inline-block' }} onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {children}
      {show && <div style={{ position: 'absolute', bottom: '100%', left: '50%', transform: 'translateX(-50%)', marginBottom: '8px', padding: '6px 12px', backgroundColor: colors.slate900, color: colors.white, fontSize: '12px', borderRadius: '4px', whiteSpace: 'nowrap', zIndex: 50, pointerEvents: 'none', fontFamily: 'Inter, sans-serif' }}>{content}<div style={{ position: 'absolute', top: '100%', left: '50%', marginLeft: '-4px', borderWidth: '4px', borderStyle: 'solid', borderColor: `${colors.slate900} transparent transparent transparent` }} /></div>}
    </div>
  );
};

export default function ClientDistributionDashboard() {
  const [segmentView, setSegmentView] = useState<'revenue' | 'count'>('revenue');
  const [decileMetric, setDecileMetric] = useState<'revenue' | 'profit' | 'gm'>('revenue');
  
  // --- GLOBAL STATE ---
  const [selectedCustomer, setSelectedCustomer] = useState<string>('All');
  const [selectedCurrency, setSelectedCurrency] = useState<string>('INR');
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Data State
  const [dashboardData, setDashboardData] = useState({
    pareto: [] as any[],
    segmentation: [] as any[],
    decile: [] as any[],
    topCustomers: [] as any[],
    metrics: { top1: 0, top5: 0, top10: 0, top20: 0, hhi: 0 }
  });

  // --- DATA PROCESSING (Backend Simulation) ---
  const processData = useCallback(() => {
    setIsRefreshing(true);
    setTimeout(() => {
      const rate = CURRENCIES[selectedCurrency].rate;
      const isSpecificCustomer = selectedCustomer !== 'All';

      // 1. FILTER & CONVERT PARETO
      let processedPareto: any[] = RAW_PARETO_DATA.map(d => ({
        ...d,
        revenue: parseFloat((d.revenue * rate).toFixed(2))
      }));
      
      // Calculate cumulative after conversion (though % stays same, revenue changes)
      let totalRev = processedPareto.reduce((sum, item) => sum + item.revenue, 0);
      let runningSum = 0;
      processedPareto = processedPareto.map(item => {
        runningSum += item.revenue;
        return { ...item, cumulative: (runningSum / totalRev) * 100 };
      });

      if (isSpecificCustomer) {
        processedPareto = processedPareto.filter(d => d.name === selectedCustomer);
      }

      // 2. FILTER & CONVERT SEGMENTATION
      let processedSeg = RAW_SEGMENTATION_DATA.map(d => ({
        ...d,
        revenue: parseFloat((d.revenue * rate).toFixed(2))
      }));

      if (isSpecificCustomer) {
        // Find which segment the customer belongs to (using Pareto data for mapping)
        const customerRecord = RAW_PARETO_DATA.find(c => c.name === selectedCustomer);
        const targetCategory = customerRecord ? customerRecord.category : '';
        processedSeg = processedSeg.map(s => 
          s.name === targetCategory 
            ? { ...s, count: 1, revenue: processedPareto[0]?.revenue || 0 } // Show specific revenue
            : { ...s, count: 0, revenue: 0 }
        );
      }

      // 3. FILTER & CONVERT DECILE
      let processedDecile = RAW_DECILE_DATA.map(d => ({
        ...d,
        revenue: parseFloat((d.revenue * rate).toFixed(2)),
        profit: parseFloat((d.profit * rate).toFixed(2))
      }));

      if (isSpecificCustomer) {
        // Mock logic: Assign customer to a decile based on rank
        const customerRecord = RAW_PARETO_DATA.find(c => c.name === selectedCustomer);
        const rank = customerRecord ? customerRecord.rank : 1;
        const targetDecile = rank <= 2 ? 'D1' : rank <= 4 ? 'D2' : 'D3'; // Simplified mapping
        processedDecile = processedDecile.filter(d => d.decile === targetDecile);
        // Adjust values to show single customer contribution
        if(processedDecile.length > 0) {
            processedDecile[0].revenue = processedPareto[0]?.revenue || 0;
            processedDecile[0].profit = parseFloat(((customerRecord?.revenue || 0) * 0.4 * rate).toFixed(2)); // Approx profit
        }
      }

      // 4. FILTER & CONVERT TOP CUSTOMERS TABLE
      let processedTopCust = RAW_TOP_CUSTOMERS.map(d => ({
        ...d,
        revenue: parseFloat((d.revenue * rate).toFixed(2)),
        profit: parseFloat((d.profit * rate).toFixed(2)),
        avgTicket: parseFloat((d.avgTicket * rate).toFixed(2)) // K to currency K
      }));

      if (isSpecificCustomer) {
        processedTopCust = processedTopCust.filter(d => d.name === selectedCustomer);
      }

      // 5. METRICS RECALCULATION
      // Metrics are usually global context unless filtered
      const metrics = {
        top1: isSpecificCustomer ? 100 : processedPareto[0]?.cumulative || 0,
        top5: isSpecificCustomer ? 100 : processedPareto[4]?.cumulative || 0,
        top10: isSpecificCustomer ? 100 : processedPareto[9]?.cumulative || 0,
        top20: isSpecificCustomer ? 100 : processedPareto[19]?.cumulative || 0,
        hhi: isSpecificCustomer ? 1 : RAW_PARETO_DATA.reduce((sum, c) => sum + Math.pow(c.revenue/100, 2), 0)
      };

      setDashboardData({
        pareto: processedPareto,
        segmentation: processedSeg,
        decile: processedDecile,
        topCustomers: processedTopCust,
        metrics: metrics
      });
      setIsRefreshing(false);
    }, 600); // Simulate API latency
  }, [selectedCustomer, selectedCurrency]);

  // Trigger data process on change
  useEffect(() => {
    processData();
  }, [processData]);

  // Helpers
  const currencySymbol = CURRENCIES[selectedCurrency].symbol;
  const avgGM = dashboardData.decile.reduce((sum, d) => sum + d.gm, 0) / (dashboardData.decile.length || 1);

  const getDecileValue = (item: any) => {
    switch (decileMetric) {
      case 'revenue': return item.revenue;
      case 'profit': return item.profit;
      case 'gm': return item.gm;
      default: return item.revenue;
    }
  };

  // --- TOOLTIPS ---
  const CustomParetoTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div style={{ backgroundColor: colors.white, padding: '12px', borderRadius: '6px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', border: `1px solid ${colors.slate200}`, fontFamily: 'Inter, sans-serif' }}>
          <p style={{ fontWeight: 600, color: colors.slate900, marginBottom: '4px' }}>Rank #{data.rank}: {data.name}</p>
          <p style={{ fontSize: '13px', color: colors.slate600 }}>Revenue: {currencySymbol}{data.revenue}L</p>
          <p style={{ fontSize: '13px', color: colors.slate600 }}>Cumulative: {data.cumulative.toFixed(1)}%</p>
          <p style={{ fontSize: '13px', color: colors.slate600 }}>Category: {data.category}</p>
          <p style={{ fontSize: '13px', color: colors.slate600 }}>GM%: {data.gm}%</p>
        </div>
      );
    }
    return null;
  };

  const CustomSegmentTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div style={{ backgroundColor: colors.white, padding: '12px', borderRadius: '6px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', border: `1px solid ${colors.slate200}`, fontFamily: 'Inter, sans-serif' }}>
          <p style={{ fontWeight: 600, color: colors.slate900, marginBottom: '4px' }}>{data.name}</p>
          <p style={{ fontSize: '13px', color: colors.slate600 }}>Revenue: {currencySymbol}{data.revenue}L</p>
          <p style={{ fontSize: '13px', color: colors.slate600 }}>Customers: {data.count}</p>
          <p style={{ fontSize: '13px', color: colors.slate600 }}>Avg Margin: {data.avgMargin}%</p>
        </div>
      );
    }
    return null;
  };

  const CustomDecileTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div style={{ backgroundColor: colors.white, padding: '12px', borderRadius: '6px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', border: `1px solid ${colors.slate200}`, fontFamily: 'Inter, sans-serif' }}>
          <p style={{ fontWeight: 600, color: colors.slate900, marginBottom: '4px' }}>{data.decile}</p>
          <p style={{ fontSize: '13px', color: colors.slate600 }}>Revenue: {currencySymbol}{data.revenue}L</p>
          <p style={{ fontSize: '13px', color: colors.slate600 }}>Profit: {currencySymbol}{data.profit}L</p>
          <p style={{ fontSize: '13px', color: colors.slate600 }}>GM%: {data.gm}%</p>
        </div>
      );
    }
    return null;
  };

  const RiskBadge = ({ val, threshold, highRisk = true }: any) => {
    const isRisk = highRisk ? val > threshold : val < threshold;
    const colorBg = isRisk ? (highRisk ? colors.red50 : colors.green50) : (highRisk ? colors.green50 : colors.red50);
    const colorText = isRisk ? (highRisk ? colors.red700 : colors.green700) : (highRisk ? colors.green700 : colors.red700);
    const borderColor = isRisk ? (highRisk ? colors.red200 : colors.green200) : (highRisk ? colors.green200 : colors.red200);
    const label = isRisk ? (highRisk ? 'High Risk' : 'Low') : 'Safe';
    const Icon = isRisk ? TrendingUp : Check;
    const iconColor = isRisk ? colors.red500 : colors.green500;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: colors.slate500, fontWeight: 500, fontFamily: 'Inter, sans-serif' }}>
          <span>{highRisk ? `Top ${threshold === 25 ? '1' : threshold === 50 ? '5' : threshold === 65 ? '10' : '20'}` : 'HHI Index'}</span>
          <Icon size={16} color={iconColor} />
        </div>
        <div style={{ fontSize: '24px', fontWeight: 700, color: isRisk ? colors.red600 : colors.slate900, fontFamily: 'Inter, sans-serif' }}>
          {val.toFixed(highRisk ? 1 : 2)}{highRisk ? '%' : ''}
        </div>
        <div style={{ alignSelf: 'flex-start', fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '4px', backgroundColor: colorBg, color: colorText, border: `1px solid ${borderColor}`, fontFamily: 'Inter, sans-serif' }}>
          {label}
        </div>
      </div>
    );
  };

  const customerOptions = [{ value: 'All', label: 'All Customers' }, ...RAW_PARETO_DATA.map(c => ({ value: c.name, label: c.name }))];
  const currencyOptions = Object.keys(CURRENCIES).map(k => ({ value: k, label: k }));

  const totalRev = dashboardData.pareto.reduce((a, b) => a + b.revenue, 0);

  return (
    <div style={{ padding: '24px', maxWidth: '1600px', margin: '0 auto', backgroundColor: colors.slate50, minHeight: '100vh', ...baseTextStyle }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400&family=Poppins:wght@400;500&display=swap');
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}</style>
      
      {/* AI Summary */}
      <Alert style={{ marginBottom: '24px', borderColor: colors.blue200 }}>
        <Lightbulb size={18} color={colors.blue600} style={{ marginTop: '2px' }} />
        <AlertDescription>
          <span style={{ fontWeight: 600, color: colors.blue900 }}>AI Summary:</span> 
          {selectedCustomer === 'All' 
            ? ` Top 10 customers contribute ${dashboardData.metrics.top10.toFixed(1)}% of revenue; SMB share remains below 2%. Concentration risk is moderate with HHI of 0.${(dashboardData.metrics.hhi * 100).toFixed(0)}.` 
            : ` Viewing data for ${selectedCustomer}. Revenue contribution is ${currencySymbol}${dashboardData.pareto[0]?.revenue}L.`
          }
        </AlertDescription>
      </Alert>

      {/* Filter Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
        <span style={{ fontSize: '14px', fontWeight: 500, color: colors.slate700, fontFamily: 'Inter, sans-serif' }}>Filter by:</span>
        <StyledSelect value={selectedCustomer} onChange={setSelectedCustomer} options={customerOptions} width="220px" />
        <StyledSelect value={selectedCurrency} onChange={setSelectedCurrency} options={currencyOptions} width="100px" />
        <Button 
          variant="outline" 
          onClick={processData}
          style={{ height: '36px', borderColor: colors.slate200 }}
        >
          <RefreshCw size={14} style={{ marginRight: '6px', animation: isRefreshing ? 'spin 1s linear infinite' : 'none' }} />
          Refresh Analysis
        </Button>
      </div>

      {/* Main Charts Row */}
      <div style={{ display: 'flex', flexDirection: 'row', gap: '24px', marginBottom: '24px', flexWrap: 'wrap' }}>
        
        {/* Pareto Chart */}
        <div style={{ flex: '1 1 600px', minWidth: '0' }}>
          <Card style={{ height: '100%' }}>
            <CardHeader>
              <CardTitle>Customer Pareto Analysis</CardTitle>
              <p style={{ fontSize: '13px', color: colors.slate500, margin: '4px 0 0 0', fontFamily: 'Inter, sans-serif' }}>Revenue concentration by customer rank</p>
            </CardHeader>
            <CardContent>
              <div style={{ height: '380px', width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={dashboardData.pareto} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={colors.slate200} vertical={false} />
                    <XAxis dataKey="rank" tick={{ fontSize: 12, fill: colors.slate500, fontFamily: 'Inter, sans-serif' }} tickLine={false} axisLine={{ stroke: colors.slate200 }} label={{ value: 'Customer Rank', position: 'insideBottom', offset: -10, fill: colors.slate500, fontSize: 12, fontFamily: 'Inter, sans-serif' }} />
                    <YAxis yAxisId="left" tick={{ fontSize: 12, fill: colors.slate500, fontFamily: 'Inter, sans-serif' }} tickLine={false} axisLine={false} label={{ value: `Revenue (${currencySymbol}L)`, angle: -90, position: 'insideLeft', fill: colors.slate500, fontSize: 12, fontFamily: 'Inter, sans-serif' }} />
                    <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12, fill: colors.slate500, fontFamily: 'Inter, sans-serif' }} tickLine={false} axisLine={false} domain={[0, 100]} label={{ value: 'Cumulative %', angle: 90, position: 'insideRight', fill: colors.slate500, fontSize: 12, fontFamily: 'Inter, sans-serif' }} />
                    <Tooltip content={<CustomParetoTooltip />} cursor={{ fill: 'transparent' }} />
                    <Legend wrapperStyle={{ paddingTop: '20px', fontFamily: 'Inter, sans-serif', fontSize: '12px' }} />
                    <ReferenceLine yAxisId="right" y={80} stroke={colors.amber500} strokeDasharray="4 4" label={{ value: '80%', position: 'right', fill: colors.amber500, fontSize: 12, fontFamily: 'Inter, sans-serif' }} />
                    <Bar yAxisId="left" dataKey="revenue" name="Revenue" onClick={(data: any) => data && setSelectedCustomer(data.name)} cursor="pointer" radius={[2, 2, 0, 0]} barSize={20} fill={colors.blue600} />
                    <Line yAxisId="right" type="monotone" dataKey="cumulative" stroke={colors.purple} strokeWidth={2} name="Cumulative %" dot={{ r: 3, fill: colors.purple, strokeWidth: 0 }} activeDot={{ r: 5 }} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
              <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '12px', color: colors.slate500, fontFamily: 'Inter, sans-serif' }}>
                <div style={{ width: '60px', height: '1px', backgroundColor: colors.amber200 }}></div>
                <span>Top 20% customers contribute {dashboardData.metrics.top20.toFixed(1)}% of revenue</span>
                <div style={{ width: '60px', height: '1px', backgroundColor: colors.amber200 }}></div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Segmentation Chart */}
        <div style={{ flex: '1 1 400px', minWidth: '0' }}>
          <Card style={{ height: '100%' }}>
            <CardHeader style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <CardTitle>Customer Segmentation</CardTitle>
                <p style={{ fontSize: '13px', color: colors.slate500, margin: '4px 0 0 0', fontFamily: 'Inter, sans-serif' }}>Distribution by category</p>
              </div>
              <StyledSelect value={segmentView} onChange={setSegmentView} options={[{value: 'revenue', label: 'By Revenue'}, {value: 'count', label: 'By Count'}]} width="120px" />
            </CardHeader>
            <CardContent style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
              <div style={{ flex: 1, height: '280px', position: 'relative' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={dashboardData.segmentation} cx="50%" cy="50%" innerRadius={65} outerRadius={95} paddingAngle={3} dataKey={segmentView === 'revenue' ? 'revenue' : 'count'} stroke="none">
                      {dashboardData.segmentation.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                      <LabelList 
                        dataKey={segmentView === 'revenue' ? 'revenue' : 'count'} 
                        position="inside" 
                        content={({ cx, cy, midAngle, innerRadius, outerRadius, value }: any) => {
                          if(value < 1 && segmentView === 'revenue') return null; 
                          const RADIAN = Math.PI / 180;
                          const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                          const x = cx + radius * Math.cos(-midAngle * RADIAN);
                          const y = cy + radius * Math.sin(-midAngle * RADIAN);
                          return <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight="bold" fontFamily="Inter, sans-serif">{segmentView === 'revenue' ? `${value}L` : value}</text>;
                        }} 
                      />
                    </Pie>
                    <Tooltip content={<CustomSegmentTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                    <div style={{ fontSize: '20px', fontWeight: 700, color: colors.slate900, fontFamily: 'Inter, sans-serif' }}>{totalRev.toFixed(1)}L</div>
                    <div style={{ fontSize: '12px', color: colors.slate500, fontFamily: 'Inter, sans-serif' }}>Total Revenue</div>
                </div>
              </div>
              <div style={{ width: '180px', paddingLeft: '16px' }}>
                {dashboardData.segmentation.map((segment) => (
                  <div key={segment.name} style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: segment.color, marginTop: '6px' }}></div>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 500, color: colors.slate900, fontFamily: 'Inter, sans-serif' }}>{segment.name}</div>
                        <div style={{ fontSize: '12px', color: colors.slate500, fontFamily: 'Inter, sans-serif' }}>{currencySymbol}{segment.revenue}L</div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '12px', fontWeight: 500, color: segment.growth > 5 ? colors.green600 : colors.blue600, fontFamily: 'Inter, sans-serif' }}>{segment.growth > 0 ? '+' : ''}{segment.growth}%</div>
                        <div style={{ fontSize: '11px', color: colors.slate400, fontFamily: 'Inter, sans-serif' }}>{segment.count} cust</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Decile Analysis */}
      <Card>
        <CardHeader style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <CardTitle>Customer Decile Analysis</CardTitle>
            <p style={{ fontSize: '13px', color: colors.slate500, margin: '4px 0 0 0', fontFamily: 'Inter, sans-serif' }}>Performance metrics by customer decile</p>
          </div>
          <StyledSelect value={decileMetric} onChange={setDecileMetric} options={[{value: 'revenue', label: 'By Revenue'}, {value: 'profit', label: 'By Profit'}, {value: 'gm', label: 'By GM%'}]} width="140px" />
        </CardHeader>
        <CardContent>
          <div style={{ height: '320px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dashboardData.decile} margin={{ top: 20, right: 0, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={colors.slate200} vertical={false} />
                <XAxis dataKey="decile" tick={{ fontSize: 12, fill: colors.slate500, fontFamily: 'Inter, sans-serif' }} axisLine={{ stroke: colors.slate200 }} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: colors.slate500, fontFamily: 'Inter, sans-serif' }} axisLine={false} tickLine={false} label={{ value: `${decileMetric.toUpperCase()} (${decileMetric === 'gm' ? '%' : currencySymbol + 'L'})`, angle: -90, position: 'insideLeft', fill: colors.slate500, fontSize: 12, fontFamily: 'Inter, sans-serif' }} />
                <Tooltip content={<CustomDecileTooltip />} cursor={{ fill: colors.slate100 }} />
                {decileMetric === 'gm' && <ReferenceLine y={avgGM} stroke={colors.slate500} strokeDasharray="3 3" label={{ value: `Avg: ${avgGM.toFixed(1)}%`, position: 'right' }} />}
                <Bar dataKey={(item) => getDecileValue(item)} radius={[4, 4, 0, 0]} barSize={40}>
                  {dashboardData.decile.map((entry, index) => {
                    const val = getDecileValue(entry);
                    const max = Math.max(...dashboardData.decile.map(d => getDecileValue(d))) || 1;
                    return <Cell key={`cell-${index}`} fill={`rgba(139, 92, 246, ${0.4 + (val / max) * 0.6})`} />;
                  })}
                  <LabelList dataKey={(item: any) => getDecileValue(item)} position="top" formatter={(val: any) => decileMetric === 'gm' ? `${val}%` : `${currencySymbol}${val}L`} style={{ fontSize: '11px', fill: colors.slate500, fontWeight: 500, fontFamily: 'Inter, sans-serif' }} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Top Customer Portfolio */}
      <Card>
        <CardHeader>
          <CardTitle>Top Customer Portfolio</CardTitle>
          <p style={{ fontSize: '13px', color: colors.slate500, margin: '4px 0 0 0', fontFamily: 'Inter, sans-serif' }}>Detailed metrics for top 10 revenue contributors</p>
        </CardHeader>
        <CardContent>
          <div style={{ border: `1px solid ${colors.slate200}`, borderRadius: '6px', overflow: 'hidden' }}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rank</TableHead>
                  <TableHead>Customer Name</TableHead>
                  <TableHead align="right">Revenue</TableHead>
                  <TableHead align="right">Profit</TableHead>
                  <TableHead align="right">GM%</TableHead>
                  <TableHead align="right">Invoices</TableHead>
                  <TableHead align="right">Avg Ticket</TableHead>
                  <TableHead align="right">DSO</TableHead>
                  <TableHead align="right">12M Growth</TableHead>
                  <TableHead align="center">Risk</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dashboardData.topCustomers.map((cust) => (
                  <TableRow key={cust.rank} style={{ '&:hover': { backgroundColor: colors.slate50 } }}>
                    <TableCell><span style={{ fontWeight: 500 }}>{cust.rank}</span></TableCell>
                    <TableCell><span style={{ fontWeight: 500, color: colors.slate900 }}>{cust.name}</span></TableCell>
                    <TableCell align="right"><span style={{ fontWeight: cust.rank <= 3 ? 600 : 400, color: cust.rank <= 3 ? colors.green600 : colors.slate700 }}>{currencySymbol}{cust.revenue}L</span></TableCell>
                    <TableCell align="right"><span style={{ fontWeight: cust.rank <= 3 ? 600 : 400, color: cust.rank <= 3 ? colors.green600 : colors.slate700 }}>{currencySymbol}{cust.profit}L</span></TableCell>
                    <TableCell align="right">
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px' }}>
                        {cust.gm}%
                        {cust.gmTrend === 'up' ? <TrendingUp size={14} color={colors.green600} /> : cust.gmTrend === 'down' ? <TrendingDown size={14} color={colors.red600} /> : <Minus size={14} color={colors.slate400} />}
                      </div>
                    </TableCell>
                    <TableCell align="right">
                      <UITooltip content={`Last Invoice: ${cust.lastInvoice}`}>
                        <span style={{ textDecoration: 'underline', textDecorationStyle: 'dotted', textUnderlineOffset: '2px', cursor: 'help' }}>{cust.invoices}</span>
                      </UITooltip>
                    </TableCell>
                    <TableCell align="right">{currencySymbol}{cust.avgTicket}K</TableCell>
                    <TableCell align="right">
                      <div style={{
                        display: 'inline-block', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 500,
                        backgroundColor: cust.dso < 30 ? colors.green50 : cust.dso <= 45 ? colors.amber50 : colors.red50,
                        color: cust.dso < 30 ? colors.green700 : cust.dso <= 45 ? colors.amber700 : colors.red700,
                        border: `1px solid ${cust.dso < 30 ? colors.green200 : cust.dso <= 45 ? colors.amber200 : colors.red200}`
                      }}>{cust.dso}d</div>
                    </TableCell>
                    <TableCell align="right">
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                        <span style={{ color: cust.growth > 10 ? colors.green600 : cust.growth < 0 ? colors.red600 : colors.slate600, fontSize: '12px', fontWeight: 500 }}>
                            {cust.growth > 0 ? '+' : ''}{cust.growth}%
                        </span>
                        <div style={{ width: '50px', height: '4px', backgroundColor: colors.slate100, borderRadius: '2px' }}>
                            <div style={{ height: '100%', width: `${Math.min(Math.abs(cust.growth) * 5, 100)}%`, backgroundColor: cust.growth > 10 ? colors.green500 : cust.growth < 0 ? colors.red500 : colors.blue500, borderRadius: '2px' }}></div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell align="center">
                      <div style={{
                        display: 'inline-block', padding: '2px 8px', borderRadius: '999px', fontSize: '11px', fontWeight: 600,
                        backgroundColor: cust.risk === 'Low' ? colors.green100 : cust.risk === 'Medium' ? colors.amber100 : colors.red100,
                        color: cust.risk === 'Low' ? colors.green700 : cust.risk === 'Medium' ? colors.amber800 : colors.red800
                      }}>{cust.risk}</div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Concentration Risk */}
      <Card>
        <CardHeader>
          <CardTitle>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              Concentration Risk Assessment
              <AlertTriangle size={20} color={colors.amber500} />
            </div>
          </CardTitle>
          <p style={{ fontSize: '13px', color: colors.slate500, margin: '4px 0 0 0', fontFamily: 'Inter, sans-serif' }}>Revenue concentration metrics and risk indicators</p>
        </CardHeader>
        <CardContent>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '24px', marginBottom: '24px' }}>
            <RiskBadge val={dashboardData.metrics.top1} threshold={25} />
            <RiskBadge val={dashboardData.metrics.top5} threshold={50} />
            <RiskBadge val={dashboardData.metrics.top10} threshold={65} />
            <RiskBadge val={dashboardData.metrics.top20} threshold={80} />
            <RiskBadge val={dashboardData.metrics.hhi} threshold={0.25} highRisk={false} />
          </div>

          <Alert style={{ backgroundColor: colors.amber50, borderColor: colors.amber200 }}>
            <AlertTriangle size={18} color={colors.amber600} style={{ marginTop: '2px' }} />
            <AlertDescription>
              <div style={{ fontSize: '14px', color: colors.slate800, lineHeight: 1.6 }}>
                <span style={{ fontWeight: 600, color: colors.amber900 }}>Concentration Risk Alert:</span> Revenue concentration is rising, 
                with top 10 customers accounting for {dashboardData.metrics.top10.toFixed(1)}%, 
                above the recommended 70% threshold. Current HHI of {dashboardData.metrics.hhi.toFixed(2)} indicates moderate concentration risk.
              </div>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

    </div>
  );
}