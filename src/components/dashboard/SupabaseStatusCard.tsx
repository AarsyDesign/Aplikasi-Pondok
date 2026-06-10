"use client";

import { useState } from "react";
import { testSupabaseConnection } from "@/lib/supabase/testConnection";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

type Status = {
  ok: boolean;
  message: string;
};

export function SupabaseStatusCard() {
  const [status, setStatus] = useState<Status | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  async function handleCheckConnection() {
    setIsChecking(true);
    setStatus(null);

    const result = await testSupabaseConnection();

    setStatus(result);
    setIsChecking(false);
  }

  return (
    <Card className="no-print">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-lg font-semibold text-slate-950">
            Status Supabase
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Cek koneksi lokal tanpa menampilkan URL atau key.
          </p>
        </div>
        <Button type="button" onClick={handleCheckConnection} disabled={isChecking}>
          {isChecking ? "Mengecek..." : "Cek Koneksi"}
        </Button>
      </div>

      {status ? (
        <div
          className={`mt-4 rounded-md border px-4 py-3 text-sm ${
            status.ok
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-amber-200 bg-amber-50 text-amber-800"
          }`}
        >
          {status.message}
        </div>
      ) : null}
    </Card>
  );
}
