import React, { useState } from 'react';
import {
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
  Legend, ResponsiveContainer
} from 'recharts';
import {
  Target, TrendingUp, CheckCircle, AlertCircle, Building2, IndianRupee, Calendar,
  Database, Info, BarChart2, Download, ChevronDown, Filter, Bell, Calculator,
  Lightbulb, ArrowUpRight, ArrowDownRight, Activity, X
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
  greenBorder: '#86EFAC',
  amber: '#D97706',
  amberBg: '#FEF3C7',
  amberBorder: '#FDBA74',
  red: '#DC2626',
  redBg: '#FEE2E2',
  redBorder: '#FECACA',
  blue: '#2563EB',
  blueBg: '#DBEAFE',
  blueBorder: '#BFDBFE',
};

const STATUS_STYLES: any = {
  excellent: { color: COLORS.green, bg: COLORS.greenBg, border: COLORS.greenBorder, icon: '🟢', label: 'Excellent' },
  good: { color: COLORS.amber, bg: COLORS.amberBg, border: COLORS.amberBorder, icon: '🟡', label: 'Good' },
  'needs-improvement': { color: COLORS.red, bg: COLORS.redBg, border: COLORS.redBorder, icon: '🔴', label: 'Needs Improvement' },
};

// --- Mock Data ---

const profitabilityRatios = [
  { id: 'gross-margin', name: 'Gross Margin %', value: 42.5, target: 40.0, industry: 38.5, change: 2.3, trend: [38.2, 39.5, 40.1, 41.2, 41.8, 42.5], status: 'excellent', formula: '(Revenue - COGS) / Revenue × 100', insight: 'Gross margin improved 2.3pts YoY driven by favorable product mix and procurement cost optimization.', category: 'Profitability' },
  { id: 'ebitda-margin', name: 'EBITDA Margin %', value: 22.7, target: 24.0, industry: 20.0, change: 1.8, trend: [20.2, 20.8, 21.5, 22.0, 22.3, 22.7], status: 'good', formula: 'EBITDA / Revenue × 100', insight: 'EBITDA margin trending upward, currently 1.3pts below target but 2.7pts above industry average.', category: 'Profitability' },
  { id: 'net-margin', name: 'Net Profit Margin %', value: 15.8, target: 16.0, industry: 13.5, change: 1.2, trend: [14.2, 14.6, 15.0, 15.3, 15.5, 15.8], status: 'good', formula: 'Net Profit / Revenue × 100', insight: 'Net margin near target with steady improvement, outperforming industry by 2.3pts.', category: 'Profitability' },
  { id: 'roe', name: 'Return on Equity (ROE)', value: 18.5, target: 18.0, industry: 15.2, change: 0.8, trend: [17.2, 17.5, 17.8, 18.0, 18.2, 18.5], status: 'excellent', formula: 'Net Profit / Average Equity × 100', insight: 'ROE exceeds target, demonstrating strong shareholder returns and efficient equity utilization.', category: 'Profitability' },
  { id: 'roa', name: 'Return on Assets (ROA)', value: 8.2, target: 10.0, industry: 7.5, change: -2.0, trend: [10.5, 10.2, 9.8, 9.2, 8.6, 8.2], status: 'needs-improvement', formula: 'Net Profit / Average Total Assets × 100', insight: 'ROA dropped 2pts due to 8% increase in fixed assets while profit remained relatively flat.', category: 'Profitability' },
];

const liquidityRatios = [
  { id: 'current-ratio', name: 'Current Ratio', value: 2.1, target: 2.0, industry: 1.8, change: 0.15, trend: [1.85, 1.92, 1.98, 2.05, 2.08, 2.1], status: 'excellent', formula: 'Current Assets / Current Liabilities', insight: 'Strong liquidity position with adequate current assets to cover short-term obligations.', category: 'Liquidity' },
  { id: 'quick-ratio', name: 'Quick Ratio', value: 1.5, target: 1.2, industry: 1.1, change: 0.12, trend: [1.32, 1.38, 1.42, 1.45, 1.48, 1.5], status: 'excellent', formula: '(Current Assets - Inventory) / Current Liabilities', insight: 'Quick ratio well above target, indicating strong ability to meet immediate obligations.', category: 'Liquidity' },
];

