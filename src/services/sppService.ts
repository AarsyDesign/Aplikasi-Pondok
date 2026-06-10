import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Database, SppBill as SppBillRow, SppPayment as SppPaymentRow } from "@/types/database";
import {
  SppBill,
  SppBillFilters,
  SppBillFormData,
  SppPayment,
  SppPaymentFormData,
  SppArrearsFilters,
  SppArrearsReportItem,
  SppArrearsSummary,
  SppReminderData,
  SppReminderFilters,
  SppSummary,
} from "@/types/spp";

type SppBillInsert = Database["public"]["Tables"]["spp_bills"]["Insert"];
type SppBillUpdate = Database["public"]["Tables"]["spp_bills"]["Update"];
type SppPaymentInsert = Database["public"]["Tables"]["spp_payments"]["Insert"];

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
    status: "belum_bayar",
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

async function getStudentClassMap() {
  const supabase = requireSupabase();
  const [{ data: students, error: studentError }, { data: classes, error: classError }] =
    await Promise.all([
      supabase.from("students").select("id, full_name, nis, guardian_name, guardian_phone, class_id"),
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
        studentName: student.full_name,
      },
    ]),
  );
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
      nis: student?.nis ?? null,
      note: row.note,
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
  return mapBills(data);
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
  if (!filters.status) return report;

  return report.filter((item) => item.status === filters.status);
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

export async function createSppBill(data: SppBillFormData) {
  const supabase = requireSupabase();
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
  const studentMap = await getStudentClassMap();
  const student = studentMap.get(data.student_id);
  const payload = cleanBillUpdatePayload(data, student?.class_id ?? null);
  const { data: bill, error } = await supabase.from("spp_bills").update(payload).eq("id", id).select().single();
  if (error) throw new Error(`Gagal memperbarui tagihan SPP: ${error.message}`);
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
