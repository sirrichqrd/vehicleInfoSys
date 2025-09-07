import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Car, 
  UserCheck, 
  FileText, 
  BarChart3, 
  Home,
  X,
  ChevronLeft,
  User
} from 'lucide-react';
import { useEffect, useRef } from 'react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isOpen: boolean;
  onClose: () => void;
  onToggleCollapse?: () => void;
  isCollapsed?: boolean;
}

const navigation = [
  { id: 'dashboard', name: 'Dashboard', icon: Home },
  { id: 'drivers', name: 'Driver Registration', icon: Users },
  { id: 'vehicles', name: 'Vehicle Management', icon: Car },
  { id: 'assignments', name: 'Vehicle Assignment', icon: UserCheck },
  { id: 'logs', name: 'Driver Logs', icon: FileText },
  { id: 'reports', name: 'Reports', icon: BarChart3 },
];

export function Sidebar({ 
  activeTab, 
  onTabChange, 
  isOpen, 
  onClose,
  onToggleCollapse,
  isCollapsed = false
}: SidebarProps) {
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Focus management
  useEffect(() => {
    if (isOpen && sidebarRef.current) {
      const firstButton = sidebarRef.current.querySelector('button');
      firstButton?.focus();
    }
  }, [isOpen]);

  // Keyboard navigation
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black bg-opacity-50 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      
      {/* Sidebar */}
      <aside 
        ref={sidebarRef}
        className={cn(
          "fixed left-0 top-0 z-50 h-screen bg-white border-r transform transition-all duration-200 ease-in-out md:relative md:translate-x-0 flex flex-col",
          isOpen ? "translate-x-0" : "-translate-x-full",
          isCollapsed ? "w-20" : "w-64"
        )}
        aria-label="Main navigation"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b flex-shrink-0">
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              <div className="bg-blue-600 text-white p-2 rounded-lg">
                <Car className="h-5 w-5" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">FleetManager</h1>
            </div>
          )}
          <div className="flex items-center space-x-1">
            {onToggleCollapse && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onToggleCollapse}
                aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                className="hidden md:flex"
              >
                <ChevronLeft className={cn("h-4 w-4 transition-transform", isCollapsed && "rotate-180")} />
              </Button>
            )}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onClose}
              className="md:hidden"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        {/* Navigation - takes remaining space */}
        <nav className="flex-1 overflow-y-auto p-4">
          <div className="space-y-1">
            {navigation.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <Button
                  key={item.id}
                  variant={isActive ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-start",
                    isCollapsed && "justify-center px-2"
                  )}
                  onClick={() => {
                    onTabChange(item.id);
                    onClose();
                  }}
                  aria-current={isActive ? "page" : undefined}
                >
                  <item.icon className={cn("h-4 w-4", !isCollapsed && "mr-3")} />
                  {!isCollapsed && <span>{item.name}</span>}
                </Button>
              );
            })}
          </div>
        </nav>

        {/* User Profile/Footer - stays at bottom */}
        <div className="p-4 border-t flex-shrink-0">
          <Button 
            variant="ghost" 
            className={cn(
              "w-full justify-start",
              isCollapsed && "justify-center px-2"
            )}
          >
            <User className={cn("h-4 w-4", !isCollapsed && "mr-3")} />
            {!isCollapsed && <span>Profile</span>}
          </Button>
        </div>
      </aside>
    </>
  );
}