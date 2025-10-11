import ExpenseTable from "../components/ExpenseTable";
import AddExpenseModal from "./AddExpenseModal";

export default function ExpensesPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Expenses</h1>
        <AddExpenseModal />
      </div>
      <ExpenseTable />
    </div>
  );
}
