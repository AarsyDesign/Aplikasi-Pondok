import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { isPositiveNumber, isValidYear } from "@/lib/utils";
import { Database, SppBill as SppBillRow, SppPayment as SppPaymentRow, SppSetting as SppSettingRow } from "@/types/database";
import {
  SppBill,
  SppBillFilters,
  SppBillFormData,
  SppPayment,
  SppPaymentFormData,
  SppArrearsFilters,
  SppArrearsReportItem,
  SppArrearsSummary,
  SppAmountResult,
  SppReminderData,
  SppReminderFilters,
  SppGeneratePreviewItem,
  SppGenerateResult,
  SppSetting,
  SppSettingFormData,
  SppSummary,
  getMonthName,
} from "@/types/spp";
import type { ResidenceType } from "@/types/student";

type SppBillInsert = Database["public"]["Tables"]["spp_bills"]["Insert"];
type SppBillUpdate = Database["public"]["Tables"]["spp_bills"]["Update"];
type SppPaymentInsert = Database["public"]["Tables"]["spp_payments"]["Insert"];
type SppSettingInsert = Database["public"]["Tables"]["spp_settings"]["Insert"];
type SppSettingUpdate = Database["public"]["Tables"]["spp_settings"]["Update"];

function requireSupabase() {
  const supabase = createSupabaseBrowserClient();

  if (!supabase) {
    throw new Error("Supabase belum dikonfigurasi. Isi .env.local terlebih dahulu.");
  }

  return supabase;
}

function getBillStatus(amount: number, totalPaid: number): SppBill["status"] {
  if (totalPaid <= 0) return "belum_bayar";
  if (totalPaid < amount) return "sebagian";
  return "lunas";
}

function cleanBillPayload(data: SppBillFormData, classId: string | null): SppBillInsert {
  return {
    amount: Number(data.amount),
    bill_month: Number(data.bill_month),
    bill_year: Number(data.bill_year),
    class_id: classId,
    note: data.note.trim() || null,
    status: "belum_bayar",
    student_id: data.student_id,
  };
}

function cleanBillUpdatePayload(data: SppBillFormData, classId: string | null): SppBillUpdate {
  return {
    amount: Number(data.amount),
    bill_month: Number(data.bill_month),
    bill_year: Number(data.bill_year),
    class_id: classId,
    note: data.note.trim() || null,
    student_id: data.student_id,
  };
}

function cleanPaymentPayload(data: SppPaymentFormData): SppPaymentInsert {
  return {
    amount_paid: Number(data.amount_paid),
    bill_id: data.bill_id,
    note: data.note.trim() || null,
    payment_date: data.payment_date,
    payment_method: data.payment_method,
    student_id: data.student_id,
  };
}

function cleanSettingPayload(data: SppSettingFormData): SppSettingInsert {
  return {
    academic_year_id: data.academic_year_id || null,
    amount: Number(data.amount),
    class_id: data.class_id || null,
    due_day: Number(data.due_day),
    is_active: data.is_active,
    note: data.note.trim() || null,
    residence_type: data.residence_type || null,
  };
}

function validateSettingFormData(data: SppSettingFormData) {
  const amount = Number(data.amount);
  const dueDay = Number(data.due_day);

  if (!data.academic_year_id || !data.amount || !data.due_day) {
    throw new Error("Tahun ajaran, nominal, dan tanggal tagihan wajib diisi.");
  }

  if (!Number.isFinite(amount) || amount < 0) {
    throw new Error("Nominal SPP tidak boleh negatif.");
  }

  if (!Number.isInteger(dueDay) || dueDay < 1 || dueDay > 28) {
    throw new Error("Tanggal tagihan wajib antara 1 sampai 28.");
  }

  if (data.residence_type && !["mukim", "non_mukim"].includes(data.residence_type)) {
    throw new Error("Status santri tidak valid.");
  }
}

function validateBillFormData(data: SppBillFormData) {
  if (!data.student_id || !data.bill_month || !data.bill_year || !data.amount) {
    throw new Error("Santri, bulan, tahun, dan nominal wajib diisi.");
  }

  if (Number(data.bill_month) < 1 || Number(data.bill_month) > 12) {
    throw new Error("Bulan tagihan tidak valid.");
  }

  if (!isValidYear(data.bill_year)) {
    throw new Error("Tahun tagihan wajib 4 digit, contoh 2026.");
  }

  if (!isPositiveNumber(data.amount)) {
    throw new Error("Nominal tagihan harus lebih dari 0.");
  }
}

