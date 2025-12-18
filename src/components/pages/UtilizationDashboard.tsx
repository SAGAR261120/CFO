import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
  Legend, ResponsiveContainer, ReferenceLine
} from 'recharts';
import {
  Activity, Clock, Users, Percent, Building2, Calendar, IndianRupee, RefreshCw,
  Zap, TrendingUp, Info, Play, Pause, Award, Target, AlertTriangle, Lightbulb
} from 'lucide-react';

// --- Constants & Styles ---

const COLORS = {
  blue: '#3B82F6',
  blueLight: '#EFF6FF',
  blueBorder: '#BFDBFE',
  green: '#10B981',
  greenLight: '#ECFDF5',
  greenBorder: '#A7F3D0',
  amber: '#F59E0B',
  amberLight: '#FFFBEB',
  amberBorder: '#FDE68A',
  red: '#EF4444',
  redLight: '#FEF2F2',
  redBorder: '#FECACA',
  slate: '#F1F5F9',
  slateDark: '#0F172A',
  text: '#334155',
  textLight: '#64748B',
  white: '#FFFFFF',
  border: '#E2E8F0',
  purple: '#8B5CF6',
  purpleLight: '#F5F3FF',
  purpleBorder: '#DDD6FE',
};

// --- Mock Data ---

const teamUtilizationTrends = [
  { week: 'W47', Design: 68, Engineering: 74, Consulting: 82, Marketing: 65, Operations: 71, avgLine: 72 },
  { week: 'W48', Design: 70, Engineering: 76, Consulting: 84, Marketing: 67, Operations: 73, avgLine: 72 },
  { week: 'W49', Design: 72, Engineering: 78, Consulting: 85, Marketing: 69, Operations: 74, avgLine: 72 },
  { week: 'W50', Design: 74, Engineering: 80, Consulting: 86, Marketing: 71, Operations: 76, avgLine: 72 },
  { week: 'W51', Design: 73, Engineering: 79, Consulting: 87, Marketing: 70, Operations: 75, avgLine: 72 },
  { week: 'W52', Design: 75, Engineering: 81, Consulting: 88, Marketing: 72, Operations: 77, avgLine: 72 },
];

const capacityDemandData = [
  { month: 'Jan 25', capacity: 2000, demand: 1920, utilization: 96, status: 'ideal' },
  { month: 'Feb 25', capacity: 2050, demand: 1950, utilization: 95, status: 'ideal' },
  { month: 'Mar 25', capacity: 2100, demand: 2240, utilization: 107, status: 'overbooked' },
  { month: 'Apr 25', capacity: 2150, demand: 2010, utilization: 93, status: 'ideal' },
  { month: 'May 25', capacity: 2200, demand: 1870, utilization: 85, status: 'ideal' },
  { month: 'Jun 25', capacity: 2250, demand: 1575, utilization: 70, status: 'underutilized' },
];

const teamPerformanceData = [
  { team: 'Consulting', utilization: 85, target: 80, realization: 88, billableHours: 1360, nonBillableHours: 240, avgRate: 12000, status: 'on-target', trend: [82, 83, 84, 85] },
  { team: 'Engineering', utilization: 78, target: 75, realization: 82, billableHours: 1540, nonBillableHours: 430, avgRate: 9500, status: 'on-target', trend: [76, 77, 77, 78] },
  { team: 'Design', utilization: 72, target: 70, realization: 85, billableHours: 960, nonBillableHours: 370, avgRate: 8500, status: 'on-target', trend: [68, 70, 71, 72] },
  { team: 'Marketing', utilization: 68, target: 72, realization: 75, billableHours: 680, nonBillableHours: 320, avgRate: 7000, status: 'watch', trend: [65, 66, 67, 68] },
  { team: 'Operations', utilization: 74, target: 75, realization: 80, billableHours: 1400, nonBillableHours: 450, avgRate: 8000, status: 'on-target', trend: [71, 72, 73, 74] },
];

