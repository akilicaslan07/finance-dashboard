import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 7070;

app.use(cors({
    origin: '*' // Allow 7000, 7001, etc. for dev
}));
app.use(express.json());

// Mock Data
let expenses = [
    { id: '1', amount: 450, category: 'Market', personId: '1', date: '2025-02-14', description: 'Haftalık alışveriş' },
    { id: '2', amount: 1250, category: 'Fatura', personId: '2', date: '2025-02-15', description: 'Doğalgaz' }
];

let subscriptions = [
    { id: '1', name: 'Netflix', amount: 229.99, period: 'Monthly', startDate: '2024-01-01' },
    { id: '2', name: 'Spotify', amount: 59.99, period: 'Monthly', startDate: '2024-02-01' }
];

// Income
let income = [
    { id: '1', amount: 85000, date: '2025-02-01', description: 'Maaş', type: 'Salary' }
];

// Routes
// Expenses
app.get('/api/expenses', (req, res) => {
    res.json(expenses);
});

app.post('/api/expenses', (req, res) => {
    const newExpense = { ...req.body, id: Date.now().toString() };
    expenses.push(newExpense);
    res.status(201).json(newExpense);
});

app.delete('/api/expenses/:id', (req, res) => {
    expenses = expenses.filter(e => e.id !== req.params.id);
    res.json({ success: true });
});

// Income
app.get('/api/income', (req, res) => {
    res.json(income);
});

app.post('/api/income', (req, res) => {
    const newIncome = { ...req.body, id: Date.now().toString() };
    income.push(newIncome);
    res.status(201).json(newIncome);
});

app.delete('/api/income/:id', (req, res) => {
    income = income.filter(i => i.id !== req.params.id);
    res.json({ success: true });
});

// Subscriptions
app.get('/api/subscriptions', (req, res) => {
    res.json(subscriptions);
});

app.post('/api/subscriptions', (req, res) => {
    const newSub = { ...req.body, id: Date.now().toString() };
    subscriptions.push(newSub);
    res.status(201).json(newSub);
});

app.delete('/api/subscriptions/:id', (req, res) => {
    subscriptions = subscriptions.filter(s => s.id !== req.params.id);
    res.json({ success: true });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