function validatePaymentFormData(data: SppPaymentFormData) {
  if (!data.student_id || !data.bill_id || !data.payment_date || !data.amount_paid) {
    throw new Error("Santri, tagihan, tanggal, dan nominal pembayaran wajib diisi.");
  }

  if (!isPositiveNumber(data.amount_paid)) {
    throw new Error("Nominal pembayaran harus lebih dari 0.");
  }
}

async function getStudentClassMap() {
  const supabase = requireSupabase();
  const [{ data: students, error: studentError }, { data: classes, error: classError }] =
    await Promise.all([
      supabase.from("students").select("id, full_name, nis, guardian_name, guardian_phone, class_id, residence_type, status"),
      supabase.from("classes").select("id, name"),
    ]);

  if (studentError) throw new Error(`Gagal mengambil data santri: ${studentError.message}`);
  if (classError) throw new Error(`Gagal mengambil data kelas: ${classError.message}`);

  const classNames = new Map(classes.map((item) => [item.id, item.name]));

  return new Map(
    students.map((student) => [
      student.id,
      {
        class_id: student.class_id,
        className: student.class_id ? (classNames.get(student.class_id) ?? "-") : "-",
        guardianName: student.guardian_name,
        guardianPhone: student.guardian_phone,
        nis: student.nis,
        residence_type: (student.residence_type ?? "non_mukim") as ResidenceType,
        status: student.status,
        studentName: student.full_name,
      },
    ]),
  );
}

async function getLookupMaps() {
  const supabase = requireSupabase();
  const [classes, academicYears] = await Promise.all([
    supabase.from("classes").select("id, name"),
    supabase.from("academic_years").select("id, name"),
  ]);

  if (classes.error) throw new Error(`Gagal mengambil data kelas: ${classes.error.message}`);
  if (academicYears.error) throw new Error(`Gagal mengambil tahun ajaran: ${academicYears.error.message}`);

  return {
    academicYears: new Map(academicYears.data.map((item) => [item.id, item.name])),
    classes: new Map(classes.data.map((item) => [item.id, item.name])),
  };
}

async function getPaymentTotals() {
  const supabase = requireSupabase();
  const { data, error } = await supabase.from("spp_payments").select("bill_id, amount_paid");

  if (error) throw new Error(`Gagal mengambil total pembayaran: ${error.message}`);

  return data.reduce<Map<string, number>>((totals, payment) => {
    if (!payment.bill_id) return totals;
    totals.set(payment.bill_id, (totals.get(payment.bill_id) ?? 0) + Number(payment.amount_paid));
    return totals;
  }, new Map());
}

async function mapBills(rows: SppBillRow[]): Promise<SppBill[]> {
  const [studentMap, paymentTotals] = await Promise.all([getStudentClassMap(), getPaymentTotals()]);

  return rows.map((row) => {
    const student = row.student_id ? studentMap.get(row.student_id) : undefined;
    const totalPaid = paymentTotals.get(row.id) ?? 0;
    const amount = Number(row.amount);

    return {
      id: row.id,
      amount,
      bill_month: row.bill_month,
      bill_year: row.bill_year,
      class_id: row.class_id,
      className: student?.className ?? "-",
      created_at: row.created_at,
      guardianName: student?.guardianName ?? null,
      guardianPhone: student?.guardianPhone ?? null,
      residence_type: student?.residence_type ?? "non_mukim",
      nis: student?.nis ?? null,
      note: row.note,
      due_date: row.due_date,
      generated_at: row.generated_at,
      generated_by: row.generated_by,
      remaining: Math.max(amount - totalPaid, 0),
      status: getBillStatus(amount, totalPaid),
      student_id: row.student_id,
      studentName: student?.studentName ?? "Santri tidak ditemukan",
      totalPaid,
      updated_at: row.updated_at,
    };
  });
}

