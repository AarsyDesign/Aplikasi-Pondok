import type { ResidenceType } from "@/types/student";

export type SppBillStatus = "belum_bayar" | "sebagian" | "lunas";
export type SppPaymentMethod = "tunai" | "transfer" | "lainnya";
export type SppGeneratePreviewStatus = "akan_dibuat" | "sudah_ada" | "nominal_belum_diatur";

export type SppBill = {
  id: string;
  student_id: string | null;
  studentName: string;
  nis: string | null;
  guardianName: string | null;
  guardianPhone: string | null;
  residence_type: ResidenceType;
  class_id: string | null;
  className: string;
  bill_month: number;
  bill_year: number;
  amount: number;
  totalPaid: number;
  remaining: number;
  status: SppBillStatus;
  due_date: string | null;
  generated_by: string | null;
  generated_at: string | null;
  note: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export type SppReminderData = SppBill;
export type SppArrearsReportItem = SppBill;

export type SppPayment = {
  id: string;
  bill_id: string | null;
  student_id: string | null;
  studentName: string;
  payment_date: string;
  amount_paid: number;
  payment_method: string | null;
  note: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export type SppSetting = {
  id: string;
  academic_year_id: string | null;
  academicYearName: string;
  class_id: string | null;
  className: string;
  residence_type: ResidenceType | null;
  amount: number;
  due_day: number;
  is_active: boolean | null;
  note: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export type SppSettingFormData = {
  academic_year_id: string;
  class_id: string;
  residence_type: ResidenceType | "";
  amount: string;
  due_day: string;
  is_active: boolean;
  note: string;
};

export type SppAmountResult =
  | { ok: true; amount: number; due_day: number; setting: SppSetting }
  | { ok: false; message: string };

export type SppGeneratePreviewItem = {
  student_id: string;
  studentName: string;
  nis: string | null;
  class_id: string | null;
  className: string;
  residence_type: ResidenceType;
  amount: number | null;
  due_date: string | null;
  status: SppGeneratePreviewStatus;
  message: string;
};

export type SppGenerateResult = {
  created: number;
  skippedExisting: number;
  skippedWithoutAmount: number;
};

export type SppBillFormData = {
  student_id: string;
  bill_month: string;
  bill_year: string;
  amount: string;
  note: string;
};

export type SppPaymentFormData = {
  student_id: string;
  bill_id: string;
  payment_date: string;
  amount_paid: string;
  payment_method: SppPaymentMethod;
  note: string;
};

export type SppBillFilters = {
  classId?: string;
  month?: string;
  residenceType?: ResidenceType | "";
  year?: string;
  status?: SppBillStatus | "";
};

export type SppReminderFilters = {
  classId?: string;
  month?: string;
  year?: string;
};

export type SppArrearsFilters = {
  classId?: string;
  month?: string;
  residenceType?: ResidenceType | "";
  year?: string;
  status?: SppBillStatus | "";
};

export type SppArrearsCsvFilters = SppArrearsFilters & {
  className?: string;
};

export type SppArrearsSummary = {
  totalBillsAmount: number;
  totalPaidAmount: number;
  totalRemainingAmount: number;
  totalPaidOff: number;
  totalPartial: number;
  totalUnpaid: number;
  totalStudentsInReport: number;
};

export type SppSummary = {
  totalBillsThisMonth: number;
  totalPaidOff: number;
  totalUnpaid: number;
  totalIncomeThisMonth: number;
};

export const MONTH_NAMES = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

export function getMonthName(month: number) {
  return MONTH_NAMES[month - 1] ?? "-";
}

export function getSppStatusLabel(status: SppBillStatus) {
  const labels: Record<SppBillStatus, string> = {
    belum_bayar: "Belum Bayar",
    sebagian: "Sebagian",
    lunas: "Lunas",
  };

  return labels[status];
}

export function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    currency: "IDR",
    maximumFractionDigits: 0,
    style: "currency",
  }).format(value);
}
