

import React, { useState, useMemo, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
  Legend, ResponsiveContainer, LineChart, Line
} from 'recharts';
import {
  Globe, MapPin, TrendingUp, Users, AlertTriangle, Target,
  ArrowUpRight, ArrowDownRight, Lightbulb, Download, ChevronDown,
  ChevronUp, Building2, IndianRupee, Calendar, Database, Play, Pause
} from 'lucide-react';

// --- Styles & Constants ---

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
};

const REGION_COLORS = {
  West: '#0F766E',
  South: '#7C3AED',
  North: '#DC2626',
};

// --- Mock Data ---

const stateData = [
  { state: 'Maharashtra', revenue: 3960000, share: 36, growth: 15, gm: 42, customers: 85, dso: 38, avgTicket: 46588, topCustomer: 'TechCorp Solutions', region: 'West' },
  { state: 'Karnataka', revenue: 2640000, share: 24, growth: 22, gm: 38, customers: 62, dso: 42, avgTicket: 42581, topCustomer: 'InfoSys Partners', region: 'South' },
  { state: 'Gujarat', revenue: 2200000, share: 20, growth: 25, gm: 40, customers: 55, dso: 35, avgTicket: 40000, topCustomer: 'Gujarat Industries', region: 'West' },
  { state: 'Tamil Nadu', revenue: 1100000, share: 10, growth: 18, gm: 36, customers: 38, dso: 45, avgTicket: 28947, topCustomer: 'Chennai Tech', region: 'South' },
  { state: 'Delhi NCR', revenue: 660000, share: 6, growth: 12, gm: 35, customers: 28, dso: 40, avgTicket: 23571, topCustomer: 'Capital Ventures', region: 'North' },
  { state: 'Telangana', revenue: 440000, share: 4, growth: 28, gm: 39, customers: 22, dso: 36, avgTicket: 20000, topCustomer: 'Hyderabad Systems', region: 'South' },
];

const cityData = [
  { city: 'Mumbai', state: 'Maharashtra', revenue: 2200000, share: 20, growth: 16, region: 'West' },
  { city: 'Bangalore', state: 'Karnataka', revenue: 1800000, share: 16, growth: 24, region: 'South' },
  { city: 'Ahmedabad', state: 'Gujarat', revenue: 1500000, share: 14, growth: 26, region: 'West' },
  { city: 'Pune', state: 'Maharashtra', revenue: 1100000, share: 10, growth: 14, region: 'West' },
  { city: 'Chennai', state: 'Tamil Nadu', revenue: 880000, share: 8, growth: 18, region: 'South' },
  { city: 'Hyderabad', state: 'Telangana', revenue: 440000, share: 4, growth: 28, region: 'South' },
];

const monthlyTrendData = [
  { month: 'Jul', West: 480000, South: 320000, North: 50000 },
  { month: 'Aug', West: 495000, South: 335000, North: 52000 },
  { month: 'Sep', West: 510000, South: 345000, North: 54000 },
  { month: 'Oct', West: 525000, South: 358000, North: 55000 },
  { month: 'Nov', West: 540000, South: 368000, North: 56000 },
  { month: 'Dec', West: 555000, South: 380000, North: 58000 },
];

const hhiTrendData = [
  { month: 'Jul', hhi: 0.32 },
  { month: 'Aug', hhi: 0.31 },
  { month: 'Sep', hhi: 0.30 },
  { month: 'Oct', hhi: 0.29 },
  { month: 'Nov', hhi: 0.28 },
  { month: 'Dec', hhi: 0.28 },
];

// --- Reusable UI Components with Inline Styles ---

const Card = ({ children, style = {} }: any) => (
  <div style={{
    backgroundColor: COLORS.white,
    borderRadius: '12px',
    border: `1px solid ${COLORS.border}`,
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    overflow: 'hidden',
    ...style
  }}>
    {children}
  </div>
);

const Badge = ({ text, color, bg, icon }: any) => (
  <span style={{
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '2px 8px',
    borderRadius: '999px',
    fontSize: '11px',
    fontWeight: '500',
    color: color,
    backgroundColor: bg,
    border: `1px solid ${color}40`,
    fontFamily: 'Inter, sans-serif'
  }}>
    {icon} {text}
  </span>
);

