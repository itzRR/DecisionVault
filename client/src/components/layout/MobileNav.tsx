import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, Lightbulb, Settings } from 'lucide-react';

const MobileNav: React.FC = () => {
  const navItems = [
    { to: '/dashboard', icon: <LayoutDashboard size={24} />, label: 'Dashboard' },
    { to: '/decisions/new', icon: <PlusCircle size={24} />, label: 'New' },
    { to: '/insights', icon: <Lightbulb size={24} />, label: 'Insights' },
    { to: '/settings', icon: <Settings size={24} />, label: 'Settings' },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe shadow-[0_-4px_10px_-4px_rgba(0,0,0,0.1)] z-40">
      <div className="flex justify-around items-center h-16 px-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
                isActive ? 'text-brand-600' : 'text-gray-500 hover:text-gray-900'
              }`
            }
          >
            {item.icon}
            <span className="text-[10px] font-medium">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default MobileNav;
