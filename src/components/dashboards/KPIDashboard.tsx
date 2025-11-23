import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Target, TrendingUp, CheckCircle, AlertCircle, Building2, IndianRupee, Calendar, Database, Info, BarChart2, Download, TrendingDown, Activity, DollarSign, Percent, Lightbulb, ArrowUpRight, ArrowDownRight, ChevronDown, Filter, Bell, Calculator, FileDown } from 'lucide-react';
import { Progress } from '../ui/progress';
import { useState } from 'react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '../ui/hover-card';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '../ui/sheet';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { toast } from 'sonner@2.0.3';

// Financial ratios data with trends
const profitabilityRatios = [
  {
    id: 'gross-margin',
    name: 'Gross Margin %',
    value: 42.5,
    target: 40.0,
    industry: 38.5,
    change: 2.3,
    trend: [38.2, 39.5, 40.1, 41.2, 41.8, 42.5],
    status: 'excellent',
    formula: '(Revenue - COGS) / Revenue × 100',
    insight: 'Gross margin improved 2.3pts YoY driven by favorable product mix and procurement cost optimization.',
    category: 'Profitability',
  },
  {
    id: 'ebitda-margin',
    name: 'EBITDA Margin %',
    value: 22.7,
    target: 24.0,
    industry: 20.0,
    change: 1.8,
    trend: [20.2, 20.8, 21.5, 22.0, 22.3, 22.7],
    status: 'good',
    formula: 'EBITDA / Revenue × 100',
    insight: 'EBITDA margin trending upward, currently 1.3pts below target but 2.7pts above industry average.',
    category: 'Profitability',
  },
  {
    id: 'net-margin',
    name: 'Net Profit Margin %',
    value: 15.8,
    target: 16.0,
    industry: 13.5,
    change: 1.2,
    trend: [14.2, 14.6, 15.0, 15.3, 15.5, 15.8],
    status: 'good',
    formula: 'Net Profit / Revenue × 100',
    insight: 'Net margin near target with steady improvement, outperforming industry by 2.3pts.',
    category: 'Profitability',
  },
  {
    id: 'roe',
    name: 'Return on Equity (ROE)',
    value: 18.5,
    target: 18.0,
    industry: 15.2,
    change: 0.8,
    trend: [17.2, 17.5, 17.8, 18.0, 18.2, 18.5],
    status: 'excellent',
    formula: 'Net Profit / Average Equity × 100',
    insight: 'ROE exceeds target, demonstrating strong shareholder returns and efficient equity utilization.',
    category: 'Profitability',
  },
  {
    id: 'roa',
    name: 'Return on Assets (ROA)',
    value: 8.2,
    target: 10.0,
    industry: 7.5,
    change: -2.0,
    trend: [10.5, 10.2, 9.8, 9.2, 8.6, 8.2],
    status: 'needs-improvement',
    formula: 'Net Profit / Average Total Assets × 100',
    insight: 'ROA dropped 2pts due to 8% increase in fixed assets while profit remained relatively flat.',
    category: 'Profitability',
  },
];

const liquidityRatios = [
  {
    id: 'current-ratio',
    name: 'Current Ratio',
    value: 2.1,
    target: 2.0,
    industry: 1.8,
    change: 0.15,
    trend: [1.85, 1.92, 1.98, 2.05, 2.08, 2.1],
    status: 'excellent',
    formula: 'Current Assets / Current Liabilities',
    insight: 'Strong liquidity position with adequate current assets to cover short-term obligations.',
    category: 'Liquidity',
  },
  {
    id: 'quick-ratio',
    name: 'Quick Ratio',
    value: 1.5,
    target: 1.2,
    industry: 1.1,
    change: 0.12,
    trend: [1.32, 1.38, 1.42, 1.45, 1.48, 1.5],
    status: 'excellent',
    formula: '(Current Assets - Inventory) / Current Liabilities',
    insight: 'Quick ratio well above target, indicating strong ability to meet immediate obligations.',
    category: 'Liquidity',
  },
];

