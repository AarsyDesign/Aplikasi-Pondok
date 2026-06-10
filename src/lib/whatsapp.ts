import { formatRupiah, getMonthName, SppReminderData } from "@/types/spp";

export function normalizeIndonesianPhoneNumber(phone: string): string {
  const digits = phone.replace(/\D/g, "");

  if (digits.startsWith("0")) {
    return `62${digits.slice(1)}`;
  }

  return digits;
}

export function isValidWhatsAppNumber(phone: string): boolean {
  const normalizedPhone = normalizeIndonesianPhoneNumber(phone);
  return /^62\d{8,13}$/.test(normalizedPhone);
}

export function createWhatsAppUrl(phone: string, message: string): string {
  const normalizedPhone = normalizeIndonesianPhoneNumber(phone);
  return `https://wa.me/${normalizedPhone}?text=${encodeURIComponent(message)}`;
}

export function createSppReminderMessage(data: SppReminderData): string {
  const monthName = getMonthName(data.bill_month);
  const amount = formatRupiah(data.amount);
  const paid = formatRupiah(data.totalPaid);
  const remaining = formatRupiah(data.remaining);

  if (data.status === "sebagian") {
    return `Assalamu'alaikum warahmatullahi wabarakatuh.

Kami mengingatkan bahwa SPP ananda ${data.studentName} untuk bulan ${monthName} ${data.bill_year} sudah tercatat sebagian.

Total tagihan: ${amount}
Sudah dibayar: ${paid}
Sisa tagihan: ${remaining}

Mohon konfirmasi kepada bendahara apabila sudah melakukan pelunasan.

Jazakumullahu khairan.`;
  }

  return `Assalamu'alaikum warahmatullahi wabarakatuh.

Kami mengingatkan bahwa SPP ananda ${data.studentName} untuk bulan ${monthName} ${data.bill_year} sebesar ${amount} belum tercatat lunas.

Sisa tagihan saat ini: ${remaining}.

Mohon konfirmasi kepada bendahara apabila sudah melakukan pembayaran.

Jazakumullahu khairan.`;
}
