import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Transaction, TransactionType, Category, EXPENSE_CATEGORIES, INCOME_CATEGORIES, CATEGORY_ICONS } from '@/types/finance';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  editTransaction?: Transaction | null;
}

const TransactionForm: React.FC<Props> = ({ open, onOpenChange, editTransaction }) => {
  const { addTransaction, updateTransaction } = useApp();
  const [type, setType] = useState<TransactionType>(editTransaction?.type || 'expense');
  const [title, setTitle] = useState(editTransaction?.title || '');
  const [amount, setAmount] = useState(editTransaction?.amount?.toString() || '');
  const [category, setCategory] = useState<Category>(editTransaction?.category || 'Food');
  const [date, setDate] = useState(editTransaction?.date || new Date().toISOString().split('T')[0]);

  React.useEffect(() => {
    if (editTransaction) {
      setType(editTransaction.type);
      setTitle(editTransaction.title);
      setAmount(editTransaction.amount.toString());
      setCategory(editTransaction.category);
      setDate(editTransaction.date);
    } else {
      setType('expense');
      setTitle('');
      setAmount('');
      setCategory('Food');
      setDate(new Date().toISOString().split('T')[0]);
    }
  }, [editTransaction, open]);

  const cats = type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  const handleSubmit = () => {
    if (!title || !amount || Number(amount) <= 0) return;
    const data = { title, amount: Number(amount), type, category, date };
    if (editTransaction) {
      updateTransaction({ ...data, id: editTransaction.id });
    } else {
      addTransaction(data);
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{editTransaction ? 'Edit' : 'Add'} Transaction</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex gap-2">
            {(['expense', 'income'] as TransactionType[]).map(t => (
              <button
                key={t}
                onClick={() => { setType(t); setCategory(t === 'expense' ? 'Food' : 'Salary'); }}
                className={cn(
                  'flex-1 rounded-lg py-2 text-sm font-medium capitalize transition-colors',
                  type === t
                    ? t === 'expense' ? 'bg-[hsl(var(--expense))] text-[hsl(var(--expense-foreground))]' : 'bg-[hsl(var(--income))] text-[hsl(var(--income-foreground))]'
                    : 'bg-muted text-muted-foreground'
                )}
              >
                {t}
              </button>
            ))}
          </div>
          <Input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
          <Input type="number" placeholder="Amount (₹)" value={amount} onChange={e => setAmount(e.target.value)} min={1} />
          <Input type="date" value={date} onChange={e => setDate(e.target.value)} />
          <div>
            <p className="mb-2 text-sm text-muted-foreground">Category</p>
            <div className="flex flex-wrap gap-2">
              {cats.map(c => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={cn(
                    'rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
                    category === c ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-background hover:bg-accent'
                  )}
                >
                  {CATEGORY_ICONS[c]} {c}
                </button>
              ))}
            </div>
          </div>
          <Button className="w-full" onClick={handleSubmit}>
            {editTransaction ? 'Update' : 'Add'} Transaction
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionForm;
