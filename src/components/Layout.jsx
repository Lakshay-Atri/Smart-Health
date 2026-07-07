import React, { useState } from 'react';
import { Link, useLocation, useParams, useNavigate } from 'react-router-dom';
import {
    Activity,
    Grid,
    Database,
    Bell,
    Menu,
    X,
    Hospital,
    Heart,
    FileText,
    ChevronLeft,
    AlertTriangle,
    Repeat,
    TrendingUp,
    ClipboardList
  } from 'lucide-react';

export function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { centreId } = useParams();
  const navigate = useNavigate();

  // Determine current page type
  const isHome = location.pathname === '/';
  const isDetail = location.pathname.startsWith('/centre/') && !location.pathname.endsWith('/inventory');
  const isInventory = location.pathname.endsWith('/inventory');

  // Renders the page title in the header based on the active path
  const getHeaderTitle = () => {
    if (isHome) return 'All Health Centres';
    if (isDetail) return 'Centre Details';
    if (isInventory) return 'Medicine Stock';
    return 'Smart Health Centre Management';
  };

  const navLinks = [
    {
      name: 'All Health Centres',
      path: '/',
      icon: <Grid className="w-5 h-5" />,
      active: location.pathname === '/'
    },
    {
      name: 'Medicines Running Low',
      path: '/warnings',
      icon: <AlertTriangle className="w-5 h-5" />,
      active: location.pathname === '/warnings'
    },
    {
      name: 'Move Supplies',
      path: '/redistribution',
      icon: <Repeat className="w-5 h-5" />,
      active: location.pathname === '/redistribution'
    },
    {
      name: 'Expected Patients',
      path: '/forecast',
      icon: <TrendingUp className="w-5 h-5" />,
      active: location.pathname === '/forecast'
    },
    {
      name: 'Needs Attention',
      path: '/alerts',
      icon: <Bell className="w-5 h-5" />,
      active: location.pathname === '/alerts'
    },
    {
      name: 'Staff Data Entry',
      path: '/data-entry',
      icon: <ClipboardList className="w-5 h-5" />,
      active: location.pathname === '/data-entry'
    }
  ];

  // If a specific centre is selected, add contextual links
  if (centreId) {
    navLinks.push(
      {
        name: 'Centre Details',
        path: `/centre/${centreId}`,
        icon: <Activity className="w-5 h-5" />,
        active: isDetail
      },
      {
        name: 'Medicine Stock',
        path: `/centre/${centreId}/inventory`,
        icon: <Database className="w-5 h-5" />,
        active: isInventory
      }
    );
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Sidebar for Desktop */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-slate-300 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:flex md:flex-col ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
        {/* Brand Header */}
        <div className="flex items-center justify-between px-6 py-5 bg-slate-950/40 border-b border-slate-800/60">
          <div className="flex items-center space-x-3">
            <div className="bg-indigo-600 text-white p-2 rounded-xl shadow-md shadow-indigo-600/30">
              <Hospital className="w-6 h-6" />
            </div>
            <div>
              <span className="font-extrabold text-white text-lg tracking-tight block">Smart Health</span>
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">District Dashboard</span>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden text-slate-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 mb-3">Navigation</div>
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-150 ${link.active
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                }`}
            >
              {link.icon}
              <span>{link.name}</span>
            </Link>
          ))}

          {centreId && (
            <div className="pt-6">
              <button
                onClick={() => navigate('/')}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-500 hover:text-slate-300 hover:bg-slate-800/30 transition-all border border-dashed border-slate-800/80"
              >
                <ChevronLeft className="w-5 h-5" />
                <span>Back to Overview</span>
              </button>
            </div>
          )}
        </nav>

        {/* Sidebar Footer info */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/20">
          <div className="flex items-center space-x-3 bg-slate-800/30 rounded-xl p-3 border border-slate-800/40">
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center font-bold text-xs text-indigo-400 border border-slate-600">
              HQ
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-300">Hackathon Team 12</div>
              <div className="text-[10px] text-indigo-400 font-medium">District Operator</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header Bar */}
        <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-100 shadow-sm z-30">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 focus:outline-none"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-lg font-bold text-slate-800 tracking-tight">{getHeaderTitle()}</h1>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>

          {/* Quick Actions / Status */}
          <div className="flex items-center space-x-4">
            {/* Live Indicator */}
            <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100/40">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
              </span>
              <span className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider">Live Updates</span>
            </div>

            {/* Notifications */}
            <div className="relative">
              <button className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors border border-slate-100">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500"></span>
              </button>
            </div>
          </div>
        </header>

        {/* Scrollable Panel */}
        <main className="flex-1 overflow-y-auto focus:outline-none bg-slate-50 p-6 md:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}

export default Layout;
