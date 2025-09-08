import { Car, Menu, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import NotificationDropdown from "@/components/Notifications/NotificationDropdown";

interface NavbarProps {
  onMenuClick: () => void;
  onSearch: (query: string) => void;
}

export function Navbar({ onMenuClick, onSearch }: NavbarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <nav className="bg-white shadow-sm border-b px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="md:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center space-x-2">
            <Car className="h-8 w-8 text-blue-600" />
            <h1 className="text-xl font-bold text-gray-900  sm:block">VIS Manager</h1>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Desktop Search */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center space-x-2 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search drivers, vehicles, plates, licenses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-80"
              />
            </div>
            <Button type="submit" size="sm">
              Search
            </Button>
          </form>

          {/* Mobile Search Icon */}
          <div className="md:hidden">
            {showSearch ? (
              <form onSubmit={handleSearch} className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 w-40"
                    autoFocus
                  />
                </div>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowSearch(false)}
                >
                  Cancel
                </Button>
              </form>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowSearch(true)}
              >
                <Search className="h-5 w-5" />
              </Button>
            )}
          </div>

          {/* Notifications */}
          <div className="flex-shrink-0">
            <NotificationDropdown />
          </div>
        </div>
      </div>
    </nav>
  );
}