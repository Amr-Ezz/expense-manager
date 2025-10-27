export interface Transaction {
  id: string;
  description?: string;
  amount: number;
  category: string;
  date: string;
  type: "income" | "expense";
  userId?: string;
  currency?: string;
}

export interface TransactionsContextType {
  transactions: Transaction[];
  addTransaction: (transaction: Transaction) => void;
  getExpenses?: () => Transaction[];
  getIncomes?: () => Transaction[];
  currentUserId?: string;
}
export interface AddExpenseModalProps {
  onClose: () => void;
  isOpen: boolean;
}
export interface User {
  id: string;
  email: string;
  name?: string;
  image?: string;
  createdAt?: string;
  updatedAt?: string;
  settings?: UserSettings;
  transactions?: Transaction[];
}
export interface UserSettings {
  id: string;
  userId: string;
  currency: string;
  theme: string;
  language: string;
  notifications: boolean;
  timezone?: string;
}
