import React, { useState } from 'react';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, ComposedChart, Cell,
  ReferenceLine
} from 'recharts';
import {
  DollarSign, Activity, RefreshCw, Download, FileText,
  Sheet as SheetIcon, TrendingUp, TrendingDown, Percent, Info,
  ChevronDown, ArrowUpRight
} from 'lucide-react';

// --- MOCK DATA ---

const plWaterfallData = [
  { name: 'Revenue', value: 110, type: 'income', color: '#10b981', margin: 100 }, // Emerald
  { name: 'COGS', value: -35, type: 'expense', color: '#ef4444', margin: 68.2 }, // Red
  { name: 'Gross Margin', value: 75, type: 'margin', color: '#3b82f6', margin: 68.2 }, // Blue
  { name: 'Op. Exp', value: -25, type: 'expense', color: '#f97316', margin: 45.5 }, // Orange
  { name: 'EBITDA', value: 50, type: 'ebitda', color: '#8b5cf6', margin: 45.5 }, // Purple
  { name: 'D&A', value: -5, type: 'expense', color: '#ef4444', margin: 40.9 },
  { name: 'Interest', value: -3, type: 'expense', color: '#ef4444', margin: 38.2 },
  { name: 'Tax', value: -12, type: 'expense', color: '#ef4444', margin: 27.3 },
  { name: 'Net Profit', value: 30, type: 'profit', color: '#06b6d4', margin: 27.3 }, // Cyan
];

const trendData = [
  { month: 'Jul', revenue: 98, grossMargin: 66, ebitda: 42, netProfit: 24 },
  { month: 'Aug', revenue: 102, grossMargin: 67, ebitda: 43, netProfit: 25 },
  { month: 'Sep', revenue: 105, grossMargin: 68, ebitda: 44, netProfit: 26 },
  { month: 'Oct', revenue: 107, grossMargin: 68, ebitda: 45, netProfit: 27 },
  { month: 'Nov', revenue: 108, grossMargin: 67, ebitda: 44, netProfit: 26 },
  { month: 'Dec', revenue: 110, grossMargin: 68, ebitda: 45, netProfit: 27 },
];

const revenueMixData = [
  { category: 'Product', value: 71, percentage: 65, color: '#06b6d4' },
  { category: 'Service', value: 32, percentage: 29, color: '#f97316' },
  { category: 'Maintenance', value: 7, percentage: 6, color: '#64748b' },
];

const plTableData = [
  { account: 'Revenue', current: 110.0, budget: 105.0, ytd: 642.0 },
  { account: 'COGS', current: -35.0, budget: -33.6, ytd: -204.0 },
  { account: 'Gross Profit', current: 75.0, budget: 71.4, ytd: 438.0 },
  { account: 'Operating Expenses', current: -25.0, budget: -26.3, ytd: -155.0 },
  { account: 'EBITDA', current: 50.0, budget: 45.1, ytd: 283.0 },
  { account: 'Depr. & Amortization', current: -5.0, budget: -5.3, ytd: -30.0 },
  { account: 'Interest Expense', current: -3.0, budget: -3.2, ytd: -18.5 },
  { account: 'Tax', current: -12.0, budget: -10.5, ytd: -67.0 },
  { account: 'Net Profit', current: 30.0, budget: 26.1, ytd: 167.5 },
];

const months = [
  { id: 'jun', label: 'Jun' }, { id: 'jul', label: 'Jul' }, { id: 'aug', label: 'Aug' },
  { id: 'sep', label: 'Sep' }, { id: 'oct', label: 'Oct' }, { id: 'nov', label: 'Nov' },
  { id: 'dec', label: 'Dec' }
];

// --- STYLES OBJECTS (Inline CSS) ---