const efficiencyRatios = [
  { id: 'inventory-turnover', name: 'Inventory Turnover', value: 8.5, target: 10.0, industry: 7.2, change: 0.8, trend: [7.2, 7.5, 7.9, 8.1, 8.3, 8.5], status: 'good', formula: 'COGS / Average Inventory', insight: 'Inventory turnover improving but still below target; opportunity for working capital optimization.', category: 'Efficiency' },
  { id: 'asset-turnover', name: 'Asset Turnover', value: 1.2, target: 1.5, industry: 1.1, change: -0.15, trend: [1.42, 1.38, 1.32, 1.28, 1.24, 1.2], status: 'needs-improvement', formula: 'Revenue / Average Total Assets', insight: 'Asset turnover declining due to recent capital investments; expect improvement as new assets ramp up.', category: 'Efficiency' },
];

const leverageRatios = [
  { id: 'debt-equity', name: 'Debt to Equity', value: 0.45, target: 0.50, industry: 0.65, change: -0.05, trend: [0.58, 0.55, 0.52, 0.49, 0.47, 0.45], status: 'excellent', formula: 'Total Debt / Total Equity', insight: 'Conservative leverage position with debt well below industry average; room for strategic debt utilization.', category: 'Leverage' },
  { id: 'interest-coverage', name: 'Interest Coverage', value: 12.5, target: 10.0, industry: 8.5, change: 1.2, trend: [10.8, 11.2, 11.6, 11.9, 12.2, 12.5], status: 'excellent', formula: 'EBITDA / Interest Expense', insight: 'Strong interest coverage indicating low financial risk and capacity for additional debt if needed.', category: 'Leverage' },
];

const growthRatios = [
  { id: 'revenue-growth', name: 'Revenue Growth %', value: 18.5, target: 15.0, industry: 12.5, change: 3.5, trend: [12.2, 13.5, 15.0, 16.2, 17.5, 18.5], status: 'excellent', formula: '(Current Revenue - Prior Revenue) / Prior Revenue × 100', insight: 'Revenue growth exceeding target and industry, driven by strong market expansion and new product launches.', category: 'Growth' },
  { id: 'eps-growth', name: 'EPS Growth %', value: 22.3, target: 18.0, industry: 15.0, change: 4.3, trend: [15.5, 17.2, 18.8, 20.1, 21.2, 22.3], status: 'excellent', formula: '(Current EPS - Prior EPS) / Prior EPS × 100', insight: 'EPS growth outpacing revenue growth, reflecting operational leverage and margin expansion.', category: 'Growth' },
];

const allRatios = [...profitabilityRatios, ...liquidityRatios, ...efficiencyRatios, ...leverageRatios, ...growthRatios];

// --- Reusable UI Components ---

