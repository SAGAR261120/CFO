import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, Cell } from 'recharts';
import { Activity, Clock, Users, Percent, Building2, Calendar, Database, IndianRupee, RefreshCw, Zap, TrendingUp, TrendingDown, Info, Play, Pause, Award, Target, AlertTriangle, Lightbulb } from 'lucide-react';
import { Progress } from '../ui/progress';
import { useState } from 'react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '../ui/hover-card';
import { toast } from 'sonner@2.0.3';

// Team Utilization Trends Data
const teamUtilizationTrends = [
  { week: 'W47', Design: 68, Engineering: 74, Consulting: 82, Marketing: 65, Operations: 71, avgLine: 72 },
  { week: 'W48', Design: 70, Engineering: 76, Consulting: 84, Marketing: 67, Operations: 73, avgLine: 72 },
  { week: 'W49', Design: 72, Engineering: 78, Consulting: 85, Marketing: 69, Operations: 74, avgLine: 72 },
  { week: 'W50', Design: 74, Engineering: 80, Consulting: 86, Marketing: 71, Operations: 76, avgLine: 72 },
  { week: 'W51', Design: 73, Engineering: 79, Consulting: 87, Marketing: 70, Operations: 75, avgLine: 72 },
  { week: 'W52', Design: 75, Engineering: 81, Consulting: 88, Marketing: 72, Operations: 77, avgLine: 72 },
];

// Capacity vs Demand Forecast Data
const capacityDemandData = [
  { month: 'Jan 25', capacity: 2000, demand: 1920, utilization: 96, status: 'ideal' },
  { month: 'Feb 25', capacity: 2050, demand: 1950, utilization: 95, status: 'ideal' },
  { month: 'Mar 25', capacity: 2100, demand: 2240, utilization: 107, status: 'overbooked' },
  { month: 'Apr 25', capacity: 2150, demand: 2010, utilization: 93, status: 'ideal' },
  { month: 'May 25', capacity: 2200, demand: 1870, utilization: 85, status: 'ideal' },
  { month: 'Jun 25', capacity: 2250, demand: 1575, utilization: 70, status: 'underutilized' },
];

// Team Performance Summary Data
const teamPerformanceData = [
  {
    team: 'Consulting',
    utilization: 85,
    target: 80,
    realization: 88,
    billableHours: 1360,
    nonBillableHours: 240,
    avgRate: 12000,
    status: 'on-target',
    trend: [82, 83, 84, 85],
  },
  {
    team: 'Engineering',
    utilization: 78,
    target: 75,
    realization: 82,
    billableHours: 1540,
    nonBillableHours: 430,
    avgRate: 9500,
    status: 'on-target',
    trend: [76, 77, 77, 78],
  },
  {
    team: 'Design',
    utilization: 72,
    target: 70,
    realization: 85,
    billableHours: 960,
    nonBillableHours: 370,
    avgRate: 8500,
    status: 'on-target',
    trend: [68, 70, 71, 72],
  },
  {
    team: 'Marketing',
    utilization: 68,
    target: 72,
    realization: 75,
    billableHours: 680,
    nonBillableHours: 320,
    avgRate: 7000,
    status: 'watch',
    trend: [65, 66, 67, 68],
  },
  {
    team: 'Operations',
    utilization: 74,
    target: 75,
    realization: 80,
    billableHours: 1400,
    nonBillableHours: 450,
    avgRate: 8000,
    status: 'on-target',
    trend: [71, 72, 73, 74],
  },
];

// Top Performers Data
const topPerformers = [
  {
    rank: 1,
    name: 'Rahul Sharma',
    team: 'Engineering',
    utilization: 88,
    realization: 95,
    billingRate: 9000,
    projects: 3,
    trend: '+4% MoM',
    hours: 176,
  },
  {
    rank: 2,
    name: 'Priya Mehta',
    team: 'Consulting',
    utilization: 92,
    realization: 90,
    billingRate: 13500,
    projects: 2,
    trend: '+2% MoM',
    hours: 184,
  },
  {
    rank: 3,
    name: 'Amit Patel',
    team: 'Design',
    utilization: 85,
    realization: 88,
    billingRate: 9500,
    projects: 4,
    trend: '+6% MoM',
    hours: 170,
  },
  {
    rank: 4,
    name: 'Sneha Kumar',
    team: 'Engineering',
    utilization: 86,
    realization: 92,
    billingRate: 10000,
    projects: 3,
    trend: '+3% MoM',
    hours: 172,
  },
  {
    rank: 5,
    name: 'Vikram Singh',
    team: 'Consulting',
    utilization: 90,
    realization: 87,
    billingRate: 14000,
    projects: 2,
    trend: '+5% MoM',
    hours: 180,
  },
];

