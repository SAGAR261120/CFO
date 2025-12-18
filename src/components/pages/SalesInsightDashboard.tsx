import React, { useState, useMemo, useEffect } from 'react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
  Legend, ResponsiveContainer, AreaChart, Area, ReferenceLine, Cell
} from 'recharts';
import {
  ShoppingCart, TrendingUp, Users, Target, Building2, IndianRupee, Calendar,
  Database, Download, ChevronDown, Lightbulb, Play, Pause, ArrowUpRight,
  ArrowDownRight, AlertTriangle, Info
} from 'lucide-react';

// --- Constants & Styles ---

const COLORS = {
  teal: '#0F766E',
  tealLight: '#F0FDFA',
  tealBorder: '#CCFBF1',
  slate: '#F1F5F9',
  slateDark: '#0F172A',
  text: '#334155',
  textLight: '#64748B',
  white: '#FFFFFF',
  border: '#E2E8F0',
  green: '#16A34A',
  greenBg: '#DCFCE7',
  amber: '#D97706',
  amberBg: '#FEF3C7',
  red: '#DC2626',
  redBg: '#FEE2E2',
  blue: '#2563EB',
  blueBg: '#DBEAFE',
  purple: '#7C3AED',
  purpleBg: '#F3E8FF',
};

const PERFORMANCE_STYLES: any = {
  Excellent: { bg: '#DCFCE7', color: '#166534', border: '#86EFAC' },
  Good: { bg: '#DBEAFE', color: '#1E40AF', border: '#93C5FD' },
  Declining: { bg: '#FEE2E2', color: '#991B1B', border: '#FECACA' },
};

const SEGMENT_STYLES: any = {
  Enterprise: { bg: '#F3E8FF', color: '#6B21A8', border: '#D8B4FE' },
  SME: { bg: '#DBEAFE', color: '#1E40AF', border: '#93C5FD' },
  Retail: { bg: '#DCFCE7', color: '#166534', border: '#86EFAC' },
};

// --- Mock Data ---

const salesTrendData = [
  { month: 'Jul', newCustomer: 18, repeatCustomer: 72, avgTicket: 38 },
  { month: 'Aug', newCustomer: 20, repeatCustomer: 78, avgTicket: 39 },
  { month: 'Sep', newCustomer: 22, repeatCustomer: 82, avgTicket: 40 },
  { month: 'Oct', newCustomer: 19, repeatCustomer: 85, avgTicket: 41 },
  { month: 'Nov', newCustomer: 21, repeatCustomer: 82, avgTicket: 42 },
  { month: 'Dec', newCustomer: 24, repeatCustomer: 86, avgTicket: 42 },
];

const funnelData = [
  { stage: 'Leads', count: 600, value: 360, conversion: 100, avgTicket: 60, color: '#3B82F6' },
  { stage: 'Proposal', count: 225, value: 135, conversion: 50, avgTicket: 60, color: '#0F766E' },
  { stage: 'Negotiation', count: 140, value: 98, conversion: 62, avgTicket: 70, color: '#F59E0B' },
  { stage: 'Closed Won', count: 95, value: 76, conversion: 68, avgTicket: 80, color: '#10B981' },
];

const productData = [
  { id: 1, product: 'ERP Solution', revenue: 35, margin: 62.9, growth: 18, share: 31.8, trend: [28, 30, 32, 33, 34, 35], performance: 'Excellent' },
  { id: 2, product: 'Analytics Suite', revenue: 28, margin: 58.5, growth: 25, share: 25.5, trend: [20, 22, 24, 26, 27, 28], performance: 'Excellent' },
  { id: 3, product: 'CRM Platform', revenue: 22, margin: 55.2, growth: 12, share: 20.0, trend: [18, 19, 20, 21, 21, 22], performance: 'Good' },
  { id: 4, product: 'Cloud Services', revenue: 15, margin: 48.8, growth: 8, share: 13.6, trend: [13, 13, 14, 14, 15, 15], performance: 'Good' },
  { id: 5, product: 'Mobile App', revenue: 10, margin: 42.1, growth: -5, share: 9.1, trend: [12, 11, 11, 10, 10, 10], performance: 'Declining' },
];

