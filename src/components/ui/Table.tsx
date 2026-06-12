import { ReactNode } from "react";

type Column<T> = {
  header: string;
  cell: (row: T, index: number) => ReactNode;
};

type TableProps<T> = {
  columns: Column<T>[];
  data: T[];
  getRowKey: (row: T) => string;
  emptyText?: string;
};

export function Table<T>({
  columns,
  data,
  getRowKey,
  emptyText = "Belum ada data.",
}: TableProps<T>) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200/80 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50/80">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.header}
                  className="whitespace-nowrap px-4 py-3.5 text-left text-xs font-bold uppercase tracking-wide text-slate-500"
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.length > 0 ? (
              data.map((row, rowIndex) => (
                <tr key={getRowKey(row)} className="transition hover:bg-emerald-50/40">
                  {columns.map((column) => (
                    <td key={column.header} className="px-4 py-3.5 align-middle text-slate-700">
                      {column.cell(row, rowIndex)}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td className="px-4 py-10 text-center" colSpan={columns.length}>
                  <div className="mx-auto max-w-sm rounded-lg border border-dashed border-slate-200 bg-slate-50/70 px-4 py-5 text-sm text-slate-500">
                    {emptyText}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
