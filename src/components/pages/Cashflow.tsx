import React, { useState, useMemo, useEffect } from 'react';
import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
  Legend, ResponsiveContainer, LineChart
} from 'recharts';
import {
  TrendingUp, DollarSign, Target, Clock, RefreshCw,
  Info, Eye, Layers, ChevronDown, CheckCircle, Clock3, XCircle, AlertCircle,
  Loader2, List, BarChart2, Calendar, Minimize2
} from 'lucide-react';

// --- CONSTANTS & CONFIG ---
const CURRENCIES: Record<string, { label: string, symbol: string, rate: number }> = {
  INR: { label: 'INR', symbol: '₹', rate: 1 },
  USD: { label: 'USD', symbol: '$', rate: 0.012 },
  EUR: { label: 'EUR', symbol: '€', rate: 0.011 },
  GBP: { label: 'GBP', symbol: '£', rate: 0.0095 }
};

// --- DATA ---
const rawMonthlyData = [
  { month: 'Jul', operating: 28, investing: -5, financing: -3, closingCash: 23 },
  { month: 'Aug', operating: 30, investing: -6, financing: -2, closingCash: 26 },
  { month: 'Sep', operating: 25, investing: -4, financing: -5, closingCash: 30 },
  { month: 'Oct', operating: 35, investing: -10, financing: -3, closingCash: 38 },
  { month: 'Nov', operating: 29, investing: -7, financing: -4, closingCash: 41 },
  { month: 'Dec', operating: 32, investing: -8, financing: -2, closingCash: 45 },
];

// Mock Drill-down data for cards
const drillDownData = [
  { id: 1, date: 'Dec 05', desc: 'Client Pmt - TechCorp', amount: 12.5 },
  { id: 2, date: 'Dec 12', desc: 'Vendor Pmt - AWS', amount: -4.2 },
  { id: 3, date: 'Dec 18', desc: 'Payroll Run', amount: -8.5 },
];

const liquidityRatiosData = [
  { name: 'Current Ratio', value: 2.1, target: 1.5, formula: 'Current Assets ÷ Current Liabilities', threshold: '≥ 1.5x (Healthy)', history: [1.8, 1.9, 2.0, 2.1, 2.0, 2.1] },
  { name: 'Quick Ratio', value: 1.6, target: 1.0, formula: '(Current Assets - Inventory) ÷ Current Liabilities', threshold: '≥ 1.0x (Good)', history: [1.3, 1.4, 1.5, 1.5, 1.6, 1.6] },
  { name: 'Cash Ratio', value: 0.8, target: 0.5, formula: 'Cash ÷ Current Liabilities', threshold: '≥ 0.5x (Adequate)', history: [0.6, 0.7, 0.7, 0.8, 0.8, 0.8] },
  { name: 'Working Capital', value: 82, target: 50, formula: 'Current Assets - Current Liabilities', threshold: 'Positive (Essential)', history: [65, 70, 75, 78, 80, 82], isCurrency: true },
];

const bankAccounts = [
  { name: 'HDFC Current Account', accountNumber: '****7890', balance: 25.8, status: 'active', type: 'current', lastSync: '10:05 AM' },
  { name: 'ICICI Current Account', accountNumber: '****4521', balance: 12.5, status: 'active', type: 'current', lastSync: '10:03 AM' },
  { name: 'SBI Savings Account', accountNumber: '****3344', balance: 5.2, status: 'active', type: 'savings', lastSync: '10:05 AM' },
  { name: 'Axis Fixed Deposit', accountNumber: '****9988', balance: 15.0, status: 'inactive', type: 'fd', lastSync: '3 hrs ago' },
];

