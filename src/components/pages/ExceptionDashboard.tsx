import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  Search,
  Bell,
  RefreshCw,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  ChevronRight,
  Lightbulb,
  ArrowUpRight,
  MessageSquare,
  UserCheck,
  X,
  LucideIcon,
  User
} from 'lucide-react';
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

// --- TYPES & INTERFACES ---

interface ExceptionData {
  id: string;
  ruleId: string;
  ruleName: string;
  type: string;
  description: string;
  module: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  impact: number;
  impactType: string;
  assignedTo: string;
  role: string;
  status: string;
  age: number;
  sla: number;
  urgency: number;
  [key: string]: any;
}

interface TrendData {
  month: string;
  newExceptions: number;
  resolved: number;
  open: number;
  predicted: number;
  [key: string]: any;
}

interface CategoryData {
  name: string;
  value: number;
  color: string;
  [key: string]: any;
}

// --- DATA CONSTANTS ---

const TREND_DATA: TrendData[] = [
  { month: 'Aug', newExceptions: 22, resolved: 18, open: 4, predicted: 0 },
  { month: 'Sep', newExceptions: 26, resolved: 21, open: 5, predicted: 0 },
  { month: 'Oct', newExceptions: 24, resolved: 20, open: 4, predicted: 0 },
  { month: 'Nov', newExceptions: 31, resolved: 25, open: 6, predicted: 0 },
  { month: 'Dec', newExceptions: 28, resolved: 19, open: 9, predicted: 0 },
  { month: 'Jan', newExceptions: 0, resolved: 0, open: 0, predicted: 29 },
  { month: 'Feb', newExceptions: 0, resolved: 0, open: 0, predicted: 32 },
];

const CATEGORY_DATA: CategoryData[] = [
  { name: 'Transaction Anomaly', value: 8, color: '#dc2626' },
  { name: 'Control Breach', value: 4, color: '#f97316' },
  { name: 'Master Data Error', value: 5, color: '#eab308' },
  { name: 'Compliance Issue', value: 4, color: '#10b981' },
];

const EXCEPTIONS_DATA: ExceptionData[] = [
  {
    id: 'EX-2025-001',
    ruleId: 'TX-002',
    ruleName: 'Duplicate Invoice Detection',
    type: 'Transaction Anomaly',
    description: 'Duplicate invoice detected for vendor Acme Corp',
    module: 'AP',
    severity: 'Critical',
    impact: 12.8,
    impactType: 'Direct',
    assignedTo: 'Priya Sharma',
    role: 'Finance Manager',
    status: 'In Progress',
    age: 3,
    sla: 1, 
    urgency: 92
  },
  {
    id: 'EX-2025-002',
    ruleId: 'CD-015',
    ruleName: 'Control Segregation',
    type: 'Control Breach',
    description: 'Same user created and approved PO #8845',
    module: 'Procurement',
    severity: 'High',
    impact: 2.8,
    impactType: 'Risk',
    assignedTo: 'Rahul Verma',
    role: 'Compliance Officer',
    status: 'Under Review',
    age: 2,
    sla: 3,
    urgency: 78
  },
  {
    id: 'EX-2025-007',
    ruleId: 'MD-012',
    ruleName: 'Bank Account Validation',
    type: 'Master Data Error',
    description: 'Invalid IFSC code in vendor master data',
    module: 'Vendor Master',
    severity: 'Medium',
    impact: 0.3,
    impactType: 'Potential Risk',
    assignedTo: 'Amit Patel',
    role: 'Data Admin',
    status: 'Open',
    age: 1,
    sla: 9,
    urgency: 28
  },
  {
    id: 'EX-2025-004',
    ruleId: 'TX-018',
    ruleName: 'Payment Terms Anomaly',
    type: 'Transaction Anomaly',
    description: 'Payment terms changed from 30 to 90 days without approval',
    module: 'AP',
    severity: 'High',
    impact: 5.2,
    impactType: 'Direct',
    assignedTo: 'Priya Sharma',
    role: 'Finance Manager',
    status: 'In Progress',
    age: 4,
    sla: 0,
    urgency: 85
  },
  {
    id: 'EX-2025-005',
    ruleId: 'CM-022',
    ruleName: 'TDS Rate Validation',
    type: 'Compliance Issue',
    description: 'Incorrect TDS rate applied on professional services invoice',
    module: 'Tax',
    severity: 'Critical',
    impact: 3.8,
    impactType: 'Direct',
    assignedTo: 'Rahul Verma',
    role: 'Compliance Officer',
    status: 'Escalated',
    age: 5,
    sla: -1,
    urgency: 95
  }
];

const PRIORITY_DATA = [
    {
        id: '1',
        severity: 'Critical',
        daysOpen: 5,
        title: 'Incorrect TDS rate applied on professional services invoice',
        module: 'Compliance Issue • Tax',
        assignedTo: 'Rahul Verma',
        impact: '3.8L',
        impactPerc: '12%',
        urgency: 95
    },
    {
        id: '2',
        severity: 'Critical',
        daysOpen: 3,
        title: 'Duplicate invoice detected for vendor Acme Corp',
        module: 'Transaction Anomaly • AP',
        assignedTo: 'Priya Sharma',
        impact: '12.8L',
        impactPerc: '42%',
        urgency: 92
    },
    {
        id: '3',
        severity: 'High',
        daysOpen: 4,
        title: 'Payment terms changed from 30 to 90 days without approval',
        module: 'Transaction Anomaly • AP',
        assignedTo: 'Priya Sharma',
        impact: '5.2L',
        impactPerc: '17%',
        urgency: 85
    }
];