async function mapPayments(rows: SppPaymentRow[]): Promise<SppPayment[]> {
  const studentMap = await getStudentClassMap();

  return rows.map((row) => ({
    id: row.id,
    amount_paid: Number(row.amount_paid),
    bill_id: row.bill_id,
    created_at: row.created_at,
    note: row.note,
    payment_date: row.payment_date,
    payment_method: row.payment_method,
    student_id: row.student_id,
    studentName: row.student_id
      ? (studentMap.get(row.student_id)?.studentName ?? "Santri tidak ditemukan")
      : "-",
    updated_at: row.updated_at,
  }));
}

export async function getSppSettings() {
  const supabase = requireSupabase();
  const [lookups, settingsResult] = await Promise.all([
    getLookupMaps(),
    supabase
      .from("spp_settings")
      .select("*")
      .order("created_at", { ascending: false }),
  ]);

  const { data, error } = settingsResult;
  if (error) throw new Error(`Gagal mengambil pengaturan SPP: ${error.message}`);

  return data.map((row) => mapSetting(row, lookups));
}

export async function createSppSetting(data: SppSettingFormData) {
  const supabase = requireSupabase();
  validateSettingFormData(data);
  const payload = cleanSettingPayload(data);
  const { data: setting, error } = await supabase
    .from("spp_settings")
    .insert(payload)
    .select()
    .single();

  if (error) throw new Error(`Gagal menyimpan pengaturan SPP: ${error.message}`);
  return setting;
}

export async function updateSppSetting(id: string, data: SppSettingFormData) {
  const supabase = requireSupabase();
  validateSettingFormData(data);
  const payload = cleanSettingPayload(data) as SppSettingUpdate;
  const { data: setting, error } = await supabase
    .from("spp_settings")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(`Gagal memperbarui pengaturan SPP: ${error.message}`);
  return setting;
}

export async function deleteSppSetting(id: string) {
  const supabase = requireSupabase();
  const { error } = await supabase.from("spp_settings").delete().eq("id", id);

  if (error) throw new Error(`Gagal menghapus pengaturan SPP: ${error.message}`);
  return true;
}

async function getActiveSppSettings(academicYearId: string) {
  const settings = await getSppSettings();

  return settings.filter((setting) =>
    setting.is_active &&
    setting.academic_year_id === academicYearId,
  );
}

function resolveSppAmountFromSettings(
  student: { class_id: string | null; residence_type?: ResidenceType | null },
  settings: SppSetting[],
): SppAmountResult {
  const residenceType = student.residence_type ?? "non_mukim";
  const priorities = [
    (setting: SppSetting) =>
      setting.class_id === student.class_id && setting.residence_type === residenceType,
    (setting: SppSetting) =>
      setting.class_id === null && setting.residence_type === residenceType,
    (setting: SppSetting) =>
      setting.class_id === student.class_id && setting.residence_type === null,
    (setting: SppSetting) =>
      setting.class_id === null && setting.residence_type === null,
  ];

  for (const matches of priorities) {
    const setting = settings.find(matches);

    if (setting) {
      return { ok: true, amount: setting.amount, due_day: setting.due_day, setting };
    }
  }

  return { ok: false, message: getMissingAmountMessage(residenceType) };
}

export async function getSppAmountForStudent(
  student: { class_id: string | null; residence_type?: ResidenceType | null },
  academicYearId: string,
): Promise<SppAmountResult> {
  const settings = await getActiveSppSettings(academicYearId);
  return resolveSppAmountFromSettings(student, settings);
}

function mapSetting(
  row: SppSettingRow,
  lookups: { academicYears: Map<string, string>; classes: Map<string, string> },
): SppSetting {
  return {
    id: row.id,
    academic_year_id: row.academic_year_id,
    academicYearName: row.academic_year_id
      ? (lookups.academicYears.get(row.academic_year_id) ?? "Tahun ajaran tidak ditemukan")
      : "Semua tahun ajaran",
    amount: Number(row.amount),
    class_id: row.class_id,
    className: row.class_id ? (lookups.classes.get(row.class_id) ?? "Kelas tidak ditemukan") : "Semua kelas",
    created_at: row.created_at,
    due_day: row.due_day,
    is_active: row.is_active,
    note: row.note,
    residence_type: row.residence_type,
    updated_at: row.updated_at,
  };
}

function createDueDate(month: number, year: number, dueDay: number) {
  return `${year}-${String(month).padStart(2, "0")}-${String(dueDay).padStart(2, "0")}`;
}

