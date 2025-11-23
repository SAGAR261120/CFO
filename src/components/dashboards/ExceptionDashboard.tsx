import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '../ui/table';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { 
  AlertTriangle, XCircle, CheckCircle, Clock, TrendingUp, TrendingDown,
  Search, RefreshCw, UserCheck, Timer, Filter, Lightbulb, ChevronRight,
  ArrowUpRight, User, MessageSquare, BarChart3, PieChart as PieChartIcon,
  Settings
} from 'lucide-react';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, ComposedChart,
  Area
} from 'recharts';
import { Alert, AlertDescription } from '../ui/alert';
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import { Avatar, AvatarFallback } from '../ui/avatar';
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../ui/sheet';
import { Separator } from '../ui/separator';

// Exception Trend Data
const trendData = [
  { month: 'Aug', newExceptions: 22, resolved: 18, open: 4, predicted: 0 },
  { month: 'Sep', newExceptions: 26, resolved: 21, open: 5, predicted: 0 },
  { month: 'Oct', newExceptions: 24, resolved: 20, open: 4, predicted: 0 },
  { month: 'Nov', newExceptions: 31, resolved: 25, open: 6, predicted: 0 },
  { month: 'Dec', newExceptions: 28, resolved: 19, open: 9, predicted: 0 },
  { month: 'Jan', newExceptions: 0, resolved: 0, open: 0, predicted: 29 },
  { month: 'Feb', newExceptions: 0, resolved: 0, open: 0, predicted: 32 },
];

// Exception Categories Data
const categoriesData = [
  { 
    name: 'Transaction Anomaly', 
    value: 8, 
    impact: 8.5, 
    avgAge: 4, 
    responsible: 'Finance Team',
    trend: 3,
    color: '#dc2626' 
  },
  { 
    name: 'Control Breach', 
    value: 4, 
    impact: 3.6, 
    avgAge: 5, 
    responsible: 'Finance Team',
    trend: 0,
    color: '#f97316' 
  },
  { 
    name: 'Master Data Error', 
    value: 5, 
    impact: 6.8, 
    avgAge: 3, 
    responsible: 'IT Team',
    trend: -1,
    color: '#eab308' 
  },
  { 
    name: 'Compliance Issue', 
    value: 4, 
    impact: 6.3, 
    avgAge: 6, 
    responsible: 'Compliance Team',
    trend: 1,
    color: '#10b981' 
  },
];

// Exception Register Data
const exceptionsData = [
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
    assignedRole: 'Finance Manager',
    status: 'In Progress',
    age: 3,
    slaRemaining: 1,
    createdDate: '21 Jan 2025',
    urgencyScore: 92
  },
  {
    id: 'EX-2025-002',
    ruleId: 'CD-015',
    ruleName: 'Control Segregation Validation',
    type: 'Control Breach',
    description: 'Same user created and approved PO #8845',
    module: 'Procurement',
    severity: 'High',
    impact: 2.8,
    impactType: 'Risk Exposure',
    assignedTo: 'Rahul Verma',
    assignedRole: 'Compliance Officer',
    status: 'Under Review',
    age: 2,
    slaRemaining: 3,
    createdDate: '22 Jan 2025',
    urgencyScore: 78
  },
  {
    id: 'EX-2025-003',
    ruleId: 'MD-008',
    ruleName: 'GSTIN Validation Check',
    type: 'Master Data Error',
    description: 'Missing GSTIN for new vendor registration',
    module: 'Vendor Master',
    severity: 'Medium',
    impact: 1.5,
    impactType: 'Potential Risk',
    assignedTo: 'Amit Patel',
    assignedRole: 'Data Admin',
    status: 'Open',
    age: 1,
    slaRemaining: 6,
    createdDate: '23 Jan 2025',
    urgencyScore: 45
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
    assignedRole: 'Finance Manager',
    status: 'In Progress',
    age: 4,
    slaRemaining: 0,
    createdDate: '20 Jan 2025',
    urgencyScore: 85
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
    assignedRole: 'Compliance Officer',
    status: 'Escalated',
    age: 5,
    slaRemaining: -1,
    createdDate: '19 Jan 2025',
    urgencyScore: 95
  },
  {
    id: 'EX-2025-006',
    ruleId: 'TX-025',
    ruleName: 'Budget Threshold Alert',
    type: 'Transaction Anomaly',
    description: 'Marketing spend exceeded approved budget by 28%',
    module: 'GL',
    severity: 'Medium',
    impact: 2.4,
    impactType: 'Risk Exposure',
    assignedTo: 'Sneha Reddy',
    assignedRole: 'Budget Controller',
    status: 'Under Review',
    age: 2,
    slaRemaining: 4,
    createdDate: '22 Jan 2025',
    urgencyScore: 62
  },
  {
    id: 'EX-2025-007',
    ruleId: 'MD-012',
    ruleName: 'Bank Account Validation',
    type: 'Master Data Error',
    description: 'Invalid IFSC code in vendor master data',
    module: 'Vendor Master',
    severity: 'Low',
    impact: 0.3,
    impactType: 'Potential Risk',
    assignedTo: 'Amit Patel',
    assignedRole: 'Data Admin',
    status: 'Open',
    age: 1,
    slaRemaining: 9,
    createdDate: '23 Jan 2025',
    urgencyScore: 28
  },
  {
    id: 'EX-2025-008',
    ruleId: 'CD-009',
    ruleName: 'Approval Workflow Breach',
    type: 'Control Breach',
    description: 'Invoice approved without required second-level authorization',
    module: 'AP',
    severity: 'High',
    impact: 1.8,
    impactType: 'Risk Exposure',
    assignedTo: 'Priya Sharma',
    assignedRole: 'Finance Manager',
    status: 'In Progress',
    age: 3,
    slaRemaining: 2,
    createdDate: '21 Jan 2025',
    urgencyScore: 72
  },
];

