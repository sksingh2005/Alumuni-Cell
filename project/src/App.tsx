import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import RequestForm from './pages/RequestForm';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/dashboard"
              element={
                <AuthProvider>
                  <div className="flex">
                    <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
                    <div className="flex-1 min-h-screen">
                      <Navbar onMenuClick={toggleSidebar} />
                      <Dashboard />
                    </div>
                  </div>
                </AuthProvider>
              }
            />
            <Route
              path="/request"
              element={
                <AuthProvider>
                  <div className="flex">
                    <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
                    <div className="flex-1 min-h-screen">
                      <Navbar onMenuClick={toggleSidebar} />
                      <RequestForm />
                    </div>
                  </div>
                </AuthProvider>
              }
            />
            <Route
              path="/admin"
              element={
                <AuthProvider>
                  <div className="flex">
                    <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
                    <div className="flex-1 min-h-screen">
                      <Navbar onMenuClick={toggleSidebar} />
                      <AdminDashboard />
                    </div>
                  </div>
                </AuthProvider>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;