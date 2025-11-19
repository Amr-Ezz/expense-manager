export interface Transaction {
  id: string;
  userId: string;

  description: string;
  category: string;
  amount: number;
  type: "income" | "expense";
  date: string;

  currency?: string;

  convertedAmount?: number;
  convertedCurrency?: string;
  rate?: number;
}

export interface TransactionsContextType {
  transactions: Transaction[];
  addTransaction?: (transaction: Omit<Transaction, "id">) => void;
  getExpenses?: () => Transaction[];
  getIncomes?: () => Transaction[];
  deleteTransaction?: (id: string) => void;
  recalculateTransactions?: () => Promise<void>;
  loading?: boolean;
  fetchTransactions?: () => Promise<void>;
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
export interface Currency {
  code: string;
  symbol: string;
  name: string;
}
export interface CurrencyContextProps {
  currency: Currency;
  setCurrency: (code: string) => Promise<void>;
  convertAmount: (amount: number, from: string, to?: string) => Promise<number>;
}
export interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
}
export interface CurrencyChangeConfirmationProps {
  isOpen: boolean;
  currentCurrency: string;
  newCurrency: string;
  transactionCount: number;
  onConfirm: () => void;
  onCancel: () => void;
}
