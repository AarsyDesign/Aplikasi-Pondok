import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { createSppReminderMessage } from "@/lib/whatsapp";
import { getMonthName, SppReminderData } from "@/types/spp";

type SppReminderMessagePreviewProps = {
  reminder: SppReminderData | null;
  onCopy: (reminder: SppReminderData) => void;
};

export function SppReminderMessagePreview({ reminder, onCopy }: SppReminderMessagePreviewProps) {
  if (!reminder) return null;

  const message = createSppReminderMessage(reminder);

  return (
    <Card>
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
        <div>
          <h2 className="text-lg font-semibold text-slate-950">Preview Pesan</h2>
          <p className="mt-1 text-sm text-slate-600">
            {reminder.studentName} - {getMonthName(reminder.bill_month)} {reminder.bill_year}
          </p>
        </div>
        <Button type="button" variant="secondary" onClick={() => onCopy(reminder)}>
          Salin Pesan
        </Button>
      </div>
      <pre className="mt-4 whitespace-pre-wrap rounded-md border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-800">
        {message}
      </pre>
    </Card>
  );
}
