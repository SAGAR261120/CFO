import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  Legend, ResponsiveContainer, Area, AreaChart, ReferenceLine, RadarChart,
  Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ComposedChart
} from 'recharts';
import { 
  TrendingUp, DollarSign, Target, Activity, Settings, RefreshCw, 
  ChevronDown, ChevronUp, AlertTriangle, Clock, ArrowUp, ArrowDown,
  TrendingDown, Info, Sparkles, Zap, PieChart, BarChart3
} from 'lucide-react';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import { Badge } from '../ui/badge';
import { Tooltip as TooltipUI, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { toast } from 'sonner@2.0.3';

// Enhanced data with more points for better visualization
const trendData = [
  { month: 'Jan', actual: 85, budget: 80, forecast: 0, yoy: 78, lowerBound: 0, upperBound: 0 },
  { month: 'Feb', actual: 88, budget: 85, forecast: 0, yoy: 82, lowerBound: 0, upperBound: 0 },
  { month: 'Mar', actual: 92, budget: 88, forecast: 0, yoy: 85, lowerBound: 0, upperBound: 0 },
  { month: 'Apr', actual: 90, budget: 90, forecast: 0, yoy: 86, lowerBound: 0, upperBound: 0 },
  { month: 'May', actual: 93, budget: 91, forecast: 0, yoy: 87, lowerBound: 0, upperBound: 0 },
  { month: 'Jun', actual: 95, budget: 92, forecast: 0, yoy: 88, lowerBound: 0, upperBound: 0 },
  { month: 'Jul', actual: 97, budget: 94, forecast: 0, yoy: 90, lowerBound: 0, upperBound: 0 },
  { month: 'Aug', actual: 102, budget: 98, forecast: 0, yoy: 95, lowerBound: 0, upperBound: 0 },
  { month: 'Sep', actual: 108, budget: 105, forecast: 0, yoy: 99, lowerBound: 0, upperBound: 0 },
  { month: 'Oct', actual: 105, budget: 110, forecast: 0, yoy: 102, lowerBound: 0, upperBound: 0 },
  { month: 'Nov', actual: 104, budget: 108, forecast: 0, yoy: 105, lowerBound: 0, upperBound: 0 },
  { month: 'Dec', actual: 110, budget: 110, forecast: 0, yoy: 108, lowerBound: 0, upperBound: 0, anomaly: true },
  // Forecast data with confidence intervals
  { month: 'Jan \'25', actual: 0, budget: 112, forecast: 115, yoy: 0, lowerBound: 108, upperBound: 122 },
  { month: 'Feb \'25', actual: 0, budget: 115, forecast: 118, yoy: 0, lowerBound: 110, upperBound: 126 },
  { month: 'Mar \'25', actual: 0, budget: 118, forecast: 122, yoy: 0, lowerBound: 114, upperBound: 130 },
  { month: 'Apr \'25', actual: 0, budget: 120, forecast: 125, yoy: 0, lowerBound: 117, upperBound: 133 },
];

const varianceData = [
  { category: 'Sales & Marketing', budget: 60, actual: 81, variance: 21, variancePct: 35, impact: -3.4 },
  { category: 'Operations', budget: 45, actual: 42, variance: -3, variancePct: -6.7, impact: 0.5 },
  { category: 'R&D', budget: 35, actual: 38, variance: 3, variancePct: 8.6, impact: -0.5 },
  { category: 'Administration', budget: 28, actual: 25, variance: -3, variancePct: -10.7, impact: 0.5 },
  { category: 'Customer Success', budget: 22, actual: 24, variance: 2, variancePct: 9.1, impact: -0.3 },
  { category: 'Product Dev', budget: 18, actual: 16, variance: -2, variancePct: -11.1, impact: 0.3 },
];

const anomalyData = [
  { 
    metric: 'Daily Revenue', 
    expected: 3.5, 
    actual: 4.2, 
    deviation: 0.7, 
    zScore: 2.8, 
    significance: 'High',
    rootCause: 'New enterprise deal closed on Dec 15',
    action: 'Monitor pipeline sustainability'
  },
  { 
    metric: 'COGS %', 
    expected: 55, 
    actual: 65, 
    deviation: 10, 
    zScore: 2.4, 
    significance: 'Medium',
    rootCause: 'Vendor pricing ↑12%',
    action: 'Renegotiate terms'
  },
  { 
    metric: 'Customer Churn', 
    expected: 2.1, 
    actual: 3.8, 
    deviation: 1.7, 
    zScore: 3.2, 
    significance: 'High',
    rootCause: 'Product feature delays',
    action: 'Urgent: Retention campaign'
  },
  { 
    metric: 'Gross Margin', 
    expected: 45, 
    actual: 38, 
    deviation: -7, 
    zScore: 2.1, 
    significance: 'Medium',
    rootCause: 'Supply chain disruption',
    action: 'Diversify supplier base'
  },
];

const performanceMetrics = [
  { metric: 'Revenue Growth', value: 92, target: 85, status: 'excellent' },
  { metric: 'Profit Margin', value: 78, target: 75, status: 'good' },
  { metric: 'Customer Retention', value: 68, target: 80, status: 'warning' },
  { metric: 'Operational Efficiency', value: 85, target: 80, status: 'good' },
  { metric: 'Market Share', value: 72, target: 70, status: 'good' },
  { metric: 'Innovation Index', value: 88, target: 85, status: 'excellent' },
];

const monthlyRevenue = [
  { month: 'Jul', revenue: 245, expenses: 198, profit: 47 },
  { month: 'Aug', revenue: 265, expenses: 205, profit: 60 },
  { month: 'Sep', revenue: 285, expenses: 215, profit: 70 },
  { month: 'Oct', revenue: 275, expenses: 210, profit: 65 },
  { month: 'Nov', revenue: 270, expenses: 208, profit: 62 },
  { month: 'Dec', revenue: 295, expenses: 220, profit: 75 },
];

const sparklineData = [
  { value: 98 }, { value: 102 }, { value: 108 }, { value: 105 }, { value: 104 }, { value: 110 }, { value: 115 }
];

export function AnalyticsDashboard() {
  const [selectedMeasure, setSelectedMeasure] = useState('revenue');
  const [comparison, setComparison] = useState('budget');
  const [granularity, setGranularity] = useState('monthly');
  const [benchmark, setBenchmark] = useState('internal');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState('Jan 24, 2025 – 09:42 AM IST');
  const [showYoY, setShowYoY] = useState(false);
  const [sortBy, setSortBy] = useState('variance');

  const handleRefresh = () => {
    setIsRefreshing(true);
    toast.info('Running analysis...');
    
    setTimeout(() => {
      const now = new Date();
      const timestamp = now.toLocaleDateString('en-IN', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      }) + ' – ' + now.toLocaleTimeString('en-IN', { 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: true 
      }) + ' IST';
      
      setLastRefresh(timestamp);
      setIsRefreshing(false);
      toast.success('Analysis refreshed successfully!');
    }, 2000);
  };

  const sortedVarianceData = [...varianceData].sort((a, b) => {
    if (sortBy === 'variance') {
      return Math.abs(b.variance) - Math.abs(a.variance);
    } else {
      return Math.abs(b.variancePct) - Math.abs(a.variancePct);
    }
  });

  const getConfidenceColor = (confidence: number) => {
    if (confidence > 80) return 'text-teal-600 bg-teal-50';
    if (confidence >= 70) return 'text-amber-600 bg-amber-50';
    return 'text-red-600 bg-red-50';
  };

  const getMAPEColor = (mape: number) => {
    if (mape <= 5) return 'text-green-600';
    if (mape <= 10) return 'text-blue-600';
    return 'text-orange-600';
  };

  const getMAPELabel = (mape: number) => {
    if (mape <= 5) return 'Excellent';
    if (mape <= 10) return 'Good';
    return 'Weak';
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">

      {/* Configuration Settings */}
      <Collapsible open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="pb-3 bg-gradient-to-r from-slate-50 to-white">
            <CollapsibleTrigger className="flex items-center justify-between w-full hover:opacity-80 transition-opacity">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Settings className="w-4 h-4 text-blue-600" />
                </div>
                <CardTitle className="text-sm">Configuration Settings</CardTitle>
              </div>
              {isSettingsOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </CollapsibleTrigger>
          </CardHeader>
          <CollapsibleContent>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="text-sm text-slate-700">Measure</label>
                  <Select value={selectedMeasure} onValueChange={setSelectedMeasure}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="revenue">Revenue</SelectItem>
                      <SelectItem value="ebitda">EBITDA</SelectItem>
                      <SelectItem value="expenses">Expenses</SelectItem>
                      <SelectItem value="working-capital">Working Capital</SelectItem>
                      <SelectItem value="cash-flow">Cash Flow</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-slate-700">Comparison</label>
                  <Select value={comparison} onValueChange={setComparison}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="budget">Actual vs Budget</SelectItem>
                      <SelectItem value="forecast">Actual vs Forecast</SelectItem>
                      <SelectItem value="3m-avg">Forecast vs 3M Avg</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-slate-700">Granularity</label>
                  <Select value={granularity} onValueChange={setGranularity}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-slate-700">Benchmark Source</label>
                  <Select value={benchmark} onValueChange={setBenchmark}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="internal">Internal Target</SelectItem>
                      <SelectItem value="industry">Industry Avg</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Clock className="w-4 h-4" />
                  <span>Last refreshed: {lastRefresh}</span>
                </div>
                <Button 
                  onClick={handleRefresh} 
                  disabled={isRefreshing}
                  className="gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-md"
                >
                  <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                  {isRefreshing ? 'Refreshing...' : 'Refresh Analysis'}
                </Button>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Enhanced KPI Summary Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-l-4 border-l-blue-600 bg-gradient-to-br from-white to-blue-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="space-y-1">
              <CardTitle className="text-sm text-slate-600">Current Period</CardTitle>
            </div>
            <div className="p-3 bg-blue-100 rounded-xl">
              <DollarSign className="h-5 w-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <TooltipProvider>
              <TooltipUI>
                <TooltipTrigger asChild>
                  <div className="cursor-help">
                    <div className="text-slate-900">₹110L</div>
                    <div className="flex items-center gap-1 mt-1">
                      <ArrowUp className="w-3 h-3 text-green-600" />
                      <p className="text-xs text-green-600">6% vs Nov 2024</p>
                    </div>
                    <div className="mt-3 h-10">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={sparklineData}>
                          <defs>
                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                            </linearGradient>
                          </defs>
                          <Line 
                            type="monotone" 
                            dataKey="value" 
                            stroke="#10b981" 
                            strokeWidth={3} 
                            dot={false}
                          />
                          <Area type="monotone" dataKey="value" stroke="#10b981" fill="url(#colorRevenue)" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="text-xs space-y-1">
                    <div>Last 7 periods trend</div>
                    <div className="text-green-600">↑6% vs previous period</div>
                  </div>
                </TooltipContent>
              </TooltipUI>
            </TooltipProvider>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-l-4 border-l-green-600 bg-gradient-to-br from-white to-green-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm text-slate-600">vs Budget</CardTitle>
            <div className="p-3 bg-green-100 rounded-xl">
              <Target className="h-5 w-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-slate-900">0.0%</div>
            <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
              <Zap className="w-3 h-3" />
              On Target
            </p>
            <div className="mt-3 h-2 bg-slate-100 rounded-full overflow-hidden shadow-inner">
              <div className="h-full bg-gradient-to-r from-green-500 to-green-600 w-full shadow-sm"></div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-l-4 border-l-purple-600 bg-gradient-to-br from-white to-purple-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm text-slate-600">3M Avg</CardTitle>
            <div className="p-3 bg-purple-100 rounded-xl">
              <TrendingUp className="h-5 w-5 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="text-slate-900">₹106.3L</div>
              <ArrowUp className="w-4 h-4 text-purple-600" />
            </div>
            <p className="text-xs text-slate-600 mt-1">Rolling trend up</p>
            <div className="mt-2 flex gap-1">
              {[65, 80, 90, 75, 95, 100].map((height, i) => (
                <div 
                  key={i} 
                  className="flex-1 bg-gradient-to-t from-purple-500 to-purple-400 rounded-sm"
                  style={{ height: `${height / 100 * 30}px` }}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-l-4 border-l-orange-600 bg-gradient-to-br from-white to-orange-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center gap-1">
              <CardTitle className="text-sm text-slate-600">Forecast MAPE</CardTitle>
              <TooltipProvider>
                <TooltipUI>
                  <TooltipTrigger>
                    <Info className="w-3 h-3 text-slate-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">Mean Absolute Percentage Error</p>
                  </TooltipContent>
                </TooltipUI>
              </TooltipProvider>
            </div>
            <div className="p-3 bg-orange-100 rounded-xl">
              <Activity className="h-5 w-5 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className={getMAPEColor(8.5)}>8.5%</div>
            <p className="text-xs text-slate-600 mt-1 flex items-center gap-1">
              <BarChart3 className="w-3 h-3" />
              {getMAPELabel(8.5)}
            </p>
            <div className="mt-2 flex items-center gap-1">
              <div className="flex-1 h-2 bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 rounded-full"></div>
              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full shadow-lg" style={{ marginLeft: '35%' }}></div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Commentary Chip */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 shadow-md">
        <CardContent className="py-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Sparkles className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-blue-900">
                <span className="font-medium">AI Insight:</span> Revenue on target with strong forecast accuracy (MAPE 8.5%). 
                Slight volatility in Marketing variance identified. COGS anomaly and customer churn require immediate attention.
                Q1 2025 forecast shows continued growth momentum with 95% confidence.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Trend Analysis */}
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-slate-50 to-white border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Trend Analysis - Revenue vs Budget</CardTitle>
              <p className="text-sm text-slate-600 mt-1">
                Historical performance with 4-month forecast and 95% confidence interval
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowYoY(!showYoY)}
                className="shadow-sm"
              >
                {showYoY ? 'Hide' : 'Show'} YoY
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <ResponsiveContainer width="100%" height={450}>
            <ComposedChart data={trendData}>
              <defs>
                <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05}/>
                </linearGradient>
                <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.05}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey="month" 
                tick={{ fill: '#64748b', fontSize: 12 }}
              />
              <YAxis 
                tick={{ fill: '#64748b', fontSize: 12 }}
                tickFormatter={(value) => `₹${value}L`}
              />
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white p-4 shadow-xl border-2 border-slate-200 rounded-lg text-sm">
                        <p className="font-medium text-slate-900 mb-2">{data.month}</p>
                        {data.actual > 0 && <p className="text-blue-600 font-medium">Actual: ₹{data.actual}L</p>}
                        {data.budget > 0 && <p className="text-slate-600">Budget: ₹{data.budget}L</p>}
                        {data.forecast > 0 && (
                          <>
                            <p className="text-purple-600 font-medium">Forecast: ₹{data.forecast}L</p>
                            <p className="text-xs text-slate-500 bg-slate-50 px-2 py-1 rounded mt-1">
                              95% CI: ₹{data.lowerBound}–₹{data.upperBound}L
                            </p>
                          </>
                        )}
                        {data.anomaly && (
                          <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded">
                            <p className="text-xs text-red-700 font-medium">🔴 Revenue spike detected</p>
                            <p className="text-xs text-red-600">New enterprise deal</p>
                          </div>
                        )}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend />
              <ReferenceLine x="Dec" stroke="#94a3b8" strokeDasharray="3 3" label="Current" />
              
              {/* Confidence band */}
              <Area
                type="monotone"
                dataKey="upperBound"
                stroke="none"
                fill="#8b5cf6"
                fillOpacity={0.1}
              />
              <Area
                type="monotone"
                dataKey="lowerBound"
                stroke="none"
                fill="#8b5cf6"
                fillOpacity={0.1}
              />
              
              {/* Budget line */}
              <Line 
                type="monotone" 
                dataKey="budget" 
                stroke="#94a3b8" 
                strokeWidth={2} 
                strokeDasharray="5 5" 
                name="Budget"
                dot={{ fill: '#94a3b8', r: 3 }}
              />
              
              {/* Actual line with gradient area */}
              <Area
                type="monotone"
                dataKey="actual"
                stroke="#3b82f6"
                strokeWidth={3}
                fill="url(#colorActual)"
                name="Actual"
                dot={(props: any) => {
                  const { cx, cy, payload } = props;
                  if (payload.anomaly) {
                    return (
                      <circle cx={cx} cy={cy} r={7} fill="#ef4444" stroke="#fff" strokeWidth={2} />
                    );
                  }
                  if (payload.actual > 0) {
                    return <circle cx={cx} cy={cy} r={5} fill="#3b82f6" stroke="#fff" strokeWidth={2} />;
                  }
                  return null;
                }}
              />
              
              {/* Forecast line */}
              <Line 
                type="monotone" 
                dataKey="forecast" 
                stroke="#8b5cf6" 
                strokeWidth={3} 
                strokeDasharray="8 4" 
                name="Forecast"
                dot={{ fill: '#8b5cf6', r: 5, strokeWidth: 2, stroke: '#fff' }}
              />
              
              {/* YoY comparison */}
              {showYoY && (
                <Line 
                  type="monotone" 
                  dataKey="yoy" 
                  stroke="#10b981" 
                  strokeWidth={2} 
                  strokeDasharray="3 3" 
                  name="YoY"
                  dot={false}
                />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Revenue, Expenses & Profit Composition */}
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-slate-50 to-white border-b">
          <CardTitle>Revenue, Expenses & Profit Analysis</CardTitle>
          <p className="text-sm text-slate-600 mt-1">
            Monthly breakdown of revenue streams and cost structure
          </p>
        </CardHeader>
        <CardContent className="pt-6">
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={monthlyRevenue}>
              <defs>
                <linearGradient id="colorRevBar" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.9}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.7}/>
                </linearGradient>
                <linearGradient id="colorExpBar" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.9}/>
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.7}/>
                </linearGradient>
                <linearGradient id="colorProfitBar" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.9}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.7}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" tick={{ fill: '#64748b' }} />
              <YAxis tick={{ fill: '#64748b' }} tickFormatter={(value) => `₹${value}L`} />
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white p-4 shadow-xl border-2 border-slate-200 rounded-lg text-sm space-y-2">
                        <p className="font-medium text-slate-900">{data.month}</p>
                        <div className="space-y-1">
                          <p className="text-blue-600">Revenue: ₹{data.revenue}L</p>
                          <p className="text-amber-600">Expenses: ₹{data.expenses}L</p>
                          <p className="text-green-600 font-medium">Profit: ₹{data.profit}L ({((data.profit / data.revenue) * 100).toFixed(1)}%)</p>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend />
              <Bar dataKey="revenue" fill="url(#colorRevBar)" name="Revenue" radius={[8, 8, 0, 0]} />
              <Bar dataKey="expenses" fill="url(#colorExpBar)" name="Expenses" radius={[8, 8, 0, 0]} />
              <Bar dataKey="profit" fill="url(#colorProfitBar)" name="Profit" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Performance Metrics Radar */}
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-slate-50 to-white border-b">
          <CardTitle>Performance Metrics Overview</CardTitle>
          <p className="text-sm text-slate-600 mt-1">
            Multi-dimensional performance assessment against targets
          </p>
        </CardHeader>
        <CardContent className="pt-6">
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart data={performanceMetrics}>
              <PolarGrid stroke="#cbd5e1" />
              <PolarAngleAxis dataKey="metric" tick={{ fill: '#64748b', fontSize: 11 }} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#64748b' }} />
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white p-3 shadow-xl border-2 border-slate-200 rounded-lg text-sm">
                        <p className="font-medium text-slate-900">{data.metric}</p>
                        <p className="text-blue-600">Current: {data.value}%</p>
                        <p className="text-slate-600">Target: {data.target}%</p>
                        <Badge className={
                          data.status === 'excellent' ? 'bg-green-100 text-green-700 mt-1' :
                          data.status === 'good' ? 'bg-blue-100 text-blue-700 mt-1' :
                          'bg-amber-100 text-amber-700 mt-1'
                        }>
                          {data.status.toUpperCase()}
                        </Badge>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Radar 
                name="Current" 
                dataKey="value" 
                stroke="#3b82f6" 
                fill="#3b82f6" 
                fillOpacity={0.6} 
                strokeWidth={2}
              />
              <Radar 
                name="Target" 
                dataKey="target" 
                stroke="#94a3b8" 
                fill="#94a3b8" 
                fillOpacity={0.2} 
                strokeDasharray="5 5"
                strokeWidth={2}
              />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Enhanced Budget Variance Analysis */}
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-slate-50 to-white border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Budget Variance Analysis (By Category)</CardTitle>
              <p className="text-sm text-slate-600 mt-1">Click on a category for detailed drill-through analysis</p>
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="variance">Sort by ₹</SelectItem>
                <SelectItem value="variancePct">Sort by %</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={sortedVarianceData}>
              <defs>
                <linearGradient id="colorBudget" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#94a3b8" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorActualVar" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0F766E" stopOpacity={0.7}/>
                  <stop offset="95%" stopColor="#0F766E" stopOpacity={0.3}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey="category" 
                tick={{ fill: '#64748b', fontSize: 11 }}
                angle={-15}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                tick={{ fill: '#64748b', fontSize: 12 }}
                tickFormatter={(value) => `₹${value}L`}
              />
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white p-4 shadow-xl border-2 border-slate-200 rounded-lg text-sm space-y-2">
                        <p className="font-medium text-slate-900">{data.category}</p>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                          <span className="text-slate-600">Budget:</span>
                          <span className="font-medium">₹{data.budget}L</span>
                          <span className="text-slate-600">Actual:</span>
                          <span className="font-medium">₹{data.actual}L</span>
                        </div>
                        <div className={`p-2 rounded ${data.variance > 0 ? 'bg-red-50' : 'bg-green-50'}`}>
                          <p className={data.variance > 0 ? 'text-red-700 font-medium' : 'text-green-700 font-medium'}>
                            Variance: {data.variance > 0 ? '+' : ''}₹{data.variance}L ({data.variancePct > 0 ? '+' : ''}{data.variancePct.toFixed(1)}%)
                          </p>
                          <p className="text-xs text-slate-600 mt-1">
                            {data.variance > 0 ? 'Overrun' : 'Savings'}
                          </p>
                        </div>
                        <p className="text-xs text-slate-600 bg-slate-50 px-2 py-1 rounded">
                          EBITDA Impact: {data.impact > 0 ? '+' : ''}{data.impact.toFixed(1)} pts
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="budget" 
                stroke="#94a3b8" 
                fill="url(#colorBudget)"
                strokeWidth={2}
                name="Budget"
              />
              <Area 
                type="monotone" 
                dataKey="actual" 
                stroke="#0F766E" 
                fill="url(#colorActualVar)"
                strokeWidth={3}
                name="Actual"
              />
            </AreaChart>
          </ResponsiveContainer>

          {/* Variance Summary Cards */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {sortedVarianceData.map((item) => (
              <div 
                key={item.category}
                className={`p-4 rounded-xl border-2 shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer ${
                  item.variance > 0 
                    ? 'bg-gradient-to-br from-red-50 to-red-100 border-red-300 hover:border-red-400' 
                    : 'bg-gradient-to-br from-green-50 to-green-100 border-green-300 hover:border-green-400'
                }`}
              >
                <div className="text-xs text-slate-700 mb-2 font-medium truncate">{item.category}</div>
                <div className={`text-base ${item.variance > 0 ? 'text-red-700' : 'text-green-700'} font-medium`}>
                  {item.variance > 0 ? '+' : ''}₹{item.variance}L
                </div>
                <div className="text-xs text-slate-600 mt-1 font-medium">
                  {item.variancePct > 0 ? '+' : ''}{item.variancePct.toFixed(1)}%
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Anomaly Detection */}
      <Card className="shadow-lg border-orange-200">
        <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
                Anomaly Detection
              </CardTitle>
              <div className="flex items-start gap-2 mt-2">
                <Sparkles className="w-4 h-4 text-orange-600 mt-0.5" />
                <p className="text-sm text-slate-700">
                  Detected <span className="font-medium text-orange-700">{anomalyData.length} anomalies</span> this month – Daily Revenue (High), COGS% (Medium), Customer Churn (High), Gross Margin (Medium). 
                  Key drivers: pricing, retention, and supply chain issues.
                </p>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50">
                  <TableHead className="font-medium">Metric</TableHead>
                  <TableHead className="font-medium">Expected</TableHead>
                  <TableHead className="font-medium">Actual</TableHead>
                  <TableHead className="font-medium">Deviation</TableHead>
                  <TableHead className="font-medium">
                    <div className="flex items-center gap-1">
                      Z-Score
                      <TooltipProvider>
                        <TooltipUI>
                          <TooltipTrigger>
                            <Info className="w-3 h-3 text-slate-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs">Statistical significance (&gt;2 = significant)</p>
                          </TooltipContent>
                        </TooltipUI>
                      </TooltipProvider>
                    </div>
                  </TableHead>
                  <TableHead className="font-medium">Significance</TableHead>
                  <TableHead className="font-medium">Severity Score</TableHead>
                  <TableHead className="font-medium">Action Required</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {anomalyData.map((anomaly, index) => (
                  <TableRow key={index} className="hover:bg-orange-50 cursor-pointer group transition-colors">
                    <TableCell>
                      <div>
                        <div className="font-medium text-slate-900">{anomaly.metric}</div>
                        <div className="flex gap-1 mt-1">
                          <div className="text-xs text-slate-600 bg-slate-100 px-2 py-1 rounded-md">
                            {anomaly.rootCause}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{anomaly.expected}{anomaly.metric.includes('%') ? '%' : 'L'}</TableCell>
                    <TableCell className={`font-medium ${anomaly.deviation > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {anomaly.actual}{anomaly.metric.includes('%') ? '%' : 'L'}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-2.5 w-24 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${Math.abs(anomaly.deviation) > 5 ? 'bg-gradient-to-r from-red-500 to-red-600' : 'bg-gradient-to-r from-orange-500 to-orange-600'}`}
                            style={{ width: `${Math.min(Math.abs(anomaly.deviation) * 10, 100)}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">
                          {anomaly.deviation > 0 ? '+' : ''}{anomaly.deviation}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-purple-600">{anomaly.zScore.toFixed(1)}</TableCell>
                    <TableCell>
                      <Badge 
                        className={
                          anomaly.significance === 'High' ? 'bg-red-100 text-red-700 border border-red-300' : 
                          anomaly.significance === 'Medium' ? 'bg-amber-100 text-amber-700 border border-amber-300' : 
                          'bg-slate-100 text-slate-700 border border-slate-300'
                        }
                      >
                        {anomaly.significance === 'High' && '🔴 '}
                        {anomaly.significance === 'Medium' && '🟡 '}
                        {anomaly.significance === 'Low' && '🟢 '}
                        {anomaly.significance}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="text-sm font-medium text-slate-900">
                          {(Math.abs(anomaly.zScore) * Math.abs(anomaly.deviation) / 10).toFixed(1)}
                        </div>
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <div 
                              key={i}
                              className={`w-1.5 h-4 rounded-sm ${
                                i < Math.ceil((Math.abs(anomaly.zScore) * Math.abs(anomaly.deviation) / 10) / 2)
                                  ? 'bg-gradient-to-t from-red-600 to-red-500'
                                  : 'bg-slate-200'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-slate-700 max-w-xs">
                      <div className="flex items-start gap-1">
                        <Zap className="w-3 h-3 text-amber-600 mt-0.5 flex-shrink-0" />
                        <span>{anomaly.action}</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
