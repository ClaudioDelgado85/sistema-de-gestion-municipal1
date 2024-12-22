import React from 'react';
import { Outlet } from 'react-router-dom';
import { FileText, ClipboardList, Home, Bell, LogOut } from 'lucide-react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

function Layout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;