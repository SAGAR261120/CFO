import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, ScatterChart, Scatter, ReferenceLine, ZAxis } from 'recharts';
import { TrendingUp, Wallet, Target, Clock, Activity, BarChart2, Calendar, AlertTriangle, Building2, IndianRupee, Database, Plus, Download, ChevronDown, Play, Pause, Users, ArrowUpRight, ArrowDownRight, Lightbulb, CheckSquare, Square, Zap, Filter } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Progress } from '../ui/progress';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '../ui/hover-card';
import { Checkbox } from '../ui/checkbox';
import { toast } from 'sonner@2.0.3';

// Project portfolio data
const projectData = [
  {
    id: 1,
    name: 'Phoenix ERP',
    capex: 45,
    roi: 24.5,
    npv: 18.2,
    irr: 26.8,
    payback: 28,
    status: 'Active',
    category: 'Tech',
    progress: 75,
    startDate: 'Jan 2024',
    endDate: 'Dec 2025',
    bookValue: 38.5,
    depRate: 20,
    usefulLife: 5,
    annualDep: 9.0,
  },
  {
    id: 2,
    name: 'Automation Suite',
    capex: 32,
    roi: 31.2,
    npv: 15.8,
    irr: 32.5,
    payback: 24,
    status: 'Active',
    category: 'Tech',
    progress: 60,
    startDate: 'Mar 2024',
    endDate: 'Jun 2025',
    bookValue: 28.8,
    depRate: 20,
    usefulLife: 5,
    annualDep: 6.4,
  },
  {
    id: 3,
    name: 'Mumbai Office',
    capex: 55,
    roi: 8.2,
    npv: 6.5,
    irr: 9.1,
    payback: 52,
    status: 'Completed',
    category: 'Infra',
    progress: 100,
    startDate: 'Jan 2023',
    endDate: 'Dec 2023',
    bookValue: 52.3,
    depRate: 5,
    usefulLife: 20,
    annualDep: 2.75,
  },
  {
    id: 4,
    name: 'R&D Lab Setup',
    capex: 28,
    roi: 18.5,
    npv: 10.2,
    irr: 20.3,
    payback: 36,
    status: 'Active',
    category: 'R&D',
    progress: 45,
    startDate: 'Jun 2024',
    endDate: 'Mar 2026',
    bookValue: 26.6,
    depRate: 10,
    usefulLife: 10,
    annualDep: 2.8,
  },
  {
    id: 5,
    name: 'Cloud Infrastructure',
    capex: 18,
    roi: 22.8,
    npv: 8.5,
    irr: 24.2,
    payback: 30,
    status: 'Planning',
    category: 'Tech',
    progress: 15,
    startDate: 'Feb 2025',
    endDate: 'Aug 2025',
    bookValue: 18.0,
    depRate: 25,
    usefulLife: 4,
    annualDep: 4.5,
  },
  {
    id: 6,
    name: 'Warehouse Expansion',
    capex: 40,
    roi: 12.5,
    npv: 7.8,
    irr: 13.8,
    payback: 42,
    status: 'Planning',
    category: 'Infra',
    progress: 10,
    startDate: 'Apr 2025',
    endDate: 'Dec 2025',
    bookValue: 40.0,
    depRate: 10,
    usefulLife: 10,
    annualDep: 4.0,
  },
];

// 5-Year cash flow projections
const cashFlowData = [
  { year: 'Y0', automationSuite: -32, phoenixERP: -45, rdLab: -28, cumulative: 0 },
  { year: 'Y1', automationSuite: 8, phoenixERP: 10, rdLab: 4, cumulative: -83 },
  { year: 'Y2', automationSuite: 12, phoenixERP: 15, rdLab: 8, cumulative: -48 },
  { year: 'Y3', automationSuite: 18, phoenixERP: 22, rdLab: 12, cumulative: 4 },
  { year: 'Y4', automationSuite: 22, phoenixERP: 28, rdLab: 16, cumulative: 70 },
  { year: 'Y5', automationSuite: 24, phoenixERP: 32, rdLab: 18, cumulative: 144 },
];

// Milestones data
const milestones = [
  { id: 1, project: 'Phoenix ERP', milestone: 'Module 3 Deployment', dueDate: '15 Jan 2025', status: 'On Track', delay: null },
  { id: 2, project: 'Automation Suite', milestone: 'Testing Phase Complete', dueDate: '20 Jan 2025', status: 'On Track', delay: null },
  { id: 3, project: 'R&D Lab Setup', milestone: 'Site Finalization', dueDate: '10 Jan 2025', status: 'Delayed', delay: 'Civil vendor pending', impact: 'ROI deferment by 3 months' },
  { id: 4, project: 'Cloud Infrastructure', milestone: 'Vendor Selection', dueDate: '05 Feb 2025', status: 'On Track', delay: null },
  { id: 5, project: 'Warehouse Expansion', milestone: 'Budget Approval', dueDate: '28 Jan 2025', status: 'At Risk', delay: 'Board review pending', impact: 'Project start delayed by 1 month' },
];

