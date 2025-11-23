import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Globe, MapPin, TrendingUp, Users, AlertTriangle, Target, ArrowUpRight, ArrowDownRight, Lightbulb, Download, ChevronDown, ChevronUp, Building2, IndianRupee, Calendar, Database, Play, Pause } from 'lucide-react';
import { useState, useMemo } from 'react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { toast } from 'sonner@2.0.3';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '../ui/hover-card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';

// Mock data for Indian states
const stateData = [
  { state: 'Maharashtra', revenue: 3960000, share: 36, growth: 15, gm: 42, customers: 85, dso: 38, avgTicket: 46588, topCustomer: 'TechCorp Solutions', region: 'West' },
  { state: 'Karnataka', revenue: 2640000, share: 24, growth: 22, gm: 38, customers: 62, dso: 42, avgTicket: 42581, topCustomer: 'InfoSys Partners', region: 'South' },
  { state: 'Gujarat', revenue: 2200000, share: 20, growth: 25, gm: 40, customers: 55, dso: 35, avgTicket: 40000, topCustomer: 'Gujarat Industries', region: 'West' },
  { state: 'Tamil Nadu', revenue: 1100000, share: 10, growth: 18, gm: 36, customers: 38, dso: 45, avgTicket: 28947, topCustomer: 'Chennai Tech', region: 'South' },
  { state: 'Delhi NCR', revenue: 660000, share: 6, growth: 12, gm: 35, customers: 28, dso: 40, avgTicket: 23571, topCustomer: 'Capital Ventures', region: 'North' },
  { state: 'Telangana', revenue: 440000, share: 4, growth: 28, gm: 39, customers: 22, dso: 36, avgTicket: 20000, topCustomer: 'Hyderabad Systems', region: 'South' },
];

// Regional aggregated data
const regionalData = [
  { region: 'West', revenue: 6160000, share: 56, growth: 19, gm: 41, customers: 140 },
  { region: 'South', revenue: 4180000, share: 38, growth: 21, gm: 37, customers: 122 },
  { region: 'North', revenue: 660000, share: 6, growth: 12, gm: 35, customers: 28 },
];

// Top cities data
const cityData = [
  { city: 'Mumbai', state: 'Maharashtra', revenue: 2200000, share: 20, growth: 16, region: 'West' },
  { city: 'Bangalore', state: 'Karnataka', revenue: 1800000, share: 16, growth: 24, region: 'South' },
  { city: 'Ahmedabad', state: 'Gujarat', revenue: 1500000, share: 14, growth: 26, region: 'West' },
  { city: 'Pune', state: 'Maharashtra', revenue: 1100000, share: 10, growth: 14, region: 'West' },
  { city: 'Chennai', state: 'Tamil Nadu', revenue: 880000, share: 8, growth: 18, region: 'South' },
  { city: 'Hyderabad', state: 'Telangana', revenue: 440000, share: 4, growth: 28, region: 'South' },
];

// Monthly regional trend data
const monthlyTrendData = [
  { month: 'Jul', West: 480000, South: 320000, North: 50000 },
  { month: 'Aug', West: 495000, South: 335000, North: 52000 },
  { month: 'Sep', West: 510000, South: 345000, North: 54000 },
  { month: 'Oct', West: 525000, South: 358000, North: 55000 },
  { month: 'Nov', West: 540000, South: 368000, North: 56000 },
  { month: 'Dec', West: 555000, South: 380000, North: 58000 },
];

// HHI trend data
const hhiTrendData = [
  { month: 'Jul', hhi: 0.32 },
  { month: 'Aug', hhi: 0.31 },
  { month: 'Sep', hhi: 0.30 },
  { month: 'Oct', hhi: 0.29 },
  { month: 'Nov', hhi: 0.28 },
  { month: 'Dec', hhi: 0.28 },
];

const REGION_COLORS = {
  West: '#0F766E',
  South: '#7C3AED',
  North: '#DC2626',
};