const theme = {
  bg: '#f8fafc', // Very light gray/blueish background
  cardBg: '#ffffff',
  textMain: '#1e293b', // Slate 800
  textLight: '#64748b', // Slate 500
  border: '#e2e8f0', // Slate 200
  primary: '#2563eb', // Blue 600
  success: '#10b981', // Emerald 500
  danger: '#ef4444', // Red 500
  warning: '#f59e0b', // Amber 500
  purple: '#8b5cf6',
  cyan: '#06b6d4',
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    fontFamily: 'Inter, sans-serif',
    backgroundColor: theme.bg,
    minHeight: '100vh',
    padding: '24px',
    color: theme.textMain,
  },
  headerCard: {
    background: 'linear-gradient(to right, #eff6ff, #f0fdfa)', // Light blue to light teal
    border: `1px solid ${theme.border}`,
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)',
  },
  headerTitle: {
    fontSize: '20px',
    fontWeight: 500, // Poppins Medium
    fontFamily: 'Poppins, sans-serif',
    color: theme.textMain,
    marginBottom: '4px',
    lineHeight: 1.5,
  },
  headerSubtitle: {
    fontSize: '13px',
    color: theme.textLight,
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontFamily: 'Inter, sans-serif',
    fontWeight: 400
  },
  monthSelector: {
    backgroundColor: theme.cardBg,
    border: `1px solid ${theme.border}`,
    borderRadius: '8px',
    padding: '8px',
    marginBottom: '24px',
    display: 'flex',
    gap: '8px',
    overflowX: 'auto',
  },
  monthBtn: {
    padding: '6px 16px',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: 500,
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontFamily: 'Inter, sans-serif',
  },
  grid4: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    marginBottom: '24px',
  },
  grid2: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
    gap: '24px',
    marginBottom: '24px',
  },
  card: {
    backgroundColor: theme.cardBg,
    borderRadius: '16px',
    border: `1px solid ${theme.border}`,
    padding: '24px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
    display: 'flex',
    flexDirection: 'column',
  },
  cardTitleRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '16px',
  },
  cardTitle: {
    fontSize: '15px',
    fontWeight: 500, // Poppins Medium
    fontFamily: 'Poppins, sans-serif',
    color: theme.textMain,
    lineHeight: 1.5
  },
  kpiValue: {
    fontSize: '28px',
    fontWeight: 600,
    color: theme.textMain,
    marginBottom: '8px',
    fontFamily: 'Inter, sans-serif',
  },
  kpiTrendRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '12px',
    fontFamily: 'Inter, sans-serif',
    fontWeight: 400
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '4px 8px',
    borderRadius: '20px',
    fontWeight: 500,
    fontSize: '11px',
    fontFamily: 'Inter, sans-serif',
  },
  toggleContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '12px',
    color: theme.textLight,
    fontFamily: 'Inter, sans-serif',
    fontWeight: 400
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '13px',
    fontFamily: 'Inter, sans-serif',
  },
  th: {
    textAlign: 'left',
    padding: '12px 16px',
    borderBottom: `2px solid ${theme.border}`,
    color: theme.textLight,
    fontWeight: 500, // Poppins Medium
    fontFamily: 'Poppins, sans-serif',
    backgroundColor: '#f8fafc',
    position: 'sticky',
    top: 0,
  },
  td: {
    padding: '12px 16px',
    borderBottom: `1px solid ${theme.border}`,
    color: theme.textMain,
  },
  btn: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '8px 16px',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: 500,
    cursor: 'pointer',
    border: `1px solid ${theme.border}`,
    backgroundColor: theme.cardBg,
    color: theme.textMain,
    fontFamily: 'Inter, sans-serif',
  },
  progressBar: {
    height: '8px',
    borderRadius: '4px',
    backgroundColor: '#f1f5f9',
    overflow: 'hidden',
    marginTop: '6px',
  },
};

// --- HELPER COMPONENTS ---

const MonthButton = ({ label, active, onClick }: { label: string, active: boolean, onClick: () => void }) => (
  <button
    onClick={onClick}
    style={{
      ...styles.monthBtn,
      backgroundColor: active ? theme.primary : 'transparent',
      color: active ? '#fff' : theme.textLight,
    }}
  >
    {label}
  </button>
);