const RESOLUTION_DATA = [
    {
        id: '1',
        type: 'Transaction Anomaly',
        title: 'Duplicate payment entry for Invoice #INV-4421',
        impact: '8.5L',
        resolvedBy: 'Priya Sharma',
        role: 'Finance Manager',
        time: '2.4 days',
        sla: '3 days',
        status: 'Within SLA'
    },
    {
        id: '2',
        type: 'Master Data Error',
        title: 'Missing PAN for high-value vendor',
        impact: '4.2L',
        resolvedBy: 'Amit Patel',
        role: 'Data Admin',
        time: '1.8 days',
        sla: '5 days',
        status: 'Within SLA'
    },
    {
        id: '3',
        type: 'Compliance Issue',
        title: 'Late filing of TDS return',
        impact: '2.8L',
        resolvedBy: 'Rahul Verma',
        role: 'Compliance Officer',
        time: '3.2 days',
        sla: '3 days',
        status: 'SLA Breach'
    },
    {
        id: '4',
        type: 'Control Breach',
        title: 'Unauthorized journal entry reversal',
        impact: '1.5L',
        resolvedBy: 'Priya Sharma',
        role: 'Finance Manager',
        time: '2.1 days',
        sla: '4 days',
        status: 'Within SLA'
    }
];

// --- STYLES ---

const colors = {
  bg: '#f3f4f6',
  white: '#ffffff',
  textMain: '#111827',
  textSec: '#6b7280',
  border: '#e5e7eb',
  primary: '#2563eb',
  critical: { text: '#dc2626', bg: '#fef2f2', border: '#fecaca', accent: '#dc2626' },
  high: { text: '#ea580c', bg: '#fff7ed', border: '#fed7aa', accent: '#ea580c' },
  medium: { text: '#ca8a04', bg: '#fefce8', border: '#fde047', accent: '#ca8a04' },
  low: { text: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0', accent: '#16a34a' },
};

type StylesType = {
    pageContainer: React.CSSProperties;
    topBar: React.CSSProperties;
    card: React.CSSProperties;
    cardHeader: React.CSSProperties;
    cardTitle: React.CSSProperties;
    filterBtn: (active: boolean) => React.CSSProperties;
    grid4: React.CSSProperties;
    kpiCard: (severity: 'critical' | 'high' | 'medium' | 'low') => React.CSSProperties;
    table: React.CSSProperties;
    th: React.CSSProperties;
    td: React.CSSProperties;
    badge: (bg: string, text: string, border: string) => React.CSSProperties;
    drawerOverlay: React.CSSProperties;
    drawer: React.CSSProperties;
    // New styles for the added sections
    sectionGrid: React.CSSProperties;
    priorityCard: (severity: string) => React.CSSProperties;
    resolutionCard: React.CSSProperties;
};

const styles: StylesType = {
  pageContainer: {
    padding: '24px',
    backgroundColor: colors.bg,
    color: colors.textMain,
    fontFamily: 'Inter, sans-serif',
    minHeight: '100%',
  },
  topBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    backgroundColor: colors.white,
    padding: '16px 24px',
    borderRadius: '8px',
    border: `1px solid ${colors.border}`,
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: '8px',
    border: `1px solid ${colors.border}`,
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
  },
  cardHeader: {
    padding: '16px 20px',
    borderBottom: `1px solid ${colors.border}`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: '15px',
    fontWeight: 500, // Poppins Medium
    fontFamily: 'Poppins, sans-serif',
    color: colors.textMain,
    margin: 0,
  },
  filterBtn: (active: boolean) => ({
    padding: '6px 12px',
    fontSize: '13px',
    borderRadius: '6px',
    border: `1px solid ${active ? colors.textMain : colors.border}`,
    backgroundColor: active ? colors.textMain : colors.white,
    color: active ? colors.white : colors.textMain,
    cursor: 'pointer',
    marginRight: '8px',
    transition: 'all 0.2s',
    fontFamily: 'Inter, sans-serif',
  }),
  grid4: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '20px',
    marginBottom: '24px',
  },
  kpiCard: (severity) => ({
    backgroundColor: colors.white,
    borderRadius: '8px',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
    padding: '20px',
    border: `1px solid ${colors.border}`,
    borderLeft: severity === 'critical' ? '4px solid #dc2626' : 
                severity === 'high' ? '4px solid #ea580c' : 
                severity === 'medium' ? '4px solid #ca8a04' : '4px solid #16a34a',
  }),
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '13px',
    fontFamily: 'Inter, sans-serif',
  },
  th: {
    textAlign: 'left',
    padding: '12px 16px',
    borderBottom: `1px solid ${colors.border}`,
    color: colors.textSec,
    fontWeight: 500, // Poppins Medium
    fontFamily: 'Poppins, sans-serif',
    fontSize: '11px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    backgroundColor: '#f9fafb',
  },
  td: {
    padding: '12px 16px',
    borderBottom: `1px solid ${colors.border}`,
    color: colors.textMain,
    verticalAlign: 'middle',
  },
  badge: (bg: string, text: string, border: string) => ({
    display: 'inline-flex',
    alignItems: 'center',
    padding: '2px 8px',
    borderRadius: '9999px',
    fontSize: '11px',
    fontWeight: 600,
    backgroundColor: bg,
    color: text,
    border: `1px solid ${border}`,
    fontFamily: 'Inter, sans-serif',
  }),
  drawerOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    zIndex: 50,
    display: 'flex',
    justifyContent: 'flex-end',
  },
  drawer: {
    width: '600px',
    backgroundColor: colors.white,
    height: '100%',
    boxShadow: '-4px 0 15px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column',
    animation: 'slideIn 0.3s ease-out',
  },
  sectionGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '24px',
    marginTop: '24px',
  },
  priorityCard: (severity: string) => ({
    backgroundColor: colors.white,
    borderRadius: '8px',
    padding: '16px',
    border: `1px solid ${colors.border}`,
    borderLeft: `4px solid ${severity === 'Critical' ? colors.critical.accent : colors.high.accent}`,
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    marginBottom: '16px'
  }),
  resolutionCard: {
    backgroundColor: '#f0fdf4', // light green bg as seen in screenshot
    borderRadius: '8px',
    padding: '16px',
    border: '1px solid #bbf7d0',
    marginBottom: '16px',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
  }
};

// --- COMPONENTS ---