const upcomingCashflows = [
  { date: 'Jan 28, 2025', description: 'Client Payment - TechCorp', amount: 8.5, type: 'inflow', category: 'Customer Payments', linkedTo: 'Invoice #1234', status: 'scheduled' },
  { date: 'Jan 30, 2025', description: 'Vendor Payment - AWS Services', amount: -3.2, type: 'outflow', category: 'Vendor Payments', linkedTo: 'Bill #5678', status: 'scheduled' },
  { date: 'Feb 1, 2025', description: 'Salary Disbursement', amount: -12.5, type: 'outflow', category: 'Salaries', linkedTo: 'Payroll Feb 2025', status: 'scheduled' },
  { date: 'Feb 3, 2025', description: 'Client Payment - DataSys', amount: 6.8, type: 'inflow', category: 'Customer Payments', linkedTo: 'Invoice #1235', status: 'scheduled', delay: 1 },
  { date: 'Feb 5, 2025', description: 'Loan EMI Payment', amount: -4.5, type: 'outflow', category: 'Loans', linkedTo: 'Loan #2024-03', status: 'scheduled' },
  { date: 'Feb 8, 2025', description: 'Client Payment - FinanceHub', amount: 7.2, type: 'inflow', category: 'Customer Payments', linkedTo: 'Invoice #1236', status: 'scheduled' },
];

const runwayTrendHistory = [8.5, 8.8, 9.0, 9.5, 10.2, 10.8];

