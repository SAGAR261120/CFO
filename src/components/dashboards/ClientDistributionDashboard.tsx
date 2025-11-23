import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { 
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, PieChart, Pie, Cell, BarChart, ReferenceLine,
  LabelList
} from 'recharts';
import { 
  Lightbulb, TrendingUp, TrendingDown, AlertTriangle, ChevronDown,
  Minus, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Alert, AlertDescription } from '../ui/alert';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';

// Customer Pareto Data - Top 20 customers
const paretoData = [
  { rank: 1, name: 'TechCorp Solutions', revenue: 12.5, cumulative: 14.7, category: 'Enterprise', gm: 48 },
  { rank: 2, name: 'Innovation Labs', revenue: 10.8, cumulative: 27.4, category: 'Enterprise', gm: 52 },
  { rank: 3, name: 'Global Systems Inc', revenue: 9.2, cumulative: 38.2, category: 'Enterprise', gm: 45 },
  { rank: 4, name: 'Digital Dynamics', revenue: 7.5, cumulative: 47.0, category: 'Large Corp', gm: 49 },
  { rank: 5, name: 'Smart Solutions', revenue: 6.3, cumulative: 54.4, category: 'Large Corp', gm: 46 },
  { rank: 6, name: 'Tech Innovations', revenue: 5.8, cumulative: 61.2, category: 'Large Corp', gm: 44 },
  { rank: 7, name: 'Future Systems', revenue: 5.2, cumulative: 67.3, category: 'Large Corp', gm: 47 },
  { rank: 8, name: 'Alpha Technologies', revenue: 4.8, cumulative: 73.0, category: 'Large Corp', gm: 43 },
  { rank: 9, name: 'Beta Enterprises', revenue: 4.2, cumulative: 77.9, category: 'Mid Market', gm: 41 },
  { rank: 10, name: 'Gamma Corp', revenue: 3.8, cumulative: 82.4, category: 'Mid Market', gm: 42 },
  { rank: 11, name: 'Delta Systems', revenue: 3.2, cumulative: 86.1, category: 'Mid Market', gm: 40 },
  { rank: 12, name: 'Epsilon Tech', revenue: 2.8, cumulative: 89.4, category: 'Mid Market', gm: 39 },
  { rank: 13, name: 'Zeta Solutions', revenue: 2.4, cumulative: 92.2, category: 'Mid Market', gm: 38 },
  { rank: 14, name: 'Eta Innovations', revenue: 2.0, cumulative: 94.6, category: 'Mid Market', gm: 37 },
  { rank: 15, name: 'Theta Systems', revenue: 1.6, cumulative: 96.4, category: 'SMB', gm: 35 },
  { rank: 16, name: 'Iota Tech', revenue: 1.2, cumulative: 97.8, category: 'SMB', gm: 34 },
  { rank: 17, name: 'Kappa Corp', revenue: 0.8, cumulative: 98.7, category: 'SMB', gm: 32 },
  { rank: 18, name: 'Lambda Ltd', revenue: 0.5, cumulative: 99.3, category: 'SMB', gm: 31 },
  { rank: 19, name: 'Mu Solutions', revenue: 0.4, cumulative: 99.8, category: 'SMB', gm: 30 },
  { rank: 20, name: 'Nu Enterprises', revenue: 0.2, cumulative: 100.0, category: 'SMB', gm: 29 },
];

// Customer Segmentation Data
const segmentationData = [
  { name: 'Enterprise', revenue: 58.2, count: 12, avgMargin: 48, growth: 12, color: '#14b8a6' },
  { name: 'Large Corp', revenue: 26.5, count: 28, avgMargin: 45, growth: 8, color: '#3b82f6' },
  { name: 'Mid Market', revenue: 13.8, count: 65, avgMargin: 39, growth: 3, color: '#f59e0b' },
  { name: 'SMB', revenue: 1.5, count: 145, avgMargin: 32, growth: 0, color: '#94a3b8' },
];

