import { useState } from "react";
import { useNavigate,useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LayoutDashboard,KanbanSquare,BarChart3,LogOut,ChevronLeft,ChevronRight,Settings } from "lucide-react";


const navItems = [
    {label:'Dashboard',icon:LayoutDashboard,path:'/dashboard'},
    {label:'Kanban Board',icon:KanbanSquare,path:'/kanban'},
    {label:'Analytics',icon:BarChart3,path:'/analytics'},
];

const Sidebar = () => {
    const [collapsed,setCollapsed] = useState(false);
    const {user,logout}=useAuth();
    const navigate= useNavigate();
    const location = useLocation();
    
    const handleLogout = () => {
        logout();
        navigate('/login');
    };
    return (
        <aside 
            className={`flex flex-col h-screen sticky top-0 z-20 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border-r border-slate-200/50 dark:border-slate-800/50 transition-all duration-300 ease-in-out ${collapsed ? 'w-16':'w-64'}`}>
                <div className={`flex items-center h-16 px-4 border-b border-slate-200/50 dark:border-slate-800/50 ${collapsed ? 'justify-center' : 'justify-between'}`}>
                    {!collapsed && (
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-while font-bold text-sm shadow-lg">
                                T
                            </div>
                            <span className="font-bold text-slate-900 dark:text-white text-sm tracking-tight">Task Flow</span>
                            </div>
                    )}
                    <button onClick={() => setCollapsed(!collapsed)}
                    className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                        {collapsed ? <ChevronRight size={16}></ChevronRight>:<ChevronLeft size={16}></ChevronLeft>}
                    </button>
                </div>
                <div className={`flex items-center gap-3 p-4 border-b border-slate-200/50 dark:border-slate-800/50 ${collapsed ? 'justify-center' : ''}`}>
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg flex-shrink-0">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        {!collapsed && (
          <div className="flex flex-col overflow-hidden">
            <span className=" font-semibold text-slate-900 dark:text-white text-sm truncate">{user?.name}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">Pro Workspace</span>
          </div>
        )}
      </div>

      {/* Nav Items */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map(({ label, icon: Icon, path }) => {
          const active = location.pathname === path;
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              title={collapsed ? label : undefined}
              className={`
                w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-colors
                ${collapsed ? 'justify-center' : ''}
                ${active
                  ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50'}
              `}
            >
              <Icon size={18} className="flex-shrink-0" />
              {!collapsed && label}
            </button>
          );
        })}
      </nav>

      {/* Bottom: Logout */}
      <div className="p-3 border-t border-slate-200/50 dark:border-slate-800/50 space-y-1 overflow-y-auto">
      <button
          onClick={()=>navigate('/settings')}
          title={collapsed ? 'Settings' : undefined}
          className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors ${collapsed ? 'justify-center' : 'justify-start'}`}
        >
          <Settings size={20} className="flex-shrink-0" />
          {!collapsed && <span>Settings</span>}
        </button>
        <button
          onClick={handleLogout}
          title={collapsed ? 'Logout' : undefined}
          className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors ${collapsed ? 'justify-center' : 'justify-start'}`}
        >
          <LogOut size={20} className="flex-shrink-0" />
          {!collapsed && 'Logout'}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;