function getMissingAmountMessage(residenceType: ResidenceType) {
  return residenceType === "mukim"
    ? "Nominal SPP santri mukim belum diatur."
    : "Nominal SPP santri non mukim belum diatur.";
}

export async function getSppSummary(): Promise<SppSummary> {
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();
  const [bills, payments] = await Promise.all([getSppBills({ month: String(month), year: String(year) }), getAllPayments()]);

  return {
    totalBillsThisMonth: bills.length,
    totalIncomeThisMonth: payments
      .filter((payment) => {
        const paymentDate = new Date(payment.payment_date);
        return paymentDate.getMonth() + 1 === month && paymentDate.getFullYear() === year;
      })
      .reduce((sum, payment) => sum + payment.amount_paid, 0),
    totalPaidOff: bills.filter((bill) => bill.status === "lunas").length,
    totalUnpaid: bills.filter((bill) => bill.status === "belum_bayar").length,
  };
}

export async function getSppBills(filters: SppBillFilters = {}) {
  const supabase = requireSupabase();
  let query = supabase.from("spp_bills").select("*").order("bill_year", { ascending: false }).order("bill_month", { ascending: false });

  if (filters.classId) query = query.eq("class_id", filters.classId);
  if (filters.month) query = query.eq("bill_month", Number(filters.month));
  if (filters.year) query = query.eq("bill_year", Number(filters.year));
  if (filters.status) query = query.eq("status", filters.status);

  const { data, error } = await query;
  if (error) throw new Error(`Gagal mengambil tagihan SPP: ${error.message}`);
  const bills = await mapBills(data);

  if (filters.residenceType) {
    return bills.filter((bill) => bill.residence_type === filters.residenceType);
  }

  return bills;
}

export async function getUnpaidSppBills(filters: SppReminderFilters = {}): Promise<SppReminderData[]> {
  const bills = await getSppArrearsReport(filters);
  return bills.filter((bill) => bill.status === "belum_bayar" || bill.status === "sebagian");
}

export async function getSppReminderData(filters: SppReminderFilters = {}): Promise<SppReminderData[]> {
  return getUnpaidSppBills(filters);
}

export async function getSppArrearsReport(filters: SppArrearsFilters = {}): Promise<SppArrearsReportItem[]> {
  const supabase = requireSupabase();
  let query = supabase
    .from("spp_bills")
    .select("*")
    .order("bill_year", { ascending: false })
    .order("bill_month", { ascending: false });

  if (filters.classId) query = query.eq("class_id", filters.classId);
  if (filters.month) query = query.eq("bill_month", Number(filters.month));
  if (filters.year) query = query.eq("bill_year", Number(filters.year));

  const { data, error } = await query;
  if (error) throw new Error(`Gagal mengambil rekap tunggakan SPP: ${error.message}`);

  const report = await mapBills(data);
  let filteredReport = report;

  if (filters.residenceType) {
    filteredReport = filteredReport.filter((item) => item.residence_type === filters.residenceType);
  }

  if (!filters.status) return filteredReport;

  return filteredReport.filter((item) => item.status === filters.status);
}

export async function getSppArrearsSummary(filters: SppArrearsFilters = {}): Promise<SppArrearsSummary> {
  const report = await getSppArrearsReport(filters);
  const studentIds = new Set(report.map((item) => item.student_id).filter(Boolean));

  return {
    totalBillsAmount: report.reduce((sum, item) => sum + item.amount, 0),
    totalPaidAmount: report.reduce((sum, item) => sum + item.totalPaid, 0),
    totalRemainingAmount: report.reduce((sum, item) => sum + item.remaining, 0),
    totalPaidOff: report.filter((item) => item.status === "lunas").length,
    totalPartial: report.filter((item) => item.status === "sebagian").length,
    totalStudentsInReport: studentIds.size,
    totalUnpaid: report.filter((item) => item.status === "belum_bayar").length,
  };
}

export async function getSppBillById(id: string) {
  const supabase = requireSupabase();
  const { data, error } = await supabase.from("spp_bills").select("*").eq("id", id).maybeSingle();
  if (error) throw new Error(`Gagal mengambil detail tagihan: ${error.message}`);
  if (!data) return undefined;
  return (await mapBills([data]))[0];
}

