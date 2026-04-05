import React, { useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, parseISO, subMonths, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';

const BalanceTrendChart: React.FC = () => {
  const { transactions } = useApp();

  const balanceTrendData = useMemo(() => {
    const now = new Date();
    const months = Array.from({ length: 6 }, (_, i) => {
      const month = subMonths(now, 5 - i);
      return {
        name: format(month, 'MMM yy'),
        start: startOfMonth(month),
        end: endOfMonth(month),
        income: 0,
        expense: 0,
      };
    });

    transactions.forEach(t => {
      const d = parseISO(t.date);
      months.forEach(month => {
        if (isWithinInterval(d, { start: month.start, end: month.end })) {
          if (t.type === 'income') month.income += t.amount;
          else month.expense += t.amount;
        }
      });
    });

    return months.map(m => ({
      name: m.name,
      balance: m.income - m.expense,
    }));
  }, [transactions]);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Balance Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={balanceTrendData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: 'hsl(30,10%,45%)' }} />
              <YAxis tick={{ fontSize: 12, fill: 'hsl(30,10%,45%)' }} tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: number) => `₹${v.toLocaleString('en-IN')}`} />
              <Line type="monotone" dataKey="balance" stroke="hsl(145,63%,42%)" strokeWidth={2} dot={{ fill: 'hsl(145,63%,42%)' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default BalanceTrendChart;