export function GeoMixDashboard() {
  const [selectedState, setSelectedState] = useState<string>('Maharashtra');
  const [sortColumn, setSortColumn] = useState<string>('revenue');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [mapView, setMapView] = useState<'revenue' | 'gm' | 'growth' | 'customers'>('revenue');
  const [viewMode, setViewMode] = useState<'state' | 'region'>('state');
  const [showAIInsights, setShowAIInsights] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [collapsedRegions, setCollapsedRegions] = useState<Record<string, boolean>>({});

  // Calculate total revenue and KPIs
  const totalRevenue = stateData.reduce((sum, s) => sum + s.revenue, 0);
  const totalStates = stateData.length;
  const activeStates = stateData.filter(s => s.revenue > 500000).length;
  const topState = stateData[0];
  const fastestGrowing = [...stateData].sort((a, b) => b.growth - a.growth)[0];
  
  // Calculate HHI (Herfindahl-Hirschman Index)
  const hhi = stateData.reduce((sum, s) => {
    const share = s.share / 100;
    return sum + (share * share);
  }, 0);

  // Calculate top 3 states and top 5 cities concentration
  const top3States = stateData.slice(0, 3).reduce((sum, s) => sum + s.share, 0);
  const top5Cities = cityData.slice(0, 5).reduce((sum, c) => sum + c.share, 0);
  const coverageStates = (activeStates / 28) * 100; // 28 states + 8 UTs in India

  // Get concentration risk level
  const getConcentrationRisk = (hhi: number) => {
    if (hhi <= 0.25) return { level: 'Low', color: 'bg-green-100 text-green-800 border-green-300', icon: '🟢' };
    if (hhi <= 0.35) return { level: 'Moderate', color: 'bg-amber-100 text-amber-800 border-amber-300', icon: '🟡' };
    return { level: 'High', color: 'bg-red-100 text-red-800 border-red-300', icon: '🔴' };
  };

  const concentrationRisk = getConcentrationRisk(hhi);

  // Sort state data
  const sortedStateData = useMemo(() => {
    const sorted = [...stateData].sort((a, b) => {
      const aVal = a[sortColumn as keyof typeof a];
      const bVal = b[sortColumn as keyof typeof b];
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
      }
      return 0;
    });
    return sorted;
  }, [sortColumn, sortDirection]);

  // Get selected state details
  const selectedStateData = stateData.find(s => s.state === selectedState) || stateData[0];

  // Handle column sort
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('desc');
    }
  };

  // Toggle region collapse
  const toggleRegion = (region: string) => {
    setCollapsedRegions(prev => ({ ...prev, [region]: !prev[region] }));
  };

  // Generate AI insights
  const generateAIInsights = () => {
    setShowAIInsights(true);
    toast.success('AI Regional Insights Generated', {
      description: 'Revenue concentration remains high at 36% in Maharashtra; Gujarat\'s growth (+25%) is driving West zone lead.',
    });
  };

  // Play/pause narration
  const toggleNarration = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      toast.info('AI Narration Started', {
        description: 'Playing geographic distribution insights...',
      });
    } else {
      toast.info('AI Narration Paused');
    }
  };

  // Export functionality
  const handleExport = (type: string) => {
    toast.success(`Exporting ${type}...`, {
      description: 'Your download will begin shortly.',
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
          <div className="h-4 w-px bg-slate-300" />
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-teal-600" />
            <span className="text-slate-700">HHI Target:</span>
            <span className="text-slate-900">≤0.25</span>
          </div>
        </div>
      </div>

      {/* AI Narration Section */}
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
                  <h3 className="text-slate-900">AI Geographic Distribution Insights</h3>
                  <p className="text-sm text-slate-600">Automated analysis of regional concentration and growth patterns</p>
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
                  "West Zone continues to dominate with 60% revenue share, driven primarily by Maharashtra (36%) and Gujarat (20%). 
                  South Zone posted the highest growth at +21% YoY, led by Telangana's exceptional 28% expansion. 
                  Geographic concentration remains moderately high with HHI at 0.28, suggesting opportunities for diversification into Northern and Eastern regions. 
                  City-level concentration is concerning at 67% in top 5 cities, indicating geographic risk. 
                  Gujarat's 25% growth rate and improving margins (40%) signal strong West zone momentum, while expanding into underserved states could reduce concentration by 4-5 percentage points."
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* View Toggle */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-600">Geographic distribution of revenue across India</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={generateAIInsights}
            className="gap-2"
          >
            <Lightbulb className="h-4 w-4" />
            AI Regional Summary
          </Button>
          <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'state' | 'region')}>
            <TabsList>
              <TabsTrigger value="state">State View</TabsTrigger>
              <TabsTrigger value="region">Region View</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Top-Level KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total States */}
        <HoverCard>
          <HoverCardTrigger asChild>
            <Card className="cursor-pointer hover:shadow-lg transition-shadow border-teal-100">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm">Total States</CardTitle>
                <Globe className="h-4 w-4 text-teal-600" />
              </CardHeader>
              <CardContent>
                <div className="text-slate-900">{totalStates} States</div>
                <p className="text-xs text-slate-600 mt-1">Active: {activeStates} states</p>
                <div className="mt-2 h-1 bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-teal-600 transition-all"
                    style={{ width: `${(activeStates / totalStates) * 100}%` }}
                  />
                </div>
              </CardContent>
            </Card>
          </HoverCardTrigger>
          <HoverCardContent className="w-80">
            <div className="space-y-2">
              <h4 className="text-sm">State Coverage Details</h4>
              <p className="text-xs text-slate-600">
                Active states are defined as those with revenue {'>'} ₹5L in the last 12 months.
              </p>
              <div className="pt-2 border-t">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-600">Total States:</span>
                  <span className="text-slate-900">{totalStates}</span>
                </div>
                <div className="flex justify-between text-xs mt-1">
                  <span className="text-slate-600">Active States:</span>
                  <span className="text-green-600">{activeStates}</span>
                </div>
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>

        {/* Top State Share */}
        <HoverCard>
          <HoverCardTrigger asChild>
            <Card className="cursor-pointer hover:shadow-lg transition-shadow border-teal-100">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm">Top State Share</CardTitle>
                <MapPin className="h-4 w-4 text-teal-600" />
              </CardHeader>
              <CardContent>
                <div className="text-slate-900">{topState.state}</div>
                <p className="text-xs text-teal-600 mt-1">{topState.share}% share</p>
                <div className="mt-2 h-1 bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-teal-600 transition-all"
                    style={{ width: `${topState.share}%` }}
                  />
                </div>
              </CardContent>
            </Card>
          </HoverCardTrigger>
          <HoverCardContent className="w-80">
            <div className="space-y-2">
              <h4 className="text-sm">{topState.state} Revenue Details</h4>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-600">Revenue:</span>
                  <span className="text-slate-900">₹{(topState.revenue / 100000).toFixed(1)}L</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Share:</span>
                  <span className="text-slate-900">{topState.share}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Growth:</span>
                  <span className="text-green-600">+{topState.growth}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Customers:</span>
                  <span className="text-slate-900">{topState.customers}</span>
                </div>
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>

        {/* Fastest Growth */}
        <HoverCard>
          <HoverCardTrigger asChild>
            <Card className="cursor-pointer hover:shadow-lg transition-shadow border-green-100">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm">Fastest Growth</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-slate-900">{fastestGrowing.state}</div>
                <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                  <ArrowUpRight className="h-3 w-3" />
                  +{fastestGrowing.growth}% YoY
                </p>
                <div className="mt-2 h-1 bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-600 transition-all"
                    style={{ width: `${Math.min(fastestGrowing.growth * 3, 100)}%` }}
                  />
                </div>
              </CardContent>
            </Card>
          </HoverCardTrigger>
          <HoverCardContent className="w-80">
            <div className="space-y-2">
              <h4 className="text-sm">{fastestGrowing.state} Growth Analysis</h4>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-600">YoY Growth:</span>
                  <span className="text-green-600">+{fastestGrowing.growth}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Absolute Growth:</span>
                  <span className="text-slate-900">+₹{((fastestGrowing.revenue * fastestGrowing.growth) / (100 * 100000)).toFixed(1)}L</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Current Revenue:</span>
                  <span className="text-slate-900">₹{(fastestGrowing.revenue / 100000).toFixed(1)}L</span>
                </div>
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>

        {/* Concentration Risk (HHI) */}
        <HoverCard>
          <HoverCardTrigger asChild>
            <Card className={`cursor-pointer hover:shadow-lg transition-shadow border-2 ${concentrationRisk.color.replace('bg-', 'border-').replace('text-', 'border-')}`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm">Concentration Risk</CardTitle>
                <AlertTriangle className="h-4 w-4 text-amber-600" />
              </CardHeader>
              <CardContent>
                <div className="text-slate-900">HHI: {hhi.toFixed(2)}</div>
                <Badge variant="outline" className={`mt-2 ${concentrationRisk.color} border`}>
                  {concentrationRisk.icon} {concentrationRisk.level} Risk
                </Badge>
                <div className="mt-3 h-1 bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all ${hhi <= 0.25 ? 'bg-green-600' : hhi <= 0.35 ? 'bg-amber-600' : 'bg-red-600'}`}
                    style={{ width: `${Math.min((hhi / 0.5) * 100, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-xs text-slate-500">Target: 0.25</span>
                  <span className="text-xs text-slate-500">Current: {hhi.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>
          </HoverCardTrigger>
          <HoverCardContent className="w-80">
            <div className="space-y-2">
              <h4 className="text-sm">HHI Index Explanation</h4>
              <p className="text-xs text-slate-600">
                HHI = Σ(S_i²), where S_i = revenue share per region.
              </p>
              <div className="pt-2 border-t space-y-1">
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-3 h-3 bg-green-600 rounded" />
                  <span className="text-slate-600">≤0.25: Low Risk</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-3 h-3 bg-amber-600 rounded" />
                  <span className="text-slate-600">0.25–0.35: Moderate Risk</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-3 h-3 bg-red-600 rounded" />
                  <span className="text-slate-600">{'>'}0.35: High Risk</span>
                </div>
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
      </div>

      {/* Map and State Details Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive Map Placeholder */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Revenue Distribution Map</CardTitle>
              <div className="flex items-center gap-2">
                <Select value={mapView} onValueChange={(v) => setMapView(v as any)}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="revenue">View by Revenue</SelectItem>
                    <SelectItem value="gm">View by GM%</SelectItem>
                    <SelectItem value="growth">View by Growth%</SelectItem>
                    <SelectItem value="customers">View by Customers</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm" onClick={() => handleExport('Map PNG')}>
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Placeholder for interactive India map */}
            <div className="bg-gradient-to-br from-teal-50 to-slate-50 rounded-lg p-8 border-2 border-dashed border-teal-300 min-h-[400px] flex flex-col items-center justify-center">
              <Globe className="h-24 w-24 text-teal-600 mb-4 opacity-50" />
              <h3 className="text-slate-700 mb-2">Interactive India Map</h3>
              <p className="text-sm text-slate-600 text-center max-w-md mb-4">
                Choropleth visualization with color gradient (teal → orange) based on {mapView}.
                Click states to view details. Double-click for city-level drill-down.
              </p>
              <div className="flex items-center gap-4 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-3 bg-gradient-to-r from-teal-200 to-teal-600 rounded" />
                  <span>Low</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-3 bg-gradient-to-r from-orange-200 to-orange-600 rounded" />
                  <span>High</span>
                </div>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-3 w-full max-w-md">
                {stateData.slice(0, 4).map((state) => (
                  <button
                    key={state.state}
                    onClick={() => setSelectedState(state.state)}
                    className={`p-3 rounded-lg border-2 text-left transition-all ${
                      selectedState === state.state
                        ? 'border-teal-600 bg-teal-50'
                        : 'border-slate-200 bg-white hover:border-teal-300'
                    }`}
                  >
                    <div className="text-sm text-slate-900">{state.state}</div>
                    <div className="text-xs text-slate-600 mt-1">₹{(state.revenue / 100000).toFixed(1)}L • {state.share}%</div>
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* State Details Panel */}
        <Card className="border-teal-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-teal-600" />
              {selectedStateData.state} Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Micro KPIs */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gradient-to-br from-teal-50 to-teal-100 p-3 rounded-lg border border-teal-200">
                <div className="text-xs text-teal-700 mb-1">Revenue</div>
                <div className="text-lg text-slate-900">₹{(selectedStateData.revenue / 100000).toFixed(1)}L</div>
                <div className="text-xs text-green-600 mt-1 flex items-center gap-1">
                  <ArrowUpRight className="h-3 w-3" />
                  +{selectedStateData.growth}%
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 p-3 rounded-lg border border-green-200">
                <div className="text-xs text-green-700 mb-1">Gross Margin</div>
                <div className="text-lg text-slate-900">{selectedStateData.gm}%</div>
                <div className="text-xs text-slate-600 mt-1">Target: 35%</div>
              </div>

              <div className={`p-3 rounded-lg border ${
                selectedStateData.dso > 45 
                  ? 'bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200' 
                  : 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200'
              }`}>
                <div className={`text-xs mb-1 ${selectedStateData.dso > 45 ? 'text-amber-700' : 'text-blue-700'}`}>DSO Days</div>
                <div className="text-lg text-slate-900">{selectedStateData.dso}</div>
                <div className="text-xs text-slate-600 mt-1">Target: ≤45</div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-3 rounded-lg border border-blue-200">
                <div className="text-xs text-blue-700 mb-1">Customers</div>
                <div className="text-lg text-slate-900">{selectedStateData.customers}</div>
                <div className="text-xs text-slate-600 mt-1">Active</div>
              </div>
            </div>

            {/* Additional Metrics */}
            <div className="space-y-2 pt-2 border-t">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Avg Ticket Size</span>
                <span className="text-slate-900">₹{selectedStateData.avgTicket.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">YoY Change</span>
                <span className="text-green-600 flex items-center gap-1">
                  <ArrowUpRight className="h-3 w-3" />
                  +{selectedStateData.growth}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Region</span>
                <Badge style={{ backgroundColor: REGION_COLORS[selectedStateData.region as keyof typeof REGION_COLORS] }}>
                  {selectedStateData.region}
                </Badge>
              </div>
            </div>

            {/* Top Customer */}
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <div className="text-xs text-slate-600 mb-2">Top Customer</div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-slate-900">{selectedStateData.topCustomer}</div>
                  <div className="text-xs text-slate-600 mt-1">Primary contributor</div>
                </div>
                <div className="w-16 h-8">
                  {/* Sparkline placeholder */}
                  <div className="w-full h-full bg-gradient-to-r from-transparent via-teal-200 to-teal-400 rounded" />
                </div>
              </div>
            </div>

            {/* Growth Trend */}
            <div className="bg-green-50 p-3 rounded-lg border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-green-700 mb-1">Growth Trend</div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-900">+{selectedStateData.growth}%</span>
                    <Badge variant="outline" className="bg-white border-green-300 text-green-700">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Improving
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Market Position */}
            <div>
              <div className="text-xs text-slate-600 mb-2">Market Position</div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-600">Current Share</span>
                  <span className="text-slate-900">{selectedStateData.share}%</span>
                </div>
                <div className="relative h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-teal-600 transition-all"
                    style={{ width: `${selectedStateData.share}%` }}
                  />
                  {/* Target marker */}
                  <div 
                    className="absolute top-0 bottom-0 w-0.5 bg-red-600"
                    style={{ left: '30%' }}
                  />
                </div>
                <div className="text-xs text-slate-500">Target diversification: ≤30% share</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Regional Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>State-wise Revenue Analysis</CardTitle>
            <Button variant="outline" size="sm" onClick={() => handleExport('Table CSV')}>
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead 
                  className="cursor-pointer hover:bg-slate-50"
                  onClick={() => handleSort('state')}
                >
                  <div className="flex items-center gap-1">
                    State / Region
                    {sortColumn === 'state' && (sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />)}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-slate-50 text-right"
                  onClick={() => handleSort('revenue')}
                >
                  <div className="flex items-center justify-end gap-1">
                    Revenue
                    {sortColumn === 'revenue' && (sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />)}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-slate-50 text-right"
                  onClick={() => handleSort('share')}
                >
                  <div className="flex items-center justify-end gap-1">
                    Share %
                    {sortColumn === 'share' && (sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />)}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-slate-50 text-right"
                  onClick={() => handleSort('gm')}
                >
                  <div className="flex items-center justify-end gap-1">
                    GM %
                    {sortColumn === 'gm' && (sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />)}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-slate-50 text-right"
                  onClick={() => handleSort('growth')}
                >
                  <div className="flex items-center justify-end gap-1">
                    YoY Growth
                    {sortColumn === 'growth' && (sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />)}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-slate-50 text-right"
                  onClick={() => handleSort('customers')}
                >
                  <div className="flex items-center justify-end gap-1">
                    Customers
                    {sortColumn === 'customers' && (sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />)}
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedStateData.map((state) => (
                <HoverCard key={state.state}>
                  <HoverCardTrigger asChild>
                    <TableRow 
                      className="cursor-pointer hover:bg-teal-50"
                      onClick={() => setSelectedState(state.state)}
                    >
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: REGION_COLORS[state.region as keyof typeof REGION_COLORS] }}
                          />
                          <span className={selectedState === state.state ? 'text-teal-700' : ''}>{state.state}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">₹{(state.revenue / 100000).toFixed(1)}L</TableCell>
                      <TableCell className="text-right">{state.share}%</TableCell>
                      <TableCell className={`text-right ${state.gm < 35 ? 'text-red-600' : 'text-slate-900'}`}>
                        {state.gm}%
                      </TableCell>
                      <TableCell className="text-right">
                        <span className={`flex items-center justify-end gap-1 ${state.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {state.growth > 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                          {state.growth > 0 ? '+' : ''}{state.growth}%
                        </span>
                      </TableCell>
                      <TableCell className="text-right">{state.customers}</TableCell>
                    </TableRow>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80">
                    <div className="space-y-2">
                      <h4 className="text-sm">{state.state} Details</h4>
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span className="text-slate-600">Revenue:</span>
                          <span className="text-slate-900">₹{(state.revenue / 100000).toFixed(1)}L ({state.share}% share)</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">GM%:</span>
                          <span className="text-slate-900">{state.gm}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">YoY:</span>
                          <span className="text-green-600">+{state.growth}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Customers:</span>
                          <span className="text-slate-900">{state.customers}</span>
                        </div>
                      </div>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              ))}
              {/* Total Row */}
              <TableRow className="bg-slate-50">
                <TableCell className="text-slate-900">Total</TableCell>
                <TableCell className="text-right text-slate-900">₹{(totalRevenue / 100000).toFixed(1)}L</TableCell>
                <TableCell className="text-right text-slate-900">100%</TableCell>
                <TableCell className="text-right text-slate-900">
                  {(stateData.reduce((sum, s) => sum + (s.gm * s.revenue), 0) / totalRevenue).toFixed(1)}%
                </TableCell>
                <TableCell className="text-right text-slate-900">
                  {(stateData.reduce((sum, s) => sum + (s.growth * s.revenue), 0) / totalRevenue).toFixed(1)}%
                </TableCell>
                <TableCell className="text-right text-slate-900">
                  {stateData.reduce((sum, s) => sum + s.customers, 0)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Regional & City Performance Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Regional Performance Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Regional Performance Trend</CardTitle>
            <p className="text-sm text-slate-600">Monthly revenue comparison across regions</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fill: '#64748b', fontSize: 12 }}
                />
                <YAxis 
                  tick={{ fill: '#64748b', fontSize: 12 }}
                  tickFormatter={(value) => `₹${(value / 100000).toFixed(0)}L`}
                />
                <Tooltip 
                  formatter={(value: number) => [`₹${(value / 100000).toFixed(1)}L`, '']}
                  contentStyle={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="West" 
                  stroke={REGION_COLORS.West} 
                  strokeWidth={2}
                  dot={{ fill: REGION_COLORS.West, r: 4 }}
                  name="West Zone"
                />
                <Line 
                  type="monotone" 
                  dataKey="South" 
                  stroke={REGION_COLORS.South} 
                  strokeWidth={2}
                  dot={{ fill: REGION_COLORS.South, r: 4 }}
                  name="South Zone"
                />
                <Line 
                  type="monotone" 
                  dataKey="North" 
                  stroke={REGION_COLORS.North} 
                  strokeWidth={2}
                  dot={{ fill: REGION_COLORS.North, r: 4 }}
                  name="North Zone"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Cities Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Top Cities Performance</CardTitle>
            <p className="text-sm text-slate-600">Revenue concentration in major cities</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {/* Concentration Risk Badge */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                    <span className="text-sm text-slate-700">Top 5 Cities Concentration</span>
                  </div>
                  <Badge className="bg-amber-100 text-amber-800 border-amber-300">
                    {top5Cities}% - Moderate Risk
                  </Badge>
                </div>
              </div>

              {/* Cities grouped by region */}
              {['West', 'South'].map((region) => {
                const regionCities = cityData.filter(c => c.region === region);
                const isCollapsed = collapsedRegions[region];
                
                return (
                  <Collapsible key={region} open={!isCollapsed}>
                    <CollapsibleTrigger 
                      onClick={() => toggleRegion(region)}
                      className="w-full"
                    >
                      <div 
                        className="flex items-center justify-between p-3 rounded-lg cursor-pointer hover:bg-slate-50 border border-slate-200"
                        style={{ borderLeftWidth: '4px', borderLeftColor: REGION_COLORS[region as keyof typeof REGION_COLORS] }}
                      >
                        <div className="flex items-center gap-2">
                          {isCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
                          <span className="text-slate-900">{region} Zone</span>
                          <Badge variant="outline">{regionCities.length} cities</Badge>
                        </div>
                        <span className="text-sm text-slate-600">
                          ₹{(regionCities.reduce((sum, c) => sum + c.revenue, 0) / 100000).toFixed(1)}L
                        </span>
                      </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="mt-2 space-y-2 pl-4">
                        {regionCities.map((city) => (
                          <div 
                            key={city.city}
                            className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200"
                          >
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-slate-900">{city.city}</span>
                                <Badge 
                                  variant="outline" 
                                  className="text-xs"
                                  style={{ 
                                    backgroundColor: `${REGION_COLORS[city.region as keyof typeof REGION_COLORS]}20`,
                                    borderColor: REGION_COLORS[city.region as keyof typeof REGION_COLORS]
                                  }}
                                >
                                  {city.region}
                                </Badge>
                                <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-300">
                                  +{city.growth}% (3mo)
                                </Badge>
                              </div>
                              <div className="text-xs text-slate-600 mt-1">{city.state}</div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm text-slate-900">₹{(city.revenue / 100000).toFixed(1)}L</div>
                              <div className="text-xs text-slate-600">{city.share}% share</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Geographic Concentration Analysis */}
      <Card className="border-teal-200">
        <CardHeader>
          <CardTitle>Geographic Concentration Analysis</CardTitle>
          <p className="text-sm text-slate-600">Detailed breakdown of geographic risk metrics</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Top 3 States */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-3">
                <Target className="h-4 w-4 text-teal-600" />
                <span className="text-sm text-slate-700">Top 3 States</span>
              </div>
              <div className="text-2xl text-slate-900">{top3States}%</div>
              <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${top3States > 70 ? 'bg-red-600' : top3States > 60 ? 'bg-amber-600' : 'bg-green-600'}`}
                  style={{ width: `${top3States}%` }}
                />
              </div>
              <p className="text-xs text-slate-600 mt-2">
                {top3States > 70 ? '🔴 High concentration' : top3States > 60 ? '🟡 Moderate concentration' : '🟢 Healthy distribution'}
              </p>
            </div>

            {/* Top 5 Cities */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="h-4 w-4 text-teal-600" />
                <span className="text-sm text-slate-700">Top 5 Cities</span>
              </div>
              <div className="text-2xl text-slate-900">{top5Cities}%</div>
              <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${top5Cities > 70 ? 'bg-red-600' : top5Cities > 60 ? 'bg-amber-600' : 'bg-green-600'}`}
                  style={{ width: `${top5Cities}%` }}
                />
              </div>
              <p className="text-xs text-slate-600 mt-2">
                {top5Cities > 70 ? '🔴 High risk' : top5Cities > 60 ? '🟡 Moderate risk' : '🟢 Low risk'}
              </p>
            </div>

            {/* HHI Index with Trend */}
            <HoverCard>
              <HoverCardTrigger asChild>
                <div className="space-y-2 cursor-pointer">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle className="h-4 w-4 text-teal-600" />
                    <span className="text-sm text-slate-700">HHI Index</span>
                  </div>
                  <div className="text-2xl text-slate-900">{hhi.toFixed(2)}</div>
                  {/* Sparkline */}
                  <div className="h-8">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={hhiTrendData}>
                        <Line 
                          type="monotone" 
                          dataKey="hhi" 
                          stroke="#0F766E" 
                          strokeWidth={2}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="text-xs text-slate-600">
                    Trending {hhiTrendData[hhiTrendData.length - 1].hhi < hhiTrendData[0].hhi ? '↓ downward' : '↑ upward'}
                  </p>
                </div>
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <div className="space-y-2">
                  <h4 className="text-sm">HHI Calculation</h4>
                  <p className="text-xs text-slate-600">
                    HHI = Σ(S_i²), where S_i = revenue share per region
                  </p>
                  <div className="pt-2 border-t text-xs space-y-1">
                    {stateData.slice(0, 3).map(state => (
                      <div key={state.state} className="flex justify-between">
                        <span className="text-slate-600">{state.state}:</span>
                        <span className="text-slate-900">({state.share/100})² = {((state.share/100) ** 2).toFixed(4)}</span>
                      </div>
                    ))}
                    <div className="pt-1 border-t flex justify-between">
                      <span className="text-slate-700">Total HHI:</span>
                      <span className="text-slate-900">{hhi.toFixed(4)}</span>
                    </div>
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>

            {/* Coverage States */}
            <HoverCard>
              <HoverCardTrigger asChild>
                <div className="space-y-2 cursor-pointer">
                  <div className="flex items-center gap-2 mb-3">
                    <Globe className="h-4 w-4 text-teal-600" />
                    <span className="text-sm text-slate-700">Coverage States</span>
                  </div>
                  <div className="text-2xl text-slate-900">{coverageStates.toFixed(0)}%</div>
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-teal-600"
                      style={{ width: `${coverageStates}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-600 mt-2">
                    {activeStates} of 28 states active
                  </p>
                </div>
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <div className="space-y-2">
                  <h4 className="text-sm">Coverage Definition</h4>
                  <p className="text-xs text-slate-600">
                    Coverage States = States with ≥₹1L Revenue / Total States in Market
                  </p>
                  <div className="pt-2 border-t text-xs">
                    <div className="flex justify-between mb-1">
                      <span className="text-slate-600">Active States:</span>
                      <span className="text-slate-900">{activeStates}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Total States (India):</span>
                      <span className="text-slate-900">28</span>
                    </div>
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
          </div>

          {/* AI Comment Bar */}
          <div className="mt-6 bg-gradient-to-r from-teal-50 to-blue-50 border-l-4 border-teal-600 p-4 rounded-lg">
            <div className="flex items-start gap-3">
              <Lightbulb className="h-5 w-5 text-teal-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm text-slate-900 mb-1">AI Strategic Insight</h4>
                <p className="text-sm text-slate-700">
                  Geographic risk remains moderately high (HHI 0.28 vs. target 0.25). Expanding into Northern and Eastern regions 
                  can lower concentration by 4–5 percentage points. Consider targeting tier-2 cities in Uttar Pradesh, Bihar, 
                  and West Bengal to balance the West zone dominance and reduce dependency on Maharashtra-Gujarat corridor.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
