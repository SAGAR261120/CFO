import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, AreaChart, Area, PieChart, 
  Pie, Cell, ComposedChart 
} from 'recharts';
import { 
  DollarSign, TrendingUp, Target, Award, Percent, Wallet, Clock,
  Info, ChevronDown, ChevronUp, AlertTriangle, TrendingDown,
  MapPin, Video, Sparkles, Calendar, Globe
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { 
  Tooltip as UITooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '../ui/tooltip';
import { Alert, AlertDescription } from '../ui/alert';
import { Avatar, AvatarFallback } from '../ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

// Currency configuration
const currencyConfig = {
  US: { symbol: '$', label: 'USD', locale: 'en-US' },
  UK: { symbol: '£', label: 'GBP', locale: 'en-GB' },
  Europe: { symbol: '€', label: 'EUR', locale: 'de-DE' },
  India: { symbol: '₹', label: 'INR', locale: 'en-IN' },
  Australia: { symbol: 'A$', label: 'AUD', locale: 'en-AU' },
  'New Zealand': { symbol: 'NZ$', label: 'NZD', locale: 'en-NZ' },
};

// Mock data
const revenueData = [
  { month: 'Jul', revenue: 156, gm: 68, ytd: 880 },
  { month: 'Aug', revenue: 168, gm: 70, ytd: 1048 },
  { month: 'Sep', revenue: 175, gm: 69, ytd: 1223 },
  { month: 'Oct', revenue: 182, gm: 71, ytd: 1405 },
  { month: 'Nov', revenue: 179, gm: 68, ytd: 1584 },
  { month: 'Dec', revenue: 195, gm: 72, ytd: 1779 },
];

const cashFlowData = [
  { month: 'Jul', operating: 45, investing: -12, financing: -8, net: 25 },
  { month: 'Aug', operating: 52, investing: -15, financing: 0, net: 37 },
  { month: 'Sep', operating: 48, investing: -10, financing: -5, net: 33 },
  { month: 'Oct', operating: 55, investing: -18, financing: 10, net: 47 },
  { month: 'Nov', operating: 50, investing: -8, financing: -12, net: 30 },
  { month: 'Dec', operating: 62, investing: -20, financing: 0, net: 42 },
];

const geographyData = [
  { region: 'India', value: 680, percentage: 38, color: '#3b82f6' },
  { region: 'North America', value: 534, percentage: 30, color: '#10b981' },
  { region: 'Europe', value: 356, percentage: 20, color: '#f59e0b' },
  { region: 'APAC', value: 178, percentage: 10, color: '#8b5cf6' },
  { region: 'Others', value: 31, percentage: 2, color: '#64748b' },
];

const topCustomers = [
  { 
    name: 'Acme Corporation', 
    revenue: 285, 
    growth: 18, 
    margin: 72, 
    dso: 42,
    trend: [75, 78, 82, 85, 88, 95] 
  },
  { 
    name: 'TechStart Industries', 
    revenue: 245, 
    growth: 25, 
    margin: 68, 
    dso: 38,
    trend: [65, 70, 72, 78, 82, 85] 
  },
  { 
    name: 'Global Enterprises', 
    revenue: 198, 
    growth: -5, 
    margin: 65, 
    dso: 55,
    trend: [85, 82, 80, 78, 75, 72] 
  },
  { 
    name: 'Innovation Labs', 
    revenue: 176, 
    growth: 32, 
    margin: 75, 
    dso: 35,
    trend: [45, 52, 58, 65, 72, 78] 
  },
  { 
    name: 'Enterprise Solutions', 
    revenue: 165, 
    growth: 12, 
    margin: 70, 
    dso: 48,
    trend: [62, 65, 68, 70, 72, 75] 
  },
];

const workingCapitalData = [
  { 
    metric: 'DSO', 
    value: 45, 
    target: 45, 
    status: 'good',
    trend: [48, 47, 46, 45, 45, 45],
    change: -3
  },
  { 
    metric: 'DIO', 
    value: 32, 
    target: 35, 
    status: 'good',
    trend: [35, 34, 33, 32, 32, 32],
    change: -3
  },
  { 
    metric: 'DPO', 
    value: 38, 
    target: 40, 
    status: 'warning',
    trend: [40, 39, 39, 38, 38, 38],
    change: -2
  },
  { 
    metric: 'CCC', 
    value: 39, 
    target: 40, 
    status: 'good',
    trend: [43, 42, 40, 39, 39, 39],
    change: -4
  },
];

const exceptions = [
  { id: 'EX-001', type: 'Payment Overdue', severity: 'high', impact: 12.5, module: 'AR' },
  { id: 'EX-002', type: 'Budget Variance', severity: 'medium', impact: 8.2, module: 'GL' },
  { id: 'EX-003', type: 'Control Breach', severity: 'high', impact: 5.8, module: 'AP' },
  { id: 'EX-004', type: 'Duplicate Entry', severity: 'low', impact: 2.1, module: 'GL' },
  { id: 'EX-005', type: 'Missing Approval', severity: 'high', impact: 15.2, module: 'Procurement' },
  { id: 'EX-006', type: 'Tax Compliance', severity: 'medium', impact: 6.5, module: 'Tax' },
  { id: 'EX-007', type: 'Master Data Error', severity: 'medium', impact: 4.8, module: 'Vendor Master' },
  { id: 'EX-008', type: 'Transaction Anomaly', severity: 'low', impact: 1.9, module: 'AP' },
  { id: 'EX-009', type: 'SLA Breach', severity: 'high', impact: 9.7, module: 'Operations' },
];

export function ExecutiveSummaryDashboard() {
  const [location, setLocation] = useState<keyof typeof currencyConfig>('India');
  const [narrativeExpanded, setNarrativeExpanded] = useState(false);
  const [geoView, setGeoView] = useState<'india' | 'world'>('india');
  
  const currency = currencyConfig[location];
  const lastUpdated = new Date().toLocaleString(currency.locale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  // Calculate KPIs
  const currentRevenue = 195; // Dec revenue
  const prevMonthRevenue = 179; // Nov revenue
  const momRevenueChange = ((currentRevenue - prevMonthRevenue) / prevMonthRevenue) * 100;
  const yoyRevenueChange = 22.5; // Mock YoY data
  
  const currentGM = 72;
  const prevGM = 68;
  const momGMChange = currentGM - prevGM;
  const yoyGMChange = 5.2;
  
  const ebitdaPercent = 42;
  const prevEbitda = 38;
  const momEbitdaChange = ebitdaPercent - prevEbitda;
  const yoyEbitdaChange = 6.8;
  
  const netMargin = 28;
  const prevNetMargin = 25;
  const momNetMarginChange = netMargin - prevNetMargin;
  const yoyNetMarginChange = 4.2;
  
  const cashBalance = 485;
  const prevCash = 455;
  const momCashChange = ((cashBalance - prevCash) / prevCash) * 100;
  const yoyCashChange = 18.5;
  
  const monthlyBurn = 42;
  const runway = cashBalance / monthlyBurn;
  const prevRunway = 10.8;
  const runwayChange = runway - prevRunway;

  const highSeverityCount = exceptions.filter(e => e.severity === 'high').length;
  const mediumSeverityCount = exceptions.filter(e => e.severity === 'medium').length;
  const lowSeverityCount = exceptions.filter(e => e.severity === 'low').length;

  const formatCurrency = (value: number, decimals: number = 0) => {
    if (location === 'India') {
      return `${currency.symbol}${value.toFixed(decimals)}L`;
    }
    return `${currency.symbol}${(value / 10).toFixed(decimals)}M`;
  };

  const CustomRevenueTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-slate-200">
          <p className="font-semibold text-slate-900">{payload[0].payload.month} 2024</p>
          <p className="text-sm text-blue-700">Revenue: {formatCurrency(payload[0].value, 1)}</p>
          <p className="text-sm text-purple-700">GM%: {payload[1].value}%</p>
        </div>
      );
    }
    return null;
  };

  const CustomGeoTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-slate-200">
          <p className="font-semibold text-slate-900">{payload[0].name}</p>
          <p className="text-sm text-slate-700">Revenue: {formatCurrency(payload[0].value, 1)}</p>
          <p className="text-sm text-slate-700">Share: {payload[0].payload.percentage}%</p>
        </div>
      );
    }
    return null;
  };

  const renderSparkline = (data: number[], color: string) => {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    
    const points = data.map((value, index) => {
      const x = (index / (data.length - 1)) * 60;
      const y = 20 - ((value - min) / range) * 15;
      return `${x},${y}`;
    }).join(' ');
    
    return (
      <svg width="60" height="20" className="inline-block">
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="1.5"
        />
      </svg>
    );
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* Context Bar */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-blue-600" />
              <span className="font-semibold text-slate-900">FY 2024–25</span>
            </div>
            <Separator orientation="vertical" className="h-4" />
            <span className="text-slate-700">
              <span className="font-semibold">As of:</span> Dec 2024
            </span>
            <Separator orientation="vertical" className="h-4" />
            <div className="flex items-center gap-2">
              <span className="text-slate-700 font-semibold">Currency:</span>
              <Select value={location} onValueChange={(value: any) => setLocation(value)}>
                <SelectTrigger className="w-32 h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(currencyConfig).map((loc) => (
                    <SelectItem key={loc} value={loc}>
                      {currencyConfig[loc as keyof typeof currencyConfig].label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="text-xs text-slate-600">
            <span className="font-semibold">Entity:</span> CFOsync AI Pvt Ltd
          </div>
        </div>
      </div>

      {/* AI Narration Section with Avatar */}
      <Card className="border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50 shadow-lg">
        <CardContent className="pt-6">
          <div className="flex gap-6">
            {/* Left: Avatar Video Box */}
            <div className="flex-shrink-0">
              <div className="relative w-48 h-48 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg p-4 flex flex-col items-center justify-center shadow-lg">
                <div className="relative mb-3">
                  <Avatar className="h-24 w-24 border-4 border-white shadow-xl">
                    <AvatarFallback className="bg-gradient-to-br from-purple-700 to-blue-700 text-white">
                      <Video className="h-12 w-12" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-2 shadow-lg">
                    <Sparkles className="h-4 w-4 text-white" />
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="text-white font-semibold text-sm">Financial AI</h3>
                  <p className="text-purple-100 text-xs mt-1">Assistant</p>
                </div>
                <div className="absolute bottom-2 left-0 right-0 text-center">
                  <div className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded-full px-2 py-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-white text-xs">Live</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Summary Content */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-lg">Financial AI Assistant</CardTitle>
                  <TooltipProvider>
                    <UITooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-purple-600 cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs max-w-xs">
                          This AI uses real financial data from your ERP system to generate 
                          intelligent summaries and insights on key business metrics.
                        </p>
                      </TooltipContent>
                    </UITooltip>
                  </TooltipProvider>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setNarrativeExpanded(!narrativeExpanded)}
                >
                  {narrativeExpanded ? (
                    <>
                      <ChevronUp className="h-4 w-4 mr-1" />
                      Collapse
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-4 w-4 mr-1" />
                      Expand
                    </>
                  )}
                </Button>
              </div>
              <p className="text-xs text-slate-600 mb-4 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Last Updated: {lastUpdated}
              </p>
              <div className={`space-y-3 text-sm ${!narrativeExpanded ? 'line-clamp-3' : ''}`}>
                <p className="text-slate-700 leading-relaxed">
                  <span className="font-semibold text-purple-900">📈 Strong Performance:</span> December 
                  revenue reached {formatCurrency(195, 1)}, up {momRevenueChange.toFixed(1)}% MoM, with gross 
                  margin improving to {currentGM}% (+{momGMChange}pp). YTD revenue stands at {formatCurrency(1779, 1)}, 
                  representing {yoyRevenueChange}% YoY growth.
                </p>
                {narrativeExpanded && (
                  <>
                    <p className="text-slate-700 leading-relaxed">
                      <span className="font-semibold text-purple-900">💰 Profitability Metrics:</span> EBITDA 
                      margin reached {ebitdaPercent}% (+{momEbitdaChange}pp MoM), while net margin improved to {netMargin}% 
                      (+{momNetMarginChange}pp). Cash generation remains strong with operating cash flow of {formatCurrency(62, 1)} in December.
                    </p>
                    <p className="text-slate-700 leading-relaxed">
                      <span className="font-semibold text-purple-900">🌍 Geographic Mix:</span> India continues 
                      to lead at 38% of revenue, followed by North America (30%) and Europe (20%). Top 5 customers 
                      contribute {formatCurrency(1069, 1)} ({((1069/1779)*100).toFixed(0)}% of total revenue).
                    </p>
                    <p className="text-slate-700 leading-relaxed">
                      <span className="font-semibold text-purple-900">⚠️ Areas of Focus:</span> Working capital 
                      efficiency is strong with CCC at 39 days. However, {highSeverityCount} high-severity exceptions 
                      require immediate attention, particularly in AR and AP modules.
                    </p>
                    <p className="text-slate-700 leading-relaxed">
                      <span className="font-semibold text-purple-900">🎯 Outlook:</span> With {runway.toFixed(1)} 
                      months runway and improving unit economics, the company is well-positioned for sustainable growth. 
                      Focus areas include resolving high-priority exceptions and maintaining margin expansion.
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Divider */}
      <Separator className="my-6" />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Revenue */}
        <Card className={`transition-all ${momRevenueChange > 0 ? 'border-2 border-green-300' : 'border-2 border-red-300'}`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Revenue</CardTitle>
            <DollarSign className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <TooltipProvider>
              <UITooltip>
                <TooltipTrigger asChild>
                  <div className="cursor-help">
                    <div className="text-2xl font-semibold text-slate-900">{formatCurrency(currentRevenue, 1)}</div>
                    <div className="flex items-center gap-1 mt-1">
                      {momRevenueChange > 0 ? (
                        <TrendingUp className="h-3 w-3 text-green-600" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-red-600" />
                      )}
                      <p className={`text-xs ${momRevenueChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {momRevenueChange > 0 ? '+' : ''}{momRevenueChange.toFixed(1)}% MoM
                      </p>
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">YoY: +{yoyRevenueChange}%</p>
                  <p className="text-xs">YTD: {formatCurrency(1779, 1)}</p>
                </TooltipContent>
              </UITooltip>
            </TooltipProvider>
          </CardContent>
        </Card>

        {/* GM% */}
        <Card className={`transition-all ${momGMChange > 0 ? 'border-2 border-green-300' : 'border-2 border-red-300'}`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Gross Margin</CardTitle>
            <Percent className="h-5 w-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <TooltipProvider>
              <UITooltip>
                <TooltipTrigger asChild>
                  <div className="cursor-help">
                    <div className="text-2xl font-semibold text-slate-900">{currentGM}%</div>
                    <div className="flex items-center gap-1 mt-1">
                      {momGMChange > 0 ? (
                        <TrendingUp className="h-3 w-3 text-green-600" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-red-600" />
                      )}
                      <p className={`text-xs ${momGMChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {momGMChange > 0 ? '+' : ''}{momGMChange}pp MoM
                      </p>
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">YoY: +{yoyGMChange}pp</p>
                  <p className="text-xs">Target: 70%</p>
                </TooltipContent>
              </UITooltip>
            </TooltipProvider>
          </CardContent>
        </Card>

        {/* EBITDA% */}
        <Card className={`transition-all ${momEbitdaChange > 0 ? 'border-2 border-green-300' : 'border-2 border-red-300'}`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">EBITDA %</CardTitle>
            <TrendingUp className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <TooltipProvider>
              <UITooltip>
                <TooltipTrigger asChild>
                  <div className="cursor-help">
                    <div className="text-2xl font-semibold text-slate-900">{ebitdaPercent}%</div>
                    <div className="flex items-center gap-1 mt-1">
                      {momEbitdaChange > 0 ? (
                        <TrendingUp className="h-3 w-3 text-green-600" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-red-600" />
                      )}
                      <p className={`text-xs ${momEbitdaChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {momEbitdaChange > 0 ? '+' : ''}{momEbitdaChange}pp MoM
                      </p>
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">YoY: +{yoyEbitdaChange}pp</p>
                  <p className="text-xs">Target: 40%</p>
                </TooltipContent>
              </UITooltip>
            </TooltipProvider>
          </CardContent>
        </Card>

        {/* Net Margin */}
        <Card className={`transition-all ${momNetMarginChange > 0 ? 'border-2 border-green-300' : 'border-2 border-red-300'}`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Net Margin</CardTitle>
            <Percent className="h-5 w-5 text-indigo-600" />
          </CardHeader>
          <CardContent>
            <TooltipProvider>
              <UITooltip>
                <TooltipTrigger asChild>
                  <div className="cursor-help">
                    <div className="text-2xl font-semibold text-slate-900">{netMargin}%</div>
                    <div className="flex items-center gap-1 mt-1">
                      {momNetMarginChange > 0 ? (
                        <TrendingUp className="h-3 w-3 text-green-600" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-red-600" />
                      )}
                      <p className={`text-xs ${momNetMarginChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {momNetMarginChange > 0 ? '+' : ''}{momNetMarginChange}pp MoM
                      </p>
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">YoY: +{yoyNetMarginChange}pp</p>
                  <p className="text-xs">Target: 25%</p>
                </TooltipContent>
              </UITooltip>
            </TooltipProvider>
          </CardContent>
        </Card>

        {/* Cash */}
        <Card className={`transition-all ${momCashChange > 0 ? 'border-2 border-green-300' : 'border-2 border-red-300'}`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Cash Balance</CardTitle>
            <Wallet className="h-5 w-5 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <TooltipProvider>
              <UITooltip>
                <TooltipTrigger asChild>
                  <div className="cursor-help">
                    <div className="text-2xl font-semibold text-slate-900">{formatCurrency(cashBalance, 0)}</div>
                    <div className="flex items-center gap-1 mt-1">
                      {momCashChange > 0 ? (
                        <TrendingUp className="h-3 w-3 text-green-600" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-red-600" />
                      )}
                      <p className={`text-xs ${momCashChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {momCashChange > 0 ? '+' : ''}{momCashChange.toFixed(1)}% MoM
                      </p>
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">YoY: +{yoyCashChange}%</p>
                  <p className="text-xs">Operating CF: {formatCurrency(62, 0)}</p>
                </TooltipContent>
              </UITooltip>
            </TooltipProvider>
          </CardContent>
        </Card>

        {/* Runway */}
        <Card className={`transition-all ${runwayChange > 0 ? 'border-2 border-green-300' : 'border-2 border-red-300'}`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Cash Runway</CardTitle>
            <TooltipProvider>
              <UITooltip>
                <TooltipTrigger asChild>
                  <Clock className="h-5 w-5 text-amber-600 cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs max-w-xs">
                    Formula: Cash Balance / Monthly Net Burn
                  </p>
                  <p className="text-xs mt-1">
                    {formatCurrency(cashBalance, 0)} ÷ {formatCurrency(monthlyBurn, 0)} = {runway.toFixed(1)} months
                  </p>
                </TooltipContent>
              </UITooltip>
            </TooltipProvider>
          </CardHeader>
          <CardContent>
            <TooltipProvider>
              <UITooltip>
                <TooltipTrigger asChild>
                  <div className="cursor-help">
                    <div className="text-2xl font-semibold text-slate-900">{runway.toFixed(1)}m</div>
                    <div className="flex items-center gap-1 mt-1">
                      {runwayChange > 0 ? (
                        <TrendingUp className="h-3 w-3 text-green-600" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-red-600" />
                      )}
                      <p className={`text-xs ${runwayChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {runwayChange > 0 ? '+' : ''}{runwayChange.toFixed(1)}m MoM
                      </p>
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">Monthly Burn: {formatCurrency(monthlyBurn, 0)}</p>
                  <p className="text-xs">Target: &gt;12 months</p>
                </TooltipContent>
              </UITooltip>
            </TooltipProvider>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue vs GM% Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue vs GM% Trend</CardTitle>
            <p className="text-xs text-slate-600 mt-1">6-month performance analysis</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={320}>
              <ComposedChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.25} />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis 
                  yAxisId="left" 
                  tick={{ fontSize: 12 }} 
                  label={{ value: `${currency.symbol} Lakh`, angle: -90, position: 'insideLeft', style: { fontSize: 12 } }}
                />
                <YAxis 
                  yAxisId="right" 
                  orientation="right" 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `${value}%`}
                  label={{ value: 'GM %', angle: 90, position: 'insideRight', style: { fontSize: 12 } }}
                />
                <Tooltip content={<CustomRevenueTooltip />} />
                <Legend />
                <Bar yAxisId="left" dataKey="revenue" fill="#8b5cf6" name="Revenue" opacity={0.8} />
                <Line 
                  yAxisId="right" 
                  type="monotone" 
                  dataKey="gm" 
                  stroke="#f97316" 
                  strokeWidth={3}
                  name="GM%"
                  dot={{ r: 4, fill: '#f97316' }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Net Cash Flow Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Net Cash Flow Analysis</CardTitle>
            <p className="text-xs text-slate-600 mt-1">6-month cash flow breakdown</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={cashFlowData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.25} />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  label={{ value: `${currency.symbol} Lakh`, angle: -90, position: 'insideLeft', style: { fontSize: 12 } }}
                />
                <Tooltip />
                <Legend />
                <Bar dataKey="operating" stackId="a" fill="#10b981" name="Operating" />
                <Bar dataKey="investing" stackId="a" fill="#f59e0b" name="Investing" />
                <Bar dataKey="financing" stackId="a" fill="#3b82f6" name="Financing" />
                <Line 
                  type="monotone" 
                  dataKey="net" 
                  stroke="#8b5cf6" 
                  strokeWidth={3}
                  name="Net CF"
                  dot={{ r: 4, fill: '#8b5cf6' }}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Exceptions & Geography Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Exceptions & Alerts */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CardTitle>Exceptions & Alerts</CardTitle>
                <Badge variant="destructive" className="bg-red-500">
                  {exceptions.length} Active
                </Badge>
              </div>
              <Button variant="default" size="sm" className="bg-blue-600 hover:bg-blue-700">
                View All Exceptions
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {exceptions.slice(0, 5).map((exception) => (
              <div 
                key={exception.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <AlertTriangle 
                    className={`h-4 w-4 ${
                      exception.severity === 'high' 
                        ? 'text-red-600' 
                        : exception.severity === 'medium'
                        ? 'text-orange-500'
                        : 'text-amber-400'
                    }`}
                  />
                  <div>
                    <p className="text-sm font-medium text-slate-900">{exception.type}</p>
                    <p className="text-xs text-slate-600">{exception.id} • {exception.module}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge 
                    variant="outline"
                    className={
                      exception.severity === 'high'
                        ? 'border-red-500 text-red-700 bg-red-50'
                        : exception.severity === 'medium'
                        ? 'border-orange-500 text-orange-700 bg-orange-50'
                        : 'border-amber-500 text-amber-700 bg-amber-50'
                    }
                  >
                    {exception.severity.toUpperCase()}
                  </Badge>
                  <p className="text-xs text-slate-600 mt-1">{formatCurrency(exception.impact, 1)}</p>
                </div>
              </div>
            ))}
            <div className="pt-2 mt-2 border-t">
              <div className="flex justify-between text-sm">
                <span className="text-slate-700">Total Impact:</span>
                <span className="font-semibold text-slate-900">
                  {formatCurrency(exceptions.reduce((sum, e) => sum + e.impact, 0), 1)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Revenue by Geography */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Revenue by Geography</CardTitle>
              <div className="flex gap-2">
                <Button
                  variant={geoView === 'india' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setGeoView('india')}
                >
                  <MapPin className="h-3 w-3 mr-1" />
                  India
                </Button>
                <Button
                  variant={geoView === 'world' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setGeoView('world')}
                >
                  <Globe className="h-3 w-3 mr-1" />
                  World
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={geographyData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  stroke="#ffffff"
                  strokeWidth={2}
                >
                  {geographyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomGeoTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {geographyData.map((region) => (
                <div key={region.region} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: region.color }}
                    ></div>
                    <span className="text-sm text-slate-700">{region.region}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-slate-900 font-medium">{formatCurrency(region.value, 0)}</span>
                    <span className="text-slate-600">{region.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Customers & Working Capital */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top 5 Customers */}
        <Card>
          <CardHeader>
            <CardTitle>Top 5 Customers</CardTitle>
            <p className="text-sm text-slate-600">Revenue contribution and trends</p>
          </CardHeader>
          <CardContent className="space-y-3">
            {topCustomers.map((customer, index) => (
              <div 
                key={customer.name}
                className="p-3 border rounded-lg hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">
                        #{index + 1}
                      </Badge>
                      <p className="text-sm font-semibold text-slate-900">{customer.name}</p>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-slate-600">3M Trend:</span>
                      {renderSparkline(customer.trend, customer.growth > 0 ? '#10b981' : '#ef4444')}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-900">{formatCurrency(customer.revenue, 0)}</p>
                    <p className={`text-xs ${customer.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {customer.growth > 0 ? '+' : ''}{customer.growth}%
                    </p>
                  </div>
                </div>
                <TooltipProvider>
                  <UITooltip>
                    <TooltipTrigger asChild>
                      <div className="flex justify-between text-xs text-slate-600 cursor-help">
                        <span>Margin: {customer.margin}%</span>
                        <span>DSO: {customer.dso} days</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">Revenue Trend: {customer.growth > 0 ? 'Increasing' : 'Decreasing'}</p>
                      <p className="text-xs">Gross Margin: {customer.margin}%</p>
                      <p className="text-xs">Days Sales Outstanding: {customer.dso} days</p>
                    </TooltipContent>
                  </UITooltip>
                </TooltipProvider>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Working Capital Health */}
        <Card>
          <CardHeader>
            <CardTitle>Working Capital Health</CardTitle>
            <p className="text-sm text-slate-600">Cash conversion cycle components</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {workingCapitalData.map((item) => (
              <div key={item.metric}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-900">{item.metric}</span>
                    <TooltipProvider>
                      <UITooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-3 w-3 text-slate-400 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">
                            {item.metric === 'DSO' && 'Days Sales Outstanding'}
                            {item.metric === 'DIO' && 'Days Inventory Outstanding'}
                            {item.metric === 'DPO' && 'Days Payable Outstanding'}
                            {item.metric === 'CCC' && 'Cash Conversion Cycle = DSO + DIO - DPO'}
                          </p>
                        </TooltipContent>
                      </UITooltip>
                    </TooltipProvider>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-sm font-semibold text-slate-900">{item.value} days</span>
                      <span className="text-xs text-slate-600 ml-2">(Target: {item.target})</span>
                    </div>
                    <Badge
                      variant="outline"
                      className={
                        item.status === 'good'
                          ? 'border-green-500 text-green-700 bg-green-50'
                          : 'border-amber-500 text-amber-700 bg-amber-50'
                      }
                    >
                      {item.status === 'good' ? '✓' : '⚠'}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    {renderSparkline(item.trend, item.status === 'good' ? '#10b981' : '#f59e0b')}
                  </div>
                  <div className="flex items-center gap-1">
                    {item.change < 0 ? (
                      <>
                        <TrendingDown className="h-3 w-3 text-green-600" />
                        <span className="text-xs text-green-600">{item.change} days</span>
                      </>
                    ) : (
                      <>
                        <TrendingUp className="h-3 w-3 text-red-600" />
                        <span className="text-xs text-red-600">+{item.change} days</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
