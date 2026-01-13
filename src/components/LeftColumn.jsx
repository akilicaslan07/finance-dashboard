import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Plus, CreditCard, Calendar, User, Tag, FileText } from 'lucide-react';

const LeftColumn = () => {
    const { addExpense, addSubscription, people, categories } = useFinance();
    const [activeTab, setActiveTab] = useState('expense');

    // Expense Form Sate
    const [expenseForm, setExpenseForm] = useState({
        amount: '',
        category: categories[0],
        personId: people[0].id,
        date: new Date().toISOString().split('T')[0],
        description: ''
    });

    // Subscription Form State
    const [subForm, setSubForm] = useState({
        name: '',
        amount: '',
        period: 'Monthly',
        startDate: new Date().toISOString().split('T')[0]
    });

    const handleExpenseSubmit = (e) => {
        e.preventDefault();
        if (!expenseForm.amount) return;
        addExpense({ ...expenseForm, amount: parseFloat(expenseForm.amount) });
        setExpenseForm(prev => ({ ...prev, amount: '', description: '' }));
    };

    const handleSubSubmit = (e) => {
        e.preventDefault();
        if (!subForm.name || !subForm.amount) return;
        addSubscription({ ...subForm, amount: parseFloat(subForm.amount) });
        setSubForm(prev => ({ ...prev, name: '', amount: '' }));
    };

    // Input classes for consistency - Minimalist Gray Background
    const inputClass = "w-full bg-slate-50 border border-transparent rounded-xl px-4 py-3 text-sm font-medium text-slate-700 placeholder:text-slate-400 focus:bg-white focus:border-indigo-200 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none";
    const labelClass = "block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1";

    return (
        <div className="bg-white p-6 rounded-3xl card-shadow sticky top-8">
            {/* Tabs - Pill Style */}
            <div className="flex p-1 bg-slate-100/80 rounded-2xl mb-8">
                <button
                    onClick={() => setActiveTab('expense')}
                    className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all duration-300 ${activeTab === 'expense' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    Harcama
                </button>
                <button
                    onClick={() => setActiveTab('subscription')}
                    className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all duration-300 ${activeTab === 'subscription' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    Abonelik
                </button>
            </div>

            {/* Forms */}
            <div className="transition-all duration-300">
                {activeTab === 'expense' ? (
                    <form onSubmit={handleExpenseSubmit} className="space-y-5">
                        <div className="text-center mb-6">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 mb-3">
                                <CreditCard className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-800">Harcama Ekle</h3>
                            <p className="text-xs text-slate-400 font-medium mt-1">Hızlı gider girişi</p>
                        </div>

                        <div>
                            <label className={labelClass}>Tutar</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₺</span>
                                <input
                                    type="number"
                                    placeholder="0.00"
                                    className={`${inputClass} pl-8 text-lg font-bold text-slate-800`}
                                    value={expenseForm.amount}
                                    onChange={e => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>Kategori</label>
                                <div className="relative">
                                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <select
                                        className={`${inputClass} pl-9 appearance-none`}
                                        value={expenseForm.category}
                                        onChange={e => setExpenseForm({ ...expenseForm, category: e.target.value })}
                                    >
                                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className={labelClass}>Kişi</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <select
                                        className={`${inputClass} pl-9 appearance-none`}
                                        value={expenseForm.personId}
                                        onChange={e => setExpenseForm({ ...expenseForm, personId: e.target.value })}
                                    >
                                        {people.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div>
                             <label className={labelClass}>Açıklama</label>
                             <div className="relative">
                                <FileText className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
                                <textarea 
                                    className={`${inputClass} pl-10 resize-none h-24`}
                                    placeholder="Nereye harcandı?"
                                    value={expenseForm.description}
                                    onChange={e => setExpenseForm({...expenseForm, description: e.target.value})}
                                />
                             </div>
                        </div>

                        <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transition-all active:scale-[0.98] flex items-center justify-center gap-2 group">
                            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                            Kaydet
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleSubSubmit} className="space-y-5">
                         <div className="text-center mb-6">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 mb-3">
                                <Calendar className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-800">Abonelik Ekle</h3>
                            <p className="text-xs text-slate-400 font-medium mt-1">Düzenli ödemeler</p>
                        </div>

                        <div>
                            <label className={labelClass}>Servis Adı</label>
                            <input
                                type="text"
                                placeholder="Netflix, Spotify..."
                                className={inputClass}
                                value={subForm.name}
                                onChange={e => setSubForm({ ...subForm, name: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className={labelClass}>Tutar</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₺</span>
                                <input
                                    type="number"
                                    placeholder="0.00"
                                    className={`${inputClass} pl-8 text-lg font-bold text-slate-800`}
                                    value={subForm.amount}
                                    onChange={e => setSubForm({ ...subForm, amount: e.target.value })}
                                />
                            </div>
                        </div>

                         <div>
                            <label className={labelClass}>Periyot</label>
                            <select
                                className={inputClass}
                                value={subForm.period}
                                onChange={e => setSubForm({ ...subForm, period: e.target.value })}
                            >
                                <option value="Monthly">Aylık</option>
                                <option value="Yearly">Yıllık</option>
                            </select>
                        </div>

                        <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transition-all active:scale-[0.98] flex items-center justify-center gap-2 group">
                            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                            Abone Ol
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default LeftColumn;