const efficiencyRatios = [
  {
    id: 'inventory-turnover',
    name: 'Inventory Turnover',
    value: 8.5,
    target: 10.0,
    industry: 7.2,
    change: 0.8,
    trend: [7.2, 7.5, 7.9, 8.1, 8.3, 8.5],
    status: 'good',
    formula: 'COGS / Average Inventory',
    insight: 'Inventory turnover improving but still below target; opportunity for working capital optimization.',
    category: 'Efficiency',
  },
  {
    id: 'asset-turnover',
    name: 'Asset Turnover',
    value: 1.2,
    target: 1.5,
    industry: 1.1,
    change: -0.15,
    trend: [1.42, 1.38, 1.32, 1.28, 1.24, 1.2],
    status: 'needs-improvement',
    formula: 'Revenue / Average Total Assets',
    insight: 'Asset turnover declining due to recent capital investments; expect improvement as new assets ramp up.',
    category: 'Efficiency',
  },
];

const leverageRatios = [
  {
    id: 'debt-equity',
    name: 'Debt to Equity',
    value: 0.45,
    target: 0.50,
    industry: 0.65,
    change: -0.05,
    trend: [0.58, 0.55, 0.52, 0.49, 0.47, 0.45],
    status: 'excellent',
    formula: 'Total Debt / Total Equity',
    insight: 'Conservative leverage position with debt well below industry average; room for strategic debt utilization.',
    category: 'Leverage',
  },
  {
    id: 'interest-coverage',
    name: 'Interest Coverage',
    value: 12.5,
    target: 10.0,
    industry: 8.5,
    change: 1.2,
    trend: [10.8, 11.2, 11.6, 11.9, 12.2, 12.5],
    status: 'excellent',
    formula: 'EBITDA / Interest Expense',
    insight: 'Strong interest coverage indicating low financial risk and capacity for additional debt if needed.',
    category: 'Leverage',
  },
];

const growthRatios = [
  {
    id: 'revenue-growth',
    name: 'Revenue Growth %',
    value: 18.5,
    target: 15.0,
    industry: 12.5,
    change: 3.5,
    trend: [12.2, 13.5, 15.0, 16.2, 17.5, 18.5],
    status: 'excellent',
    formula: '(Current Revenue - Prior Revenue) / Prior Revenue × 100',
    insight: 'Revenue growth exceeding target and industry, driven by strong market expansion and new product launches.',
    category: 'Growth',
  },
  {
    id: 'eps-growth',
    name: 'EPS Growth %',
    value: 22.3,
    target: 18.0,
    industry: 15.0,
    change: 4.3,
    trend: [15.5, 17.2, 18.8, 20.1, 21.2, 22.3],
    status: 'excellent',
    formula: '(Current EPS - Prior EPS) / Prior EPS × 100',
    insight: 'EPS growth outpacing revenue growth, reflecting operational leverage and margin expansion.',
    category: 'Growth',
  },
];

// Monthly trend data for trendline view
const monthlyTrendData = [
  { month: 'Jul', value: 20.2 },
  { month: 'Aug', value: 20.8 },
  { month: 'Sep', value: 21.5 },
  { month: 'Oct', value: 22.0 },
  { month: 'Nov', value: 22.3 },
  { month: 'Dec', value: 22.7 },
];

// All ratios combined
const allRatios = [...profitabilityRatios, ...liquidityRatios, ...efficiencyRatios, ...leverageRatios, ...growthRatios];

const STATUS_CONFIG = {
  excellent: { icon: '🟢', label: 'Excellent', color: 'bg-green-100 text-green-800 border-green-300' },
  good: { icon: '🟡', label: 'Good', color: 'bg-amber-100 text-amber-800 border-amber-300' },
  'needs-improvement': { icon: '🔴', label: 'Needs Improvement', color: 'bg-red-100 text-red-800 border-red-300' },
};

