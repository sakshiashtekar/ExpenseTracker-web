import React, { useMemo } from 'react';
import Header from '@/components/Header';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CATEGORY_COLORS, CATEGORY_ICONS, Category } from '@/types/finance';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { format, parseISO, subMonths, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { TrendingUp, Award, Calendar, PieChart } from 'lucide-react';

const Insights: React.FC = () => {
  const { transactions } = useApp();

  const { highestCategory, highestAmount, monthlyData, avgDaily, incomeTotal, expenseTotal } = useMemo(() => {
    const catMap = new Map<Category, number>();
    transactions.filter(t => t.type === 'expense').forEach(t => {
      catMap.set(t.category, (catMap.get(t.category) || 0) + t.amount);
    });
    let highCat: Category = 'Other', highAmt = 0;
    catMap.forEach((v, k) => { if (v > highAmt) { highAmt = v; highCat = k; } });

    const now = new Date();
    const curStart = startOfMonth(now);
    const curEnd = endOfMonth(now);
    const prevStart = startOfMonth(subMonths(now, 1));
    const prevEnd = endOfMonth(subMonths(now, 1));

    let curInc = 0, curExp = 0, prevInc = 0, prevExp = 0;
    let totalInc = 0, totalExp = 0;
    transactions.forEach(t => {
      const d = parseISO(t.date);
      if (t.type === 'income') totalInc += t.amount; else totalExp += t.amount;
      if (isWithinInterval(d, { start: curStart, end: curEnd })) {
        if (t.type === 'income') curInc += t.amount; else curExp += t.amount;
      } else if (isWithinInterval(d, { start: prevStart, end: prevEnd })) {
        if (t.type === 'income') prevInc += t.amount; else prevExp += t.amount;
      }
    });

    const days = new Set(transactions.map(t => t.date)).size || 1;
    const avg = Math.round(totalExp / days);

    return {
      highestCategory: highCat,
      highestAmount: highAmt,
      monthlyData: [
        { name: format(prevStart, 'MMM yyyy'), Income: prevInc, Expenses: prevExp },
        { name: format(curStart, 'MMM yyyy'), Income: curInc, Expenses: curExp },
      ],
      avgDaily: avg,
      incomeTotal: totalInc,
      expenseTotal: totalExp,
    };
  }, [transactions]);

  const ratio = incomeTotal > 0 ? ((incomeTotal - expenseTotal) / incomeTotal * 100).toFixed(1) : '0';

  const insightCards = [
    { title: 'Highest Spending', value: `${CATEGORY_ICONS[highestCategory]} ${highestCategory}`, sub: `₹${highestAmount.toLocaleString('en-IN')}`, icon: Award, color: 'text-primary' },
    { title: 'Avg Daily Spending', value: `₹${avgDaily.toLocaleString('en-IN')}`, sub: 'Per day', icon: Calendar, color: 'text-[hsl(var(--expense))]' },
    { title: 'Savings Rate', value: `${ratio}%`, sub: 'Income saved', icon: TrendingUp, color: 'text-[hsl(var(--income))]' },
    { title: 'Income vs Expense', value: `₹${incomeTotal.toLocaleString('en-IN')}`, sub: `vs ₹${expenseTotal.toLocaleString('en-IN')}`, icon: PieChart, color: 'text-primary' },
  ];

  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-6xl space-y-6 p-4 pb-12">
        <h1 className="text-2xl font-bold">Insights</h1>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-2 lg:grid-cols-4">
          {insightCards.map(c => (
            <Card key={c.title} className="transition-shadow hover:shadow-md">
              <CardContent className="flex flex-col items-center gap-1.5 p-3 text-center sm:flex-row sm:items-center sm:gap-4 sm:p-5 sm:text-left">
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${c.color} bg-primary/10 sm:bg-transparent`}>
                  <c.icon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-muted-foreground sm:text-sm">{c.title}</p>
                  <p className="text-sm font-bold sm:text-xl">{c.value}</p>
                  <p className="text-xs text-muted-foreground">{c.sub}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Monthly Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: 'hsl(30,10%,45%)' }} />
                  <YAxis tick={{ fontSize: 12, fill: 'hsl(30,10%,45%)' }} tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
                  <Tooltip formatter={(v: number) => `₹${v.toLocaleString('en-IN')}`} />
                  <Legend />
                  <Bar dataKey="Income" fill="hsl(145,63%,42%)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Expenses" fill="hsl(0,72%,51%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Insights;
