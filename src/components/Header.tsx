import { LogOut, ChevronRight, LayoutDashboard, Search, Bell, User, Settings, HelpCircle, ChevronDown } from 'lucide-react';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Avatar, AvatarFallback } from './ui/avatar';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from './ui/breadcrumb';
import { Input } from './ui/input';
import { Badge } from './ui/badge';

interface HeaderProps {
  onLogout: () => void;
  onNavigateToProfile: () => void;
  onNavigateToSettings?: () => void;
  userEmail: string;
  currentPage?: string;
  currentPageLabel?: string;
}

export function Header({ onLogout, onNavigateToProfile, onNavigateToSettings, userEmail, currentPage, currentPageLabel }: HeaderProps) {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shadow-sm">
      <div className="flex-1 flex items-center gap-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#" className="flex items-center gap-2">
                <LayoutDashboard className="w-4 h-4" />
                CFO Dashboard
              </BreadcrumbLink>
            </BreadcrumbItem>
            {currentPageLabel && (
              <>
                <BreadcrumbSeparator>
                  <ChevronRight className="w-4 h-4" />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbPage>{currentPageLabel}</BreadcrumbPage>
                </BreadcrumbItem>
              </>
            )}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Search Bar */}
      <div className="flex-1 max-w-xl mx-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            type="search"
            placeholder="Search dashboards, metrics, reports..."
            className="pl-10 bg-slate-50 border-slate-200 focus:bg-white transition-colors"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5 text-slate-600" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-600 text-white text-xs">
                3
              </Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-96 overflow-y-auto">
              <div className="p-3 hover:bg-slate-50 cursor-pointer border-b border-slate-100">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm text-slate-900">Cash flow alert</p>
                    <p className="text-xs text-slate-600 mt-1">Working capital ratio below threshold</p>
                    <p className="text-xs text-slate-400 mt-1">2 hours ago</p>
                  </div>
                </div>
              </div>
              <div className="p-3 hover:bg-slate-50 cursor-pointer border-b border-slate-100">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm text-slate-900">Target achieved</p>
                    <p className="text-xs text-slate-600 mt-1">Q4 revenue target exceeded by 8%</p>
                    <p className="text-xs text-slate-400 mt-1">5 hours ago</p>
                  </div>
                </div>
              </div>
              <div className="p-3 hover:bg-slate-50 cursor-pointer">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-amber-600 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm text-slate-900">Exception report</p>
                    <p className="text-xs text-slate-600 mt-1">12 new exceptions require review</p>
                    <p className="text-xs text-slate-400 mt-1">1 day ago</p>
                  </div>
                </div>
              </div>
            </div>
            <DropdownMenuSeparator />
            <div className="p-2">
              <Button variant="ghost" size="sm" className="w-full">
                View all notifications
              </Button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              className="relative h-10 flex items-center gap-2 rounded-full hover:bg-slate-100 transition-all duration-200 pr-3 pl-1"
            >
              <Avatar className="h-9 w-9 border-2 border-blue-500 shadow-md">
                <AvatarFallback className="bg-gradient-to-br from-blue-600 to-blue-800 text-white">
                  {userEmail.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <ChevronDown className="h-4 w-4 text-slate-600 hidden sm:block" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-72 shadow-xl border-slate-200" align="end" sideOffset={8}>
            {/* User Info Header */}
            <DropdownMenuLabel className="p-0 mb-0">
              <div className="px-3 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12 border-2 border-blue-500 shadow-md">
                    <AvatarFallback className="bg-gradient-to-br from-blue-600 to-blue-800 text-white text-lg">
                      {userEmail.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">
                      {userEmail.split('@')[0].charAt(0).toUpperCase() + userEmail.split('@')[0].slice(1)}
                    </p>
                    <p className="text-xs text-slate-600 truncate">{userEmail}</p>
                    <div className="mt-1">
                      <Badge className="bg-blue-100 text-blue-700 text-xs border-blue-200 hover:bg-blue-100">
                        CFO Admin
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />
            
            {/* Edit Profile */}
            <DropdownMenuItem 
              onClick={onNavigateToProfile}
              className="cursor-pointer flex-col items-start gap-0 py-3 px-3"
            >
              <div className="flex items-center gap-2 w-full">
                <User className="h-4 w-4 text-blue-600" />
                <span className="font-medium">Edit Profile</span>
              </div>
              <span className="text-xs text-slate-500 ml-6">Manage your account settings</span>
            </DropdownMenuItem>

            {/* Settings */}
            {onNavigateToSettings && (
              <DropdownMenuItem 
                onClick={onNavigateToSettings}
                className="cursor-pointer flex-col items-start gap-0 py-3 px-3"
              >
                <div className="flex items-center gap-2 w-full">
                  <Settings className="h-4 w-4 text-slate-600" />
                  <span className="font-medium">Settings</span>
                </div>
                <span className="text-xs text-slate-500 ml-6">App preferences & configuration</span>
              </DropdownMenuItem>
            )}

            {/* Help & Support */}
            <DropdownMenuItem 
              className="cursor-pointer flex-col items-start gap-0 py-3 px-3"
            >
              <div className="flex items-center gap-2 w-full">
                <HelpCircle className="h-4 w-4 text-slate-600" />
                <span className="font-medium">Help & Support</span>
              </div>
              <span className="text-xs text-slate-500 ml-6">Get assistance and resources</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator />
            
            {/* Logout */}
            <DropdownMenuItem 
              onClick={onLogout}
              className="cursor-pointer flex-col items-start gap-0 py-3 px-3 focus:bg-red-50"
            >
              <div className="flex items-center gap-2 w-full">
                <LogOut className="h-4 w-4 text-red-600" />
                <span className="font-medium text-red-900">Log out</span>
              </div>
              <span className="text-xs text-red-600 ml-6">Sign out of your account</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