export async function getSppBillsByStudent(studentId: string) {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from("spp_bills")
    .select("*")
    .eq("student_id", studentId)
    .order("bill_year", { ascending: false })
    .order("bill_month", { ascending: false });
  if (error) throw new Error(`Gagal mengambil tagihan santri: ${error.message}`);
  return mapBills(data);
}

async function getActiveStudentsForSpp() {
  const supabase = requireSupabase();
  const [studentMap, existingStudents] = await Promise.all([
    getStudentClassMap(),
    supabase
      .from("students")
      .select("id, nis, full_name, class_id, residence_type, status")
      .eq("status", "aktif")
      .order("full_name"),
  ]);

  if (existingStudents.error) {
    throw new Error(`Gagal mengambil santri aktif: ${existingStudents.error.message}`);
  }

  return existingStudents.data.map((student) => {
    const mappedStudent = studentMap.get(student.id);

    return {
      id: student.id,
      class_id: student.class_id,
      className: mappedStudent?.className ?? "Belum ada kelas",
      full_name: student.full_name,
      nis: student.nis,
      residence_type: (student.residence_type ?? "non_mukim") as ResidenceType,
    };
  });
}

async function getExistingBillKeys(month: number, year: number) {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from("spp_bills")
    .select("student_id")
    .eq("bill_month", month)
    .eq("bill_year", year);

  if (error) throw new Error(`Gagal memeriksa tagihan lama: ${error.message}`);

  return new Set(data.map((item) => item.student_id).filter(Boolean));
}

export async function previewMonthlySppBills(
  month: number,
  year: number,
  academicYearId: string,
): Promise<SppGeneratePreviewItem[]> {
  const [students, existingBillKeys, settings] = await Promise.all([
    getActiveStudentsForSpp(),
    getExistingBillKeys(month, year),
    getActiveSppSettings(academicYearId),
  ]);

  const previewItems: SppGeneratePreviewItem[] = [];

  for (const student of students) {
    const amountResult = resolveSppAmountFromSettings(student, settings);

    if (existingBillKeys.has(student.id)) {
      previewItems.push({
        amount: amountResult.ok ? amountResult.amount : null,
        class_id: student.class_id,
        className: student.className,
        due_date: amountResult.ok ? createDueDate(month, year, amountResult.due_day) : null,
        message: "Tagihan bulan ini sudah ada.",
        nis: student.nis,
        residence_type: student.residence_type,
        status: "sudah_ada",
        student_id: student.id,
        studentName: student.full_name,
      });
      continue;
    }

    if (!amountResult.ok) {
      previewItems.push({
        amount: null,
        class_id: student.class_id,
        className: student.className,
        due_date: null,
        message: amountResult.message,
        nis: student.nis,
        residence_type: student.residence_type,
        status: "nominal_belum_diatur",
        student_id: student.id,
        studentName: student.full_name,
      });
      continue;
    }

    previewItems.push({
      amount: amountResult.amount,
      class_id: student.class_id,
      className: student.className,
      due_date: createDueDate(month, year, amountResult.due_day),
      message: "Siap dibuat.",
      nis: student.nis,
      residence_type: student.residence_type,
      status: "akan_dibuat",
      student_id: student.id,
      studentName: student.full_name,
    });
  }

  return previewItems;
}

export async function generateMonthlySppBills(
  month: number,
  year: number,
  academicYearId: string,
): Promise<SppGenerateResult> {
  const supabase = requireSupabase();
  const previewItems = await previewMonthlySppBills(month, year, academicYearId);
  const billPayloads: SppBillInsert[] = previewItems
    .filter((item) => item.status === "akan_dibuat" && item.amount !== null)
    .map((item) => ({
      amount: item.amount ?? 0,
      bill_month: month,
      bill_year: year,
      class_id: item.class_id,
      due_date: item.due_date,
      generated_at: new Date().toISOString(),
      generated_by: "manual",
      note: `Generate manual ${getMonthName(month)} ${year}`,
      status: "belum_bayar",
      student_id: item.student_id,
    }));

  if (billPayloads.length > 0) {
    const { error } = await supabase.from("spp_bills").insert(billPayloads);

    if (error) {
      throw new Error(`Gagal generate tagihan SPP: ${error.message}`);
    }
  }

  return {
    created: billPayloads.length,
    skippedExisting: previewItems.filter((item) => item.status === "sudah_ada").length,
    skippedWithoutAmount: previewItems.filter((item) => item.status === "nominal_belum_diatur").length,
  };
}

