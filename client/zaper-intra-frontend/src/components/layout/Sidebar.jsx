// src/components/layout/Sidebar.jsx
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Users, 
  ChevronLeft, 
  ChevronRight,
  BarChart3,
  Settings,
  FileText,
  Calendar
} from 'lucide-react';
import { clsx } from 'clsx';

const Sidebar = ({ isCollapsed, onToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      id: 'clients',
      label: 'Clients',
      icon: Users,
      path: '/clients',
      active: location.pathname === '/clients'
    },
    {
      id: 'analytics',
      label: 'Analytics',
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
    {
      id: 'schedule',
      label: 'Schedule',
      icon: Calendar,
      path: '/schedule',
      active: location.pathname === '/schedule'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      path: '/settings',
      active: location.pathname === '/settings'
    }
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className={clsx(
      "fixed left-0 top-0 h-full bg-white border-r border-gray-200 transition-all duration-300 ease-in-out z-40",
      isCollapsed ? "w-16" : "w-64"
    )}>
      
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!isCollapsed && (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-sm font-bold text-white">Z</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Zaper</span>
          </div>
        )}
        
        <button
          onClick={onToggle}
          className={clsx(
            "p-1.5 rounded-lg hover:bg-gray-100 transition-colors",
            isCollapsed && "mx-auto"
          )}
        >
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5 text-gray-600" />
          ) : (
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          )}
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className="mt-8 px-2">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            
            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.path)}
                className={clsx(
                  "w-full flex items-center px-3 py-3 rounded-lg text-left transition-all duration-200",
                  "hover:bg-gray-50 active:bg-gray-100 group",
                  item.active 
                    ? "bg-indigo-50 text-indigo-700 border-r-2 border-indigo-600" 
                    : "text-gray-700 hover:text-gray-900",
                  isCollapsed && "justify-center"
                )}
              >
                <IconComponent className={clsx(
                  "w-5 h-5 transition-colors",
                  item.active ? "text-indigo-600" : "text-gray-500 group-hover:text-gray-700",
                  !isCollapsed && "mr-3"
                )} />
                
                {!isCollapsed && (
                  <span className="text-sm font-medium">{item.label}</span>
                )}
                
                {/* Tooltip for collapsed state */}
                {isCollapsed && (
                  <div className="absolute left-16 px-2 py-1 ml-2 text-sm bg-gray-900 text-white rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
                    {item.label}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      {!isCollapsed && (
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-600 text-center">
              Zaper Dashboard v1.0.0
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
