export function Topbar() {
  return (
    <header className="no-print sticky top-0 z-10 border-b border-slate-200 bg-[#f6f7f5]/90 px-4 py-4 backdrop-blur sm:px-6 lg:px-8">
      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-semibold text-slate-950">
            Tahun Ajaran 2026/2027
          </p>
          <p className="text-xs text-slate-500">Semester Ganjil</p>
        </div>
        <div className="text-sm text-slate-600">Admin Pondok</div>
      </div>
    </header>
  );
}