export async function createSppBill(data: SppBillFormData) {
  const supabase = requireSupabase();
  validateBillFormData(data);
  const studentMap = await getStudentClassMap();
  const student = studentMap.get(data.student_id);
  const payload = cleanBillPayload(data, student?.class_id ?? null);
  const { data: bill, error } = await supabase.from("spp_bills").insert(payload).select().single();

  if (error) {
    if (error.message.toLowerCase().includes("duplicate")) {
      throw new Error("Tagihan SPP untuk santri ini pada bulan dan tahun tersebut sudah ada.");
    }
    throw new Error(`Gagal membuat tagihan SPP: ${error.message}`);
  }

  return bill;
}

export async function updateSppBill(id: string, data: SppBillFormData) {
  const supabase = requireSupabase();
  validateBillFormData(data);
  const studentMap = await getStudentClassMap();
  const student = studentMap.get(data.student_id);
  const payload = cleanBillUpdatePayload(data, student?.class_id ?? null);
  const { data: bill, error } = await supabase.from("spp_bills").update(payload).eq("id", id).select().single();
  if (error) {
    if (error.code === "23505" || error.message.toLowerCase().includes("duplicate")) {
      throw new Error("Tagihan SPP untuk santri ini pada bulan dan tahun tersebut sudah ada.");
    }

    throw new Error(`Gagal memperbarui tagihan SPP: ${error.message}`);
  }
  await updateSppBillStatus(id);
  return bill;
}

export async function deleteSppBill(id: string) {
  const supabase = requireSupabase();
  const { error } = await supabase.from("spp_bills").delete().eq("id", id);
  if (error) throw new Error(`Gagal menghapus tagihan SPP: ${error.message}`);
  return true;
}

async function getAllPayments() {
  const supabase = requireSupabase();
  const { data, error } = await supabase.from("spp_payments").select("*").order("payment_date", { ascending: false });
  if (error) throw new Error(`Gagal mengambil pembayaran SPP: ${error.message}`);
  return mapPayments(data);
}

export async function getSppPaymentsByBill(billId: string) {
  const supabase = requireSupabase();
  const { data, error } = await supabase.from("spp_payments").select("*").eq("bill_id", billId).order("payment_date", { ascending: false });
  if (error) throw new Error(`Gagal mengambil pembayaran tagihan: ${error.message}`);
  return mapPayments(data);
}

export async function getSppPaymentsByStudent(studentId: string) {
  const supabase = requireSupabase();
  const { data, error } = await supabase.from("spp_payments").select("*").eq("student_id", studentId).order("payment_date", { ascending: false });
  if (error) throw new Error(`Gagal mengambil riwayat pembayaran santri: ${error.message}`);
  return mapPayments(data);
}

export async function createSppPayment(data: SppPaymentFormData) {
  const supabase = requireSupabase();
  validatePaymentFormData(data);
  const bill = await getSppBillById(data.bill_id);

  if (!bill) {
    throw new Error("Tagihan SPP tidak ditemukan.");
  }

  if (Number(data.amount_paid) > bill.remaining) {
    throw new Error("Nominal pembayaran tidak boleh melebihi sisa tagihan.");
  }

  const payload = cleanPaymentPayload(data);
  const { data: payment, error } = await supabase.from("spp_payments").insert(payload).select().single();
  if (error) throw new Error(`Gagal menyimpan pembayaran SPP: ${error.message}`);
  await updateSppBillStatus(data.bill_id);
  return payment;
}

export async function updateSppBillStatus(billId: string) {
  const supabase = requireSupabase();
  const bill = await getSppBillById(billId);
  if (!bill) throw new Error("Tagihan SPP tidak ditemukan.");
  const payments = await getSppPaymentsByBill(billId);
  const totalPaid = payments.reduce((sum, payment) => sum + payment.amount_paid, 0);
  const status = getBillStatus(bill.amount, totalPaid);
  const { error } = await supabase.from("spp_bills").update({ status }).eq("id", billId);
  if (error) throw new Error(`Gagal memperbarui status tagihan: ${error.message}`);
  return status;
}
