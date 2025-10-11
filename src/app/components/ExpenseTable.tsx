// src/components/ExpenseTable.tsx
"use client";

export default function ExpenseTable({ expenses }: { expenses?: Array<{ id:number; idRef?: string; name:string; category:string; status?: string; value: string | number }> }) {
  const sample = expenses ?? [
    { id: 1, idRef: "#001", name: "Product A", category: "Products", status: "Completed", value: "$1,200" },
    { id: 2, idRef: "#002", name: "Service B", category: "Services", status: "Pending", value: "$850" },
    { id: 3, idRef: "#003", name: "Project C", category: "Projects", status: "In Progress", value: "$3,400" },
  ];

  const statusClass = (s?: string) => {
    if (!s) return "bg-gray-100 text-gray-700";
    if (s.toLowerCase().includes("complete")) return "bg-green-100 text-green-700";
    if (s.toLowerCase().includes("pending")) return "bg-yellow-100 text-yellow-700";
    if (s.toLowerCase().includes("progress")) return "bg-blue-100 text-blue-700";
    return "bg-gray-100 text-gray-700";
  };

  return (
    <div className="mt-6 overflow-x-auto bg-[var(--color-surface)] border border-[var(--border)] rounded-2xl p-4">
      <table className="w-full table-auto">
        <thead className="text-[var(--text-secondary)] text-left text-xs uppercase">
          <tr>
            <th className="px-3 py-2">ID</th>
            <th className="px-3 py-2">Name</th>
            <th className="px-3 py-2">Status</th>
            <th className="px-3 py-2 text-right">Value</th>
          </tr>
        </thead>
        <tbody>
          {sample.map((r) => (
            <tr key={r.id} className="border-t border-[var(--border)]">
              <td className="px-3 py-3">{r.idRef}</td>
              <td className="px-3 py-3">{r.name}</td>
              <td className="px-3 py-3">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${statusClass(r.status)}`}>{r.status}</span>
              </td>
              <td className="px-3 py-3 text-right">{r.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