interface KPIStatProps {
    title: string;
    count: number;
    impact: string;
    trend?: string;
    severity: 'critical' | 'high' | 'medium' | 'low';
    icon: LucideIcon;
}

const KPIStat: React.FC<KPIStatProps> = ({ title, count, impact, trend, severity, icon: Icon }) => {
  const textColors = {
    critical: '#dc2626',
    high: '#ea580c',
    medium: '#ca8a04',
    low: '#16a34a',
  };

  return (
    <div style={styles.kpiCard(severity)}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <span style={{ fontSize: '13px', fontWeight: 500, color: colors.textSec, fontFamily: 'Inter, sans-serif' }}>{title}</span>
        <Icon size={18} color={textColors[severity]} />
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
        <span style={{ fontSize: '28px', fontWeight: 700, color: textColors[severity], fontFamily: 'Inter, sans-serif' }}>{count}</span>
        {trend && (
            <span style={{ fontSize: '12px', color: textColors[severity], display: 'flex', alignItems: 'center', fontFamily: 'Inter, sans-serif' }}>
                <TrendingUp size={12} style={{marginRight: 4}}/> {trend}
            </span>
        )}
      </div>
      <div style={{ fontSize: '12px', color: colors.textSec, marginTop: '4px', fontFamily: 'Inter, sans-serif' }}>
        Impact: ₹{impact}L
      </div>
      <div style={{ fontSize: '11px', color: severity === 'critical' ? '#dc2626' : colors.textSec, marginTop: '4px', fontFamily: 'Inter, sans-serif' }}>
        {severity === 'critical' ? '1 open > 3 days' : severity === 'low' ? 'Within SLA limits' : '+2 from last month'}
      </div>
    </div>
  );
};