export function KPIDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState<'month' | 'quarter' | 'ytd'>('month');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedRatioId, setSelectedRatioId] = useState<string | null>(null);
  const [drillDownOpen, setDrillDownOpen] = useState(false);
  const [trendlineOpen, setTrendlineOpen] = useState(false);
  const [scenarioOpen, setScenarioOpen] = useState(false);
  const [benchmarkCompany, setBenchmarkCompany] = useState('Industry Avg');
  const [cogsReduction, setCogsReduction] = useState('0');

  // Filter ratios by category
  const displayedRatios = selectedCategory === 'All' 
    ? allRatios 
    : allRatios.filter(r => r.category === selectedCategory);

  // Get selected ratio details
  const selectedRatio = selectedRatioId ? allRatios.find(r => r.id === selectedRatioId) : null;

  // Calculate summary metrics
  const totalRatios = allRatios.length;
  const excellentCount = allRatios.filter(r => r.status === 'excellent').length;
  const goodCount = allRatios.filter(r => r.status === 'good').length;
  const needsImprovementCount = allRatios.filter(r => r.status === 'needs-improvement').length;
  const onTrackCount = excellentCount + goodCount;
  const avgPerformance = (allRatios.reduce((sum, r) => sum + (r.value / r.target) * 100, 0) / totalRatios);

  // Handle export
  const handleExport = (format: string) => {
    toast.success(`Exporting KPI Report as ${format}...`, {
      description: 'Your download will begin shortly.',
    });
  };

  // Handle drill-down
  const handleDrillDown = (ratioId: string) => {
    setSelectedRatioId(ratioId);
    setDrillDownOpen(true);
  };

  // Handle trendline view
  const handleTrendlineView = (ratioId: string) => {
    setSelectedRatioId(ratioId);
    setTrendlineOpen(true);
  };

  // Handle scenario simulation
  const handleScenarioSimulation = () => {
    const reduction = parseFloat(cogsReduction) || 0;
    const currentGrossMargin = 42.5;
    const revenue = 11000;
    const currentCOGS = 6325;
    const newCOGS = currentCOGS * (1 - reduction / 100);
    const newGrossMargin = ((revenue - newCOGS) / revenue) * 100;
    const improvement = newGrossMargin - currentGrossMargin;

    toast.success('Scenario Calculated', {
      description: `If COGS drops ${reduction}%, Gross Margin would increase to ${newGrossMargin.toFixed(1)}% (+${improvement.toFixed(1)}pts)`,
    });
  };

  // Set alert
  const handleSetAlert = () => {
    toast.success('Alert Set', {
      description: 'You will be notified when EBITDA% falls >2pts below target.',
    });
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* Context Ribbon */}
      <div className="bg-gradient-to-r from-teal-50 to-slate-50 border border-teal-200 rounded-lg px-6 py-3">
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-teal-600" />
            <span className="text-slate-700">Entity:</span>
            <span className="text-slate-900">ABC Pvt Ltd</span>
          </div>
          <div className="h-4 w-px bg-slate-300" />
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-teal-600" />
            <span className="text-slate-700">FY 2024–25</span>
          </div>
          <div className="h-4 w-px bg-slate-300" />
          <div className="flex items-center gap-2">
            <IndianRupee className="h-4 w-4 text-teal-600" />
            <span className="text-slate-700">Currency:</span>
            <span className="text-slate-900">INR</span>
          </div>
          <div className="h-4 w-px bg-slate-300" />
          <div className="flex items-center gap-2">
            <Database className="h-4 w-4 text-teal-600" />
            <span className="text-slate-700">Data as of:</span>
            <span className="text-slate-900">Dec 2024</span>
          </div>
        </div>
      </div>

      {/* Controls Bar */}
      <Card className="border-teal-200">
        <CardContent className="pt-6">
          <div className="flex flex-wrap items-center gap-4 justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-teal-600" />
                <span className="text-sm text-slate-700">Period:</span>
              </div>
              <Tabs value={selectedPeriod} onValueChange={(v) => setSelectedPeriod(v as any)}>
                <TabsList>
                  <TabsTrigger value="month">Month</TabsTrigger>
                  <TabsTrigger value="quarter">Quarter</TabsTrigger>
                  <TabsTrigger value="ytd">YTD</TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="h-6 w-px bg-slate-300" />

              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-700">Category:</span>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Ratios</SelectItem>
                    <SelectItem value="Profitability">Profitability</SelectItem>
                    <SelectItem value="Liquidity">Liquidity</SelectItem>
                    <SelectItem value="Efficiency">Efficiency</SelectItem>
                    <SelectItem value="Leverage">Leverage</SelectItem>
                    <SelectItem value="Growth">Growth</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="h-6 w-px bg-slate-300" />

              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-700">Benchmark:</span>
                <Select value={benchmarkCompany} onValueChange={setBenchmarkCompany}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Industry Avg">Industry Avg</SelectItem>
                    <SelectItem value="Competitor A">Competitor A</SelectItem>
                    <SelectItem value="Competitor B">Competitor B</SelectItem>
                    <SelectItem value="Best in Class">Best in Class</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleSetAlert} className="gap-2">
                <Bell className="h-4 w-4" />
                Set Alert
              </Button>
              <Dialog open={scenarioOpen} onOpenChange={setScenarioOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Calculator className="h-4 w-4" />
                    Scenario
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Scenario Simulation</DialogTitle>
                    <DialogDescription>
                      Model the impact of cost changes on profitability ratios
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="cogs-change">COGS Reduction (%)</Label>
                      <Input
                        id="cogs-change"
                        type="number"
                        placeholder="5"
                        value={cogsReduction}
                        onChange={(e) => setCogsReduction(e.target.value)}
                      />
                      <p className="text-xs text-slate-600">
                        Enter percentage reduction in Cost of Goods Sold
                      </p>
                    </div>
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                      <div className="text-sm text-slate-900 mb-2">Current Metrics</div>
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span className="text-slate-600">Revenue:</span>
                          <span className="text-slate-900">₹11,000L</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">COGS:</span>
                          <span className="text-slate-900">₹6,325L</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Gross Margin:</span>
                          <span className="text-slate-900">42.5%</span>
                        </div>
                      </div>
                    </div>
                    <Button onClick={handleScenarioSimulation} className="w-full bg-teal-600 hover:bg-teal-700">
                      Calculate Impact
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Download className="h-4 w-4" />
                    Export
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleExport('PDF')}>
                    Export as PDF
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExport('Excel')}>
                    Export as Excel
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-teal-100 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Ratios on Track</CardTitle>
            <CheckCircle className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-slate-900">{onTrackCount} / {totalRatios}</div>
            <p className="text-xs text-green-600 mt-1">{((onTrackCount / totalRatios) * 100).toFixed(1)}% achievement</p>
            <Progress value={(onTrackCount / totalRatios) * 100} className="mt-3 h-1" />
          </CardContent>
        </Card>

        <Card className="border-green-100 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Excellent Performance</CardTitle>
            <TrendingUp className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-green-900">{excellentCount} Ratios</div>
            <p className="text-xs text-green-600 mt-1">Exceeding targets</p>
            <Progress value={(excellentCount / totalRatios) * 100} className="mt-3 h-1" />
          </CardContent>
        </Card>

        <Card className="border-red-100 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Needs Attention</CardTitle>
            <AlertCircle className="h-5 w-5 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-red-900">{needsImprovementCount} Ratios</div>
            <p className="text-xs text-red-600 mt-1">Below target threshold</p>
            <Progress value={(needsImprovementCount / totalRatios) * 100} className="mt-3 h-1" />
          </CardContent>
        </Card>

        <Card className="border-teal-100 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Overall Score</CardTitle>
            <Target className="h-5 w-5 text-teal-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-slate-900">{avgPerformance.toFixed(0)}%</div>
            <p className="text-xs text-green-600 mt-1">
              {avgPerformance >= 100 ? 'Above target' : 'Below target'}
            </p>
            <Progress value={Math.min(avgPerformance, 150)} className="mt-3 h-1" />
          </CardContent>
        </Card>
      </div>

      {/* Financial Ratios Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedRatios.map((ratio) => (
          <Card 
            key={ratio.id}
            className="border-teal-100 hover:shadow-lg transition-all cursor-pointer group"
            onClick={() => handleDrillDown(ratio.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-sm mb-1">{ratio.name}</CardTitle>
                  <Badge variant="outline" className="text-xs">
                    {ratio.category}
                  </Badge>
                </div>
                <div className="flex items-center gap-1">
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <button className="p-1 hover:bg-slate-100 rounded" onClick={(e) => e.stopPropagation()}>
                        <Info className="h-4 w-4 text-slate-500" />
                      </button>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80">
                      <div className="space-y-2">
                        <h4 className="text-sm">{ratio.name}</h4>
                        <div className="text-xs text-slate-600">
                          <div className="mb-2">
                            <span className="">Formula:</span>
                            <div className="mt-1 font-mono bg-slate-50 p-2 rounded">
                              {ratio.formula}
                            </div>
                          </div>
                          <div>
                            <span className="">AI Insight:</span>
                            <p className="mt-1 text-slate-700">{ratio.insight}</p>
                          </div>
                        </div>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                  <button 
                    className="p-1 hover:bg-slate-100 rounded"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTrendlineView(ratio.id);
                    }}
                  >
                    <BarChart2 className="h-4 w-4 text-teal-600" />
                  </button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Value with Sparkline */}
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-2xl text-slate-900">{ratio.value}%</div>
                  <div className="flex items-center gap-1 mt-1">
                    {ratio.change > 0 ? (
                      <ArrowUpRight className="h-3 w-3 text-green-600" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3 text-red-600" />
                    )}
                    <span className={`text-xs ${ratio.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {ratio.change > 0 ? '+' : ''}{ratio.change}pts vs LY
                    </span>
                  </div>
                </div>
                {/* Mini Sparkline */}
                <div className="w-24 h-10">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={ratio.trend.map((v, i) => ({ value: v }))}>
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke={ratio.change > 0 ? '#10b981' : '#ef4444'} 
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Target and Industry */}
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div>
                    <span className="text-slate-600">Target:</span>
                    <span className="text-slate-900 ml-1">{ratio.target}%</span>
                  </div>
                  <div className="h-3 w-px bg-slate-300" />
                  <div>
                    <span className="text-slate-600">Industry:</span>
                    <span className="text-slate-900 ml-1">{ratio.industry}%</span>
                  </div>
                </div>
              </div>

              {/* Bi-color Progress Bar */}
              <div className="space-y-1">
                <div className="h-2 bg-slate-200 rounded-full overflow-hidden flex">
                  <div 
                    className={`h-full transition-all ${
                      ratio.value >= ratio.target ? 'bg-green-600' : 'bg-amber-600'
                    }`}
                    style={{ width: `${Math.min((ratio.value / ratio.target) * 100, 100)}%` }}
                  />
                  {ratio.value < ratio.target && (
                    <div 
                      className="h-full bg-slate-300"
                      style={{ width: `${100 - Math.min((ratio.value / ratio.target) * 100, 100)}%` }}
                    />
                  )}
                </div>
                <div className="flex justify-between text-xs text-slate-500">
                  <span>{((ratio.value / ratio.target) * 100).toFixed(0)}% of target</span>
                  <span>
                    {ratio.value > ratio.target 
                      ? `+${(ratio.value - ratio.target).toFixed(1)}`
                      : `${(ratio.value - ratio.target).toFixed(1)}`
                    }
                  </span>
                </div>
              </div>

              {/* Status Badge */}
              <div className="flex items-center justify-between">
                <Badge 
                  variant="outline"
                  className={`${STATUS_CONFIG[ratio.status].color} border`}
                >
                  {STATUS_CONFIG[ratio.status].icon} {STATUS_CONFIG[ratio.status].label}
                </Badge>
                <div className="text-xs text-slate-600">
                  {ratio.value > ratio.industry ? '📈' : '📉'} vs Industry
                </div>
              </div>

              {/* Trend Indicator */}
              <div className="flex items-center gap-1 text-xs text-slate-600">
                <Activity className="h-3 w-3" />
                <span>Trend:</span>
                <span className="font-mono">
                  {ratio.trend.map((v, i) => {
                    const height = Math.floor((v / Math.max(...ratio.trend)) * 5) + 1;
                    return ['▁', '▂', '▃', '▄', '▅', '▆', '▇', '█'][height] || '▁';
                  }).join('')}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* AI Insights Section */}
      <Card className="border-teal-200 bg-gradient-to-br from-white to-teal-50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-teal-600" />
            <CardTitle>AI Financial Summary</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="bg-white border border-teal-200 rounded-lg p-4">
            <p className="text-sm text-slate-700 leading-relaxed mb-4">
              "Margins are slightly below target but trending upward across all profitability metrics. Gross Margin strength 
              at 42.5% provides cushion for operational investments. ROA dipped 2pts due to asset expansion, while ROE remains 
              solid at 18.5%, indicating efficient capital structure. Profitability metrics outperform industry benchmarks by 
              18-22% on average, demonstrating competitive advantage. Liquidity position is robust with no short-term concerns. 
              Growth metrics are exceptional, significantly exceeding both internal targets and industry performance."
            </p>

            {/* Key Recommendations */}
            <div className="space-y-2">
              <div className="text-sm text-slate-900 mb-2">Key Recommendations:</div>
              <div className="space-y-2">
                <div className="flex items-start gap-2 text-sm">
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300 mt-0.5">
                    Opportunity
                  </Badge>
                  <span className="text-slate-700">
                    Focus on improving Inventory Turnover and Asset Turnover to enhance working capital efficiency.
                  </span>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-300 mt-0.5">
                    Watch
                  </Badge>
                  <span className="text-slate-700">
                    Monitor ROA trend as new assets ramp up; expect improvement in next 2-3 quarters.
                  </span>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300 mt-0.5">
                    Strength
                  </Badge>
                  <span className="text-slate-700">
                    Leverage conservative capital structure (0.45 D/E) for strategic growth initiatives.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Drill-Down Sheet */}
      <Sheet open={drillDownOpen} onOpenChange={setDrillDownOpen}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{selectedRatio?.name} - Detailed Analysis</SheetTitle>
            <SheetDescription>
              Deep dive into {selectedRatio?.name.toLowerCase()} components and trends
            </SheetDescription>
          </SheetHeader>

          {selectedRatio && (
            <div className="mt-6 space-y-6">
              {/* Current Performance */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                <div className="text-sm text-slate-700 mb-3">Current Performance</div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-xs text-slate-600 mb-1">Actual</div>
                    <div className="text-xl text-slate-900">{selectedRatio.value}%</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-600 mb-1">Target</div>
                    <div className="text-xl text-slate-900">{selectedRatio.target}%</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-600 mb-1">Industry</div>
                    <div className="text-xl text-slate-900">{selectedRatio.industry}%</div>
                  </div>
                </div>
              </div>

              {/* 6-Month Trend */}
              <div>
                <div className="text-sm text-slate-700 mb-3">6-Month Trend</div>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={selectedRatio.trend.map((v, i) => ({ 
                    month: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
                    value: v,
                    target: selectedRatio.target,
                    industry: selectedRatio.industry
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} />
                    <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="value" stroke="#0F766E" strokeWidth={2} name="Actual" />
                    <Line type="monotone" dataKey="target" stroke="#DC2626" strokeDasharray="5 5" name="Target" />
                    <Line type="monotone" dataKey="industry" stroke="#94a3b8" strokeDasharray="3 3" name="Industry" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Formula */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="text-sm text-slate-900 mb-2">Calculation Formula</div>
                <div className="text-xs font-mono bg-white p-3 rounded border border-blue-200">
                  {selectedRatio.formula}
                </div>
              </div>

              {/* AI Insight */}
              <div className="bg-teal-50 border-l-4 border-teal-600 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <Lightbulb className="h-4 w-4 text-teal-600 mt-0.5" />
                  <div>
                    <div className="text-sm text-slate-900 mb-1">AI Insight</div>
                    <p className="text-xs text-slate-700">{selectedRatio.insight}</p>
                  </div>
                </div>
              </div>

              {/* Drill-down specific content based on ratio */}
              {selectedRatio.id === 'gross-margin' && (
                <div>
                  <div className="text-sm text-slate-700 mb-3">Product-Level Profitability</div>
                  <div className="space-y-2">
                    {[
                      { product: 'Product A', margin: 48.5, revenue: 4500 },
                      { product: 'Product B', margin: 42.0, revenue: 3800 },
                      { product: 'Product C', margin: 38.2, revenue: 2700 },
                    ].map((item) => (
                      <div key={item.product} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                        <span className="text-sm text-slate-900">{item.product}</span>
                        <div className="flex items-center gap-4">
                          <span className="text-xs text-slate-600">₹{item.revenue}L</span>
                          <Badge variant="outline" className={item.margin >= 40 ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}>
                            {item.margin}%
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Trendline Dialog */}
      <Dialog open={trendlineOpen} onOpenChange={setTrendlineOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedRatio?.name} - 6-Month Trendline</DialogTitle>
            <DialogDescription>
              Detailed trend analysis with target and industry benchmarks
            </DialogDescription>
          </DialogHeader>
          
          {selectedRatio && (
            <div className="space-y-4">
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={selectedRatio.trend.map((v, i) => ({ 
                  month: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
                  value: v,
                  target: selectedRatio.target,
                  industry: selectedRatio.industry
                }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 12 }} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="value" stroke="#0F766E" fill="#0F766E" fillOpacity={0.6} name="Actual" />
                  <Line type="monotone" dataKey="target" stroke="#DC2626" strokeWidth={2} strokeDasharray="5 5" name="Target" />
                  <Line type="monotone" dataKey="industry" stroke="#94a3b8" strokeWidth={2} strokeDasharray="3 3" name="Industry" />
                </AreaChart>
              </ResponsiveContainer>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="text-xs text-green-700 mb-1">Trend Direction</div>
                  <div className="text-sm text-slate-900">
                    {selectedRatio.change > 0 ? '📈 Upward' : '📉 Downward'}
                  </div>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="text-xs text-blue-700 mb-1">6-Month Change</div>
                  <div className="text-sm text-slate-900">
                    {selectedRatio.change > 0 ? '+' : ''}{selectedRatio.change}pts
                  </div>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                  <div className="text-xs text-purple-700 mb-1">vs Industry</div>
                  <div className="text-sm text-slate-900">
                    +{(selectedRatio.value - selectedRatio.industry).toFixed(1)}pts
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
