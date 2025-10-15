import { Transaction } from "@/types";

export const defaultTransactions: Transaction[] = [
  {
    id: "1",
    description: "Groceries",
    amount: 45.5,
    category: "Food",
    date: new Date().toISOString(),
    type: "expense",
  },
  {
    id: "2",
    description: "Freelance Payment",
    amount: 300,
    category: "Work",
    date: new Date().toISOString(),
    type: "income",
  },
  {
    id: "3",
    description: "Electricity Bill",
    amount: 60,
    category: "Utilities",
    date: new Date().toISOString(),
    type: "expense",
  },
];
