"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SantriForm } from "@/components/santri/SantriForm";
import { Card } from "@/components/ui/Card";
import { getClasses } from "@/services/classService";
import { createStudent } from "@/services/studentService";
import { ClassGroup } from "@/types/class";
import { StudentFormData } from "@/types/student";

export default function TambahSantriPage() {
  const router = useRouter();
  const [classes, setClasses] = useState<ClassGroup[]>([]);
  const [isLoadingClasses, setIsLoadingClasses] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let isActive = true;

    getClasses()
      .then((classData) => {
        if (isActive) {
          setClasses(classData);
        }
      })
      .catch(() => {
        if (isActive) {
          setClasses([]);
        }
      })
      .finally(() => {
        if (isActive) {
          setIsLoadingClasses(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, []);

  async function handleSubmit(data: StudentFormData) {
    try {
      setIsSaving(true);
      setError("");
      await createStudent(data);
      router.push("/dashboard/santri");
      router.refresh();
    } catch (createError) {
      setError(createError instanceof Error ? createError.message : "Gagal menambah santri.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-950">Tambah Santri</h1>
        <p className="mt-1 text-sm text-slate-600">
          Lengkapi data dasar santri untuk masuk ke daftar santri.
        </p>
      </div>

      {error ? (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <Card>
        {isLoadingClasses ? (
          <p className="text-sm text-slate-600">Memuat pilihan kelas...</p>
        ) : (
          <SantriForm
            classes={classes}
            submitLabel="Tambah Santri"
            isSaving={isSaving}
            onSubmit={handleSubmit}
          />
        )}
      </Card>
    </div>
  );
}
