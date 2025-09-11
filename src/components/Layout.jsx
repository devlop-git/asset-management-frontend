import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useMemo } from 'react';

export default function Layout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout, user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navigation = useMemo(() => {
    const AdminIcon = (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.378.313.696.66.87.349.174.766.184 1.125.028l1.179-.49a1.125 1.125 0 011.37.49l1.296 2.247c.25.433.168.98-.205 1.326l-.987.906c-.29.267-.42.66-.33 1.04.09.38.37.69.74.802l1.28.382c.52.155.86.65.82 1.19l-.19 2.59c-.04.54-.46.97-1 .998l-1.284.06c-.385.018-.735.226-.93.56-.196.334-.21.744-.036 1.09l.56 1.147c.246.506.065 1.115-.416 1.42l-2.24 1.4a1.125 1.125 0 01-1.407-.19l-.887-.95a1.125 1.125 0 00-1.02-.31c-.36.07-.717.106-1.074.106-.357 0-.714-.036-1.074-.106a1.125 1.125 0 00-1.02.31l-.887.95a1.125 1.125 0 01-1.407.19l-2.24-1.4a1.125 1.125 0 01-.416-1.42l.56-1.147c.174-.346.16-.756-.036-1.09a1.125 1.125 0 00-.93-.56l-1.284-.06a1.012 1.012 0 01-1-.999l-.19-2.59a1.125 1.125 0 01.82-1.19l1.28-.382c.37-.111.65-.422.74-.802.09-.38-.04-.773-.33-1.04l-.987-.906a1.125 1.125 0 01-.205-1.326l1.296-2.247a1.125 1.125 0 011.37-.49l1.179.49c.36.156.776.146 1.125-.028.347-.174.597-.492.66-.87l.213-1.28z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    );
    const StockIcon = (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 5.25h16.5M3.75 9.75h16.5M3.75 14.25h16.5M3.75 18.75h16.5" />
      </svg>
    );

    const items = [];
    if (isAuthenticated) {
      items.push(
        { name: 'Admin', href: '/admin', current: location.pathname === '/admin', icon: AdminIcon },
        { name: 'Stock List', href: '/stock', current: location.pathname === '/stock', icon: StockIcon }
      );
    }
    return items;
  }, [isAuthenticated, location.pathname]);

  const sidebarWidthClass = isSidebarOpen ? 'w-64' : 'w-16';
  const contentPaddingLeft = isSidebarOpen ? 'lg:pl-64' : 'lg:pl-16';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 ${sidebarWidthClass} bg-white border-r border-gray-200 shadow-sm transition-all duration-300 hidden sm:flex flex-col`}>
        <div className="h-16 flex items-center px-3 justify-between">
          <div className="flex items-center space-x-2">
            <img src="/logo.png" alt="Logo" className={isSidebarOpen ? 'w-45 h-5' : 'w-8 h-5'} />
          </div>
          <button
            onClick={() => setIsSidebarOpen((v) => !v)}
            aria-label={isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            className="p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {isSidebarOpen ? (
              // Close icon
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-gray-600">
                <path fillRule="evenodd" d="M18.3 5.71a1 1 0 010 1.41L13.41 12l4.89 4.88a1 1 0 01-1.42 1.42L12 13.41l-4.88 4.89a1 1 0 01-1.42-1.42L10.59 12 5.7 7.12A1 1 0 117.12 5.7L12 10.59l4.88-4.89a1 1 0 011.41 0z" clipRule="evenodd" />
              </svg>
            ) : (
              // Hamburger icon
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            )}
          </button>
        </div>

        <nav className="flex-1 px-2 py-3 space-y-1">
          {/* {isSidebarOpen && (
            <div className="px-3 pb-2">
              <span className="text-xs uppercase tracking-wider text-gray-400">Menu</span>
            </div>
          )} */}
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`group relative flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                item.current
                  ? 'bg-primary-50 text-primary-700 ring-1 ring-primary-100'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              }`}
              title={!isSidebarOpen ? item.name : undefined}
            >
              <span className={`flex items-center justify-center ${isSidebarOpen ? 'w-6' : 'w-8'} h-6 rounded-md ${item.current ? 'text-primary-700' : 'text-gray-500 group-hover:text-gray-700'}`}>
                {item.icon}
              </span>
              {isSidebarOpen && <span className="truncate">{item.name}</span>}
              {item.current && (
                <span className="absolute inset-y-0 left-0 w-0.5 bg-primary-500 rounded-r" />
              )}
            </Link>
          ))}
        </nav>

        <div className="border-t border-gray-200 p-3 mt-auto">
          {isAuthenticated ? (
            <div className="flex items-center justify-between">
              {isSidebarOpen && <span className="text-sm text-gray-700 truncate">{user.name}</span>}
              <button onClick={handleLogout} className="btn-secondary text-sm">Logout</button>
            </div>
          ) : (
            <Link to="/" className="btn-primary w-full text-center text-sm">Admin Login</Link>
          )}
        </div>
      </aside>

      {/* Mobile top bar with toggle */}
      <div className="sm:hidden fixed top-0 inset-x-0 h-14 bg-white border-b border-gray-200 z-30 flex items-center px-4 justify-between">
        <button
          onClick={() => setIsSidebarOpen(true)}
          aria-label="Open sidebar"
          className="p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-700">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>
        <img src="/logo.png" alt="Logo" className="w-32 h-4" />
        <div />
      </div>

      {/* Mobile overlay sidebar */}
      <div className={`sm:hidden fixed inset-0 z-40 ${isSidebarOpen ? '' : 'pointer-events-none'}`}>
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/30 transition-opacity duration-200 ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setIsSidebarOpen(false)}
        />
        {/* Panel */}
        <div className={`absolute inset-y-0 left-0 w-64 bg-white border-r border-gray-200 shadow-lg transform transition-transform duration-200 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="h-14 flex items-center justify-between px-4 border-b border-gray-200">
            <img src="/logo.png" alt="Logo" className="w-32 h-4" />
            <button
              onClick={() => setIsSidebarOpen(false)}
              aria-label="Close sidebar"
              className="p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-gray-700">
                <path fillRule="evenodd" d="M18.3 5.71a1 1 0 010 1.41L13.41 12l4.89 4.88a1 1 0 01-1.42 1.42L12 13.41l-4.88 4.89a1 1 0 01-1.42-1.42L10.59 12 5.7 7.12A1 1 0 117.12 5.7L12 10.59l4.88-4.89a1 1 0 011.41 0z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          <nav className="px-2 py-3 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setIsSidebarOpen(false)}
                className={`block px-3 py-2 rounded-md text-sm font-medium ${item.current ? 'bg-primary-50 text-primary-700' : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'}`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
          <div className="border-t border-gray-200 p-3">
            {isAuthenticated ? (
              <button onClick={() => { setIsSidebarOpen(false); handleLogout(); }} className="btn-secondary w-full text-sm">Logout</button>
            ) : (
              <Link to="/" onClick={() => setIsSidebarOpen(false)} className="btn-primary w-full text-center text-sm">Admin Login</Link>
            )}
          </div>
        </div>
      </div>

      {/* Content area */}
      <main className={`pt-6 px-4 sm:px-6 lg:px-8 ${contentPaddingLeft} sm:pt-8`}>
        {/* spacer for mobile top bar */}
        <div className="sm:hidden h-14" />
        {children}
      </main>
    </div>
  );
}