// Project Resource Efficiency Data
const projectEfficiency = [
  {
    project: 'Phoenix ERP',
    budget: 240000,
    actual: 228000,
    allocated: 3,
    utilized: 2.4,
    efficiency: 95,
    variance: 12000,
    status: 'efficient',
  },
  {
    project: 'Digital Transformation',
    budget: 320000,
    actual: 304000,
    allocated: 4,
    utilized: 3.8,
    efficiency: 95,
    variance: 16000,
    status: 'efficient',
  },
  {
    project: 'Cloud Migration',
    budget: 180000,
    actual: 162000,
    allocated: 2.5,
    utilized: 2.25,
    efficiency: 90,
    variance: 18000,
    status: 'efficient',
  },
  {
    project: 'Mobile App Dev',
    budget: 150000,
    actual: 129000,
    allocated: 2,
    utilized: 1.72,
    efficiency: 86,
    variance: 21000,
    status: 'good',
  },
  {
    project: 'AI Integration',
    budget: 280000,
    actual: 218400,
    allocated: 3.5,
    utilized: 2.73,
    efficiency: 78,
    variance: 61600,
    status: 'underutilized',
  },
];

const STATUS_CONFIG = {
  'on-target': { icon: '🟢', label: 'On Target', color: 'bg-green-100 text-green-800 border-green-300' },
  'watch': { icon: '🟠', label: 'Watch', color: 'bg-amber-100 text-amber-800 border-amber-300' },
  'critical': { icon: '🔴', label: 'Critical', color: 'bg-red-100 text-red-800 border-red-300' },
};

const EFFICIENCY_CONFIG = {
  'efficient': { color: 'bg-green-500', label: 'Efficient' },
  'good': { color: 'bg-blue-500', label: 'Good' },
  'underutilized': { color: 'bg-amber-500', label: 'Underutilized' },
  'overutilized': { color: 'bg-red-500', label: 'Overutilized' },
};

