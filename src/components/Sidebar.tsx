import { 
  BarChart3, ArrowUpDown, Users, AlertTriangle, 
  ClipboardList, DollarSign, Globe, TrendingUp, 
  Target, ShoppingCart, Activity, Home,
  Settings
} from 'lucide-react';
import { cn } from './ui/utils';

interface SidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
}

const menuItems = [
  { 
    id: 'executive-summary', 
    label: 'Executive Summary', 
    icon: ClipboardList,
    tooltip: 'High-level overview and key business metrics'
  },
  // { 
  //   id: 'analytics', 
  //   label: 'Analytics', 
  //   icon: BarChart3,
  //   tooltip: 'Deep diagnostic and predictive analytics'
  // },
  // { 
  //   id: 'cashflow', 
  //   label: 'Cashflow', 
  //   icon: ArrowUpDown,
  //   tooltip: 'Cash flow and liquidity management'
  // },
  // { 
  //   id: 'client-distribution', 
  //   label: 'Client Distribution', 
  //   icon: Users,
  //   tooltip: 'Customer segmentation and revenue analysis'
  // },
  // { 
  //   id: 'exception', 
  //   label: 'Exception', 
  //   icon: AlertTriangle,
  //   tooltip: 'Financial exceptions and alerts management'
  // },
  // { 
  //   id: 'financial-overview', 
  //   label: 'Financial Overview', 
  //   icon: DollarSign,
  //   tooltip: 'Complete financial position and health'
  // },
  // { 
  //   id: 'geo-mix', 
  //   label: 'Geo Mix', 
  //   icon: Globe,
  //   tooltip: 'Regional contribution and growth analysis'
  // },
  // { 
  //   id: 'investment', 
  //   label: 'Investment', 
  //   icon: TrendingUp,
  //   tooltip: 'Portfolio performance and allocation tracking'
  // },
  // { 
  //   id: 'kpi', 
  //   label: 'KPI', 
  //   icon: Target,
  //   tooltip: 'Key performance indicators and targets'
  // },
  // { 
  //   id: 'sales-insight', 
  //   label: 'Sales Insight', 
  //   icon: ShoppingCart,
  //   tooltip: 'Sales performance and pipeline analytics'
  // },
  // { 
  //   id: 'utilization', 
  //   label: 'Utilization', 
  //   icon: Activity,
  //   tooltip: 'Resource utilization and capacity planning'
  // },
  // { 
  //   id: 'settings', 
  //   label: 'Settings', 
  //   icon: Settings,
  //   tooltip: 'Application settings and preferences'
  // },
];

export function Sidebar({ activePage, onNavigate }: SidebarProps) {
  return (
    <div className="bg-white border-r border-slate-200 h-screen overflow-y-auto w-80">
      {/* Header */}
      <div className="border-b border-slate-200 p-6">
        <button 
          onClick={() => onNavigate('executive-summary')}
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          title="Go to Executive Summary"
        >
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
            <Home className="w-4 h-4 text-white" />
          </div>
          <h2 className="text-slate-900">CFO Dashboard</h2>
        </button>
      </div>

      {/* Menu Items */}
      <div className="py-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={cn(
                'w-full flex items-center gap-3 px-6 py-3 hover:bg-slate-50 transition-all text-left border-b border-slate-100 group',
                activePage === item.id && 'bg-blue-50 border-l-4 border-l-blue-600'
              )}
            >
              <Icon className={cn(
                "w-5 h-5 flex-shrink-0 transition-colors",
                activePage === item.id ? 'text-blue-600' : 'text-slate-500 group-hover:text-blue-600'
              )} />
              <span className={cn(
                "text-sm flex-1 transition-colors",
                activePage === item.id ? 'text-blue-900' : 'text-slate-700 group-hover:text-blue-900'
              )}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
