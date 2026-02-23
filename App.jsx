import React, { useState, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Columns, 
  Calendar as CalendarIcon, 
  BarChart3, 
  Users, 
  LogOut, 
  Plus, 
  Moon, 
  Sun, 
  Activity, 
  ArrowUpRight, 
  Command, 
  Layers, 
  Zap, 
  Sparkles,
  Box,
  Cpu,
  Code,
  Shield,
  ArrowRight,
  ChevronRight,
  Globe,
  CreditCard,
  Check,
  Search,
  Filter,
  MoreVertical,
  Clock,
  AlertCircle,
  Mail,
  MessageSquare,
  Hash,
  Terminal,
  Github,
  Twitter,
  ExternalLink,
  Heart
} from 'lucide-react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';

/** * ==========================================
 * PHYSICS & ANIMATION CONSTANTS
 * ========================================== */

const smoothSpring = { type: "spring", stiffness: 350, damping: 35 };
const heavySpring = { type: "spring", stiffness: 120, damping: 22, mass: 1.2 };
const fluidTransition = { duration: 0.6, ease: [0.22, 1, 0.36, 1] };

const useAppStore = () => {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState('light');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentRoute, setCurrentRoute] = useState('landing');
  const [isLoading, setIsLoading] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionOrigin, setTransitionOrigin] = useState({ x: 0, y: 0 });

  // STRICT ROUTE PROTECTION
  useEffect(() => {
    const internalRoutes = ['dashboard', 'tasks', 'boards', 'calendar', 'analytics', 'team'];
    if (internalRoutes.includes(currentRoute) && !user) {
      setCurrentRoute('login');
    }
  }, [currentRoute, user]);

  const login = (email) => {
    setIsLoading(true);
    setTimeout(() => {
      setUser({ id: 'u1', name: 'Naman Aggarwal', email, avatar: 'NA' });
      setCurrentRoute('dashboard');
      setIsLoading(false);
    }, 1000);
  };

  const logout = () => {
    setUser(null);
    setCurrentRoute('landing');
  };

  const toggleTheme = (e) => {
    const x = e?.clientX || window.innerWidth / 2;
    const y = e?.clientY || window.innerHeight / 2;
    setTransitionOrigin({ x, y });
    setIsTransitioning(true);
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
    setTimeout(() => setIsTransitioning(false), 900);
  };

  const enterCore = () => {
    if (user) setCurrentRoute('dashboard');
    else setCurrentRoute('login');
  };

  return { 
    user, theme, toggleTheme, isSidebarOpen, setIsSidebarOpen, 
    currentRoute, setCurrentRoute, login, logout, isLoading,
    isTransitioning, transitionOrigin, enterCore
  };
};

/** * ==========================================
 * SHARED UI COMPONENTS
 * ========================================== */

const MagneticButton = ({ children, variant = 'primary', className = '', ...props }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const ref = useRef(null);

  const handleMouse = (e) => {
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = clientX - (left + width / 2);
    const y = clientY - (top + height / 2);
    setPosition({ x: x * 0.12, y: y * 0.12 });
  };

  const reset = () => setPosition({ x: 0, y: 0 });

  const variants = {
    primary: "bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-2xl shadow-slate-950/20",
    secondary: "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-transparent hover:border-slate-200 dark:hover:border-slate-700",
    ghost: "hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-500",
  };

  return (
    <motion.button 
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x: position.x, y: position.y }}
      whileTap={{ scale: 0.96 }}
      transition={smoothSpring}
      className={`px-8 py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-3 transition-colors ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};

const SmoothCard = ({ children, className = "", delay = 0 }) => (
  <motion.div 
    initial={{ opacity: 0, y: 40, scale: 0.98 }}
    whileInView={{ opacity: 1, y: 0, scale: 1 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ ...heavySpring, delay }}
    className={`
      relative overflow-hidden
      bg-white/80 dark:bg-slate-900/80 backdrop-blur-3xl
      border border-slate-200/50 dark:border-slate-800/50 rounded-[32px] 
      hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] dark:hover:shadow-black/60
      transition-all duration-700
      ${className}
    `}
  >
    {children}
  </motion.div>
);

const Badge = ({ children, color = "slate" }) => {
  const colors = {
    slate: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
    indigo: "bg-indigo-100 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400",
    emerald: "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
    amber: "bg-amber-100 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
    rose: "bg-rose-100 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400",
  };
  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${colors[color]}`}>
      {children}
    </span>
  );
};

/** * ==========================================
 * INTERNAL DASHBOARD VIEWS (Work Area)
 * ========================================== */