// Customer Decile Analysis
const decileData = [
  { decile: 'D1', revenue: 32.5, gm: 49, yoy: 14, profit: 15.9 },
  { decile: 'D2', revenue: 18.2, gm: 46, yoy: 11, profit: 8.4 },
  { decile: 'D3', revenue: 12.8, gm: 44, yoy: 8, profit: 5.6 },
  { decile: 'D4', revenue: 9.5, gm: 42, yoy: 6, profit: 4.0 },
  { decile: 'D5', revenue: 7.3, gm: 40, yoy: 4, profit: 2.9 },
  { decile: 'D6', revenue: 5.8, gm: 38, yoy: 2, profit: 2.2 },
  { decile: 'D7', revenue: 4.6, gm: 36, yoy: 1, profit: 1.7 },
  { decile: 'D8', revenue: 3.8, gm: 34, yoy: -1, profit: 1.3 },
  { decile: 'D9', revenue: 3.2, gm: 32, yoy: -2, profit: 1.0 },
  { decile: 'D10', revenue: 2.3, gm: 28, yoy: -5, profit: 0.6 },
];

// Top Customer Portfolio Data
const topCustomersData = [
  { 
    rank: 1, 
    name: 'TechCorp Solutions', 
    revenue: 12.5, 
    profit: 6.0, 
    gm: 48, 
    gmTrend: 'up',
    invoices: 142, 
    avgTicket: 88, 
    dso: 28, 
    growth: 18, 
    risk: 'Low',
    lastInvoice: 'Dec 20, 2024'
  },
  { 
    rank: 2, 
    name: 'Innovation Labs', 
    revenue: 10.8, 
    profit: 5.6, 
    gm: 52, 
    gmTrend: 'up',
    invoices: 128, 
    avgTicket: 84, 
    dso: 24, 
    growth: 22, 
    risk: 'Low',
    lastInvoice: 'Dec 22, 2024'
  },
  { 
    rank: 3, 
    name: 'Global Systems Inc', 
    revenue: 9.2, 
    profit: 4.1, 
    gm: 45, 
    gmTrend: 'same',
    invoices: 98, 
    avgTicket: 94, 
    dso: 32, 
    growth: 15, 
    risk: 'Low',
    lastInvoice: 'Dec 18, 2024'
  },
  { 
    rank: 4, 
    name: 'Digital Dynamics', 
    revenue: 7.5, 
    profit: 3.7, 
    gm: 49, 
    gmTrend: 'up',
    invoices: 86, 
    avgTicket: 87, 
    dso: 35, 
    growth: 12, 
    risk: 'Medium',
    lastInvoice: 'Dec 15, 2024'
  },
  { 
    rank: 5, 
    name: 'Smart Solutions', 
    revenue: 6.3, 
    profit: 2.9, 
    gm: 46, 
    gmTrend: 'same',
    invoices: 72, 
    avgTicket: 88, 
    dso: 42, 
    growth: 9, 
    risk: 'Medium',
    lastInvoice: 'Dec 19, 2024'
  },
  { 
    rank: 6, 
    name: 'Tech Innovations', 
    revenue: 5.8, 
    profit: 2.6, 
    gm: 44, 
    gmTrend: 'down',
    invoices: 64, 
    avgTicket: 91, 
    dso: 38, 
    growth: 6, 
    risk: 'Medium',
    lastInvoice: 'Dec 21, 2024'
  },
  { 
    rank: 7, 
    name: 'Future Systems', 
    revenue: 5.2, 
    profit: 2.4, 
    gm: 47, 
    gmTrend: 'up',
    invoices: 58, 
    avgTicket: 90, 
    dso: 29, 
    growth: 14, 
    risk: 'Low',
    lastInvoice: 'Dec 23, 2024'
  },
  { 
    rank: 8, 
    name: 'Alpha Technologies', 
    revenue: 4.8, 
    profit: 2.1, 
    gm: 43, 
    gmTrend: 'same',
    invoices: 52, 
    avgTicket: 92, 
    dso: 48, 
    growth: 4, 
    risk: 'High',
    lastInvoice: 'Dec 12, 2024'
  },
  { 
    rank: 9, 
    name: 'Beta Enterprises', 
    revenue: 4.2, 
    profit: 1.7, 
    gm: 41, 
    gmTrend: 'down',
    invoices: 48, 
    avgTicket: 88, 
    dso: 52, 
    growth: -2, 
    risk: 'High',
    lastInvoice: 'Dec 10, 2024'
  },
  { 
    rank: 10, 
    name: 'Gamma Corp', 
    revenue: 3.8, 
    profit: 1.6, 
    gm: 42, 
    gmTrend: 'same',
    invoices: 42, 
    avgTicket: 90, 
    dso: 36, 
    growth: 8, 
    risk: 'Medium',
    lastInvoice: 'Dec 17, 2024'
  },
];