const Card = ({ children, style = {}, onClick, className = '' }: any) => (
  <div onClick={onClick} className={className} style={{
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

const Select = ({ value, onChange, options, style = {} }: any) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    style={{
      padding: '6px 10px',
      borderRadius: '6px',
      border: `1px solid ${COLORS.border}`,
      fontSize: '13px',
      color: COLORS.text,
      backgroundColor: 'white',
      outline: 'none',
      cursor: 'pointer',
      fontFamily: 'Inter, sans-serif',
      ...style
    }}
  >
    {options.map((opt: string) => (
      <option key={opt} value={opt}>{opt}</option>
    ))}
  </select>
);

const Modal = ({ isOpen, onClose, title, children }: any) => {
  if (!isOpen) return null;
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white', borderRadius: '12px', width: '600px', maxWidth: '90%',
        maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ padding: '20px', borderBottom: `1px solid ${COLORS.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 500, color: COLORS.slateDark, fontFamily: 'Poppins, sans-serif' }}>{title}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
        </div>
        <div style={{ padding: '24px' }}>{children}</div>
      </div>
    </div>
  );
};

// --- Main Dashboard Component ---

export default function KPIDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('Quarter');
  const [selectedCategory, setSelectedCategory] = useState('All Ratios');
  const [selectedRatioId, setSelectedRatioId] = useState<string | null>(null);
  const [drillDownOpen, setDrillDownOpen] = useState(false);
  const [scenarioOpen, setScenarioOpen] = useState(false);
  const [cogsReduction, setCogsReduction] = useState('');
  const [activeTab, setActiveTab] = useState('Quarter');

  // Filter Logic
  const displayedRatios = selectedCategory === 'All Ratios' 
    ? allRatios 
    : allRatios.filter(r => r.category === selectedCategory);

  const selectedRatio = selectedRatioId ? allRatios.find(r => r.id === selectedRatioId) : null;

  // KPI Calculations
  const totalRatios = allRatios.length;
  const excellentCount = allRatios.filter(r => r.status === 'excellent').length;
  const goodCount = allRatios.filter(r => r.status === 'good').length;
  const needsImprovementCount = allRatios.filter(r => r.status === 'needs-improvement').length;
  const onTrackCount = excellentCount + goodCount;
  const avgPerformance = (allRatios.reduce((sum, r) => sum + (r.value / r.target) * 100, 0) / totalRatios);

  // Handlers
  const handleDrillDown = (ratioId: string) => {
    setSelectedRatioId(ratioId);
    setDrillDownOpen(true);
  };

  // --- Styles ---
  const styles = {
    container: { fontFamily: 'Inter, sans-serif', backgroundColor: '#F8FAFC', minHeight: '100vh', padding: '24px', color: COLORS.slateDark },
    wrapper: { maxWidth: '1600px', margin: '0 auto', display: 'flex', flexDirection: 'column' as const, gap: '24px' },
    ribbon: { background: 'linear-gradient(to right, #F0FDFA, #F8FAFC)', border: `1px solid ${COLORS.tealBorder}`, borderRadius: '8px', padding: '12px 20px', display: 'flex', flexWrap: 'wrap' as const, alignItems: 'center', gap: '16px', fontSize: '13px' },
    ribbonItem: { display: 'flex', alignItems: 'center', gap: '6px', color: COLORS.text },
    divider: { height: '16px', width: '1px', backgroundColor: '#CBD5E1' },
    grid4: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' },
    gridRatios: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' },
    cardHeader: { padding: '20px 24px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    cardTitle: { fontSize: '14px', fontWeight: 500, color: COLORS.slateDark, margin: 0, fontFamily: 'Poppins, sans-serif', lineHeight: 1.5 },
    cardContent: { padding: '0 24px 24px', flex: 1 },
    kpiValue: { fontSize: '24px', fontWeight: 600, color: COLORS.slateDark, marginTop: '4px' },
    progressBarBg: { height: '4px', width: '100%', backgroundColor: '#E2E8F0', borderRadius: '999px', marginTop: '12px', overflow: 'hidden' },
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
          <div style={styles.ribbonItem}><IndianRupee size={14} color={COLORS.teal} /> <span style={{ color: COLORS.textLight }}>Currency:</span> <b style={{fontWeight: 500}}>INR</b></div>
          <div style={styles.divider} />
          <div style={styles.ribbonItem}><Database size={14} color={COLORS.teal} /> <span style={{ color: COLORS.textLight }}>Data as of:</span> <b style={{fontWeight: 500}}>Dec 2024</b></div>
        </div>

        {/* 2. Controls Bar */}
        <Card>
          <div style={{ padding: '20px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: COLORS.text }}><Filter size={16} color={COLORS.teal} /> Period:</div>
              <div style={{ display: 'flex', backgroundColor: '#F1F5F9', borderRadius: '6px', padding: '2px' }}>
                {['Month', 'Quarter', 'YTD'].map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)} style={{
                    padding: '6px 12px', fontSize: '13px', borderRadius: '4px', border: 'none', cursor: 'pointer',
                    backgroundColor: activeTab === tab ? 'white' : 'transparent', color: activeTab === tab ? COLORS.slateDark : COLORS.textLight,
                    boxShadow: activeTab === tab ? '0 1px 2px rgba(0,0,0,0.1)' : 'none',
                    fontWeight: activeTab === tab ? 500 : 400
                  }}>{tab}</button>
                ))}
              </div>
              <div style={styles.divider} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <label style={{ fontSize: '13px', color: COLORS.textLight }}>Category:</label>
                <Select value={selectedCategory} onChange={setSelectedCategory} options={['All Ratios', 'Profitability', 'Liquidity', 'Efficiency', 'Leverage', 'Growth']} />
              </div>
              <div style={styles.divider} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <label style={{ fontSize: '13px', color: COLORS.textLight }}>Benchmark:</label>
                <Select value="Industry Avg" onChange={() => {}} options={['Industry Avg', 'Competitor A', 'Best in Class']} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <Button variant="outline" onClick={() => alert("Alert Set!")}><Bell size={14} /> Set Alert</Button>
              <Button variant="outline" onClick={() => setScenarioOpen(true)}><Calculator size={14} /> Scenario</Button>
              <Button variant="outline"><Download size={14} /> Export <ChevronDown size={14} /></Button>
            </div>
          </div>
        </Card>

        {/* 3. Summary KPIs */}
        <div style={styles.grid4}>
          <Card style={{ borderLeft: `4px solid ${COLORS.teal}` }}>
            <div style={styles.cardHeader}><span style={{ fontSize: '13px', color: COLORS.textLight }}>Ratios on Track</span><CheckCircle size={18} color={COLORS.green} /></div>
            <div style={styles.cardContent}>
              <div style={styles.kpiValue}>{onTrackCount} / {totalRatios}</div>
              <div style={{ fontSize: '12px', color: COLORS.green, marginTop: '4px' }}>{((onTrackCount / totalRatios) * 100).toFixed(1)}% achievement</div>
              <div style={styles.progressBarBg}><div style={{ width: `${(onTrackCount / totalRatios) * 100}%`, height: '100%', backgroundColor: COLORS.teal }} /></div>
            </div>
          </Card>
          <Card style={{ borderLeft: `4px solid ${COLORS.green}` }}>
            <div style={styles.cardHeader}><span style={{ fontSize: '13px', color: COLORS.textLight }}>Excellent Performance</span><TrendingUp size={18} color={COLORS.green} /></div>
            <div style={styles.cardContent}>
              <div style={{ ...styles.kpiValue, color: '#14532D' }}>{excellentCount} Ratios</div>
              <div style={{ fontSize: '12px', color: COLORS.green, marginTop: '4px' }}>Exceeding targets</div>
              <div style={styles.progressBarBg}><div style={{ width: `${(excellentCount / totalRatios) * 100}%`, height: '100%', backgroundColor: COLORS.green }} /></div>
            </div>
          </Card>
          <Card style={{ borderLeft: `4px solid ${COLORS.red}` }}>
            <div style={styles.cardHeader}><span style={{ fontSize: '13px', color: COLORS.textLight }}>Needs Attention</span><AlertCircle size={18} color={COLORS.red} /></div>
            <div style={styles.cardContent}>
              <div style={{ ...styles.kpiValue, color: '#7F1D1D' }}>{needsImprovementCount} Ratios</div>
              <div style={{ fontSize: '12px', color: COLORS.red, marginTop: '4px' }}>Below target threshold</div>
              <div style={styles.progressBarBg}><div style={{ width: `${(needsImprovementCount / totalRatios) * 100}%`, height: '100%', backgroundColor: COLORS.red }} /></div>
            </div>
          </Card>
          <Card style={{ borderLeft: `4px solid ${COLORS.teal}` }}>
            <div style={styles.cardHeader}><span style={{ fontSize: '13px', color: COLORS.textLight }}>Overall Score</span><Target size={18} color={COLORS.teal} /></div>
            <div style={styles.cardContent}>
              <div style={styles.kpiValue}>{avgPerformance.toFixed(0)}%</div>
              <div style={{ fontSize: '12px', color: COLORS.green, marginTop: '4px' }}>Above target</div>
              <div style={styles.progressBarBg}><div style={{ width: `${Math.min(avgPerformance, 100)}%`, height: '100%', backgroundColor: COLORS.teal }} /></div>
            </div>
          </Card>
        </div>

        {/* 4. Ratio Grid */}
        <div style={styles.gridRatios}>
          {displayedRatios.map(ratio => (
            <Card key={ratio.id} onClick={() => handleDrillDown(ratio.id)} style={{ cursor: 'pointer', transition: 'transform 0.1s', borderTop: `4px solid ${STATUS_STYLES[ratio.status].border}` }}>
              <div style={{ ...styles.cardHeader, borderBottom: '1px solid #F1F5F9' }}>
                <div>
                  <h3 style={styles.cardTitle}>{ratio.name}</h3>
                  <div style={{ fontSize: '11px', color: COLORS.textLight, marginTop: '2px' }}>{ratio.category}</div>
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                   <Info size={14} color={COLORS.textLight} />
                   <BarChart2 size={14} color={COLORS.teal} />
                </div>
              </div>
              <div style={styles.cardContent}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', margin: '16px 0' }}>
                   <div>
                      <div style={styles.kpiValue}>{ratio.value}%</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', marginTop: '4px', color: ratio.change > 0 ? COLORS.green : COLORS.red }}>
                         {ratio.change > 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                         {ratio.change > 0 ? '+' : ''}{ratio.change}pts vs LY
                      </div>
                   </div>
                   <div style={{ width: '80px', height: '40px' }}>
                      <ResponsiveContainer width="100%" height="100%">
                         <LineChart data={ratio.trend.map(v => ({v}))}>
                            <Line type="monotone" dataKey="v" stroke={ratio.change > 0 ? COLORS.green : COLORS.red} strokeWidth={2} dot={false} />
                         </LineChart>
                      </ResponsiveContainer>
                   </div>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: COLORS.textLight, marginBottom: '8px' }}>
                   <span>Target: <b style={{color: COLORS.slateDark, fontWeight: 500}}>{ratio.target}%</b></span>
                   <span>Industry: <b style={{color: COLORS.slateDark, fontWeight: 500}}>{ratio.industry}%</b></span>
                </div>

                <div style={{ height: '6px', width: '100%', backgroundColor: '#E2E8F0', borderRadius: '999px', overflow: 'hidden', display: 'flex' }}>
                   <div style={{ width: `${Math.min((ratio.value / ratio.target) * 100, 100)}%`, backgroundColor: ratio.value >= ratio.target ? COLORS.green : COLORS.amber }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: COLORS.textLight, marginTop: '4px' }}>
                   <span>{((ratio.value / ratio.target) * 100).toFixed(0)}% of target</span>
                   <span>{ratio.value > ratio.target ? `+${(ratio.value - ratio.target).toFixed(1)}` : `${(ratio.value - ratio.target).toFixed(1)}`}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #F1F5F9' }}>
                   <Badge text={`${STATUS_STYLES[ratio.status].icon} ${STATUS_STYLES[ratio.status].label}`} style={{ backgroundColor: STATUS_STYLES[ratio.status].bg, color: '#1e293b', border: `1px solid ${STATUS_STYLES[ratio.status].border}` }} />
                   <div style={{ fontSize: '11px', color: COLORS.textLight, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Activity size={12} /> Trend: 
                      <span style={{letterSpacing: -1}}>▅▆▇█</span>
                   </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* 5. AI Summary */}
        <Card style={{ background: 'linear-gradient(to bottom right, #FFFFFF, #F0FDFA)', border: `1px solid ${COLORS.tealBorder}` }}>
           <div style={styles.cardHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                 <Lightbulb size={18} color={COLORS.teal} />
                 <h3 style={styles.cardTitle}>AI Financial Summary</h3>
              </div>
           </div>
           <div style={styles.cardContent}>
              <div style={{ backgroundColor: 'white', border: `1px solid ${COLORS.tealBorder}`, borderRadius: '8px', padding: '16px' }}>
                 <p style={{ fontSize: '14px', lineHeight: '1.6', color: COLORS.text }}>
                    "Margins are slightly below target but trending upward across all profitability metrics. Gross Margin strength at 42.5% provides cushion for operational investments. ROA dipped 2pts due to asset expansion, while ROE remains solid at 18.5%, indicating efficient capital structure. Profitability metrics outperform industry benchmarks by 18-22% on average. Growth metrics are exceptional, significantly exceeding both internal targets and industry performance."
                 </p>
                 <div style={{ marginTop: '16px' }}>
                    <h4 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '8px', color: COLORS.slateDark }}>Key Recommendations:</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                       <div style={{ fontSize: '13px', display: 'flex', gap: '8px' }}><Badge text="Opportunity" style={{backgroundColor: '#F0FDF4', color: '#15803d', border: '1px solid #bbf7d0'}} /> <span style={{color: COLORS.text}}>Focus on improving Inventory Turnover and Asset Turnover to enhance working capital efficiency.</span></div>
                       <div style={{ fontSize: '13px', display: 'flex', gap: '8px' }}><Badge text="Watch" style={{backgroundColor: '#FFFBEB', color: '#b45309', border: '1px solid #fde68a'}} /> <span style={{color: COLORS.text}}>Monitor ROA trend as new assets ramp up; expect improvement in next 2-3 quarters.</span></div>
                       <div style={{ fontSize: '13px', display: 'flex', gap: '8px' }}><Badge text="Strength" style={{backgroundColor: '#EFF6FF', color: '#1d4ed8', border: '1px solid #bfdbfe'}} /> <span style={{color: COLORS.text}}>Leverage conservative capital structure (0.45 D/E) for strategic growth initiatives.</span></div>
                    </div>
                 </div>
              </div>
           </div>
        </Card>

      </div>

      {/* Drill-Down Modal */}
      <Modal isOpen={drillDownOpen} onClose={() => setDrillDownOpen(false)} title={`${selectedRatio?.name} - Detailed Analysis`}>
         {selectedRatio && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
               <div style={{ backgroundColor: '#F8FAFC', padding: '16px', borderRadius: '8px', border: `1px solid ${COLORS.border}` }}>
                  <div style={{ fontSize: '13px', color: COLORS.textLight, marginBottom: '8px' }}>Current Performance</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', textAlign: 'center' }}>
                     <div><div style={{fontSize:12, color:COLORS.textLight}}>Actual</div><div style={{fontSize:20, fontWeight: 600, color:COLORS.slateDark}}>{selectedRatio.value}%</div></div>
                     <div><div style={{fontSize:12, color:COLORS.textLight}}>Target</div><div style={{fontSize:20, fontWeight: 600, color:COLORS.slateDark}}>{selectedRatio.target}%</div></div>
                     <div><div style={{fontSize:12, color:COLORS.textLight}}>Industry</div><div style={{fontSize:20, fontWeight: 600, color:COLORS.slateDark}}>{selectedRatio.industry}%</div></div>
                  </div>
               </div>
               
               <div>
                  <div style={{ fontSize: '13px', color: COLORS.textLight, marginBottom: '8px' }}>6-Month Trend</div>
                  <div style={{ height: '200px', width: '100%' }}>
                     <ResponsiveContainer>
                        <LineChart data={selectedRatio.trend.map((v, i) => ({name:['Jul','Aug','Sep','Oct','Nov','Dec'][i], val: v}))}>
                           <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                           <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize:12, fill:COLORS.textLight}} />
                           <YAxis axisLine={false} tickLine={false} tick={{fontSize:12, fill:COLORS.textLight}} domain={['auto', 'auto']} />
                           <RechartsTooltip />
                           <Legend />
                           <Line type="monotone" dataKey="val" name="Actual" stroke={COLORS.teal} strokeWidth={2} />
                        </LineChart>
                     </ResponsiveContainer>
                  </div>
               </div>

               <div style={{ backgroundColor: '#EFF6FF', padding: '16px', borderRadius: '8px', border: '1px solid #BFDBFE' }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '4px', color: '#1E3A8A' }}>Calculation Formula</div>
                  <div style={{ fontSize: '12px', fontFamily: 'monospace', color: '#1E40AF' }}>{selectedRatio.formula}</div>
               </div>

               <div style={{ backgroundColor: '#F0FDFA', borderLeft: `4px solid ${COLORS.teal}`, padding: '16px', borderRadius: '4px' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                     <Lightbulb size={16} color={COLORS.teal} />
                     <div>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: COLORS.slateDark, marginBottom: '2px' }}>AI Insight</div>
                        <div style={{ fontSize: '13px', color: COLORS.text }}>{selectedRatio.insight}</div>
                     </div>
                  </div>
               </div>
            </div>
         )}
      </Modal>

      {/* Scenario Modal */}
      <Modal isOpen={scenarioOpen} onClose={() => setScenarioOpen(false)} title="Scenario Simulation">
         <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <p style={{ fontSize: '13px', color: COLORS.textLight }}>Model the impact of cost changes on profitability ratios</p>
            <div>
               <label style={{ fontSize: '13px', fontWeight: 500, display: 'block', marginBottom: '6px' }}>COGS Reduction (%)</label>
               <input 
                 type="number" 
                 placeholder="5" 
                 value={cogsReduction} 
                 onChange={(e) => setCogsReduction(e.target.value)}
                 style={{ width: '100%', padding: '8px', borderRadius: '6px', border: `1px solid ${COLORS.border}`, outline: 'none', fontFamily: 'Inter, sans-serif' }}
               />
               <div style={{ fontSize: '11px', color: COLORS.textLight, marginTop: '4px' }}>Enter percentage reduction in Cost of Goods Sold</div>
            </div>

            <div style={{ backgroundColor: '#F8FAFC', padding: '16px', borderRadius: '8px', border: `1px solid ${COLORS.border}` }}>
               <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>Current Metrics</div>
               <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}><span>Revenue:</span> <b style={{fontWeight: 500}}>₹11,000L</b></div>
               <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}><span>COGS:</span> <b style={{fontWeight: 500}}>₹6,325L</b></div>
               <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}><span>Gross Margin:</span> <b style={{fontWeight: 500}}>42.5%</b></div>
            </div>

            <Button onClick={() => alert("Scenario Calculated!")} style={{ width: '100%', padding: '10px' }}>Calculate Impact</Button>
         </div>
      </Modal>

    </div>
  );
}