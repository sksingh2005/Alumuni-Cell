import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Settings, 
  LogOut, 
  User,
  GraduationCap,
  Bell,
  HelpCircle,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { cn } from '../lib/utils';
import axios from 'axios';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { logout, userRole } = useAuth();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const navigate=useNavigate();
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        onClose();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [onClose]);

  const menuItems = [
    {
      title: 'Dashboard',
      icon: LayoutDashboard,
      path: '/dashboard',
      show: true,
    },
    {
      title: 'New Request',
      icon: FileText,
      path: '/request',
      show: userRole === 'alumni',
    },
    {
      title: 'Admin Panel',
      icon: Settings,
      path: '/admin',
      show: userRole === 'admin',
    },
  ];

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Call logout endpoint
      await axios.post('http://localhost:5000/auth/logout', {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Clear local storage
      localStorage.removeItem('token');
      
      // Redirect to login page
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
      // Even if the server request fails, clear local storage and redirect
      localStorage.removeItem('token');
      navigate('/login');
    }
  };

  const handleLinkClick = () => {
    if (isMobile) {
      onClose();
    }
  };

  return (
    <>
      {/* Overlay */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out lg:transform-none",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
      
      >
        <div className="flex flex-col h-screen">
          {/* Header */}
          <div className="shrink-0 p-6 pt-4 flex items-center justify-between border-b border-gray-200">
            <Link to="/dashboard" className="flex items-center space-x-3" onClick={handleLinkClick}>
              <GraduationCap className="h-8 w-8 text-indigo-600" />
              <span className="text-xl font-bold text-gray-900">NITJ Alumni</span>
            </Link>
            {isMobile && (
              <button onClick={onClose} className="lg:hidden">
                <X className="h-6 w-6 text-gray-500" />
              </button>
            )}
          </div>

          {/* Main Navigation */}
          <div className="flex-1 flex flex-col justify-between">
            <nav className="px-4 py-4">
              <div className="space-y-1">
                {menuItems.map((item) => 
                  item.show && (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={handleLinkClick}
                      className={cn(
                        "flex items-center space-x-3 px-4 py-3 text-gray-600 rounded-lg transition-colors",
                        location.pathname === item.path 
                          ? "bg-indigo-50 text-indigo-600" 
                          : "hover:bg-gray-50"
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  )
                )}
              </div>
            </nav>

            {/* Bottom Section */}
            <div className="shrink-0 px-4 py-4 border-t border-gray-200">
              <div className="space-y-1">
                <Link
                  to="/profile"
                  className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg"
                  onClick={handleLinkClick}
                >
                  <User className="h-5 w-5" />
                  <span>Profile</span>
                </Link>
                <Link
                  to="/notifications"
                  className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg"
                  onClick={handleLinkClick}
                >
                  <Bell className="h-5 w-5" />
                  <span>Notifications</span>
                </Link>
                <Link
                  to="/help"
                  className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg"
                  onClick={handleLinkClick}
                >
                  <HelpCircle className="h-5 w-5" />
                  <span>Help & Support</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-3 px-4 py-3 text-red-600 w-full hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;