const topCustomers = [
  { id: 1, name: 'TechCorp Solutions', revenue: 12.5, profit: 7.8, growth: 15, segment: 'Enterprise', dso: 42, lastPurchase: 'Dec 15, 2024', profitTrend: [6.5, 6.8, 7.0, 7.3, 7.5, 7.8] },
  { id: 2, name: 'Global Industries', revenue: 10.2, profit: 6.1, growth: 22, segment: 'Enterprise', dso: 38, lastPurchase: 'Dec 20, 2024', profitTrend: [4.5, 4.9, 5.3, 5.6, 5.9, 6.1] },
  { id: 3, name: 'InnovateTech Ltd', revenue: 8.8, profit: 5.2, growth: 8, segment: 'SME', dso: 45, lastPurchase: 'Dec 18, 2024', profitTrend: [4.7, 4.8, 4.9, 5.0, 5.1, 5.2] },
  { id: 4, name: 'DataMasters Inc', revenue: 7.5, profit: 4.5, growth: 18, segment: 'SME', dso: 35, lastPurchase: 'Dec 22, 2024', profitTrend: [3.2, 3.5, 3.8, 4.1, 4.3, 4.5] },
  { id: 5, name: 'CloudFirst Systems', revenue: 6.8, profit: 4.0, growth: 12, segment: 'SME', dso: 40, lastPurchase: 'Dec 19, 2024', profitTrend: [3.3, 3.5, 3.6, 3.8, 3.9, 4.0] },
];

const retentionCohortData = [
  { cohort: 'Jul', m0: 100, m1: 92, m2: 88, m3: 84, m4: 81, m5: 78, m6: 75 },
  { cohort: 'Aug', m0: 100, m1: 94, m2: 90, m3: 86, m4: 82, m5: 79, m6: 0 },
  { cohort: 'Sep', m0: 100, m1: 93, m2: 89, m3: 84, m4: 80, m5: 0, m6: 0 },
  { cohort: 'Oct', m0: 100, m1: 95, m2: 91, m3: 87, m4: 0, m5: 0, m6: 0 },
  { cohort: 'Nov', m0: 100, m1: 96, m2: 92, m3: 0, m4: 0, m5: 0, m6: 0 },
  { cohort: 'Dec', m0: 100, m1: 94, m2: 0, m3: 0, m4: 0, m5: 0, m6: 0 },
];

// --- Reusable UI Components ---

const Card = ({ children, style = {}, className = '' }: any) => (
  <div className={className} style={{
    backgroundColor: COLORS.white,
    borderRadius: '12px',
    border: `1px solid ${COLORS.border}`,
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    ...style
  }}>
    {children}
  </div>
);

const Badge = ({ text, style = {} }: any) => (
  <span style={{
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '2px 8px',
    borderRadius: '999px',
    fontSize: '11px',
    fontWeight: 500,
    border: '1px solid transparent',
    whiteSpace: 'nowrap',
    fontFamily: 'Inter, sans-serif',
    ...style
  }}>
    {text}
  </span>
);

const Button = ({ children, variant = 'default', onClick, style = {} }: any) => {
  const baseStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '8px 16px',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s',
    border: 'none',
    gap: '6px',
    fontFamily: 'Inter, sans-serif'
  };
  const variants: any = {
    default: { backgroundColor: COLORS.teal, color: 'white' },
    outline: { backgroundColor: 'white', border: `1px solid ${COLORS.border}`, color: COLORS.text },
    ghost: { backgroundColor: 'transparent', color: COLORS.text },
  };
  return (
    <button onClick={onClick} style={{ ...baseStyle, ...variants[variant], ...style }}>
      {children}
    </button>
  );
};

