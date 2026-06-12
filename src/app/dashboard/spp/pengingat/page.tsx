"use client";

import { useEffect, useMemo, useState } from "react";
import { SppReminderMessagePreview } from "@/components/spp/SppReminderMessagePreview";
import { SppReminderTable } from "@/components/spp/SppReminderTable";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { LoadingState } from "@/components/ui/LoadingState";
import { PageHeader } from "@/components/ui/PageHeader";
import { Select } from "@/components/ui/Select";
import {
  createSppReminderMessage,
  createWhatsAppUrl,
  isValidWhatsAppNumber,
} from "@/lib/whatsapp";
import { getClasses } from "@/services/classService";
import { getSppReminderData } from "@/services/sppService";
import { ClassGroup } from "@/types/class";
import { getMonthName, SppReminderData } from "@/types/spp";

const initialDate = new Date();
const initialMonth = String(initialDate.getMonth() + 1);
const initialYear = String(initialDate.getFullYear());

export default function SppPengingatPage() {
  const [reminders, setReminders] = useState<SppReminderData[]>([]);
  const [classes, setClasses] = useState<ClassGroup[]>([]);
  const [selectedReminder, setSelectedReminder] = useState<SppReminderData | null>(null);
  const [classFilter, setClassFilter] = useState("");
  const [monthFilter, setMonthFilter] = useState(initialMonth);
  const [yearFilter, setYearFilter] = useState(initialYear);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const monthOptions = useMemo(
    () => Array.from({ length: 12 }, (_, i) => ({ label: getMonthName(i + 1), value: String(i + 1) })),
    [],
  );

  async function copyTextToClipboard(text: string) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.setAttribute("readonly", "true");
    textArea.style.position = "fixed";
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.width = "1px";
    textArea.style.height = "1px";
    textArea.style.opacity = "0";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    textArea.setSelectionRange(0, textArea.value.length);

    try {
      if (document.execCommand("copy")) {
        return true;
      }
    } catch {
      // Fallback to Clipboard API below.
    } finally {
      document.body.removeChild(textArea);
    }

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch {
      return false;
    }

    return false;
  }

  function loadReminders() {
    setIsLoading(true);
    setError("");
    setSuccess("");
    getSppReminderData({ classId: classFilter, month: monthFilter, year: yearFilter })
      .then((data) => {
        setReminders(data);
        setSelectedReminder((current) => {
          if (!current) return null;
          return data.find((item) => item.id === current.id) ?? null;
        });
      })
      .catch((loadError: unknown) => {
        setError(loadError instanceof Error ? loadError.message : "Gagal memuat pengingat SPP.");
      })
      .finally(() => setIsLoading(false));
  }

  useEffect(() => {
    let active = true;
    Promise.all([
      getClasses(),
      getSppReminderData({ month: initialMonth, year: initialYear }),
    ])
      .then(([classData, reminderData]) => {
        if (!active) return;
        setClasses(classData);
        setReminders(reminderData);
      })
      .catch((loadError: unknown) => {
        if (active) setError(loadError instanceof Error ? loadError.message : "Gagal memuat pengingat SPP.");
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  async function handleCopy(reminder: SppReminderData) {
    const message = createSppReminderMessage(reminder);
    const copied = await copyTextToClipboard(message);

    if (copied) {
      setSuccess("Pesan berhasil disalin.");
      setError("");
      return;
    }

    setSelectedReminder(reminder);
    setError("Gagal menyalin otomatis. Preview pesan sudah dibuka, silakan salin manual.");
    setSuccess("");
  }

  function handleOpenWhatsApp(reminder: SppReminderData) {
    if (!reminder.guardianPhone?.trim()) {
      setError("Nomor wali belum tersedia.");
      setSuccess("");
      return;
    }

    if (!isValidWhatsAppNumber(reminder.guardianPhone)) {
      setError("Nomor wali belum valid.");
      setSuccess("");
      return;
    }

    window.open(createWhatsAppUrl(reminder.guardianPhone, createSppReminderMessage(reminder)), "_blank", "noopener,noreferrer");
  }

  return (
    <div className="space-y-6">
      <PageHeader
        description="Buat pesan pengingat SPP manual melalui WhatsApp."
        title="Pengingat SPP"
      />

      <Card>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Select
            label="Kelas / Marhalah"
            value={classFilter}
            onChange={(event) => setClassFilter(event.target.value)}
            options={[{ label: "Semua kelas", value: "" }, ...classes.map((item) => ({ label: item.name, value: item.id }))]}
          />
          <Select
            label="Bulan"
            value={monthFilter}
            onChange={(event) => setMonthFilter(event.target.value)}
            options={[{ label: "Semua bulan", value: "" }, ...monthOptions]}
          />
          <label className="block text-sm font-semibold text-slate-700">
            Tahun
            <input
              className="mt-2 h-11 w-full rounded-md border border-slate-200 px-3 text-sm text-slate-950 shadow-sm outline-none transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
              value={yearFilter}
              onChange={(event) => setYearFilter(event.target.value)}
            />
          </label>
          <div className="flex items-end">
            <Button type="button" variant="secondary" onClick={loadReminders}>
              Terapkan Filter
            </Button>
          </div>
        </div>
      </Card>

      {error ? <Alert variant="danger">{error}</Alert> : null}
      {success ? <Alert variant="success">{success}</Alert> : null}

      {isLoading ? (
        <LoadingState message="Memuat pengingat SPP..." />
      ) : (
        <SppReminderTable
          reminders={reminders}
          onCopy={handleCopy}
          onOpenMessage={setSelectedReminder}
          onOpenWhatsApp={handleOpenWhatsApp}
        />
      )}

      <SppReminderMessagePreview reminder={selectedReminder} onCopy={handleCopy} />
    </div>
  );
}
