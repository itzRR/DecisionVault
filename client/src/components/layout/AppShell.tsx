import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';

const AppShell: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen pb-16 md:pb-0">
        <main className="flex-1 w-full max-w-6xl mx-auto p-4 md:p-8">
          <Outlet />
        </main>
      </div>
      <MobileNav />
    </div>
  );
};

export default AppShell;
