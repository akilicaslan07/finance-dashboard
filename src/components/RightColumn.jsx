import React, { useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { AlertTriangle, Zap } from 'lucide-react';

const RightColumn = () => {
    const { expenses, subscriptions, people } = useFinance();

    const data = useMemo(() => {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        // Data for Bar Chart: Expenses per Person (This Month)
        const personExpenses = people.map(p => {
            const total = expenses
                .filter(e => {
                    const d = new Date(e.date);
                    return e.personId == p.id && d.getMonth() === currentMonth && d.getFullYear() === currentYear;
                })
                .reduce((sum, e) => sum + e.amount, 0);
            return { ...p, amount: total };
        });

        // Insights logic
        const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

        const currentTotal = expenses
            .filter(e => { const d = new Date(e.date); return d.getMonth() === currentMonth && d.getFullYear() === currentYear; })
            .reduce((sum, e) => sum + e.amount, 0);

        const lastTotal = expenses
            .filter(e => { const d = new Date(e.date); return d.getMonth() === lastMonth && d.getFullYear() === lastMonthYear; })
            .reduce((sum, e) => sum + e.amount, 0);

        const percentChange = lastTotal > 0 ? ((currentTotal - lastTotal) / lastTotal) * 100 : 0;
        const insights = [];

        if (percentChange > 20) {
            insights.push({ type: 'warning', message: `Harcamalar geçen aya göre %${percentChange.toFixed(0)} arttı!` });
        }

        // Check for high subscription cost
        const totalSubs = subscriptions.reduce((sum, s) => sum + s.amount, 0);
        if (totalSubs > 1000) {
            insights.push({ type: 'info', message: `Aylık abonelik giderleri ₺1,000 üzerinde.` });
        }

        return { personExpenses, insights };
    }, [expenses, subscriptions, people]);

    return (
        <div className="space-y-8">
            {/* Person Bar Chart */}
            <div className="bg-white p-8 rounded-3xl card-shadow">
                <div className="mb-6">
                    <h3 className="text-lg font-bold text-slate-800">Kişi Bazlı</h3>
                    <p className="text-sm text-slate-400 font-medium mt-1">Harcama dağılımı</p>
                </div>
                <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data.personExpenses} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }} tickFormatter={val => `₺${val}`} />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }} dy={10} />
                            <Tooltip
                                cursor={{ fill: '#f8fafc' }}
                                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.1)', padding: '12px 16px' }}
                                itemStyle={{ color: '#1e293b', fontWeight: 600, fontSize: '12px' }}
                                formatter={(value) => [`₺${value.toLocaleString()}`, 'Harcama']}
                            />
                            <Bar dataKey="amount" radius={[6, 6, 6, 6]} animationDuration={1000} barSize={32}>
                                {data.personExpenses.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Subscription List */}
            <div className="bg-white p-8 rounded-3xl card-shadow">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-slate-800">Abonelikler</h3>
                        <p className="text-sm text-slate-400 font-medium mt-1">Aktif servisler</p>
                    </div>
                    <span className="bg-slate-100 text-slate-600 py-1 px-3 rounded-full text-xs font-extra-bold">
                        {subscriptions.length}
                    </span>
                </div>

                <div className="space-y-4">
                    {subscriptions.length === 0 ? (
                        <div className="text-center py-8 text-slate-300 font-medium">Henüz abonelik eklenmedi.</div>
                    ) : (
                        subscriptions.map(sub => (
                            <div key={sub.id} className="flex items-center justify-between group">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-2xl bg-slate-50 text-slate-600 flex items-center justify-center font-bold text-sm uppercase group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                        {sub.name.substring(0, 2)}
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-slate-800">{sub.name}</div>
                                        <div className="text-xs text-slate-400 font-medium">{sub.period === 'Monthly' ? 'Aylık' : 'Yıllık'}</div>
                                    </div>
                                </div>
                                <div className="font-bold text-slate-800 text-sm">₺{sub.amount}</div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Insights Card */}
            {data.insights.length > 0 && (
                <div className="bg-slate-900 p-6 rounded-3xl card-shadow text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/20 rounded-full -mr-6 -mt-6 blur-2xl"></div>
                    <div className="flex items-center gap-2 mb-4 relative z-10">
                        <div className="p-1.5 bg-indigo-500/20 rounded-lg">
                            <Zap className="w-4 h-4 text-indigo-300" />
                        </div>
                        <h3 className="font-bold text-base tracking-wide">İçgörüler</h3>
                    </div>
                    <div className="space-y-3 relative z-10">
                        {data.insights.map((insight, i) => (
                            <div key={i} className="flex items-start gap-3 bg-white/5 p-3 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
                                <AlertTriangle className={`w-4 h-4 shrink-0 mt-0.5 ${insight.type === 'warning' ? 'text-rose-400' : 'text-blue-400'}`} />
                                <p className="text-xs font-medium leading-relaxed opacity-90">{insight.message}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default RightColumn;
