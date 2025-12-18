

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, ComposedChart 
} from 'recharts';
import { 
  DollarSign, TrendingUp, Percent, Wallet, Clock,
  Info, AlertTriangle, CheckCircle, Calendar, 
  ChevronDown, ArrowUpRight, ArrowDownRight, MapPin, 
  Play, Pause, Sparkles, Activity, Loader2, ChevronUp
} from 'lucide-react';

// --- Configuration & Types ---

const CURRENCY_CONFIG: Record<string, { label: string, symbol: string, rate: number, suffix: string }> = {
  INR: { label: 'INR', symbol: '₹', rate: 1, suffix: 'L' },
  USD: { label: 'USD', symbol: '$', rate: 0.012, suffix: 'M' }, // Approx conversion for demo scale
  EUR: { label: 'EUR', symbol: '€', rate: 0.011, suffix: 'M' },
  GBP: { label: 'GBP', symbol: '£', rate: 0.0095, suffix: 'M' }
};

interface DashboardData {
  kpis: {
    revenue: number;
    prevRevenue: number;
    gm: number;
    prevGm: number;
    ebitda: number;
    prevEbitda: number;
    netMargin: number;
    prevNetMargin: number;
    cashBalance: number;
    prevCashBalance: number;
    runway: number;
    prevRunway: number;
  };
  revenueData: any[];
  cashFlowData: any[];
  geographyData: any[];
  topCustomers: any[];
  workingCapitalData: any[];
  exceptions: any[];
}

// --- Mock API Service ---

const mockApi = {
  fetchDashboardData: (region: string): Promise<DashboardData> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          kpis: {
            revenue: 195.0,
            prevRevenue: 179.0,
            gm: 72,
            prevGm: 68,
            ebitda: 42,
            prevEbitda: 38,
            netMargin: 28,
            prevNetMargin: 25,
            cashBalance: 485,
            prevCashBalance: 455,
            runway: 11.5,
            prevRunway: 10.8
          },
          revenueData: [
            { month: 'Jul', revenue: 156, gm: 68 },
            { month: 'Aug', revenue: 168, gm: 70 },
            { month: 'Sep', revenue: 175, gm: 69 },
            { month: 'Oct', revenue: 182, gm: 71 },
            { month: 'Nov', revenue: 179, gm: 68 },
            { month: 'Dec', revenue: 195, gm: 72 },
          ],
          cashFlowData: [
            { month: 'Jul', operating: 45, investing: -12, financing: -8, net: 25 },
            { month: 'Aug', operating: 52, investing: -15, financing: 0, net: 37 },
            { month: 'Sep', operating: 48, investing: -10, financing: -5, net: 33 },
            { month: 'Oct', operating: 55, investing: -18, financing: 10, net: 47 },
            { month: 'Nov', operating: 50, investing: -8, financing: -12, net: 30 },
            { month: 'Dec', operating: 62, investing: -20, financing: 0, net: 42 },
          ],
          geographyData: [
            { region: 'Bangalore', value: 38, color: '#3b82f6' },
            { region: 'Mumbai', value: 30, color: '#10b981' },
            { region: 'Delhi NCR', value: 20, color: '#f59e0b' },
            { region: 'Hyderabad', value: 10, color: '#8b5cf6' },
            { region: 'Chennai', value: 2, color: '#64748b' },
          ],
          topCustomers: [
            { rank: 1, name: 'Acme Corporation', revenue: 285, growth: 18, margin: 72, dso: 42, trend: [65, 68, 72, 75, 80, 85] },
            { rank: 2, name: 'TechStart Industries', revenue: 245, growth: 25, margin: 68, dso: 38, trend: [50, 55, 60, 65, 70, 75] },
            { rank: 3, name: 'Global Enterprises', revenue: 198, growth: -5, margin: 65, dso: 55, trend: [80, 78, 76, 74, 72, 70] },
            { rank: 4, name: 'Innovation Labs', revenue: 176, growth: 32, margin: 75, dso: 35, trend: [40, 50, 60, 65, 70, 80] },
            { rank: 5, name: 'Enterprise Sol.', revenue: 165, growth: 12, margin: 70, dso: 48, trend: [60, 62, 64, 66, 68, 70] },
          ],
          workingCapitalData: [
            { metric: 'DSO', label: 'Days Sales Outstanding', value: 45, target: 45, status: 'good', trend: [50, 49, 48, 47, 46, 45], change: -3 },
            { metric: 'DIO', label: 'Days Inventory Outstanding', value: 32, target: 35, status: 'good', trend: [36, 35, 34, 33, 33, 32], change: -3 },
            { metric: 'DPO', label: 'Days Payable Outstanding', value: 38, target: 40, status: 'warning', trend: [42, 41, 40, 40, 39, 38], change: -2 },
            { metric: 'CCC', label: 'Cash Conversion Cycle', value: 39, target: 40, status: 'good', trend: [44, 43, 42, 41, 40, 39], change: -4 },
          ],
          exceptions: [
            { id: 'EX-102', type: 'Payment Overdue', amount: 12.5, severity: 'high', entity: 'TechStart' },
            { id: 'EX-105', type: 'Budget Variance', amount: 8.2, severity: 'medium', entity: 'Marketing' },
            { id: 'EX-109', type: 'Control Breach', amount: 5.8, severity: 'high', entity: 'Procurement' },
            { id: 'EX-112', type: 'Unreconciled Item', amount: 3.4, severity: 'low', entity: 'Treasury' },
            { id: 'EX-115', type: 'Credit Limit Exc.', amount: 4.1, severity: 'medium', entity: 'Sales' },
          ]
        });
      }, 1500);
    });
  }
};

