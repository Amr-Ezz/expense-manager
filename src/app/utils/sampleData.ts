import { Transaction } from "@/types";
 import { v4 as uuidv4 } from "uuid";


export const defaultTransactions: Transaction[] = [
  {
    id: uuidv4(),
    description: "Groceries",
    amount: 45.5,
    category: "Food",
    date: new Date().toISOString(),
    type: "expense",
  },
  {
    id: uuidv4(),
    description: "Freelance Payment",
    amount: 300,
    category: "Work",
    date: new Date().toISOString(),
    type: "income",
  },
  {
    id: uuidv4(),
    description: "Electricity Bill",
    amount: 60,
    category: "Utilities",
    date: new Date().toISOString(),
    type: "expense",
  },
];
