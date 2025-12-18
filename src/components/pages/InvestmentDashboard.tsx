import React, { useState, useEffect } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
  Legend, ResponsiveContainer, PieChart, Pie, Cell, ScatterChart, Scatter,
  ReferenceLine, ZAxis
} from 'recharts';
import {
  Wallet, Target, Clock, Activity, Calendar, AlertTriangle, Building2,
  IndianRupee, Database, Plus, Download, ChevronDown, Play, Pause, Users,
  ArrowUpRight, Lightbulb, CheckSquare, Square, Zap, Filter, CheckCircle
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

const CATEGORY_STYLES: any = {
  Tech: { bg: '#F0FDFA', color: '#0F766E', border: '#CCFBF1' },
  Infra: { bg: '#F3E8FF', color: '#7C3AED', border: '#E9D5FF' },
  'R&D': { bg: '#FEF2F2', color: '#DC2626', border: '#FECACA' },
};

const STATUS_STYLES: any = {
  Active: { bg: '#DBEAFE', color: '#1E40AF', border: '#93C5FD', fill: '#2563EB' },
  Completed: { bg: '#DCFCE7', color: '#166534', border: '#86EFAC', fill: '#16A34A' },
  Planning: { bg: '#FFEDD5', color: '#9A3412', border: '#FDBA74', fill: '#D97706' },
};

// --- Mock Data ---

const projectData = [
  { id: 1, name: 'Phoenix ERP', capex: 45, roi: 24.5, npv: 18.2, irr: 26.8, payback: 28, status: 'Active', category: 'Tech', progress: 75, bookValue: 38.5, depRate: 20, usefulLife: 5, annualDep: 9.0 },
  { id: 2, name: 'Automation Suite', capex: 32, roi: 31.2, npv: 15.8, irr: 32.5, payback: 24, status: 'Active', category: 'Tech', progress: 60, bookValue: 28.8, depRate: 20, usefulLife: 5, annualDep: 6.4 },
  { id: 3, name: 'Mumbai Office', capex: 55, roi: 8.2, npv: 6.5, irr: 9.1, payback: 52, status: 'Completed', category: 'Infra', progress: 100, bookValue: 52.3, depRate: 5, usefulLife: 20, annualDep: 2.75 },
  { id: 4, name: 'R&D Lab Setup', capex: 28, roi: 18.5, npv: 10.2, irr: 20.3, payback: 36, status: 'Active', category: 'R&D', progress: 45, bookValue: 26.6, depRate: 10, usefulLife: 10, annualDep: 2.8 },
  { id: 5, name: 'Cloud Infrastructure', capex: 18, roi: 22.8, npv: 8.5, irr: 24.2, payback: 30, status: 'Planning', category: 'Tech', progress: 15, bookValue: 18.0, depRate: 25, usefulLife: 4, annualDep: 4.5 },
  { id: 6, name: 'Warehouse Expansion', capex: 40, roi: 12.5, npv: 7.8, irr: 13.8, payback: 42, status: 'Planning', category: 'Infra', progress: 10, bookValue: 40.0, depRate: 10, usefulLife: 10, annualDep: 4.0 },
];

const cashFlowData = [
  { year: 'Y0', automationSuite: -32, phoenixERP: -45, rdLab: -28, cumulative: 0 },
  { year: 'Y1', automationSuite: 8, phoenixERP: 10, rdLab: 4, cumulative: -83 },
  { year: 'Y2', automationSuite: 12, phoenixERP: 15, rdLab: 8, cumulative: -48 },
  { year: 'Y3', automationSuite: 18, phoenixERP: 22, rdLab: 12, cumulative: 4 },
  { year: 'Y4', automationSuite: 22, phoenixERP: 28, rdLab: 16, cumulative: 70 },
  { year: 'Y5', automationSuite: 24, phoenixERP: 32, rdLab: 18, cumulative: 144 },
];

const milestones = [
  { id: 1, project: 'Phoenix ERP', milestone: 'Module 3 Deployment', dueDate: '15 Jan 2025', status: 'On Track', delay: null },
  { id: 2, project: 'Automation Suite', milestone: 'Testing Phase Complete', dueDate: '20 Jan 2025', status: 'On Track', delay: null },
  { id: 3, project: 'R&D Lab Setup', milestone: 'Site Finalization', dueDate: '10 Jan 2025', status: 'Delayed', delay: 'Civil vendor pending' },
  { id: 4, project: 'Cloud Infrastructure', milestone: 'Vendor Selection', dueDate: '05 Feb 2025', status: 'On Track', delay: null },
  { id: 5, project: 'Warehouse Expansion', milestone: 'Budget Approval', dueDate: '28 Jan 2025', status: 'At Risk', delay: 'Board review pending' },
];

const aiRecommendationsData = [
  { id: 1, type: 'Performance', text: 'Tech category projects showing 25% higher ROI than Infra. Consider reallocating 10% of planned Infra budget to Tech initiatives.', actioned: false },
  { id: 2, type: 'Risk', text: 'Mumbai Office underperforming (8.2% vs 15% target). Review pricing model or consider asset disposition.', actioned: false },
  { id: 3, type: 'Timing', text: 'R&D Lab Setup delay may impact FY26 revenue targets. Expedite site finalization to avoid 3-month ROI deferment.', actioned: true },
  { id: 4, type: 'Efficiency', text: 'Average payback for active projects is 32 months. Target portfolio optimization to reduce to <30 months through quick-win projects.', actioned: false },
  { id: 5, type: 'Opportunity', text: 'Cloud Infrastructure in planning phase shows strong IRR (24.2%). Fast-track to execution to capture early returns.', actioned: false },
];

// --- Reusable UI Components ---

const Card = ({ children, style = {} }: any) => (
  <div style={{
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

// --- Main Component ---

export default function InvestmentDashboard() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [showCumulative, setShowCumulative] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recommendations, setRecommendations] = useState(aiRecommendationsData);
  const [selectedProject, setSelectedProject] = useState<number | null>(null);

  // Filter Logic
  const filteredProjects = projectData.filter(p => {
    if (selectedCategory !== 'All' && p.category !== selectedCategory) return false;
    if (selectedStatus !== 'All' && p.status !== selectedStatus) return false;
    return true;
  });

  // KPI Calculations
  const totalCapex = filteredProjects.reduce((sum, p) => sum + p.capex, 0);
  const totalBookValue = filteredProjects.reduce((sum, p) => sum + p.bookValue, 0);
  const avgROI = filteredProjects.reduce((sum, p) => sum + p.roi, 0) / (filteredProjects.length || 1);
  const paybackValues = filteredProjects.map(p => p.payback).sort((a, b) => a - b);
  const medianPayback = paybackValues[Math.floor(paybackValues.length / 2)] || 0;
  const bestPayback = Math.min(...paybackValues);
  const worstPayback = Math.max(...paybackValues);

  // --- Speech Logic ---
  const aiInsightText = "Portfolio ROI stands at 19.6% exceeding the 15% target, primarily driven by Technology projects. Automation Suite leads performance at 31.2% ROI with a 24-month payback period. Infrastructure investments show mixed results - Mumbai Office underperforms at 8.2% ROI, impacting overall portfolio NPV by ₹4.5L.";

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
      window.speechSynthesis.cancel(); // Cancel any current speech
      const utterance = new SpeechSynthesisUtterance(aiInsightText);
      
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

  const toggleRecommendation = (id: number) => {
    setRecommendations(prev =>
      prev.map(rec => (rec.id === id ? { ...rec, actioned: !rec.actioned } : rec))
    );
  };

  // --- Styles ---
  const styles = {
    container: {
      fontFamily: 'Inter, sans-serif',
      backgroundColor: '#F8FAFC',
      minHeight: '100vh',
      padding: '24px',
      color: COLORS.slateDark,
    },
    wrapper: {
      maxWidth: '1600px',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '24px',
    },
    ribbon: {
      background: 'linear-gradient(to right, #F0FDFA, #F8FAFC)',
      border: `1px solid ${COLORS.tealBorder}`,
      borderRadius: '8px',
      padding: '12px 20px',
      display: 'flex',
      flexWrap: 'wrap' as const,
      alignItems: 'center',
      gap: '16px',
      fontSize: '13px',
    },
    ribbonItem: { display: 'flex', alignItems: 'center', gap: '6px', color: COLORS.text },
    divider: { height: '16px', width: '1px', backgroundColor: '#CBD5E1' },
    grid4: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' },
    cardHeader: { padding: '20px 24px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    cardTitle: { fontSize: '15px', fontWeight: 500, color: COLORS.slateDark, margin: 0, fontFamily: 'Poppins, sans-serif', lineHeight: 1.5 },
    cardContent: { padding: '0 24px 24px', flex: 1 },
    kpiValue: { fontSize: '24px', fontWeight: 600, color: COLORS.slateDark, marginTop: '4px' },
    progressBarBg: { height: '4px', width: '100%', backgroundColor: '#E2E8F0', borderRadius: '999px', marginTop: '12px' },
    table: { width: '100%', borderCollapse: 'collapse' as const, fontSize: '13px' },
    th: { textAlign: 'left' as const, padding: '12px 16px', color: COLORS.textLight, borderBottom: `1px solid ${COLORS.border}`, backgroundColor: '#F8FAFC', fontWeight: 500, fontFamily: 'Poppins, sans-serif' },
    td: { padding: '12px 16px', borderBottom: `1px solid ${COLORS.border}`, color: COLORS.text },
    // Matrix Quadrants
    quadrantGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '12px',
      marginTop: '20px'
    },
    quadrantBox: (bg: string, border: string) => ({
      backgroundColor: bg,
      border: `1px solid ${border}`,
      borderRadius: '8px',
      padding: '12px',
    })
  };

  return (
    <div style={styles.container}>
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Poppins:wght@400;500;600&display=swap');`}
      </style>
      <div style={styles.wrapper}>

        {/* 1. Context Ribbon */}
        <div style={styles.ribbon}>
          <div style={styles.ribbonItem}>
            <Building2 size={14} color={COLORS.teal} />
            <span style={{ color: COLORS.textLight }}>Entity:</span> <b style={{fontWeight: 500}}>CFOsync AI Pvt Ltd</b>
          </div>
          <div style={styles.divider} />
          <div style={styles.ribbonItem}>
            <Calendar size={14} color={COLORS.teal} />
            <span>FY 2024–25</span>
          </div>
          <div style={styles.divider} />
          <div style={styles.ribbonItem}>
            <IndianRupee size={14} color={COLORS.teal} />
            <span style={{ color: COLORS.textLight }}>Currency:</span> <b style={{fontWeight: 500}}>INR</b>
          </div>
          <div style={styles.divider} />
          <div style={styles.ribbonItem}>
            <Database size={14} color={COLORS.teal} />
            <span style={{ color: COLORS.textLight }}>Data as of:</span> <b style={{fontWeight: 500}}>Dec 2024</b>
          </div>
        </div>

        {/* 2. AI Narration Card */}
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
                    <h3 style={{ fontSize: '16px', fontWeight: 500, margin: 0, fontFamily: 'Poppins, sans-serif' }}>AI Investment Portfolio Insights</h3>
                    <p style={{ fontSize: '13px', color: COLORS.textLight, margin: '4px 0 0' }}>Automated analysis of capital allocation and project performance</p>
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

        {/* 3. Filter Bar */}
        <Card>
          <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: COLORS.text }}>
                <Filter size={16} color={COLORS.teal} /> Filters:
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <label style={{ fontSize: '13px', color: COLORS.textLight }}>Category:</label>
                <Select value={selectedCategory} onChange={setSelectedCategory} options={['All', 'Tech', 'Infra', 'R&D']} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <label style={{ fontSize: '13px', color: COLORS.textLight }}>Status:</label>
                <Select value={selectedStatus} onChange={setSelectedStatus} options={['All', 'Active', 'Completed', 'Planning']} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <label style={{ fontSize: '13px', color: COLORS.textLight }}>Year:</label>
                <Select value="FY 2024-25" onChange={() => { }} options={['FY 2024-25', 'FY 2023-24']} />
              </div>
              <div style={{ marginLeft: 'auto', display: 'flex', gap: '12px' }}>
                <Button variant="default"><Plus size={14} /> New Project</Button>
                <Button variant="outline"><Download size={14} /> Export Portfolio</Button>
              </div>
            </div>
          </div>
        </Card>

        {/* 4. KPI Cards */}
        <div style={styles.grid4}>
          <Card>
            <div style={styles.cardHeader}>
              <span style={{ fontSize: '13px', fontWeight: 500, color: COLORS.textLight }}>Total CapEx</span>
              <Wallet size={18} color={COLORS.teal} />
            </div>
            <div style={styles.cardContent}>
              <div style={styles.kpiValue}>₹{totalCapex}L</div>
              <Badge
                text={<><ArrowUpRight size={12} /> 12.4% YoY</>}
                style={{ backgroundColor: COLORS.greenBg, color: '#15803d', border: '1px solid #bbf7d0', marginTop: '8px' }}
              />
              <div style={styles.progressBarBg}><div style={{ width: '100%', height: '100%', backgroundColor: COLORS.teal, borderRadius: '999px' }} /></div>
            </div>
          </Card>

          <Card>
            <div style={styles.cardHeader}>
              <span style={{ fontSize: '13px', fontWeight: 500, color: COLORS.textLight }}>Book Value</span>
              <Activity size={18} color={COLORS.teal} />
            </div>
            <div style={styles.cardContent}>
              <div style={styles.kpiValue}>₹{totalBookValue.toFixed(1)}L</div>
              <div style={{ fontSize: '12px', color: COLORS.textLight, marginTop: '4px' }}>Post-depreciation WDV</div>
              <div style={styles.progressBarBg}>
                <div style={{ width: `${(totalBookValue / totalCapex) * 100}%`, height: '100%', backgroundColor: COLORS.blue, borderRadius: '999px' }} />
              </div>
            </div>
          </Card>

          <Card style={{ border: `2px solid ${avgROI >= 15 ? '#86EFAC' : '#FCA5A5'}`, backgroundColor: avgROI >= 15 ? '#F0FDF4' : '#FEF2F2' }}>
            <div style={styles.cardHeader}>
              <span style={{ fontSize: '13px', fontWeight: 500, color: COLORS.textLight }}>Average ROI</span>
              <Target size={18} color={COLORS.teal} />
            </div>
            <div style={styles.cardContent}>
              <div style={{ ...styles.kpiValue, color: avgROI >= 15 ? '#14532d' : '#7f1d1d' }}>{avgROI.toFixed(1)}%</div>
              <div style={{ fontSize: '12px', color: COLORS.textLight, marginTop: '4px' }}>Target: 15%</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px', marginTop: '8px' }}>
                <span style={{ color: COLORS.textLight }}>0%</span>
                <span style={{ color: avgROI >= 15 ? '#16a34a' : '#dc2626', fontWeight: 'bold' }}>+{ (avgROI - 15).toFixed(1) }%</span>
                <span style={{ color: COLORS.textLight }}>40%</span>
              </div>
              <div style={styles.progressBarBg}>
                <div style={{ width: `${Math.min((avgROI / 40) * 100, 100)}%`, height: '100%', backgroundColor: avgROI >= 15 ? '#16a34a' : '#dc2626', borderRadius: '999px' }} />
              </div>
            </div>
          </Card>

          <Card style={{ border: `2px solid ${medianPayback <= 36 ? '#86EFAC' : '#FCA5A5'}`, backgroundColor: medianPayback <= 36 ? '#F0FDF4' : '#FEF2F2' }}>
            <div style={styles.cardHeader}>
              <span style={{ fontSize: '13px', fontWeight: 500, color: COLORS.textLight }}>Median Payback</span>
              <Clock size={18} color={COLORS.teal} />
            </div>
            <div style={styles.cardContent}>
              <div style={{ ...styles.kpiValue, color: medianPayback <= 36 ? '#14532d' : '#7f1d1d' }}>{medianPayback} mo</div>
              <div style={{ fontSize: '12px', color: COLORS.textLight, marginTop: '4px' }}>Best: {bestPayback}m / Worst: {worstPayback}m</div>
              <div style={styles.progressBarBg}>
                <div style={{ width: `${Math.min((medianPayback / 60) * 100, 100)}%`, height: '100%', backgroundColor: medianPayback <= 36 ? '#16a34a' : '#dc2626', borderRadius: '999px' }} />
              </div>
            </div>
          </Card>
        </div>

        {/* 5. Matrix Chart (Fixed Bubbles & Colors) */}
        <Card>
          <div style={styles.cardHeader}>
            <div>
              <h3 style={styles.cardTitle}>Project Portfolio Matrix (CapEx vs ROI)</h3>
              <p style={{ fontSize: '13px', color: COLORS.textLight, margin: '4px 0 0' }}>Bubble size represents Net Present Value (NPV)</p>
            </div>
          </div>
          <div style={styles.cardContent}>
            <ResponsiveContainer width="100%" height={400}>
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" dataKey="capex" name="CapEx" unit="L" tick={{ fontSize: 12, fontFamily: 'Inter, sans-serif' }} />
                <YAxis type="number" dataKey="roi" name="ROI" unit="%" tick={{ fontSize: 12, fontFamily: 'Inter, sans-serif' }} />
                <ZAxis type="number" dataKey="npv" range={[100, 2000]} name="NPV" />
                <RechartsTooltip 
                  cursor={{ strokeDasharray: '3 3' }}
                  content={({ active, payload }: any) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div style={{ backgroundColor: 'white', border: '1px solid #E2E8F0', padding: '10px', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                          <p style={{ fontWeight: 600, marginBottom: '5px', fontFamily: 'Inter, sans-serif' }}>{data.name}</p>
                          <p style={{ fontSize: '12px', color: '#64748B' }}>CapEx: ₹{data.capex}L</p>
                          <p style={{ fontSize: '12px', color: '#64748B' }}>ROI: {data.roi}%</p>
                          <p style={{ fontSize: '12px', color: '#64748B' }}>NPV: ₹{data.npv}L</p>
                          <p style={{ fontSize: '12px', color: '#64748B' }}>Status: {data.status}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <ReferenceLine x={30} stroke="#94a3b8" strokeDasharray="5 5" />
                <ReferenceLine y={15} stroke="#94a3b8" strokeDasharray="5 5" />
                <Scatter data={filteredProjects} onClick={(p: any) => setSelectedProject(p.id)} cursor="pointer">
                  {filteredProjects.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={STATUS_STYLES[entry.status].fill} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
            
            {/* Quadrant Legend */}
            <div style={styles.quadrantGrid}>
              {[
                { label: 'Top-Left Quadrant', desc: 'High ROI / Low CapEx', sub: 'Quick Wins 🎯', bg: '#F0FDF4', border: '#BBF7D0', color: '#15803d' },
                { label: 'Top-Right Quadrant', desc: 'High ROI / High CapEx', sub: 'Strategic Bets 💎', bg: '#EFF6FF', border: '#BFDBFE', color: '#1d4ed8' },
                { label: 'Bottom-Left Quadrant', desc: 'Low ROI / Low CapEx', sub: 'Monitor 👁️', bg: '#FFFBEB', border: '#FDE68A', color: '#b45309' },
                { label: 'Bottom-Right Quadrant', desc: 'Low ROI / High CapEx', sub: 'Risk Zone ⚠️', bg: '#FEF2F2', border: '#FECACA', color: '#b91c1c' }
              ].map((q, i) => (
                <div key={i} style={styles.quadrantBox(q.bg, q.border)}>
                  <div style={{ fontSize: '11px', fontWeight: 600, color: q.color, marginBottom: '4px' }}>{q.label}</div>
                  <div style={{ fontSize: '13px', fontWeight: 500, color: COLORS.slateDark }}>{q.desc}</div>
                  <div style={{ fontSize: '11px', color: COLORS.textLight }}>{q.sub}</div>
                </div>
              ))}
            </div>

            {/* Bubble & Color Legend */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px', padding: '0 20px', borderTop: `1px solid ${COLORS.border}`, paddingTop: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '12px', color: COLORS.textLight }}>
                <span>Bubble Size:</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                   <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#CBD5E1' }}></div> <span>NPV: 6L</span>
                   <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#CBD5E1' }}></div> <span>NPV: 12L</span>
                   <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#CBD5E1' }}></div> <span>NPV: 18L</span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '12px' }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{width:10, height:10, borderRadius:'50%', background:'#16A34A'}}></div> Completed</div>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{width:10, height:10, borderRadius:'50%', background:'#2563EB'}}></div> Active</div>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{width:10, height:10, borderRadius:'50%', background:'#D97706'}}></div> Planning</div>
              </div>
            </div>
          </div>
        </Card>

        {/* 6. Cash Flow Area Chart */}
        <Card>
          <div style={styles.cardHeader}>
             <div>
               <h3 style={styles.cardTitle}>Project Cash Flows (5-Year Projection)</h3>
               <p style={{ fontSize: '13px', color: COLORS.textLight, margin: '4px 0 0' }}>Projected cash flows for active projects</p>
             </div>
             <Button variant="outline" size="sm" onClick={() => setShowCumulative(!showCumulative)}>Show Annual</Button>
          </div>
          <div style={styles.cardContent}>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={cashFlowData}>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                 <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{fontSize:12, fill:COLORS.textLight}} dy={10} />
                 <YAxis axisLine={false} tickLine={false} tick={{fontSize:12, fill:COLORS.textLight}} />
                 <RechartsTooltip />
                 <ReferenceLine y={0} stroke="#64748B" label="Break-even" />
                 <ReferenceLine y={15} stroke="#DC2626" strokeDasharray="5 5" label="Target (15%)" />
                 {showCumulative ? (
                   <Area type="monotone" dataKey="cumulative" stroke={COLORS.teal} fill={COLORS.teal} fillOpacity={0.6} />
                 ) : (
                   <Area type="monotone" dataKey="automationSuite" stroke={COLORS.blue} fill={COLORS.blue} fillOpacity={0.5} />
                 )}
              </AreaChart>
            </ResponsiveContainer>
            
            {/* Break-even details */}
            <div style={{ marginTop: '16px', backgroundColor: COLORS.white, border: `1px solid ${COLORS.border}`, borderRadius: '8px', padding: '12px', display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
               <div style={{display:'flex', alignItems:'center', gap:8}}><Zap size={14} color={COLORS.teal} /> <b style={{fontWeight: 600}}>Break-even Analysis</b></div>
               <div style={{color: COLORS.textLight}}>Automation Suite: <span style={{color: COLORS.green}}>Y2 (24 months)</span></div>
               <div style={{color: COLORS.textLight}}>Phoenix ERP: <span style={{color: COLORS.green}}>Y3 (28 months)</span></div>
               <div style={{color: COLORS.textLight}}>R&D Lab: <span style={{color: '#D97706'}}>Y4 (36 months)</span></div>
            </div>
          </div>
        </Card>

        {/* 7. Investment Portfolio Table */}
        <Card>
          <div style={styles.cardHeader}>
            <h3 style={styles.cardTitle}>Investment Portfolio Table</h3>
            <Button variant="outline"><Download size={14} /> Export Table</Button>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
              <thead>
                <tr style={{ backgroundColor: '#F8FAFC' }}>
                  {['Project Name', 'Category', 'CapEx (₹L)', 'ROI %', 'NPV (₹L)', 'IRR %', 'Payback (mo)', 'Progress', 'Status'].map((h, i) => (
                    <th key={i} style={{ ...styles.th, textAlign: i > 1 && i < 7 ? 'right' : 'left' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredProjects.map((p) => (
                  <tr key={p.id} style={{ backgroundColor: selectedProject === p.id ? '#F0FDFA' : 'white', cursor: 'pointer' }} onClick={() => setSelectedProject(p.id)}>
                    <td style={styles.td}>{p.name}</td>
                    <td style={styles.td}>
                      <Badge 
                        text={p.category} 
                        style={{ ...CATEGORY_STYLES[p.category], border: `1px solid ${CATEGORY_STYLES[p.category].border}` }} 
                      />
                    </td>
                    <td style={{ ...styles.td, textAlign: 'right' }}>₹{p.capex}</td>
                    <td style={{ ...styles.td, textAlign: 'right', color: p.roi >= 15 ? COLORS.green : COLORS.red }}>{p.roi}%</td>
                    <td style={{ ...styles.td, textAlign: 'right' }}>₹{p.npv}</td>
                    <td style={{ ...styles.td, textAlign: 'right', color: p.irr >= 15 ? COLORS.green : COLORS.red }}>{p.irr}%</td>
                    <td style={{ ...styles.td, textAlign: 'right' }}>{p.payback}</td>
                    <td style={styles.td}>
                       <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                         <div style={{ width: '60px', height: '6px', backgroundColor: '#E2E8F0', borderRadius: '4px' }}>
                           <div style={{ width: `${p.progress}%`, height: '100%', backgroundColor: COLORS.teal, borderRadius: '4px' }} />
                         </div>
                         <span style={{ fontSize: '11px', color: COLORS.textLight }}>{p.progress}%</span>
                       </div>
                    </td>
                    <td style={styles.td}>
                      <Badge 
                        text={p.status} 
                        style={{ backgroundColor: STATUS_STYLES[p.status].bg, color: STATUS_STYLES[p.status].color, border: `1px solid ${STATUS_STYLES[p.status].border}` }} 
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* 8. Asset Depreciation & Milestones (Fixed Layout) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
          
          {/* Depreciation (Fixed Visuals) */}
          <Card>
            <div style={styles.cardHeader}>
              <div>
                <h3 style={styles.cardTitle}>Asset Depreciation Schedule</h3>
                <p style={{ fontSize: '13px', color: COLORS.textLight, margin: '4px 0 0' }}>Written Down Value (WDV) method</p>
              </div>
            </div>
            <div style={styles.cardContent}>
              <div style={{ fontSize: '13px', marginBottom: '10px', fontWeight: 500 }}>Book Value by Asset Type</div>
              
              {/* Donut Chart */}
              <div style={{ height: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <ResponsiveContainer width={200} height="100%">
                  <PieChart>
                    <Pie 
                      data={[{name: 'Tech', value: 30}, {name: 'Infra', value: 50}, {name: 'R&D', value: 20}]} 
                      innerRadius={50} 
                      outerRadius={70} 
                      dataKey="value"
                      paddingAngle={5}
                    >
                       <Cell fill={COLORS.teal} />
                       <Cell fill={COLORS.purple} />
                       <Cell fill={COLORS.red} />
                    </Pie>
                    <RechartsTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Asset List (Cards) */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {filteredProjects.slice(0, 3).map(p => (
                  <div key={p.id} style={{ 
                    border: `1px solid ${COLORS.border}`, 
                    borderRadius: '8px', 
                    padding: '12px',
                    transition: 'border 0.2s',
                    cursor: 'default',
                    backgroundColor: 'white'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = COLORS.tealBorder}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = COLORS.border}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 500, color: COLORS.slateDark }}>{p.name}</div>
                        <Badge 
                          text={p.category} 
                          style={{ ...CATEGORY_STYLES[p.category], marginTop: '4px', border: `1px solid ${CATEGORY_STYLES[p.category].border}` }} 
                        />
                      </div>
                      <div style={{textAlign:'right'}}>
                         <div style={{fontSize:'13px', fontWeight: 600, color: COLORS.slateDark}}>₹{p.annualDep}L/yr</div>
                         <div style={{fontSize:'11px', color: COLORS.textLight}}>{p.depRate}% p.a.</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: COLORS.textLight, borderTop: `1px solid ${COLORS.border}`, paddingTop: '8px' }}>
                       <span>Book Val: <b style={{color: COLORS.slateDark, fontWeight: 500}}>₹{p.bookValue}L</b></span>
                       <span style={{color: COLORS.border}}>|</span>
                       <span>Useful Life: <b style={{color: COLORS.slateDark, fontWeight: 500}}>{p.usefulLife} yrs</b></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Milestones */}
          <Card>
            <div style={styles.cardHeader}>
              <div>
                <h3 style={styles.cardTitle}>Upcoming Milestones</h3>
                <p style={{ fontSize: '13px', color: COLORS.textLight, margin: '4px 0 0' }}>Critical project deliverables</p>
              </div>
              <Button variant="outline" size="sm" style={{gap: '6px'}}><Calendar size={14}/> View Gantt</Button>
            </div>
            <div style={styles.cardContent}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {milestones.map(m => (
                  <div key={m.id} style={{ 
                    borderLeft: `4px solid ${m.status === 'On Track' ? '#22C55E' : m.status === 'Delayed' ? '#F97316' : '#EF4444'}`,
                    backgroundColor: m.status === 'On Track' ? '#F0FDF4' : m.status === 'Delayed' ? '#FFF7ED' : '#FEF2F2',
                    borderRadius: '6px', padding: '12px', border: `1px solid ${COLORS.border}`, borderLeftWidth: '4px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 500 }}>{m.milestone}</span>
                      <Badge 
                        text={m.status} 
                        style={{ 
                          fontSize: '10px', 
                          backgroundColor: m.status === 'On Track' ? '#DCFCE7' : m.status === 'Delayed' ? '#FFEDD5' : '#FEE2E2',
                          color: m.status === 'On Track' ? '#166534' : m.status === 'Delayed' ? '#9A3412' : '#991B1B',
                          border: `1px solid ${m.status === 'On Track' ? '#86EFAC' : m.status === 'Delayed' ? '#FDBA74' : '#FECACA'}`
                        }} 
                      />
                    </div>
                    <div style={{ fontSize: '11px', color: COLORS.textLight }}>{m.project}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', marginTop: '6px', color: COLORS.textLight }}>
                       <Calendar size={12} /> Due: {m.dueDate}
                       {m.delay && <><span style={{margin:'0 4px', color: COLORS.border}}>|</span> <AlertTriangle size={12} color="#EA580C" /> <span style={{color: '#EA580C'}}>{m.delay}</span></>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* 9. Recommendations & Summary */}
        <Card style={{ background: 'linear-gradient(to bottom right, #FFFFFF, #F0FDFA)' }}>
          <div style={styles.cardHeader}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Zap size={18} color={COLORS.teal} />
              <h3 style={styles.cardTitle}>AI Investment Recommendations (Automated)</h3>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <Button variant="outline"><Lightbulb size={14}/> Generate Summary</Button>
              <Button variant="outline"><Download size={14}/> Export AI Summary <ChevronDown size={14} /></Button>
            </div>
          </div>
          <div style={styles.cardContent}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {recommendations.map(rec => (
                <div key={rec.id} style={{ 
                  display: 'flex', gap: '12px', padding: '12px', borderRadius: '8px',
                  backgroundColor: rec.actioned ? '#F8FAFC' : 'white',
                  border: `1px solid ${rec.actioned ? COLORS.border : COLORS.tealBorder}`,
                  opacity: rec.actioned ? 0.7 : 1,
                  transition: 'all 0.2s'
                }}>
                  <div onClick={() => toggleRecommendation(rec.id)} style={{ cursor: 'pointer', marginTop: '2px' }}>
                    {rec.actioned ? <CheckSquare size={18} color={COLORS.green} /> : <Square size={18} color={COLORS.textLight} />}
                  </div>
                  <div>
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '4px' }}>
                      <Badge text={rec.type} style={{ 
                        backgroundColor: rec.type === 'Performance' ? '#F0FDF4' : rec.type === 'Risk' ? '#FEF2F2' : '#EFF6FF', 
                        color: rec.type === 'Performance' ? '#15803d' : rec.type === 'Risk' ? '#B91C1C' : '#1D4ED8',
                        border: `1px solid ${rec.type === 'Performance' ? '#BBF7D0' : rec.type === 'Risk' ? '#FECACA' : '#BFDBFE'}` 
                      }} />
                      {rec.actioned && <Badge text="Actioned" style={{ backgroundColor: '#F1F5F9', color: COLORS.textLight }} />}
                    </div>
                    <div style={{ fontSize: '13px', color: COLORS.text, textDecoration: rec.actioned ? 'line-through' : 'none' }}>{rec.text}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Portfolio Summary Box */}
            <div style={{ marginTop: '24px', backgroundColor: '#EFF6FF', borderLeft: `4px solid ${COLORS.blue}`, borderRadius: '6px', padding: '16px', display: 'flex', gap: '12px' }}>
              <Lightbulb size={20} color={COLORS.blue} style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: COLORS.slateDark, marginBottom: '6px' }}>Portfolio Summary (Generated 30 Oct 2024)</div>
                <div style={{ fontSize: '13px', lineHeight: '1.5', color: COLORS.text }}>
                  Portfolio ROI exceeds target at 19.6% vs 15% benchmark. Tech projects continue to outperform with average 26% returns, while Infrastructure category shows mixed performance. Mumbai Office requires immediate ROI improvement strategy. Cloud Infrastructure fast-track recommended given strong fundamentals (24.2% IRR).
                </div>
              </div>
            </div>

            {/* Efficiency Box */}
            <div style={{ marginTop: '16px', backgroundColor: '#FFFBEB', border: '1px solid #FEF3C7', borderRadius: '6px', padding: '16px', display: 'flex', gap: '12px' }}>
               <Target size={20} color="#D97706" style={{ flexShrink: 0, marginTop: '2px' }} />
               <div>
                 <div style={{ fontSize: '14px', fontWeight: 600, color: COLORS.slateDark, marginBottom: '4px' }}>Capital Efficiency Insight</div>
                 <div style={{ fontSize: '13px', color: COLORS.text }}>Average payback for active projects is 32 months. Target portfolio optimization to reduce to {'<'}30 months through increased allocation to quick-win projects.</div>
               </div>
            </div>

          </div>
        </Card>

      </div>
    </div>
  );
}