// --- Helper Components ---

const Sparkline = ({ data, color }: { data: number[], color: string }) => {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * 60;
    const y = 20 - ((d - min) / range) * 20;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width="60" height="25" style={{ overflow: 'visible' }}>
      <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
};

const Card = ({ children, style }: { children: React.ReactNode, style?: React.CSSProperties }) => (
  <div style={{ 
    backgroundColor: 'white', 
    borderRadius: '12px', 
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)', 
    border: '1px solid #e2e8f0',
    overflow: 'hidden',
    ...style
  }}>
    {children}
  </div>
);

const Button = ({ children, onClick, style, variant = 'primary' }: any) => {
  const baseStyle: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    borderRadius: '6px', fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s',
    outline: 'none', border: 'none', padding: '8px 16px', fontSize: '14px',
    fontFamily: 'Inter, sans-serif'
  };
  const styles = {
    primary: { backgroundColor: '#2563eb', color: 'white' },
    destructive: { backgroundColor: '#ef4444', color: 'white' },
    outline: { backgroundColor: 'transparent', border: '1px solid #e2e8f0', color: '#0f172a' }
  };
  return (
    <button onClick={onClick} style={{ ...baseStyle, ...styles[variant as keyof typeof styles], ...style }}>
      {children}
    </button>
  );
};

const KPICard = ({ title, value, unit, change, trend, icon: Icon, color }: any) => (
  <div style={{ 
    backgroundColor: 'white', 
    borderRadius: '12px', 
    border: '1px solid #e2e8f0',
    borderTop: `4px solid ${color}`,
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    minHeight: '140px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
  }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <span style={{ fontSize: '14px', color: '#64748b', fontWeight: 500, fontFamily: 'Inter, sans-serif' }}>{title}</span>
      <Icon size={18} color={color} />
    </div>
    
    <div>
      <div style={{ fontSize: '24px', fontWeight: 600, color: '#0f172a', marginBottom: '4px', fontFamily: 'Inter, sans-serif' }}>
        {value}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontFamily: 'Inter, sans-serif' }}>
        {change > 0 ? <ArrowUpRight size={14} color="#16a34a" /> : <ArrowDownRight size={14} color="#dc2626" />}
        <span style={{ color: change > 0 ? '#16a34a' : '#dc2626', fontWeight: 600 }}>
          {change > 0 ? '+' : ''}{change.toFixed(1)}{trend}
        </span>
        <span style={{ color: '#64748b' }}>vs last month</span>
      </div>
    </div>
  </div>
);

