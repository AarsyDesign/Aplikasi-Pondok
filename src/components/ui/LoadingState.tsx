export function LoadingState({ message = "Memuat data..." }: { message?: string }) {
  return (
    <div className="rounded-lg border border-slate-200/80 bg-white p-6 text-sm font-medium text-slate-600 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
      <div className="flex items-center gap-3">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-emerald-700 border-r-transparent" />
        {message}
      </div>
    </div>
  );
}
