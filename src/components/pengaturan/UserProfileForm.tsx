"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { isUserRole, roleLabels, type Profile, type ProfileFormData, type UserRole } from "@/types/profile";

const roleOptions = [
  { label: "Pilih role", value: "" },
  { label: roleLabels.admin, value: "admin" },
  { label: roleLabels.guru, value: "guru" },
  { label: roleLabels.bendahara, value: "bendahara" },
];

type UserProfileFormProps = {
  currentUserId: string;
  initialProfile?: Profile | null;
  isSaving: boolean;
  onCancel: () => void;
  onSubmit: (data: ProfileFormData, profileId?: string) => Promise<void>;
};

export function UserProfileForm({
  currentUserId,
  initialProfile,
  isSaving,
  onCancel,
  onSubmit,
}: UserProfileFormProps) {
  const [userId, setUserId] = useState(initialProfile?.user_id ?? "");
  const [fullName, setFullName] = useState(initialProfile?.full_name ?? "");
  const [role, setRole] = useState<UserRole | "">(initialProfile?.role ?? "");
  const [error, setError] = useState("");

  const isEditing = Boolean(initialProfile);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const cleanUserId = userId.trim();
    const cleanFullName = fullName.trim();

    if (!cleanUserId) {
      setError("User ID wajib diisi.");
      return;
    }

    if (!cleanFullName) {
      setError("Nama Lengkap wajib diisi.");
      return;
    }

    if (!isUserRole(role)) {
      setError("Role wajib dipilih.");
      return;
    }

    if (
      initialProfile?.user_id === currentUserId &&
      initialProfile.role === "admin" &&
      role !== "admin"
    ) {
      const confirmed = window.confirm(
        "Anda sedang mengubah role akun yang sedang digunakan. Setelah disimpan, akses Anda bisa berubah.",
      );

      if (!confirmed) {
        return;
      }
    }

    await onSubmit(
      {
        user_id: cleanUserId,
        full_name: cleanFullName,
        role,
      },
      initialProfile?.id,
    );
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="grid gap-4 md:grid-cols-3">
        <Input
          disabled={isEditing || isSaving}
          label="User ID"
          onChange={(event) => setUserId(event.target.value)}
          placeholder="UUID dari Supabase Auth"
          value={userId}
        />
        <Input
          disabled={isSaving}
          label="Nama Lengkap"
          onChange={(event) => setFullName(event.target.value)}
          placeholder="Nama pengguna"
          value={fullName}
        />
        <Select
          disabled={isSaving}
          label="Role"
          onChange={(event) => {
            const nextRole = event.target.value;
            setRole(isUserRole(nextRole) ? nextRole : "");
          }}
          options={roleOptions}
          value={role}
        />
      </div>

      {isEditing ? (
        <p className="text-xs text-slate-500">
          User ID tidak diubah saat edit profil.
        </p>
      ) : null}

      {error ? (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <div className="flex flex-wrap gap-2">
        <Button disabled={isSaving} type="submit">
          {isSaving ? "Menyimpan..." : isEditing ? "Simpan Perubahan" : "Tambah Profil"}
        </Button>
        <Button disabled={isSaving} onClick={onCancel} type="button" variant="secondary">
          Batal
        </Button>
      </div>
    </form>
  );
}
