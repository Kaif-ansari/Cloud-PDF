
import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { 
  History, 
  HardDrive, 
  TrendingUp, 
  Clock, 
  FileText, 
  ArrowRight,
  Shield,
  Download,
  Zap,
  LayoutDashboard
} from 'lucide-react';

const data = [
  { name: 'Mon', count: 12, storage: 45 },
  { name: 'Tue', count: 19, storage: 52 },
  { name: 'Wed', count: 15, storage: 48 },
  { name: 'Thu', count: 22, storage: 61 },
  { name: 'Fri', count: 30, storage: 82 },
  { name: 'Sat', count: 8, storage: 32 },
  { name: 'Sun', count: 5, storage: 21 },
];

const COLORS = ['#f43f5e', '#fb7185', '#f43f5e', '#e11d48', '#be123c', '#fda4af', '#fecdd3'];

const Dashboard: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
        <div>
          <div className="flex items-center gap-2 text-red-600 font-bold text-xs uppercase tracking-widest mb-3">
            <LayoutDashboard className="w-4 h-4" /> Personal Workbench
          </div>
          <h1 className="text-4xl font-[900] text-slate-900 mb-3 tracking-tight">System Analytics</h1>
          <p className="text-slate-500 font-medium">Monitor your document throughput and storage efficiency.</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="bg-white border border-slate-200 px-6 py-3 rounded-2xl flex items-center shadow-sm">
            <Shield className="w-5 h-5 text-amber-500 mr-3" />
            <div>
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-tighter">Current Plan</p>
              <p className="text-sm font-bold text-slate-900">Premium Professional</p>
            </div>
          </div>
          <button className="bg-red-600 text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-red-100 hover:bg-red-700 hover:-translate-y-1 transition-all">
            Upgrade Capacity
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        {[
          { icon: FileText, label: 'Files Processed', val: '124', color: 'bg-rose-50', text: 'text-rose-600', trend: '+12%' },
          { icon: HardDrive, label: 'Storage Saved', val: '1.2 GB', color: 'bg-blue-50', text: 'text-blue-600', trend: '72% Cap' },
          { icon: Clock, label: 'Time Saved', val: '4.2 Hrs', color: 'bg-amber-50', text: 'text-amber-600', trend: '+8%' },
          { icon: Zap, label: 'Worker Latency', val: '142ms', color: 'bg-emerald-50', text: 'text-emerald-600', trend: 'Optimal' },
        ].map((s, i) => (
          <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)] hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 group">
            <div className="flex items-center justify-between mb-6">
              <div className={`${s.color} p-4 rounded-2xl group-hover:scale-110 transition-transform`}>
                <s.icon className={`w-6 h-6 ${s.text}`} />
              </div>
              <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${s.color} ${s.text} uppercase tracking-widest`}>
                {s.trend}
              </span>
            </div>
            <div className="text-4xl font-black text-slate-900 mb-2">{s.val}</div>
            <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Activity Chart */}
        <div className="lg:col-span-2 bg-white rounded-[3rem] p-10 border border-slate-100 shadow-xl shadow-slate-200/40">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-2xl font-black text-slate-900 mb-1">Processing Volume</h3>
              <p className="text-sm text-slate-400 font-medium">Overview of task distribution over the week.</p>
            </div>
            <div className="flex bg-slate-100 p-1.5 rounded-xl">
              <button className="px-4 py-2 bg-white rounded-lg text-xs font-bold shadow-sm">Weekly</button>
              <button className="px-4 py-2 text-xs font-bold text-slate-500">Monthly</button>
            </div>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 'bold'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 'bold'}} dx={-10} />
                <Tooltip 
                  cursor={{stroke: '#f1f5f9', strokeWidth: 2}}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.1)', padding: '12px' }}
                />
                <Area type="monotone" dataKey="count" stroke="#f43f5e" strokeWidth={4} fillOpacity={1} fill="url(#colorCount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* History List */}
        <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-xl shadow-slate-200/40 flex flex-col">
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-2xl font-black text-slate-900">Task Stream</h3>
            <div className="p-2 bg-red-50 rounded-lg"><History className="w-5 h-5 text-red-600" /></div>
          </div>
          <div className="space-y-8 flex-grow overflow-y-auto pr-2 scrollbar-hide">
            {[
              { name: 'Contract_2024.pdf', tool: 'AI Analysis', time: '2m ago', color: 'bg-violet-500' },
              { name: 'User_Manual.pdf', tool: 'Compressed', time: '1h ago', color: 'bg-red-500' },
              { name: 'Q4_Results.pdf', tool: 'Merged', time: '3h ago', color: 'bg-blue-500' },
              { name: 'Invoices_Bundle.zip', tool: 'Split', time: 'Yesterday', color: 'bg-amber-500' },
              { name: 'Form_v1.pdf', tool: 'Watermark', time: 'Mar 12', color: 'bg-rose-500' }
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className={`w-1.5 h-1.5 rounded-full ${item.color} animate-pulse`}></div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 truncate max-w-[140px] group-hover:text-red-600 transition-colors">{item.name}</p>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{item.tool} • {item.time}</p>
                  </div>
                </div>
                <button className="p-3 bg-slate-50 group-hover:bg-red-50 rounded-xl text-slate-300 group-hover:text-red-600 transition-all">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          <button className="mt-12 w-full py-5 bg-slate-900 text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-slate-800 transition-all flex items-center justify-center group shadow-xl shadow-slate-200">
            Audit Full Logs
            <ArrowRight className="w-4 h-4 ml-3 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
