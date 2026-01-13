import React, { createContext, useContext, useState, useEffect } from 'react';

const FinanceContext = createContext();

export const useFinance = () => useContext(FinanceContext);

export const FinanceProvider = ({ children }) => {
    const [expenses, setExpenses] = useState([]);
    const [subscriptions, setSubscriptions] = useState([]);

    const [people] = useState([
        { id: '1', name: 'Ahmet', color: '#3b82f6' }, // blue-500
        { id: '2', name: 'Ayşe', color: '#ec4899' },  // pink-500
        { id: '3', name: 'Mehmet', color: '#10b981' },// emerald-500
        { id: '4', name: 'Fatma', color: '#f59e0b' }, // amber-500
        { id: '5', name: 'Ali', color: '#8b5cf6' },   // violet-500
    ]);

    const [categories] = useState([
        'Market', 'Fatura', 'Dışarıda Yemek', 'Abonelik',
        'Ulaşım', 'Giyim', 'Sağlık', 'Eğitim', 'Eğlence', 'Diğer'
    ]);

    const API_URL = 'http://localhost:7070/api';

    useEffect(() => {
        fetch(`${API_URL}/expenses`)
            .then(res => res.json())
            .then(data => setExpenses(data))
            .catch(err => console.error('Failed to load expenses', err));

        fetch(`${API_URL}/subscriptions`)
            .then(res => res.json())
            .then(data => setSubscriptions(data))
            .catch(err => console.error('Failed to load subscriptions', err));
    }, []);

    const addExpense = async (expense) => {
        try {
            const res = await fetch(`${API_URL}/expenses`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(expense)
            });
            const newExpense = await res.json();
            setExpenses(prev => [...prev, newExpense]);
        } catch (e) {
            console.error(e);
        }
    };

    const deleteExpense = async (id) => {
        try {
            await fetch(`${API_URL}/expenses/${id}`, { method: 'DELETE' });
            setExpenses(prev => prev.filter(e => e.id !== id));
        } catch (e) {
            console.error(e);
        }
    };

    const addSubscription = async (sub) => {
        try {
            const res = await fetch(`${API_URL}/subscriptions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(sub)
            });
            const newSub = await res.json();
            setSubscriptions(prev => [...prev, newSub]);
        } catch (e) {
            console.error(e);
        }
    };

    const deleteSubscription = async (id) => {
        try {
            await fetch(`${API_URL}/subscriptions/${id}`, { method: 'DELETE' });
            setSubscriptions(prev => prev.filter(s => s.id !== id));
        } catch (e) {
            console.error(e);
        }
    };

    const value = {
        expenses,
        subscriptions,
        people,
        categories,
        addExpense,
        deleteExpense,
        addSubscription,
        deleteSubscription
    };

    return (
        <FinanceContext.Provider value={value}>
            {children}
        </FinanceContext.Provider>
    );
};
