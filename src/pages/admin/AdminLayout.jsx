import { Link, Navigate, Outlet, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Activity, 
  BookOpen, 
  FileText, 
  Image, 
  Newspaper, 
  Megaphone, 
  Download, 
  Settings,
  LogOut,
  Menu,
  X,
  Briefcase
} from 'lucide-react';
import { useState } from 'react';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const role = localStorage.getItem('authRole');
  if (role !== 'admin') return <Navigate to="/login" replace />;

  const menuItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: 'Peserta', href: '/admin/peserta', icon: <Users className="w-5 h-5" /> },
    { name: 'Status Peserta', href: '/admin/status-peserta', icon: <Activity className="w-5 h-5" /> },
    { name: 'Program', href: '/admin/program', icon: <BookOpen className="w-5 h-5" /> },
    { name: 'Dokumen', href: '/admin/dokumen', icon: <FileText className="w-5 h-5" /> },
    { name: 'Galeri', href: '/admin/galeri', icon: <Image className="w-5 h-5" /> },
    { name: 'Lowker', href: '/admin/lowker', icon: <Newspaper className="w-5 h-5" /> },
    { name: 'Tim Kami', href: '/admin/tim', icon: <Briefcase className="w-5 h-5" /> },
    { name: 'Broadcast', href: '/admin/broadcast', icon: <Megaphone className="w-5 h-5" /> },
    { name: 'Export Data', href: '/admin/export-data', icon: <Download className="w-5 h-5" /> },
    { name: 'Pengaturan', href: '/admin/pengaturan', icon: <Settings className="w-5 h-5" /> },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar for Desktop */}
      <aside className={`bg-white w-64 shadow-xl hidden md:flex flex-col fixed h-full z-20`}>
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-blue-600 flex items-center gap-2">
            <LayoutDashboard className="w-6 h-6" />
            Admin Panel
          </h1>
        </div>
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive(item.href)
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-200">
          <Link
            to="/login"
            onClick={() => localStorage.removeItem('authRole')}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Keluar
          </Link>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Mobile Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out md:hidden ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h1 className="text-xl font-bold text-blue-600">Admin Panel</h1>
          <button onClick={() => setSidebarOpen(false)} className="text-gray-500">
            <X className="w-6 h-6" />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive(item.href)
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
        </nav>
         <div className="p-4 border-t border-gray-200">
          <Link
            to="/login"
            onClick={() => localStorage.removeItem('authRole')}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Keluar
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:ml-64 transition-all duration-300">
        {/* Mobile Header */}
        <header className="bg-white shadow-sm h-16 flex items-center px-4 md:hidden sticky top-0 z-10">
          <button onClick={() => setSidebarOpen(true)} className="text-gray-600 focus:outline-none">
            <Menu className="w-6 h-6" />
          </button>
          <span className="ml-4 text-lg font-semibold text-gray-800">Dashboard Admin</span>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