// AI Recommendations
const aiRecommendations = [
  { id: 1, type: 'Performance', text: 'Tech category projects showing 25% higher ROI than Infra. Consider reallocating 10% of planned Infra budget to Tech initiatives.', actioned: false },
  { id: 2, type: 'Risk', text: 'Mumbai Office underperforming (8.2% vs 15% target). Review pricing model or consider asset disposition.', actioned: false },
  { id: 3, type: 'Timing', text: 'R&D Lab Setup delay may impact FY26 revenue targets. Expedite site finalization to avoid 3-month ROI deferment.', actioned: true },
  { id: 4, type: 'Efficiency', text: 'Average payback for active projects is 32 months. Target portfolio optimization to reduce to <30 months through quick-win projects.', actioned: false },
  { id: 5, type: 'Opportunity', text: 'Cloud Infrastructure in planning phase shows strong IRR (24.2%). Fast-track to execution to capture early returns.', actioned: false },
];

const STATUS_COLORS = {
  Active: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-300', icon: '🔵' },
  Completed: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300', icon: '🟢' },
  Planning: { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-300', icon: '🟠' },
};

const MILESTONE_STATUS_COLORS = {
  'On Track': { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300', icon: '🟢' },
  'Delayed': { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-300', icon: '🟠' },
  'At Risk': { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-300', icon: '🔴' },
};

const CATEGORY_COLORS = {
  Tech: '#0F766E',
  Infra: '#7C3AED',
  'R&D': '#DC2626',
};

export function InvestmentDashboard() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedYear, setSelectedYear] = useState<string>('FY 2024-25');
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [showCumulative, setShowCumulative] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [newProjectOpen, setNewProjectOpen] = useState(false);
  const [recommendations, setRecommendations] = useState(aiRecommendations);

  // Filter projects
  const filteredProjects = projectData.filter(p => {
    if (selectedCategory !== 'All' && p.category !== selectedCategory) return false;
    if (selectedStatus !== 'All' && p.status !== selectedStatus) return false;
    return true;
  });

  // Calculate KPIs
  const totalCapex = filteredProjects.reduce((sum, p) => sum + p.capex, 0);
  const totalBookValue = filteredProjects.reduce((sum, p) => sum + p.bookValue, 0);
  const avgROI = filteredProjects.reduce((sum, p) => sum + p.roi, 0) / filteredProjects.length;
  const paybackValues = filteredProjects.map(p => p.payback).sort((a, b) => a - b);
  const medianPayback = paybackValues[Math.floor(paybackValues.length / 2)];
  const bestPayback = Math.min(...paybackValues);
  const worstPayback = Math.max(...paybackValues);
  const targetROI = 15;

  // Get selected project details
  const selectedProjectData = selectedProject ? projectData.find(p => p.id === selectedProject) : null;

  // Toggle narration
  const toggleNarration = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      toast.info('AI Narration Started', {
        description: 'Playing investment portfolio insights...',
      });
    } else {
      toast.info('AI Narration Paused');
    }
  };

  // Handle export
  const handleExport = (format: string) => {
    toast.success(`Exporting to ${format}...`, {
      description: 'Your download will begin shortly.',
    });
  };

  // Handle new project
  const handleNewProject = () => {
    toast.success('Project Created', {
      description: 'New project has been added to the portfolio.',
    });
    setNewProjectOpen(false);
  };

  // Toggle recommendation action
  const toggleRecommendation = (id: number) => {
    setRecommendations(prev =>
      prev.map(rec => (rec.id === id ? { ...rec, actioned: !rec.actioned } : rec))
    );
  };

  // Generate AI summary
  const generateAISummary = () => {
    toast.success('AI Summary Generated', {
      description: 'Portfolio analysis report is ready for export.',
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
            <span className="text-slate-900">CFOsync AI Pvt Ltd</span>
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
                  <h3 className="text-slate-900">AI Investment Portfolio Insights</h3>
                  <p className="text-sm text-slate-600">Automated analysis of capital allocation and project performance</p>
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
                  "Portfolio ROI stands at 19.6% exceeding the 15% target, primarily driven by Technology projects. 
                  Automation Suite leads performance at 31.2% ROI with a 24-month payback period. 
                  Infrastructure investments show mixed results - Mumbai Office underperforms at 8.2% ROI, impacting overall portfolio NPV by ₹4.5L. 
                  R&D Lab Setup faces milestone delays with site finalization pending, flagged as high risk for potential 3-month ROI deferment. 
                  Average portfolio payback remains at 32 months; optimization opportunities exist through reallocation toward high-performing Tech initiatives. 
                  Cloud Infrastructure project in planning phase shows strong fundamentals with 24.2% IRR - recommend fast-tracking to execution."
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filter Bar */}
      <Card className="border-teal-200">
        <CardContent className="pt-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-teal-600" />
              <span className="text-sm text-slate-700">Filters:</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Label className="text-sm text-slate-600">Category:</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All</SelectItem>
                  <SelectItem value="Tech">Tech</SelectItem>
                  <SelectItem value="Infra">Infra</SelectItem>
                  <SelectItem value="R&D">R&D</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Label className="text-sm text-slate-600">Status:</Label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Planning">Planning</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Label className="text-sm text-slate-600">Year:</Label>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FY 2023-24">FY 2023-24</SelectItem>
                  <SelectItem value="FY 2024-25">FY 2024-25</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="ml-auto flex items-center gap-3">
              <Dialog open={newProjectOpen} onOpenChange={setNewProjectOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2 bg-teal-600 hover:bg-teal-700">
                    <Plus className="h-4 w-4" />
                    New Project
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add New Project</DialogTitle>
                    <DialogDescription>
                      Enter project details to add to investment portfolio
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="project-name">Project Name</Label>
                      <Input id="project-name" placeholder="e.g., Digital Transformation" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="capex">CapEx (₹L)</Label>
                        <Input id="capex" type="number" placeholder="25" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="roi">Expected ROI (%)</Label>
                        <Input id="roi" type="number" placeholder="18.5" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select>
                        <SelectTrigger id="category">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Tech">Technology</SelectItem>
                          <SelectItem value="Infra">Infrastructure</SelectItem>
                          <SelectItem value="R&D">R&D</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="start-date">Start Date</Label>
                        <Input id="start-date" type="month" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="end-date">End Date</Label>
                        <Input id="end-date" type="month" />
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setNewProjectOpen(false)}>Cancel</Button>
                    <Button onClick={handleNewProject} className="bg-teal-600 hover:bg-teal-700">Create Project</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Download className="h-4 w-4" />
                    Export Portfolio
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
                  <DropdownMenuItem onClick={() => handleExport('Power BI Snapshot')}>
                    Power BI Snapshot
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total CapEx */}
        <Card className="border-teal-100 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Total CapEx</CardTitle>
            <Wallet className="h-5 w-5 text-teal-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-slate-900">₹{totalCapex}L</div>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                ↑12.4% YoY
              </Badge>
            </div>
            <div className="mt-3 h-1 bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-teal-600 w-full" />
            </div>
          </CardContent>
        </Card>

        {/* Book Value */}
        <HoverCard>
          <HoverCardTrigger asChild>
            <Card className="border-teal-100 hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm">Book Value</CardTitle>
                <Activity className="h-5 w-5 text-teal-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl text-slate-900">₹{totalBookValue.toFixed(1)}L</div>
                <p className="text-xs text-slate-600 mt-2">Post-depreciation WDV</p>
                <div className="mt-3 h-1 bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-600"
                    style={{ width: `${(totalBookValue / totalCapex) * 100}%` }}
                  />
                </div>
              </CardContent>
            </Card>
          </HoverCardTrigger>
          <HoverCardContent className="w-80">
            <div className="space-y-2">
              <h4 className="text-sm">Book Value Details</h4>
              <p className="text-xs text-slate-600">
                Post-depreciation book value calculated using Written Down Value (WDV) method.
              </p>
              <div className="pt-2 border-t text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-600">Total CapEx:</span>
                  <span className="text-slate-900">₹{totalCapex}L</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Accumulated Depreciation:</span>
                  <span className="text-slate-900">₹{(totalCapex - totalBookValue).toFixed(1)}L</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Current Book Value:</span>
                  <span className="text-slate-900">₹{totalBookValue.toFixed(1)}L</span>
                </div>
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>

        {/* Average ROI */}
        <Card className={`border-2 hover:shadow-lg transition-shadow ${
          avgROI >= targetROI ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50'
        }`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Average ROI</CardTitle>
            <Target className="h-5 w-5 text-teal-600" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl ${avgROI >= targetROI ? 'text-green-900' : 'text-red-900'}`}>
              {avgROI.toFixed(1)}%
            </div>
            <p className="text-xs text-slate-600 mt-2">Target: {targetROI}%</p>
            <div className="mt-3 space-y-1">
              <div className="h-1 bg-slate-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${avgROI >= targetROI ? 'bg-green-600' : 'bg-red-600'}`}
                  style={{ width: `${Math.min((avgROI / 40) * 100, 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">0%</span>
                <span className={avgROI >= targetROI ? 'text-green-600' : 'text-red-600'}>
                  {avgROI >= targetROI ? '🟢' : '🔴'} {avgROI > targetROI ? `+${(avgROI - targetROI).toFixed(1)}%` : `${(avgROI - targetROI).toFixed(1)}%`}
                </span>
                <span className="text-slate-500">40%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payback Period */}
        <Card className={`border-2 hover:shadow-lg transition-shadow ${
          medianPayback <= 36 ? 'border-green-300 bg-green-50' : medianPayback <= 48 ? 'border-amber-300 bg-amber-50' : 'border-red-300 bg-red-50'
        }`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Median Payback</CardTitle>
            <Clock className="h-5 w-5 text-teal-600" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl ${
              medianPayback <= 36 ? 'text-green-900' : medianPayback <= 48 ? 'text-amber-900' : 'text-red-900'
            }`}>
              {medianPayback} mo
            </div>
            <div className="text-xs text-slate-600 mt-2 space-y-1">
              <div>Best: {bestPayback}m / Worst: {worstPayback}m</div>
            </div>
            <div className="mt-3 h-1 bg-slate-200 rounded-full overflow-hidden">
              <div 
                className={`h-full ${medianPayback <= 36 ? 'bg-green-600' : medianPayback <= 48 ? 'bg-amber-600' : 'bg-red-600'}`}
                style={{ width: `${Math.min((medianPayback / 60) * 100, 100)}%` }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Project Portfolio Matrix */}
      <Card className="border-teal-200">
        <CardHeader>
          <CardTitle>Project Portfolio Matrix (CapEx vs ROI)</CardTitle>
          <p className="text-sm text-slate-600">Bubble size represents Net Present Value (NPV)</p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={500}>
            <ScatterChart margin={{ top: 20, right: 80, bottom: 80, left: 80 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                type="number" 
                dataKey="capex" 
                name="CapEx" 
                label={{ value: 'CapEx (₹ Lakhs)', position: 'bottom', offset: 40 }}
                tick={{ fill: '#64748b', fontSize: 12 }}
                domain={[0, 60]}
              />
              <YAxis 
                type="number" 
                dataKey="roi" 
                name="ROI" 
                label={{ value: 'ROI (%)', angle: -90, position: 'left', offset: 50 }}
                tick={{ fill: '#64748b', fontSize: 12 }}
                domain={[0, 35]}
              />
              <ZAxis type="number" dataKey="npv" range={[400, 2000]} name="NPV" />
              <Tooltip 
                cursor={{ strokeDasharray: '3 3' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white border border-slate-200 rounded-lg shadow-lg p-3">
                        <p className="text-sm text-slate-900 mb-2">{data.name}</p>
                        <div className="space-y-1 text-xs">
                          <div className="flex justify-between gap-4">
                            <span className="text-slate-600">CapEx:</span>
                            <span className="text-slate-900">₹{data.capex}L</span>
                          </div>
                          <div className="flex justify-between gap-4">
                            <span className="text-slate-600">ROI:</span>
                            <span className="text-slate-900">{data.roi}%</span>
                          </div>
                          <div className="flex justify-between gap-4">
                            <span className="text-slate-600">NPV:</span>
                            <span className="text-slate-900">₹{data.npv}L</span>
                          </div>
                          <div className="flex justify-between gap-4">
                            <span className="text-slate-600">Status:</span>
                            <Badge variant="outline" className={`${STATUS_COLORS[data.status as keyof typeof STATUS_COLORS].bg} ${STATUS_COLORS[data.status as keyof typeof STATUS_COLORS].text}`}>
                              {data.status} ({data.progress}%)
                            </Badge>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              
              {/* Quadrant Lines */}
              <ReferenceLine x={30} stroke="#94a3b8" strokeDasharray="5 5" />
              <ReferenceLine y={15} stroke="#94a3b8" strokeDasharray="5 5" />

              {/* Scatter Points */}
              {filteredProjects.map((project) => (
                <Scatter
                  key={project.id}
                  data={[project]}
                  fill={project.status === 'Active' ? '#2563EB' : project.status === 'Completed' ? '#10B981' : '#F59E0B'}
                  onClick={() => setSelectedProject(project.id)}
                  cursor="pointer"
                />
              ))}
            </ScatterChart>
          </ResponsiveContainer>

          {/* Quadrant Labels */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="text-xs text-green-700 mb-1">Top-Left Quadrant</div>
              <div className="text-sm text-slate-900">High ROI / Low CapEx</div>
              <div className="text-xs text-slate-600">Quick Wins 🎯</div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="text-xs text-blue-700 mb-1">Top-Right Quadrant</div>
              <div className="text-sm text-slate-900">High ROI / High CapEx</div>
              <div className="text-xs text-slate-600">Strategic Bets 💎</div>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <div className="text-xs text-amber-700 mb-1">Bottom-Left Quadrant</div>
              <div className="text-sm text-slate-900">Low ROI / Low CapEx</div>
              <div className="text-xs text-slate-600">Monitor 👁️</div>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="text-xs text-red-700 mb-1">Bottom-Right Quadrant</div>
              <div className="text-sm text-slate-900">Low ROI / High CapEx</div>
              <div className="text-xs text-slate-600">Risk Zone ⚠️</div>
            </div>
          </div>

          {/* NPV Scale Legend */}
          <div className="mt-4 flex items-center justify-center gap-4 text-xs text-slate-600">
            <span>Bubble Size:</span>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-slate-400" />
              <span>NPV: ₹6L</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-slate-400" />
              <span>NPV: ₹12L</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-14 h-14 rounded-full bg-slate-400" />
              <span>NPV: ₹18L</span>
            </div>
          </div>

          {/* Color Legend */}
          <div className="mt-4 flex items-center justify-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-green-600" />
              <span className="text-xs text-slate-600">🟢 Completed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-blue-600" />
              <span className="text-xs text-slate-600">🔵 Active</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-orange-600" />
              <span className="text-xs text-slate-600">🟠 Planning</span>
            </div>
          </div>

          {/* Selected Project Details */}
          {selectedProjectData && (
            <div className="mt-6 bg-teal-50 border-l-4 border-teal-600 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-sm text-slate-900 mb-2">{selectedProjectData.name} - Selected Project</h4>
                  <div className="grid grid-cols-4 gap-4 text-xs">
                    <div>
                      <span className="text-slate-600">CapEx:</span>
                      <span className="text-slate-900 ml-2">₹{selectedProjectData.capex}L</span>
                    </div>
                    <div>
                      <span className="text-slate-600">ROI:</span>
                      <span className="text-slate-900 ml-2">{selectedProjectData.roi}%</span>
                    </div>
                    <div>
                      <span className="text-slate-600">NPV:</span>
                      <span className="text-slate-900 ml-2">₹{selectedProjectData.npv}L</span>
                    </div>
                    <div>
                      <span className="text-slate-600">IRR:</span>
                      <span className="text-slate-900 ml-2">{selectedProjectData.irr}%</span>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setSelectedProject(null)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Project Cash Flows */}
      <Card className="border-teal-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Project Cash Flows (5-Year Projection)</CardTitle>
              <p className="text-sm text-slate-600 mt-1">Projected cash flows for active projects</p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCumulative(!showCumulative)}
              >
                {showCumulative ? 'Show Annual' : 'Show Cumulative'}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={cashFlowData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey="year" 
                tick={{ fill: '#64748b', fontSize: 12 }}
              />
              <YAxis 
                tick={{ fill: '#64748b', fontSize: 12 }}
                tickFormatter={(value) => `₹${value}L`}
              />
              <Tooltip 
                formatter={(value: number, name: string) => {
                  const projectNames: Record<string, string> = {
                    automationSuite: 'Automation Suite',
                    phoenixERP: 'Phoenix ERP',
                    rdLab: 'R&D Lab',
                    cumulative: 'Cumulative CF'
                  };
                  return [`₹${value}L`, projectNames[name] || name];
                }}
                contentStyle={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '8px' }}
              />
              <Legend />
              
              {/* Break-even line */}
              <ReferenceLine y={0} stroke="#94a3b8" strokeWidth={2} label={{ value: 'Break-even', fill: '#64748b', fontSize: 12 }} />
              
              {/* Target ROI benchmark line */}
              <ReferenceLine y={15} stroke="#DC2626" strokeDasharray="5 5" label={{ value: 'Target (15%)', fill: '#DC2626', fontSize: 11 }} />

              {showCumulative ? (
                <Area 
                  type="monotone" 
                  dataKey="cumulative" 
                  stroke="#0F766E" 
                  fill="#0F766E" 
                  fillOpacity={0.6}
                  name="Cumulative CF"
                />
              ) : (
                <>
                  <Area 
                    type="monotone" 
                    dataKey="automationSuite" 
                    stackId="1"
                    stroke="#2563EB" 
                    fill="#2563EB" 
                    fillOpacity={0.6}
                    name="Automation Suite"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="phoenixERP" 
                    stackId="1"
                    stroke="#7C3AED" 
                    fill="#7C3AED" 
                    fillOpacity={0.6}
                    name="Phoenix ERP"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="rdLab" 
                    stackId="1"
                    stroke="#DC2626" 
                    fill="#DC2626" 
                    fillOpacity={0.6}
                    name="R&D Lab"
                  />
                </>
              )}
            </AreaChart>
          </ResponsiveContainer>

          {/* Break-even marker info */}
          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-slate-900">Break-even Analysis</span>
            </div>
            <div className="grid grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-slate-600">Automation Suite:</span>
                <span className="text-green-600 ml-2">Y2 (24 months)</span>
              </div>
              <div>
                <span className="text-slate-600">Phoenix ERP:</span>
                <span className="text-green-600 ml-2">Y3 (28 months)</span>
              </div>
              <div>
                <span className="text-slate-600">R&D Lab:</span>
                <span className="text-amber-600 ml-2">Y4 (36 months)</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Investment Portfolio Table */}
      <Card className="border-teal-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Investment Portfolio Table</CardTitle>
            <Button variant="outline" size="sm" onClick={() => handleExport('Excel')}>
              <Download className="h-4 w-4 mr-2" />
              Export Table
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">CapEx (₹L)</TableHead>
                <TableHead className="text-right">ROI %</TableHead>
                <TableHead className="text-right">NPV (₹L)</TableHead>
                <TableHead className="text-right">IRR %</TableHead>
                <TableHead className="text-right">Payback (mo)</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProjects.map((project) => (
                <TableRow 
                  key={project.id}
                  className={`cursor-pointer transition-colors ${selectedProject === project.id ? 'bg-teal-50' : 'hover:bg-slate-50'}`}
                  onClick={() => setSelectedProject(project.id)}
                >
                  <TableCell className="text-slate-900">{project.name}</TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline"
                      style={{ 
                        backgroundColor: `${CATEGORY_COLORS[project.category as keyof typeof CATEGORY_COLORS]}20`,
                        borderColor: CATEGORY_COLORS[project.category as keyof typeof CATEGORY_COLORS],
                        color: CATEGORY_COLORS[project.category as keyof typeof CATEGORY_COLORS]
                      }}
                    >
                      {project.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <span>₹{project.capex}</span>
                      <div className="w-12 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-teal-600"
                          style={{ width: `${(project.capex / totalCapex) * 100}%` }}
                        />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className={`text-right ${project.roi >= targetROI ? 'text-green-600' : 'text-red-600'}`}>
                    {project.roi}%
                  </TableCell>
                  <TableCell className={`text-right ${project.npv >= 10 ? 'text-green-600' : 'text-slate-900'}`}>
                    ₹{project.npv}
                  </TableCell>
                  <TableCell className={`text-right ${project.irr >= 15 ? 'text-green-600' : 'text-red-600'}`}>
                    {project.irr}%
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <span className={project.payback <= 36 ? 'text-green-600' : project.payback <= 48 ? 'text-amber-600' : 'text-red-600'}>
                        {project.payback}
                      </span>
                      <div className="w-12 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${project.payback <= 36 ? 'bg-green-600' : project.payback <= 48 ? 'bg-amber-600' : 'bg-red-600'}`}
                          style={{ width: `${Math.min((project.payback / 60) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={project.progress} className="w-20" />
                      <span className="text-xs text-slate-600">{project.progress}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline"
                      className={`${STATUS_COLORS[project.status as keyof typeof STATUS_COLORS].bg} ${STATUS_COLORS[project.status as keyof typeof STATUS_COLORS].text} border ${STATUS_COLORS[project.status as keyof typeof STATUS_COLORS].border}`}
                    >
                      {STATUS_COLORS[project.status as keyof typeof STATUS_COLORS].icon} {project.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Asset Depreciation Schedule & Upcoming Milestones */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Asset Depreciation Schedule */}
        <Card className="border-teal-200">
          <CardHeader>
            <CardTitle>Asset Depreciation Schedule</CardTitle>
            <p className="text-sm text-slate-600">Written Down Value (WDV) method</p>
          </CardHeader>
          <CardContent>
            {/* Book Value by Asset Type Pie Chart */}
            <div className="mb-6">
              <div className="text-sm text-slate-700 mb-3">Book Value by Asset Type</div>
              <ResponsiveContainer width="100%" height={150}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Technology', value: projectData.filter(p => p.category === 'Tech').reduce((sum, p) => sum + p.bookValue, 0) },
                      { name: 'Infrastructure', value: projectData.filter(p => p.category === 'Infra').reduce((sum, p) => sum + p.bookValue, 0) },
                      { name: 'R&D', value: projectData.filter(p => p.category === 'R&D').reduce((sum, p) => sum + p.bookValue, 0) },
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={60}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    <Cell fill="#0F766E" />
                    <Cell fill="#7C3AED" />
                    <Cell fill="#DC2626" />
                  </Pie>
                  <Tooltip formatter={(value: number) => `₹${value.toFixed(1)}L`} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Depreciation List */}
            <div className="space-y-3">
              {[...filteredProjects].sort((a, b) => a.usefulLife - b.usefulLife).map((project) => (
                <HoverCard key={project.id}>
                  <HoverCardTrigger asChild>
                    <div className="p-3 border border-slate-200 rounded-lg hover:border-teal-300 cursor-pointer transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="text-sm text-slate-900">{project.name}</div>
                          <Badge 
                            variant="outline" 
                            className="mt-1 text-xs"
                            style={{ 
                              backgroundColor: `${CATEGORY_COLORS[project.category as keyof typeof CATEGORY_COLORS]}20`,
                              borderColor: CATEGORY_COLORS[project.category as keyof typeof CATEGORY_COLORS]
                            }}
                          >
                            {project.category}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-slate-900">₹{project.annualDep}L/yr</div>
                          <div className="text-xs text-slate-600">{project.depRate}% p.a.</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-slate-600">Book Value:</span>
                        <span className="text-slate-900">₹{project.bookValue}L</span>
                        <span className="text-slate-400">|</span>
                        <span className="text-slate-600">Useful Life:</span>
                        <span className="text-slate-900">{project.usefulLife} years</span>
                      </div>
                    </div>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80">
                    <div className="space-y-2">
                      <h4 className="text-sm">{project.name} - Depreciation Details</h4>
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span className="text-slate-600">Original CapEx:</span>
                          <span className="text-slate-900">₹{project.capex}L</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Depreciation Rate:</span>
                          <span className="text-slate-900">{project.depRate}% p.a.</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Useful Life:</span>
                          <span className="text-slate-900">{project.usefulLife} years</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Annual Depreciation:</span>
                          <span className="text-slate-900">₹{project.annualDep}L</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Current Book Value:</span>
                          <span className="text-slate-900">₹{project.bookValue}L</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Residual Value:</span>
                          <span className="text-slate-900">₹{(project.capex * 0.1).toFixed(1)}L</span>
                        </div>
                      </div>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Milestones */}
        <Card className="border-teal-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Upcoming Milestones</CardTitle>
                <p className="text-sm text-slate-600">Critical project deliverables</p>
              </div>
              <Button variant="outline" size="sm">
                <Calendar className="h-4 w-4 mr-2" />
                View Gantt
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {milestones.map((milestone) => (
                <HoverCard key={milestone.id}>
                  <HoverCardTrigger asChild>
                    <div className={`p-3 border-l-4 rounded-lg cursor-pointer transition-colors ${
                      milestone.status === 'On Track' 
                        ? 'border-green-500 bg-green-50 hover:bg-green-100' 
                        : milestone.status === 'Delayed'
                        ? 'border-orange-500 bg-orange-50 hover:bg-orange-100'
                        : 'border-red-500 bg-red-50 hover:bg-red-100'
                    }`}>
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="text-sm text-slate-900 mb-1">{milestone.milestone}</div>
                          <div className="text-xs text-slate-600">{milestone.project}</div>
                        </div>
                        <Badge 
                          variant="outline"
                          className={`${MILESTONE_STATUS_COLORS[milestone.status as keyof typeof MILESTONE_STATUS_COLORS].bg} ${MILESTONE_STATUS_COLORS[milestone.status as keyof typeof MILESTONE_STATUS_COLORS].text} border ${MILESTONE_STATUS_COLORS[milestone.status as keyof typeof MILESTONE_STATUS_COLORS].border}`}
                        >
                          {MILESTONE_STATUS_COLORS[milestone.status as keyof typeof MILESTONE_STATUS_COLORS].icon} {milestone.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <Calendar className="h-3 w-3" />
                        <span>Due: {milestone.dueDate}</span>
                        {milestone.delay && (
                          <>
                            <span className="text-slate-400">|</span>
                            <AlertTriangle className="h-3 w-3 text-orange-600" />
                            <span className="text-orange-600">{milestone.delay}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </HoverCardTrigger>
                  {milestone.delay && (
                    <HoverCardContent className="w-80">
                      <div className="space-y-2">
                        <h4 className="text-sm flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-orange-600" />
                          {milestone.milestone}
                        </h4>
                        <div className="space-y-1 text-xs">
                          <div className="flex justify-between">
                            <span className="text-slate-600">Due Date:</span>
                            <span className="text-slate-900">{milestone.dueDate}</span>
                          </div>
                          <div className="pt-2 border-t">
                            <div className="text-slate-600 mb-1">Delay Reason:</div>
                            <div className="text-slate-900">{milestone.delay}</div>
                          </div>
                          {milestone.impact && (
                            <div className="pt-2 border-t">
                              <div className="text-slate-600 mb-1">Impact:</div>
                              <div className="text-red-600">{milestone.impact}</div>
                            </div>
                          )}
                        </div>
                      </div>
                    </HoverCardContent>
                  )}
                </HoverCard>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Investment Recommendations */}
      <Card className="border-teal-200 bg-gradient-to-br from-white to-teal-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-teal-600" />
              <CardTitle>AI Investment Recommendations (Automated)</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={generateAISummary}>
                <Lightbulb className="h-4 w-4 mr-2" />
                Generate Summary
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export AI Summary
                    <ChevronDown className="h-4 w-4 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleExport('PDF Summary')}>
                    Export as PDF
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExport('Word Summary')}>
                    Export as Word
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recommendations.map((rec) => (
              <div 
                key={rec.id}
                className={`p-4 border rounded-lg transition-all ${
                  rec.actioned 
                    ? 'bg-slate-50 border-slate-300 opacity-70' 
                    : 'bg-white border-teal-200 hover:shadow-md'
                }`}
              >
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => toggleRecommendation(rec.id)}
                    className="mt-1 cursor-pointer"
                  >
                    {rec.actioned ? (
                      <CheckSquare className="h-5 w-5 text-green-600" />
                    ) : (
                      <Square className="h-5 w-5 text-slate-400 hover:text-teal-600" />
                    )}
                  </button>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge 
                        variant="outline"
                        className={
                          rec.type === 'Performance' 
                            ? 'bg-green-50 text-green-700 border-green-300'
                            : rec.type === 'Risk'
                            ? 'bg-red-50 text-red-700 border-red-300'
                            : rec.type === 'Timing'
                            ? 'bg-orange-50 text-orange-700 border-orange-300'
                            : rec.type === 'Efficiency'
                            ? 'bg-blue-50 text-blue-700 border-blue-300'
                            : 'bg-purple-50 text-purple-700 border-purple-300'
                        }
                      >
                        {rec.type}
                      </Badge>
                      {rec.actioned && (
                        <Badge variant="outline" className="bg-slate-100 text-slate-600 border-slate-300">
                          Actioned
                        </Badge>
                      )}
                    </div>
                    <p className={`text-sm ${rec.actioned ? 'text-slate-600 line-through' : 'text-slate-700'}`}>
                      {rec.text}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* AI Summary Section */}
          <div className="mt-6 bg-gradient-to-r from-blue-50 to-purple-50 border-l-4 border-blue-600 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Lightbulb className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm text-slate-900 mb-2">Portfolio Summary (Generated 30 Oct 2024)</h4>
                <p className="text-sm text-slate-700">
                  Portfolio ROI exceeds target at 19.6% vs 15% benchmark. Tech projects continue to outperform 
                  with average 26% returns, while Infrastructure category shows mixed performance. Mumbai Office 
                  requires immediate ROI improvement strategy - consider pricing model revision or asset disposition. 
                  R&D Lab Setup milestone delay creates execution risk for FY26 targets. Average payback steady at 
                  32 months; capital efficiency improvements possible through quick-win project allocation. 
                  Cloud Infrastructure fast-track recommended given strong fundamentals (24.2% IRR).
                </p>
              </div>
            </div>
          </div>

          {/* Capital Efficiency Recommendation */}
          <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Target className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm text-slate-900 mb-1">Capital Efficiency Insight</h4>
                <p className="text-sm text-slate-700">
                  Average payback for active projects is 32 months. Target portfolio optimization to reduce to {'<'}30 months 
                  through increased allocation to quick-win projects (High ROI / Low CapEx quadrant).
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