const IconButton = ({ icon: Icon, onClick, text }: any) => (
  <button
    onClick={onClick}
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      padding: '6px 12px',
      backgroundColor: COLORS.white,
      border: `1px solid ${COLORS.border}`,
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '13px',
      color: COLORS.text,
      transition: 'background 0.2s',
      fontFamily: 'Inter, sans-serif',
      fontWeight: 400
    }}
  >
    <Icon size={14} />
    {text}
  </button>
);

// --- Main Dashboard Component ---

export default function GeoMixDashboard() {
  const [selectedState, setSelectedState] = useState('Maharashtra');
  const [sortColumn, setSortColumn] = useState('revenue');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState('state');
  const [isPlaying, setIsPlaying] = useState(false);
  const [collapsedRegions, setCollapsedRegions] = useState<any>({});

  // --- Calculations ---
  const totalRevenue = stateData.reduce((sum, s) => sum + s.revenue, 0);
  const totalStates = stateData.length;
  const activeStates = stateData.filter(s => s.revenue > 500000).length;
  const topState = stateData[0];
  const fastestGrowing = [...stateData].sort((a, b) => b.growth - a.growth)[0];
  const hhi = stateData.reduce((sum, s) => sum + Math.pow(s.share / 100, 2), 0);
  const top3States = stateData.slice(0, 3).reduce((sum, s) => sum + s.share, 0);
  const top5Cities = cityData.slice(0, 5).reduce((sum, c) => sum + c.share, 0);
  const coverageStates = (activeStates / 28) * 100;

  // --- Text for AI Insight ---
  const aiInsightText = "West Zone continues to dominate with 60% revenue share, driven primarily by Maharashtra (36%) and Gujarat (20%). South Zone posted the highest growth at +21% YoY, led by Telangana's exceptional 28% expansion. Geographic concentration remains moderately high with HHI at 0.28, suggesting opportunities for diversification.";

  // --- Logic ---
  const getRiskLevel = (hhiVal: number) => {
    if (hhiVal <= 0.25) return { label: 'Low Risk', color: COLORS.green, bg: COLORS.greenBg, icon: '🟢' };
    if (hhiVal <= 0.35) return { label: 'Moderate Risk', color: COLORS.amber, bg: COLORS.amberBg, icon: '🟡' };
    return { label: 'High Risk', color: COLORS.red, bg: '#FEE2E2', icon: '🔴' };
  };
  const risk = getRiskLevel(hhi);

  const selectedStateData = stateData.find(s => s.state === selectedState) || stateData[0];

  const sortedStateData = useMemo(() => {
    return [...stateData].sort((a: any, b: any) => {
      const aVal = a[sortColumn];
      const bVal = b[sortColumn];
      return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
    });
  }, [sortColumn, sortDirection]);

  const handleSort = (col: string) => {
    if (sortColumn === col) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(col);
      setSortDirection('desc');
    }
  };

  const toggleRegion = (region: string) => {
    setCollapsedRegions((prev: any) => ({ ...prev, [region]: !prev[region] }));
  };

  // --- Speech Logic ---
  
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
      // Cancel any existing speech first
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(aiInsightText);
      utterance.rate = 1.0; // Speed
      utterance.pitch = 1.0; // Pitch
      
      // When speech ends naturally, reset state
      utterance.onend = () => {
        setIsPlaying(false);
      };

      // Error handling
      utterance.onerror = (e) => {
        console.error("Speech synthesis error", e);
        setIsPlaying(false);
      };

      window.speechSynthesis.speak(utterance);
      setIsPlaying(true);
    }
  };

  // --- Styles Objects ---
  const styles = {
    container: {
      fontFamily: 'Inter, sans-serif',
      backgroundColor: '#F8FAFC',
      minHeight: '100vh',
      padding: '24px',
      color: COLORS.slateDark,
    },
    wrapper: {
      maxWidth: '1400px',
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
    ribbonItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      color: COLORS.text,
    },
    ribbonDivider: {
      height: '16px',
      width: '1px',
      backgroundColor: COLORS.border,
    },
    aiCard: {
      background: 'linear-gradient(to bottom right, #FFFFFF, #F0FDFA)',
      border: `1px solid ${COLORS.tealBorder}`,
      padding: '24px',
      display: 'flex',
      gap: '20px',
    },
    grid4: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
      gap: '20px',
    },
    cardHeader: {
      padding: '20px 24px 10px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    cardTitle: {
      fontSize: '15px',
      fontWeight: 500,
      color: COLORS.slateDark,
      margin: 0,
      fontFamily: 'Poppins, sans-serif',
      lineHeight: 1.5
    },
    cardContent: {
      padding: '0 24px 24px',
    },
    kpiValue: {
      fontSize: '24px',
      fontWeight: 600,
      color: COLORS.slateDark,
      marginTop: '8px',
    },
    progressBarBg: {
      height: '6px',
      width: '100%',
      backgroundColor: '#F1F5F9',
      borderRadius: '999px',
      marginTop: '12px',
      overflow: 'hidden',
    },
    progressBarFill: (percent: number, color: string) => ({
      height: '100%',
      width: `${Math.min(percent, 100)}%`,
      backgroundColor: color,
      borderRadius: '999px',
      transition: 'width 0.5s ease',
    }),
    table: {
      width: '100%',
      borderCollapse: 'collapse' as const,
      fontSize: '13px',
    },
    th: {
      textAlign: 'left' as const,
      padding: '12px 16px',
      color: COLORS.textLight,
      borderBottom: `1px solid ${COLORS.border}`,
      cursor: 'pointer',
      backgroundColor: '#F8FAFC',
      fontFamily: 'Poppins, sans-serif',
      fontWeight: 500
    },
    td: {
      padding: '12px 16px',
      borderBottom: `1px solid ${COLORS.border}`,
      color: COLORS.text,
    },
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
            <span style={{ color: COLORS.textLight }}>Entity:</span> <b style={{fontWeight: 500}}>ABC Pvt Ltd</b>
          </div>
          <div style={styles.ribbonDivider} />
          <div style={styles.ribbonItem}>
            <Calendar size={14} color={COLORS.teal} />
            <span>FY 2024–25</span>
          </div>
          <div style={styles.ribbonDivider} />
          <div style={styles.ribbonItem}>
            <IndianRupee size={14} color={COLORS.teal} />
            <span style={{ color: COLORS.textLight }}>Currency:</span> <b style={{fontWeight: 500}}>INR</b>
          </div>
          <div style={styles.ribbonDivider} />
          <div style={styles.ribbonItem}>
            <Database size={14} color={COLORS.teal} />
            <span style={{ color: COLORS.textLight }}>Data:</span> <b style={{fontWeight: 500}}>Dec 2024</b>
          </div>
          <div style={styles.ribbonDivider} />
          <div style={styles.ribbonItem}>
            <Target size={14} color={COLORS.teal} />
            <span style={{ color: COLORS.textLight }}>HHI Target:</span> <b style={{fontWeight: 500}}>≤0.25</b>
          </div>
        </div>

        {/* 2. AI Insight Section */}
        <Card style={styles.aiCard}>
          <div style={{ position: 'relative' }}>
            <div style={{
              width: '56px', height: '56px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #0F766E, #115E59)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(15, 118, 110, 0.2)'
            }}>
              <Lightbulb size={28} color="white" />
            </div>
            {isPlaying && (
              <div style={{
                position: 'absolute', bottom: -2, right: -2, width: '16px', height: '16px',
                backgroundColor: COLORS.red, borderRadius: '50%', border: '2px solid white'
              }} />
            )}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 500, color: COLORS.slateDark, fontFamily: 'Poppins, sans-serif' }}>
                  AI Geographic Distribution Insights
                </h3>
                <p style={{ margin: 0, fontSize: '13px', color: COLORS.textLight }}>
                  Automated analysis of regional concentration and growth patterns
                </p>
              </div>
              <IconButton
                icon={isPlaying ? Pause : Play}
                text={isPlaying ? "Pause" : "Play"}
                onClick={handlePlayPause}
              />
            </div>
            <div style={{
              backgroundColor: 'rgba(255,255,255,0.7)', border: `1px solid ${COLORS.tealBorder}`,
              borderRadius: '8px', padding: '12px', fontSize: '14px', lineHeight: '1.5', color: COLORS.text
            }}>
              "West Zone continues to dominate with <b>60% revenue share</b>, driven primarily by Maharashtra (36%) and Gujarat (20%).
              South Zone posted the highest growth at <b>+21% YoY</b>, led by Telangana's exceptional 28% expansion.
              Geographic concentration remains moderately high with HHI at 0.28, suggesting opportunities for diversification."
            </div>
          </div>
        </Card>

        {/* 3. View Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <p style={{ margin: 0, color: COLORS.textLight, fontSize: '14px', fontWeight: 400 }}>
            Geographic distribution of revenue across India
          </p>
          <div style={{ display: 'flex', gap: '12px' }}>
            <IconButton icon={Lightbulb} text="AI Regional Summary" onClick={() => { }} />
            <div style={{ backgroundColor: '#E2E8F0', padding: '3px', borderRadius: '6px', display: 'flex' }}>
              {['state', 'region'].map(mode => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  style={{
                    border: 'none', background: viewMode === mode ? 'white' : 'transparent',
                    padding: '6px 16px', borderRadius: '4px', fontSize: '13px', fontWeight: 500,
                    color: viewMode === mode ? COLORS.slateDark : COLORS.textLight,
                    cursor: 'pointer', boxShadow: viewMode === mode ? '0 1px 2px rgba(0,0,0,0.1)' : 'none',
                    fontFamily: 'Inter, sans-serif'
                  }}
                >
                  {mode.charAt(0).toUpperCase() + mode.slice(1)} View
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 4. Top KPI Cards */}
        <div style={styles.grid4}>
          <Card>
            <div style={styles.cardHeader}>
              <span style={{ fontSize: '13px', fontWeight: 500, color: COLORS.textLight }}>Total States</span>
              <Globe size={16} color={COLORS.teal} />
            </div>
            <div style={styles.cardContent}>
              <div style={styles.kpiValue}>{totalStates} States</div>
              <div style={{ fontSize: '12px', color: COLORS.textLight, marginTop: '4px' }}>Active: {activeStates} states</div>
              <div style={styles.progressBarBg}>
                <div style={styles.progressBarFill((activeStates / totalStates) * 100, COLORS.teal)} />
              </div>
            </div>
          </Card>

          <Card>
            <div style={styles.cardHeader}>
              <span style={{ fontSize: '13px', fontWeight: 500, color: COLORS.textLight }}>Top State Share</span>
              <MapPin size={16} color={COLORS.teal} />
            </div>
            <div style={styles.cardContent}>
              <div style={styles.kpiValue}>{topState.state}</div>
              <div style={{ fontSize: '12px', color: COLORS.teal, marginTop: '4px', fontWeight: 500 }}>{topState.share}% total share</div>
              <div style={styles.progressBarBg}>
                <div style={styles.progressBarFill(topState.share, COLORS.teal)} />
              </div>
            </div>
          </Card>

          <Card>
            <div style={styles.cardHeader}>
              <span style={{ fontSize: '13px', fontWeight: 500, color: COLORS.textLight }}>Fastest Growth</span>
              <TrendingUp size={16} color={COLORS.green} />
            </div>
            <div style={styles.cardContent}>
              <div style={styles.kpiValue}>{fastestGrowing.state}</div>
              <div style={{ fontSize: '12px', color: COLORS.green, marginTop: '4px', display: 'flex', alignItems: 'center' }}>
                <ArrowUpRight size={14} /> +{fastestGrowing.growth}% YoY
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end', height: '6px', gap: '2px', marginTop: '12px' }}>
                {[30, 50, 40, 70, 60, 100].map((h, i) => (
                  <div key={i} style={{ width: '100%', backgroundColor: i === 5 ? COLORS.green : '#DCFCE7', borderRadius: '1px', height: `${h}%` }} />
                ))}
              </div>
            </div>
          </Card>

          <Card style={{ border: `2px solid ${risk.bg === COLORS.greenBg ? COLORS.greenBg : COLORS.amberBg}` }}>
            <div style={styles.cardHeader}>
              <span style={{ fontSize: '13px', fontWeight: 500, color: COLORS.textLight }}>Concentration Risk</span>
              <AlertTriangle size={16} color={risk.color} />
            </div>
            <div style={styles.cardContent}>
              <div style={styles.kpiValue}>HHI: {hhi.toFixed(2)}</div>
              <div style={{ marginTop: '8px' }}>
                <Badge text={risk.label} color={risk.color} bg={risk.bg} icon={risk.icon} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: COLORS.textLight, marginTop: '12px' }}>
                <span>Target: 0.25</span>
                <span>Current: {hhi.toFixed(2)}</span>
              </div>
            </div>
          </Card>
        </div>

        {/* 5. Map & Details Split */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)',
          gap: '24px',
          alignItems: 'start'
        }}>
          {/* Map Placeholder */}
          <Card style={{ height: '100%', minHeight: '500px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ ...styles.cardHeader, borderBottom: `1px solid ${COLORS.border}` }}>
              <h3 style={styles.cardTitle}>Revenue Distribution Map</h3>
              <div style={{ display: 'flex', gap: '8px' }}>
                <div style={{ position: 'relative' }}>
                  <select style={{
                    appearance: 'none', border: `1px solid ${COLORS.border}`, borderRadius: '4px',
                    padding: '4px 24px 4px 8px', fontSize: '12px', color: COLORS.text, fontFamily: 'Inter, sans-serif'
                  }}>
                    <option>View by Revenue</option>
                    <option>View by GM%</option>
                  </select>
                  <ChevronDown size={14} style={{ position: 'absolute', right: 6, top: 8, pointerEvents: 'none', color: COLORS.textLight }} />
                </div>
                <IconButton icon={Download} onClick={() => { }} text="" />
              </div>
            </div>
            <div style={{ flex: 1, backgroundColor: '#F8FAFC', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{
                border: `2px dashed ${COLORS.tealBorder}`, borderRadius: '12px', padding: '40px',
                textAlign: 'center', backgroundColor: '#F0FDFA'
              }}>
                <Globe size={48} color={COLORS.teal} style={{ opacity: 0.5, margin: '0 auto 16px' }} />
                <h4 style={{ margin: '0 0 8px', color: COLORS.slateDark, fontWeight: 500, fontFamily: 'Poppins, sans-serif' }}>Interactive India Map</h4>
                <p style={{ margin: 0, fontSize: '13px', color: COLORS.textLight, maxWidth: '250px' }}>
                  Choropleth visualization. Click states to view details.
                </p>
                {/* Visual Legend */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '20px', fontSize: '11px', color: COLORS.textLight }}>
                  <span>Low</span>
                  <div style={{ width: '80px', height: '6px', borderRadius: '4px', background: `linear-gradient(to right, ${COLORS.tealBorder}, ${COLORS.amber})` }} />
                  <span>High</span>
                </div>
              </div>

              {/* Floating Tooltips (Visual Flair) */}
              <div style={{ position: 'absolute', top: '20%', left: '25%', backgroundColor: 'white', padding: '6px 10px', borderRadius: '4px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', border: `1px solid ${COLORS.tealBorder}` }}>
                <div style={{ fontWeight: 500, fontSize: '11px' }}>Gujarat</div>
                <div style={{ fontSize: '10px', color: COLORS.teal }}>20% Share</div>
              </div>
              <div style={{ position: 'absolute', top: '40%', left: '30%', backgroundColor: 'white', padding: '6px 10px', borderRadius: '4px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', border: `1px solid ${COLORS.tealBorder}`, transform: 'scale(1.1)' }}>
                <div style={{ fontWeight: 500, fontSize: '11px' }}>Maharashtra</div>
                <div style={{ fontSize: '10px', color: COLORS.teal }}>36% Share</div>
              </div>
            </div>
          </Card>

          {/* Selected State Details */}
          <Card style={{ borderTop: `4px solid ${COLORS.teal}` }}>
            <div style={styles.cardHeader}>
              <h3 style={{ ...styles.cardTitle, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MapPin size={18} color={COLORS.teal} />
                {selectedStateData.state} Details
              </h3>
            </div>
            <div style={styles.cardContent}>
              {/* Micro Metrics Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                <div style={{ backgroundColor: '#F0FDFA', padding: '12px', borderRadius: '8px', border: `1px solid ${COLORS.tealBorder}` }}>
                  <div style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', color: COLORS.teal }}>Revenue</div>
                  <div style={{ fontSize: '18px', fontWeight: 600, color: COLORS.slateDark }}>₹{(selectedStateData.revenue / 100000).toFixed(1)}L</div>
                  <div style={{ fontSize: '11px', color: COLORS.green, display: 'flex', alignItems: 'center' }}><ArrowUpRight size={12} /> +{selectedStateData.growth}%</div>
                </div>
                <div style={{ backgroundColor: '#DCFCE7', padding: '12px', borderRadius: '8px', border: '1px solid #BBF7D0' }}>
                  <div style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', color: COLORS.green }}>Gross Margin</div>
                  <div style={{ fontSize: '18px', fontWeight: 600, color: COLORS.slateDark }}>{selectedStateData.gm}%</div>
                  <div style={{ fontSize: '11px', color: COLORS.textLight }}>Target: 35%</div>
                </div>
                <div style={{ backgroundColor: 'white', padding: '12px', borderRadius: '8px', border: `1px solid ${COLORS.border}` }}>
                  <div style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', color: COLORS.textLight }}>DSO Days</div>
                  <div style={{ fontSize: '18px', fontWeight: 600, color: COLORS.slateDark }}>{selectedStateData.dso}</div>
                </div>
                <div style={{ backgroundColor: '#EFF6FF', padding: '12px', borderRadius: '8px', border: '1px solid #DBEAFE' }}>
                  <div style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', color: '#1D4ED8' }}>Customers</div>
                  <div style={{ fontSize: '18px', fontWeight: 600, color: COLORS.slateDark }}>{selectedStateData.customers}</div>
                </div>
              </div>

              {/* List Stats */}
              <div style={{ borderTop: `1px solid ${COLORS.border}`, paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                  <span style={{ color: COLORS.textLight }}>Avg Ticket Size</span>
                  <span style={{ fontWeight: 500, color: COLORS.slateDark }}>₹{selectedStateData.avgTicket.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                  <span style={{ color: COLORS.textLight }}>Region</span>
                  <span style={{ backgroundColor: COLORS.teal, color: 'white', padding: '2px 8px', borderRadius: '4px', fontSize: '11px' }}>{selectedStateData.region}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                  <span style={{ color: COLORS.textLight }}>Top Customer</span>
                  <span style={{ fontWeight: 500, color: COLORS.slateDark }}>{selectedStateData.topCustomer}</span>
                </div>
              </div>

              {/* Market Pos Bar */}
              <div style={{ marginTop: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px' }}>
                  <span style={{ color: COLORS.textLight }}>Market Position (Share)</span>
                  <span style={{ fontWeight: 600 }}>{selectedStateData.share}%</span>
                </div>
                <div style={{ width: '100%', height: '8px', backgroundColor: '#F1F5F9', borderRadius: '4px', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ width: `${selectedStateData.share}%`, height: '100%', backgroundColor: COLORS.teal }}></div>
                  <div style={{ position: 'absolute', left: '30%', top: 0, bottom: 0, width: '2px', backgroundColor: COLORS.red }}></div>
                </div>
                <div style={{ textAlign: 'right', fontSize: '10px', color: COLORS.textLight, marginTop: '2px' }}>Target Max: 30%</div>
              </div>
            </div>
          </Card>
        </div>

        {/* 6. Main Data Table */}
        <Card>
          <div style={{ ...styles.cardHeader, borderBottom: `1px solid ${COLORS.border}` }}>
            <h3 style={styles.cardTitle}>State-wise Revenue Analysis</h3>
            <IconButton icon={Download} text="Export CSV" onClick={() => { }} />
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  {[
                    { key: 'state', label: 'State / Region', align: 'left' },
                    { key: 'revenue', label: 'Revenue', align: 'right' },
                    { key: 'share', label: 'Share %', align: 'right' },
                    { key: 'gm', label: 'GM %', align: 'right' },
                    { key: 'growth', label: 'YoY Growth', align: 'right' },
                    { key: 'customers', label: 'Customers', align: 'right' },
                  ].map(col => (
                    <th key={col.key} onClick={() => handleSort(col.key)} style={{ ...styles.th, textAlign: col.align as any }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', justifyContent: col.align === 'right' ? 'flex-end' : 'flex-start' }}>
                        {col.label}
                        {sortColumn === col.key && (sortDirection === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />)}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sortedStateData.map((state) => (
                  <tr
                    key={state.state}
                    onClick={() => setSelectedState(state.state)}
                    style={{
                      cursor: 'pointer',
                      backgroundColor: selectedState === state.state ? '#F0FDFA' : 'white',
                      transition: 'background 0.1s'
                    }}
                  >
                    <td style={styles.td}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: (REGION_COLORS as any)[state.region] }} />
                        <span style={{ fontWeight: selectedState === state.state ? 600 : 400, color: selectedState === state.state ? COLORS.teal : COLORS.text }}>{state.state}</span>
                      </div>
                    </td>
                    <td style={{ ...styles.td, textAlign: 'right' }}>₹{(state.revenue / 100000).toFixed(1)}L</td>
                    <td style={{ ...styles.td, textAlign: 'right' }}>{state.share}%</td>
                    <td style={{ ...styles.td, textAlign: 'right', color: state.gm < 38 ? COLORS.red : COLORS.text }}>{state.gm}%</td>
                    <td style={{ ...styles.td, textAlign: 'right', color: state.growth > 0 ? COLORS.green : COLORS.red, fontWeight: 500 }}>
                      {state.growth > 0 ? '+' : ''}{state.growth}%
                    </td>
                    <td style={{ ...styles.td, textAlign: 'right' }}>{state.customers}</td>
                  </tr>
                ))}
                {/* Total Row */}
                <tr style={{ backgroundColor: '#F8FAFC', fontWeight: 600 }}>
                  <td style={styles.td}>Total</td>
                  <td style={{ ...styles.td, textAlign: 'right' }}>₹{(totalRevenue / 100000).toFixed(1)}L</td>
                  <td style={{ ...styles.td, textAlign: 'right' }}>100%</td>
                  <td style={{ ...styles.td, textAlign: 'right' }}>39.5%</td>
                  <td style={{ ...styles.td, textAlign: 'right' }}>+19.3%</td>
                  <td style={{ ...styles.td, textAlign: 'right' }}>290</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>

        {/* 7. Bottom Charts Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
          
          {/* Trend Chart */}
          <Card>
            <div style={styles.cardHeader}>
              <div>
                <h3 style={styles.cardTitle}>Regional Performance Trend</h3>
                <p style={{ margin: 0, fontSize: '12px', color: COLORS.textLight }}>Monthly revenue comparison</p>
              </div>
            </div>
            <div style={styles.cardContent}>
              <div style={{ height: '300px', width: '100%' }}>
                <ResponsiveContainer>
                  <LineChart data={monthlyTrendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: COLORS.textLight }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: COLORS.textLight }} tickFormatter={(val) => `₹${val / 1000}k`} />
                    <RechartsTooltip 
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} 
                      formatter={(val: number) => [`₹${(val/100000).toFixed(1)}L`]}
                    />
                    <Legend iconType='circle' wrapperStyle={{ paddingTop: '20px' }} />
                    <Line type="monotone" dataKey="West" stroke={REGION_COLORS.West} strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                    <Line type="monotone" dataKey="South" stroke={REGION_COLORS.South} strokeWidth={3} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="North" stroke={REGION_COLORS.North} strokeWidth={3} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Card>

          {/* City Performance */}
          <Card>
            <div style={styles.cardHeader}>
              <div>
                <h3 style={styles.cardTitle}>Top Cities Performance</h3>
                <p style={{ margin: 0, fontSize: '12px', color: COLORS.textLight }}>Revenue concentration</p>
              </div>
              <Badge text="68% • Moderate Risk" color={COLORS.amber} bg={COLORS.amberBg} />
            </div>
            <div style={{ padding: '0 24px 24px' }}>
              <div style={{ backgroundColor: '#FFFBEB', border: '1px solid #FEF3C7', borderRadius: '8px', padding: '10px', display: 'flex', gap: '8px', marginBottom: '16px' }}>
                <AlertTriangle size={16} color={COLORS.amber} />
                <span style={{ fontSize: '13px', color: '#92400E' }}>Top 5 Cities Concentration Risk Alert</span>
              </div>
              
              {/* Accordion List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {['West', 'South'].map(region => {
                   const rData = cityData.filter(c => c.region === region);
                   const isCollapsed = collapsedRegions[region];
                   return (
                     <div key={region} style={{ border: `1px solid ${COLORS.border}`, borderRadius: '8px', overflow: 'hidden' }}>
                       <div 
                         onClick={() => toggleRegion(region)}
                         style={{ 
                           padding: '12px', backgroundColor: '#F8FAFC', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                           borderLeft: `4px solid ${(REGION_COLORS as any)[region]}`
                         }}
                       >
                         <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, fontSize: '14px' }}>
                           {isCollapsed ? <ChevronDown size={14}/> : <ChevronUp size={14} />}
                           {region} Zone
                           <span style={{ fontSize: '10px', backgroundColor: 'white', border: `1px solid ${COLORS.border}`, padding: '2px 6px', borderRadius: '10px' }}>{rData.length} Cities</span>
                         </div>
                         <div style={{ fontSize: '13px', color: COLORS.textLight }}>₹{(rData.reduce((a,b)=>a+b.revenue,0)/100000).toFixed(1)}L</div>
                       </div>
                       
                       {!isCollapsed && (
                         <div style={{ backgroundColor: 'white' }}>
                           {rData.map((city, idx) => (
                             <div key={city.city} style={{ 
                               display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 16px',
                               borderTop: idx > 0 ? `1px solid ${COLORS.border}` : 'none'
                             }}>
                               <div>
                                 <div style={{ fontSize: '13px', fontWeight: 500 }}>{city.city}</div>
                                 <div style={{ fontSize: '11px', color: COLORS.textLight }}>{city.state}</div>
                               </div>
                               <div style={{ textAlign: 'right' }}>
                                 <div style={{ fontSize: '13px', fontWeight: 600 }}>₹{(city.revenue/100000).toFixed(1)}L</div>
                                 <div style={{ fontSize: '11px', color: COLORS.green }}>+{city.growth}%</div>
                               </div>
                             </div>
                           ))}
                         </div>
                       )}
                     </div>
                   );
                })}
              </div>
            </div>
          </Card>
        </div>

        {/* 8. Footer Analysis */}
        <Card style={{ borderTop: `1px solid ${COLORS.tealBorder}` }}>
          <div style={styles.cardHeader}>
             <h3 style={styles.cardTitle}>Geographic Concentration Analysis</h3>
          </div>
          <div style={styles.cardContent}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '32px' }}>
              <div>
                <div style={{ fontSize: '13px', color: COLORS.textLight, marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Target size={14} color={COLORS.teal} /> Top 3 States
                </div>
                <div style={{ fontSize: '24px', fontWeight: 600 }}>{top3States}%</div>
                <div style={{ height: '6px', width: '100%', backgroundColor: COLORS.slate, borderRadius: '4px', margin: '8px 0', overflow: 'hidden' }}>
                  <div style={{ width: `${top3States}%`, backgroundColor: COLORS.amber, height: '100%' }} />
                </div>
                <div style={{ fontSize: '11px', color: COLORS.amber }}>High concentration</div>
              </div>

              <div>
                <div style={{ fontSize: '13px', color: COLORS.textLight, marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MapPin size={14} color={COLORS.teal} /> Top 5 Cities
                </div>
                <div style={{ fontSize: '24px', fontWeight: 600 }}>{top5Cities}%</div>
                <div style={{ height: '6px', width: '100%', backgroundColor: COLORS.slate, borderRadius: '4px', margin: '8px 0', overflow: 'hidden' }}>
                  <div style={{ width: `${top5Cities}%`, backgroundColor: COLORS.amber, height: '100%' }} />
                </div>
                <div style={{ fontSize: '11px', color: COLORS.amber }}>Moderate Risk</div>
              </div>

              <div>
                <div style={{ fontSize: '13px', color: COLORS.textLight, marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <AlertTriangle size={14} color={COLORS.teal} /> HHI Index
                </div>
                <div style={{ fontSize: '24px', fontWeight: 600 }}>{hhi.toFixed(2)}</div>
                <div style={{ height: '30px', width: '100%', margin: '4px 0' }}>
                   <ResponsiveContainer>
                     <LineChart data={hhiTrendData}>
                       <Line type="monotone" dataKey="hhi" stroke={COLORS.teal} strokeWidth={2} dot={false} />
                     </LineChart>
                   </ResponsiveContainer>
                </div>
              </div>

              <div>
                <div style={{ fontSize: '13px', color: COLORS.textLight, marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                   <Globe size={14} color={COLORS.teal} /> Coverage
                </div>
                <div style={{ fontSize: '24px', fontWeight: 600 }}>{coverageStates.toFixed(0)}%</div>
                <div style={{ height: '6px', width: '100%', backgroundColor: COLORS.slate, borderRadius: '4px', margin: '8px 0', overflow: 'hidden' }}>
                  <div style={{ width: `${coverageStates}%`, backgroundColor: COLORS.teal, height: '100%' }} />
                </div>
                <div style={{ fontSize: '11px', color: COLORS.textLight }}>5 of 28 states active</div>
              </div>
            </div>

            <div style={{ marginTop: '24px', backgroundColor: '#F0FDFA', borderLeft: `4px solid ${COLORS.teal}`, padding: '16px', borderRadius: '0 8px 8px 0' }}>
              <div style={{ display: 'flex', gap: '12px' }}>
                <Lightbulb size={20} color={COLORS.teal} />
                <div>
                   <h4 style={{ margin: '0 0 4px', fontSize: '14px', color: COLORS.slateDark, fontWeight: 500 }}>AI Strategic Insight</h4>
                   <p style={{ margin: 0, fontSize: '13px', color: COLORS.text }}>
                     Geographic risk remains moderately high (HHI 0.28 vs. target 0.25). Expanding into Northern and Eastern regions can lower concentration by 4-5 percentage points. 
                     Target Tier-2 cities in UP and West Bengal to balance West zone dominance.
                   </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}