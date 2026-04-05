export type TransactionType = 'income' | 'expense';

export type Category =
  | 'Food'
  | 'Shopping'
  | 'Transportation'
  | 'Entertainment'
  | 'Bills'
  | 'Salary'
  | 'Freelance'
  | 'Other';

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: TransactionType;
  category: Category;
  date: string; // ISO string
}

export type UserRole = 'admin' | 'viewer';

export const EXPENSE_CATEGORIES: Category[] = ['Food', 'Shopping', 'Transportation', 'Entertainment', 'Bills', 'Other'];
export const INCOME_CATEGORIES: Category[] = ['Salary', 'Freelance', 'Other'];
export const ALL_CATEGORIES: Category[] = ['Food', 'Shopping', 'Transportation', 'Entertainment', 'Bills', 'Salary', 'Freelance', 'Other'];

export const CATEGORY_COLORS: Record<Category, string> = {
  Food: 'hsl(25, 95%, 53%)',
  Shopping: 'hsl(280, 67%, 55%)',
  Transportation: 'hsl(210, 79%, 46%)',
  Entertainment: 'hsl(330, 81%, 60%)',
  Bills: 'hsl(45, 93%, 47%)',
  Salary: 'hsl(145, 63%, 42%)',
  Freelance: 'hsl(170, 70%, 40%)',
  Other: 'hsl(0, 0%, 55%)',
};

export const CATEGORY_ICONS: Record<Category, string> = {
  Food: '🍔',
  Shopping: '🛍️',
  Transportation: '🚗',
  Entertainment: '🎬',
  Bills: '📄',
  Salary: '💰',
  Freelance: '💻',
  Other: '📦',
};