// --- Main Dashboard ---

export default function CFODashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState('India');
  const [showAllExceptions, setShowAllExceptions] = useState(false);
  
  // Currency State with Persistence
  const [currency, setCurrency] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('currency') || 'INR';
    }
    return 'INR';
  });

  // Audio/Video State
  const [isSpeaking, setIsSpeaking] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    mockApi.fetchDashboardData(location).then((res) => {
      setData(res);
      setLoading(false);
    });
  }, [location]);

  useEffect(() => {
    localStorage.setItem('currency', currency);
  }, [currency]);

  // --- Currency Helpers ---

  const getCurrencyConfig = () => CURRENCY_CONFIG[currency] || CURRENCY_CONFIG.INR;

  const formatVal = (value: number) => {
    const config = getCurrencyConfig();
    const converted = value * config.rate;
    return `${config.symbol}${converted.toFixed(1)}${config.suffix}`;
  };

  const toggleExceptions = () => {
    setShowAllExceptions(prev => !prev);
  };

  // --- Memoized Converted Data for Charts ---
  // We need to convert the data passed to charts so the axis scales adjust dynamically
  const chartData = useMemo(() => {
    if (!data) return { revenue: [], cashFlow: [] };
    const config = getCurrencyConfig();

    return {
      revenue: data.revenueData.map(d => ({
        ...d,
        revenue: Number((d.revenue * config.rate).toFixed(1))
      })),
      cashFlow: data.cashFlowData.map(d => ({
        ...d,
        operating: Number((d.operating * config.rate).toFixed(1)),
        investing: Number((d.investing * config.rate).toFixed(1)),
        financing: Number((d.financing * config.rate).toFixed(1)),
        net: Number((d.net * config.rate).toFixed(1)),
      }))
    };
  }, [data, currency]);

  // --- Narrative Logic ---
  const generateNarrative = () => {
    if (!data) return "";
    const { kpis, exceptions } = data;
    const revChange = ((kpis.revenue - kpis.prevRevenue) / kpis.prevRevenue * 100).toFixed(1);
    const cashChange = ((kpis.cashBalance - kpis.prevCashBalance) / kpis.prevCashBalance * 100).toFixed(1);

    return `Executive Summary for ${location}. 
    We are seeing strong performance this month. Revenue closed at ${formatVal(kpis.revenue)}, which is a ${revChange} percent increase. 
    Cash balance is healthy at ${formatVal(kpis.cashBalance)}, up by ${cashChange} percent. 
    However, attention is needed on ${exceptions.length} active exceptions, particularly in Accounts Receivable.`;
  };

  const handlePlayBriefing = () => {
    if (!data) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    } else {
      const text = generateNarrative();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(v => v.lang.includes('en') && v.name.includes('Female')) || voices[0];
      if (preferredVoice) utterance.voice = preferredVoice;

      utterance.onstart = () => {
        setIsSpeaking(true);
        if (videoRef.current) videoRef.current.play();
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        if (videoRef.current) {
          videoRef.current.pause();
          videoRef.current.currentTime = 0;
        }
      };

      window.speechSynthesis.speak(utterance);
    }
  };

  if (loading || !data) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc', flexDirection: 'column', gap: '12px', fontFamily: 'Inter, sans-serif' }}>
        <Loader2 className="animate-spin" size={32} color="#2563eb" />
        <span style={{ color: '#64748b' }}>Loading Financial Data...</span>
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } } .animate-spin { animation: spin 1s linear infinite; }`}</style>
      </div>
    );
  }

  const totalExceptionImpact = data.exceptions.reduce((acc, curr) => acc + curr.amount, 0);
  const displayedExceptions = showAllExceptions ? data.exceptions : data.exceptions.slice(0, 2);

  // KPI Calculations for display
  const kpis = [
    { title: "Revenue", value: formatVal(data.kpis.revenue), unit: "", change: ((data.kpis.revenue - data.kpis.prevRevenue)/data.kpis.prevRevenue)*100, trend: "%", icon: DollarSign, color: "#2563eb" },
    { title: "Gross Margin", value: data.kpis.gm, unit: "%", change: data.kpis.gm - data.kpis.prevGm, trend: "pp", icon: Percent, color: "#7c3aed" }, // GM is %
    { title: "EBITDA %", value: data.kpis.ebitda, unit: "%", change: data.kpis.ebitda - data.kpis.prevEbitda, trend: "pp", icon: TrendingUp, color: "#16a34a" },
    { title: "Net Margin", value: data.kpis.netMargin, unit: "%", change: data.kpis.netMargin - data.kpis.prevNetMargin, trend: "pp", icon: Activity, color: "#db2777" },
    { title: "Cash Balance", value: formatVal(data.kpis.cashBalance), unit: "", change: ((data.kpis.cashBalance - data.kpis.prevCashBalance)/data.kpis.prevCashBalance)*100, trend: "%", icon: Wallet, color: "#059669" },
    { title: "Cash Runway", value: `${data.kpis.runway}m`, unit: "", change: data.kpis.runway - data.kpis.prevRunway, trend: "m", icon: Clock, color: "#ea580c" },
  ];

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
        <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400&family=Poppins:wght@400;500&display=swap');
        `}
      </style>
      <style>{`
        .grid-kpi { display: grid; grid-template-columns: repeat(1, 1fr); gap: 16px; margin-bottom: 24px; }
        .grid-2 { display: grid; grid-template-columns: 1fr; gap: 24px; margin-bottom: 24px; }
        .currency-select {
          appearance: none;
          background-color: white;
          border: 1px solid #cbd5e1;
          border-radius: 4px;
          padding: 4px 28px 4px 12px;
          font-size: 14px;
          font-weight: 500;
          font-family: Inter, sans-serif;
          cursor: pointer;
          outline: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23475569' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 8px center;
        }
        @media (min-width: 768px) { .grid-kpi { grid-template-columns: repeat(3, 1fr); } .grid-2 { grid-template-columns: repeat(2, 1fr); } }
        @media (min-width: 1200px) { .grid-kpi { grid-template-columns: repeat(6, 1fr); } }
      `}</style>

      {/* Header Strip */}
      <div style={{ 
        backgroundColor: '#eff6ff', 
        borderBottom: '1px solid #dbeafe', 
        padding: '12px 32px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#1e40af', fontWeight: 600 }}>
            <Calendar size={18} />
            <span style={{fontFamily: 'Inter, sans-serif'}}>FY 2024–25</span>
          </div>
          <div style={{ color: '#475569', fontSize: '14px', fontFamily: 'Inter, sans-serif' }}>As of: <span style={{ fontWeight: 600, color: '#0f172a' }}>Dec 2024</span></div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#475569', fontSize: '14px', fontFamily: 'Inter, sans-serif' }}>Currency:</span>
            <select 
              value={currency} 
              onChange={(e) => setCurrency(e.target.value)}
              className="currency-select"
            >
              {Object.keys(CURRENCY_CONFIG).map((key) => (
                <option key={key} value={key}>{key}</option>
              ))}
            </select>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#475569', fontSize: '14px', fontFamily: 'Inter, sans-serif' }}>Entity:</span>
            <span style={{ fontWeight: 600, color: '#0f172a', fontFamily: 'Inter, sans-serif' }}>CFOSync AI Pvt Ltd</span>
          </div>
        </div>
      </div>

      <div style={{ padding: '0 32px 32px 32px', maxWidth: '1800px', margin: '0 auto' }}>

        {/* AI Avatar Narrative Section */}
        <Card style={{ border: '1px solid #e9d5ff', background: 'linear-gradient(to right, #faf5ff, #ffffff)', marginBottom: '24px' }}>
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'row', gap: '24px', flexWrap: 'wrap' }}>
            
            {/* Avatar Video */}
            <div style={{ flexShrink: 0 }}>
              <div style={{ 
                position: 'relative', width: '200px', height: '140px', 
                borderRadius: '12px', overflow: 'hidden', backgroundColor: 'black',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' 
              }}>
                <video 
                  ref={videoRef}
                  src="https://cdn.pixabay.com/video/2023/10/22/186115-877653483_tiny.mp4" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover', filter: isSpeaking ? 'none' : 'grayscale(30%)' }}
                  loop 
                  muted 
                  playsInline
                />
                <div style={{ position: 'absolute', bottom: '8px', left: '8px', right: '8px', display: 'flex', justifyContent: 'center' }}>
                  <div style={{ 
                    background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', padding: '2px 10px', borderRadius: '20px', 
                    display: 'flex', alignItems: 'center', gap: '6px' 
                  }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: isSpeaking ? '#22c55e' : '#94a3b8' }}></div>
                    <span style={{ color: 'white', fontSize: '10px', fontWeight: 600, fontFamily: 'Inter, sans-serif' }}>{isSpeaking ? 'AI Speaking' : 'AI Idle'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Narrative Content */}
            <div style={{ flex: 1, minWidth: '300px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sparkles size={18} color="#9333ea" />
                  <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 500, color: '#581c87', fontFamily: 'Poppins, sans-serif' }}>AI Financial Analyst</h3>
                </div>
                <Button 
                  onClick={handlePlayBriefing} 
                  variant={isSpeaking ? "destructive" : "primary"}
                  style={{ minWidth: '130px', height: '36px' }}
                >
                  {isSpeaking ? <><Pause size={14} style={{ marginRight: '6px' }} /> Stop</> : <><Play size={14} style={{ marginRight: '6px' }} /> Play Briefing</>}
                </Button>
              </div>
              
              <div style={{ background: 'rgba(255,255,255,0.6)', padding: '16px', borderRadius: '8px', border: '1px solid #f3e8ff' }}>
                <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#334155', margin: 0, fontFamily: 'Inter, sans-serif' }}>
                  {generateNarrative()}
                </p>
              </div>
            </div>
          </div>
        </Card>
        
        {/* KPI Cards */}
        <div className="grid-kpi">
          {kpis.map((kpi, idx) => (
             <KPICard 
               key={idx}
               title={kpi.title} 
               value={kpi.unit + kpi.value} 
               unit=""
               change={kpi.change} 
               trend={kpi.trend} 
               icon={kpi.icon} 
               color={kpi.color} 
             />
          ))}
        </div>

        {/* --- 1. Revenue vs GM% Trend & 2. Net Cash Flow Analysis --- */}
        <div className="grid-2">
          
          {/* 1. Revenue vs GM Trend */}
          <Card style={{ padding: '24px' }}>
            <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: '15px', fontWeight: 500, margin: 0, fontFamily: 'Poppins, sans-serif' }}>Revenue & Margin Trend</h3>
                <p style={{ fontSize: '13px', color: '#64748b', margin: '4px 0 0 0', fontFamily: 'Inter, sans-serif' }}>6-month revenue performance vs GM%</p>
              </div>
            </div>
            <div style={{ height: '320px', width: '100%' }}>
              <ResponsiveContainer>
                <ComposedChart data={chartData.revenue} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontFamily: 'Inter, sans-serif' }} />
                  <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontFamily: 'Inter, sans-serif' }} 
                    tickFormatter={(val) => `${getCurrencyConfig().symbol}${val}${getCurrencyConfig().suffix}`} 
                  />
                  <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontFamily: 'Inter, sans-serif' }} tickFormatter={(val) => `${val}%`} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', fontFamily: 'Inter, sans-serif' }} 
                    formatter={(value: any, name: string) => {
                      if (name === "Revenue") return [`${getCurrencyConfig().symbol}${value}${getCurrencyConfig().suffix}`, name];
                      return [`${value}%`, name];
                    }}
                  />
                  <Legend wrapperStyle={{ fontFamily: 'Inter, sans-serif', fontSize: '12px' }} />
                  <Bar yAxisId="left" dataKey="revenue" name="Revenue" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={32} />
                  <Line yAxisId="right" type="monotone" dataKey="gm" name="Gross Margin %" stroke="#f97316" strokeWidth={3} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* 2. Net Cash Flow Analysis */}
          <Card style={{ padding: '24px' }}>
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 500, margin: 0, fontFamily: 'Poppins, sans-serif' }}>Net Cash Flow Analysis</h3>
              <p style={{ fontSize: '13px', color: '#64748b', margin: '4px 0 0 0', fontFamily: 'Inter, sans-serif' }}>6-month cash flow breakdown</p>
            </div>
            <div style={{ height: '320px', width: '100%' }}>
              <ResponsiveContainer>
                <ComposedChart data={chartData.cashFlow} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontFamily: 'Inter, sans-serif' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontFamily: 'Inter, sans-serif' }} 
                    tickFormatter={(val) => `${getCurrencyConfig().symbol}${val}${getCurrencyConfig().suffix}`}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', fontFamily: 'Inter, sans-serif' }}
                    formatter={(value: any) => `${getCurrencyConfig().symbol}${value}${getCurrencyConfig().suffix}`}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontFamily: 'Inter, sans-serif', fontSize: '12px' }} />
                  {/* Stacked Bars */}
                  <Bar dataKey="operating" stackId="a" name="Operating" fill="#10b981" barSize={32} />
                  <Bar dataKey="financing" stackId="a" name="Financing" fill="#3b82f6" barSize={32} />
                  <Bar dataKey="investing" stackId="a" name="Investing" fill="#f59e0b" barSize={32} />
                  {/* Net Line */}
                  <Line type="monotone" dataKey="net" name="Net CF" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: 'white' }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* --- 3. Exceptions & Alerts & 4. Revenue by Geography --- */}
        <div className="grid-2">
           {/* 3. Exceptions & Alerts */}
           <Card style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                <div>
                  <h3 style={{ fontSize: '15px', fontWeight: 500, margin: 0, fontFamily: 'Poppins, sans-serif' }}>Exceptions & Alerts</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <p style={{ fontSize: '13px', color: '#64748b', margin: '4px 0 0 0', fontFamily: 'Inter, sans-serif' }}>Action items requiring attention</p>
                    {!showAllExceptions && (
                      <span style={{ fontSize: '11px', backgroundColor: '#e2e8f0', color: '#64748b', padding: '2px 6px', borderRadius: '10px', marginTop: '4px' }}>
                        Showing 2 of {data.exceptions.length}
                      </span>
                    )}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                   <div style={{ fontSize: '12px', color: '#64748b', fontFamily: 'Inter, sans-serif' }}>Total Impact</div>
                   <div style={{ fontSize: '16px', fontWeight: 600, color: '#dc2626', fontFamily: 'Inter, sans-serif' }}>{formatVal(totalExceptionImpact)}</div>
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
                {displayedExceptions.map((ex, idx) => (
                  <div key={idx} style={{ 
                    border: '1px solid #e2e8f0', 
                    borderLeft: `4px solid ${ex.severity === 'high' ? '#ef4444' : ex.severity === 'medium' ? '#f59e0b' : '#3b82f6'}`,
                    borderRadius: '6px', 
                    padding: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: '#fff'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ 
                        padding: '8px', borderRadius: '6px', 
                        backgroundColor: ex.severity === 'high' ? '#fee2e2' : '#fef3c7' 
                      }}>
                        <AlertTriangle size={18} color={ex.severity === 'high' ? '#dc2626' : '#d97706'} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 500, fontSize: '14px', color: '#0f172a', fontFamily: 'Inter, sans-serif' }}>{ex.type}</div>
                        <div style={{ fontSize: '12px', color: '#64748b', fontFamily: 'Inter, sans-serif' }}>{ex.id} • {ex.entity}</div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 600, fontSize: '14px', fontFamily: 'Inter, sans-serif' }}>{formatVal(ex.amount)}</div>
                      <div style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 600, color: '#94a3b8', fontFamily: 'Inter, sans-serif' }}>{ex.severity}</div>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" style={{ width: '100%', marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px' }} onClick={toggleExceptions}>
                {showAllExceptions ? (
                  <>Show Less <ChevronUp size={14}/></>
                ) : (
                  <>View All Exceptions <ChevronDown size={14}/></>
                )}
              </Button>
           </Card>

           {/* 4. Global Revenue Mix (Revenue by Geography) */}
           <Card style={{ padding: '24px' }}>
              <div style={{ marginBottom: '20px' }}>
                 <h3 style={{ fontSize: '15px', fontWeight: 500, margin: 0, fontFamily: 'Poppins, sans-serif' }}>Revenue by Geography</h3>
                 <p style={{ fontSize: '13px', color: '#64748b', margin: '4px 0 0 0', fontFamily: 'Inter, sans-serif' }}>Location-wise revenue distribution</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                 <div style={{ width: '50%', height: '250px', position: 'relative' }}>
                    <ResponsiveContainer>
                      <PieChart>
                        <Pie 
                          data={data.geographyData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} 
                          paddingAngle={5} dataKey="value" stroke="none"
                        >
                          {data.geographyData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                    {/* Center Text */}
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                       <div style={{ fontSize: '24px', fontWeight: 600, color: '#0f172a', fontFamily: 'Inter, sans-serif' }}>100%</div>
                       <div style={{ fontSize: '12px', color: '#64748b', fontFamily: 'Inter, sans-serif' }}>Total</div>
                    </div>
                 </div>
                 
                 <div style={{ width: '50%', paddingLeft: '24px' }}>
                    {data.geographyData.map((geo, idx) => (
                      <div key={idx} style={{ marginBottom: '12px' }}>
                         <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '4px', fontFamily: 'Inter, sans-serif' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                               <MapPin size={12} color={geo.color} />
                               <span style={{ color: '#334155' }}>{geo.region}</span>
                            </div>
                            <span style={{ fontWeight: 600, color: '#0f172a' }}>{geo.value}%</span>
                         </div>
                         {/* Simple Progress Bar */}
                         <div style={{ height: '6px', width: '100%', backgroundColor: '#f1f5f9', borderRadius: '3px', overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${geo.value}%`, backgroundColor: geo.color, borderRadius: '3px' }}></div>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
           </Card>
        </div>

        {/* --- 5. Top 5 Customers & 6. Working Capital Health --- */}
        <div className="grid-2">
          
          {/* 5. Top 5 Customers */}
          <Card style={{ padding: '24px' }}>
             <div style={{ marginBottom: '20px' }}>
               <h3 style={{ fontSize: '15px', fontWeight: 500, margin: 0, fontFamily: 'Poppins, sans-serif' }}>Top 5 Customers</h3>
               <p style={{ fontSize: '13px', color: '#64748b', margin: '4px 0 0 0', fontFamily: 'Inter, sans-serif' }}>Revenue contribution and trends</p>
             </div>
             <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
               {data.topCustomers.map((customer, idx) => (
                 <div key={idx} style={{ 
                   display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
                   padding: '12px', border: '1px solid #f1f5f9', borderRadius: '8px', backgroundColor: '#fff' 
                 }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                     <div style={{ 
                       width: '28px', height: '28px', borderRadius: '6px', 
                       backgroundColor: idx === 0 ? '#eff6ff' : '#f8fafc', color: idx === 0 ? '#2563eb' : '#64748b',
                       display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: '12px', fontFamily: 'Inter, sans-serif'
                     }}>
                       #{customer.rank}
                     </div>
                     <div>
                       <div style={{ fontWeight: 500, fontSize: '14px', color: '#0f172a', fontFamily: 'Inter, sans-serif' }}>{customer.name}</div>
                       <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#64748b', marginTop: '4px', fontFamily: 'Inter, sans-serif' }}>
                         <span>3M Trend:</span>
                         <Sparkline data={customer.trend} color={customer.growth > 0 ? '#10b981' : '#ef4444'} />
                         <span style={{ marginLeft: '8px' }}>Margin: {customer.margin}%</span>
                       </div>
                     </div>
                   </div>
                   <div style={{ textAlign: 'right' }}>
                     <div style={{ fontWeight: 600, fontSize: '14px', fontFamily: 'Inter, sans-serif' }}>{formatVal(customer.revenue)}</div>
                     <div style={{ fontSize: '12px', color: customer.growth > 0 ? '#16a34a' : '#ef4444', fontFamily: 'Inter, sans-serif' }}>
                       {customer.growth > 0 ? '+' : ''}{customer.growth}%
                     </div>
                     <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px', fontFamily: 'Inter, sans-serif' }}>DSO: {customer.dso} days</div>
                   </div>
                 </div>
               ))}
             </div>
          </Card>

          {/* 6. Working Capital Health */}
          <Card style={{ padding: '24px' }}>
            <div style={{ marginBottom: '20px' }}>
               <h3 style={{ fontSize: '15px', fontWeight: 500, margin: 0, fontFamily: 'Poppins, sans-serif' }}>Working Capital Health</h3>
               <p style={{ fontSize: '13px', color: '#64748b', margin: '4px 0 0 0', fontFamily: 'Inter, sans-serif' }}>Cash conversion cycle components</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {data.workingCapitalData.map((item, idx) => (
                <div key={idx}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontWeight: 600, fontSize: '16px', color: '#0f172a', fontFamily: 'Inter, sans-serif' }}>{item.metric}</span>
                      <Info size={14} color="#94a3b8" style={{ cursor: 'pointer' }} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '16px', fontWeight: 600, fontFamily: 'Inter, sans-serif' }}>{item.value} days</span>
                      <span style={{ fontSize: '12px', color: '#64748b', fontFamily: 'Inter, sans-serif' }}>(Target: {item.target})</span>
                      {item.status === 'good' ? (
                        <div style={{ padding: '4px', borderRadius: '50%', background: '#dcfce7', border: '1px solid #86efac' }}>
                           <CheckCircle size={14} color="#16a34a" /> 
                        </div>
                      ) : (
                        <div style={{ padding: '4px', borderRadius: '50%', background: '#fef3c7', border: '1px solid #fcd34d' }}>
                           <AlertTriangle size={14} color="#d97706" />
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Trend line and Change */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                     <Sparkline data={item.trend} color={item.status === 'good' ? '#10b981' : '#f59e0b'} />
                     <div style={{ fontSize: '12px', color: item.change < 0 ? '#16a34a' : '#ef4444', display: 'flex', alignItems: 'center', gap: '2px', fontFamily: 'Inter, sans-serif' }}>
                       {item.change < 0 ? <TrendingUp size={12} style={{transform: 'scaleY(-1)'}} /> : <TrendingUp size={12} />}
                       {Math.abs(item.change)} days
                     </div>
                  </div>
                  {idx !== data.workingCapitalData.length - 1 && <div style={{ height: '1px', backgroundColor: '#f1f5f9', marginTop: '16px' }} />}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}