export default function ExceptionDashboard() {
  const [periodFilter, setPeriodFilter] = useState('This Month');
  const [severityFilter, setSeverityFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedException, setSelectedException] = useState<ExceptionData | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const styleId = 'drawer-animations';
    if (!document.getElementById(styleId)) {
      const styleSheet = document.createElement("style");
      styleSheet.id = styleId;
      styleSheet.innerText = `
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #f1f1f1; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `;
      document.head.appendChild(styleSheet);
    }
  }, []);

  // Derived Data
  const filteredExceptions = EXCEPTIONS_DATA.filter((ex: ExceptionData) => {
    const matchesSearch = ex.description.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          ex.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity = severityFilter === 'All' || ex.severity === severityFilter;
    return matchesSearch && matchesSeverity;
  });

  const handleRowClick = (ex: ExceptionData) => {
    setSelectedException(ex);
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setTimeout(() => setSelectedException(null), 300);
  };

  return (
    <div style={styles.pageContainer}>
        <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400&family=Poppins:wght@400;500&display=swap');
        `}
      </style>
        {/* HEADER / CONTEXT BAR */}
        <div style={styles.topBar}>
            <div style={{display:'flex', alignItems:'center', gap: '20px', fontSize: '13px', color: colors.textMain, fontFamily: 'Inter, sans-serif'}}>
                <div><strong>Entity:</strong> CFOsync AI Pvt Ltd</div>
                <div style={{height:'16px', width:'1px', background: colors.border}}></div>
                <div><strong>FY:</strong> 2024-25</div>
                <div style={{height:'16px', width:'1px', background: colors.border}}></div>
                <div><strong>Data as of:</strong> 24 Jan 2025</div>
                <div style={{height:'16px', width:'1px', background: colors.border}}></div>
                <div><strong>Source:</strong> ERP + AI Rules Engine</div>
            </div>
            <div style={{display:'flex', alignItems:'center', gap: '15px', fontSize: '12px', color: colors.textSec, fontFamily: 'Inter, sans-serif'}}>
                <div style={{display:'flex', alignItems:'center', gap:'5px'}}>
                    <RefreshCw size={12} /> Synced 9 mins ago
                </div>
                <div>Auto-refresh every 2 hours</div>
                <div style={{position:'relative'}}>
                    <Bell size={18} />
                    <span style={{position:'absolute', top:-2, right:-2, width:8, height:8, background:'red', borderRadius:'50%'}}></span>
                </div>
                <div style={{width: 32, height: 32, borderRadius:'50%', background: '#e0e7ff', display:'flex', alignItems:'center', justifyContent:'center', color:'#4338ca', fontWeight:'bold'}}>PS</div>
            </div>
        </div>

        {/* FILTERS */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginRight: '16px' }}>
            <Filter size={16} style={{ marginRight: '8px', color: colors.textSec }} />
            <span style={{ fontSize: '13px', fontWeight: 500, color: colors.textMain, fontFamily: 'Inter, sans-serif' }}>Quick Filters:</span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '12px', color: colors.textSec, fontFamily: 'Inter, sans-serif' }}>Period:</span>
            {['This Month', 'Quarter', 'YTD'].map(p => (
              <button 
                key={p} 
                style={styles.filterBtn(periodFilter === p)}
                onClick={() => setPeriodFilter(p)}
              >
                {p}
              </button>
            ))}
          </div>

          <div style={{height:'24px', width:'1px', background: colors.border}}></div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '12px', color: colors.textSec, fontFamily: 'Inter, sans-serif' }}>Severity:</span>
            {['Critical', 'High', 'Medium', 'Low'].map(s => (
                <button 
                    key={s} 
                    style={{
                        ...styles.filterBtn(severityFilter === s),
                        backgroundColor: severityFilter === s ? (s === 'Critical' ? '#dc2626' : s === 'High' ? '#ea580c' : s === 'Medium' ? '#ca8a04' : '#16a34a') : 'white',
                        borderColor: severityFilter === s ? 'transparent' : colors.border,
                        color: severityFilter === s ? 'white' : colors.textMain
                    }}
                    onClick={() => setSeverityFilter(severityFilter === s ? 'All' : s)}
                >
                    {s}
                </button>
            ))}
          </div>

           <div style={{height:'24px', width:'1px', background: colors.border}}></div>

           <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '12px', color: colors.textSec, fontFamily: 'Inter, sans-serif' }}>Owner:</span>
            <select style={{padding:'6px', borderRadius:'6px', border: `1px solid ${colors.border}`, fontSize:'13px', outline:'none', fontFamily: 'Inter, sans-serif'}}>
                <option>All</option>
                <option>Finance</option>
                <option>Tax</option>
            </select>
           </div>
        </div>

        {/* ALERT BANNER */}
        <div style={{ backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '12px 16px', marginBottom: '24px', display: 'flex', alignItems: 'center' }}>
            <AlertTriangle size={16} color="#2563eb" style={{marginRight:'10px'}}/>
            <span style={{fontSize:'13px', color:'#1e40af', fontFamily: 'Inter, sans-serif'}}>
                <strong>8 active exceptions detected</strong> (₹19.6L potential impact), <strong>91% under resolution</strong>.
            </span>
        </div>

        {/* KPI CARDS */}
        <div style={styles.grid4}>
          <KPIStat title="Critical Issues" count={2} impact="12.8" severity="critical" icon={XCircle} />
          <KPIStat title="High Issues" count={3} impact="5.2" trend="+2" severity="high" icon={AlertTriangle} />
          <KPIStat title="Medium Issues" count={2} impact="1.6" severity="medium" icon={Clock} />
          <KPIStat title="Low Issues" count={1} impact="0.3" severity="low" icon={CheckCircle} />
        </div>

        {/* IMPACT BAR */}
        <div style={{...styles.card, marginBottom: '24px', padding:'16px'}}>
             <div style={{display:'flex', justifyContent:'space-between', fontSize:'13px', marginBottom:'8px', fontFamily: 'Inter, sans-serif'}}>
                 <span style={{fontWeight:500}}>Cumulative Financial Impact by Severity</span>
                 <span style={{fontWeight:700}}>₹19.9L</span>
             </div>
             <div style={{width:'100%', height:'32px', display:'flex', borderRadius:'4px', overflow:'hidden'}}>
                 <div style={{width:'64%', background:'#dc2626', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontSize:'11px', fontWeight:600, fontFamily: 'Inter, sans-serif'}}>₹12.8L</div>
                 <div style={{width:'22%', background:'#ea580c', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontSize:'11px', fontWeight:600, fontFamily: 'Inter, sans-serif'}}>₹5.2L</div>
                 <div style={{width:'13%', background:'#eab308', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontSize:'11px', fontWeight:600, fontFamily: 'Inter, sans-serif'}}>₹1.6L</div>
                 <div style={{width:'1%', background:'#16a34a'}}></div>
             </div>
             <div style={{display:'flex', gap:'20px', marginTop:'8px', fontSize:'11px', color:colors.textSec, fontFamily: 'Inter, sans-serif'}}>
                 <span style={{display:'flex', alignItems:'center'}}><div style={{width:8, height:8, borderRadius:'50%', background:'#dc2626', marginRight:6}}></div> Critical 64%</span>
                 <span style={{display:'flex', alignItems:'center'}}><div style={{width:8, height:8, borderRadius:'50%', background:'#ea580c', marginRight:6}}></div> High 22%</span>
                 <span style={{display:'flex', alignItems:'center'}}><div style={{width:8, height:8, borderRadius:'50%', background:'#eab308', marginRight:6}}></div> Medium 13%</span>
                 <span style={{display:'flex', alignItems:'center'}}><div style={{width:8, height:8, borderRadius:'50%', background:'#16a34a', marginRight:6}}></div> Low 1%</span>
             </div>
        </div>

        {/* CHARTS ROW */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '24px', marginBottom: '24px' }}>
          {/* Trend Chart */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>
                <div>
                    <h3 style={styles.cardTitle}>Exception Trend Analysis</h3>
                    <p style={{fontSize:'12px', color:colors.textSec, margin:'4px 0 0 0', fontFamily: 'Inter, sans-serif'}}>New vs Resolved exceptions with AI forecast</p>
                </div>
            </div>
            <div style={{ padding: '20px', height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={TREND_DATA}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#6b7280', fontFamily: 'Inter, sans-serif'}} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#6b7280', fontFamily: 'Inter, sans-serif'}} />
                        <Tooltip 
                            contentStyle={{backgroundColor:'white', borderRadius:'8px', border:'1px solid #e5e7eb', boxShadow:'0 4px 6px rgba(0,0,0,0.1)', fontFamily: 'Inter, sans-serif'}}
                        />
                        <Legend iconType="circle" wrapperStyle={{fontSize:'12px', paddingTop:'10px', fontFamily: 'Inter, sans-serif'}}/>
                        <Bar dataKey="open" name="Net New Exceptions" fill="#f97316" barSize={20} radius={[4, 4, 0, 0]} />
                        <Line type="monotone" dataKey="resolved" name="Resolved" stroke="#10b981" strokeWidth={2} dot={{r: 3}} />
                        <Line type="monotone" dataKey="predicted" name="AI Forecast" stroke="#8b5cf6" strokeWidth={2} strokeDasharray="5 5" dot={{r: 3}} />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>
          </div>

          {/* Categories Chart */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>
                <div>
                    <h3 style={styles.cardTitle}>Exception Categories</h3>
                    <p style={{fontSize:'12px', color:colors.textSec, margin:'4px 0 0 0', fontFamily: 'Inter, sans-serif'}}>Rule Engine Source: AI + Custom Rules v2.3</p>
                </div>
            </div>
            <div style={{ padding: '20px', display:'flex', alignItems:'center' }}>
                <div style={{width: '50%', height: '260px'}}>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={CATEGORY_DATA}
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {CATEGORY_DATA.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div style={{width: '50%', paddingLeft:'20px'}}>
                    {CATEGORY_DATA.map(item => (
                        <div key={item.name} style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'12px', fontSize:'13px', fontFamily: 'Inter, sans-serif'}}>
                            <div style={{display:'flex', alignItems:'center'}}>
                                <div style={{width:8, height:8, borderRadius:'50%', background:item.color, marginRight:'8px'}}></div>
                                <span style={{color: colors.textMain}}>{item.name}</span>
                            </div>
                            <span style={{fontWeight:600, color: colors.textSec}}>{item.value} issues</span>
                        </div>
                    ))}
                </div>
            </div>
          </div>
        </div>

        {/* TABLE SECTION */}
        <div style={styles.card}>
            <div style={styles.cardHeader}>
                <div>
                    <h3 style={styles.cardTitle}>Exception Register</h3>
                    <p style={{fontSize:'12px', color:colors.textSec, margin:'4px 0 0 0', fontFamily: 'Inter, sans-serif'}}>Detailed view of all active exceptions</p>
                </div>
                <div style={{display:'flex', gap:'12px'}}>
                    <div style={{position:'relative'}}>
                        <Search size={16} style={{position:'absolute', left: 10, top: 10, color: colors.textSec}} />
                        <input 
                            type="text" 
                            placeholder="Search by Rule / Module..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{padding:'8px 8px 8px 36px', borderRadius:'6px', border: `1px solid ${colors.border}`, outline:'none', fontSize:'13px', width:'250px', fontFamily: 'Inter, sans-serif'}}
                        />
                    </div>
                </div>
            </div>
            <div style={{overflowX: 'auto'}}>
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={{...styles.th, width:'40px'}}><input type="checkbox" readOnly /></th>
                            <th style={styles.th}>ID</th>
                            <th style={styles.th}>Type</th>
                            <th style={styles.th}>Description</th>
                            <th style={styles.th}>Severity</th>
                            <th style={styles.th}>Impact</th>
                            <th style={styles.th}>Assigned To</th>
                            <th style={styles.th}>Status</th>
                            <th style={styles.th}>Age</th>
                            <th style={styles.th}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredExceptions.map((ex: ExceptionData) => (
                            <tr key={ex.id} style={{borderBottom: `1px solid ${colors.border}`, cursor:'pointer'}} onClick={() => handleRowClick(ex)}>
                                <td style={styles.td}><input type="checkbox" onClick={(e) => e.stopPropagation()} readOnly /></td>
                                <td style={{...styles.td, color: colors.primary, fontWeight:500}}>{ex.id}</td>
                                <td style={styles.td}>
                                    <span style={{fontSize:'13px'}}>{ex.type}</span>
                                </td>
                                <td style={{...styles.td, maxWidth:'300px'}}>
                                    <div style={{fontWeight:500, fontSize:'13px'}}>{ex.description}</div>
                                    <div style={{fontSize:'11px', color: colors.textSec, marginTop:'2px'}}>{ex.module}</div>
                                </td>
                                <td style={styles.td}>
                                    <span style={styles.badge(
                                        ex.severity === 'Critical' ? colors.critical.bg : ex.severity === 'High' ? colors.high.bg : ex.severity === 'Medium' ? colors.medium.bg : colors.low.bg,
                                        ex.severity === 'Critical' ? colors.critical.text : ex.severity === 'High' ? colors.high.text : ex.severity === 'Medium' ? colors.medium.text : colors.low.text,
                                        ex.severity === 'Critical' ? colors.critical.border : ex.severity === 'High' ? colors.high.border : ex.severity === 'Medium' ? colors.medium.border : colors.low.border
                                    )}>
                                        {ex.severity}
                                    </span>
                                </td>
                                <td style={styles.td}>
                                    <div style={{fontWeight:600}}>₹{ex.impact}L</div>
                                    <div style={{fontSize:'11px', color: colors.textSec}}>{ex.impactType}</div>
                                </td>
                                <td style={styles.td}>
                                    <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
                                        <div style={{width:24, height:24, borderRadius:'50%', background:'#e0f2fe', color:'#0369a1', fontSize:'10px', display:'flex', alignItems:'center', justifyContent:'center'}}>
                                            {ex.assignedTo.split(' ').map((n: string) => n[0]).join('')}
                                        </div>
                                        <div>
                                            <div style={{fontSize:'13px', fontWeight:500}}>{ex.assignedTo}</div>
                                            <div style={{fontSize:'11px', color: colors.textSec}}>{ex.role}</div>
                                        </div>
                                    </div>
                                </td>
                                <td style={styles.td}>
                                    <span style={{
                                        fontSize:'12px', 
                                        padding:'2px 8px', 
                                        borderRadius:'12px', 
                                        backgroundColor: ex.status === 'In Progress' ? '#dbeafe' : ex.status === 'Escalated' ? '#fee2e2' : '#f3f4f6',
                                        color: ex.status === 'In Progress' ? '#1e40af' : ex.status === 'Escalated' ? '#b91c1c' : '#374151'
                                    }}>
                                        {ex.status}
                                    </span>
                                </td>
                                <td style={styles.td}>
                                    <div style={{fontSize:'13px'}}>{ex.age} days</div>
                                    <div style={{fontSize:'11px', color: ex.sla < 0 ? '#dc2626' : ex.sla < 2 ? '#ea580c' : '#16a34a'}}>
                                        {ex.sla < 0 ? `${Math.abs(ex.sla)}d overdue` : `${ex.sla}d left`}
                                    </div>
                                </td>
                                <td style={styles.td}>
                                    <button style={{background:'none', border:'none', cursor:'pointer', color: colors.textSec}}>
                                        <ChevronRight size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredExceptions.length === 0 && (
                    <div style={{padding:'40px', textAlign:'center', color: colors.textSec}}>No exceptions found matching filters</div>
                )}
            </div>
        </div>

        {/* PRIORITY QUEUE & RECENT RESOLUTIONS */}
        <div style={styles.sectionGrid}>
            {/* Priority Queue */}
            <div style={styles.card}>
                <div style={styles.cardHeader}>
                    <div>
                        <h3 style={styles.cardTitle}>Priority Queue</h3>
                        <p style={{fontSize:'12px', color:colors.textSec, margin:'4px 0 0 0', fontFamily: 'Inter, sans-serif'}}>Top urgent items requiring immediate attention</p>
                    </div>
                </div>
                <div style={{padding: '20px'}}>
                    {PRIORITY_DATA.map(item => (
                        <div key={item.id} style={styles.priorityCard(item.severity)}>
                            <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'12px'}}>
                                <div style={{flex: 1, paddingRight: '12px'}}>
                                    <div style={{display:'flex', alignItems:'center', gap:'8px', marginBottom:'8px'}}>
                                        <span style={styles.badge(
                                            item.severity === 'Critical' ? colors.critical.bg : colors.high.bg,
                                            item.severity === 'Critical' ? colors.critical.text : colors.high.text,
                                            item.severity === 'Critical' ? colors.critical.border : colors.high.border
                                        )}>
                                            {item.severity}
                                        </span>
                                        <span style={{fontSize:'11px', color:colors.textSec, display:'flex', alignItems:'center', fontFamily: 'Inter, sans-serif'}}>
                                            <Clock size={12} style={{marginRight:4}}/> Open for {item.daysOpen} days
                                        </span>
                                    </div>
                                    <h4 style={{fontSize:'14px', fontWeight:600, color:colors.textMain, margin:'0 0 4px 0', fontFamily: 'Inter, sans-serif'}}>{item.title}</h4>
                                    <div style={{fontSize:'11px', color:colors.textSec, fontFamily: 'Inter, sans-serif'}}>{item.module}</div>
                                </div>
                                <div style={{textAlign:'right'}}>
                                    <div style={{fontSize:'14px', fontWeight:'bold', color:colors.textMain, fontFamily: 'Inter, sans-serif'}}>₹{item.impact}</div>
                                    <div style={{fontSize:'11px', color:colors.textSec, fontFamily: 'Inter, sans-serif'}}>{item.impactPerc} of total</div>
                                </div>
                            </div>

                            <div style={{display:'flex', alignItems:'center', gap:'8px', marginBottom:'12px'}}>
                                <div style={{width:20, height:20, borderRadius:'50%', backgroundColor:'#e0f2fe', color:'#0369a1', fontSize:'10px', display:'flex', alignItems:'center', justifyContent:'center'}}>
                                    {item.assignedTo.split(' ').map(n=>n[0]).join('')}
                                </div>
                                <span style={{fontSize:'12px', color:colors.textSec, fontFamily: 'Inter, sans-serif'}}>{item.assignedTo}</span>
                            </div>

                            <div style={{display:'flex', gap:'10px', marginBottom:'12px'}}>
                                <button style={{flex:1, padding:'6px', backgroundColor:'white', border:`1px solid ${colors.border}`, borderRadius:'6px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'12px', color:colors.textSec, cursor:'pointer', fontFamily: 'Inter, sans-serif'}}>
                                    <User size={12} style={{marginRight:6}}/> Reassign
                                </button>
                                <button style={{flex:1, padding:'6px', backgroundColor:'white', border:`1px solid ${colors.border}`, borderRadius:'6px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'12px', color:colors.textSec, cursor:'pointer', fontFamily: 'Inter, sans-serif'}}>
                                    <MessageSquare size={12} style={{marginRight:6}}/> Add Note
                                </button>
                            </div>

                            <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', fontSize:'11px', color:colors.textSec, fontFamily: 'Inter, sans-serif'}}>
                                <span>Urgency Score: <span style={{fontWeight:'bold', color:colors.textMain}}>{item.urgency}/100</span></span>
                            </div>
                            <div style={{width:'100%', height:'4px', backgroundColor:'#f3f4f6', borderRadius:'2px', marginTop:'4px'}}>
                                <div style={{width:`${item.urgency}%`, height:'100%', backgroundColor: item.urgency > 90 ? colors.critical.accent : colors.high.accent, borderRadius:'2px'}}></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Recent Resolutions */}
            <div style={styles.card}>
                <div style={styles.cardHeader}>
                    <div>
                        <h3 style={styles.cardTitle}>Recent Resolutions</h3>
                        <p style={{fontSize:'12px', color:colors.textSec, margin:'4px 0 0 0', fontFamily: 'Inter, sans-serif'}}>Successfully resolved exceptions</p>
                    </div>
                </div>
                <div style={{padding: '20px'}}>
                    {RESOLUTION_DATA.map(item => (
                        <div key={item.id} style={styles.resolutionCard}>
                            <div style={{display:'flex', alignItems:'flex-start', gap:'10px', marginBottom:'8px'}}>
                                <CheckCircle size={16} color="#16a34a" style={{marginTop:2}} />
                                <div>
                                    <div style={{fontSize:'12px', fontWeight:600, color:colors.textMain, marginBottom:'2px', fontFamily: 'Inter, sans-serif'}}>{item.type}</div>
                                    <div style={{fontSize:'13px', fontWeight:500, color:colors.textMain, marginBottom:'4px', fontFamily: 'Inter, sans-serif'}}>{item.title}</div>
                                    <div style={{fontSize:'11px', color:colors.textSec, fontFamily: 'Inter, sans-serif'}}>Impact: ₹{item.impact}</div>
                                </div>
                            </div>
                            
                            <div style={{paddingLeft:'26px'}}>
                                <div style={{display:'flex', alignItems:'center', gap:'8px', marginBottom:'6px'}}>
                                    <span style={{width:18, height:18, borderRadius:'50%', backgroundColor:'#dcfce7', color:'#15803d', fontSize:'9px', display:'flex', alignItems:'center', justifyContent:'center'}}>
                                        {item.resolvedBy.split(' ').map(n=>n[0]).join('')}
                                    </span>
                                    <div style={{fontSize:'11px', color:colors.textSec, fontFamily: 'Inter, sans-serif'}}>
                                        <span style={{color:colors.textMain}}>{item.resolvedBy}</span> • {item.role}
                                    </div>
                                </div>

                                <div style={{fontSize:'11px', color:colors.textSec, marginBottom:'8px', fontFamily: 'Inter, sans-serif'}}>
                                    Resolved in <span style={{fontWeight:600, color:colors.textMain}}>{item.time}</span> (vs SLA {item.sla}) 
                                    <span style={{color: item.status === 'Within SLA' ? '#16a34a' : '#dc2626', marginLeft:'4px', fontWeight:500}}>
                                        {item.status === 'Within SLA' ? '✓ Within SLA' : '⚠ SLA Breach'}
                                    </span>
                                </div>

                                <div style={{display:'flex', alignItems:'center', fontSize:'11px', color:'#2563eb', cursor:'pointer', fontFamily: 'Inter, sans-serif'}}>
                                    View Root Cause Analysis <ChevronRight size={10} style={{marginLeft:2}} />
                                </div>
                            </div>
                        </div>
                    ))}

                    <div style={{marginTop:'20px', padding:'12px', backgroundColor:'#f9fafb', borderRadius:'8px', border:`1px solid ${colors.border}`}}>
                        <div style={{display:'flex', justifyContent:'space-between', fontSize:'12px', marginBottom:'4px', fontFamily: 'Inter, sans-serif'}}>
                            <span style={{color:colors.textSec}}>Avg Resolution Time:</span>
                            <span style={{fontWeight:600, color:colors.textMain}}>2.4 days</span>
                        </div>
                        <div style={{display:'flex', justifyContent:'space-between', fontSize:'12px', fontFamily: 'Inter, sans-serif'}}>
                            <span style={{color:colors.textSec}}>SLA Compliance:</span>
                            <span style={{fontWeight:600, color:'#16a34a'}}>75%</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        {/* AI INSIGHT SECTION */}
        <div style={{...styles.card, marginTop:'24px', background:'linear-gradient(to right, #fdf4ff, #f0f9ff)', border:'1px solid #e9d5ff'}}>
            <div style={{padding:'20px'}}>
                <div style={{display:'flex', alignItems:'center', gap:'10px', marginBottom:'12px'}}>
                    <Lightbulb color="#9333ea" size={20} />
                    <h3 style={{fontSize:'16px', fontWeight:600, color:'#581c87', margin:0, fontFamily: 'Poppins, sans-serif'}}>AI-Driven Exception Intelligence (CFOsync Insight Layer)</h3>
                </div>
                
                <div style={{backgroundColor:'white', padding:'16px', borderRadius:'8px', border:'1px solid #e9d5ff', marginBottom:'16px'}}>
                    <h4 style={{margin:'0 0 8px 0', fontSize:'14px', color: colors.textMain, fontFamily: 'Inter, sans-serif'}}>Key Insight: Recurring Exception Pattern Detected</h4>
                    <p style={{fontSize:'13px', color: colors.textSec, lineHeight:'1.5', margin:0, fontFamily: 'Inter, sans-serif'}}>
                        <strong style={{color: colors.textMain}}>Duplicate invoice exception</strong> reoccurred 3 times this quarter, linked to manual upload process in AP module. 
                        Root cause analysis indicates missing pre-validation rule. The pattern shows <strong>62% probability</strong> of recurrence.
                    </p>
                    <div style={{marginTop:'12px', padding:'8px 12px', backgroundColor:'#fffbeb', borderLeft:'4px solid #f59e0b', fontSize:'13px', color:'#92400e', fontFamily: 'Inter, sans-serif'}}>
                        <strong>Recommendation:</strong> Implement auto-validation via OCR pre-check workflow.
                    </div>
                </div>

                <div style={{display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:'16px'}}>
                    <div style={{background:'white', padding:'12px', borderRadius:'6px', border:`1px solid ${colors.border}`}}>
                        <div style={{fontSize:'12px', color:colors.textSec, fontFamily: 'Inter, sans-serif'}}>Recurrence Probability</div>
                        <div style={{fontSize:'20px', fontWeight:'bold', color:'#9333ea', fontFamily: 'Inter, sans-serif'}}>62%</div>
                    </div>
                    <div style={{background:'white', padding:'12px', borderRadius:'6px', border:`1px solid ${colors.border}`}}>
                        <div style={{fontSize:'12px', color:colors.textSec, fontFamily: 'Inter, sans-serif'}}>Avg Resolution Time</div>
                        <div style={{fontSize:'20px', fontWeight:'bold', color:'#2563eb', fontFamily: 'Inter, sans-serif'}}>2.4 days</div>
                    </div>
                    <div style={{background:'white', padding:'12px', borderRadius:'6px', border:`1px solid ${colors.border}`}}>
                        <div style={{fontSize:'12px', color:colors.textSec, fontFamily: 'Inter, sans-serif'}}>Rule Accuracy</div>
                        <div style={{fontSize:'20px', fontWeight:'bold', color:'#16a34a', fontFamily: 'Inter, sans-serif'}}>94%</div>
                    </div>
                </div>
            </div>
        </div>

      {/* DRAWER */}
      {drawerOpen && selectedException && (
        <div style={styles.drawerOverlay} onClick={closeDrawer}>
            <div style={styles.drawer} onClick={(e) => e.stopPropagation()}>
                {/* Drawer Header */}
                <div style={{padding:'24px', borderBottom:`1px solid ${colors.border}`, display:'flex', justifyContent:'space-between', alignItems:'flex-start'}}>
                    <div>
                        <div style={{display:'flex', alignItems:'center', gap:'12px', marginBottom:'8px'}}>
                            <span style={styles.badge(
                                selectedException.severity === 'Critical' ? colors.critical.bg : colors.high.bg,
                                selectedException.severity === 'Critical' ? colors.critical.text : colors.high.text,
                                selectedException.severity === 'Critical' ? colors.critical.border : colors.high.border
                            )}>
                                {selectedException.severity}
                            </span>
                            <span style={{fontSize:'18px', fontWeight:'bold', color: colors.textMain, fontFamily: 'Inter, sans-serif'}}>{selectedException.id}</span>
                        </div>
                        <div style={{fontSize:'14px', color: colors.textSec, fontFamily: 'Inter, sans-serif'}}>{selectedException.type}</div>
                    </div>
                    <button onClick={closeDrawer} style={{background:'none', border:'none', cursor:'pointer', color:colors.textSec}}><X size={24}/></button>
                </div>

                {/* Drawer Body */}
                <div style={{padding:'24px', overflowY:'auto', flex:1}}>
                    <div style={{marginBottom:'24px'}}>
                        <h4 style={{fontSize:'12px', textTransform:'uppercase', color: colors.textSec, letterSpacing:'0.5px', marginBottom:'8px', fontFamily: 'Inter, sans-serif'}}>Description</h4>
                        <p style={{fontSize:'15px', color: colors.textMain, lineHeight:'1.5', fontFamily: 'Inter, sans-serif'}}>{selectedException.description}</p>
                    </div>

                    <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px', marginBottom:'24px'}}>
                        <div>
                            <h4 style={{fontSize:'12px', color: colors.textSec, marginBottom:'4px', fontFamily: 'Inter, sans-serif'}}>Module</h4>
                            <div style={{fontSize:'14px', fontWeight:500, fontFamily: 'Inter, sans-serif'}}>{selectedException.module}</div>
                        </div>
                        <div>
                            <h4 style={{fontSize:'12px', color: colors.textSec, marginBottom:'4px', fontFamily: 'Inter, sans-serif'}}>Impact</h4>
                            <div style={{fontSize:'14px', fontWeight:500, fontFamily: 'Inter, sans-serif'}}>₹{selectedException.impact}L ({selectedException.impactType})</div>
                        </div>
                    </div>

                    <div style={{backgroundColor:'#f8fafc', padding:'16px', borderRadius:'8px', marginBottom:'24px', border:`1px solid ${colors.border}`}}>
                        <div style={{marginBottom:'12px'}}>
                            <h4 style={{fontSize:'12px', color: colors.textSec, marginBottom:'4px', fontFamily: 'Inter, sans-serif'}}>Rule Details</h4>
                            <div style={{fontSize:'14px', fontFamily: 'Inter, sans-serif'}}><strong>ID:</strong> {selectedException.ruleId}</div>
                            <div style={{fontSize:'14px', fontFamily: 'Inter, sans-serif'}}><strong>Name:</strong> {selectedException.ruleName}</div>
                        </div>
                        <div style={{height:'1px', background:colors.border, width:'100%', marginBottom:'12px'}}></div>
                        <div>
                            <h4 style={{fontSize:'12px', color: colors.textSec, marginBottom:'8px', fontFamily: 'Inter, sans-serif'}}>Assignment</h4>
                            <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                                <div style={{width:32, height:32, borderRadius:'50%', background:'#e0f2fe', color:'#0369a1', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'12px'}}>
                                    {selectedException.assignedTo.split(' ').map((n: string) => n[0]).join('')}
                                </div>
                                <div>
                                    <div style={{fontSize:'14px', fontWeight:500, fontFamily: 'Inter, sans-serif'}}>{selectedException.assignedTo}</div>
                                    <div style={{fontSize:'12px', color:colors.textSec, fontFamily: 'Inter, sans-serif'}}>{selectedException.role}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h4 style={{fontSize:'12px', color: colors.textSec, marginBottom:'12px', fontFamily: 'Inter, sans-serif'}}>Status & SLA</h4>
                        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'12px'}}>
                            <span style={{fontSize:'14px', fontFamily: 'Inter, sans-serif'}}>Current Status</span>
                            <span style={styles.badge(
                                selectedException.status === 'In Progress' ? '#dbeafe' : '#fef2f2',
                                selectedException.status === 'In Progress' ? '#1e40af' : '#b91c1c',
                                'transparent'
                            )}>{selectedException.status}</span>
                        </div>
                        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                            <span style={{fontSize:'14px', fontFamily: 'Inter, sans-serif'}}>SLA Remaining</span>
                            <span style={{fontSize:'14px', fontWeight:600, color: selectedException.sla < 2 ? '#dc2626' : '#16a34a', fontFamily: 'Inter, sans-serif'}}>
                                {selectedException.sla} Days
                            </span>
                        </div>
                        <div style={{marginTop:'8px', width:'100%', height:'6px', background:'#e5e7eb', borderRadius:'3px', overflow:'hidden'}}>
                            <div style={{width: `${selectedException.urgency}%`, height:'100%', background: selectedException.urgency > 80 ? '#dc2626' : '#f59e0b'}}></div>
                        </div>
                        <div style={{textAlign:'right', fontSize:'11px', color: colors.textSec, marginTop:'4px', fontFamily: 'Inter, sans-serif'}}>Urgency Score: {selectedException.urgency}/100</div>
                    </div>
                </div>

                {/* Drawer Footer / Actions */}
                <div style={{padding:'20px', borderTop:`1px solid ${colors.border}`, backgroundColor:'#f9fafb'}}>
                    <button style={{width:'100%', padding:'10px', backgroundColor: colors.primary, color:'white', border:'none', borderRadius:'6px', fontWeight:500, cursor:'pointer', marginBottom:'12px', display:'flex', alignItems:'center', justifyContent:'center', gap:'8px', fontFamily: 'Inter, sans-serif'}} onClick={() => alert('Marked for review!')}>
                        <UserCheck size={16} /> Mark as Under Review
                    </button>
                    <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px'}}>
                        <button style={{padding:'10px', backgroundColor: 'white', color: colors.textMain, border:`1px solid ${colors.border}`, borderRadius:'6px', fontWeight:500, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:'8px', fontFamily: 'Inter, sans-serif'}} onClick={() => alert('Escalated!')}>
                            <ArrowUpRight size={16} /> Escalate to CFO
                        </button>
                        <button style={{padding:'10px', backgroundColor: 'white', color: colors.textMain, border:`1px solid ${colors.border}`, borderRadius:'6px', fontWeight:500, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:'8px', fontFamily: 'Inter, sans-serif'}} onClick={() => alert('Comment box opened!')}>
                            <MessageSquare size={16} /> Add Comment
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}