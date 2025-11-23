import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, ReferenceLine, Cell, FunnelChart, Funnel, LabelList } from 'recharts';
import { ShoppingCart, TrendingUp, Users, Target, Building2, IndianRupee, Calendar, Database, Download, ChevronDown, Lightbulb, Play, Pause, Info, ArrowUpRight, ArrowDownRight, Filter, Award, AlertTriangle, TrendingDown } from 'lucide-react';
import { useState, useMemo } from 'react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '../ui/hover-card';
import { Progress } from '../ui/progress';
import { toast } from 'sonner@2.0.3';

// Sales trend data with new/repeat customer split
const salesTrendData = [
  { month: 'Jul', newCustomer: 18, repeatCustomer: 72, avgTicket: 38 },
  { month: 'Aug', newCustomer: 20, repeatCustomer: 78, avgTicket: 39 },
  { month: 'Sep', newCustomer: 22, repeatCustomer: 82, avgTicket: 40 },
  { month: 'Oct', newCustomer: 19, repeatCustomer: 85, avgTicket: 41 },
  { month: 'Nov', newCustomer: 21, repeatCustomer: 82, avgTicket: 42 },
  { month: 'Dec', newCustomer: 24, repeatCustomer: 86, avgTicket: 42 },
];

// Sales funnel data
const funnelData = [
  { stage: 'Leads', count: 600, value: 360, conversion: 100, avgTicket: 60, color: '#3B82F6' },
  { stage: 'Proposal', count: 225, value: 135, conversion: 50, avgTicket: 60, color: '#0F766E' },
  { stage: 'Negotiation', count: 140, value: 98, conversion: 62, avgTicket: 70, color: '#F59E0B' },
  { stage: 'Closed Won', count: 95, value: 76, conversion: 68, avgTicket: 80, color: '#10B981' },
];

// Product performance data
const productData = [
  { id: 1, product: 'ERP Solution', revenue: 35, margin: 62.9, growth: 18, share: 31.8, trend: [28, 30, 32, 33, 34, 35], performance: 'Excellent' },
  { id: 2, product: 'Analytics Suite', revenue: 28, margin: 58.5, growth: 25, share: 25.5, trend: [20, 22, 24, 26, 27, 28], performance: 'Excellent' },
  { id: 3, product: 'CRM Platform', revenue: 22, margin: 55.2, growth: 12, share: 20.0, trend: [18, 19, 20, 21, 21, 22], performance: 'Good' },
  { id: 4, product: 'Cloud Services', revenue: 15, margin: 48.8, growth: 8, share: 13.6, trend: [13, 13, 14, 14, 15, 15], performance: 'Good' },
  { id: 5, product: 'Mobile App', revenue: 10, margin: 42.1, growth: -5, share: 9.1, trend: [12, 11, 11, 10, 10, 10], performance: 'Declining' },
];

// Top customers data
const topCustomers = [
  { id: 1, name: 'TechCorp Solutions', revenue: 12.5, profit: 7.8, growth: 15, segment: 'Enterprise', dso: 42, lastPurchase: 'Dec 15, 2024', profitTrend: [6.5, 6.8, 7.0, 7.3, 7.5, 7.8] },
  { id: 2, name: 'Global Industries', revenue: 10.2, profit: 6.1, growth: 22, segment: 'Enterprise', dso: 38, lastPurchase: 'Dec 20, 2024', profitTrend: [4.5, 4.9, 5.3, 5.6, 5.9, 6.1] },
  { id: 3, name: 'InnovateTech Ltd', revenue: 8.8, profit: 5.2, growth: 8, segment: 'SME', dso: 45, lastPurchase: 'Dec 18, 2024', profitTrend: [4.7, 4.8, 4.9, 5.0, 5.1, 5.2] },
  { id: 4, name: 'DataMasters Inc', revenue: 7.5, profit: 4.5, growth: 18, segment: 'SME', dso: 35, lastPurchase: 'Dec 22, 2024', profitTrend: [3.2, 3.5, 3.8, 4.1, 4.3, 4.5] },
  { id: 5, name: 'CloudFirst Systems', revenue: 6.8, profit: 4.0, growth: 12, segment: 'SME', dso: 40, lastPurchase: 'Dec 19, 2024', profitTrend: [3.3, 3.5, 3.6, 3.8, 3.9, 4.0] },
];