const topPerformers = [
  { rank: 1, name: 'Rahul Sharma', team: 'Engineering', utilization: 88, realization: 95, billingRate: 9000, projects: 3, trend: '+4% MoM', hours: 176 },
  { rank: 2, name: 'Priya Mehta', team: 'Consulting', utilization: 92, realization: 90, billingRate: 13500, projects: 2, trend: '+2% MoM', hours: 184 },
  { rank: 3, name: 'Amit Patel', team: 'Design', utilization: 85, realization: 88, billingRate: 9500, projects: 4, trend: '+6% MoM', hours: 170 },
  { rank: 4, name: 'Sneha Kumar', team: 'Engineering', utilization: 86, realization: 92, billingRate: 10000, projects: 3, trend: '+3% MoM', hours: 172 },
  { rank: 5, name: 'Vikram Singh', team: 'Consulting', utilization: 90, realization: 87, billingRate: 14000, projects: 2, trend: '+5% MoM', hours: 180 },
];

const projectEfficiency = [
  { project: 'Phoenix ERP', budget: 240000, actual: 228000, allocated: 3, utilized: 2.4, efficiency: 95, variance: 12000, status: 'efficient' },
  { project: 'Digital Transformation', budget: 320000, actual: 304000, allocated: 4, utilized: 3.8, efficiency: 95, variance: 16000, status: 'efficient' },
  { project: 'Cloud Migration', budget: 180000, actual: 162000, allocated: 2.5, utilized: 2.25, efficiency: 90, variance: 18000, status: 'efficient' },
  { project: 'Mobile App Dev', budget: 150000, actual: 129000, allocated: 2, utilized: 1.72, efficiency: 86, variance: 21000, status: 'good' },
  { project: 'AI Integration', budget: 280000, actual: 218400, allocated: 3.5, utilized: 2.73, efficiency: 78, variance: 61600, status: 'underutilized' },
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

const Badge = ({ text, color, bg, border, style = {} }: any) => (
  <span style={{
    display: 'inline-flex',
    alignItems: 'center',
    padding: '2px 8px',
    borderRadius: '999px',
    fontSize: '11px',
    fontWeight: 500,
    backgroundColor: bg,
    color: color,
    border: `1px solid ${border}`,
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
    default: { backgroundColor: COLORS.blue, color: 'white' },
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

// --- Main Dashboard Component ---

export default function UtilizationDashboard() {
  const [selectedTimeRange, setSelectedTimeRange] = useState('Monthly');
  const [selectedTeam, setSelectedTeam] = useState('All Teams');
  const [selectedRoleType, setSelectedRoleType] = useState('All');
  const [isPlaying, setIsPlaying] = useState(false);

  const totalBillableHours = teamPerformanceData.reduce((sum, t) => sum + t.billableHours, 0);
  const totalNonBillableHours = teamPerformanceData.reduce((sum, t) => sum + t.nonBillableHours, 0);
  const overallUtilization = 71.6;
  const realizationRate = 84.2;
  const avgBillingRate = 9200;

  // --- Speech Logic ---
  const aiInsightText = "Overall utilization at 71.6% is slightly below the 72% target but within healthy operational range. The realization rate of 84.2% approaches the industry benchmark of 85%. Consulting leads with 85% utilization. Engineering maintains solid 78% utilization. Marketing at 68% shows opportunity for improvement.";

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
      window.speechSynthesis.cancel(); // Cancel any current speech
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

  const styles = {
    container: { fontFamily: 'Inter, sans-serif', backgroundColor: '#F8FAFC', minHeight: '100vh', padding: '24px', color: COLORS.slateDark },
    wrapper: { maxWidth: '1600px', margin: '0 auto', display: 'flex', flexDirection: 'column' as const, gap: '24px' },
    ribbon: { background: 'linear-gradient(to right, #EFF6FF, #F8FAFC)', border: `1px solid ${COLORS.blueBorder}`, borderRadius: '8px', padding: '12px 20px', display: 'flex', flexWrap: 'wrap' as const, alignItems: 'center', gap: '16px', fontSize: '13px' },
    ribbonItem: { display: 'flex', alignItems: 'center', gap: '6px', color: COLORS.text },
    divider: { height: '16px', width: '1px', backgroundColor: '#CBD5E1' },
    grid4: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' },
    grid2: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '20px' },
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
          <div style={styles.ribbonItem}><Building2 size={14} color={COLORS.blue} /> <span style={{ color: COLORS.textLight }}>Entity:</span> <b style={{fontWeight: 500}}>CFOsync AI Pvt Ltd</b></div>
          <div style={styles.divider} />
          <div style={styles.ribbonItem}><Calendar size={14} color={COLORS.blue} /> <span style={{ color: COLORS.textLight }}>Month:</span> <b style={{fontWeight: 500}}>Dec 2024</b></div>
          <div style={styles.divider} />
          <div style={styles.ribbonItem}><Clock size={14} color={COLORS.blue} /> <span style={{ color: COLORS.textLight }}>Unit:</span> <b style={{fontWeight: 500}}>Hours</b></div>
          <div style={styles.divider} />
          <div style={styles.ribbonItem}><IndianRupee size={14} color={COLORS.blue} /> <span style={{ color: COLORS.textLight }}>Currency:</span> <b style={{fontWeight: 500}}>INR</b></div>
        </div>

        {/* 2. AI Narration */}
        <Card style={{ background: 'linear-gradient(to bottom right, #FFFFFF, #EFF6FF)', border: `1px solid ${COLORS.blueBorder}` }}>
          <div style={styles.cardContent}>
            <div style={{ display: 'flex', gap: '16px', marginTop: '20px' }}>
              <div style={{ position: 'relative' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'linear-gradient(135deg, #2563EB, #1E40AF)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #93C5FD' }}>
                  <Users size={28} color="white" />
                </div>
                {isPlaying && <div style={{ position: 'absolute', bottom: -2, right: -2, width: '16px', height: '16px', backgroundColor: COLORS.red, borderRadius: '50%', border: '2px solid white' }} />}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: 500, margin: 0, fontFamily: 'Poppins, sans-serif' }}>AI Workforce Utilization Analysis</h3>
                    <p style={{ fontSize: '13px', color: COLORS.textLight, margin: '4px 0 0' }}>Automated insights on resource efficiency and capacity planning</p>
                  </div>
                  <Button variant="outline" onClick={handlePlayPause}>
                    {isPlaying ? <Pause size={14} /> : <Play size={14} />} {isPlaying ? 'Pause' : 'Play'}
                  </Button>
                </div>
                <div style={{ marginTop: '12px', backgroundColor: 'white', border: `1px solid ${COLORS.blueBorder}`, borderRadius: '8px', padding: '12px', fontSize: '14px', lineHeight: '1.5', color: COLORS.text }}>
                  "{aiInsightText}"
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* 3. Controls Bar */}
        <Card>
          <div style={{ padding: '20px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <label style={{ fontSize: '13px', color: COLORS.textLight }}>Time Range:</label>
                <Select value={selectedTimeRange} onChange={setSelectedTimeRange} options={['Weekly', 'Monthly', 'Quarterly', 'YTD']} />
              </div>
              <div style={styles.divider} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <label style={{ fontSize: '13px', color: COLORS.textLight }}>Team:</label>
                <Select value={selectedTeam} onChange={setSelectedTeam} options={['All Teams', 'Consulting', 'Engineering', 'Design', 'Marketing', 'Operations']} />
              </div>
              <div style={styles.divider} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <label style={{ fontSize: '13px', color: COLORS.textLight }}>Role Type:</label>
                <Select value={selectedRoleType} onChange={setSelectedRoleType} options={['All', 'Billable', 'Non-Billable']} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', color: COLORS.textLight, marginRight: '8px' }}>Last Updated: 24 Jan 2025</span>
              <Button variant="outline"><RefreshCw size={14} /> Refresh</Button>
              <Button variant="outline"><Zap size={14} color={COLORS.blue} /> AI Summary</Button>
            </div>
          </div>
        </Card>

        {/* 4. KPI Cards */}
        <div style={styles.grid4}>
          <Card>
            <div style={styles.cardHeader}><span style={{ fontSize: '13px', fontWeight: 500, color: COLORS.textLight }}>Overall Utilization</span><Activity size={18} color={COLORS.blue} /></div>
            <div style={styles.cardContent}>
              <div style={styles.kpiValue}>{overallUtilization}%</div>
              <div style={{ fontSize: '12px', color: COLORS.green, marginTop: '4px' }}>↑ 1.3 pts MoM</div>
              <div style={{ width: '100%', height: '6px', backgroundColor: '#E2E8F0', borderRadius: '999px', marginTop: '12px', overflow: 'hidden' }}>
                <div style={{ width: `${overallUtilization}%`, height: '100%', backgroundColor: COLORS.blue }} />
              </div>
            </div>
          </Card>
          <Card>
            <div style={styles.cardHeader}><span style={{ fontSize: '13px', fontWeight: 500, color: COLORS.textLight }}>Realization Rate</span><Percent size={18} color={COLORS.green} /></div>
            <div style={styles.cardContent}>
              <div style={styles.kpiValue}>{realizationRate}%</div>
              <div style={{ fontSize: '12px', color: COLORS.textLight, marginTop: '4px' }}>Target: 85% (Industry)</div>
              <div style={{ width: '100%', height: '6px', backgroundColor: '#E2E8F0', borderRadius: '999px', marginTop: '12px', overflow: 'hidden' }}>
                <div style={{ width: `${realizationRate}%`, height: '100%', backgroundColor: COLORS.green }} />
              </div>
            </div>
          </Card>
          <Card>
            <div style={styles.cardHeader}><span style={{ fontSize: '13px', fontWeight: 500, color: COLORS.textLight }}>Billable Hours</span><Clock size={18} color={COLORS.purple} /></div>
            <div style={styles.cardContent}>
              <div style={styles.kpiValue}>{totalBillableHours.toLocaleString()}</div>
              <div style={{ fontSize: '12px', color: COLORS.textLight, marginTop: '4px' }}>Non-Billable: {totalNonBillableHours}</div>
              <div style={{ display: 'flex', width: '100%', height: '6px', borderRadius: '999px', marginTop: '12px', overflow: 'hidden' }}>
                <div style={{ width: `${(totalBillableHours / (totalBillableHours + totalNonBillableHours)) * 100}%`, backgroundColor: COLORS.purple }} />
                <div style={{ flex: 1, backgroundColor: '#E2E8F0' }} />
              </div>
            </div>
          </Card>
          <Card>
            <div style={styles.cardHeader}><span style={{ fontSize: '13px', fontWeight: 500, color: COLORS.textLight }}>Avg Billing Rate</span><IndianRupee size={18} color={COLORS.amber} /></div>
            <div style={styles.cardContent}>
              <div style={styles.kpiValue}>₹{avgBillingRate.toLocaleString()}/hr</div>
              <div style={{ fontSize: '12px', color: COLORS.green, marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <TrendingUp size={14} /> 3.2% MoM
              </div>
              <div style={{ fontSize: '11px', color: COLORS.textLight, marginTop: '8px' }}>Billing Efficiency</div>
            </div>
          </Card>
        </div>

        {/* 5. Charts Row */}
        <div style={styles.grid2}>
          {/* Utilization Trends */}
          <Card>
            <div style={styles.cardHeader}>
              <div>
                <h3 style={styles.cardTitle}>Team Utilization Trends</h3>
                <p style={{ fontSize: '12px', color: COLORS.textLight }}>Weekly utilization % by department</p>
              </div>
              <Info size={16} color={COLORS.textLight} />
            </div>
            <div style={styles.cardContent}>
              <div style={{ height: '300px', width: '100%' }}>
                <ResponsiveContainer>
                  <LineChart data={teamUtilizationTrends}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{fontSize:12, fill:COLORS.textLight}} />
                    <YAxis domain={[55, 95]} axisLine={false} tickLine={false} tick={{fontSize:12, fill:COLORS.textLight}} tickFormatter={(v)=>`${v}%`} />
                    <RechartsTooltip />
                    <Legend iconType="circle" />
                    <ReferenceLine y={72} stroke="#64748b" strokeDasharray="5 5" label="Target" />
                    <Line type="monotone" dataKey="Consulting" stroke={COLORS.green} strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="Engineering" stroke={COLORS.blue} strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="Design" stroke={COLORS.purple} strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="Marketing" stroke={COLORS.amber} strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="Operations" stroke={COLORS.red} strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Card>

          {/* Capacity Forecast */}
          <Card>
            <div style={styles.cardHeader}>
              <div>
                <h3 style={styles.cardTitle}>Capacity vs Demand Forecast</h3>
                <p style={{ fontSize: '12px', color: COLORS.textLight }}>6-month capacity planning outlook</p>
              </div>
              <Info size={16} color={COLORS.textLight} />
            </div>
            <div style={styles.cardContent}>
              <div style={{ height: '300px', width: '100%' }}>
                <ResponsiveContainer>
                  <AreaChart data={capacityDemandData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize:12, fill:COLORS.textLight}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize:12, fill:COLORS.textLight}} />
                    <RechartsTooltip />
                    <Legend />
                    <Area type="monotone" dataKey="capacity" stackId="1" stroke={COLORS.slateDark} fill={COLORS.slate} fillOpacity={0.5} name="Capacity" />
                    <Area type="monotone" dataKey="demand" stackId="2" stroke={COLORS.blue} fill={COLORS.blue} fillOpacity={0.3} name="Demand" />
                    <ReferenceLine y={2100} stroke={COLORS.red} strokeDasharray="3 3" label={{value:'100% Overbooked', fill:COLORS.red, fontSize:10}} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Card>
        </div>

        {/* 6. Team Performance Table */}
        <Card>
          <div style={styles.cardHeader}>
            <h3 style={styles.cardTitle}>Team Performance Summary</h3>
            <p style={{ fontSize: '12px', color: COLORS.textLight }}>Detailed utilization metrics by team</p>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                  {['Team', 'Utilization % / Target %', 'Realization %', 'Billable vs Non-Billable', 'Avg Rate', '% vs Target', 'Status'].map((h, i) => (
                    <th key={i} style={styles.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {teamPerformanceData.map((team, index) => (
                  <tr key={index} style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                    <td style={styles.td}>{team.team}</td>
                    <td style={styles.td}>
                      <div style={{ fontSize: '13px' }}>{team.utilization}% / {team.target}%</div>
                      <div style={{ width: '100px', height: '4px', backgroundColor: '#E2E8F0', borderRadius: '999px', marginTop: '4px' }}>
                        <div style={{ width: `${(team.utilization / team.target) * 100}%`, height: '100%', backgroundColor: team.utilization >= team.target ? COLORS.green : COLORS.amber }} />
                      </div>
                    </td>
                    <td style={styles.td}>{team.realization}%</td>
                    <td style={styles.td}>
                      <div style={{ fontSize: '13px' }}>{team.billableHours} | {team.nonBillableHours}</div>
                      <div style={{ display: 'flex', width: '120px', height: '4px', borderRadius: '999px', marginTop: '4px', overflow: 'hidden' }}>
                        <div style={{ width: `${(team.billableHours / (team.billableHours + team.nonBillableHours)) * 100}%`, backgroundColor: COLORS.blue }} />
                        <div style={{ flex: 1, backgroundColor: '#E2E8F0' }} />
                      </div>
                    </td>
                    <td style={styles.td}>₹{team.avgRate.toLocaleString()}</td>
                    <td style={{ ...styles.td, color: team.utilization >= team.target ? COLORS.green : COLORS.red }}>
                      {team.utilization >= team.target ? '+' : ''}{(team.utilization - team.target).toFixed(1)}%
                    </td>
                    <td style={styles.td}>
                      <Badge 
                        text={team.status === 'on-target' ? 'On Target' : 'Watch'} 
                        color={team.status === 'on-target' ? COLORS.green : COLORS.amber} 
                        bg={team.status === 'on-target' ? COLORS.greenLight : COLORS.amberLight} 
                        border={team.status === 'on-target' ? COLORS.greenBorder : COLORS.amberBorder}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* 7. Bottom Grid (Top Performers & Efficiency) */}
        <div style={styles.grid2}>
          {/* Top Performers */}
          <Card>
            <div style={styles.cardHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Award size={18} color={COLORS.amber} />
                <h3 style={styles.cardTitle}>Top Performers</h3>
              </div>
            </div>
            <div style={{ padding: '0 24px 24px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {topPerformers.map((p) => (
                  <div key={p.rank} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', backgroundColor: '#F8FAFC', borderRadius: '8px', border: `1px solid ${COLORS.border}` }}>
                    <div style={{ width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: COLORS.slateDark }}>
                      {p.rank === 1 ? '🥇' : p.rank === 2 ? '🥈' : p.rank === 3 ? '🥉' : p.rank}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ fontSize: '13px', fontWeight: 600 }}>{p.name}</span>
                        <Badge text={p.team} color={COLORS.blue} bg={COLORS.blueLight} border={COLORS.blueBorder} style={{ fontSize: '10px' }} />
                      </div>
                      <div style={{ display: 'flex', gap: '12px', fontSize: '11px', color: COLORS.textLight }}>
                        <span>Util: <b>{p.utilization}%</b></span>
                        <span>Real: <b>{p.realization}%</b></span>
                        <span style={{ color: COLORS.green }}>{p.trend}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Project Efficiency */}
          <Card>
            <div style={styles.cardHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Target size={18} color={COLORS.blue} />
                <h3 style={styles.cardTitle}>Project Resource Efficiency</h3>
              </div>
            </div>
            <div style={{ padding: '0 24px 24px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {projectEfficiency.map((p, i) => (
                  <div key={i} style={{ padding: '12px', backgroundColor: '#F8FAFC', borderRadius: '8px', border: `1px solid ${COLORS.border}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 600 }}>{p.project}</span>
                      <Badge 
                        text={`${p.efficiency}%`} 
                        color={p.efficiency >= 90 ? COLORS.green : p.efficiency >= 80 ? COLORS.blue : COLORS.amber} 
                        bg={p.efficiency >= 90 ? COLORS.greenLight : p.efficiency >= 80 ? COLORS.blueLight : COLORS.amberLight} 
                        border={p.efficiency >= 90 ? COLORS.greenBorder : p.efficiency >= 80 ? COLORS.blueBorder : COLORS.amberBorder}
                      />
                    </div>
                    <div style={{ width: '100%', height: '6px', backgroundColor: '#E2E8F0', borderRadius: '999px', marginBottom: '8px' }}>
                      <div style={{ width: `${p.efficiency}%`, height: '100%', backgroundColor: p.efficiency >= 90 ? COLORS.green : p.efficiency >= 80 ? COLORS.blue : COLORS.amber, borderRadius: '999px' }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: COLORS.textLight }}>
                      <span>Budget: ₹{(p.budget/1000).toFixed(0)}K</span>
                      <span>Actual: ₹{(p.actual/1000).toFixed(0)}K</span>
                      <span style={{ color: COLORS.green }}>Saved: ₹{(p.variance/1000).toFixed(0)}K</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* 8. AI Insights Grid */}
        <Card style={{ background: 'linear-gradient(to bottom right, #FFFFFF, #EFF6FF)', border: `1px solid ${COLORS.blueBorder}` }}>
          <div style={styles.cardHeader}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Lightbulb size={18} color={COLORS.blue} />
              <h3 style={styles.cardTitle}>AI Workforce Insights</h3>
            </div>
            <Badge text="Confidence: 92%" color={COLORS.blue} bg={COLORS.blueLight} border={COLORS.blueBorder} />
          </div>
          <div style={{ padding: '0 24px 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
            <div style={{ backgroundColor: 'white', borderLeft: `4px solid ${COLORS.green}`, padding: '16px', borderRadius: '8px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <TrendingUp size={16} color={COLORS.green} />
                <h4 style={{ fontSize: '13px', fontWeight: 600 }}>High Performers</h4>
              </div>
              <p style={{ fontSize: '12px', color: COLORS.text, lineHeight: '1.5' }}>5 employees consistently above 85% utilization. Consider for mentorship roles.</p>
              <button style={{ marginTop: '8px', fontSize: '11px', color: COLORS.blue, border: 'none', background: 'none', cursor: 'pointer', fontWeight: 500 }}>View Action Plan</button>
            </div>

            <div style={{ backgroundColor: 'white', borderLeft: `4px solid ${COLORS.amber}`, padding: '16px', borderRadius: '8px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <AlertTriangle size={16} color={COLORS.amber} />
                <h4 style={{ fontSize: '13px', fontWeight: 600 }}>Improvement Opportunity</h4>
              </div>
              <p style={{ fontSize: '12px', color: COLORS.text, lineHeight: '1.5' }}>4 employees below 60% utilization. Recommend skill development programs.</p>
              <button style={{ marginTop: '8px', fontSize: '11px', color: COLORS.blue, border: 'none', background: 'none', cursor: 'pointer', fontWeight: 500 }}>View Action Plan</button>
            </div>

            <div style={{ backgroundColor: 'white', borderLeft: `4px solid ${COLORS.blue}`, padding: '16px', borderRadius: '8px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <Users size={16} color={COLORS.blue} />
                <h4 style={{ fontSize: '13px', fontWeight: 600 }}>Capacity Planning</h4>
              </div>
              <p style={{ fontSize: '12px', color: COLORS.text, lineHeight: '1.5' }}>Engineering expected at 102% capacity in Feb. Recommend hiring or workload redistribution.</p>
              <button style={{ marginTop: '8px', fontSize: '11px', color: COLORS.blue, border: 'none', background: 'none', cursor: 'pointer', fontWeight: 500 }}>View Action Plan</button>
            </div>

            <div style={{ backgroundColor: 'white', borderLeft: `4px solid ${COLORS.purple}`, padding: '16px', borderRadius: '8px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <IndianRupee size={16} color={COLORS.purple} />
                <h4 style={{ fontSize: '13px', fontWeight: 600 }}>Rate Optimization</h4>
              </div>
              <p style={{ fontSize: '12px', color: COLORS.text, lineHeight: '1.5' }}>3 clients paying below average realization rate. Potential revenue uplift of ₹2.4L/month.</p>
              <button style={{ marginTop: '8px', fontSize: '11px', color: COLORS.blue, border: 'none', background: 'none', cursor: 'pointer', fontWeight: 500 }}>View Action Plan</button>
            </div>
          </div>
        </Card>

        {/* 9. Metric Definitions */}
        <Card>
          <div style={styles.cardHeader}>
            <h3 style={styles.cardTitle}>Key Metrics & Formulas</h3>
          </div>
          <div style={{ padding: '0 24px 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
            {[
              { title: 'Utilization %', formula: '(Billable Hours ÷ Available Hours) × 100' },
              { title: 'Realization %', formula: '(Billable Value ÷ Billable Hours) × 100' },
              { title: 'Avg Billing Rate', formula: 'Total Billed Value ÷ Total Billable Hours' },
              { title: 'Capacity Utilization', formula: '(Total Hours Utilized ÷ Total Capacity)' },
              { title: 'Efficiency %', formula: '(Actual ÷ Budget) × 100' },
              { title: 'AI Confidence', formula: '1 - (Forecast_Error / Actual)' },
            ].map((m, i) => (
              <div key={i} style={{ padding: '12px', backgroundColor: '#F8FAFC', borderRadius: '8px', border: `1px solid ${COLORS.border}` }}>
                <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>{m.title}</div>
                <div style={{ fontSize: '11px', fontFamily: 'monospace', color: COLORS.textLight, backgroundColor: 'white', padding: '6px', borderRadius: '4px', border: `1px solid ${COLORS.border}` }}>
                  {m.formula}
                </div>
              </div>
            ))}
          </div>
        </Card>

      </div>
    </div>
  );
}