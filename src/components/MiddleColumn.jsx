import React, { useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Activity, Users } from 'lucide-react';

const COLORS = ['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444']; // Calm Palette

const MiddleColumn = () => {
  const { expenses, people } = useFinance();

  const stats = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    // Filter Current Month
    const currentExpenses = expenses.filter(e => {
        const d = new Date(e.date);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });

    // Filter Last Month
    const lastExpenses = expenses.filter(e => {
        const d = new Date(e.date);
        return d.getMonth() === lastMonth && d.getFullYear() === lastMonthYear;
    });

    const totalCurrent = currentExpenses.reduce((sum, e) => sum + e.amount, 0);
    const totalLast = lastExpenses.reduce((sum, e) => sum + e.amount, 0);
    const avgPerPerson = people.length > 0 ? totalCurrent / people.length : 0;

    // Trend Data (Last 6 Months)
    const trendData = [];
    for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthName = d.toLocaleString('tr-TR', { month: 'short' });
        const monthTotal = expenses
            .filter(e => {
                const exDate = new Date(e.date);
                return exDate.getMonth() === d.getMonth() && exDate.getFullYear() === d.getFullYear();
            })
            .reduce((sum, e) => sum + e.amount, 0);
        trendData.push({ name: monthName, amount: monthTotal });
    }

    // Category Data
    const catMap = {};
    currentExpenses.forEach(e => {
        catMap[e.category] = (catMap[e.category] || 0) + e.amount;
    });
    const pieData = Object.keys(catMap).map(key => ({ name: key, value: catMap[key] }));

    return { totalCurrent, totalLast, avgPerPerson, trendData, pieData };
  }, [expenses, people]);

  const diffPercent = stats.totalLast > 0 
    ? ((stats.totalCurrent - stats.totalLast) / stats.totalLast * 100).toFixed(1) 
    : 0;
  const isUp = stats.totalCurrent > stats.totalLast;

  return (
    <div className="space-y-8">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Card - Black Theme (Control) */}
        <div className="bg-slate-900 p-6 rounded-3xl card-shadow text-white relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10 blur-2xl group-hover:bg-white/10 transition-all"></div>
          <div className="flex items-start justify-between mb-8 relative z-10">
             <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
                <DollarSign className="w-6 h-6 text-white" />
             </div>
             {stats.totalLast > 0 && (
                <div className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full ${isUp ? 'bg-indigo-500/20 text-indigo-300' : 'bg-rose-500/20 text-rose-300'} border border-white/5`}>
                  {isUp ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                  {Math.abs(diffPercent)}%
                </div>
             )}
          </div>
          <div className="relative z-10">
            <span className="text-slate-400 text-sm font-medium tracking-wide">Bu Ay Toplam</span>
            <div className="text-3xl font-bold mt-2 tracking-tight">
              ₺{stats.totalCurrent.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
            </div>
          </div>
        </div>

        {/* Secondary Cards - Clean White */}
        <div className="bg-white p-6 rounded-3xl card-shadow flex flex-col justify-between group hover:shadow-lg transition-all duration-300 border border-slate-100/50">
          <div className="flex items-start justify-between mb-4">
             <div className="p-3 bg-indigo-50 text-indigo-500 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                <Activity className="w-6 h-6" />
             </div>
          </div>
          <div>
            <span className="text-slate-500 text-sm font-semibold">Geçen Ay</span>
            <div className="text-2xl font-bold text-slate-800 mt-2">
               ₺{stats.totalLast.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl card-shadow flex flex-col justify-between group hover:shadow-lg transition-all duration-300 border border-slate-100/50">
            <div className="flex items-start justify-between mb-4">
             <div className="p-3 bg-indigo-50 text-indigo-500 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                <Users className="w-6 h-6" />
             </div>
          </div>
          <div>
            <span className="text-slate-500 text-sm font-semibold">Kişi Başı Ort.</span>
            <div className="text-2xl font-bold text-slate-800 mt-2">
               ₺{stats.avgPerPerson.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 gap-8">
        {/* Trend Line Chart */}
         <div className="bg-white p-8 rounded-3xl card-shadow">
           <div className="mb-8 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-800">Harcama Analizi</h3>
                <p className="text-sm text-slate-400 font-medium mt-1">Aylık harcama trendi</p>
              </div>
           </div>
           <div className="h-[300px] w-full">
             <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={stats.trendData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                 <defs>
                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                 <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 500}} 
                    dy={10} 
                 />
                 <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 500}} 
                    tickFormatter={val => `₺${val}`} 
                 />
                 <Tooltip 
                    cursor={{ stroke: '#4f46e5', strokeWidth: 1, strokeDasharray: '4 4' }}
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.1)', padding: '12px 16px' }}
                    itemStyle={{ color: '#1e293b', fontWeight: 600 }}
                    formatter={(value) => [`₺${value.toLocaleString()}`, 'Tutar']}
                 />
                 <Area 
                    type="monotone" 
                    dataKey="amount" 
                    stroke="#4f46e5" 
                    strokeWidth={4}
                    fillOpacity={1} 
                    fill="url(#colorAmount)" 
                    animationDuration={1500}
                    activeDot={{ r: 6, strokeWidth: 0, fill: '#4f46e5' }}
                 />
               </AreaChart>
             </ResponsiveContainer>
           </div>
        </div>

        {/* Category Pie Chart */}
        <div className="bg-white p-8 rounded-3xl card-shadow">
          <div className="mb-6">
               <h3 className="text-lg font-bold text-slate-800">Kategoriler</h3>
               <p className="text-sm text-slate-400 font-medium mt-1">Harcama dağılımı</p>
          </div>
          <div className="h-[320px] w-full relative">
            {stats.pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                    data={stats.pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={120}
                    paddingAngle={4}
                    dataKey="value"
                    cornerRadius={6}
                    >
                    {stats.pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="transparent" />
                    ))}
                    </Pie>
                    <Tooltip 
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.1)', padding: '12px 16px' }}
                        itemStyle={{ color: '#1e293b', fontWeight: 600 }}
                        formatter={(value) => [`₺${value.toLocaleString()}`, '']}
                    />
                </PieChart>
                </ResponsiveContainer>
            ) : (
                <div className="absolute inset-0 flex items-center justify-center text-slate-300 font-medium">Veri Yok</div>
            )}
            
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
               <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-1 mx-auto">
                    <Activity className="w-6 h-6 text-slate-400" />
               </div>
            </div>
          </div>
          
          {stats.pieData.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-3 justify-center">
                  {stats.pieData.slice(0, 6).map((entry, index) => (
                      <div key={index} className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                          {entry.name}
                      </div>
                  ))}
              </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MiddleColumn;
