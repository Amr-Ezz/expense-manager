export interface Transaction {
  id: string;
  description?: string;
  amount: number;
  category: string;
  date: string;
  type: "income" | "expense";
  userId?: string;
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