const TabGroup = ({ options, active, onChange }: any) => (
  <div style={{ display: 'flex', backgroundColor: '#F1F5F9', borderRadius: '6px', padding: '2px' }}>
    {options.map((opt: any) => (
      <button
        key={opt.value}
        onClick={() => onChange(opt.value)}
        style={{
          padding: '6px 12px',
          fontSize: '13px',
          borderRadius: '4px',
          border: 'none',
          cursor: 'pointer',
          backgroundColor: active === opt.value ? 'white' : 'transparent',
          color: active === opt.value ? COLORS.slateDark : COLORS.textLight,
          boxShadow: active === opt.value ? '0 1px 2px rgba(0,0,0,0.1)' : 'none',
          fontWeight: active === opt.value ? 500 : 400,
          fontFamily: 'Inter, sans-serif'
        }}
      >
        {opt.label}
      </button>
    ))}
  </div>
);

// --- Main Dashboard Component ---

export default function SalesInsightDashboard() {
  const [chartView, setChartView] = useState('split');
  const [sortBy, setSortBy] = useState('revenue');
  const [customerSortBy, setCustomerSortBy] = useState('revenue');
  const [isPlaying, setIsPlaying] = useState(false);

  // KPIs
  const totalSales = salesTrendData[salesTrendData.length - 1].newCustomer + salesTrendData[salesTrendData.length - 1].repeatCustomer;
  const previousSales = salesTrendData[salesTrendData.length - 2].newCustomer + salesTrendData[salesTrendData.length - 2].repeatCustomer;
  const salesGrowth = ((totalSales - previousSales) / previousSales) * 100;
  
  const currentNewCustomers = salesTrendData[salesTrendData.length - 1].newCustomer;
  const previousNewCustomers = salesTrendData[salesTrendData.length - 2].newCustomer;
  const newCustomerGrowth = ((currentNewCustomers - previousNewCustomers) / previousNewCustomers) * 100;
  
  const avgTicketSize = salesTrendData[salesTrendData.length - 1].avgTicket;
  const previousAvgTicket = salesTrendData[salesTrendData.length - 2].avgTicket;
  const ticketGrowth = ((avgTicketSize - previousAvgTicket) / previousAvgTicket) * 100;
  
  const winRate = (funnelData[funnelData.length - 1].count / funnelData[0].count) * 100;
  const targetWinRate = 35;
  const winRateChange = 4.0;
  
  const newCustomerRatio = (currentNewCustomers / totalSales) * 100;
  const repeatCustomerRatio = 100 - newCustomerRatio;

  // Sorting logic
  const sortedProducts = useMemo(() => [...productData].sort((a: any, b: any) => b[sortBy] - a[sortBy]), [sortBy]);
  const sortedCustomers = useMemo(() => [...topCustomers].sort((a: any, b: any) => b[customerSortBy] - a[customerSortBy]), [customerSortBy]);

  const totalRevenue = productData.reduce((sum, p) => sum + p.revenue, 0);
  const top5Concentration = (topCustomers.reduce((sum, c) => sum + c.revenue, 0) / totalRevenue) * 100;

  // --- Speech Logic ---
  const aiInsightText = "Revenue grew 6.8% MoM to ₹110L, driven by Analytics Suite (+25% growth) and strong repeat customer performance (+9%). Win Rate improved 4pts to 32%, approaching the 35% target. Product performance shows mixed signals - Analytics Suite and ERP Solution lead with excellent margins (58%+).";

  // Cleanup speech when component unmounts
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handlePlayPause = () => {
    if (!('speechSynthesis' in window)) {
      alert("Text-to-speech is not supported in your browser.");
      return;
    }

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      window.speechSynthesis.cancel(); // Cancel any existing speech
      const utterance = new SpeechSynthesisUtterance(aiInsightText);
      utterance.rate = 1.0;
      
      utterance.onend = () => {
        setIsPlaying(false);
      };

      utterance.onerror = () => {
        setIsPlaying(false);
      };

      window.speechSynthesis.speak(utterance);
      setIsPlaying(true);
    }
  };

  // Styles
  const styles = {
    container: { fontFamily: 'Inter, sans-serif', backgroundColor: '#F8FAFC', minHeight: '100vh', padding: '24px', color: COLORS.slateDark },
    wrapper: { maxWidth: '1600px', margin: '0 auto', display: 'flex', flexDirection: 'column' as const, gap: '24px' },
    ribbon: { background: 'linear-gradient(to right, #F0FDFA, #F8FAFC)', border: `1px solid ${COLORS.tealBorder}`, borderRadius: '8px', padding: '12px 20px', display: 'flex', flexWrap: 'wrap' as const, alignItems: 'center', gap: '16px', fontSize: '13px' },
    ribbonItem: { display: 'flex', alignItems: 'center', gap: '6px', color: COLORS.text },
    divider: { height: '16px', width: '1px', backgroundColor: '#CBD5E1' },
    grid4: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' },
    cardHeader: { padding: '20px 24px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    cardTitle: { fontSize: '15px', fontWeight: 500, color: COLORS.slateDark, margin: 0, fontFamily: 'Poppins, sans-serif', lineHeight: 1.5 },
    cardContent: { padding: '0 24px 24px', flex: 1 },
    kpiValue: { fontSize: '24px', fontWeight: 600, color: COLORS.slateDark, marginTop: '4px' },
    table: { width: '100%', borderCollapse: 'collapse' as const, fontSize: '13px' },
    th: { textAlign: 'left' as const, padding: '12px 16px', color: COLORS.textLight, borderBottom: `1px solid ${COLORS.border}`, backgroundColor: '#F8FAFC', fontWeight: 500, fontFamily: 'Poppins, sans-serif' },
    td: { padding: '12px 16px', borderBottom: `1px solid ${COLORS.border}`, color: COLORS.text },
  };

  return (
    <div style={styles.container}>
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Poppins:wght@400;500;600&display=swap');`}
      </style>
      <div style={styles.wrapper}>

        {/* 1. Context Ribbon */}
        <div style={styles.ribbon}>
          <div style={styles.ribbonItem}><Building2 size={14} color={COLORS.teal} /> <span style={{ color: COLORS.textLight }}>Entity:</span> <b style={{fontWeight: 500}}>ABC Pvt Ltd</b></div>
          <div style={styles.divider} />
          <div style={styles.ribbonItem}><Calendar size={14} color={COLORS.teal} /> <span>FY 2024–25</span></div>
          <div style={styles.divider} />
          <div style={styles.ribbonItem}><IndianRupee size={14} color={COLORS.teal} /> <span style={{ color: COLORS.textLight }}>Reporting Currency:</span> <b style={{fontWeight: 500}}>INR</b></div>
          <div style={styles.divider} />
          <div style={styles.ribbonItem}><Database size={14} color={COLORS.teal} /> <span style={{ color: COLORS.textLight }}>Data as of:</span> <b style={{fontWeight: 500}}>Dec 2024</b></div>
        </div>

        {/* 2. AI Summary Card */}
        <Card style={{ background: 'linear-gradient(to bottom right, #FFFFFF, #F0FDFA)', border: `1px solid ${COLORS.tealBorder}` }}>
          <div style={styles.cardContent}>
            <div style={{ display: 'flex', gap: '16px', marginTop: '20px' }}>
              <div style={{ position: 'relative' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'linear-gradient(135deg, #0F766E, #115E59)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #5EEAD4' }}>
                  <Users size={28} color="white" />
                </div>
                {isPlaying && <div style={{ position: 'absolute', bottom: -2, right: -2, width: '16px', height: '16px', backgroundColor: COLORS.red, borderRadius: '50%', border: '2px solid white' }} />}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: 500, margin: 0, fontFamily: 'Poppins, sans-serif' }}>AI Sales Summary </h3>
                    <p style={{ fontSize: '13px', color: COLORS.textLight, margin: '4px 0 0' }}>Automated insights on sales performance and trends</p>
                  </div>
                  <Button variant="outline" onClick={handlePlayPause}>
                    {isPlaying ? <Pause size={14} /> : <Play size={14} />} {isPlaying ? 'Pause' : 'Play'}
                  </Button>
                </div>
                <div style={{ marginTop: '12px', backgroundColor: 'white', border: `1px solid ${COLORS.tealBorder}`, borderRadius: '8px', padding: '12px', fontSize: '14px', lineHeight: '1.5', color: COLORS.text }}>
                  "{aiInsightText}"
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* 3. Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button variant="outline"><Lightbulb size={14} /> View AI Summary</Button>
          <Button variant="outline"><Download size={14} /> Export Report <ChevronDown size={14} /></Button>
        </div>

        {/* 4. KPI Cards */}
        <div style={styles.grid4}>
          <Card>
            <div style={styles.cardHeader}><span style={{ fontSize: '13px', color: COLORS.textLight }}>Total Sales</span><ShoppingCart size={18} color={COLORS.teal} /></div>
            <div style={styles.cardContent}>
              <div style={styles.kpiValue}>₹{totalSales}L</div>
              <div style={{ fontSize: '12px', color: salesGrowth > 0 ? COLORS.green : COLORS.red, marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                {salesGrowth > 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />} {salesGrowth.toFixed(1)}% MoM
              </div>
              <div style={{ height: '30px', marginTop: '12px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={salesTrendData.map(d => ({ v: d.newCustomer + d.repeatCustomer }))}>
                    <Line type="monotone" dataKey="v" stroke={COLORS.teal} strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div style={{ fontSize: '11px', color: COLORS.textLight, marginTop: '8px' }}>
                <span style={{ color: COLORS.teal }}>{newCustomerRatio.toFixed(0)}% New</span> / {repeatCustomerRatio.toFixed(0)}% Repeat
              </div>
            </div>
          </Card>

          <Card style={{ border: `2px solid ${winRate >= targetWinRate ? '#86EFAC' : '#FCA5A5'}`, backgroundColor: winRate >= targetWinRate ? '#F0FDF4' : '#FEF2F2' }}>
            <div style={styles.cardHeader}><span style={{ fontSize: '13px', color: COLORS.textLight }}>Win Rate</span><Target size={18} color={COLORS.teal} /></div>
            <div style={styles.cardContent}>
              <div style={{ ...styles.kpiValue, color: winRate >= targetWinRate ? '#14532D' : '#7F1D1D' }}>{winRate.toFixed(1)}%</div>
              <div style={{ fontSize: '12px', color: COLORS.green, marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <ArrowUpRight size={14} /> +{winRateChange.toFixed(1)}pts improvement
              </div>
              <div style={{ fontSize: '11px', color: COLORS.textLight, marginTop: '12px' }}>Target: {targetWinRate}%</div>
            </div>
          </Card>

          <Card>
            <div style={styles.cardHeader}><span style={{ fontSize: '13px', color: COLORS.textLight }}>Avg Ticket Size</span><TrendingUp size={18} color={COLORS.teal} /></div>
            <div style={styles.cardContent}>
              <div style={styles.kpiValue}>₹{avgTicketSize}K</div>
              <div style={{ fontSize: '12px', color: ticketGrowth > 0 ? COLORS.green : COLORS.red, marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                {ticketGrowth > 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />} {ticketGrowth.toFixed(1)}% change
              </div>
              <div style={{ height: '30px', marginTop: '12px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={salesTrendData.map(d => ({ v: d.avgTicket }))}>
                    <Line type="monotone" dataKey="v" stroke={COLORS.purple} strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div style={{ fontSize: '11px', color: COLORS.textLight, marginTop: '8px' }}>Target: ₹45K</div>
            </div>
          </Card>

          <Card>
            <div style={styles.cardHeader}><span style={{ fontSize: '13px', color: COLORS.textLight }}>New Customers</span><Users size={18} color={COLORS.teal} /></div>
            <div style={styles.cardContent}>
              <div style={styles.kpiValue}>₹{currentNewCustomers}L</div>
              <div style={{ fontSize: '12px', color: newCustomerGrowth > 0 ? COLORS.green : COLORS.red, marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                {newCustomerGrowth > 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />} {newCustomerGrowth.toFixed(1)}% MoM
              </div>
              <div style={{ height: '30px', marginTop: '12px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={salesTrendData.map(d => ({ v: d.newCustomer }))}>
                    <Line type="monotone" dataKey="v" stroke={COLORS.amber} strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div style={{ fontSize: '11px', color: COLORS.textLight, marginTop: '8px' }}>Acquisition vs Retention</div>
            </div>
          </Card>
        </div>

        {/* 5. Sales Trend Chart */}
        <Card>
          <div style={styles.cardHeader}>
            <div>
              <h3 style={styles.cardTitle}>Sales Trend & Customer Mix</h3>
              <p style={{ fontSize: '13px', color: COLORS.textLight, marginTop: '2px' }}>Revenue breakdown by customer type with average ticket trend</p>
            </div>
            <TabGroup options={[{label:'Split View', value:'split'}, {label:'Stacked %', value:'stacked'}]} active={chartView} onChange={setChartView} />
          </div>
          <div style={styles.cardContent}>
            <div style={{ height: '350px', width: '100%' }}>
              <ResponsiveContainer>
                <AreaChart data={salesTrendData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize:12, fill:COLORS.textLight}} />
                  <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{fontSize:12, fill:COLORS.textLight}} label={{value:'Sales (₹L)', angle:-90, position:'insideLeft', style:{fill:COLORS.textLight, fontSize:12}}} />
                  <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{fontSize:12, fill:COLORS.textLight}} label={{value:'Avg Ticket (₹K)', angle:90, position:'insideRight', style:{fill:COLORS.textLight, fontSize:12}}} />
                  <RechartsTooltip />
                  <Legend />
                  <ReferenceLine yAxisId="right" y={45} stroke="#DC2626" strokeDasharray="5 5" label="target ₹45K" />
                  <Area type="monotone" dataKey="repeatCustomer" stackId="1" stroke={COLORS.teal} fill={COLORS.teal} fillOpacity={0.6} name="Repeat Customers" yAxisId="left" />
                  <Area type="monotone" dataKey="newCustomer" stackId="1" stroke={COLORS.purple} fill={COLORS.purple} fillOpacity={0.6} name="New Customers" yAxisId="left" />
                  <Line type="monotone" dataKey="avgTicket" stroke={COLORS.amber} strokeWidth={2} dot={{r:4}} name="Avg Ticket" yAxisId="right" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>

        {/* 6. Funnel Chart */}
        <Card>
          <div style={styles.cardHeader}>
            <div>
              <h3 style={styles.cardTitle}>Sales Funnel Analysis</h3>
              <p style={{ fontSize: '13px', color: COLORS.textLight, marginTop: '2px' }}>Pipeline conversion rates and deal velocity</p>
            </div>
            <div style={{fontSize: '13px', color: COLORS.textLight}}>Target Win Rate: <b style={{fontWeight: 500}}>35%</b> (Current: <span style={{color: COLORS.amber}}>15.8%</span>)</div>
          </div>
          <div style={styles.cardContent}>
            <div style={{ height: '400px', width: '100%' }}>
              <ResponsiveContainer>
                <BarChart data={funnelData} layout="vertical" margin={{top: 20, right: 30, left: 20, bottom: 5}}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
                  <XAxis type="number" hide />
                  <YAxis dataKey="stage" type="category" width={100} tick={{fontSize:12, fill:COLORS.textLight}} />
                  <RechartsTooltip cursor={{fill: 'transparent'}} />
                  <Bar dataKey="count" barSize={40} background={{ fill: '#F1F5F9' }}>
                    {funnelData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                  {/* Custom Trendline Overlay for Conversion */}
                  <Line dataKey="conversion" stroke="#DC2626" strokeWidth={2} dot={{r:4, fill:'#DC2626'}} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            {/* Drop-off Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginTop: '20px' }}>
              {funnelData.slice(0, -1).map((stage, i) => {
                const next = funnelData[i+1];
                const drop = ((stage.count - next.count)/stage.count)*100;
                return (
                  <div key={stage.stage} style={{ backgroundColor: '#F8FAFC', padding: '12px', borderRadius: '8px', border: `1px solid ${COLORS.border}` }}>
                    <div style={{ fontSize: '11px', color: COLORS.textLight, marginBottom: '4px' }}>{stage.stage} → {next.stage}</div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: COLORS.red }}>-{drop.toFixed(0)}% drop-off</div>
                    <div style={{ fontSize: '11px', color: COLORS.textLight, marginTop: '2px' }}>{stage.count - next.count} deals lost</div>
                  </div>
                );
              })}
            </div>
            
            <div style={{ marginTop: '20px' }}>
               <div style={{display:'flex', justifyContent:'space-between', fontSize:'12px', marginBottom:'4px'}}>
                  <span>Win Rate Progress</span>
                  <span>15.8% / 35%</span>
               </div>
               <div style={{width:'100%', height:'8px', backgroundColor:'#E2E8F0', borderRadius:'999px', overflow:'hidden'}}>
                  <div style={{width:'45%', height:'100%', backgroundColor:COLORS.teal}} />
               </div>
            </div>
          </div>
        </Card>

        {/* 7. Product Performance */}
        <Card>
          <div style={styles.cardHeader}>
            <h3 style={styles.cardTitle}>Product Performance Analysis</h3>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', color: COLORS.textLight }}>Sort by:</span>
              <TabGroup options={[{label:'Revenue', value:'revenue'}, {label:'Margin', value:'margin'}, {label:'Growth', value:'growth'}]} active={sortBy} onChange={setSortBy} />
            </div>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
              <thead>
                <tr style={{ backgroundColor: '#F8FAFC' }}>
                  {['Product', 'Revenue (₹L)', 'Share %', 'Margin %', 'Growth %', 'Trend (3mo)', 'Performance'].map((h, i) => (
                    <th key={i} style={{ ...styles.th, textAlign: i > 0 && i < 5 ? 'right' : 'left' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sortedProducts.map((p) => (
                  <tr key={p.id} style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                    <td style={styles.td}>{p.product}</td>
                    <td style={{ ...styles.td, textAlign: 'right' }}>₹{p.revenue}</td>
                    <td style={{ ...styles.td, textAlign: 'right' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                        <span>{p.share.toFixed(1)}%</span>
                        <div style={{ width: '40px', height: '4px', backgroundColor: '#E2E8F0', borderRadius: '2px' }}>
                          <div style={{ width: `${p.share}%`, height: '100%', backgroundColor: COLORS.teal, borderRadius: '2px' }} />
                        </div>
                      </div>
                    </td>
                    <td style={{ ...styles.td, textAlign: 'right', color: p.margin >= 50 ? COLORS.green : COLORS.text }}>{p.margin}%</td>
                    <td style={{ ...styles.td, textAlign: 'right', color: p.growth > 0 ? COLORS.green : COLORS.red }}>{p.growth > 0 ? '+' : ''}{p.growth}%</td>
                    <td style={styles.td}>
                      <div style={{ width: '60px', height: '20px' }}>
                        <ResponsiveContainer>
                          <LineChart data={p.trend.map(v => ({v}))}>
                            <Line type="monotone" dataKey="v" stroke={p.growth > 0 ? COLORS.green : COLORS.red} strokeWidth={2} dot={false} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </td>
                    <td style={styles.td}>
                      <Badge 
                        text={p.performance} 
                        style={{ backgroundColor: PERFORMANCE_STYLES[p.performance].bg, color: PERFORMANCE_STYLES[p.performance].color, border: `1px solid ${PERFORMANCE_STYLES[p.performance].border}` }} 
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* 8. Top Customer Analysis */}
        <Card>
          <div style={styles.cardHeader}>
            <div>
              <h3 style={styles.cardTitle}>Top Customer Analysis</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px', fontSize: '12px' }}>
                <AlertTriangle size={14} color={COLORS.amber} />
                <span style={{ color: COLORS.textLight }}>Top 5 Concentration:</span>
                <Badge 
                  text={`${top5Concentration.toFixed(1)}% (Moderate Risk)`} 
                  style={{ backgroundColor: '#FEF3C7', color: '#B45309', border: '1px solid #FDBA74' }} 
                />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', color: COLORS.textLight }}>Sort by:</span>
              <TabGroup options={[{label:'Revenue', value:'revenue'}, {label:'Profit', value:'profit'}, {label:'Growth', value:'growth'}]} active={customerSortBy} onChange={setCustomerSortBy} />
            </div>
          </div>
          <div style={styles.cardContent}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {sortedCustomers.map((c, i) => (
                <div key={c.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', border: `1px solid ${COLORS.border}`, borderRadius: '8px', backgroundColor: 'white' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#CCFBF1', color: COLORS.teal, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold' }}>{i + 1}</div>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 600 }}>{c.name}</div>
                      <Badge 
                        text={c.segment} 
                        style={{ fontSize: '10px', marginTop: '2px', backgroundColor: SEGMENT_STYLES[c.segment].bg, color: SEGMENT_STYLES[c.segment].color, border: `1px solid ${SEGMENT_STYLES[c.segment].border}` }} 
                      />
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '11px', color: COLORS.textLight }}>Revenue</div>
                      <div style={{ fontSize: '13px', fontWeight: 600 }}>₹{c.revenue}L</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '11px', color: COLORS.textLight }}>Profit</div>
                      <div style={{ fontSize: '13px', fontWeight: 600 }}>₹{c.profit}L</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '11px', color: COLORS.textLight }}>Growth</div>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: COLORS.green }}>+{c.growth}%</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* 9. Retention Cohort */}
        <Card>
          <div style={styles.cardHeader}>
            <div>
              <h3 style={styles.cardTitle}>Customer Retention Cohort Analysis</h3>
              <p style={{ fontSize: '13px', color: COLORS.textLight }}>Monthly cohort retention rates (%)</p>
            </div>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
              <thead>
                <tr>
                  <th style={{...styles.th, width: '100px'}}>Cohort</th>
                  {['M0', 'M1', 'M2', 'M3', 'M4', 'M5', 'M6'].map(m => <th key={m} style={{...styles.th, textAlign: 'center'}}>{m}</th>)}
                </tr>
              </thead>
              <tbody>
                {retentionCohortData.map((row) => (
                  <tr key={row.cohort}>
                    <td style={{...styles.td, fontWeight: 500}}>{row.cohort}</td>
                    {[row.m0, row.m1, row.m2, row.m3, row.m4, row.m5, row.m6].map((val, idx) => {
                      if (val === 0) return <td key={idx} style={{...styles.td, backgroundColor: '#F8FAFC'}}></td>;
                      const bg = val >= 90 ? '#DCFCE7' : val >= 80 ? '#DBEAFE' : '#FFEDD5';
                      const color = val >= 90 ? '#166534' : val >= 80 ? '#1E40AF' : '#9A3412';
                      return (
                        <td key={idx} style={{...styles.td, textAlign: 'center', backgroundColor: bg, color: color, fontWeight: 500}}>
                          {val}%
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ padding: '16px', display: 'flex', gap: '24px', fontSize: '12px', borderTop: `1px solid ${COLORS.border}` }}>
             <div style={{display:'flex', alignItems:'center', gap:'6px'}}>
                <div style={{width:12, height:12, backgroundColor:'#DCFCE7', borderRadius:2}}></div> <span>90-100% (Excellent)</span>
             </div>
             <div style={{display:'flex', alignItems:'center', gap:'6px'}}>
                <div style={{width:12, height:12, backgroundColor:'#DBEAFE', borderRadius:2}}></div> <span>80-89% (Good)</span>
             </div>
             <div style={{display:'flex', alignItems:'center', gap:'6px'}}>
                <div style={{width:12, height:12, backgroundColor:'#FFEDD5', borderRadius:2}}></div> <span>&lt;80% (At Risk)</span>
             </div>
          </div>
        </Card>

      </div>
    </div>
  );
}