export function ClientDistributionDashboard() {
  const [filterType, setFilterType] = useState('customer-type');
  const [segmentView, setSegmentView] = useState<'revenue' | 'count'>('revenue');
  const [decileMetric, setDecileMetric] = useState<'revenue' | 'profit' | 'gm'>('revenue');
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);

  // Calculate concentration metrics
  const top1 = paretoData[0].cumulative;
  const top5 = paretoData[4].cumulative;
  const top10 = paretoData[9].cumulative;
  const top20 = paretoData[19].cumulative;
  
  // Calculate HHI Index (simplified)
  const hhi = paretoData.reduce((sum, customer) => {
    const marketShare = customer.revenue / 100;
    return sum + (marketShare * marketShare);
  }, 0);

  // Determine risk level
  const getRiskLevel = (concentration: number, threshold: number) => {
    if (concentration > threshold) return 'high';
    if (concentration > threshold * 0.9) return 'medium';
    return 'low';
  };

  const getDecileValue = (item: typeof decileData[0]) => {
    switch (decileMetric) {
      case 'revenue': return item.revenue;
      case 'profit': return item.profit;
      case 'gm': return item.gm;
      default: return item.revenue;
    }
  };

  const avgGM = decileData.reduce((sum, d) => sum + d.gm, 0) / decileData.length;

  // Custom tooltip for Pareto chart
  const CustomParetoTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-slate-200">
          <p className="font-semibold text-slate-900">Rank #{data.rank}: {data.name}</p>
          <p className="text-sm text-slate-700 mt-1">Revenue: ₹{data.revenue}L</p>
          <p className="text-sm text-slate-700">Cumulative: {data.cumulative.toFixed(1)}%</p>
          <p className="text-sm text-slate-700">Category: {data.category}</p>
          <p className="text-sm text-slate-700">GM%: {data.gm}%</p>
        </div>
      );
    }
    return null;
  };

  // Custom tooltip for Segmentation chart
  const CustomSegmentTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-slate-200">
          <p className="font-semibold text-slate-900">{data.name}</p>
          <p className="text-sm text-slate-700 mt-1">Revenue: ₹{data.revenue}L ({((data.revenue / 100) * 100).toFixed(0)}%)</p>
          <p className="text-sm text-slate-700">Customers: {data.count}</p>
          <p className="text-sm text-slate-700">Avg Margin: {data.avgMargin}%</p>
          <p className="text-sm text-slate-700">YoY Growth: {data.growth > 0 ? '+' : ''}{data.growth}%</p>
        </div>
      );
    }
    return null;
  };

  // Custom tooltip for Decile chart
  const CustomDecileTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const decileNum = parseInt(data.decile.substring(1));
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-slate-200">
          <p className="font-semibold text-slate-900">{data.decile} (Top {decileNum * 10}% Customers)</p>
          <p className="text-sm text-slate-700 mt-1">Revenue: ₹{data.revenue}L ({((data.revenue / 100) * 100).toFixed(0)}% of Total)</p>
          <p className="text-sm text-slate-700">GM%: {data.gm}%</p>
          <p className="text-sm text-slate-700">YoY: {data.yoy > 0 ? '+' : ''}{data.yoy}%</p>
          <p className="text-sm text-slate-700">Profit: ₹{data.profit}L</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* AI Summary */}
      <Alert className="bg-blue-50 border-blue-200">
        <Lightbulb className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-sm text-slate-700 ml-2">
          <span>AI Summary:</span> Top 10 customers contribute 82.4% of revenue; 
          SMB share remains below 2%. Concentration risk is moderate with HHI of 0.{(hhi * 100).toFixed(0)}.
          Enterprise segment shows strong growth at +12% YoY.
        </AlertDescription>
      </Alert>

      {/* Filter Section */}
      <div className="flex items-center gap-4">
        <span className="text-sm text-slate-700">Filter by:</span>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="customer-type">Customer Type</SelectItem>
            <SelectItem value="region">Region</SelectItem>
            <SelectItem value="currency">Currency</SelectItem>
          </SelectContent>
        </Select>
        <Badge variant="outline" className="ml-auto">
          {filterType === 'customer-type' ? 'All Segments' : filterType === 'region' ? 'All Regions' : 'All Currencies'}
        </Badge>
      </div>

      {/* Pareto & Segmentation Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customer Pareto Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Pareto Analysis</CardTitle>
            <p className="text-sm text-slate-600">Revenue concentration by customer rank</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={380}>
              <ComposedChart data={paretoData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="rank" 
                  label={{ value: 'Customer Rank', position: 'insideBottom', offset: -5 }}
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  yAxisId="left"
                  label={{ value: 'Revenue (₹L)', angle: -90, position: 'insideLeft' }}
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  yAxisId="right"
                  orientation="right"
                  label={{ value: 'Cumulative % of Revenue', angle: 90, position: 'insideRight' }}
                  tick={{ fontSize: 12 }}
                  domain={[0, 100]}
                />
                <Tooltip content={<CustomParetoTooltip />} />
                <Legend />
                
                {/* 80% Reference Line */}
                <ReferenceLine 
                  yAxisId="right" 
                  y={80} 
                  stroke="#f59e0b" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                />
                
                <Bar 
                  yAxisId="left"
                  dataKey="revenue" 
                  fill="url(#colorGradient)" 
                  name="Revenue"
                  onClick={(data) => setSelectedCustomer(data.name)}
                  cursor="pointer"
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="cumulative" 
                  stroke="#8b5cf6" 
                  strokeWidth={2}
                  name="Cumulative %"
                  dot={{ r: 3 }}
                />
                
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#14b8a6" />
                    <stop offset="50%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#94a3b8" />
                  </linearGradient>
                </defs>
              </ComposedChart>
            </ResponsiveContainer>
            <div className="mt-2 flex items-center gap-2 text-xs text-slate-600">
              <div className="w-full h-px bg-amber-400"></div>
              <span className="whitespace-nowrap">Top 20% customers contribute 80% of revenue</span>
              <div className="w-full h-px bg-amber-400"></div>
            </div>
            {selectedCustomer && (
              <div className="mt-3 p-2 bg-blue-50 rounded text-sm text-blue-900">
                Dashboard filtered to: <span className="font-semibold">{selectedCustomer}</span>
                <button 
                  onClick={() => setSelectedCustomer(null)}
                  className="ml-2 text-blue-600 hover:text-blue-800 underline"
                >
                  Clear
                </button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Customer Segmentation */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Customer Segmentation</CardTitle>
              <p className="text-sm text-slate-600">Distribution by customer category</p>
            </div>
            <Select value={segmentView} onValueChange={(v) => setSegmentView(v as 'revenue' | 'count')}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="revenue">By Revenue</SelectItem>
                <SelectItem value="count">By Count</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={segmentationData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey={segmentView === 'revenue' ? 'revenue' : 'count'}
                >
                  {segmentationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                  <LabelList 
                    dataKey={segmentView === 'revenue' ? 'revenue' : 'count'}
                    position="inside"
                    formatter={(value: number) => segmentView === 'revenue' ? `₹${value}L` : value}
                    style={{ fill: 'white', fontWeight: 'bold', fontSize: '12px' }}
                  />
                </Pie>
                <Tooltip content={<CustomSegmentTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            
            <div className="mt-6 space-y-3">
              {segmentationData.map((segment) => (
                <div key={segment.name} className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: segment.color }}></div>
                    <div>
                      <span className="text-sm font-medium text-slate-900">{segment.name}</span>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-slate-600">
                          ₹{segment.revenue}L ({((segment.revenue / 100) * 100).toFixed(0)}%)
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`flex items-center gap-1 text-sm ${segment.growth > 5 ? 'text-green-600' : segment.growth < 2 ? 'text-slate-500' : 'text-blue-600'}`}>
                      {segment.growth > 0 ? <ArrowUpRight className="h-3 w-3" /> : segment.growth < 0 ? <ArrowDownRight className="h-3 w-3" /> : <Minus className="h-3 w-3" />}
                      {segment.growth > 0 ? '+' : ''}{segment.growth}%
                    </div>
                    <span className="text-xs text-slate-600">{segment.count} customers</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Customer Decile Analysis */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Customer Decile Analysis</CardTitle>
            <p className="text-sm text-slate-600">Performance metrics by customer decile</p>
          </div>
          <Select value={decileMetric} onValueChange={(v) => setDecileMetric(v as any)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="revenue">By Revenue</SelectItem>
              <SelectItem value="profit">By Profit</SelectItem>
              <SelectItem value="gm">By GM%</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={decileData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="decile" tick={{ fontSize: 12 }} />
              <YAxis 
                tick={{ fontSize: 12 }}
                label={{ 
                  value: decileMetric === 'gm' ? 'Gross Margin %' : decileMetric === 'profit' ? 'Profit (₹L)' : 'Revenue (₹L)', 
                  angle: -90, 
                  position: 'insideLeft' 
                }}
              />
              <Tooltip content={<CustomDecileTooltip />} />
              
              {decileMetric === 'gm' && (
                <ReferenceLine 
                  y={avgGM} 
                  stroke="#64748b" 
                  strokeDasharray="3 3"
                  label={{ value: `Avg: ${avgGM.toFixed(1)}%`, position: 'right' }}
                />
              )}
              
              <Bar 
                dataKey={(item) => getDecileValue(item)}
                fill="#8b5cf6"
                radius={[4, 4, 0, 0]}
              >
                {decileData.map((entry, index) => {
                  const value = getDecileValue(entry);
                  const maxValue = Math.max(...decileData.map(d => getDecileValue(d)));
                  const intensity = value / maxValue;
                  const color = `rgba(139, 92, 246, ${0.3 + intensity * 0.7})`;
                  return <Cell key={`cell-${index}`} fill={color} />;
                })}
                <LabelList 
                  dataKey={(item) => getDecileValue(item)}
                  position="top"
                  formatter={(value: number) => decileMetric === 'gm' ? `${value}%` : `₹${value}L`}
                  style={{ fontSize: '11px', fill: '#475569' }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Top Customer Portfolio Table */}
      <Card>
        <CardHeader>
          <CardTitle>Top Customer Portfolio</CardTitle>
          <p className="text-sm text-slate-600">Detailed metrics for top 10 revenue contributors</p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">Rank</TableHead>
                  <TableHead>Customer Name</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                  <TableHead className="text-right">Profit</TableHead>
                  <TableHead className="text-right">GM%</TableHead>
                  <TableHead className="text-right">Invoices</TableHead>
                  <TableHead className="text-right">Avg Ticket</TableHead>
                  <TableHead className="text-right">DSO</TableHead>
                  <TableHead className="text-right">12M Growth</TableHead>
                  <TableHead className="text-center">Risk</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topCustomersData.map((customer) => (
                  <TableRow key={customer.rank} className="hover:bg-slate-50">
                    <TableCell className="font-medium">{customer.rank}</TableCell>
                    <TableCell className="font-medium text-slate-900">{customer.name}</TableCell>
                    <TableCell className="text-right">
                      <span className={customer.rank <= 3 ? 'text-green-600 font-semibold' : ''}>
                        ₹{customer.revenue}L
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className={customer.rank <= 3 ? 'text-green-600 font-semibold' : ''}>
                        ₹{customer.profit}L
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        {customer.gm}%
                        {customer.gmTrend === 'up' && <TrendingUp className="h-3 w-3 text-green-600" />}
                        {customer.gmTrend === 'down' && <TrendingDown className="h-3 w-3 text-red-600" />}
                        {customer.gmTrend === 'same' && <Minus className="h-3 w-3 text-slate-400" />}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <TooltipProvider>
                        <UITooltip>
                          <TooltipTrigger asChild>
                            <span className="cursor-help">{customer.invoices}</span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Last invoice: {customer.lastInvoice}</p>
                          </TooltipContent>
                        </UITooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell className="text-right">₹{customer.avgTicket}K</TableCell>
                    <TableCell className="text-right">
                      <Badge 
                        variant="outline"
                        className={
                          customer.dso < 30 
                            ? 'border-green-500 text-green-700 bg-green-50' 
                            : customer.dso <= 45 
                            ? 'border-amber-500 text-amber-700 bg-amber-50'
                            : 'border-red-500 text-red-700 bg-red-50'
                        }
                      >
                        {customer.dso}d
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <span className={customer.growth > 10 ? 'text-green-600' : customer.growth < 0 ? 'text-red-600' : ''}>
                          {customer.growth > 0 ? '+' : ''}{customer.growth}%
                        </span>
                        <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${customer.growth > 10 ? 'bg-green-500' : customer.growth < 0 ? 'bg-red-500' : 'bg-blue-500'}`}
                            style={{ width: `${Math.min(Math.abs(customer.growth) * 5, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <TooltipProvider>
                        <UITooltip>
                          <TooltipTrigger asChild>
                            <Badge 
                              variant={customer.risk === 'Low' ? 'default' : 'destructive'}
                              className={
                                customer.risk === 'Low' 
                                  ? 'bg-green-100 text-green-800 hover:bg-green-100' 
                                  : customer.risk === 'Medium'
                                  ? 'bg-amber-100 text-amber-800 hover:bg-amber-100'
                                  : 'bg-red-100 text-red-800 hover:bg-red-100'
                              }
                            >
                              {customer.risk}
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs">Risk = Revenue share × DSO × Growth stability</p>
                          </TooltipContent>
                        </UITooltip>
                      </TooltipProvider>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Concentration Risk Assessment */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Concentration Risk Assessment
            <AlertTriangle className="h-5 w-5 text-amber-500" />
          </CardTitle>
          <p className="text-sm text-slate-600">Revenue concentration metrics and risk indicators</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {/* Top 1 */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Top 1</span>
                {top1 > 25 ? (
                  <TrendingUp className="h-4 w-4 text-red-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-green-500" />
                )}
              </div>
              <div className={`text-2xl font-semibold ${top1 > 25 ? 'text-red-600' : 'text-slate-900'}`}>
                {top1.toFixed(1)}%
              </div>
              <Badge 
                variant="outline"
                className={top1 > 25 ? 'border-red-500 text-red-700 bg-red-50' : 'border-green-500 text-green-700 bg-green-50'}
              >
                {top1 > 25 ? 'High Risk' : 'Safe'}
              </Badge>
            </div>

            {/* Top 5 */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Top 5</span>
                {top5 > 50 ? (
                  <TrendingUp className="h-4 w-4 text-amber-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-green-500" />
                )}
              </div>
              <div className={`text-2xl font-semibold ${top5 > 50 ? 'text-amber-600' : 'text-slate-900'}`}>
                {top5.toFixed(1)}%
              </div>
              <Badge 
                variant="outline"
                className={top5 > 50 ? 'border-amber-500 text-amber-700 bg-amber-50' : 'border-green-500 text-green-700 bg-green-50'}
              >
                {top5 > 50 ? 'Moderate' : 'Safe'}
              </Badge>
            </div>

            {/* Top 10 */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Top 10</span>
                {top10 > 65 ? (
                  <TrendingUp className="h-4 w-4 text-amber-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-green-500" />
                )}
              </div>
              <div className={`text-2xl font-semibold ${top10 > 65 ? 'text-amber-600' : 'text-slate-900'}`}>
                {top10.toFixed(1)}%
              </div>
              <Badge 
                variant="outline"
                className={top10 > 65 ? 'border-amber-500 text-amber-700 bg-amber-50' : 'border-green-500 text-green-700 bg-green-50'}
              >
                {top10 > 65 ? 'Moderate' : 'Safe'}
              </Badge>
            </div>

            {/* Top 20 */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Top 20</span>
                {top20 > 80 ? (
                  <TrendingUp className="h-4 w-4 text-red-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-green-500" />
                )}
              </div>
              <div className={`text-2xl font-semibold ${top20 > 80 ? 'text-red-600' : 'text-slate-900'}`}>
                {top20.toFixed(1)}%
              </div>
              <Badge 
                variant="outline"
                className={top20 > 80 ? 'border-red-500 text-red-700 bg-red-50' : 'border-green-500 text-green-700 bg-green-50'}
              >
                {top20 > 80 ? 'High Risk' : 'Safe'}
              </Badge>
            </div>

            {/* HHI Index */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">HHI Index</span>
                <TooltipProvider>
                  <UITooltip>
                    <TooltipTrigger>
                      <span className="text-xs text-slate-400 cursor-help">ⓘ</span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">Herfindahl-Hirschman Index</p>
                      <p className="text-xs">Target: ≤0.25 (Low concentration)</p>
                    </TooltipContent>
                  </UITooltip>
                </TooltipProvider>
              </div>
              <div className={`text-2xl font-semibold ${hhi > 0.25 ? 'text-amber-600' : 'text-slate-900'}`}>
                {hhi.toFixed(2)}
              </div>
              <Badge 
                variant="outline"
                className={hhi > 0.25 ? 'border-amber-500 text-amber-700 bg-amber-50' : 'border-green-500 text-green-700 bg-green-50'}
              >
                {hhi > 0.25 ? 'Moderate' : 'Low'}
              </Badge>
            </div>
          </div>

          {/* Dynamic AI Risk Assessment */}
          <Alert className="bg-amber-50 border-amber-200">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-sm text-slate-700 ml-2">
              <span className="font-semibold">Concentration Risk Alert:</span> Revenue concentration is rising, 
              with top 3 customers contributing 38.2% of total revenue. Top 10 customers account for 82.4%, 
              above the recommended 70% threshold. Current HHI of {hhi.toFixed(2)} indicates moderate concentration risk.
              <div className="mt-2">
                <span className="font-semibold">Recommendation:</span> Diversification needed in SMB segment 
                (currently only 1.5% of revenue). Consider expanding mid-market presence to reduce dependency 
                on Enterprise clients.
              </div>
              <Button variant="outline" size="sm" className="mt-3">
                View Detailed Breakdown
              </Button>
            </AlertDescription>
          </Alert>

          {/* AI Commentary Section */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start gap-3">
              <Lightbulb className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-semibold text-slate-900 mb-2">AI Monthly Commentary (December 2024)</h4>
                <p className="text-sm text-slate-700 leading-relaxed">
                  Top 10 customers contribute 82.4% of total revenue, marginally above safe threshold of 70%. 
                  Concentration is driven primarily by Enterprise clients, with <span className="font-semibold">TechCorp Solutions</span> and{' '}
                  <span className="font-semibold">Innovation Labs</span> leading growth at +18% and +22% respectively. 
                  DSO trend remains stable at an average of 38 days across top customers. 
                </p>
                <p className="text-sm text-slate-700 leading-relaxed mt-2">
                  <span className="font-semibold">Strategic Focus:</span> While Enterprise segment shows robust health 
                  (68% of revenue, +12% growth, 48% avg margin), the SMB segment represents a significant opportunity, 
                  currently accounting for only 1.5% of revenue despite comprising 145 customers. Mid-market segment 
                  shows moderate growth (+3%) and could be prioritized for expansion to reduce concentration risk.
                </p>
                <div className="flex gap-2 mt-3">
                  <Badge variant="outline" className="bg-white">Enterprise: Strong</Badge>
                  <Badge variant="outline" className="bg-white">Mid-Market: Stable</Badge>
                  <Badge variant="outline" className="bg-white">SMB: Untapped Potential</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