const TeamView = () => {
  const members = [
    { name: "Naman Aggarwal", role: "Chief Architect", status: "Active", email: "naman@syncro.io", color: "bg-indigo-600" },
    { name: "Sarah Chen", role: "Cluster Architect", status: "Active", email: "s.chen@syncro.io", color: "bg-indigo-500" },
    { name: "Marcus Thorne", role: "Protocol Engineer", status: "Away", email: "m.thorne@syncro.io", color: "bg-emerald-500" },
    { name: "Elena Rodriguez", role: "Interface Lead", status: "Active", email: "e.rod@syncro.io", color: "bg-amber-500" },
    { name: "David Kim", role: "Security Auditor", status: "Offline", email: "d.kim@syncro.io", color: "bg-rose-500" },
  ];

  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-5xl font-black tracking-tighter">Team</h2>
          <p className="text-slate-400 font-bold mt-2">Node contributors and cluster maintainers</p>
        </div>
        <MagneticButton className="h-14 px-8"><Users size={18} /> Invite Colleague</MagneticButton>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {members.map((member, i) => (
          <SmoothCard key={member.name} className="p-8 group" delay={i * 0.05}>
            <div className="flex items-center gap-6">
              <div className={`w-20 h-20 rounded-[28px] ${member.color} flex items-center justify-center text-white font-black text-2xl shadow-xl group-hover:scale-110 transition-transform duration-500`}>
                {member.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h4 className="text-2xl font-black">{member.name}</h4>
                  <div className={`w-2 h-2 rounded-full ${member.status === 'Active' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-slate-300'}`} />
                </div>
                <p className="text-slate-400 font-bold text-sm mb-4">{member.role}</p>
                <div className="flex gap-4">
                  <button className="text-slate-400 hover:text-indigo-500 transition-colors"><Mail size={18} /></button>
                  <button className="text-slate-400 hover:text-indigo-500 transition-colors"><MessageSquare size={18} /></button>
                </div>
              </div>
              <div className="text-right">
                <Badge color={member.status === 'Active' ? 'emerald' : member.status === 'Away' ? 'amber' : 'slate'}>{member.status}</Badge>
                <p className="text-[10px] font-black uppercase text-slate-300 mt-4 tracking-widest">{member.email}</p>
              </div>
            </div>
          </SmoothCard>
        ))}
      </div>
    </div>
  );
};

const DashboardOverview = () => (
  <motion.div 
    initial="hidden" animate="show"
    variants={{ show: { transition: { staggerChildren: 0.1 } } }}
    className="max-w-7xl mx-auto space-y-12"
  >
    <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }} className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
      <div>
        <h1 className="text-6xl font-black tracking-tighter">Workspace</h1>
        <p className="text-slate-400 font-bold mt-2 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          Node Cluster: Alpha-7 Stable
        </p>
      </div>
      <div className="flex gap-4">
        <MagneticButton variant="secondary" className="h-16 px-6 rounded-2xl">Manage Fleet</MagneticButton>
        <MagneticButton className="h-16 px-10 rounded-2xl"><Plus /> New Project</MagneticButton>
      </div>
    </motion.div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {[
        { label: 'Throughput', value: '98.2%', icon: Activity },
        { label: 'Cloud Load', value: '14.5k', icon: Layers },
        { label: 'Sync Delay', value: '12ms', icon: Zap },
      ].map((stat, i) => (
        <SmoothCard key={stat.label} className="p-10" delay={i * 0.1}>
          <div className="w-12 h-12 bg-slate-950 dark:bg-white text-white dark:text-slate-950 rounded-xl flex items-center justify-center mb-8">
            <stat.icon size={22} />
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">{stat.label}</p>
          <div className="text-4xl font-black">{stat.value}</div>
        </SmoothCard>
      ))}
    </div>

    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      <SmoothCard className="xl:col-span-2 p-10">
        <div className="flex items-center justify-between mb-10">
          <h4 className="text-2xl font-black">Active Clusters</h4>
          <button className="text-xs font-black uppercase tracking-widest text-indigo-500">View All</button>
        </div>
        <div className="space-y-6">
          {[
            { name: "Primary Relay", status: "Operational", load: "24%", id: "rel_01" },
            { name: "Asset CDN", status: "Operational", load: "68%", id: "cdn_x4" },
            { name: "Auth Guard", status: "Degraded", load: "12%", id: "shd_99" },
          ].map((cluster, i) => (
            <div key={cluster.id} className="flex items-center justify-between p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/50 border border-transparent hover:border-slate-100 dark:hover:border-slate-800 transition-all">
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm">
                  <Terminal size={18} className="text-slate-400" />
                </div>
                <div>
                  <h6 className="font-bold text-lg">{cluster.name}</h6>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{cluster.id}</p>
                </div>
              </div>
              <div className="flex items-center gap-8">
                <div className="text-right">
                  <p className="text-sm font-bold">{cluster.load}</p>
                  <div className="w-24 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-indigo-500" style={{ width: cluster.load }} />
                  </div>
                </div>
                <Badge color={cluster.status === 'Operational' ? 'emerald' : 'rose'}>{cluster.status}</Badge>
              </div>
            </div>
          ))}
        </div>
      </SmoothCard>

      <SmoothCard className="p-10">
        <h4 className="text-2xl font-black mb-8">System Pulse</h4>
        <div className="space-y-6">
          {[
            { event: "Node Alpha Re-indexed", time: "2m ago", type: "system" },
            { event: "New Deployment: v2.4.1", time: "14m ago", type: "deploy" },
            { event: "Security Audit Clear", time: "1h ago", type: "security" },
            { event: "Traffic Spike (Asia-Pac)", time: "2h ago", type: "alert" },
            { event: "Primary Relay Warm-up", time: "4h ago", type: "system" },
          ].map((ev, i) => (
            <div key={i} className="flex items-start gap-4">
              <div className="w-2 h-2 rounded-full bg-slate-300 mt-2 flex-shrink-0" />
              <div>
                <p className="text-sm font-bold leading-tight">{ev.event}</p>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{ev.time}</p>
              </div>
            </div>
          ))}
        </div>
        <MagneticButton variant="secondary" className="w-full mt-10 h-14 rounded-2xl">Full Audit Logs</MagneticButton>
      </SmoothCard>
    </div>
  </motion.div>
);