// --- STYLES (Unchanged) ---
const styles: { [key: string]: React.CSSProperties } = {
  container: { padding: '24px', maxWidth: '1600px', margin: '0 auto', fontFamily: 'Inter, sans-serif', backgroundColor: '#f8fafc', minHeight: '100vh', boxSizing: 'border-box' },
  headerRibbon: {
    background: 'linear-gradient(to right, #eff6ff, #f0fdfa)',
    border: '1px solid #bfdbfe', borderRadius: '8px', padding: '12px 24px',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '24px'
  },
  ribbonTextGroup: { display: 'flex', alignItems: 'center', gap: '24px', fontSize: '14px', flexWrap: 'wrap', fontFamily: 'Inter, sans-serif' },
  ribbonItem: { display: 'flex', alignItems: 'center', gap: '8px' },
  divider: { height: '16px', width: '1px', backgroundColor: '#cbd5e1' },
  button: {
    display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px',
    borderRadius: '6px', border: '1px solid #e2e8f0', background: 'white',
    cursor: 'pointer', fontSize: '14px', fontWeight: 500, fontFamily: 'Inter, sans-serif', transition: 'all 0.2s', outline: 'none'
  },
  buttonPrimary: { background: '#0f172a', color: 'white', border: '1px solid #0f172a' },
  grid4: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '24px' },
  grid2: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '24px', marginBottom: '24px' },
  card: { background: 'white', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', overflow: 'hidden' },
  cardHeader: { padding: '20px 24px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
  cardTitle: { fontSize: '15px', fontWeight: 500, color: '#0f172a', margin: 0, fontFamily: 'Poppins, sans-serif' },
  cardContent: { padding: '0 24px 24px' },
  kpiValue: { fontSize: '24px', fontWeight: 400, color: '#0f172a', marginTop: '8px', fontFamily: 'Inter, sans-serif' },
  kpiSub: { fontSize: '12px', marginTop: '4px', fontFamily: 'Inter, sans-serif' },
  badge: { padding: '2px 8px', borderRadius: '99px', fontSize: '10px', fontWeight: 600, border: '1px solid #e2e8f0', display: 'inline-block', fontFamily: 'Inter, sans-serif' },
  progressBar: { height: '6px', width: '100%', background: '#f1f5f9', borderRadius: '99px', marginTop: '12px', overflow: 'hidden' },
  tabs: { display: 'flex', background: '#f1f5f9', padding: '4px', borderRadius: '6px' },
  tabTrigger: { padding: '4px 12px', fontSize: '12px', fontWeight: 500, borderRadius: '4px', cursor: 'pointer', border: 'none', background: 'transparent', transition: '0.2s', fontFamily: 'Inter, sans-serif' },
  tabActive: { background: 'white', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', color: '#0f172a' },
  row: { display: 'flex', alignItems: 'center', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '8px', marginBottom: '8px', background: 'white', transition: 'background 0.2s' },
  // Helper for drill down table
  drillTable: { width: '100%', fontSize: '12px', borderCollapse: 'collapse', marginTop: '12px' } as React.CSSProperties,
  drillTh: { textAlign: 'left', color: '#64748b', paddingBottom: '8px', borderBottom: '1px solid #e2e8f0' } as React.CSSProperties,
  drillTd: { padding: '8px 0', borderBottom: '1px solid #f1f5f9', color: '#334155' } as React.CSSProperties,
  currencySelect: {
    border: 'none', background: 'transparent', fontWeight: 'bold', cursor: 'pointer', outline: 'none', fontFamily: 'Inter, sans-serif', color: '#0f172a'
  }
};

// --- HELPER COMPONENTS ---
const Card = ({ children, style, className }: any) => <div style={{ ...styles.card, ...style }} className={className}>{children}</div>;
const Badge = ({ children, color = '#64748b', bg = '#f8fafc' }: any) => (
  <span style={{ ...styles.badge, color, background: bg }}>{children}</span>
);

export default function Cashflow() {
  // --- STATES ---
  const [viewMode, setViewMode] = useState<'summary' | 'drilldown'>('summary');
  const [timePeriod, setTimePeriod] = useState<'monthly' | 'quarterly' | 'ytd'>('monthly');
  const [cashflowHorizon, setCashflowHorizon] = useState<'7' | '14' | '30'>('14');
  const [isInrOpen, setIsInrOpen] = useState(true);
  const [currency, setCurrency] = useState('INR');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // --- HELPERS ---
  const getCurrencyConfig = () => CURRENCIES[currency];
  
  const formatVal = (val: number, isCurrency = true) => {
    if (!isCurrency) return val.toFixed(1);
    const { symbol, rate } = getCurrencyConfig();
    return `${symbol}${(val * rate).toFixed(1)}L`;
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  // --- AGGREGATION LOGIC (For Charts & Cards) ---
  const dashboardData = useMemo(() => {
    const { rate } = getCurrencyConfig();
    
    // 1. Scale data by currency
    const scaledData = rawMonthlyData.map(d => ({
      ...d,
      operating: d.operating * rate,
      investing: d.investing * rate,
      financing: d.financing * rate,
      closingCash: d.closingCash * rate
    }));

    // 2. Aggregate based on Time Period
    if (timePeriod === 'monthly') return scaledData;

    if (timePeriod === 'quarterly') {
      // Mock aggregation: Q1 (Jul-Sep), Q2 (Oct-Dec)
      const q1 = scaledData.slice(0, 3).reduce((acc, curr) => ({
        month: 'Q2', operating: acc.operating + curr.operating, investing: acc.investing + curr.investing, financing: acc.financing + curr.financing, closingCash: curr.closingCash // Closing cash is point-in-time
      }));
      const q2 = scaledData.slice(3, 6).reduce((acc, curr) => ({
        month: 'Q3', operating: acc.operating + curr.operating, investing: acc.investing + curr.investing, financing: acc.financing + curr.financing, closingCash: curr.closingCash
      }));
      return [q1, q2];
    }

    if (timePeriod === 'ytd') {
      const ytd = scaledData.reduce((acc, curr) => ({
        month: 'YTD', operating: acc.operating + curr.operating, investing: acc.investing + curr.investing, financing: acc.financing + curr.financing, closingCash: curr.closingCash
      }), { month: '', operating: 0, investing: 0, financing: 0, closingCash: 0 });
      return [ytd];
    }
    return [];
  }, [currency, timePeriod]);

  // --- KPI CALCULATIONS ---
  // "Current" values are either the sum (for flows) or the last value (for balances) depending on view
  const kpiOperating = timePeriod === 'monthly' 
    ? dashboardData[dashboardData.length - 1].operating 
    : dashboardData.reduce((sum, d) => sum + d.operating, 0); // Sum for YTD/Quarterly context

  const kpiTotalCash = dashboardData[dashboardData.length - 1].closingCash; // Point in time

  const upcomingCashflowsFiltered = upcomingCashflows.slice(0, cashflowHorizon === '7' ? 2 : cashflowHorizon === '14' ? 4 : 6);
  const totalInflow = upcomingCashflowsFiltered.filter(cf => cf.type === 'inflow').reduce((sum, cf) => sum + cf.amount, 0);
  const totalOutflow = upcomingCashflowsFiltered.filter(cf => cf.type === 'outflow').reduce((sum, cf) => sum + Math.abs(cf.amount), 0);
  const netCashflow = totalInflow - totalOutflow;

  const groupedCashflows = upcomingCashflowsFiltered.reduce((acc, cf) => {
    if (!acc[cf.category]) acc[cf.category] = [];
    acc[cf.category].push(cf);
    return acc;
  }, {} as any);

  // --- RENDER HELPERS ---
  const getRatioColor = (val: number, target: number, name: string) => {
    if (name === 'Working Capital') return '#16a34a';
    if (name === 'Current Ratio') return val >= 1.5 ? '#16a34a' : val >= 1.2 ? '#d97706' : '#dc2626';
    return val >= target ? '#16a34a' : val >= target * 0.8 ? '#d97706' : '#dc2626';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle size={16} color="#16a34a" />;
      case 'pending': return <Clock3 size={16} color="#d97706" />;
      case 'inactive': return <XCircle size={16} color="#dc2626" />;
      default: return <AlertCircle size={16} color="#94a3b8" />;
    }
  };

  return (
    <div style={styles.container}>
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400&family=Poppins:wght@400;500&display=swap');`}
        {`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}
      </style>

      {/* Context Ribbon */}
      <div style={styles.headerRibbon}>
        <div style={styles.ribbonTextGroup}>
          <div style={styles.ribbonItem}><span style={{ color: '#475569' }}>Entity:</span> <b>ABC Pvt Ltd</b></div>
          <div style={styles.divider} />
          <div style={styles.ribbonItem}><span style={{ color: '#475569' }}>FY:</span> <b>2024–25</b></div>
          <div style={styles.divider} />
          <div style={styles.ribbonItem}>
            <span style={{ color: '#475569' }}>Currency:</span> 
            {/* Currency Dropdown Selector */}
            <select 
              style={styles.currencySelect} 
              value={currency} 
              onChange={(e) => setCurrency(e.target.value)}
            >
              {Object.keys(CURRENCIES).map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div style={styles.divider} />
          <div style={styles.ribbonItem}><span style={{ color: '#475569' }}>Data as of:</span> <b>Dec 2024</b></div>
        </div>
        <div>
          <button
            style={styles.button}
            onClick={handleRefresh}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
          >
            <RefreshCw size={14} style={{ animation: isRefreshing ? 'spin 1s linear infinite' : 'none' }} /> 
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* View Mode Toggle */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginBottom: '24px' }}>
        <button style={viewMode === 'summary' ? { ...styles.button, ...styles.buttonPrimary } : styles.button} onClick={() => setViewMode('summary')}>
          <Eye size={14} /> Summary
        </button>
        <button style={viewMode === 'drilldown' ? { ...styles.button, ...styles.buttonPrimary } : styles.button} onClick={() => setViewMode('drilldown')}>
          <Layers size={14} /> Drill-down
        </button>
      </div>

      {/* KPI Cards */}
      <div style={styles.grid4}>
        
        {/* KPI 1: Operating Cash Flow */}
        <Card style={{ borderTop: '4px solid #0d9488' }}>
          <div style={styles.cardHeader}>
            <h3 style={styles.cardTitle}>{timePeriod === 'monthly' ? 'Op. Cash Flow' : `${timePeriod} Op. Flow`}</h3>
            <div style={{ display: 'flex', gap: '8px' }}>
              <TrendingUp size={16} color="#0d9488" />
            </div>
          </div>
          <div style={styles.cardContent}>
            {viewMode === 'drilldown' ? (
              // Drill Down View
              <table style={styles.drillTable}>
                <thead><tr><th style={styles.drillTh}>Date</th><th style={styles.drillTh}>Description</th><th style={{...styles.drillTh, textAlign:'right'}}>Amt</th></tr></thead>
                <tbody>
                  {drillDownData.map((d, i) => (
                    <tr key={i}>
                      <td style={styles.drillTd}>{d.date}</td>
                      <td style={styles.drillTd}>{d.desc}</td>
                      <td style={{...styles.drillTd, textAlign: 'right', fontWeight: 500, color: d.amount > 0 ? '#16a34a' : '#dc2626'}}>
                        {formatVal(d.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              // Summary View
              <>
                <div style={styles.kpiValue}>{formatVal(kpiOperating)}</div>
                <p style={{ ...styles.kpiSub, color: '#16a34a' }}>+10.3% vs prev. period</p>
                <div style={{ height: '4px', background: '#e2e8f0', marginTop: '16px', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ width: '75%', background: '#0d9488', height: '100%' }}></div>
                </div>
              </>
            )}
          </div>
        </Card>

        {/* KPI 2: Total Cash */}
        <Card style={{ borderTop: '4px solid #2563eb' }}>
          <div style={styles.cardHeader}>
            <h3 style={styles.cardTitle}>Closing Cash</h3>
            <DollarSign size={16} color="#2563eb" />
          </div>
          <div style={styles.cardContent}>
            <div style={styles.kpiValue}>{formatVal(kpiTotalCash)}</div>
            <p style={{ ...styles.kpiSub, color: '#64748b' }}>As of end of period</p>
            <div style={{ display: 'flex', gap: '4px', marginTop: '16px' }}>
              {bankAccounts.map((b, i) => (
                <div key={i} title={`${b.name}: ${formatVal(b.balance)}`} style={{ flex: 1, height: '4px', background: i === 0 ? '#2563eb' : '#93c5fd', borderRadius: '2px' }}></div>
              ))}
            </div>
          </div>
        </Card>

        {/* KPI 3: Current Ratio */}
        <Card style={{ borderTop: '4px solid #ea580c' }}>
          <div style={styles.cardHeader}>
            <h3 style={styles.cardTitle}>Current Ratio</h3>
            <Target size={16} color="#ea580c" />
          </div>
          <div style={styles.cardContent}>
            <div style={styles.kpiValue}>2.1x</div>
            <p style={{ ...styles.kpiSub, color: '#16a34a' }}>Safe Zone (≥ 1.5x)</p>
            {/* Mini Sparkline */}
            <div style={{ height: '32px', marginTop: '8px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={liquidityRatiosData[0].history.map((v, i) => ({ i, v }))}>
                  <Line type="monotone" dataKey="v" stroke="#ea580c" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>

        {/* KPI 4: Runway */}
        <Card style={{ borderTop: '4px solid #8b5cf6' }}>
          <div style={styles.cardHeader}>
            <h3 style={styles.cardTitle}>Runway</h3>
            <Clock size={16} color="#8b5cf6" />
          </div>
          <div style={styles.cardContent}>
            <div style={styles.kpiValue}>10.8 mo</div>
            <p style={{ ...styles.kpiSub, color: '#64748b' }}>Based on {timePeriod} burn avg</p>
            <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#64748b' }}>
              <CheckCircle size={14} color="#16a34a" />
              <span>Sufficient for FY25</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Charts Area */}
      <div style={{ ...styles.grid2, gridTemplateColumns: '2fr 1fr' }}>
        
        {/* Main Chart */}
        <Card>
          <div style={styles.cardHeader}>
            <div>
              <h3 style={styles.cardTitle}>{timePeriod === 'monthly' ? 'Monthly' : timePeriod === 'quarterly' ? 'Quarterly' : 'YTD'} Cash Flow Analysis</h3>
              <p style={{ fontSize: '12px', color: '#64748b', marginTop: '4px', fontFamily: 'Inter, sans-serif' }}>Operating, Investing, and Financing activities</p>
            </div>
            {/* Global Time Period Toggle */}
            <div style={styles.tabs}>
              {['Monthly', 'Quarterly', 'YTD'].map(t => (
                <button
                  key={t}
                  style={timePeriod === t.toLowerCase() ? { ...styles.tabTrigger, ...styles.tabActive } : styles.tabTrigger}
                  onClick={() => setTimePeriod(t.toLowerCase() as any)}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div style={{ padding: '0 24px 24px', height: '350px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={dashboardData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b', fontFamily: 'Inter, sans-serif' }} dy={10} />
                <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b', fontFamily: 'Inter, sans-serif' }} tickFormatter={(val) => formatVal(val, false)} label={{ value: `Cash Flow (${CURRENCIES[currency].symbol} L)`, angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 12, fontFamily: 'Inter, sans-serif' }} />
                <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b', fontFamily: 'Inter, sans-serif' }} tickFormatter={(val) => formatVal(val, false)} />
                <RechartsTooltip
                  formatter={(value: any) => formatVal(value)}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', fontFamily: 'Inter, sans-serif' }}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontFamily: 'Inter, sans-serif', fontSize: '12px' }} />
                <Bar yAxisId="left" dataKey="operating" fill="#0d9488" stackId="stack" name="Operating" barSize={32} />
                <Bar yAxisId="left" dataKey="investing" fill="#8b5cf6" stackId="stack" name="Investing" barSize={32} />
                <Bar yAxisId="left" dataKey="financing" fill="#ea580c" stackId="stack" name="Financing" barSize={32} />
                <Line yAxisId="right" type="monotone" dataKey="closingCash" stroke="#2563eb" strokeWidth={3} dot={{ r: 4, fill: '#2563eb' }} name="Closing Cash" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Liquidity Ratios */}
        <Card>
          <div style={styles.cardHeader}>
            <h3 style={styles.cardTitle}>Liquidity Ratios</h3>
            <p style={{ fontSize: '12px', color: '#64748b', fontFamily: 'Inter, sans-serif' }}>Key financial health indicators</p>
          </div>
          <div style={styles.cardContent}>
            {liquidityRatiosData.map((ratio: any) => (
              <div key={ratio.name} style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 500, color: '#0f172a', fontFamily: 'Inter, sans-serif' }}>{ratio.name}</span>
                  <span style={{ fontSize: '14px', fontWeight: 600, fontFamily: 'Inter, sans-serif' }}>
                    {ratio.isCurrency ? formatVal(ratio.value) : `${ratio.value}x`}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div style={{ flex: 1, height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      width: `${Math.min((ratio.value / (ratio.target * 1.5)) * 100, 100)}%`,
                      background: getRatioColor(ratio.value, ratio.target, ratio.name)
                    }} />
                  </div>
                  <div style={{ width: '60px', height: '24px' }}>
                    <ResponsiveContainer>
                      <LineChart data={ratio.history.map((v: number, i: number) => ({ i, v }))}>
                        <Line type="monotone" dataKey="v" stroke="#10b981" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Bottom Section */}
      <div style={styles.grid2}>
        {/* Bank Accounts */}
        <Card>
          <div style={styles.cardHeader}>
            <h3 style={styles.cardTitle}>Bank Account Balances</h3>
          </div>
          <div style={styles.cardContent}>
            <div
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', cursor: 'pointer', background: '#f8fafc', borderRadius: '8px' }}
              onClick={() => setIsInrOpen(!isInrOpen)}
            >
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <ChevronDown size={16} style={{ transform: isInrOpen ? 'rotate(0deg)' : 'rotate(-90deg)', transition: '0.2s' }} />
                <span style={{ fontSize: '14px', fontWeight: 500, fontFamily: 'Inter, sans-serif' }}>Bank Accounts ({currency})</span>
              </div>
              <Badge>{bankAccounts.length} accounts</Badge>
            </div>

            {isInrOpen && (
              <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {bankAccounts.map(acc => (
                  <div key={acc.accountNumber} style={styles.row}>
                    <div style={{ fontSize: '20px', marginRight: '12px' }}>{acc.type === 'fd' ? '📄' : acc.type === 'savings' ? '💰' : '🏦'}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <span style={{ fontSize: '14px', fontWeight: 500, fontFamily: 'Inter, sans-serif' }}>{acc.name}</span>
                        {getStatusIcon(acc.status)}
                      </div>
                      <span style={{ fontSize: '12px', color: '#64748b', fontFamily: 'Inter, sans-serif' }}>{acc.accountNumber}</span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '14px', fontWeight: 600, fontFamily: 'Inter, sans-serif' }}>{formatVal(acc.balance)}</div>
                      <div style={{ fontSize: '10px', color: '#64748b', fontFamily: 'Inter, sans-serif' }}>{acc.type.toUpperCase()}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
              <div style={{ background: '#f0fdfa', padding: '12px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 500, color: '#0f172a', fontFamily: 'Inter, sans-serif' }}>Total Available Cash</div>
                  <div style={{ fontSize: '12px', color: '#64748b', fontFamily: 'Inter, sans-serif' }}>as of 10:05 AM</div>
                </div>
                <div style={{ fontSize: '18px', fontWeight: 700, color: '#0f766e', fontFamily: 'Inter, sans-serif' }}>{formatVal(58.5)}</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Upcoming Cash Flows */}
        <Card>
          <div style={styles.cardHeader}>
            <div>
              <h3 style={styles.cardTitle}>Upcoming Cash Flows</h3>
              <div style={{ display: 'flex', gap: '16px', marginTop: '8px', fontSize: '12px', fontFamily: 'Inter, sans-serif' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#0d9488' }} />
                  In: <b>{formatVal(totalInflow)}</b>
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ea580c' }} />
                  Out: <b>{formatVal(totalOutflow)}</b>
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#2563eb' }} />
                  Net: <b style={{ color: netCashflow >= 0 ? '#16a34a' : '#dc2626' }}>{netCashflow > 0 ? '+' : ''}{formatVal(netCashflow)}</b>
                </span>
              </div>
            </div>
            <div style={styles.tabs}>
              {['7', '14', '30'].map(d => (
                <button
                  key={d}
                  style={cashflowHorizon === d ? { ...styles.tabTrigger, ...styles.tabActive } : styles.tabTrigger}
                  onClick={() => setCashflowHorizon(d as any)}
                >
                  {d}D
                </button>
              ))}
            </div>
          </div>
          <div style={styles.cardContent}>
            {Object.entries(groupedCashflows).map(([category, items]) => (
              <div key={category} style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', fontSize: '13px', fontWeight: 600, color: '#475569', fontFamily: 'Inter, sans-serif' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <ChevronDown size={14} /> {category}
                  </div>
                  <Badge>{(items as any[]).length}</Badge>
                </div>
                <div>
                  {(items as any[]).map((cf, idx) => (
                    <div key={idx} style={{ ...styles.row, cursor: 'help' }} title={`Status: ${cf.status}`}>
                      <div style={{ width: '4px', height: '32px', borderRadius: '4px', background: cf.type === 'inflow' ? '#0d9488' : '#ea580c', marginRight: '12px' }}></div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '14px', fontWeight: 500, color: '#0f172a', fontFamily: 'Inter, sans-serif' }}>{cf.description}</div>
                        <div style={{ fontSize: '12px', color: '#64748b', display: 'flex', gap: '8px', fontFamily: 'Inter, sans-serif' }}>
                          {cf.date}
                          {cf.delay && <span style={{ color: '#d97706', background: '#fffbeb', padding: '0 4px', borderRadius: '4px' }}>Delay {cf.delay}d</span>}
                        </div>
                      </div>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: cf.type === 'inflow' ? '#0f766e' : '#c2410c', fontFamily: 'Inter, sans-serif' }}>
                        {cf.type === 'inflow' ? '+' : ''}{formatVal(Math.abs(cf.amount))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}