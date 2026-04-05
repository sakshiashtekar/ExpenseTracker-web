import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Transaction, UserRole } from '@/types/finance';
import { seedTransactions } from '@/data/seed';

interface AppState {
  transactions: Transaction[];
  role: UserRole;
  darkMode: boolean;
  setRole: (role: UserRole) => void;
  toggleDarkMode: () => void;
  addTransaction: (t: Omit<Transaction, 'id'>) => void;
  updateTransaction: (t: Transaction) => void;
  deleteTransaction: (id: string) => void;
}

const AppContext = createContext<AppState | null>(null);

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>(() =>
    loadFromStorage('fin_transactions', seedTransactions)
  );
  const [role, setRole] = useState<UserRole>(() => loadFromStorage('fin_role', 'admin'));
  const [darkMode, setDarkMode] = useState<boolean>(() => loadFromStorage('fin_dark', false));

  useEffect(() => { localStorage.setItem('fin_transactions', JSON.stringify(transactions)); }, [transactions]);
  useEffect(() => { localStorage.setItem('fin_role', JSON.stringify(role)); }, [role]);
  useEffect(() => {
    localStorage.setItem('fin_dark', JSON.stringify(darkMode));
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const toggleDarkMode = useCallback(() => setDarkMode(p => !p), []);

  const addTransaction = useCallback((t: Omit<Transaction, 'id'>) => {
    setTransactions(prev => [{ ...t, id: crypto.randomUUID() }, ...prev]);
  }, []);

  const updateTransaction = useCallback((t: Transaction) => {
    setTransactions(prev => prev.map(x => x.id === t.id ? t : x));
  }, []);

  const deleteTransaction = useCallback((id: string) => {
    setTransactions(prev => prev.filter(x => x.id !== id));
  }, []);

  return (
    <AppContext.Provider value={{ transactions, role, darkMode, setRole, toggleDarkMode, addTransaction, updateTransaction, deleteTransaction }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be inside AppProvider');
  return ctx;
};
