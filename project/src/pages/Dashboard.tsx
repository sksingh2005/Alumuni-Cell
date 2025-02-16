import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  GraduationCap, 
  Bell, 
  FileText,
  Users,
  Calendar,
  Globe2,
  Briefcase,
  ChevronRight,
  TrendingUp,
  Award,
  BookOpen,
  Building2,
  ExternalLink,
  Download,
  Mail
} from 'lucide-react';
import { generateVerificationForm } from '../lib/utils';
import axios from 'axios'; // Add axios for API calls

// Define types
interface UserData {
  id: string;
  name: string;
  email: string;
  branch: string;
  role: string;
  rollNumber?: string;
  graduationYear?: string;
  currentOrganization?: string;
  designation?: string;
}

interface Notification {
  id: number;
  title: string;
  description: string;
  type: 'event' | 'job' | 'mentorship';
  date: string;
  link: string;
}

interface Stat {
  label: string;
  value: string;
  icon: React.ComponentType<any>;
  color: string;
}

interface QuickAction {
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  link: string;
  color: string;
  action: () => void;
}

interface Activity {
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  timestamp: string;
  color: string;
}

interface Resource {
  title: string;
  icon: React.ComponentType<any>;
  color: string;
  action: () => void;
}


const Dashboard: React.FC = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      title: 'Alumni Meet 2025',
      description: 'Registration now open for the grand reunion',
      type: 'event',
      date: '2025-03-15',
      link: 'https://alumni.nitj.ac.in/events/meet-2025'
    },
    {
      id: 2,
      title: 'New Job Opportunities',
      description: 'Senior positions available at top tech companies',
      type: 'job',
      date: '2025-02-28',
      link: 'https://alumni.nitj.ac.in/jobs'
    },
    {
      id: 3,
      title: 'Mentorship Program',
      description: 'Share your experience with current students',
      type: 'mentorship',
      date: '2025-02-20',
      link: 'https://alumni.nitj.ac.in/mentorship'
    }
  ]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Get token from localStorage or your preferred storage
        const token = localStorage.getItem('token');
        
        if (!token) {
          // Redirect to login if no token
          navigate('/login');
          return;
        }
        
        // Make request to your /me endpoint
        const response = await axios.get('http://localhost:5000/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        setUserData(response.data.user);

      } catch (error) {
        console.error('Error fetching user data:', error);
        // Handle unauthorized or expired token
        if (axios.isAxiosError(error) && error.response && (error.response.status === 401 || error.response.status === 403)) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      }
    };
    
    fetchUserData();
  }, [navigate]);
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
  const stats: Stat[] = [
    { label: 'Alumni Network', value: '10,000+', icon: Users, color: 'bg-blue-500' },
    { label: 'Events This Year', value: '24', icon: Calendar, color: 'bg-purple-500' },
    { label: 'Job Opportunities', value: '150+', icon: Briefcase, color: 'bg-green-500' },
    { label: 'Countries', value: '45+', icon: Globe2, color: 'bg-orange-500' }
  ];

  const quickActions: QuickAction[] = [
    {
      title: 'Request Certificate',
      description: 'Get your alumni verification',
      icon: FileText,
      link: '/request',
      color: 'bg-indigo-100 text-indigo-600',
      action: () => navigate('/request')
    },
    {
      title: 'Join Mentorship',
      description: 'Guide current students',
      icon: Users,
      link: '#',
      color: 'bg-purple-100 text-purple-600',
      action: () => window.open('https://alumni.nitj.ac.in/mentorship', '_blank')
    },
    {
      title: 'Update Profile',
      description: 'Keep your information current',
      icon: Award,
      link: '#',
      color: 'bg-blue-100 text-blue-600',
      action: () => navigate('/')
    }
  ];

  const handleDownloadCertificate = async () => {
    if (!userData) {
      alert('User data is missing. Please log in and try again.');
      return;
    }
  
    // Check for missing required fields
    const missingFields: string[] = [];
    if (!userData.name) missingFields.push('Full Name');
    if (!userData.rollNumber) missingFields.push('Roll Number');
    if (!userData.graduationYear) missingFields.push('Graduation Year');
    if (!userData.branch) missingFields.push('Branch/Department');
    if (!userData.currentOrganization) missingFields.push('Current Organization');
    if (!userData.designation) missingFields.push('Designation');
  
    // If there are missing fields, display a message and stop execution
    if (missingFields.length > 0) {
      alert(
        `The following fields are missing and must be filled before downloading the certificate:\n- ${missingFields.join(
          '\n- '
        )}`
      );
      
      // Redirect to profile to complete information
      navigate('/dashboard');
      return;
    }
  
    try {
      // Generate certificate with user data
      generateVerificationForm({
        fullName: userData.name,
        rollNumber: userData.rollNumber || '',
        graduationYear: userData.graduationYear || '',
        department: userData.branch,
        currentOrganization: userData.currentOrganization || '',
        designation: userData.designation || '',
        purpose: 'Alumni Verification',
        requestId: userData.id,
      });
    } catch (error) {
      console.error('Error downloading certificate:', error);
      alert('An error occurred while generating the certificate. Please try again.');
    }
  };
  
  

  const handleContactSupport = () => {
    window.location.href = 'mailto:alumni.support@nitj.ac.in';
  };

  const handleNotificationClick = (link: string) => {
    window.open(link, '_blank');
  };

  const handleViewAllNotifications = () => {
    navigate('/notifications');
  };

  const resources: Resource[] = [
    { 
      title: 'Alumni Directory',
      icon: BookOpen,
      color: 'bg-indigo-100 text-indigo-600',
      action: () => window.open('https://alumni.nitj.ac.in/directory', '_blank')
    },
    { 
      title: 'Career Services',
      icon: Briefcase,
      color: 'bg-green-100 text-green-600',
      action: () => window.open('https://alumni.nitj.ac.in/careers', '_blank')
    },
    { 
      title: 'Campus News',
      icon: Building2,
      color: 'bg-purple-100 text-purple-600',
      action: () => window.open('https://alumni.nitj.ac.in/news', '_blank')
    }
  ];

  const activities: Activity[] = [
    {
      title: 'Profile Updated',
      description: 'You updated your work experience',
      icon: TrendingUp,
      timestamp: '2 hours ago',
      color: 'bg-green-100 text-green-600'
    },
    {
      title: 'Certificate Downloaded',
      description: 'You downloaded your verification certificate',
      icon: Download,
      timestamp: '1 day ago',
      color: 'bg-blue-100 text-blue-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <GraduationCap className="h-8 w-8 text-indigo-600 mr-3" />
                Welcome back, {userData?.name || 'Alumni'}
              </h1>
              <p className="mt-1 text-gray-500">Access your alumni dashboard and stay connected</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleDownloadCertificate}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Certificate
              </button>
              <button
                onClick={handleContactSupport}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <Mail className="h-4 w-4 mr-2" />
                Contact Support
              </button>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-4 py-2 border border-red-300 rounded-lg text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
              </div>
              <div className="divide-y divide-gray-100">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={action.action}
                    className="w-full flex items-center p-6 hover:bg-gray-50 transition-colors text-left"
                  >
                    <div className={`p-3 rounded-lg ${action.color}`}>
                      <action.icon className="h-6 w-6" />
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className="text-sm font-medium text-gray-900">{action.title}</h3>
                      <p className="text-sm text-gray-500">{action.description}</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </button>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
              </div>
              <div className="divide-y divide-gray-100">
                {activities.map((activity, index) => (
                  <div key={index} className="flex items-center p-6">
                    <div className={`p-3 rounded-lg ${activity.color}`}>
                      <activity.icon className="h-6 w-6" />
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className="text-sm font-medium text-gray-900">{activity.title}</h3>
                      <p className="text-sm text-gray-500">{activity.description}</p>
                    </div>
                    <span className="text-sm text-gray-400">{activity.timestamp}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Notifications Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
              </div>
              <div className="divide-y divide-gray-100">
                {notifications.map((notification) => (
                  <div 
                    key={notification.id} 
                    className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => handleNotificationClick(notification.link)}
                  >
                    <div className="flex items-center">
                      <div className={`p-2 rounded-lg ${
                        notification.type === 'event' ? 'bg-purple-100 text-purple-600' :
                        notification.type === 'job' ? 'bg-green-100 text-green-600' :
                        'bg-blue-100 text-blue-600'
                      }`}>
                        {notification.type === 'event' ? <Calendar className="h-5 w-5" /> :
                         notification.type === 'job' ? <Briefcase className="h-5 w-5" /> :
                         <Users className="h-5 w-5" />}
                      </div>
                      <div className="ml-4 flex-1">
                        <h3 className="text-sm font-medium text-gray-900">{notification.title}</h3>
                        <p className="text-sm text-gray-500">{notification.description}</p>
                        <p className="text-xs text-gray-400 mt-1">{notification.date}</p>
                      </div>
                      <ExternalLink className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 bg-gray-50 border-t border-gray-100">
                <button 
                  onClick={handleViewAllNotifications}
                  className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  View all notifications
                </button>
              </div>
            </div>

            {/* Resources Card */}
            <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">Resources</h2>
              </div>
              <div className="divide-y divide-gray-100">
                {resources.map((resource, index) => (
                  <button
                    key={index}
                    onClick={resource.action}
                    className="w-full flex items-center p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className={`p-2 rounded-lg ${resource.color}`}>
                      <resource.icon className="h-5 w-5" />
                    </div>
                    <span className="ml-3 text-sm font-medium text-gray-900">{resource.title}</span>
                    <ChevronRight className="ml-auto h-5 w-5 text-gray-400" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;