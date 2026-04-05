import React, { useState, useMemo } from 'react';
import Header from '@/components/Header';
import { useApp } from '@/context/AppContext';
import { Transaction, ALL_CATEGORIES, CATEGORY_ICONS, Category, TransactionType } from '@/types/finance';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Search, Download, Pencil, Trash2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import TransactionForm from '@/components/TransactionForm';

const Transactions: React.FC = () => {
  const { transactions, role, deleteTransaction } = useApp();
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  const [formOpen, setFormOpen] = useState(false);
  const [editTx, setEditTx] = useState<Transaction | null>(null);

  const filtered = useMemo(() => {
    let list = [...transactions];
    if (search) list = list.filter(t => t.title.toLowerCase().includes(search.toLowerCase()));
    if (filterCat !== 'all') list = list.filter(t => t.category === filterCat);
    if (filterType !== 'all') list = list.filter(t => t.type === filterType);
    list.sort((a, b) => sortBy === 'date' ? b.date.localeCompare(a.date) : b.amount - a.amount);
    return list;
  }, [transactions, search, filterCat, filterType, sortBy]);

  const exportCSV = () => {
    const header = 'Date,Title,Category,Type,Amount\n';
    const rows = filtered.map(t => `${t.date},${t.title},${t.category},${t.type},${t.amount}`).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'transactions.csv';
    a.click();
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-6xl space-y-4 p-4 pb-12">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h1 className="text-2xl font-bold">Transactions</h1>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={exportCSV}>
              <Download className="mr-1 h-4 w-4" /> Export
            </Button>
            {role === 'admin' && (
              <Button size="sm" onClick={() => { setEditTx(null); setFormOpen(true); }}>
                <Plus className="mr-1 h-4 w-4" /> Add
              </Button>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="relative flex-1 min-w-[180px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <Select value={filterCat} onValueChange={setFilterCat}>
            <SelectTrigger className="w-[140px]"><SelectValue placeholder="Category" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {ALL_CATEGORIES.map(c => <SelectItem key={c} value={c}>{CATEGORY_ICONS[c]} {c}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-[120px]"><SelectValue placeholder="Type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="income">Income</SelectItem>
              <SelectItem value="expense">Expense</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={v => setSortBy(v as 'date' | 'amount')}>
            <SelectTrigger className="w-[120px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="date">By Date</SelectItem>
              <SelectItem value="amount">By Amount</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {filtered.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <p className="text-4xl mb-2">📭</p>
              <p className="text-lg font-medium">No transactions found</p>
              <p className="text-sm">Try adjusting your filters or add a new transaction</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {filtered.map(t => (
              <Card key={t.id} className="transition-shadow hover:shadow-md">
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{CATEGORY_ICONS[t.category]}</span>
                    <div>
                      <p className="font-medium">{t.title}</p>
                      <p className="text-xs text-muted-foreground">{t.category} · {format(parseISO(t.date), 'MMM dd, yyyy')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-sm font-bold ${t.type === 'income' ? 'text-[hsl(var(--income))]' : 'text-[hsl(var(--expense))]'}`}>
                      {t.type === 'income' ? '+' : '-'}₹{t.amount.toLocaleString('en-IN')}
                    </span>
                    {role === 'admin' && (
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setEditTx(t); setFormOpen(true); }}>
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => deleteTransaction(t.id)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
      <TransactionForm open={formOpen} onOpenChange={setFormOpen} editTransaction={editTx} />
    </div>
  );
};

export default Transactions;