const KPICard = ({ title, value, budget, variance, suffix = '', icon: Icon, color }: any) => {
  const isPositive = variance > 0;
  return (
    <div style={{ ...styles.card, borderTop: `4px solid ${color}` }}>
      <div style={styles.cardTitleRow}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={styles.cardTitle}>{title}</span>
          <Info size={14} color="#94a3b8" style={{ cursor: 'help' }} />
        </div>
        <div style={{
          padding: '8px', borderRadius: '8px',
          backgroundColor: `${color}15`, color: color
        }}>
          <Icon size={18} />
        </div>
      </div>
      <div style={styles.kpiValue}>{value}{suffix}</div>
      <div style={styles.kpiTrendRow}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{
            ...styles.badge,
            backgroundColor: isPositive ? '#dcfce7' : '#fee2e2',
            color: isPositive ? '#166534' : '#991b1b',
          }}>
            {isPositive ? '+' : ''}{variance}%
          </span>
          <span style={{ color: theme.textLight }}>vs Budget</span>
        </div>
        <span style={{ color: theme.textLight }}>Bud: {budget}</span>
      </div>
    </div>
  );
};

// --- MAIN COMPONENT ---

export default function FinancialOverviewDashboard() {
  const [selectedMonth, setSelectedMonth] = useState('dec');
  const [viewMode, setViewMode] = useState<'amount' | 'percent'>('amount');
  const [mixView, setMixView] = useState<'Category' | 'Segment'>('Category');

  return (
    <div style={styles.container}>
        <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Poppins:wght@400;500;600&display=swap');
        `}
      </style>
      {/* 1. Header Section */}
      <div style={styles.headerCard}>
        <div>
          <h1 style={styles.headerTitle}>P&L Analysis</h1>
          <div style={styles.headerSubtitle}>
            <span style={{ fontWeight: 600 }}>Entity:</span> Pranam Creative Solutions Pvt Ltd
            <span style={{ width: 1, height: 12, backgroundColor: '#cbd5e1' }} />
            <span style={{ fontWeight: 600 }}>FY:</span> 2024-25
            <span style={{ width: 1, height: 12, backgroundColor: '#cbd5e1' }} />
            <span>Currency: INR</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: theme.textLight, marginRight: '12px', fontFamily: 'Inter, sans-serif' }}>
            Last updated: Today 09:41 AM
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
              <RefreshCw size={14} />
            </button>
          </div>
          <button style={styles.btn}>
            <Download size={14} />
            Export Report
            <ChevronDown size={14} />
          </button>
        </div>
      </div>

      {/* 2. Month Selector */}
      <div style={styles.monthSelector}>
        <span style={{ fontSize: '13px', fontWeight: 500, color: theme.textMain, padding: '6px 8px', display: 'flex', alignItems: 'center', fontFamily: 'Inter, sans-serif' }}>Period:</span>
        {months.map(m => (
          <MonthButton
            key={m.id}
            label={m.label}
            active={selectedMonth === m.id}
            onClick={() => setSelectedMonth(m.id)}
          />
        ))}
      </div>

      {/* 3. KPI Cards */}
      <div style={styles.grid4}>
        <KPICard title="Revenue" value="₹110.0L" budget="₹105.0L" variance={4.8} icon={DollarSign} color={theme.success} />
        <KPICard title="Gross Margin" value="68.2" suffix="%" budget="68.0%" variance={0.2} icon={Percent} color={theme.primary} />
        <KPICard title="EBITDA" value="₹50.0L" budget="₹45.1L" variance={10.9} icon={TrendingUp} color={theme.purple} />
        <KPICard title="Net Profit" value="₹30.0L" budget="₹26.1L" variance={14.9} icon={Activity} color={theme.cyan} />
      </div>

      {/* 4. Charts Row 1: Waterfall & Trend */}
      <div style={styles.grid2}>
        
        {/* Waterfall Chart */}
        <div style={styles.card}>
          <div style={styles.cardTitleRow}>
            <div>
              <div style={styles.cardTitle}>P&L Waterfall Analysis</div>
              <div style={{ fontSize: '12px', color: theme.textLight, fontFamily: 'Inter, sans-serif', fontWeight: 400 }}>December 2024 Breakdown</div>
            </div>
            <div style={styles.toggleContainer}>
              <span>View:</span>
              <button 
                onClick={() => setViewMode(viewMode === 'amount' ? 'percent' : 'amount')}
                style={{
                  border: `1px solid ${theme.border}`, borderRadius: '12px', background: theme.bg,
                  padding: '2px 8px', cursor: 'pointer', fontSize: '11px', fontWeight: 600, fontFamily: 'Inter, sans-serif'
                }}
              >
                {viewMode === 'amount' ? '₹ Amount' : '% Perc'}
              </button>
            </div>
          </div>
          <div style={{ height: '320px', width: '100%' }}>
            <ResponsiveContainer>
              <BarChart data={plWaterfallData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: theme.textLight, fontFamily: 'Inter, sans-serif' }} interval={0} angle={-20} textAnchor="end" height={60} />
                <YAxis tick={{ fontSize: 11, fill: theme.textLight, fontFamily: 'Inter, sans-serif' }} />
                <Tooltip 
                  cursor={{ fill: 'transparent' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <div style={{ background: '#fff', border: '1px solid #e2e8f0', padding: '8px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', fontFamily: 'Inter, sans-serif' }}>
                          <div style={{ fontWeight: 600, fontSize: '13px' }}>{d.name}</div>
                          <div style={{ fontSize: '12px' }}>₹{d.value}L</div>
                          <div style={{ fontSize: '11px', color: theme.textLight }}>Margin: {d.margin}%</div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <ReferenceLine y={0} stroke="#94a3b8" />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {plWaterfallData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Trend Chart */}
        <div style={styles.card}>
          <div style={styles.cardTitleRow}>
            <div>
              <div style={styles.cardTitle}>Six Month Trend</div>
              <div style={{ fontSize: '12px', color: theme.textLight, fontFamily: 'Inter, sans-serif', fontWeight: 400 }}>Revenue & Profitability</div>
            </div>
          </div>
          <div style={{ height: '320px', width: '100%' }}>
            <ResponsiveContainer>
              <ComposedChart data={trendData} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: theme.textLight, fontFamily: 'Inter, sans-serif' }} />
                <YAxis yAxisId="left" tick={{ fontSize: 12, fill: theme.textLight, fontFamily: 'Inter, sans-serif' }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12, fill: theme.textLight, fontFamily: 'Inter, sans-serif' }} tickFormatter={(v) => `${v}%`} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontFamily: 'Inter, sans-serif' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px', fontFamily: 'Inter, sans-serif' }} />
                <Bar yAxisId="left" dataKey="revenue" name="Revenue" barSize={30} fill={theme.primary} radius={[4, 4, 0, 0]} fillOpacity={0.8} />
                <Line yAxisId="right" type="monotone" dataKey="grossMargin" name="GM %" stroke={theme.success} strokeWidth={2} dot={{ r: 3 }} />
                <Line yAxisId="right" type="monotone" dataKey="ebitda" name="EBITDA %" stroke={theme.purple} strokeWidth={2} dot={{ r: 3 }} />
                <Line yAxisId="right" type="monotone" dataKey="netProfit" name="Net %" stroke={theme.cyan} strokeWidth={2} dot={{ r: 3 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 5. Charts Row 2: Mix & Table */}
      <div style={styles.grid2}>
        
        {/* Revenue Mix & Key Ratios Split */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Mix Chart */}
          <div style={styles.card}>
            <div style={styles.cardTitleRow}>
              <div style={styles.cardTitle}>Revenue Mix</div>
              <div style={{ display: 'flex', gap: '4px' }}>
                {['Category', 'Segment'].map(t => (
                  <button
                    key={t}
                    onClick={() => setMixView(t as any)}
                    style={{
                      padding: '4px 12px', fontSize: '11px', borderRadius: '6px',
                      border: `1px solid ${mixView === t ? theme.primary : theme.border}`,
                      backgroundColor: mixView === t ? theme.primary : 'transparent',
                      color: mixView === t ? '#fff' : theme.textLight,
                      cursor: 'pointer',
                      fontFamily: 'Inter, sans-serif',
                      fontWeight: 500
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ height: '200px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueMixData} layout="vertical" margin={{ left: 0, right: 30 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" />
                  <XAxis type="number" hide />
                  <YAxis dataKey="category" type="category" width={90} tick={{ fontSize: 12, fill: theme.textMain, fontWeight: 500, fontFamily: 'Inter, sans-serif' }} />
                  <Tooltip cursor={{ fill: 'transparent' }} />
                  <Bar dataKey="value" barSize={24} radius={[0, 4, 4, 0]}>
                    {revenueMixData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            {/* Custom Legend/List for Mix */}
            <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {revenueMixData.map((item) => (
                <div key={item.category} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', fontFamily: 'Inter, sans-serif' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: item.color }}></div>
                      <span style={{ color: theme.textLight }}>{item.category}</span>
                   </div>
                   <div style={{ fontWeight: 600 }}>₹{item.value}L <span style={{ color: theme.textLight, fontWeight: 400 }}>({item.percentage}%)</span></div>
                </div>
              ))}
            </div>
          </div>

          {/* Key Ratios List */}
          <div style={styles.card}>
            <div style={styles.cardTitleRow}>
               <div style={styles.cardTitle}>Key Financial Ratios</div>
               <span style={{ fontSize: '11px', color: theme.textLight, fontFamily: 'Inter, sans-serif' }}>Dec 2024</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
               {[
                 { label: 'Gross Margin %', value: '68.2%', badge: '+5.0%', color: 'green' },
                 { label: 'EBITDA Margin %', value: '45.5%', badge: '+10.9%', color: 'green' },
                 { label: 'Net Profit Margin %', value: '27.3%', badge: '+14.9%', color: 'green' },
                 { label: 'Operating Efficiency', value: '22.7%', badge: 'Improved', color: 'blue' }
               ].map((ratio, i) => (
                 <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', fontFamily: 'Inter, sans-serif' }}>
                    <span style={{ color: theme.textMain, fontWeight: 500 }}>{ratio.label}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontWeight: 600 }}>{ratio.value}</span>
                      <span style={{ 
                        fontSize: '11px', padding: '2px 6px', borderRadius: '4px',
                        backgroundColor: ratio.color === 'green' ? '#dcfce7' : '#dbeafe',
                        color: ratio.color === 'green' ? '#15803d' : '#1d4ed8',
                        fontWeight: 600
                      }}>{ratio.badge}</span>
                    </div>
                 </div>
               ))}
            </div>
          </div>

        </div>

        {/* Detailed Table */}
        <div style={styles.card}>
          <div style={styles.cardTitleRow}>
            <div style={styles.cardTitle}>P&L Summary Table</div>
            <button style={{ ...styles.btn, padding: '4px 8px', fontSize: '11px' }}>
              <FileText size={12} /> Export
            </button>
          </div>
          <div style={{ overflowX: 'auto', flex: 1 }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Account</th>
                  <th style={{ ...styles.th, textAlign: 'right' }}>Current</th>
                  <th style={{ ...styles.th, textAlign: 'right' }}>Budget</th>
                  <th style={{ ...styles.th, textAlign: 'center' }}>Var %</th>
                  <th style={{ ...styles.th, textAlign: 'right' }}>YTD</th>
                </tr>
              </thead>
              <tbody>
                {plTableData.map((row, index) => {
                  const isTotal = row.account === 'Gross Profit' || row.account === 'EBITDA' || row.account === 'Net Profit';
                  const variance = ((row.current - row.budget) / Math.abs(row.budget)) * 100;
                  const isPositive = row.current < 0 ? variance < 0 : variance > 0; // Logic for expense vs income
                  
                  return (
                    <tr key={index} style={{ 
                      backgroundColor: isTotal ? '#f1f5f9' : 'transparent', 
                      fontWeight: isTotal ? 600 : 400 
                    }}>
                      <td style={styles.td}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          {row.account}
                          {isTotal && <Info size={12} color={theme.textLight} />}
                        </div>
                      </td>
                      <td style={{ ...styles.td, textAlign: 'right' }}>
                        {row.current < 0 ? `(${Math.abs(row.current)})` : row.current}
                      </td>
                      <td style={{ ...styles.td, textAlign: 'right', color: theme.textLight }}>
                        {row.budget < 0 ? `(${Math.abs(row.budget)})` : row.budget}
                      </td>
                      <td style={{ ...styles.td, textAlign: 'center' }}>
                        <span style={{
                          padding: '2px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 600,
                          backgroundColor: isPositive ? '#dcfce7' : '#fee2e2',
                          color: isPositive ? '#166534' : '#991b1b',
                          fontFamily: 'Inter, sans-serif'
                        }}>
                           {variance > 0 ? '+' : ''}{variance.toFixed(1)}%
                        </span>
                      </td>
                      <td style={{ ...styles.td, textAlign: 'right', fontWeight: 600 }}>
                        {row.ytd}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}