// Recent Resolutions Data
const recentResolutions = [
  {
    id: 'EX-2025-R01',
    type: 'Transaction Anomaly',
    description: 'Duplicate payment entry for Invoice #INV-4421',
    impact: 8.5,
    resolvedBy: 'Priya Sharma',
    resolvedRole: 'Finance Manager',
    resolutionTime: 2.4,
    sla: 3,
    resolvedDate: '23 Jan 2025',
    rootCause: 'System allowed duplicate entry during concurrent sessions',
    action: 'Added unique constraint check before payment processing',
    prevention: 'Implemented real-time duplicate detection'
  },
  {
    id: 'EX-2025-R02',
    type: 'Master Data Error',
    description: 'Missing PAN for high-value vendor',
    impact: 4.2,
    resolvedBy: 'Amit Patel',
    resolvedRole: 'Data Admin',
    resolutionTime: 1.8,
    sla: 5,
    resolvedDate: '23 Jan 2025',
    rootCause: 'Validation rule inactive during bulk import',
    action: 'PAN collected and verified, vendor record updated',
    prevention: 'Mandatory PAN validation enabled for all imports'
  },
  {
    id: 'EX-2025-R03',
    type: 'Compliance Issue',
    description: 'Late filing of TDS return',
    impact: 2.8,
    resolvedBy: 'Rahul Verma',
    resolvedRole: 'Compliance Officer',
    resolutionTime: 3.2,
    sla: 3,
    resolvedDate: '22 Jan 2025',
    rootCause: 'Calendar reminder not set for filing deadline',
    action: 'Return filed with late fee payment',
    prevention: 'Automated alerts set for all compliance deadlines'
  },
  {
    id: 'EX-2025-R04',
    type: 'Control Breach',
    description: 'Unauthorized journal entry reversal',
    impact: 1.5,
    resolvedBy: 'Priya Sharma',
    resolvedRole: 'Finance Manager',
    resolutionTime: 2.1,
    sla: 4,
    resolvedDate: '22 Jan 2025',
    rootCause: 'Temporary elevated permissions not revoked',
    action: 'Permissions corrected, audit trail reviewed',
    prevention: 'Auto-expiry of temporary permissions implemented'
  },
];

