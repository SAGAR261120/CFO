import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { 
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  Legend, ResponsiveContainer, LineChart 
} from 'recharts';
import { 
  TrendingUp, TrendingDown, DollarSign, Target, Clock, RefreshCw,
  Info, Eye, Layers, ChevronDown, Banknote, PiggyBank, FileText,
  AlertCircle, CheckCircle, Clock3, XCircle
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tooltip as TooltipUI, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { Progress } from '../ui/progress';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import { toast } from 'sonner@2.0.3';

// Enhanced monthly cashflow data with all three categories
const monthlyCashflowData = [
  { month: 'Jul', operating: 28, investing: -5, financing: -3, closingCash: 23 },
  { month: 'Aug', operating: 30, investing: -6, financing: -2, closingCash: 26 },
  { month: 'Sep', operating: 25, investing: -4, financing: -5, closingCash: 30 },
  { month: 'Oct', operating: 35, investing: -10, financing: -3, closingCash: 38 },
  { month: 'Nov', operating: 29, investing: -7, financing: -4, closingCash: 41 },
  { month: 'Dec', operating: 32, investing: -8, financing: -2, closingCash: 45 },
];

// Liquidity ratios with historical data for sparklines
const liquidityRatios = [
  { 
    name: 'Current Ratio', 
    value: 2.1, 
    target: 1.5,
    formula: 'Current Assets ÷ Current Liabilities',
    threshold: '≥ 1.5x (Healthy)',
    history: [1.8, 1.9, 2.0, 2.1, 2.0, 2.1]
  },
  { 
    name: 'Quick Ratio', 
    value: 1.6, 
    target: 1.0,
    formula: '(Current Assets - Inventory) ÷ Current Liabilities',
    threshold: '≥ 1.0x (Good)',
    history: [1.3, 1.4, 1.5, 1.5, 1.6, 1.6]
  },
  { 
    name: 'Cash Ratio', 
    value: 0.8, 
    target: 0.5,
    formula: 'Cash ÷ Current Liabilities',
    threshold: '≥ 0.5x (Adequate)',
    history: [0.6, 0.7, 0.7, 0.8, 0.8, 0.8]
  },
  { 
    name: 'Working Capital', 
    value: 82, 
    target: 50,
    formula: 'Current Assets - Current Liabilities',
    threshold: 'Positive (Essential)',
    history: [65, 70, 75, 78, 80, 82],
    isCurrency: true
  },
];

// Bank accounts data
const bankAccounts = [
  { 
    name: 'HDFC Current Account', 
    accountNumber: '****7890', 
    balance: 25.8, 
    status: 'active',
    type: 'current',
    lastSync: '10:05 AM'
  },
  { 
    name: 'ICICI Current Account', 
    accountNumber: '****4521', 
    balance: 12.5, 
    status: 'active',
    type: 'current',
    lastSync: '10:03 AM'
  },
  { 
    name: 'SBI Savings Account', 
    accountNumber: '****3344', 
    balance: 5.2, 
    status: 'active',
    type: 'savings',
    lastSync: '10:05 AM'
  },
  { 
    name: 'Axis Fixed Deposit', 
    accountNumber: '****9988', 
    balance: 15.0, 
    status: 'inactive',
    type: 'fd',
    lastSync: '3 hrs ago'
  },
];

// Upcoming cash flows
const upcomingCashflows = [
  { 
    date: 'Jan 28, 2025', 
    description: 'Client Payment - TechCorp', 
    amount: 8.5, 
    type: 'inflow',
    category: 'Customer Payments',
    linkedTo: 'Invoice #1234',
    status: 'scheduled'
  },
  { 
    date: 'Jan 30, 2025', 
    description: 'Vendor Payment - AWS Services', 
    amount: -3.2, 
    type: 'outflow',
    category: 'Vendor Payments',
    linkedTo: 'Bill #5678',
    status: 'scheduled'
  },
  { 
    date: 'Feb 1, 2025', 
    description: 'Salary Disbursement', 
    amount: -12.5, 
    type: 'outflow',
    category: 'Salaries',
    linkedTo: 'Payroll Feb 2025',
    status: 'scheduled'
  },
  { 
    date: 'Feb 3, 2025', 
    description: 'Client Payment - DataSys', 
    amount: 6.8, 
    type: 'inflow',
    category: 'Customer Payments',
    linkedTo: 'Invoice #1235',
    status: 'scheduled',
    delay: 1
  },
  { 
    date: 'Feb 5, 2025', 
    description: 'Loan EMI Payment', 
    amount: -4.5, 
    type: 'outflow',
    category: 'Loans',
    linkedTo: 'Loan #2024-03',
    status: 'scheduled'
  },
  { 
    date: 'Feb 8, 2025', 
    description: 'Client Payment - FinanceHub', 
    amount: 7.2, 
    type: 'inflow',
    category: 'Customer Payments',
    linkedTo: 'Invoice #1236',
    status: 'scheduled'
  },
];

const runwayTrendHistory = [8.5, 8.8, 9.0, 9.5, 10.2, 10.8];

export function CashflowDashboard() {
  const [viewMode, setViewMode] = useState<'summary' | 'drilldown'>('summary');
  const [chartView, setChartView] = useState<'monthly' | 'quarterly' | 'ytd'>('monthly');
  const [cashflowHorizon, setCashflowHorizon] = useState<'7' | '14' | '30'>('14');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isInrOpen, setIsInrOpen] = useState(true);

  const handleRefresh = () => {
    setIsRefreshing(true);
    toast.info('Refreshing cash flow data...');
    
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success('Cash flow data updated successfully!');
    }, 1500);
  };

  const getRatioColor = (value: number, target: number, name: string) => {
    if (name === 'Working Capital') return 'bg-green-600';
    if (name === 'Current Ratio') {
      if (value >= 1.5) return 'bg-green-600';
      if (value >= 1.2) return 'bg-amber-600';
      return 'bg-red-600';
    }
    if (value >= target) return 'bg-green-600';
    if (value >= target * 0.8) return 'bg-amber-600';
    return 'bg-red-600';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending':
        return <Clock3 className="w-4 h-4 text-amber-600" />;
      case 'inactive':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-slate-400" />;
    }
  };

  const getAccountIcon = (type: string) => {
    switch (type) {
      case 'current':
        return '🏦';
      case 'savings':
        return '💰';
      case 'fd':
        return '📄';
      default:
        return '🏦';
    }
  };

  const filteredCashflows = upcomingCashflows.slice(0, 
    cashflowHorizon === '7' ? 2 : cashflowHorizon === '14' ? 4 : 6
  );

  const totalInflow = filteredCashflows
    .filter(cf => cf.type === 'inflow')
    .reduce((sum, cf) => sum + cf.amount, 0);
  
  const totalOutflow = filteredCashflows
    .filter(cf => cf.type === 'outflow')
    .reduce((sum, cf) => sum + Math.abs(cf.amount), 0);

  const netCashflow = totalInflow - totalOutflow;

  const groupedCashflows = filteredCashflows.reduce((acc, cf) => {
    if (!acc[cf.category]) acc[cf.category] = [];
    acc[cf.category].push(cf);
    return acc;
  }, {} as Record<string, typeof filteredCashflows>);

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* Context Ribbon */}
      <div className="bg-gradient-to-r from-blue-50 to-teal-50 border border-blue-200 rounded-lg px-6 py-3">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-slate-600">Entity:</span>
              <span className="text-slate-900">ABC Pvt Ltd</span>
            </div>
            <div className="h-4 w-px bg-slate-300" />
            <div className="flex items-center gap-2">
              <span className="text-slate-600">FY:</span>
              <span className="text-slate-900">2024–25</span>
            </div>
            <div className="h-4 w-px bg-slate-300" />
            <div className="flex items-center gap-2">
              <span className="text-slate-600">Currency:</span>
              <span className="text-slate-900">INR</span>
            </div>
            <div className="h-4 w-px bg-slate-300" />
            <div className="flex items-center gap-2">
              <span className="text-slate-600">Data as of:</span>
              <span className="text-slate-900">Dec 2024</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {/* View Mode Toggle */}
      <div className="flex items-center justify-end gap-2">
        <Button
          variant={viewMode === 'summary' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setViewMode('summary')}
        >
          <Eye className="w-4 h-4 mr-2" />
          Summary
        </Button>
        <Button
          variant={viewMode === 'drilldown' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setViewMode('drilldown')}
        >
          <Layers className="w-4 h-4 mr-2" />
          Drill-down
        </Button>
      </div>

      {/* KPI Cards - Re-sequenced */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Operating Cash Flow */}
        <Card className="border-t-4 border-t-teal-600">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Operating Cash Flow</CardTitle>
            <TrendingUp className="h-4 w-4 text-teal-600" />
          </CardHeader>
          <CardContent>
            <div className="text-slate-900">₹32L</div>
            <p className="text-xs text-green-600 mt-1">+10.3% vs Nov 2024</p>
            <div className="mt-3 text-xs text-slate-600">
              Strong operational generation
            </div>
          </CardContent>
        </Card>

        {/* Total Cash */}
        <Card className="border-t-4 border-t-blue-600">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Total Cash</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-slate-900">₹58.5L</div>
            <p className="text-xs text-green-600 mt-1">All bank accounts</p>
            <div className="mt-3 text-xs text-slate-600">
              Last updated: 10:05 AM
            </div>
          </CardContent>
        </Card>

        {/* Current Ratio */}
        <Card className="border-t-4 border-t-green-600">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center gap-1">
              <CardTitle className="text-sm">Current Ratio</CardTitle>
              <TooltipProvider>
                <TooltipUI>
                  <TooltipTrigger>
                    <Info className="w-3 h-3 text-slate-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="text-xs space-y-1">
                      <p className="font-medium">Current Assets ÷ Current Liabilities</p>
                      <p className="text-slate-400">Healthy ≥ 1.5x</p>
                    </div>
                  </TooltipContent>
                </TooltipUI>
              </TooltipProvider>
            </div>
            <Target className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-slate-900">2.1x</div>
            <p className="text-xs text-green-600 mt-1">Healthy liquidity</p>
            <div className="mt-3">
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-green-600" style={{ width: '70%' }}></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cash Runway */}
        <Card className="border-t-4 border-t-orange-600">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center gap-1">
              <CardTitle className="text-sm">Cash Runway</CardTitle>
              <TooltipProvider>
                <TooltipUI>
                  <TooltipTrigger>
                    <Info className="w-3 h-3 text-slate-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="text-xs space-y-1">
                      <p className="font-medium">Cash Balance ÷ Avg Monthly Burn</p>
                      <p className="text-slate-400">Months of runway available</p>
                    </div>
                  </TooltipContent>
                </TooltipUI>
              </TooltipProvider>
            </div>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-slate-900">10.8 months</div>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-xs text-green-600">📈 Improved</p>
              <Badge variant="outline" className="text-xs">+0.6 mo</Badge>
            </div>
            <div className="mt-3 h-8">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={runwayTrendHistory.map((v, i) => ({ value: v }))}>
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#f97316" 
                    strokeWidth={2} 
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Cash Flow Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Monthly Cash Flow Analysis</CardTitle>
                <p className="text-sm text-slate-600 mt-1">
                  Operating, Investing, and Financing activities
                </p>
              </div>
              <Tabs value={chartView} onValueChange={(v) => setChartView(v as any)}>
                <TabsList>
                  <TabsTrigger value="monthly">Monthly</TabsTrigger>
                  <TabsTrigger value="quarterly">Quarterly</TabsTrigger>
                  <TabsTrigger value="ytd">YTD</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <ComposedChart data={monthlyCashflowData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis 
                  yAxisId="left"
                  label={{ value: 'Cash Flow (₹ L)', angle: -90, position: 'insideLeft' }}
                />
                <YAxis 
                  yAxisId="right" 
                  orientation="right"
                  label={{ value: 'Cumulative Cash (₹ L)', angle: 90, position: 'insideRight' }}
                />
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      const netChange = data.operating + data.investing + data.financing;
                      return (
                        <div className="bg-white p-3 shadow-lg border rounded-lg text-sm space-y-1">
                          <p className="font-medium">{data.month} 2024</p>
                          <p className="text-teal-600">Operating: +₹{data.operating}L</p>
                          <p className="text-purple-600">Investing: ₹{data.investing}L</p>
                          <p className="text-orange-600">Financing: ₹{data.financing}L</p>
                          <p className="text-blue-600 pt-1 border-t">Closing Cash: ₹{data.closingCash}L</p>
                          <p className="text-slate-600">Net Change: {netChange > 0 ? '+' : ''}₹{netChange}L</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend 
                  verticalAlign="bottom"
                  height={50}
                  content={() => (
                    <div className="flex justify-center gap-6 mt-4 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-teal-600 rounded"></div>
                        <span>Operating</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-purple-600 rounded"></div>
                        <span>Investing</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-orange-600 rounded"></div>
                        <span>Financing</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                        <span>Closing Cash</span>
                      </div>
                    </div>
                  )}
                />
                <Bar yAxisId="left" dataKey="operating" fill="#14b8a6" stackId="stack" />
                <Bar yAxisId="left" dataKey="investing" fill="#8b5cf6" stackId="stack" />
                <Bar yAxisId="left" dataKey="financing" fill="#f97316" stackId="stack" />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="closingCash" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', r: 4 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Liquidity Ratios Panel */}
        <Card>
          <CardHeader>
            <CardTitle>Liquidity Ratios</CardTitle>
            <p className="text-sm text-slate-600">Key financial health indicators</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {liquidityRatios.map((ratio) => (
              <div key={ratio.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-medium text-slate-900">{ratio.name}</span>
                    <TooltipProvider>
                      <TooltipUI>
                        <TooltipTrigger>
                          <Info className="w-3 h-3 text-slate-400" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="text-xs space-y-1">
                            <p className="font-medium">{ratio.formula}</p>
                            <p className="text-slate-400">{ratio.threshold}</p>
                          </div>
                        </TooltipContent>
                      </TooltipUI>
                    </TooltipProvider>
                  </div>
                  <span className="text-sm font-medium text-slate-900">
                    {ratio.isCurrency ? `₹${ratio.value}L` : `${ratio.value}x`}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${getRatioColor(ratio.value, ratio.target, ratio.name)}`}
                        style={{ width: `${Math.min((ratio.value / (ratio.target * 1.5)) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="w-16 h-8">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={ratio.history.map((v, i) => ({ value: v }))}>
                        <Line 
                          type="monotone" 
                          dataKey="value" 
                          stroke="#10b981" 
                          strokeWidth={2} 
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Bank Accounts & Upcoming Cash Flows */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bank Account Balances */}
        <Card>
          <CardHeader>
            <CardTitle>Bank Account Balances</CardTitle>
            <p className="text-sm text-slate-600">Real-time account positions</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <Collapsible open={isInrOpen} onOpenChange={setIsInrOpen}>
              <CollapsibleTrigger className="flex items-center justify-between w-full hover:opacity-80 transition-opacity">
                <div className="flex items-center gap-2">
                  <ChevronDown className={`w-4 h-4 transition-transform ${isInrOpen ? '' : '-rotate-90'}`} />
                  <span className="text-sm font-medium text-slate-900">Bank Accounts (INR)</span>
                </div>
                <Badge variant="outline">{bankAccounts.length} accounts</Badge>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-3 mt-3">
                {bankAccounts.map((account) => (
                  <div key={account.accountNumber} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-slate-50 transition-colors">
                    <div className="text-2xl">{getAccountIcon(account.type)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-slate-900 truncate">{account.name}</p>
                        <TooltipProvider>
                          <TooltipUI>
                            <TooltipTrigger>
                              {getStatusIcon(account.status)}
                            </TooltipTrigger>
                            <TooltipContent>
                              <div className="text-xs space-y-1">
                                <p className="font-medium capitalize">{account.status}</p>
                                {account.status === 'inactive' && (
                                  <p className="text-slate-400">API sync failed {account.lastSync}</p>
                                )}
                                {account.status === 'active' && (
                                  <p className="text-slate-400">Last synced: {account.lastSync}</p>
                                )}
                              </div>
                            </TooltipContent>
                          </TooltipUI>
                        </TooltipProvider>
                      </div>
                      <p className="text-xs text-slate-500">{account.accountNumber}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-slate-900">₹{account.balance}L</p>
                      <p className="text-xs text-slate-500">{account.type.toUpperCase()}</p>
                    </div>
                  </div>
                ))}
              </CollapsibleContent>
            </Collapsible>

            <div className="pt-3 border-t">
              <div className="flex items-center justify-between p-3 bg-teal-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-slate-900">Total Available Cash</p>
                  <p className="text-xs text-slate-600">as of 10:05 AM</p>
                </div>
                <p className="text-lg font-medium text-teal-700">₹58.5L</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Cash Flows */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Upcoming Cash Flows</CardTitle>
                <p className="text-sm text-slate-600">Scheduled inflows and outflows</p>
              </div>
              <Tabs value={cashflowHorizon} onValueChange={(v) => setCashflowHorizon(v as any)}>
                <TabsList>
                  <TabsTrigger value="7">7D</TabsTrigger>
                  <TabsTrigger value="14">14D</TabsTrigger>
                  <TabsTrigger value="30">30D</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <div className="flex items-center gap-6 mt-3 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-teal-600 rounded-full"></div>
                <span className="text-slate-600">Inflow:</span>
                <span className="font-medium text-teal-700">₹{totalInflow.toFixed(1)}L</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                <span className="text-slate-600">Outflow:</span>
                <span className="font-medium text-orange-700">₹{totalOutflow.toFixed(1)}L</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span className="text-slate-600">Net:</span>
                <span className={`font-medium ${netCashflow >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                  {netCashflow >= 0 ? '+' : ''}₹{netCashflow.toFixed(1)}L
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(groupedCashflows).map(([category, items]) => (
              <Collapsible key={category} defaultOpen={true}>
                <CollapsibleTrigger className="flex items-center justify-between w-full hover:opacity-80 transition-opacity py-2">
                  <div className="flex items-center gap-2">
                    <ChevronDown className="w-4 h-4" />
                    <span className="text-sm font-medium text-slate-900">{category}</span>
                  </div>
                  <Badge variant="outline">{items.length}</Badge>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-2 mt-2">
                  {items.map((cf, idx) => (
                    <TooltipProvider key={idx}>
                      <TooltipUI>
                        <TooltipTrigger asChild>
                          <div className="flex items-start gap-3 p-3 border rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
                            <div className={`w-1 h-full rounded-full ${
                              cf.type === 'inflow' ? 'bg-teal-600' : 'bg-orange-600'
                            }`}></div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-slate-900">{cf.description}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <p className="text-xs text-slate-500">{cf.date}</p>
                                {cf.delay && (
                                  <Badge variant="outline" className="text-xs text-amber-700">
                                    Expected delay {cf.delay}d
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <p className={`text-sm font-medium ${
                              cf.type === 'inflow' ? 'text-teal-700' : 'text-orange-700'
                            }`}>
                              {cf.type === 'inflow' ? '+' : ''}₹{Math.abs(cf.amount)}L
                            </p>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="text-xs space-y-1">
                            <p className="font-medium">{cf.linkedTo}</p>
                            {cf.delay && (
                              <p className="text-amber-600">Expected delay: {cf.delay} day(s)</p>
                            )}
                            <p className="text-slate-400">Status: {cf.status}</p>
                          </div>
                        </TooltipContent>
                      </TooltipUI>
                    </TooltipProvider>
                  ))}
                </CollapsibleContent>
              </Collapsible>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
