"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SantriForm } from "@/components/santri/SantriForm";
import { getClasses } from "@/services/classService";
import { deleteStudent, getStudentById, updateStudent } from "@/services/studentService";
import { ClassGroup } from "@/types/class";
import { Student, StudentFormData } from "@/types/student";

function DetailItem({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div>
      <dt className="text-sm text-slate-500">{label}</dt>
      <dd className="mt-1 font-medium text-slate-950">{value || "-"}</dd>
    </div>
  );
}

export function SantriDetail({ id }: { id: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [student, setStudent] = useState<Student | null>(null);
  const [classes, setClasses] = useState<ClassGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(searchParams.get("mode") === "edit");
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let isActive = true;

    Promise.all([getStudentById(id), getClasses().catch(() => [])])
      .then(([studentData, classData]) => {
        if (!isActive) {
          return;
        }

        setStudent(studentData ?? null);
        setClasses(classData);
      })
      .catch((loadError: unknown) => {
        if (isActive) {
          setError(loadError instanceof Error ? loadError.message : "Gagal memuat detail santri.");
        }
      })
      .finally(() => {
        if (isActive) {
          setIsLoading(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, [id]);

  async function handleUpdate(data: StudentFormData) {
    try {
      setIsSaving(true);
      setError("");
      await updateStudent(id, data);
      const refreshedStudent = await getStudentById(id);
      setStudent(refreshedStudent ?? null);
      setIsEditing(false);
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : "Gagal menyimpan perubahan.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete() {
    if (!student) {
      return;
    }

    const confirmed = window.confirm(`Hapus data santri ${student.full_name}?`);

    if (!confirmed) {
      return;
    }

    try {
      setIsDeleting(true);
      setError("");
      await deleteStudent(student.id);
      router.push("/dashboard/santri");
      router.refresh();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Gagal menghapus santri.");
      setIsDeleting(false);
    }
  }

  if (isLoading) {
    return <Card>Memuat detail santri...</Card>;
  }

  if (error && !student) {
    return <Card className="border-red-200 bg-red-50 text-red-700">{error}</Card>;
  }

  if (!student) {
    return <Card>Data santri tidak ditemukan.</Card>;
  }

  return (
    <div className="space-y-6">
      {error ? (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button type="button" variant="secondary" onClick={() => router.push("/dashboard/santri")}>
          Kembali
        </Button>
        <Button type="button" variant="secondary" onClick={() => setIsEditing(true)}>
          Edit
        </Button>
        <Button type="button" className="bg-red-700 hover:bg-red-800" onClick={handleDelete} disabled={isDeleting}>
          {isDeleting ? "Menghapus..." : "Hapus"}
        </Button>
      </div>

      {isEditing ? (
        <Card>
          <h2 className="mb-4 text-lg font-semibold text-slate-950">Edit Data Santri</h2>
          <SantriForm
            classes={classes}
            initialData={student}
            submitLabel="Simpan Perubahan"
            isSaving={isSaving}
            onSubmit={handleUpdate}
            onCancel={() => setIsEditing(false)}
          />
        </Card>
      ) : (
        <Card>
          <dl className="grid gap-5 sm:grid-cols-2">
            <DetailItem label="NIS" value={student.nis} />
            <DetailItem label="Nama Lengkap" value={student.full_name} />
            <DetailItem label="Jenis Kelamin" value={student.gender} />
            <DetailItem label="Tempat Lahir" value={student.birth_place} />
            <DetailItem label="Tanggal Lahir" value={student.birth_date} />
            <DetailItem label="Nama Wali" value={student.guardian_name} />
            <DetailItem label="Nomor Wali" value={student.guardian_phone} />
            <DetailItem label="Kelas / Marhalah" value={student.className} />
            <DetailItem label="Status" value={student.status} />
            <div className="sm:col-span-2">
              <DetailItem label="Alamat" value={student.address} />
            </div>
          </dl>
        </Card>
      )}
    </div>
  );
}