export function ExceptionDashboard() {
  const [periodFilter, setPeriodFilter] = useState('this-month');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [ownerFilter, setOwnerFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExceptions, setSelectedExceptions] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false);
  const [selectedExceptionDetail, setSelectedExceptionDetail] = useState<any>(null);

  // Calculate metrics
  const totalExceptions = exceptionsData.length;
  const criticalCount = exceptionsData.filter(e => e.severity === 'Critical').length;
  const highCount = exceptionsData.filter(e => e.severity === 'High').length;
  const mediumCount = exceptionsData.filter(e => e.severity === 'Medium').length;
  const lowCount = exceptionsData.filter(e => e.severity === 'Low').length;
  
  const totalImpact = exceptionsData.reduce((sum, e) => sum + e.impact, 0);
  const resolvedCount = 78; // Mock data - would come from backend
  const underResolution = Math.round((resolvedCount / (totalExceptions + resolvedCount)) * 100);
  
  const criticalImpact = exceptionsData.filter(e => e.severity === 'Critical').reduce((sum, e) => sum + e.impact, 0);
  const highImpact = exceptionsData.filter(e => e.severity === 'High').reduce((sum, e) => sum + e.impact, 0);
  const mediumImpact = exceptionsData.filter(e => e.severity === 'Medium').reduce((sum, e) => sum + e.impact, 0);
  const lowImpact = exceptionsData.filter(e => e.severity === 'Low').reduce((sum, e) => sum + e.impact, 0);

  const avgResolutionTime = recentResolutions.reduce((sum, r) => sum + r.resolutionTime, 0) / recentResolutions.length;
  const slaCompliance = Math.round((recentResolutions.filter(r => r.resolutionTime <= r.sla).length / recentResolutions.length) * 100);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return '#dc2626';
      case 'High': return '#f97316';
      case 'Medium': return '#eab308';
      case 'Low': return '#10b981';
      default: return '#64748b';
    }
  };

  const getSeverityBgColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'bg-red-50 border-red-200 text-red-800';
      case 'High': return 'bg-orange-50 border-orange-200 text-orange-800';
      case 'Medium': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'Low': return 'bg-green-50 border-green-200 text-green-800';
      default: return 'bg-slate-50 border-slate-200 text-slate-800';
    }
  };

  const getStatusColor = (status: string, slaRemaining: number) => {
    if (status === 'Resolved') return 'bg-green-100 text-green-800 border-green-300';
    if (status === 'In Progress') {
      if (slaRemaining < 0) return 'bg-red-100 text-red-800 border-red-300';
      if (slaRemaining <= 1) return 'bg-orange-100 text-orange-800 border-orange-300';
      return 'bg-blue-100 text-blue-800 border-blue-300';
    }
    if (status === 'Escalated') return 'bg-red-100 text-red-800 border-red-300';
    return 'bg-amber-100 text-amber-800 border-amber-300';
  };

  const handleExceptionClick = (exception: any) => {
    setSelectedExceptionDetail(exception);
    setDetailDrawerOpen(true);
  };

  const CustomTrendTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-slate-200">
          <p className="font-semibold text-slate-900">{data.month} 2024</p>
          {data.newExceptions > 0 && (
            <>
              <p className="text-sm text-slate-700 mt-1">New Exceptions: {data.newExceptions}</p>
              <p className="text-sm text-slate-700">Resolved: {data.resolved}</p>
              <p className="text-sm text-slate-700">Open: {data.open}</p>
              <p className="text-sm text-blue-700">Trend: +{Math.round(((data.newExceptions - 24) / 24) * 100)}% MoM</p>
            </>
          )}
          {data.predicted > 0 && (
            <p className="text-sm text-purple-700 mt-1">AI Forecast: {data.predicted}</p>
          )}
        </div>
      );
    }
    return null;
  };

  const CustomCategoryTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-slate-200">
          <p className="font-semibold text-slate-900">{data.name}</p>
          <p className="text-sm text-slate-700 mt-1">Issues: {data.value}</p>
          <p className="text-sm text-slate-700">Impact: ₹{data.impact}L</p>
          <p className="text-sm text-slate-700">Avg Age: {data.avgAge} days</p>
          <p className="text-sm text-slate-700">Responsible: {data.responsible}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* Context Bar */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-6 text-sm">
            <span className="text-slate-700">
              <span className="font-semibold">Entity:</span> CFOsync AI Pvt Ltd
            </span>
            <Separator orientation="vertical" className="h-4" />
            <span className="text-slate-700">
              <span className="font-semibold">FY:</span> 2024–25
            </span>
            <Separator orientation="vertical" className="h-4" />
            <span className="text-slate-700">
              <span className="font-semibold">Data as of:</span> 24 Jan 2025
            </span>
            <Separator orientation="vertical" className="h-4" />
            <span className="text-slate-700">
              <span className="font-semibold">Source:</span> ERP + AI Rules Engine
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <RefreshCw className="h-3 w-3" />
              <span>Synced 9 minutes ago</span>
            </div>
            <Separator orientation="vertical" className="h-3" />
            <span>Auto-refresh every 2 hours</span>
          </div>
        </div>
      </div>

      {/* Quick Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-600" />
          <span className="text-sm font-medium text-slate-700">Quick Filters:</span>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-600">Period:</span>
          <div className="flex gap-1">
            <Button
              size="sm"
              variant={periodFilter === 'this-month' ? 'default' : 'outline'}
              onClick={() => setPeriodFilter('this-month')}
            >
              This Month
            </Button>
            <Button
              size="sm"
              variant={periodFilter === 'quarter' ? 'default' : 'outline'}
              onClick={() => setPeriodFilter('quarter')}
            >
              Quarter
            </Button>
            <Button
              size="sm"
              variant={periodFilter === 'ytd' ? 'default' : 'outline'}
              onClick={() => setPeriodFilter('ytd')}
            >
              YTD
            </Button>
          </div>
        </div>

        <Separator orientation="vertical" className="h-6" />

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-600">Severity:</span>
          <div className="flex gap-1">
            <Button
              size="sm"
              variant={severityFilter === 'critical' ? 'destructive' : 'outline'}
              onClick={() => setSeverityFilter(severityFilter === 'critical' ? 'all' : 'critical')}
            >
              Critical
            </Button>
            <Button
              size="sm"
              variant={severityFilter === 'high' ? 'default' : 'outline'}
              onClick={() => setSeverityFilter(severityFilter === 'high' ? 'all' : 'high')}
              className={severityFilter === 'high' ? 'bg-orange-500 hover:bg-orange-600' : ''}
            >
              High
            </Button>
            <Button
              size="sm"
              variant={severityFilter === 'medium' ? 'default' : 'outline'}
              onClick={() => setSeverityFilter(severityFilter === 'medium' ? 'all' : 'medium')}
              className={severityFilter === 'medium' ? 'bg-yellow-500 hover:bg-yellow-600' : ''}
            >
              Medium
            </Button>
            <Button
              size="sm"
              variant={severityFilter === 'low' ? 'default' : 'outline'}
              onClick={() => setSeverityFilter(severityFilter === 'low' ? 'all' : 'low')}
              className={severityFilter === 'low' ? 'bg-green-500 hover:bg-green-600' : ''}
            >
              Low
            </Button>
          </div>
        </div>

        <Separator orientation="vertical" className="h-6" />

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-600">Owner:</span>
          <Select value={ownerFilter} onValueChange={setOwnerFilter}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="finance">Finance</SelectItem>
              <SelectItem value="tax">Tax</SelectItem>
              <SelectItem value="compliance">Compliance</SelectItem>
              <SelectItem value="others">Others</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Status Summary */}
      <Alert className="bg-blue-50 border-blue-200">
        <AlertTriangle className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-sm text-slate-800 ml-2">
          <span className="font-semibold">{totalExceptions} active exceptions detected</span> (₹{totalImpact.toFixed(1)}L potential impact), 
          <span className="font-semibold"> {underResolution}% under resolution</span>.
        </AlertDescription>
      </Alert>

      {/* KPI Summary Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Critical Issues */}
        <Card className={`${criticalCount > 0 && exceptionsData.some(e => e.severity === 'Critical' && e.age > 3) ? 'animate-pulse border-red-500' : ''}`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Critical Issues</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-red-600">{criticalCount}</div>
            <p className="text-xs text-slate-600 mt-1">Impact: ₹{criticalImpact.toFixed(1)}L</p>
            <p className="text-xs text-red-600 mt-1">
              {exceptionsData.filter(e => e.severity === 'Critical' && e.age > 3).length} open &gt;3 days
            </p>
          </CardContent>
        </Card>

        {/* High Issues */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">High Issues</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="text-3xl font-semibold text-orange-600">{highCount}</div>
              <TrendingUp className="h-5 w-5 text-orange-500" />
            </div>
            <p className="text-xs text-slate-600 mt-1">Impact: ₹{highImpact.toFixed(1)}L</p>
            <p className="text-xs text-orange-600 mt-1">+2 from last month</p>
          </CardContent>
        </Card>

        {/* Medium Issues */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Medium Issues</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-yellow-600">{mediumCount}</div>
            <p className="text-xs text-slate-600 mt-1">Impact: ₹{mediumImpact.toFixed(1)}L</p>
            <p className="text-xs text-slate-600 mt-1">
              Avg Age: {Math.round(exceptionsData.filter(e => e.severity === 'Medium').reduce((sum, e) => sum + e.age, 0) / mediumCount)} days
            </p>
          </CardContent>
        </Card>

        {/* Low Issues */}
        <Card className={lowCount === 0 ? 'opacity-40' : ''}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Low Issues</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-green-600">{lowCount}</div>
            <p className="text-xs text-slate-600 mt-1">Impact: ₹{lowImpact.toFixed(1)}L</p>
            <p className="text-xs text-green-600 mt-1">Within SLA limits</p>
          </CardContent>
        </Card>
      </div>

      {/* Total Impact Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium text-slate-700">Cumulative Financial Impact by Severity</span>
              <span className="font-semibold text-slate-900">₹{totalImpact.toFixed(1)}L</span>
            </div>
            <div className="w-full h-8 bg-slate-100 rounded-lg overflow-hidden flex">
              <div 
                className="bg-red-500 flex items-center justify-center text-white text-xs font-medium"
                style={{ width: `${(criticalImpact / totalImpact) * 100}%` }}
              >
                {criticalImpact > 1 ? `₹${criticalImpact.toFixed(1)}L` : ''}
              </div>
              <div 
                className="bg-orange-500 flex items-center justify-center text-white text-xs font-medium"
                style={{ width: `${(highImpact / totalImpact) * 100}%` }}
              >
                {highImpact > 1 ? `₹${highImpact.toFixed(1)}L` : ''}
              </div>
              <div 
                className="bg-yellow-500 flex items-center justify-center text-white text-xs font-medium"
                style={{ width: `${(mediumImpact / totalImpact) * 100}%` }}
              >
                {mediumImpact > 1 ? `₹${mediumImpact.toFixed(1)}L` : ''}
              </div>
              <div 
                className="bg-green-500 flex items-center justify-center text-white text-xs font-medium"
                style={{ width: `${(lowImpact / totalImpact) * 100}%` }}
              >
                {lowImpact > 0.5 ? `₹${lowImpact.toFixed(1)}L` : ''}
              </div>
            </div>
            <div className="flex justify-between text-xs text-slate-600">
              <span>🔴 Critical: {((criticalImpact / totalImpact) * 100).toFixed(0)}%</span>
              <span>🟠 High: {((highImpact / totalImpact) * 100).toFixed(0)}%</span>
              <span>🟡 Medium: {((mediumImpact / totalImpact) * 100).toFixed(0)}%</span>
              <span>🟢 Low: {((lowImpact / totalImpact) * 100).toFixed(0)}%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Exception Trend & Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Exception Trend Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Exception Trend Analysis</CardTitle>
            <p className="text-sm text-slate-600">New vs Resolved exceptions with AI forecast</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={320}>
              <ComposedChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTrendTooltip />} />
                <Legend />
                <Bar dataKey="open" fill="#f97316" name="Net New Exceptions" />
                <Line 
                  type="monotone" 
                  dataKey="resolved" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  name="Resolved"
                  dot={{ r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="predicted" 
                  stroke="#8b5cf6" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="AI Forecast"
                  dot={{ r: 4 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Exception Categories */}
        <Card>
          <CardHeader>
            <CardTitle>Exception Categories</CardTitle>
            <p className="text-sm text-slate-600">Rule Engine Source: AI + Custom Rules v2.3</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={categoriesData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                  onClick={(data) => setSelectedCategory(data.name)}
                  cursor="pointer"
                >
                  {categoriesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomCategoryTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {categoriesData.map((category) => (
                <div 
                  key={category.name} 
                  className="flex items-center justify-between border-b border-slate-100 pb-2 cursor-pointer hover:bg-slate-50 px-2 rounded"
                  onClick={() => setSelectedCategory(category.name)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }}></div>
                    <span className="text-sm font-medium text-slate-900">{category.name}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-600">
                    <span>{category.value} issues</span>
                    {category.trend !== 0 && (
                      <span className={category.trend > 0 ? 'text-red-600' : 'text-green-600'}>
                        {category.trend > 0 ? '▲' : '▼'}{Math.abs(category.trend)}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {selectedCategory && (
              <div className="mt-3 p-2 bg-blue-50 rounded text-sm text-blue-900">
                Filtering by: <span className="font-semibold">{selectedCategory}</span>
                <button 
                  onClick={() => setSelectedCategory(null)}
                  className="ml-2 text-blue-600 hover:text-blue-800 underline"
                >
                  Clear
                </button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Exception Register Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Exception Register</CardTitle>
              <p className="text-sm text-slate-600 mt-1">Detailed view of all active exceptions</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search by Rule / Module / Person..."
                  className="pl-9 w-72"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              {selectedExceptions.length > 0 && (
                <Button size="sm" variant="outline">
                  Resolve Selected ({selectedExceptions.length})
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox 
                      checked={selectedExceptions.length === exceptionsData.length}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedExceptions(exceptionsData.map(e => e.id));
                        } else {
                          setSelectedExceptions([]);
                        }
                      }}
                    />
                  </TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Severity</TableHead>
                  <TableHead className="text-right">Impact</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Age</TableHead>
                  <TableHead className="text-right">SLA</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {exceptionsData
                  .filter(e => {
                    if (selectedCategory && e.type !== selectedCategory) return false;
                    if (severityFilter !== 'all' && e.severity.toLowerCase() !== severityFilter) return false;
                    if (searchQuery && !JSON.stringify(e).toLowerCase().includes(searchQuery.toLowerCase())) return false;
                    return true;
                  })
                  .sort((a, b) => b.urgencyScore - a.urgencyScore)
                  .map((exception) => (
                  <TableRow key={exception.id} className="hover:bg-slate-50">
                    <TableCell>
                      <Checkbox 
                        checked={selectedExceptions.includes(exception.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedExceptions([...selectedExceptions, exception.id]);
                          } else {
                            setSelectedExceptions(selectedExceptions.filter(id => id !== exception.id));
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <button 
                        onClick={() => handleExceptionClick(exception)}
                        className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                      >
                        {exception.id}
                      </button>
                    </TableCell>
                    <TableCell>
                      <TooltipProvider>
                        <UITooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center gap-2 cursor-help">
                              <span className="text-sm">{exception.type}</span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs">Rule #{exception.ruleId}: {exception.ruleName}</p>
                          </TooltipContent>
                        </UITooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <div className="text-sm text-slate-700">{exception.description}</div>
                      <Badge variant="outline" className="mt-1 text-xs">
                        {exception.module}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge 
                        className={`${getSeverityBgColor(exception.severity)} border`}
                      >
                        {exception.severity}
                      </Badge>
                      {exception.severity === 'Critical' && exception.age > 3 && (
                        <div className="text-xs text-red-600 mt-1">Escalated</div>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <TooltipProvider>
                        <UITooltip>
                          <TooltipTrigger asChild>
                            <div className="cursor-help">
                              <div className="font-semibold text-slate-900">₹{exception.impact}L</div>
                              <div className="text-xs text-slate-600">{exception.impactType}</div>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs">
                              {exception.impactType === 'Direct' ? 'Direct ₹ impact' : 'Potential risk exposure'}
                            </p>
                          </TooltipContent>
                        </UITooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs bg-blue-100 text-blue-700">
                            {exception.assignedTo.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="text-sm font-medium text-slate-900">{exception.assignedTo}</div>
                          <div className="text-xs text-slate-600">{exception.assignedRole}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge 
                        variant="outline"
                        className={getStatusColor(exception.status, exception.slaRemaining)}
                      >
                        {exception.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Timer className="h-3 w-3 text-slate-500" />
                        <span className="text-sm font-medium">{exception.age}d</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge 
                        variant="outline"
                        className={
                          exception.slaRemaining < 0 
                            ? 'border-red-500 text-red-700 bg-red-50'
                            : exception.slaRemaining <= 1
                            ? 'border-amber-500 text-amber-700 bg-amber-50'
                            : 'border-green-500 text-green-700 bg-green-50'
                        }
                      >
                        {exception.slaRemaining < 0 ? `${Math.abs(exception.slaRemaining)}d overdue` : `${exception.slaRemaining}d left`}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => handleExceptionClick(exception)}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Priority Queue & Recent Resolutions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Priority Queue */}
        <Card>
          <CardHeader>
            <CardTitle>Priority Queue</CardTitle>
            <p className="text-sm text-slate-600">Top urgent items requiring immediate attention</p>
          </CardHeader>
          <CardContent className="space-y-3">
            {exceptionsData
              .sort((a, b) => b.urgencyScore - a.urgencyScore)
              .slice(0, 4)
              .map((exception) => (
              <Card key={exception.id} className="shadow-md border-l-4" style={{ borderLeftColor: getSeverityColor(exception.severity) }}>
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className={getSeverityBgColor(exception.severity)} variant="outline">
                          {exception.severity}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          <Timer className="h-3 w-3 mr-1" />
                          Open for {exception.age} days
                        </Badge>
                      </div>
                      <h4 className="font-semibold text-slate-900">{exception.description}</h4>
                      <p className="text-xs text-slate-600 mt-1">{exception.type} • {exception.module}</p>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-slate-900">₹{exception.impact}L</div>
                      <div className="text-xs text-slate-600">
                        {((exception.impact / totalImpact) * 100).toFixed(0)}% of total
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs bg-blue-100 text-blue-700">
                        {exception.assignedTo.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-slate-700">{exception.assignedTo}</span>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" variant="outline" className="flex-1">
                      <UserCheck className="h-3 w-3 mr-1" />
                      Reassign
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <MessageSquare className="h-3 w-3 mr-1" />
                      Add Note
                    </Button>
                  </div>
                  <div className="mt-2 text-xs text-slate-600">
                    Urgency Score: <span className="font-semibold text-slate-900">{exception.urgencyScore}/100</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>

        {/* Recent Resolutions */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Resolutions</CardTitle>
            <p className="text-sm text-slate-600">Successfully resolved exceptions</p>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentResolutions.map((resolution) => (
              <Card key={resolution.id} className="shadow-sm bg-green-50 border-green-200">
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <Badge variant="outline" className="bg-white text-xs">
                          {resolution.type}
                        </Badge>
                      </div>
                      <h4 className="font-medium text-slate-900">{resolution.description}</h4>
                      <p className="text-xs text-slate-600 mt-1">Impact: ₹{resolution.impact}L</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs bg-green-100 text-green-700">
                        {resolution.resolvedBy.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-xs">
                      <span className="text-slate-700">{resolution.resolvedBy}</span>
                      <span className="text-slate-500"> • {resolution.resolvedRole}</span>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-slate-700">
                    Resolved in <span className="font-semibold text-green-700">{resolution.resolutionTime} days</span>
                    <span className="text-slate-500"> (vs SLA {resolution.sla} days)</span>
                    <span className={resolution.resolutionTime <= resolution.sla ? 'text-green-600 ml-1' : 'text-red-600 ml-1'}>
                      {resolution.resolutionTime <= resolution.sla ? '✓ Within SLA' : '✗ SLA Breach'}
                    </span>
                  </div>
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button size="sm" variant="link" className="p-0 h-auto mt-2 text-xs">
                        View Root Cause Analysis <ChevronRight className="h-3 w-3 ml-1" />
                      </Button>
                    </SheetTrigger>
                    <SheetContent className="w-[500px] overflow-y-auto">
                      <SheetHeader>
                        <SheetTitle>Resolution Details</SheetTitle>
                        <SheetDescription>{resolution.id}</SheetDescription>
                      </SheetHeader>
                      <div className="mt-6 space-y-4">
                        <div>
                          <h4 className="font-semibold text-sm text-slate-900 mb-1">Root Cause</h4>
                          <p className="text-sm text-slate-700">{resolution.rootCause}</p>
                        </div>
                        <Separator />
                        <div>
                          <h4 className="font-semibold text-sm text-slate-900 mb-1">Action Taken</h4>
                          <p className="text-sm text-slate-700">{resolution.action}</p>
                        </div>
                        <Separator />
                        <div>
                          <h4 className="font-semibold text-sm text-slate-900 mb-1">Prevention Measures</h4>
                          <p className="text-sm text-slate-700">{resolution.prevention}</p>
                        </div>
                      </div>
                    </SheetContent>
                  </Sheet>
                </CardContent>
              </Card>
            ))}
            <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex justify-between text-sm">
                <span className="text-slate-700">Avg Resolution Time:</span>
                <span className="font-semibold text-slate-900">{avgResolutionTime.toFixed(1)} days</span>
              </div>
              <div className="flex justify-between text-sm mt-2">
                <span className="text-slate-700">SLA Compliance:</span>
                <span className="font-semibold text-green-700">{slaCompliance}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights Section */}
      <Card className="border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-purple-600" />
            <CardTitle>AI-Driven Exception Intelligence (CFOsync Insight Layer)</CardTitle>
          </div>
          <p className="text-sm text-slate-600">Machine learning-powered insights and predictions</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-white p-4 rounded-lg border border-purple-200">
            <h4 className="font-semibold text-slate-900 mb-2">Key Insight: Recurring Exception Pattern Detected</h4>
            <p className="text-sm text-slate-700 leading-relaxed">
              <span className="font-semibold">Duplicate invoice exception</span> reoccurred 3 times this quarter, 
              linked to manual upload process in AP module. Root cause analysis indicates missing pre-validation rule 
              during bulk import operations. The pattern shows 62% probability of recurrence if corrective action is not taken.
            </p>
            <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded">
              <p className="text-sm text-slate-800">
                <span className="font-semibold">💡 Recommendation:</span> Implement auto-validation via OCR pre-check 
                workflow before invoice entry. Enable duplicate detection at upload stage rather than post-processing.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg border border-slate-200">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="h-4 w-4 text-purple-600" />
                <h5 className="font-semibold text-sm text-slate-900">Recurrence Probability</h5>
              </div>
              <div className="text-2xl font-semibold text-purple-700">62%</div>
              <p className="text-xs text-slate-600 mt-1">For Duplicate Invoice (Based on past 90 days)</p>
            </div>

            <div className="bg-white p-4 rounded-lg border border-slate-200">
              <div className="flex items-center gap-2 mb-2">
                <Timer className="h-4 w-4 text-blue-600" />
                <h5 className="font-semibold text-sm text-slate-900">Avg Resolution Time</h5>
              </div>
              <div className="text-2xl font-semibold text-blue-700">{avgResolutionTime.toFixed(1)} days</div>
              <p className="text-xs text-slate-600 mt-1">Across all resolved exceptions</p>
            </div>

            <div className="bg-white p-4 rounded-lg border border-slate-200">
              <div className="flex items-center gap-2 mb-2">
                <Settings className="h-4 w-4 text-green-600" />
                <h5 className="font-semibold text-sm text-slate-900">Rule Accuracy</h5>
              </div>
              <div className="text-2xl font-semibold text-green-700">94%</div>
              <p className="text-xs text-slate-600 mt-1">Valid exceptions / Total triggered</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <h5 className="font-semibold text-sm text-slate-900">Predicted Financial Exposure (Next 30 Days)</h5>
              <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-300">
                ML Regression Output
              </Badge>
            </div>
            <div className="text-3xl font-semibold text-slate-900">₹29.5L</div>
            <p className="text-xs text-slate-600 mt-1">
              Based on current exception velocity, historical patterns, and seasonal trends
            </p>
            <div className="mt-3 w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-purple-500 to-blue-500" style={{ width: '73%' }}></div>
            </div>
            <p className="text-xs text-slate-600 mt-1">73% confidence interval</p>
          </div>

          <Button variant="outline" className="w-full">
            <Settings className="h-4 w-4 mr-2" />
            Configure AI Rules Engine
          </Button>
        </CardContent>
      </Card>

      {/* Exception Detail Drawer */}
      <Sheet open={detailDrawerOpen} onOpenChange={setDetailDrawerOpen}>
        <SheetContent className="w-[600px] overflow-y-auto">
          {selectedExceptionDetail && (
            <>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <Badge className={getSeverityBgColor(selectedExceptionDetail.severity)}>
                    {selectedExceptionDetail.severity}
                  </Badge>
                  {selectedExceptionDetail.id}
                </SheetTitle>
                <SheetDescription>{selectedExceptionDetail.type}</SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-6">
                <div>
                  <h4 className="font-semibold text-sm text-slate-900 mb-2">Description</h4>
                  <p className="text-sm text-slate-700">{selectedExceptionDetail.description}</p>
                </div>
                
                <Separator />
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-sm text-slate-900 mb-1">Module</h4>
                    <Badge variant="outline">{selectedExceptionDetail.module}</Badge>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-slate-900 mb-1">Impact</h4>
                    <p className="text-sm text-slate-700">₹{selectedExceptionDetail.impact}L ({selectedExceptionDetail.impactType})</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-sm text-slate-900 mb-1">Created Date</h4>
                    <p className="text-sm text-slate-700">{selectedExceptionDetail.createdDate}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-slate-900 mb-1">Age</h4>
                    <p className="text-sm text-slate-700">{selectedExceptionDetail.age} days</p>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold text-sm text-slate-900 mb-2">Rule Details</h4>
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <p className="text-sm text-slate-700">
                      <span className="font-medium">Rule ID:</span> {selectedExceptionDetail.ruleId}
                    </p>
                    <p className="text-sm text-slate-700 mt-1">
                      <span className="font-medium">Rule Name:</span> {selectedExceptionDetail.ruleName}
                    </p>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold text-sm text-slate-900 mb-2">Assignment</h4>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback className="bg-blue-100 text-blue-700">
                        {selectedExceptionDetail.assignedTo.split(' ').map((n: string) => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-slate-900">{selectedExceptionDetail.assignedTo}</p>
                      <p className="text-sm text-slate-600">{selectedExceptionDetail.assignedRole}</p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold text-sm text-slate-900 mb-2">Status & SLA</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-700">Status:</span>
                      <Badge 
                        variant="outline"
                        className={getStatusColor(selectedExceptionDetail.status, selectedExceptionDetail.slaRemaining)}
                      >
                        {selectedExceptionDetail.status}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-700">SLA Remaining:</span>
                      <Badge 
                        variant="outline"
                        className={
                          selectedExceptionDetail.slaRemaining < 0 
                            ? 'border-red-500 text-red-700 bg-red-50'
                            : selectedExceptionDetail.slaRemaining <= 1
                            ? 'border-amber-500 text-amber-700 bg-amber-50'
                            : 'border-green-500 text-green-700 bg-green-50'
                        }
                      >
                        {selectedExceptionDetail.slaRemaining < 0 
                          ? `${Math.abs(selectedExceptionDetail.slaRemaining)}d overdue` 
                          : `${selectedExceptionDetail.slaRemaining}d left`}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-700">Urgency Score:</span>
                      <span className="font-semibold text-slate-900">{selectedExceptionDetail.urgencyScore}/100</span>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Button className="w-full">
                    <UserCheck className="h-4 w-4 mr-2" />
                    Mark as Under Review
                  </Button>
                  <Button variant="outline" className="w-full">
                    <ArrowUpRight className="h-4 w-4 mr-2" />
                    Escalate to CFO
                  </Button>
                  <Button variant="outline" className="w-full">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Add Comment
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
