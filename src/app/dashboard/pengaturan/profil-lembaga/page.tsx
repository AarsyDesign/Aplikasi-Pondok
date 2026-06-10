"use client";

import { useEffect, useState } from "react";
import { InstitutionProfileForm } from "@/components/pengaturan/InstitutionProfileForm";
import { Card } from "@/components/ui/Card";
import { getInstitutionProfile, upsertInstitutionProfile } from "@/services/institutionService";
import { InstitutionProfile, InstitutionProfileFormData } from "@/types/institution";

export default function InstitutionProfilePage() {
  const [profile, setProfile] = useState<InstitutionProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let active = true;
    getInstitutionProfile()
      .then((data) => {
        if (active) setProfile(data);
      })
      .catch((loadError: unknown) => {
        if (active) setError(loadError instanceof Error ? loadError.message : "Gagal memuat profil lembaga.");
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  async function handleSubmit(data: InstitutionProfileFormData) {
    try {
      setIsSaving(true);
      setError("");
      setSuccess("");
      const savedProfile = await upsertInstitutionProfile(data);
      setProfile(savedProfile);
      setSuccess("Profil lembaga berhasil disimpan.");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Gagal menyimpan profil lembaga.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-950">Profil Lembaga</h1>
        <p className="mt-1 text-sm text-slate-600">
          Atur identitas lembaga yang digunakan pada kop dan footer raport.
        </p>
      </div>

      {error ? <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}
      {success ? <div className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{success}</div> : null}

      <Card>
        {isLoading ? (
          <p className="text-sm text-slate-600">Memuat profil lembaga...</p>
        ) : (
          <InstitutionProfileForm
            key={profile?.id ?? "new-institution-profile"}
            initialData={profile}
            isSaving={isSaving}
            onSubmit={handleSubmit}
          />
        )}
      </Card>
    </div>
  );
}