export function UtilizationDashboard() {
  const [selectedTimeRange, setSelectedTimeRange] = useState('Monthly');
  const [selectedTeam, setSelectedTeam] = useState('All Teams');
  const [selectedRoleType, setSelectedRoleType] = useState('All');
  const [isPlaying, setIsPlaying] = useState(false);

  const toggleNarration = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      toast.info('AI Narration Started', {
        description: 'Playing utilization health summary...',
      });
    } else {
      toast.info('AI Narration Paused');
    }
  };

  const handleRefresh = () => {
    toast.success('Data Refreshed', {
      description: 'Utilization metrics updated successfully.',
    });
  };

  // Calculate overall metrics
  const totalBillableHours = teamPerformanceData.reduce((sum, t) => sum + t.billableHours, 0);
  const totalNonBillableHours = teamPerformanceData.reduce((sum, t) => sum + t.nonBillableHours, 0);
  const overallUtilization = 71.6;
  const realizationRate = 84.2;
  const avgBillingRate = 9200;

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* Entity Context Bar */}
      <div className="bg-gradient-to-r from-blue-50 to-slate-50 border border-blue-200 rounded-lg px-6 py-3">
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-blue-600" />
            <span className="text-slate-700">Entity:</span>
            <span className="text-slate-900">CFOsync AI Pvt Ltd</span>
          </div>
          <div className="h-4 w-px bg-slate-300" />
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-blue-600" />
            <span className="text-slate-700">Month:</span>
            <span className="text-slate-900">Dec 2024</span>
          </div>
          <div className="h-4 w-px bg-slate-300" />
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-blue-600" />
            <span className="text-slate-700">Unit:</span>
            <span className="text-slate-900">Hours</span>
          </div>
          <div className="h-4 w-px bg-slate-300" />
          <div className="flex items-center gap-2">
            <IndianRupee className="h-4 w-4 text-blue-600" />
            <span className="text-slate-700">Currency:</span>
            <span className="text-slate-900">INR</span>
          </div>
        </div>
      </div>

      {/* AI Narration Section */}
      <Card className="border-blue-200 bg-gradient-to-br from-white to-blue-50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="relative flex-shrink-0">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center overflow-hidden border-2 border-blue-300">
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
                  <h3 className="text-slate-900">AI Workforce Utilization Analysis</h3>
                  <p className="text-sm text-slate-600">Automated insights on resource efficiency and capacity planning</p>
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
              <div className="bg-white border border-blue-200 rounded-lg p-4 mt-3">
                <p className="text-sm text-slate-700 leading-relaxed">
                  "Overall utilization at 71.6% is slightly below the 72% target but within healthy operational range. The realization 
                  rate of 84.2% approaches the industry benchmark of 85%, indicating strong billing discipline. Consulting leads with 
                  85% utilization and 88% realization, demonstrating optimal resource deployment. Engineering maintains solid 78% utilization 
                  with 1,540 billable hours, while Marketing at 68% shows opportunity for improvement against its 72% target. The billable 
                  to non-billable ratio of 4,940:1,810 (2.7:1) is healthy. Capacity forecast shows March 2025 at 107% utilization, signaling 
                  potential overload requiring hiring or workload redistribution. Average billing rate of ₹9,200/hr reflects a 3.2% MoM increase, 
                  driven by favorable client mix and rate optimization. Top performers like Priya Mehta at 92% utilization and Rahul Sharma at 
                  88% exemplify benchmark performance. Portfolio efficiency averages 87% with 2 of 5 projects below the 90% threshold, suggesting 
                  focused resource reallocation opportunities."
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters and Controls Bar */}
      <Card className="border-blue-200">
        <CardContent className="pt-6">
          <div className="flex flex-wrap items-center gap-4 justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-700">Time Range:</span>
                <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Weekly">Weekly</SelectItem>
                    <SelectItem value="Monthly">Monthly</SelectItem>
                    <SelectItem value="Quarterly">Quarterly</SelectItem>
                    <SelectItem value="YTD">YTD</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="h-6 w-px bg-slate-300" />

              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-700">Team:</span>
                <Select value={selectedTeam} onValueChange={setSelectedTeam}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All Teams">All Teams</SelectItem>
                    <SelectItem value="Consulting">Consulting</SelectItem>
                    <SelectItem value="Engineering">Engineering</SelectItem>
                    <SelectItem value="Design">Design</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Operations">Operations</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="h-6 w-px bg-slate-300" />

              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-700">Role Type:</span>
                <Select value={selectedRoleType} onValueChange={setSelectedRoleType}>
                  <SelectTrigger className="w-36">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All</SelectItem>
                    <SelectItem value="Billable">Billable</SelectItem>
                    <SelectItem value="Non-Billable">Non-Billable</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Database className="h-4 w-4 text-blue-600" />
                <span>Last Updated: 24 Jan 2025, 10:35 AM IST</span>
              </div>
              <Button variant="outline" size="sm" onClick={handleRefresh} className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Zap className="h-4 w-4 text-blue-600" />
                AI Summary
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KPI Summary Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-blue-100 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Overall Utilization</CardTitle>
            <Activity className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-slate-900">{overallUtilization}%</div>
            <HoverCard>
              <HoverCardTrigger asChild>
                <button className="text-xs text-green-600 mt-1 hover:underline cursor-pointer">
                  ↑ 1.3 pts MoM
                </button>
              </HoverCardTrigger>
              <HoverCardContent className="w-64">
                <div className="space-y-2">
                  <div className="text-xs">
                    <div className="flex justify-between mb-1">
                      <span className="text-slate-600">Current:</span>
                      <span className="text-slate-900">{overallUtilization}%</span>
                    </div>
                    <div className="flex justify-between mb-1">
                      <span className="text-slate-600">Target:</span>
                      <span className="text-slate-900">72%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Last 6 Months Trend:</span>
                    </div>
                  </div>
                  <div className="h-12">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={[
                        { value: 68.5 }, { value: 69.2 }, { value: 70.1 }, 
                        { value: 70.3 }, { value: 71.0 }, { value: 71.6 }
                      ]}>
                        <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
            <Progress value={overallUtilization} className="mt-3 h-1.5" />
          </CardContent>
        </Card>

        <Card className="border-green-100 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Realization Rate</CardTitle>
            <Percent className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-slate-900">{realizationRate}%</div>
            <p className="text-xs text-slate-600 mt-1">Target: 85% (Industry)</p>
            <div className="mt-3">
              <div className="flex items-center gap-2 mb-1">
                <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-600 transition-all"
                    style={{ width: `${(realizationRate / 85) * 100}%` }}
                  />
                </div>
              </div>
              <p className="text-xs text-slate-600">
                Formula: Billed Hours / Billable Hours × 100
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-teal-100 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Billable Hours</CardTitle>
            <Clock className="h-5 w-5 text-teal-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-slate-900">{totalBillableHours.toLocaleString()}</div>
            <p className="text-xs text-slate-600 mt-1">
              Billable : Non-Billable = {totalBillableHours} : {totalNonBillableHours}
            </p>
            <div className="mt-3 flex gap-1">
              <div 
                className="h-1.5 bg-teal-600 rounded-l-full"
                style={{ width: `${(totalBillableHours / (totalBillableHours + totalNonBillableHours)) * 100}%` }}
              />
              <div 
                className="h-1.5 bg-slate-300 rounded-r-full"
                style={{ width: `${(totalNonBillableHours / (totalBillableHours + totalNonBillableHours)) * 100}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-100 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Avg Billing Rate</CardTitle>
            <IndianRupee className="h-5 w-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-slate-900">₹{avgBillingRate.toLocaleString()}/hr</div>
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3 text-green-600" />
              <span className="text-xs text-green-600">↑ 3.2% MoM</span>
            </div>
            <p className="text-xs text-slate-600 mt-2">
              Σ(Billed Value) / Σ(Billable Hours)
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Team Utilization Trends & Capacity Forecast */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-blue-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Team Utilization Trends</CardTitle>
                <p className="text-sm text-slate-600 mt-1">Weekly utilization % by department</p>
              </div>
              <HoverCard>
                <HoverCardTrigger asChild>
                  <button className="p-2 hover:bg-slate-100 rounded">
                    <Info className="h-4 w-4 text-slate-500" />
                  </button>
                </HoverCardTrigger>
                <HoverCardContent className="w-80">
                  <div className="space-y-2 text-xs">
                    <p className="text-slate-700">
                      Dashed line shows company-level target utilization (72%).
                      Light grey band (60-80%) indicates optimal operational zone.
                    </p>
                    <p className="text-slate-600">
                      Toggle between Absolute % and Δ % from Target for relative performance view.
                    </p>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={teamUtilizationTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="week" 
                  tick={{ fill: '#64748b', fontSize: 11 }}
                />
                <YAxis 
                  domain={[55, 95]}
                  tick={{ fill: '#64748b', fontSize: 11 }}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip 
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-lg">
                          <div className="text-sm text-slate-900 mb-2">{label}</div>
                          {payload.filter(p => p.dataKey !== 'avgLine').map((entry, index) => (
                            <div key={index} className="flex items-center justify-between gap-4 text-xs">
                              <span className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                                {entry.name}:
                              </span>
                              <span className="text-slate-900">
                                {entry.value}% | Target: 72%
                              </span>
                            </div>
                          ))}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend />
                {/* Optimal Zone Band */}
                <ReferenceLine y={60} stroke="#94a3b8" strokeDasharray="3 3" strokeWidth={1} />
                <ReferenceLine y={80} stroke="#94a3b8" strokeDasharray="3 3" strokeWidth={1} />
                {/* Target Line */}
                <Line 
                  type="monotone" 
                  dataKey="avgLine" 
                  stroke="#64748b" 
                  strokeWidth={2} 
                  strokeDasharray="5 5" 
                  name="Target (72%)"
                  dot={false}
                />
                <Line type="monotone" dataKey="Design" stroke="#8b5cf6" strokeWidth={2} name="Design" />
                <Line type="monotone" dataKey="Engineering" stroke="#3b82f6" strokeWidth={2} name="Engineering" />
                <Line type="monotone" dataKey="Consulting" stroke="#10b981" strokeWidth={2} name="Consulting" />
                <Line type="monotone" dataKey="Marketing" stroke="#f59e0b" strokeWidth={2} name="Marketing" />
                <Line type="monotone" dataKey="Operations" stroke="#ef4444" strokeWidth={2} name="Operations" />
              </LineChart>
            </ResponsiveContainer>
            <div className="mt-4 text-xs text-slate-600">
              <p>Forecast based on 6-month moving average of project assignments + pipeline probability.</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Capacity vs Demand Forecast</CardTitle>
                <p className="text-sm text-slate-600 mt-1">6-month capacity planning outlook</p>
              </div>
              <HoverCard>
                <HoverCardTrigger asChild>
                  <button className="p-2 hover:bg-slate-100 rounded">
                    <Info className="h-4 w-4 text-slate-500" />
                  </button>
                </HoverCardTrigger>
                <HoverCardContent className="w-80">
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span>100% =</span>
                      <span className="text-red-600">Overbooked</span>
                    </div>
                    <div className="flex justify-between">
                      <span>85% =</span>
                      <span className="text-green-600">Ideal Capacity</span>
                    </div>
                    <div className="flex justify-between">
                      <span>&lt;70% =</span>
                      <span className="text-amber-600">Underutilized</span>
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={capacityDemandData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fill: '#64748b', fontSize: 11 }}
                />
                <YAxis 
                  tick={{ fill: '#64748b', fontSize: 11 }}
                  tickFormatter={(value) => `${value}`}
                />
                <Tooltip 
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-lg">
                          <div className="text-sm text-slate-900 mb-2">{label}</div>
                          <div className="space-y-1 text-xs">
                            <div className="flex justify-between gap-4">
                              <span className="text-slate-600">Capacity:</span>
                              <span className="text-slate-900">{data.capacity} hrs</span>
                            </div>
                            <div className="flex justify-between gap-4">
                              <span className="text-slate-600">Demand:</span>
                              <span className="text-slate-900">{data.demand} hrs</span>
                            </div>
                            <div className="flex justify-between gap-4">
                              <span className="text-slate-600">Utilization:</span>
                              <span className={`${data.utilization > 100 ? 'text-red-600' : data.utilization < 70 ? 'text-amber-600' : 'text-green-600'}`}>
                                {data.utilization}%
                              </span>
                            </div>
                            <div className="flex justify-between gap-4">
                              <span className="text-slate-600">Status:</span>
                              <span className={`${data.utilization > 100 ? 'text-red-600' : data.utilization < 70 ? 'text-amber-600' : 'text-green-600'}`}>
                                {data.utilization > 100 ? 'Slightly Overbooked' : data.utilization < 70 ? 'Underutilized' : 'Ideal'}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend />
                {/* Reference Lines */}
                <ReferenceLine y={2100} stroke="#ef4444" strokeDasharray="3 3" label="100% Overbooked" strokeWidth={1} />
                <ReferenceLine y={1785} stroke="#10b981" strokeDasharray="3 3" label="85% Ideal" strokeWidth={1} />
                <ReferenceLine y={1470} stroke="#f59e0b" strokeDasharray="3 3" label="70% Low" strokeWidth={1} />
                
                <Area 
                  type="monotone" 
                  dataKey="capacity" 
                  stroke="#94a3b8" 
                  fill="#94a3b8" 
                  fillOpacity={0.2}
                  name="Capacity"
                />
                <Area 
                  type="monotone" 
                  dataKey="demand" 
                  stroke="#3b82f6" 
                  fill="#3b82f6" 
                  fillOpacity={0.5}
                  name="Demand"
                />
              </AreaChart>
            </ResponsiveContainer>
            <div className="mt-4 text-xs text-slate-600">
              <p>Forecast Source: 6-month moving average of project assignments + pipeline probability (from CRM integration)</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Team Performance Summary Table */}
      <Card className="border-blue-200">
        <CardHeader>
          <CardTitle>Team Performance Summary</CardTitle>
          <p className="text-sm text-slate-600">Detailed utilization metrics by team</p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 text-sm text-slate-700">Team</th>
                  <th className="text-left py-3 px-4 text-sm text-slate-700">Utilization % / Target %</th>
                  <th className="text-left py-3 px-4 text-sm text-slate-700">Realization %</th>
                  <th className="text-left py-3 px-4 text-sm text-slate-700">Billable vs Non-Billable</th>
                  <th className="text-left py-3 px-4 text-sm text-slate-700">Avg Rate</th>
                  <th className="text-left py-3 px-4 text-sm text-slate-700">% vs Target</th>
                  <th className="text-left py-3 px-4 text-sm text-slate-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {teamPerformanceData.map((team, index) => (
                  <HoverCard key={index}>
                    <HoverCardTrigger asChild>
                      <tr className="border-b border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors">
                        <td className="py-3 px-4">
                          <span className="text-sm text-slate-900">{team.team}</span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="space-y-1">
                            <div className="text-sm text-slate-900">{team.utilization}% / {team.target}%</div>
                            <div className="w-32 h-2 bg-slate-200 rounded-full overflow-hidden">
                              <div 
                                className={`h-full ${team.utilization >= team.target ? 'bg-green-600' : 'bg-amber-600'}`}
                                style={{ width: `${(team.utilization / team.target) * 100}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-slate-900">{team.realization}%</span>
                            <HoverCard>
                              <HoverCardTrigger asChild>
                                <button className="p-1 hover:bg-slate-200 rounded">
                                  <Info className="h-3 w-3 text-slate-500" />
                                </button>
                              </HoverCardTrigger>
                              <HoverCardContent className="w-64">
                                <div className="text-xs space-y-1">
                                  <p className="text-slate-900">Realization Formula:</p>
                                  <p className="text-slate-600">Billable Value ÷ Total Logged Value × 100</p>
                                </div>
                              </HoverCardContent>
                            </HoverCard>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="space-y-1">
                            <div className="text-sm text-slate-900">{team.billableHours} | {team.nonBillableHours}</div>
                            <div className="flex gap-1">
                              <div 
                                className="h-1.5 bg-blue-600 rounded-l-full"
                                style={{ width: `${(team.billableHours / (team.billableHours + team.nonBillableHours)) * 100}%` }}
                              />
                              <div 
                                className="h-1.5 bg-slate-300 rounded-r-full"
                                style={{ width: `${(team.nonBillableHours / (team.billableHours + team.nonBillableHours)) * 100}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="space-y-1">
                            <div className="text-sm text-slate-900">₹{team.avgRate.toLocaleString()}</div>
                            <div className="h-8 w-20">
                              <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={team.trend.map(v => ({ value: v }))}>
                                  <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} dot={false} />
                                </LineChart>
                              </ResponsiveContainer>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className={`text-sm ${team.utilization >= team.target ? 'text-green-600' : 'text-amber-600'}`}>
                            {team.utilization >= team.target ? '+' : ''}{(team.utilization - team.target).toFixed(1)}%
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant="outline" className={STATUS_CONFIG[team.status].color}>
                            {STATUS_CONFIG[team.status].icon} {STATUS_CONFIG[team.status].label}
                          </Badge>
                        </td>
                      </tr>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80">
                      <div className="space-y-2 text-xs">
                        <div className="text-sm text-slate-900 mb-2">{team.team}</div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Utilization:</span>
                          <span className="text-slate-900">{team.utilization}% (vs Target {team.target}%)</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Realization:</span>
                          <span className="text-slate-900">{team.realization}% (vs Industry 85%)</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Billable:</span>
                          <span className="text-slate-900">{team.billableHours} hrs</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Non-Billable:</span>
                          <span className="text-slate-900">{team.nonBillableHours} hrs</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Avg Rate:</span>
                          <span className="text-slate-900">₹{team.avgRate.toLocaleString()}/hr</span>
                        </div>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Top Performers & Project Efficiency */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-blue-200">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-amber-500" />
              <CardTitle>Top Performers</CardTitle>
            </div>
            <p className="text-sm text-slate-600">Highest utilization & realization employees</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topPerformers.map((performer) => (
                <HoverCard key={performer.rank}>
                  <HoverCardTrigger asChild>
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200 hover:shadow-md transition-shadow cursor-pointer">
                      <div className="flex-shrink-0">
                        {performer.rank === 1 && <span className="text-2xl">🥇</span>}
                        {performer.rank === 2 && <span className="text-2xl">🥈</span>}
                        {performer.rank === 3 && <span className="text-2xl">🥉</span>}
                        {performer.rank > 3 && (
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-sm text-blue-700">
                            {performer.rank}
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-slate-900">{performer.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {performer.team}
                          </Badge>
                        </div>
                        <div className="flex gap-4 text-xs text-slate-600">
                          <span>Util: {performer.utilization}%</span>
                          <span>Real: {performer.realization}%</span>
                          <span className="text-green-600">{performer.trend}</span>
                        </div>
                        <div className="mt-2 flex gap-1">
                          <div 
                            className="h-1.5 bg-green-600 rounded-full"
                            style={{ width: `${performer.utilization}%` }}
                          />
                          <div 
                            className="h-1.5 bg-slate-200 rounded-full flex-1"
                          />
                        </div>
                      </div>
                    </div>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80">
                    <div className="space-y-2 text-xs">
                      <div className="text-sm text-slate-900 mb-2">{performer.name} ({performer.team})</div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Utilization:</span>
                        <span className="text-slate-900">{performer.utilization}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Realization:</span>
                        <span className="text-slate-900">{performer.realization}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Billing Rate:</span>
                        <span className="text-slate-900">₹{performer.billingRate.toLocaleString()}/hr</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Total Hours:</span>
                        <span className="text-slate-900">{performer.hours} hrs</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Projects:</span>
                        <span className="text-slate-900">{performer.projects}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Trend:</span>
                        <span className="text-green-600">{performer.trend}</span>
                      </div>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-600" />
              <CardTitle>Project Resource Efficiency</CardTitle>
            </div>
            <p className="text-sm text-slate-600">Budget vs actual utilization by project</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {projectEfficiency.map((project, index) => (
                <HoverCard key={index}>
                  <HoverCardTrigger asChild>
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 hover:shadow-md transition-shadow cursor-pointer">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-slate-900">{project.project}</span>
                        <div className="flex items-center gap-2">
                          {project.efficiency < 80 && <AlertTriangle className="h-4 w-4 text-amber-600" />}
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${
                              project.efficiency >= 90 ? 'bg-green-50 text-green-700 border-green-300' :
                              project.efficiency >= 80 ? 'bg-blue-50 text-blue-700 border-blue-300' :
                              'bg-amber-50 text-amber-700 border-amber-300'
                            }`}
                          >
                            {project.efficiency}%
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${EFFICIENCY_CONFIG[project.status].color}`}
                            style={{ width: `${project.efficiency}%` }}
                          />
                        </div>
                      </div>
                      <div className="flex justify-between text-xs text-slate-600">
                        <span>Budget: ₹{(project.budget / 1000).toFixed(0)}K</span>
                        <span>Actual: ₹{(project.actual / 1000).toFixed(0)}K</span>
                        <span className="text-green-600">Saved: ₹{(project.variance / 1000).toFixed(0)}K</span>
                      </div>
                    </div>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80">
                    <div className="space-y-2 text-xs">
                      <div className="text-sm text-slate-900 mb-2">{project.project}</div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Budget:</span>
                        <span className="text-slate-900">₹{project.budget.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Actual:</span>
                        <span className="text-slate-900">₹{project.actual.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Resources Allocated:</span>
                        <span className="text-slate-900">{project.allocated}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Resources Utilized:</span>
                        <span className="text-slate-900">{project.utilized}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Efficiency:</span>
                        <span className="text-slate-900">{project.efficiency}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Variance:</span>
                        <span className="text-green-600">₹{project.variance.toLocaleString()} (Favorable)</span>
                      </div>
                      <div className="mt-2 pt-2 border-t border-slate-200">
                        <p className="text-slate-600">
                          Formula: Efficiency = (Actual Utilized Value / Budget Value) × 100
                        </p>
                      </div>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              ))}
              <div className="mt-4 pt-3 border-t border-slate-200 text-sm text-slate-700">
                <div className="flex justify-between">
                  <span>Average Portfolio Efficiency:</span>
                  <span className="text-green-600">87%</span>
                </div>
                <p className="text-xs text-slate-600 mt-1">2 projects below 90% threshold</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Workforce Insights */}
      <Card className="border-blue-200 bg-gradient-to-br from-white to-blue-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-blue-600" />
              <div>
                <CardTitle>AI Workforce Insights</CardTitle>
                <p className="text-sm text-slate-600 mt-1">Predictive recommendations for capacity, pricing, and performance</p>
              </div>
            </div>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">
              Confidence: 92%
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* High Performers */}
            <div className="bg-white border-l-4 border-green-600 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="text-sm text-slate-900">High Performers</h4>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300 text-xs">
                      Green
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed mb-2">
                    5 employees consistently above 85% utilization with 90%+ realization. Consider for mentorship roles 
                    or assignment to high-value strategic projects.
                  </p>
                  <Button variant="outline" size="sm" className="text-xs h-7">
                    View Action Plan
                  </Button>
                </div>
              </div>
            </div>

            {/* Improvement Opportunity */}
            <div className="bg-white border-l-4 border-amber-600 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="h-5 w-5 text-amber-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="text-sm text-slate-900">Improvement Opportunity</h4>
                    <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-300 text-xs">
                      Amber
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed mb-2">
                    4 employees below 60% utilization for 3+ weeks. Recommend skill development programs or 
                    cross-functional project assignments.
                  </p>
                  <Button variant="outline" size="sm" className="text-xs h-7">
                    View Action Plan
                  </Button>
                </div>
              </div>
            </div>

            {/* Capacity Planning */}
            <div className="bg-white border-l-4 border-blue-600 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="text-sm text-slate-900">Capacity Planning</h4>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300 text-xs">
                      Blue
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed mb-2">
                    Engineering expected at 102% capacity in Feb 2025. Recommend hiring 2 mid-level engineers 
                    or redistributing 15% of workload to Design team.
                  </p>
                  <Button variant="outline" size="sm" className="text-xs h-7">
                    View Action Plan
                  </Button>
                </div>
              </div>
            </div>

            {/* Rate Optimization */}
            <div className="bg-white border-l-4 border-purple-600 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <IndianRupee className="h-5 w-5 text-purple-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="text-sm text-slate-900">Rate Optimization</h4>
                    <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-300 text-xs">
                      Purple
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed mb-2">
                    3 clients paying below average realization rate (78% vs 84% avg). Potential revenue uplift 
                    of ₹2.4L/month through rate renegotiation.
                  </p>
                  <Button variant="outline" size="sm" className="text-xs h-7">
                    View Action Plan
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* AI Confidence Explanation */}
          <div className="mt-6 bg-white border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 text-blue-600 mt-0.5" />
              <div className="text-xs text-slate-700">
                <p className="mb-1">
                  <span className="text-slate-900">AI Confidence Score (92%):</span> Calculated as 
                  <span className="font-mono bg-slate-100 px-1 mx-1 rounded">1 - (Forecast_Error / Actual)</span>
                </p>
                <p className="text-slate-600">
                  Based on historical accuracy of utilization forecasts over the past 6 months. Higher confidence 
                  indicates more reliable predictions and actionable recommendations.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Formulas Reference */}
      <Card className="border-blue-200">
        <CardHeader>
          <CardTitle>Key Metrics & Formulas</CardTitle>
          <p className="text-sm text-slate-600">Reference guide for utilization calculations</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <div className="text-sm text-slate-900 mb-2">Utilization %</div>
              <div className="text-xs font-mono bg-white p-2 rounded border border-slate-200 mb-2">
                (Billable Hours ÷ Available Hours) × 100
              </div>
              <p className="text-xs text-slate-600">Include PTO & holidays in available hours</p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <div className="text-sm text-slate-900 mb-2">Realization %</div>
              <div className="text-xs font-mono bg-white p-2 rounded border border-slate-200 mb-2">
                (Billable Value ÷ Billable Hours) × 100
              </div>
              <p className="text-xs text-slate-600">Adjusted for discounts or write-offs</p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <div className="text-sm text-slate-900 mb-2">Avg Billing Rate</div>
              <div className="text-xs font-mono bg-white p-2 rounded border border-slate-200 mb-2">
                Σ(Billed Value) ÷ Σ(Billable Hours)
              </div>
              <p className="text-xs text-slate-600">Weighted average across all resources</p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <div className="text-sm text-slate-900 mb-2">Capacity Utilization</div>
              <div className="text-xs font-mono bg-white p-2 rounded border border-slate-200 mb-2">
                (Total Hours Utilized ÷ Total Capacity)
              </div>
              <p className="text-xs text-slate-600">Based on project assignments</p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <div className="text-sm text-slate-900 mb-2">Efficiency %</div>
              <div className="text-xs font-mono bg-white p-2 rounded border border-slate-200 mb-2">
                (Actual ÷ Budget) × 100
              </div>
              <p className="text-xs text-slate-600">&lt;90% indicates underperforming</p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <div className="text-sm text-slate-900 mb-2">AI Confidence</div>
              <div className="text-xs font-mono bg-white p-2 rounded border border-slate-200 mb-2">
                1 - (Forecast_Error / Actual)
              </div>
              <p className="text-xs text-slate-600">Confidence in AI recommendation accuracy</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
