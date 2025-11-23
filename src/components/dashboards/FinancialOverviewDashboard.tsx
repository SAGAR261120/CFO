import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, ComposedChart, Cell 
} from 'recharts';
import { 
  DollarSign, PieChart, TrendingDown, Activity, Info, RefreshCw,
  Download, FileText, Sheet as SheetIcon, TrendingUp, Percent
} from 'lucide-react';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '../ui/table';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Switch } from '../ui/switch';
import { 
  Tooltip as UITooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '../ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { cn } from '../ui/utils';

// Mock P&L Data
const plWaterfallData = [
  { name: 'Revenue', value: 110, type: 'income', color: '#10b981', margin: 100 },
  { name: 'COGS', value: -35, type: 'expense', color: '#ef4444', margin: 68.2 },
  { name: 'Gross Margin', value: 75, type: 'margin', color: '#3b82f6', margin: 68.2 },
  { name: 'Operating Exp', value: -25, type: 'expense', color: '#f97316', margin: 45.5 },
  { name: 'EBITDA', value: 50, type: 'ebitda', color: '#8b5cf6', margin: 45.5 },
  { name: 'D&A', value: -5, type: 'expense', color: '#ef4444', margin: 40.9 },
  { name: 'Interest', value: -3, type: 'expense', color: '#ef4444', margin: 38.2 },
  { name: 'Tax', value: -12, type: 'expense', color: '#ef4444', margin: 27.3 },
  { name: 'Net Profit', value: 30, type: 'profit', color: '#06b6d4', margin: 27.3 },
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
  {
    account: 'Revenue',
    current: 110.0,
    budget: 105.0,
    ytd: 642.0,
    formula: 'Σ Net Sales'
  },
  {
    account: 'COGS',
    current: -35.0,
    budget: -33.6,
    ytd: -204.0,
    formula: 'Includes raw material, direct labour, and freight'
  },
  {
    account: 'Gross Profit',
    current: 75.0,
    budget: 71.4,
    ytd: 438.0,
    formula: 'Revenue - COGS'
  },
  {
    account: 'Operating Expenses',
    current: -25.0,
    budget: -26.3,
    ytd: -155.0,
    formula: 'Salaries + Rent + Marketing + Admin'
  },
  {
    account: 'EBITDA',
    current: 50.0,
    budget: 45.1,
    ytd: 283.0,
    formula: 'Revenue - COGS - Opex'
  },
  {
    account: 'Depreciation & Amortization',
    current: -5.0,
    budget: -5.3,
    ytd: -30.0,
    formula: 'Non-cash expense allocation'
  },
  {
    account: 'Interest Expense',
    current: -3.0,
    budget: -3.2,
    ytd: -18.5,
    formula: 'Debt servicing cost'
  },
  {
    account: 'Tax',
    current: -12.0,
    budget: -10.5,
    ytd: -67.0,
    formula: 'Income tax provision'
  },
  {
    account: 'Net Profit',
    current: 30.0,
    budget: 26.1,
    ytd: 167.5,
    formula: 'EBITDA - D&A - Interest - Tax'
  },
];

const months = [
  { id: 'apr', label: 'Apr', fullName: 'April' },
  { id: 'may', label: 'May', fullName: 'May' },
  { id: 'jun', label: 'Jun', fullName: 'June' },
  { id: 'jul', label: 'Jul', fullName: 'July' },
  { id: 'aug', label: 'Aug', fullName: 'August' },
  { id: 'sep', label: 'Sep', fullName: 'September' },
  { id: 'oct', label: 'Oct', fullName: 'October' },
  { id: 'nov', label: 'Nov', fullName: 'November' },
  { id: 'dec', label: 'Dec', fullName: 'December' },
  { id: 'jan', label: 'Jan', fullName: 'January' },
  { id: 'feb', label: 'Feb', fullName: 'February' },
  { id: 'mar', label: 'Mar', fullName: 'March' },
];

export function FinancialOverviewDashboard() {
  const [selectedMonth, setSelectedMonth] = useState('dec');
  const [waterfallView, setWaterfallView] = useState<'amount' | 'percentage'>('amount');
  const [revenueMixView, setRevenueMixView] = useState<'category' | 'segment'>('category');
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  };

  const handleExport = (format: 'pdf' | 'excel') => {
    // Mock export functionality
    alert(`Exporting P&L as ${format.toUpperCase()}...`);
  };

  const calculateVariance = (actual: number, budget: number) => {
    return ((actual - budget) / Math.abs(budget)) * 100;
  };

  const getVarianceBadge = (actual: number, budget: number, isExpense: boolean = false) => {
    const variance = calculateVariance(actual, budget);
    const isFavorable = isExpense ? variance < 0 : variance > 0;
    
    return (
      <Badge
        variant="outline"
        className={cn(
          'font-medium',
          isFavorable 
            ? 'bg-green-50 text-green-700 border-green-300' 
            : 'bg-red-50 text-red-700 border-red-300'
        )}
      >
        {variance > 0 ? '+' : ''}{variance.toFixed(1)}%
      </Badge>
    );
  };

  const CustomWaterfallTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-slate-200">
          <p className="font-semibold text-slate-900">{data.name}</p>
          <p className="text-sm text-slate-700">Amount: ₹{Math.abs(data.value)}L</p>
          <p className="text-sm text-slate-700">Margin: {data.margin}%</p>
          {data.type === 'expense' && (
            <p className="text-xs text-slate-600 mt-1">
              {((Math.abs(data.value) / 110) * 100).toFixed(1)}% of Revenue
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  const lastUpdated = new Date().toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* Header with Context */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">P&L Analysis</h2>
            <p className="text-sm text-slate-600 mt-1">
              <span className="font-semibold">Entity:</span> Pranam Creative Solutions Private Ltd | 
              <span className="font-semibold ml-2">FY:</span> 2024-25 | 
              <span className="font-semibold ml-2">Reporting Currency:</span> INR
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <span>Last updated: {lastUpdated}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={handleRefresh}
              >
                <RefreshCw className={cn('h-4 w-4', refreshing && 'animate-spin')} />
              </Button>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="default" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export P&L
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleExport('pdf')}>
                  <FileText className="h-4 w-4 mr-2" />
                  PDF (Formatted Report)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('excel')}>
                  <SheetIcon className="h-4 w-4 mr-2" />
                  Excel (Raw Data with Formulas)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Month Selector */}
      <div className="bg-white border border-slate-200 rounded-lg p-3">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
          <span className="text-sm font-medium text-slate-700 mr-2">Period:</span>
          {months.map((month) => (
            <button
              key={month.id}
              onClick={() => setSelectedMonth(month.id)}
              className={cn(
                'px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap',
                selectedMonth === month.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
              )}
            >
              {month.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Revenue */}
        <Card className="border-2 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center gap-2">
              <CardTitle className="text-sm">Revenue</CardTitle>
              <TooltipProvider>
                <UITooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3 w-3 text-slate-400 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">Revenue = Σ Net Sales</p>
                  </TooltipContent>
                </UITooltip>
              </TooltipProvider>
            </div>
            <DollarSign className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-slate-900">₹110.0L</div>
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-green-600" />
                <span className="text-xs text-green-600">+4.8% vs Budget</span>
              </div>
            </div>
            <div className="text-xs text-slate-600 mt-1">
              Budget: ₹105.0L | Target variance: <span className="text-green-600 font-semibold">+5.0L</span>
            </div>
          </CardContent>
        </Card>

        {/* Gross Margin */}
        <Card className="border-2 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center gap-2">
              <CardTitle className="text-sm">Gross Margin</CardTitle>
              <TooltipProvider>
                <UITooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3 w-3 text-slate-400 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">GM% = (Revenue - COGS) / Revenue</p>
                  </TooltipContent>
                </UITooltip>
              </TooltipProvider>
            </div>
            <Percent className="h-5 w-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-slate-900">68.2%</div>
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-green-600" />
                <span className="text-xs text-green-600">₹75.0L</span>
              </div>
            </div>
            <div className="text-xs text-slate-600 mt-1">
              Target: 68.0% | Variance: <span className="text-green-600 font-semibold">+0.2pp</span>
            </div>
          </CardContent>
        </Card>

        {/* EBITDA */}
        <Card className="border-2 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center gap-2">
              <CardTitle className="text-sm">EBITDA</CardTitle>
              <TooltipProvider>
                <UITooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3 w-3 text-slate-400 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">EBITDA = Revenue - COGS - Opex</p>
                    <p className="text-xs">EBITDA% = EBITDA / Revenue</p>
                  </TooltipContent>
                </UITooltip>
              </TooltipProvider>
            </div>
            <TrendingUp className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-slate-900">₹50.0L</div>
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-1">
                <span className="text-sm font-medium text-slate-700">45.5%</span>
                <span className="text-xs text-slate-500 ml-1">margin</span>
              </div>
            </div>
            <div className="text-xs text-slate-600 mt-1">
              Budget: ₹45.1L | Variance: <span className="text-green-600 font-semibold">+10.9%</span>
            </div>
          </CardContent>
        </Card>

        {/* Net Profit */}
        <Card className="border-2 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center gap-2">
              <CardTitle className="text-sm">Net Profit</CardTitle>
              <TooltipProvider>
                <UITooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3 w-3 text-slate-400 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">Net Profit = EBITDA - D&A - Interest - Tax</p>
                    <p className="text-xs">Net Margin% = Net Profit / Revenue</p>
                  </TooltipContent>
                </UITooltip>
              </TooltipProvider>
            </div>
            <Activity className="h-5 w-5 text-cyan-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-slate-900">₹30.0L</div>
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-1">
                <span className="text-sm font-medium text-slate-700">27.3%</span>
                <span className="text-xs text-slate-500 ml-1">margin</span>
              </div>
            </div>
            <div className="text-xs text-slate-600 mt-1">
              Budget: ₹26.1L | Variance: <span className="text-green-600 font-semibold">+14.9%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* P&L Waterfall & Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* P&L Waterfall Analysis */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>P&L Waterfall Analysis</CardTitle>
                <p className="text-xs text-slate-600 mt-1">December 2024</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-600">View as:</span>
                <Switch
                  checked={waterfallView === 'percentage'}
                  onCheckedChange={(checked) => setWaterfallView(checked ? 'percentage' : 'amount')}
                />
                <span className="text-xs text-slate-600">
                  {waterfallView === 'amount' ? '₹' : '%'}
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={plWaterfallData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.2} />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 11 }} 
                  angle={-15}
                  textAnchor="end"
                  height={80}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  label={{ 
                    value: waterfallView === 'amount' ? '₹ Lakh' : '% of Revenue', 
                    angle: -90, 
                    position: 'insideLeft',
                    style: { fontSize: 12 }
                  }}
                />
                <Tooltip content={<CustomWaterfallTooltip />} />
                <Bar dataKey={waterfallView === 'amount' ? 'value' : 'margin'} radius={[4, 4, 0, 0]}>
                  {plWaterfallData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-3 mt-4 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded" style={{ backgroundColor: '#10b981' }}></div>
                <span className="text-slate-600">Income</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded" style={{ backgroundColor: '#ef4444' }}></div>
                <span className="text-slate-600">Expense</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded" style={{ backgroundColor: '#3b82f6' }}></div>
                <span className="text-slate-600">Gross Margin</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded" style={{ backgroundColor: '#8b5cf6' }}></div>
                <span className="text-slate-600">EBITDA</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded" style={{ backgroundColor: '#06b6d4' }}></div>
                <span className="text-slate-600">Net Profit</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Six-Month Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Six-Month Trend</CardTitle>
            <p className="text-xs text-slate-600 mt-1">Revenue & Profitability (6M)</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={320}>
              <ComposedChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.2} />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis 
                  yAxisId="left"
                  tick={{ fontSize: 12 }}
                  label={{ value: '₹ Lakh', angle: -90, position: 'insideLeft', style: { fontSize: 12 } }}
                />
                <YAxis 
                  yAxisId="right"
                  orientation="right"
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `${value}%`}
                  label={{ value: '%', angle: 90, position: 'insideRight', style: { fontSize: 12 } }}
                />
                <Tooltip />
                <Bar yAxisId="left" dataKey="revenue" fill="#3b82f6" name="Revenue" opacity={0.8} />
                <Line 
                  yAxisId="right" 
                  type="monotone" 
                  dataKey="grossMargin" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  name="GM%"
                  dot={{ r: 4 }}
                />
                <Line 
                  yAxisId="right" 
                  type="monotone" 
                  dataKey="ebitda" 
                  stroke="#8b5cf6" 
                  strokeWidth={2}
                  name="EBITDA%"
                  dot={{ r: 4 }}
                />
                <Line 
                  yAxisId="right" 
                  type="monotone" 
                  dataKey="netProfit" 
                  stroke="#06b6d4" 
                  strokeWidth={2}
                  name="Net Profit%"
                  dot={{ r: 4 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-3 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                <span className="text-slate-600">Revenue (₹L)</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span className="text-slate-600">GM%</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-purple-500 rounded"></div>
                <span className="text-slate-600">EBITDA%</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-cyan-500 rounded"></div>
                <span className="text-slate-600">Net Profit%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Mix & P&L Table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Mix */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Revenue Mix</CardTitle>
                <p className="text-xs text-slate-600 mt-1">Breakdown by {revenueMixView}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={revenueMixView === 'category' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setRevenueMixView('category')}
                >
                  Category
                </Button>
                <Button
                  variant={revenueMixView === 'segment' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setRevenueMixView('segment')}
                >
                  Segment
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={revenueMixData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.2} />
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis dataKey="category" type="category" tick={{ fontSize: 12 }} width={100} />
                <Tooltip
                  content={({ active, payload }: any) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white p-3 rounded-lg shadow-lg border border-slate-200">
                          <p className="font-semibold text-slate-900">{payload[0].payload.category}</p>
                          <p className="text-sm text-slate-700">Amount: ₹{payload[0].value}L</p>
                          <p className="text-sm text-slate-700">Share: {payload[0].payload.percentage}%</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {revenueMixData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {revenueMixData.map((item) => (
                <div key={item.category} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded" style={{ backgroundColor: item.color }}></div>
                    <span className="text-sm text-slate-700">{item.category}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-slate-900">₹{item.value}L</span>
                    <span className="text-sm text-slate-600">{item.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Key Financial Ratios</CardTitle>
            <p className="text-xs text-slate-600 mt-1">December 2024</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-slate-900">Gross Margin %</span>
                <TooltipProvider>
                  <UITooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3 w-3 text-slate-400 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">(Revenue - COGS) / Revenue</p>
                    </TooltipContent>
                  </UITooltip>
                </TooltipProvider>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-slate-900">68.2%</span>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
                  +5.0%
                </Badge>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-slate-900">EBITDA Margin %</span>
                <TooltipProvider>
                  <UITooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3 w-3 text-slate-400 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">EBITDA / Revenue</p>
                    </TooltipContent>
                  </UITooltip>
                </TooltipProvider>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-slate-900">45.5%</span>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
                  +10.9%
                </Badge>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-slate-900">Net Profit Margin %</span>
                <TooltipProvider>
                  <UITooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3 w-3 text-slate-400 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">Net Profit / Revenue</p>
                    </TooltipContent>
                  </UITooltip>
                </TooltipProvider>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-slate-900">27.3%</span>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
                  +14.9%
                </Badge>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-slate-900">Operating Efficiency</span>
                <TooltipProvider>
                  <UITooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3 w-3 text-slate-400 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">Operating Expenses / Revenue</p>
                    </TooltipContent>
                  </UITooltip>
                </TooltipProvider>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-slate-900">22.7%</span>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
                  Improved
                </Badge>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
              <span className="text-sm font-medium text-slate-900">YTD Revenue</span>
              <span className="text-sm font-semibold text-blue-900">₹642.0L</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-cyan-50 rounded-lg border border-cyan-200">
              <span className="text-sm font-medium text-slate-900">YTD Net Profit</span>
              <span className="text-sm font-semibold text-cyan-900">₹167.5L</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* P&L Summary Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>P&L Summary Table</CardTitle>
              <p className="text-xs text-slate-600 mt-1">Current vs Budget vs YTD (All amounts in ₹ Lakh)</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => handleExport('excel')}>
              <Download className="h-4 w-4 mr-2" />
              Export Table
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="sticky top-0 bg-white z-10">
                <TableRow>
                  <TableHead className="font-semibold">Account</TableHead>
                  <TableHead className="text-right font-semibold">Current</TableHead>
                  <TableHead className="text-right font-semibold">Budget</TableHead>
                  <TableHead className="text-right font-semibold">Var %</TableHead>
                  <TableHead className="text-right font-semibold">Var ₹</TableHead>
                  <TableHead className="text-right font-semibold">YTD</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {plTableData.map((row, index) => {
                  const isExpense = row.current < 0;
                  const variance = row.current - row.budget;
                  const variancePercent = calculateVariance(row.current, row.budget);
                  const isTotal = row.account.includes('Profit') || row.account === 'EBITDA';
                  
                  return (
                    <TableRow 
                      key={row.account}
                      className={cn(
                        isTotal && 'bg-slate-50 font-semibold',
                        index === plTableData.length - 1 && 'bg-cyan-50 border-t-2 border-cyan-300'
                      )}
                    >
                      <TableCell>
                        <TooltipProvider>
                          <UITooltip>
                            <TooltipTrigger asChild>
                              <div className="flex items-center gap-1 cursor-help">
                                <span>{row.account}</span>
                                <Info className="h-3 w-3 text-slate-400" />
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="text-xs">{row.formula}</p>
                            </TooltipContent>
                          </UITooltip>
                        </TooltipProvider>
                      </TableCell>
                      <TableCell className="text-right">
                        {row.current > 0 ? '₹' : '-₹'}{Math.abs(row.current).toFixed(1)}
                      </TableCell>
                      <TableCell className="text-right text-slate-600">
                        {row.budget > 0 ? '₹' : '-₹'}{Math.abs(row.budget).toFixed(1)}
                      </TableCell>
                      <TableCell className="text-right">
                        {getVarianceBadge(row.current, row.budget, isExpense)}
                      </TableCell>
                      <TableCell className="text-right">
                        <span className={cn(
                          'font-medium',
                          (isExpense ? variance < 0 : variance > 0) 
                            ? 'text-green-700' 
                            : 'text-red-700'
                        )}>
                          {variance > 0 ? '+₹' : '-₹'}{Math.abs(variance).toFixed(1)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {row.ytd > 0 ? '₹' : '-₹'}{Math.abs(row.ytd).toFixed(1)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