// Customer retention cohort data
const retentionCohortData = [
  { cohort: 'Jul', m0: 100, m1: 92, m2: 88, m3: 84, m4: 81, m5: 78, m6: 75 },
  { cohort: 'Aug', m0: 100, m1: 94, m2: 90, m3: 86, m4: 82, m5: 79, m6: 0 },
  { cohort: 'Sep', m0: 100, m1: 93, m2: 89, m3: 84, m4: 80, m5: 0, m6: 0 },
  { cohort: 'Oct', m0: 100, m1: 95, m2: 91, m3: 87, m4: 0, m5: 0, m6: 0 },
  { cohort: 'Nov', m0: 100, m1: 96, m2: 92, m3: 0, m4: 0, m5: 0, m6: 0 },
  { cohort: 'Dec', m0: 100, m1: 94, m2: 0, m3: 0, m4: 0, m5: 0, m6: 0 },
];

const PERFORMANCE_COLORS = {
  Excellent: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300' },
  Good: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-300' },
  Declining: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-300' },
};

const SEGMENT_COLORS = {
  Enterprise: { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-300' },
  SME: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-300' },
  Retail: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300' },
};

export function SalesInsightDashboard() {
  const [chartView, setChartView] = useState<'split' | 'stacked'>('split');
  const [sortBy, setSortBy] = useState<'revenue' | 'margin' | 'growth'>('revenue');
  const [customerSortBy, setCustomerSortBy] = useState<'revenue' | 'profit' | 'growth'>('revenue');
  const [isPlaying, setIsPlaying] = useState(false);
  const [showAIInsights, setShowAIInsights] = useState(false);

  // Calculate KPIs
  const totalSales = salesTrendData[salesTrendData.length - 1].newCustomer + salesTrendData[salesTrendData.length - 1].repeatCustomer;
  const previousSales = salesTrendData[salesTrendData.length - 2].newCustomer + salesTrendData[salesTrendData.length - 2].repeatCustomer;
  const salesGrowth = ((totalSales - previousSales) / previousSales) * 100;
  
  const currentNewCustomers = salesTrendData[salesTrendData.length - 1].newCustomer;
  const previousNewCustomers = salesTrendData[salesTrendData.length - 2].newCustomer;
  const newCustomerGrowth = ((currentNewCustomers - previousNewCustomers) / previousNewCustomers) * 100;
  
  const avgTicketSize = salesTrendData[salesTrendData.length - 1].avgTicket;
  const previousAvgTicket = salesTrendData[salesTrendData.length - 2].avgTicket;
  const ticketGrowth = ((avgTicketSize - previousAvgTicket) / previousAvgTicket) * 100;
  
  const winRate = (funnelData[funnelData.length - 1].count / funnelData[0].count) * 100;
  const targetWinRate = 35;
  const winRateChange = 4.0;
  
  const newCustomerRatio = (currentNewCustomers / totalSales) * 100;
  const repeatCustomerRatio = 100 - newCustomerRatio;

  // KPI sparklines
  const salesSparkline = salesTrendData.map(d => d.newCustomer + d.repeatCustomer);
  const winRateSparkline = [26, 28, 30, 30, 32, 32];
  const avgTicketSparkline = salesTrendData.map(d => d.avgTicket);
  const newCustomerSparkline = salesTrendData.map(d => d.newCustomer);

  // Sort product data
  const sortedProducts = useMemo(() => {
    return [...productData].sort((a, b) => b[sortBy] - a[sortBy]);
  }, [sortBy]);

  // Sort customer data
  const sortedCustomers = useMemo(() => {
    return [...topCustomers].sort((a, b) => b[customerSortBy] - a[customerSortBy]);
  }, [customerSortBy]);

  // Calculate top 5 concentration
  const totalRevenue = productData.reduce((sum, p) => sum + p.revenue, 0);
  const top5Concentration = (topCustomers.reduce((sum, c) => sum + c.revenue, 0) / totalRevenue) * 100;

  // Toggle narration
  const toggleNarration = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      toast.info('AI Narration Started', {
        description: 'Playing sales insights analysis...',
      });
    } else {
      toast.info('AI Narration Paused');
    }
  };

  // Handle export
  const handleExport = (format: string) => {
    toast.success(`Exporting ${format}...`, {
      description: 'Your download will begin shortly.',
    });
  };

  // Show AI insights
  const showInsights = () => {
    setShowAIInsights(true);
    toast.success('AI Insights Generated', {
      description: 'Comprehensive sales analysis is ready.',
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
            <span className="text-slate-700">Reporting Currency:</span>
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

      {/* AI Insights Summary Card */}
      <Card className="border-teal-200 bg-gradient-to-br from-white to-teal-50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="relative flex-shrink-0">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-teal-600 to-teal-800 flex items-center justify-center overflow-hidden border-2 border-teal-300">
                <Users className="w-8 h-8 text-white" />
              </div>
              {isPlaying && (
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center border-2 border-white">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="text-slate-900">AI Sales Summary (Dec 2024)</h3>
                  <p className="text-sm text-slate-600">Automated insights on sales performance and trends</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleNarration}
                  className="ml-4"
                >
                  {isPlaying ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                  {isPlaying ? 'Pause' : 'Play'}
                </Button>
              </div>
              <div className="bg-white border border-teal-200 rounded-lg p-4 mt-3">
                <p className="text-sm text-slate-700 leading-relaxed">
                  "Revenue grew 6.8% MoM to ₹110L, driven by Analytics Suite (+25% growth) and strong repeat customer performance (+9%). 
                  Win Rate improved 4pts to 32%, approaching the 35% target. New customer acquisition accelerated with 24L in December 
                  (21.8% of total), while repeat customers contributed ₹86L (78.2%). Average ticket size remained stable at ₹42K. 
                  Product performance shows mixed signals - Analytics Suite and ERP Solution lead with excellent margins (58%+), while 
                  Mobile App segment declined 5% requiring strategic review. Customer concentration remains moderate with top 5 customers 
                  representing 41.6% of revenue. Retention metrics are healthy at 77% average 6-month retention with improving MoM trend (+2pts)."
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={showInsights}
            className="gap-2"
          >
            <Lightbulb className="h-4 w-4" />
            View AI Summary
          </Button>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              Export Report
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleExport('Executive Summary PDF')}>
              Executive Summary PDF
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleExport('Detailed Excel')}>
              Detailed Excel (Customer-level)
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Enhanced KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Sales */}
        <HoverCard>
          <HoverCardTrigger asChild>
            <Card className="border-teal-100 hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm">Total Sales</CardTitle>
                <ShoppingCart className="h-5 w-5 text-teal-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl text-slate-900">₹{totalSales}L</div>
                <div className="flex items-center gap-1 mt-1">
                  {salesGrowth > 0 ? (
                    <ArrowUpRight className="h-3 w-3 text-green-600" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 text-red-600" />
                  )}
                  <p className={`text-xs ${salesGrowth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {salesGrowth > 0 ? '+' : ''}{salesGrowth.toFixed(1)}% MoM
                  </p>
                </div>
                {/* Sparkline */}
                <div className="mt-2 h-8">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={salesSparkline.map((v, i) => ({ value: v }))}>
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#0F766E" 
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                {/* New/Repeat Split */}
                <div className="mt-2 text-xs text-slate-600">
                  <span className="text-teal-600">{newCustomerRatio.toFixed(0)}% New</span> / {repeatCustomerRatio.toFixed(0)}% Repeat
                </div>
              </CardContent>
            </Card>
          </HoverCardTrigger>
          <HoverCardContent className="w-80">
            <div className="space-y-2">
              <h4 className="text-sm">Total Sales Calculation</h4>
              <p className="text-xs text-slate-600 font-mono bg-slate-50 p-2 rounded">
                Total Sales = Σ Invoice Net Amount
              </p>
              <div className="pt-2 border-t text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-600">New Customers:</span>
                  <span className="text-slate-900">₹{currentNewCustomers}L</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Repeat Customers:</span>
                  <span className="text-slate-900">₹{salesTrendData[salesTrendData.length - 1].repeatCustomer}L</span>
                </div>
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>

        {/* Win Rate */}
        <HoverCard>
          <HoverCardTrigger asChild>
            <Card className={`border-2 hover:shadow-lg transition-shadow cursor-pointer ${
              winRate >= targetWinRate ? 'border-green-300 bg-green-50' : 'border-amber-300 bg-amber-50'
            }`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm">Win Rate</CardTitle>
                <Target className="h-5 w-5 text-teal-600" />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl ${winRate >= targetWinRate ? 'text-green-900' : 'text-amber-900'}`}>
                  {winRate.toFixed(1)}%
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <ArrowUpRight className="h-3 w-3 text-green-600" />
                  <p className="text-xs text-green-600">
                    +{winRateChange.toFixed(1)}pts improvement
                  </p>
                </div>
                {/* Sparkline */}
                <div className="mt-2 h-8">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={winRateSparkline.map((v, i) => ({ value: v }))}>
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#10B981" 
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-2 text-xs text-slate-600">
                  Target: {targetWinRate}%
                </div>
              </CardContent>
            </Card>
          </HoverCardTrigger>
          <HoverCardContent className="w-80">
            <div className="space-y-2">
              <h4 className="text-sm">Win Rate Calculation</h4>
              <p className="text-xs text-slate-600 font-mono bg-slate-50 p-2 rounded">
                Win Rate = Deals Won / Total Deals × 100
              </p>
              <div className="pt-2 border-t text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-600">Deals Won:</span>
                  <span className="text-slate-900">{funnelData[funnelData.length - 1].count}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Total Leads:</span>
                  <span className="text-slate-900">{funnelData[0].count}</span>
                </div>
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>

        {/* Avg Ticket Size */}
        <HoverCard>
          <HoverCardTrigger asChild>
            <Card className="border-teal-100 hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm">Avg Ticket Size</CardTitle>
                <TrendingUp className="h-5 w-5 text-teal-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl text-slate-900">₹{avgTicketSize}K</div>
                <div className="flex items-center gap-1 mt-1">
                  {ticketGrowth >= 0 ? (
                    <ArrowUpRight className="h-3 w-3 text-green-600" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 text-red-600" />
                  )}
                  <p className={`text-xs ${ticketGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {ticketGrowth >= 0 ? '+' : ''}{ticketGrowth.toFixed(1)}% change
                  </p>
                </div>
                {/* Sparkline */}
                <div className="mt-2 h-8">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={avgTicketSparkline.map((v, i) => ({ value: v }))}>
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#7C3AED" 
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-2 text-xs text-slate-600">
                  Target: ₹45K
                </div>
              </CardContent>
            </Card>
          </HoverCardTrigger>
          <HoverCardContent className="w-80">
            <div className="space-y-2">
              <h4 className="text-sm">Average Ticket Size Calculation</h4>
              <p className="text-xs text-slate-600 font-mono bg-slate-50 p-2 rounded">
                Avg Ticket Size = Revenue / No. of Invoices
              </p>
              <div className="pt-2 border-t text-xs">
                <p className="text-slate-600">Measures the average value per transaction, indicating pricing power and customer spend patterns.</p>
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>

        {/* New Customers */}
        <HoverCard>
          <HoverCardTrigger asChild>
            <Card className="border-teal-100 hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm">New Customers</CardTitle>
                <Users className="h-5 w-5 text-teal-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl text-slate-900">₹{currentNewCustomers}L</div>
                <div className="flex items-center gap-1 mt-1">
                  {newCustomerGrowth > 0 ? (
                    <ArrowUpRight className="h-3 w-3 text-green-600" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 text-red-600" />
                  )}
                  <p className={`text-xs ${newCustomerGrowth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {newCustomerGrowth > 0 ? '+' : ''}{newCustomerGrowth.toFixed(1)}% MoM
                  </p>
                </div>
                {/* Sparkline */}
                <div className="mt-2 h-8">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={newCustomerSparkline.map((v, i) => ({ value: v }))}>
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#F59E0B" 
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-2 text-xs text-slate-600">
                  Acquisition vs Retention
                </div>
              </CardContent>
            </Card>
          </HoverCardTrigger>
          <HoverCardContent className="w-80">
            <div className="space-y-2">
              <h4 className="text-sm">Customer Mix Analysis</h4>
              <div className="pt-2 text-xs space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">New Customers:</span>
                  <span className="text-teal-600">{newCustomerRatio.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Repeat Customers:</span>
                  <span className="text-blue-600">{repeatCustomerRatio.toFixed(1)}%</span>
                </div>
                <div className="pt-2 border-t">
                  <p className="text-slate-600">Healthy balance between acquisition ({newCustomerRatio.toFixed(0)}%) and retention ({repeatCustomerRatio.toFixed(0)}%) indicates sustainable growth.</p>
                </div>
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
      </div>

      {/* Sales Trend & Customer Mix Chart */}
      <Card className="border-teal-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Sales Trend & Customer Mix</CardTitle>
              <p className="text-sm text-slate-600 mt-1">Revenue breakdown by customer type with average ticket trend</p>
            </div>
            <Tabs value={chartView} onValueChange={(v) => setChartView(v as any)}>
              <TabsList>
                <TabsTrigger value="split">Split View</TabsTrigger>
                <TabsTrigger value="stacked">Stacked %</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={salesTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey="month" 
                tick={{ fill: '#64748b', fontSize: 12 }}
              />
              <YAxis 
                yAxisId="left"
                label={{ value: 'Sales Volume (₹L)', angle: -90, position: 'insideLeft', style: { fill: '#64748b', fontSize: 12 } }}
                tick={{ fill: '#64748b', fontSize: 12 }}
              />
              <YAxis 
                yAxisId="right"
                orientation="right"
                label={{ value: 'Avg Ticket (₹K)', angle: 90, position: 'insideRight', style: { fill: '#64748b', fontSize: 12 } }}
                tick={{ fill: '#64748b', fontSize: 12 }}
              />
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    const total = data.newCustomer + data.repeatCustomer;
                    const newPct = ((data.newCustomer / total) * 100).toFixed(0);
                    const repeatPct = ((data.repeatCustomer / total) * 100).toFixed(0);
                    return (
                      <div className="bg-white p-3 shadow-lg border border-slate-200 rounded-lg text-sm">
                        <p className="font-medium mb-2">{data.month} 2024</p>
                        <div className="space-y-1 text-xs">
                          <div className="flex justify-between gap-4">
                            <span className="text-slate-600">Total Sales:</span>
                            <span className="text-slate-900">₹{total}L</span>
                          </div>
                          <div className="flex justify-between gap-4">
                            <span className="text-teal-600">New:</span>
                            <span className="text-slate-900">₹{data.newCustomer}L ({newPct}%)</span>
                          </div>
                          <div className="flex justify-between gap-4">
                            <span className="text-blue-600">Repeat:</span>
                            <span className="text-slate-900">₹{data.repeatCustomer}L ({repeatPct}%)</span>
                          </div>
                          <div className="flex justify-between gap-4 pt-1 border-t">
                            <span className="text-slate-600">Avg Ticket:</span>
                            <span className="text-slate-900">₹{data.avgTicket}K</span>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend 
                verticalAlign="bottom"
                wrapperStyle={{ paddingTop: '20px' }}
              />
              
              {/* Target line for avg ticket */}
              <ReferenceLine yAxisId="right" y={45} stroke="#DC2626" strokeDasharray="5 5" label={{ value: 'Target ₹45K', fill: '#DC2626', fontSize: 11 }} />

              {chartView === 'split' ? (
                <>
                  <Area 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="repeatCustomer" 
                    stackId="1"
                    stroke="#0F766E" 
                    fill="#0F766E" 
                    fillOpacity={0.6}
                    name="Repeat Customers"
                  />
                  <Area 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="newCustomer" 
                    stackId="1"
                    stroke="#7C3AED" 
                    fill="#7C3AED" 
                    fillOpacity={0.6}
                    name="New Customers"
                  />
                </>
              ) : (
                <>
                  <Area 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="repeatCustomer" 
                    stackId="1"
                    stroke="#0F766E" 
                    fill="#0F766E" 
                    fillOpacity={0.6}
                    name="Repeat %"
                  />
                  <Area 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="newCustomer" 
                    stackId="1"
                    stroke="#7C3AED" 
                    fill="#7C3AED" 
                    fillOpacity={0.6}
                    name="New %"
                  />
                </>
              )}
              
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="avgTicket" 
                stroke="#F59E0B" 
                strokeWidth={2}
                dot={{ fill: '#F59E0B', r: 4 }}
                name="Avg Ticket"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Sales Funnel Analysis */}
      <Card className="border-teal-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Sales Funnel Analysis</CardTitle>
              <p className="text-sm text-slate-600 mt-1">Pipeline conversion rates and deal velocity</p>
            </div>
            <div className="text-sm">
              <span className="text-slate-600">Target Win Rate:</span>
              <span className="text-slate-900 ml-2">{targetWinRate}%</span>
              <span className={`ml-2 ${winRate >= targetWinRate ? 'text-green-600' : 'text-amber-600'}`}>
                (Current: {winRate.toFixed(1)}%)
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={funnelData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" tick={{ fill: '#64748b', fontSize: 12 }} />
              <YAxis dataKey="stage" type="category" width={120} tick={{ fill: '#64748b', fontSize: 12 }} />
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white p-3 shadow-lg border border-slate-200 rounded-lg text-sm">
                        <p className="font-medium mb-2">Stage: {data.stage}</p>
                        <div className="space-y-1 text-xs">
                          <div className="flex justify-between gap-4">
                            <span className="text-slate-600">Deals:</span>
                            <span className="text-slate-900">{data.count}</span>
                          </div>
                          <div className="flex justify-between gap-4">
                            <span className="text-slate-600">Conversion:</span>
                            <span className="text-slate-900">{data.conversion}%</span>
                          </div>
                          <div className="flex justify-between gap-4">
                            <span className="text-slate-600">Total Value:</span>
                            <span className="text-slate-900">₹{data.value}L</span>
                          </div>
                          <div className="flex justify-between gap-4">
                            <span className="text-slate-600">Avg Ticket:</span>
                            <span className="text-slate-900">₹{data.avgTicket}K</span>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend verticalAlign="bottom" wrapperStyle={{ paddingTop: '20px' }} />
              <Bar dataKey="count" name="Deal Count">
                {funnelData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
              <Line 
                type="monotone" 
                dataKey="conversion" 
                stroke="#DC2626" 
                strokeWidth={2}
                name="Conversion %"
                dot={{ fill: '#DC2626', r: 4 }}
              />
            </BarChart>
          </ResponsiveContainer>

          {/* Drop-off Analysis */}
          <div className="mt-6 grid grid-cols-3 gap-4">
            {funnelData.slice(0, -1).map((stage, index) => {
              const nextStage = funnelData[index + 1];
              const dropOff = ((stage.count - nextStage.count) / stage.count) * 100;
              return (
                <div 
                  key={stage.stage}
                  className="bg-slate-50 border border-slate-200 rounded-lg p-3"
                >
                  <div className="text-xs text-slate-600 mb-1">{stage.stage} → {nextStage.stage}</div>
                  <div className="text-sm text-red-600">-{dropOff.toFixed(0)}% drop-off</div>
                  <div className="text-xs text-slate-500 mt-1">{stage.count - nextStage.count} deals lost</div>
                </div>
              );
            })}
          </div>

          {/* Performance Gauge */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-700">Win Rate Progress</span>
              <span className="text-sm text-slate-900">{winRate.toFixed(1)}% / {targetWinRate}%</span>
            </div>
            <Progress value={(winRate / targetWinRate) * 100} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Product Performance Analysis Table */}
      <Card className="border-teal-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Product Performance Analysis</CardTitle>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600">Sort by:</span>
              <Tabs value={sortBy} onValueChange={(v) => setSortBy(v as any)}>
                <TabsList>
                  <TabsTrigger value="revenue">Revenue</TabsTrigger>
                  <TabsTrigger value="margin">Margin%</TabsTrigger>
                  <TabsTrigger value="growth">Growth</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead className="text-right">Revenue (₹L)</TableHead>
                <TableHead className="text-right">Share %</TableHead>
                <TableHead className="text-right">Margin %</TableHead>
                <TableHead className="text-right">Growth %</TableHead>
                <TableHead>Trend (3mo)</TableHead>
                <TableHead>Performance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedProducts.map((product) => (
                <HoverCard key={product.id}>
                  <HoverCardTrigger asChild>
                    <TableRow className="cursor-pointer hover:bg-teal-50">
                      <TableCell className="text-slate-900">{product.product}</TableCell>
                      <TableCell className="text-right">₹{product.revenue}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <span>{product.share.toFixed(1)}%</span>
                          <div className="w-12 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-teal-600"
                              style={{ width: `${product.share}%` }}
                            />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className={`text-right ${product.margin >= 50 ? 'text-green-600' : 'text-slate-900'}`}>
                        {product.margin}%
                      </TableCell>
                      <TableCell className={`text-right ${
                        product.growth > 10 ? 'text-green-600' : product.growth >= 0 ? 'text-amber-600' : 'text-red-600'
                      }`}>
                        {product.growth > 0 ? '+' : ''}{product.growth}%
                      </TableCell>
                      <TableCell>
                        <div className="w-16 h-6">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={product.trend.map((v, i) => ({ value: v }))}>
                              <Line 
                                type="monotone" 
                                dataKey="value" 
                                stroke={product.growth > 10 ? '#10B981' : product.growth >= 0 ? '#F59E0B' : '#EF4444'} 
                                strokeWidth={2}
                                dot={false}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline"
                          className={`${PERFORMANCE_COLORS[product.performance].bg} ${PERFORMANCE_COLORS[product.performance].text} border ${PERFORMANCE_COLORS[product.performance].border}`}
                        >
                          {product.performance}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80">
                    <div className="space-y-2">
                      <h4 className="text-sm">{product.product}</h4>
                      <p className="text-xs text-slate-600">
                        ₹{product.revenue}L revenue, {product.margin}% margin, {product.growth > 0 ? '+' : ''}{product.growth}% growth vs LY.
                      </p>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Top Customer Analysis */}
      <Card className="border-teal-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Top Customer Analysis</CardTitle>
              <div className="flex items-center gap-2 mt-2">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <span className="text-sm text-slate-600">
                  Top 5 Concentration:
                </span>
                <Badge 
                  variant="outline"
                  className={`${
                    top5Concentration <= 40 
                      ? 'bg-green-50 text-green-700 border-green-300'
                      : top5Concentration <= 60
                      ? 'bg-amber-50 text-amber-700 border-amber-300'
                      : 'bg-red-50 text-red-700 border-red-300'
                  }`}
                >
                  {top5Concentration.toFixed(1)}% {top5Concentration <= 40 ? '(Healthy)' : top5Concentration <= 60 ? '(Moderate Risk)' : '(High Risk)'}
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600">Sort by:</span>
              <Tabs value={customerSortBy} onValueChange={(v) => setCustomerSortBy(v as any)}>
                <TabsList>
                  <TabsTrigger value="revenue">Revenue</TabsTrigger>
                  <TabsTrigger value="profit">Profit</TabsTrigger>
                  <TabsTrigger value="growth">Growth</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {sortedCustomers.map((customer, index) => (
              <HoverCard key={customer.id}>
                <HoverCardTrigger asChild>
                  <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:border-teal-300 cursor-pointer transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-teal-100 text-teal-700">
                        {index + 1}
                      </div>
                      <div>
                        <div className="text-sm text-slate-900 mb-1">{customer.name}</div>
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant="outline"
                            className={`text-xs ${SEGMENT_COLORS[customer.segment as keyof typeof SEGMENT_COLORS].bg} ${SEGMENT_COLORS[customer.segment as keyof typeof SEGMENT_COLORS].text} border ${SEGMENT_COLORS[customer.segment as keyof typeof SEGMENT_COLORS].border}`}
                          >
                            {customer.segment}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <div className="text-sm text-slate-600 mb-1">Revenue</div>
                        <div className="text-slate-900">₹{customer.revenue}L</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-slate-600 mb-1">Profit</div>
                        <div className="flex items-center gap-2">
                          <span className="text-slate-900">₹{customer.profit}L</span>
                          <div className="w-12 h-4">
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart data={customer.profitTrend.map((v, i) => ({ value: v }))}>
                                <Line 
                                  type="monotone" 
                                  dataKey="value" 
                                  stroke="#10B981" 
                                  strokeWidth={2}
                                  dot={false}
                                />
                              </LineChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-slate-600 mb-1">Growth</div>
                        <div className={`${customer.growth >= 15 ? 'text-green-600' : 'text-amber-600'}`}>
                          +{customer.growth}%
                        </div>
                      </div>
                    </div>
                  </div>
                </HoverCardTrigger>
                <HoverCardContent className="w-80">
                  <div className="space-y-2">
                    <h4 className="text-sm">{customer.name}</h4>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-600">DSO:</span>
                        <span className="text-slate-900">{customer.dso} days</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Last Purchase:</span>
                        <span className="text-slate-900">{customer.lastPurchase}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Segment:</span>
                        <span className="text-slate-900">{customer.segment}</span>
                      </div>
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Customer Retention Cohort */}
      <Card className="border-teal-200">
        <CardHeader>
          <div>
            <CardTitle>Customer Retention Cohort Analysis</CardTitle>
            <p className="text-sm text-slate-600 mt-1">Monthly cohort retention rates (%)</p>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="text-left text-xs text-slate-600 p-2 border border-slate-200 bg-slate-50">Cohort</th>
                  <th className="text-center text-xs text-slate-600 p-2 border border-slate-200 bg-slate-50">M0</th>
                  <th className="text-center text-xs text-slate-600 p-2 border border-slate-200 bg-slate-50">M1</th>
                  <th className="text-center text-xs text-slate-600 p-2 border border-slate-200 bg-slate-50">M2</th>
                  <th className="text-center text-xs text-slate-600 p-2 border border-slate-200 bg-slate-50">M3</th>
                  <th className="text-center text-xs text-slate-600 p-2 border border-slate-200 bg-slate-50">M4</th>
                  <th className="text-center text-xs text-slate-600 p-2 border border-slate-200 bg-slate-50">M5</th>
                  <th className="text-center text-xs text-slate-600 p-2 border border-slate-200 bg-slate-50">M6</th>
                </tr>
              </thead>
              <tbody>
                {retentionCohortData.map((cohort) => (
                  <tr key={cohort.cohort}>
                    <td className="text-sm text-slate-900 p-2 border border-slate-200">{cohort.cohort}</td>
                    {[cohort.m0, cohort.m1, cohort.m2, cohort.m3, cohort.m4, cohort.m5, cohort.m6].map((value, index) => {
                      if (value === 0) return <td key={index} className="p-2 border border-slate-200 bg-slate-100" />;
                      
                      const bgColor = value >= 85 
                        ? 'bg-green-100' 
                        : value >= 70 
                        ? 'bg-amber-100' 
                        : 'bg-red-100';
                      
                      const textColor = value >= 85 
                        ? 'text-green-800' 
                        : value >= 70 
                        ? 'text-amber-800' 
                        : 'text-red-800';

                      return (
                        <HoverCard key={index}>
                          <HoverCardTrigger asChild>
                            <td className={`text-center text-sm p-2 border border-slate-200 ${bgColor} ${textColor} cursor-pointer`}>
                              {value}%
                            </td>
                          </HoverCardTrigger>
                          <HoverCardContent className="w-80">
                            <div className="space-y-2">
                              <h4 className="text-sm">Month {index}: {value}% retained</h4>
                              <p className="text-xs text-slate-600">
                                {value}% of customers acquired in {cohort.cohort} were retained by Month {index}.
                              </p>
                            </div>
                          </HoverCardContent>
                        </HoverCard>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Trend Summary */}
          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <div className="text-xs text-blue-700 mb-1">Avg 6M Retention</div>
                <div className="text-slate-900">77%</div>
              </div>
              <div>
                <div className="text-xs text-blue-700 mb-1">Target</div>
                <div className="text-slate-900">80%</div>
              </div>
              <div>
                <div className="text-xs text-blue-700 mb-1">MoM Improvement</div>
                <div className="text-green-600">+2 pts</div>
              </div>
            </div>
          </div>

          {/* Color Scale Legend */}
          <div className="mt-4 flex items-center justify-center gap-6 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-8 h-4 bg-green-100 border border-green-200 rounded" />
              <span className="text-slate-600">85-100% (Excellent)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-4 bg-amber-100 border border-amber-200 rounded" />
              <span className="text-slate-600">70-84% (Good)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-4 bg-red-100 border border-red-200 rounded" />
              <span className="text-slate-600">{'<'}70% (At Risk)</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
