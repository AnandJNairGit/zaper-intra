// src/components/layout/Sidebar.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Users, ChevronLeft, ChevronRight, BarChart3, Settings, FileText, Calendar, LogOut } from 'lucide-react';
import { clsx } from 'clsx';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Initialize collapsed state from localStorage or default to true (collapsed)
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const stored = localStorage.getItem('sidebar-collapsed');
    return stored === null ? true : stored === 'true';
  });

  // Save collapsed state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('sidebar-collapsed', isCollapsed.toString());
  }, [isCollapsed]);

  const toggleSidebar = () => {
    setIsCollapsed(prev => !prev);
  };

  const handleLogout = () => {
    // Clear authentication token
    localStorage.removeItem('app_auth');
    // Clear sidebar state (optional)
    localStorage.removeItem('sidebar-collapsed');
    // Redirect to login page
    window.location.href = '/login';
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  const menuItems = [
    { 
      id: 'clients', 
      label: 'Clients', 
      icon: Users, 
      path: '/clients', 
      active: location.pathname === '/clients' || location.pathname.startsWith('/clients/')
    },
    { 
      id: 'analytics', 
      label: 'Projects', 
      icon: BarChart3, 
      path: '/analytics', 
      active: location.pathname === '/analytics' 
    },
    { 
      id: 'reports', 
      label: 'Reports', 
      icon: FileText, 
      path: '/reports', 
      active: location.pathname === '/reports' 
    },
    // Uncomment these when you implement the pages
    // { 
    //   id: 'schedule', 
    //   label: 'Schedule', 
    //   icon: Calendar, 
    //   path: '/schedule', 
    //   active: location.pathname === '/schedule' 
    // },
    // { 
    //   id: 'settings', 
    //   label: 'Settings', 
    //   icon: Settings, 
    //   path: '/settings', 
    //   active: location.pathname === '/settings' 
    // }
  ];

  return (
    <aside 
      className={clsx(
        "bg-gray-900 text-white h-full flex flex-col transition-all duration-300 ease-in-out",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header with Logo and Toggle Button */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        {!isCollapsed && (
          <div className="flex items-center">
            <div className="text-lg font-bold text-white">Zaper Dashboard</div>
          </div>
        )}
        <button
          onClick={toggleSidebar}
          className={clsx(
            "p-1 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors",
            isCollapsed && "mx-auto"
          )}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.path)}
              className={clsx(
                "group flex items-center w-full px-2 py-2 text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500",
                item.active
                  ? "bg-gray-800 text-white"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white",
                isCollapsed ? "justify-center" : "justify-start"
              )}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon 
                className={clsx(
                  "h-5 w-5 flex-shrink-0",
                  !isCollapsed && "mr-3"
                )} 
                aria-hidden="true" 
              />
              {!isCollapsed && (
                <span className="truncate">{item.label}</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Version Info (when expanded) */}
      {!isCollapsed && (
        <div className="px-4 py-2 border-t border-gray-700">
          <p className="text-xs text-gray-400 text-center">
            Zaper Dashboard v1.0.0
          </p>
        </div>
      )}

      {/* Logout Button */}
      <div className="border-t border-gray-700 p-4">
        <button
          onClick={handleLogout}
          className={clsx(
            "group flex items-center w-full px-2 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-red-600 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-red-500",
            isCollapsed ? "justify-center" : "justify-start"
          )}
          title={isCollapsed ? "Logout" : undefined}
        >
          <LogOut 
            className={clsx(
              "h-5 w-5 flex-shrink-0",
              !isCollapsed && "mr-3"
            )} 
            aria-hidden="true" 
          />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
