import React, { useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { Card, CardContent } from '@/components/ui/card';
import { Wallet, TrendingUp, TrendingDown } from 'lucide-react';

const SummaryCards: React.FC = () => {
  const { transactions } = useApp();

  const { totalIncome, totalExpense, balance } = useMemo(() => {
    let inc = 0, exp = 0;
    transactions.forEach(t => {
      if (t.type === 'income') inc += t.amount;
      else exp += t.amount;
    });
    return { totalIncome: inc, totalExpense: exp, balance: inc - exp };
  }, [transactions]);

  const fmt = (n: number) => '₹' + n.toLocaleString('en-IN');

  const cards = [
    { label: 'Total Balance', value: fmt(balance), icon: Wallet, color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Income', value: fmt(totalIncome), icon: TrendingUp, color: 'text-[hsl(var(--income))]', bg: 'bg-[hsl(var(--income))]/10' },
    { label: 'Expenses', value: fmt(totalExpense), icon: TrendingDown, color: 'text-[hsl(var(--expense))]', bg: 'bg-[hsl(var(--expense))]/10' },
  ];

  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-4">
      {cards.map(c => (
        <Card key={c.label} className="transition-shadow hover:shadow-md">
          <CardContent className="flex flex-col items-center gap-1.5 p-3 text-center sm:flex-row sm:items-center sm:gap-4 sm:p-5 sm:text-left">
            <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl sm:h-12 sm:w-12 ${c.bg}`}>
              <c.icon className={`h-4 w-4 sm:h-6 sm:w-6 ${c.color}`} />
            </div>
            <div className="min-w-0">
              <p className="truncate text-[10px] text-muted-foreground sm:text-sm">{c.label}</p>
              <p className="truncate text-sm font-bold sm:text-xl">{c.value}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default SummaryCards;
