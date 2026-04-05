import { Transaction } from '@/types/finance';

export const seedTransactions: Transaction[] = [
  { id: '1', title: 'Grocery Shopping', amount: 2450, type: 'expense', category: 'Food', date: '2026-04-01' },
  { id: '2', title: 'Monthly Salary', amount: 85000, type: 'income', category: 'Salary', date: '2026-04-01' },
  { id: '3', title: 'Uber Ride', amount: 350, type: 'expense', category: 'Transportation', date: '2026-04-02' },
  { id: '4', title: 'Netflix Subscription', amount: 499, type: 'expense', category: 'Entertainment', date: '2026-04-02' },
  { id: '5', title: 'Electricity Bill', amount: 1800, type: 'expense', category: 'Bills', date: '2026-04-03' },
  { id: '6', title: 'Freelance Project', amount: 15000, type: 'income', category: 'Freelance', date: '2026-04-03' },
  { id: '7', title: 'Restaurant Dinner', amount: 1200, type: 'expense', category: 'Food', date: '2026-04-04' },
  { id: '8', title: 'Online Shopping', amount: 3500, type: 'expense', category: 'Shopping', date: '2026-04-04' },
  { id: '9', title: 'Gas Station', amount: 2000, type: 'expense', category: 'Transportation', date: '2026-04-05' },
  { id: '10', title: 'Movie Tickets', amount: 600, type: 'expense', category: 'Entertainment', date: '2026-03-28' },
  { id: '11', title: 'Internet Bill', amount: 999, type: 'expense', category: 'Bills', date: '2026-03-25' },
  { id: '12', title: 'Bonus', amount: 10000, type: 'income', category: 'Salary', date: '2026-03-25' },
  { id: '13', title: 'Coffee & Snacks', amount: 450, type: 'expense', category: 'Food', date: '2026-03-20' },
  { id: '14', title: 'Clothing', amount: 4200, type: 'expense', category: 'Shopping', date: '2026-03-18' },
  { id: '15', title: 'Freelance UI Work', amount: 20000, type: 'income', category: 'Freelance', date: '2026-03-15' },
  { id: '16', title: 'Metro Card Recharge', amount: 500, type: 'expense', category: 'Transportation', date: '2026-03-12' },
  { id: '17', title: 'Gym Membership', amount: 1500, type: 'expense', category: 'Bills', date: '2026-03-10' },
  { id: '18', title: 'Birthday Gift', amount: 2000, type: 'expense', category: 'Shopping', date: '2026-03-08' },
];