const TasksView = () => (
  <div className="space-y-12">
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-5xl font-black tracking-tighter">Worklist</h2>
        <p className="text-slate-400 font-bold mt-2">Active backlog across all node clusters</p>
      </div>
      <div className="flex gap-4">
        <div className="h-14 px-4 bg-slate-100 dark:bg-slate-900 rounded-2xl flex items-center gap-3 border border-transparent focus-within:border-slate-200 dark:focus-within:border-slate-800 transition-all">
          <Search size={18} className="text-slate-400" />
          <input className="bg-transparent border-none outline-none font-bold text-sm w-64" placeholder="Filter tasks..." />
        </div>
        <MagneticButton className="h-14 px-8"><Plus size={18} /> New Entry</MagneticButton>
      </div>
    </div>

    <div className="space-y-4">
      {[
        { title: "Cluster Alpha Migration", priority: "High", status: "In Progress", date: "Today", tag: "indigo" },
        { title: "Re-index Node Logs", priority: "Low", status: "Backlog", date: "Tomorrow", tag: "slate" },
        { title: "Global CDN Flush", priority: "Urgent", status: "Blocked", date: "Today", tag: "amber" },
        { title: "UI Engine Refactor", priority: "High", status: "Review", date: "Friday", tag: "emerald" },
      ].map((task, i) => (
        <SmoothCard key={task.title} className="p-6 group hover:translate-x-1" delay={i * 0.05}>
          <div className="flex items-center gap-6">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:bg-slate-950 dark:group-hover:bg-white group-hover:text-white dark:group-hover:text-slate-950 transition-all`}>
              <CheckSquare size={22} />
            </div>
            <div className="flex-1">
              <h4 className="text-xl font-bold">{task.title}</h4>
              <div className="flex items-center gap-4 mt-1">
                <span className="text-xs font-bold text-slate-400 flex items-center gap-1"><Clock size={12} /> {task.date}</span>
                <span className="text-xs font-bold text-slate-400 flex items-center gap-1"><AlertCircle size={12} /> {task.priority}</span>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <Badge color={task.tag}>{task.status}</Badge>
              <button className="text-slate-200 hover:text-slate-950 dark:hover:text-white transition-colors"><MoreVertical size={20} /></button>
            </div>
          </div>
        </SmoothCard>
      ))}
    </div>
  </div>
);

const BoardsView = () => (
  <div className="space-y-12">
    <div className="flex items-center justify-between">
      <h2 className="text-5xl font-black tracking-tighter">Projects</h2>
      <div className="flex -space-x-3">
        {['NA', 'SC', 'MT', 'ER'].map((init, i) => (
          <div key={i} className={`w-12 h-12 rounded-full border-4 border-white dark:border-slate-950 ${i === 0 ? 'bg-indigo-600' : 'bg-slate-400'} text-white overflow-hidden flex items-center justify-center font-black text-xs shadow-lg`}>{init}</div>
        ))}
        <button className="w-12 h-12 rounded-full border-4 border-white dark:border-slate-950 bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-400 hover:text-slate-950 dark:hover:text-white transition-colors"><Plus size={18} /></button>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 h-[calc(100vh-320px)]">
      {[
        { name: "To Do", count: 4, tasks: ["Auth Redesign", "Payment API", "Style Guide"] },
        { name: "In Progress", count: 2, tasks: ["State Engine", "Fluid Motion"] },
        { name: "Completed", count: 12, tasks: ["Initial Seed", "Beta Launch"] }
      ].map((col, i) => (
        <div key={col.name} className="flex flex-col gap-6">
          <div className="flex items-center justify-between px-2">
            <h4 className="font-black text-xs uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-slate-300' : i === 1 ? 'bg-indigo-500' : 'bg-emerald-500'}`} />
              {col.name} <span className="opacity-50">({col.count})</span>
            </h4>
            <Plus size={16} className="text-slate-300" />
          </div>
          <div className="flex-1 space-y-4 bg-slate-50/50 dark:bg-slate-900/30 rounded-[32px] p-4 border border-dashed border-slate-200 dark:border-slate-800 overflow-y-auto custom-scrollbar">
            {col.tasks.map((task, j) => (
              <SmoothCard key={task} className="p-6 cursor-grab active:cursor-grabbing hover:translate-y-[-4px]" delay={(i * 0.1) + (j * 0.05)}>
                <h5 className="font-bold text-lg mb-4">{task}</h5>
                <div className="flex items-center justify-between mt-auto">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-indigo-500" />
                    <div className="w-2 h-2 rounded-full bg-indigo-300" />
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <MessageSquare size={12} />
                    <span className="text-[10px] font-black">2</span>
                  </div>
                </div>
              </SmoothCard>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

const AnalyticsView = () => (
  <div className="space-y-12">
    <h2 className="text-5xl font-black tracking-tighter">Insights</h2>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
      <SmoothCard className="p-10 col-span-1 md:col-span-2">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h4 className="text-2xl font-black">Sync Throughput</h4>
            <p className="text-slate-400 text-sm font-bold">Packets processed per second (ms)</p>
          </div>
          <div className="flex gap-2">
            <Badge color="emerald">Stable</Badge>
            <Badge color="slate">60fps</Badge>
          </div>
        </div>
        
        {/* Mock Chart */}
        <div className="h-64 flex items-end gap-3 px-4">
          {[40, 60, 45, 90, 65, 80, 55, 100, 85, 70, 95, 60].map((h, i) => (
            <motion.div 
              key={i}
              initial={{ height: 0 }}
              animate={{ height: `${h}%` }}
              transition={{ delay: i * 0.05, ...heavySpring }}
              className="flex-1 bg-gradient-to-t from-indigo-500/20 to-indigo-500 rounded-t-xl"
            />
          ))}
        </div>
        <div className="flex justify-between mt-8 px-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
          <span>00:00</span>
          <span>06:00</span>
          <span>12:00</span>
          <span>18:00</span>
          <span>23:59</span>
        </div>
      </SmoothCard>

      <SmoothCard className="p-10">
        <h4 className="text-2xl font-black mb-8">Node Distribution</h4>
        <div className="space-y-8">
          {[
            { region: "North America", load: "74%", color: "bg-indigo-500" },
            { region: "Europe", load: "42%", color: "bg-emerald-500" },
            { region: "Asia Pacific", load: "91%", color: "bg-amber-500" },
          ].map(node => (
            <div key={node.region}>
              <div className="flex justify-between text-sm font-bold mb-3">
                <span>{node.region}</span>
                <span className="text-slate-400">{node.load}</span>
              </div>
              <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: node.load }} transition={{ duration: 1.5, ease: "easeOut" }} className={`h-full ${node.color}`} />
              </div>
            </div>
          ))}
        </div>
      </SmoothCard>

      <SmoothCard className="p-10 flex flex-col items-center justify-center text-center">
        <div className="w-24 h-24 rounded-full border-8 border-slate-100 dark:border-slate-800 flex items-center justify-center mb-6">
          <Activity size={32} className="text-emerald-500" />
        </div>
        <h4 className="text-2xl font-black">System Uptime</h4>
        <p className="text-4xl font-black mt-2">99.998%</p>
        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-4">Last reset: 142 days ago</p>
      </SmoothCard>
    </div>
  </div>
);

/** * ==========================================
 * NAVIGATION & CREDIT COMPONENTS
 * ========================================== */

const FinalCreditFooter = () => (
  <footer className="pt-40 pb-20 border-t border-slate-100 dark:border-slate-900 mt-20">
    <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
      <div className="w-16 h-16 bg-slate-950 dark:bg-white rounded-[24px] flex items-center justify-center mb-8 shadow-2xl">
        <Command size={28} className="text-white dark:text-slate-950" />
      </div>
      <p className="text-[11px] font-black uppercase tracking-[0.5em] text-slate-400 mb-4">Architected & Engineered By</p>
      <h3 className="text-5xl font-black tracking-tighter mb-10">Naman Aggarwal</h3>
      <div className="flex gap-4 mb-20">
        {[Github, Twitter, Mail, ExternalLink].map((Icon, i) => (
          <button key={i} className="w-14 h-14 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-center text-slate-400 hover:text-slate-950 dark:hover:text-white hover:border-slate-950 dark:hover:border-white transition-all group">
            <Icon size={20} className="group-hover:scale-110 transition-transform" />
          </button>
        ))}
      </div>
      <div className="flex flex-col md:flex-row items-center gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">
        <span>© 2024 Syncro Systems</span>
        <div className="hidden md:block w-1.5 h-1.5 rounded-full bg-slate-200" />
        <span className="flex items-center gap-2">Made with <Heart size={10} className="text-rose-500 fill-rose-500" /> by the N.A. Lab</span>
        <div className="hidden md:block w-1.5 h-1.5 rounded-full bg-slate-200" />
        <span>V2.5.0 Final</span>
      </div>
    </div>
  </footer>
);

const Sidebar = ({ store }) => {
  const menu = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'tasks', label: 'Worklist', icon: CheckSquare },
    { id: 'boards', label: 'Projects', icon: Columns },
    { id: 'calendar', label: 'Schedule', icon: CalendarIcon },
    { id: 'analytics', label: 'Insights', icon: BarChart3 },
    { id: 'team', label: 'Team', icon: Users },
  ];

  return (
    <motion.aside 
      layout
      className={`h-screen border-r border-slate-100 dark:border-slate-900 bg-white dark:bg-slate-950 flex flex-col relative z-50 ${store.isSidebarOpen ? 'w-80' : 'w-24'}`}
      transition={heavySpring}
    >
      <div className="p-10 h-28 flex items-center gap-4">
        <div 
          className="w-12 h-12 bg-slate-950 dark:bg-white rounded-2xl flex-shrink-0 flex items-center justify-center shadow-xl cursor-pointer"
          onClick={() => store.setCurrentRoute('landing')}
        >
          <Command size={24} className="text-white dark:text-slate-950" />
        </div>
        {store.isSidebarOpen && (
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-black text-2xl tracking-tighter">Syncro</motion.span>
        )}
      </div>
      
      <nav className="flex-1 px-6 space-y-2 pt-12">
        {menu.map(item => (
          <button 
            key={item.id} 
            onClick={() => store.setCurrentRoute(item.id)}
            className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all relative group ${store.currentRoute === item.id ? 'text-slate-950 dark:text-white' : 'text-slate-400 hover:text-slate-600'}`}
          >
            {store.currentRoute === item.id && (
              <motion.div layoutId="sidebar-active" className="absolute inset-0 bg-slate-100 dark:bg-slate-900 rounded-2xl -z-10" transition={smoothSpring} />
            )}
            <item.icon size={22} className="transition-transform group-hover:scale-110" />
            {store.isSidebarOpen && <span className="text-sm font-bold">{item.label}</span>}
          </button>
        ))}
      </nav>

      <div className="p-8">
        <button onClick={store.logout} className="w-full flex items-center gap-4 px-5 py-3 text-slate-400 hover:text-rose-500 transition-colors">
          <LogOut size={22} />
          {store.isSidebarOpen && <span className="text-sm font-bold">Sign Out</span>}
        </button>
      </div>
    </motion.aside>
  );
};

const Nav = ({ store }) => (
  <nav className="fixed top-8 w-full z-[80] px-6 pointer-events-none">
    <motion.div 
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={heavySpring}
      className="max-w-4xl mx-auto h-20 px-6 flex items-center justify-between bg-white/60 dark:bg-slate-950/60 backdrop-blur-3xl rounded-full border border-white/20 dark:border-white/5 shadow-2xl pointer-events-auto"
    >
      <div className="flex items-center gap-10">
        <motion.div 
          whileHover={{ rotate: 180 }} 
          transition={{ duration: 0.6, ease: "circOut" }}
          className="w-10 h-10 bg-slate-950 dark:bg-white rounded-xl flex items-center justify-center cursor-pointer"
          onClick={() => store.setCurrentRoute('landing')}
        >
          <Command size={20} className="text-white dark:text-slate-950" />
        </motion.div>
        
        <div className="hidden md:flex items-center gap-8 relative">
          {['About', 'Pricing', 'Documentation'].map(link => {
            const id = link.toLowerCase();
            const isActive = store.currentRoute === id;
            return (
              <button 
                key={link} 
                onClick={() => store.setCurrentRoute(id)} 
                className={`relative text-[11px] font-black uppercase tracking-widest transition-colors duration-500 ${isActive ? 'text-slate-950 dark:text-white' : 'text-slate-400 hover:text-slate-600'}`}
              >
                {link}
                {isActive && (
                  <motion.div layoutId="nav-pill" className="absolute -inset-x-4 -inset-y-2 bg-slate-100 dark:bg-slate-800 rounded-full -z-10" transition={smoothSpring} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button onClick={(e) => store.toggleTheme(e)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors">
          <AnimatePresence mode="wait">
            <motion.div key={store.theme} initial={{ rotate: -90, opacity: 0, scale: 0.5 }} animate={{ rotate: 0, opacity: 1, scale: 1 }} exit={{ rotate: 90, opacity: 0, scale: 0.5 }} transition={{ duration: 0.3 }}>
              {store.theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </motion.div>
          </AnimatePresence>
        </button>
        <div className="w-px h-6 bg-slate-200 dark:bg-slate-800 mx-2" />
        <MagneticButton onClick={() => store.setCurrentRoute(store.user ? 'dashboard' : 'login')} className="h-12 px-8 rounded-full text-[11px] uppercase tracking-widest">
          {store.user ? 'Dashboard' : 'Launch'}
        </MagneticButton>
      </div>
    </motion.div>
  </nav>
);

const AboutPage = () => (
  <div className="min-h-screen pt-64 pb-40 px-10">
    <div className="max-w-5xl mx-auto">
      <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-8xl font-black tracking-tighter mb-12">The Future is <span className="text-slate-400">Fluid.</span></motion.h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
        <div>
          <p className="text-2xl text-slate-500 leading-relaxed font-medium mb-10">
            Syncro was founded on the principle that digital tools should behave like physical matter. We build interfaces with mass, momentum, and friction.
          </p>
          <div className="p-8 bg-slate-100 dark:bg-slate-900 rounded-[32px]">
            <p className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4">Lead Architect</p>
            <h4 className="text-3xl font-black tracking-tighter mb-2">Naman Aggarwal</h4>
            <p className="text-slate-500 font-bold">Directing the future of human-machine synchronization and edge cluster topology.</p>
          </div>
        </div>
        <div className="space-y-12">
           <div className="flex gap-8">
              <div className="w-16 h-16 bg-indigo-500/10 text-indigo-500 rounded-[24px] flex items-center justify-center flex-shrink-0"><Globe size={32} /></div>
              <div>
                <h4 className="font-bold text-2xl mb-2">Global Edge</h4>
                <p className="text-slate-400 leading-relaxed">Distributed infrastructure for zero-latency state management across every continent.</p>
              </div>
           </div>
           <div className="flex gap-8">
              <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-[24px] flex items-center justify-center flex-shrink-0"><Zap size={32} /></div>
              <div>
                <h4 className="font-bold text-2xl mb-2">Pulse Engine</h4>
                <p className="text-slate-400 leading-relaxed">Our proprietary real-time sync engine designed to handle 2 million concurrent events.</p>
              </div>
           </div>
        </div>
      </div>
    </div>
    <FinalCreditFooter />
  </div>
);

const PricingPage = () => (
  <div className="min-h-screen pt-64 pb-40 px-10">
    <div className="max-w-7xl mx-auto text-center mb-20">
      <h2 className="text-7xl font-black tracking-tighter mb-6">Simple, <span className="text-slate-400">Scalable.</span></h2>
      <p className="text-xl text-slate-500">Choose the tier that fits your throughput requirements.</p>
    </div>
    <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
      {[
        { name: "Starter", price: "0", features: ["1 Cluster", "10GB Storage", "Community Support"] },
        { name: "Pro", price: "49", features: ["10 Clusters", "1TB Storage", "24/7 Priority Support", "Custom Domains"], popular: true },
        { name: "Enterprise", price: "Custom", features: ["Unlimited Clusters", "Unmetered Storage", "SLA Guarantee", "Dedicated Node"] }
      ].map((plan, i) => (
        <SmoothCard key={plan.name} className={`p-12 flex flex-col ${plan.popular ? 'ring-2 ring-indigo-500/30 shadow-2xl shadow-indigo-500/10' : ''}`} delay={i * 0.1}>
          {plan.popular && <div className="absolute top-6 right-8"><Badge color="indigo">Popular</Badge></div>}
          <div className="mb-10">
            <h4 className="text-2xl font-black mb-2">{plan.name}</h4>
            <div className="flex items-baseline gap-1">
              <span className="text-5xl font-black">${plan.price}</span>
              {plan.price !== "Custom" && <span className="text-slate-400 text-sm font-bold">/mo</span>}
            </div>
          </div>
          <div className="flex-1 space-y-5 mb-12">
            {plan.features.map(f => (
              <div key={f} className="flex items-center gap-3 text-sm font-bold text-slate-500">
                <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500"><Check size={12} /></div> {f}
              </div>
            ))}
          </div>
          <MagneticButton variant={plan.popular ? "primary" : "secondary"} className="w-full h-16 text-md">Get Started</MagneticButton>
        </SmoothCard>
      ))}
    </div>
    <FinalCreditFooter />
  </div>
);

const DocumentationPage = ({ store }) => {
  const [activeTab, setActiveTab] = useState('getting-started');
  const sections = [
    { id: 'getting-started', label: 'Getting Started', icon: Sparkles },
    { id: 'architecture', label: 'Architecture', icon: Cpu },
    { id: 'api', label: 'API Reference', icon: Code },
    { id: 'security', label: 'Security', icon: Shield },
  ];

  return (
    <div className="min-h-screen pt-40 pb-40 px-10">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-20">
        <div className="lg:w-64 flex-shrink-0">
          <div className="sticky top-40 space-y-2">
            {sections.map(section => (
              <button
                key={section.id}
                onClick={() => setActiveTab(section.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all relative group ${activeTab === section.id ? 'text-slate-950 dark:text-white' : 'text-slate-400 hover:text-slate-600'}`}
              >
                {activeTab === section.id && (
                  <motion.div layoutId="doc-active" className="absolute inset-0 bg-slate-100 dark:bg-slate-900 rounded-xl -z-10" />
                )}
                <section.icon size={18} />
                <span className="text-sm font-bold">{section.label}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="flex-1 max-w-3xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={fluidTransition}
            >
              <h2 className="text-5xl font-black tracking-tighter mb-8 capitalize">{activeTab.replace('-', ' ')}</h2>
              <p className="text-xl text-slate-500 leading-relaxed mb-10">
                Syncro's core engine is built on high-throughput node clusters designed for instantaneous reactivity.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <SmoothCard className="p-10" delay={0.1}>
                    <h4 className="font-bold text-xl mb-2">Cloud Edge</h4>
                    <p className="text-slate-400 text-sm">Deploy local clusters to 40+ global regions.</p>
                 </SmoothCard>
                 <SmoothCard className="p-10" delay={0.2}>
                    <h4 className="font-bold text-xl mb-2">Sync Relay</h4>
                    <p className="text-slate-400 text-sm">Real-time state synchronization via WebSocket Pro.</p>
                 </SmoothCard>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      <FinalCreditFooter />
    </div>
  );
};

/** * ==========================================
 * MAIN APP
 * ========================================== */

export default function App() {
  const store = useAppStore();
  
  // Routes categorized as public and internal
  const isPublic = ['landing', 'documentation', 'login', 'about', 'pricing'].includes(store.currentRoute);

  return (
    <div className={`h-full font-sans antialiased overflow-x-hidden ${store.theme === 'dark' ? 'dark' : ''}`}>
      <div className="bg-white dark:bg-slate-950 text-slate-950 dark:text-white min-h-screen relative transition-colors duration-1000">
        
        {/* THEME TRANSITION LAYER */}
        <AnimatePresence>
          {store.isTransitioning && (
            <motion.div
              initial={{ clipPath: `circle(0% at ${store.transitionOrigin.x}px ${store.transitionOrigin.y}px)` }}
              animate={{ clipPath: `circle(150% at ${store.transitionOrigin.x}px ${store.transitionOrigin.y}px)` }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.85, ease: [0.65, 0, 0.35, 1] }}
              className="fixed inset-0 z-[100] pointer-events-none bg-white dark:bg-slate-950"
            />
          )}
        </AnimatePresence>

        <div className="relative z-10">
          <AnimatePresence mode="wait">
            
            {/* PUBLIC TERRITORY */}
            {isPublic && (
              <motion.div key="public-territory" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Nav store={store} />
                
                {store.currentRoute === 'landing' && (
                  <motion.div key="landing" exit={{ y: -20, opacity: 0 }} transition={fluidTransition} className="relative pt-64 pb-20 px-10">
                    <div className="max-w-5xl mx-auto text-center">
                      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={heavySpring} className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-slate-100 dark:bg-slate-900 text-[11px] font-black uppercase tracking-[0.3em] mb-12">
                        <Sparkles size={14} className="text-indigo-500" /> Intelligence Suite
                      </motion.div>
                      <motion.h1 initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ ...heavySpring, delay: 0.2 }} className="text-7xl md:text-9xl font-black tracking-tighter leading-[0.85] mb-16">
                        Fluid Motion.<br /><span className="text-slate-400">Total Logic.</span>
                      </motion.h1>
                      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ ...heavySpring, delay: 0.4 }} className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <MagneticButton onClick={store.enterCore} className="h-24 px-16 rounded-[32px] text-xl group">
                          {store.user ? 'Go to Dashboard' : 'Enter Core'} 
                          <ArrowRight className="group-hover:translate-x-2 transition-transform duration-500" />
                        </MagneticButton>
                        <MagneticButton onClick={() => store.setCurrentRoute('about')} variant="secondary" className="h-24 px-16 rounded-[32px] text-xl">About</MagneticButton>
                      </motion.div>
                    </div>
                    <FinalCreditFooter />
                  </motion.div>
                )}

                {store.currentRoute === 'about' && <AboutPage />}
                {store.currentRoute === 'pricing' && <PricingPage />}
                {store.currentRoute === 'documentation' && <DocumentationPage store={store} />}

                {store.currentRoute === 'login' && (
                  <div className="min-h-screen flex items-center justify-center p-8">
                    <SmoothCard className="max-w-md w-full p-12">
                      <div className="text-center mb-10">
                        <Command size={48} className="mx-auto mb-6" />
                        <h2 className="text-3xl font-black tracking-tighter">Verification</h2>
                        <p className="text-slate-400 font-bold text-sm mt-2">Access the node cluster network</p>
                      </div>
                      <div className="space-y-4">
                        <input className="w-full h-14 bg-slate-100 dark:bg-slate-900 border border-transparent focus:border-indigo-500/50 rounded-2xl px-5 font-bold outline-none transition-all" placeholder="Identity (Email)" defaultValue="naman@syncro.io" />
                        <input className="w-full h-14 bg-slate-100 dark:bg-slate-900 border border-transparent focus:border-indigo-500/50 rounded-2xl px-5 font-bold outline-none transition-all" type="password" placeholder="Passkey" defaultValue="********" />
                        <MagneticButton className="w-full h-16 mt-4" onClick={() => store.login('naman@syncro.io')}>Bypass Interface</MagneticButton>
                        <button onClick={() => store.setCurrentRoute('landing')} className="w-full text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-950 dark:hover:text-white mt-8 transition-colors">Abort Protocol</button>
                      </div>
                    </SmoothCard>
                  </div>
                )}
              </motion.div>
            )}

            {/* INTERNAL PROTECTED WORKSPACE */}
            {!isPublic && store.user && (
              <motion.div key="internal-workspace" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex h-screen overflow-hidden">
                <Sidebar store={store} />
                <div className="flex-1 flex flex-col min-w-0">
                  <header className="h-28 px-16 flex items-center justify-between border-b border-slate-100 dark:border-slate-900 bg-white/40 dark:bg-slate-950/40 backdrop-blur-2xl relative z-40">
                    <button onClick={() => store.setIsSidebarOpen(!store.isSidebarOpen)} className="w-12 h-12 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl flex items-center justify-center transition-colors">
                      <Layers size={22} />
                    </button>
                    <div className="flex items-center gap-5">
                       <button onClick={(e) => store.toggleTheme(e)} className="w-12 h-12 flex items-center justify-center rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                         {store.theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                       </button>
                       <div className="w-px h-8 bg-slate-100 dark:bg-slate-800 mx-2" />
                       <div className="text-right hidden sm:block">
                          <p className="font-black leading-none">{store.user.name}</p>
                          <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest mt-1">Lead Architect</p>
                       </div>
                       <div className="w-14 h-14 bg-indigo-600 text-white flex items-center justify-center rounded-2xl font-black text-xl shadow-xl uppercase">{store.user.avatar}</div>
                    </div>
                  </header>
                  <main className="flex-1 overflow-y-auto p-16 custom-scrollbar relative z-30">
                     <AnimatePresence mode="wait">
                       <motion.div
                         key={store.currentRoute}
                         initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -30, opacity: 0 }}
                         transition={heavySpring}
                       >
                         {store.currentRoute === 'dashboard' && <DashboardOverview />}
                         {store.currentRoute === 'tasks' && <TasksView />}
                         {store.currentRoute === 'boards' && <BoardsView />}
                         {store.currentRoute === 'analytics' && <AnalyticsView />}
                         {store.currentRoute === 'team' && <TeamView />}
                         
                         {/* Fallback for undeveloped internal routes */}
                         {!['dashboard', 'tasks', 'boards', 'analytics', 'team'].includes(store.currentRoute) && (
                           <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                              <Box size={80} className="mb-6" />
                              <h3 className="text-3xl font-black">Node Fragment Under Construction</h3>
                              <p className="font-bold mt-2">This module is currently being synchronized with the main cluster.</p>
                           </div>
                         )}
                       </motion.div>
                     </AnimatePresence>
                  </main>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 20px; }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; }
        * { cursor: default; }
        button, a, input { cursor: pointer; }
      `}</style>
    </div>
  );
}
