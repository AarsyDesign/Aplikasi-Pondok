"use client";

import { useEffect, useState } from "react";
import { UserProfileForm } from "@/components/pengaturan/UserProfileForm";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Table } from "@/components/ui/Table";
import {
  createProfile,
  deleteProfile,
  getProfiles,
  updateProfile,
} from "@/services/profileService";
import { roleLabels, type Profile, type ProfileFormData } from "@/types/profile";

function formatDate(value: string | null) {
  if (!value) {
    return "-";
  }

  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function roleBadgeClass(role: Profile["role"]) {
  if (role === "admin") {
    return "bg-emerald-50 text-emerald-700";
  }

  if (role === "guru") {
    return "bg-sky-50 text-sky-700";
  }

  return "bg-slate-100 text-slate-700";
}

export function UserProfileTable({ currentUserId }: { currentUserId: string }) {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function loadProfiles() {
    setIsLoading(true);
    setError("");

    try {
      const data = await getProfiles();
      setProfiles(data);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Gagal mengambil daftar profil pengguna.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    let ignore = false;

    getProfiles()
      .then((data) => {
        if (!ignore) {
          setProfiles(data);
        }
      })
      .catch((caughtError) => {
        if (!ignore) {
          setError(
            caughtError instanceof Error
              ? caughtError.message
              : "Gagal mengambil daftar profil pengguna.",
          );
        }
      })
      .finally(() => {
        if (!ignore) {
          setIsLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  async function handleSubmit(data: ProfileFormData, profileId?: string) {
    setIsSaving(true);
    setError("");
    setMessage("");

    try {
      if (profileId) {
        await updateProfile(profileId, {
          full_name: data.full_name,
          role: data.role,
        });
        setMessage("Profil pengguna berhasil diperbarui.");
      } else {
        await createProfile(data);
        setMessage("Profil pengguna berhasil ditambahkan.");
      }

      setEditingProfile(null);
      setIsFormOpen(false);
      await loadProfiles();
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Gagal menyimpan profil pengguna.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(profile: Profile) {
    setError("");
    setMessage("");

    if (profile.user_id === currentUserId) {
      setError("Anda tidak dapat menghapus profil akun yang sedang digunakan.");
      return;
    }

    const confirmed = window.confirm(
      "Hapus profil pengguna ini? Menghapus profil tidak menghapus akun login di Supabase Auth.",
    );

    if (!confirmed) {
      return;
    }

    setIsSaving(true);

    try {
      await deleteProfile(profile.id);
      setMessage("Profil pengguna berhasil dihapus.");
      await loadProfiles();
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Gagal menghapus profil pengguna.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  const columns = [
    {
      header: "No",
      cell: (_profile: Profile, index: number) => index + 1,
    },
    {
      header: "Nama Lengkap",
      cell: (profile: Profile) => (
        <div>
          <p className="font-medium text-slate-900">{profile.full_name}</p>
          {profile.user_id === currentUserId ? (
            <p className="mt-1 text-xs text-slate-500">Akun sedang digunakan</p>
          ) : null}
        </div>
      ),
    },
    {
      header: "User ID",
      cell: (profile: Profile) => (
        <span className="break-all font-mono text-xs text-slate-600">
          {profile.user_id}
        </span>
      ),
    },
    {
      header: "Role",
      cell: (profile: Profile) => (
        <span
          className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${roleBadgeClass(profile.role)}`}
        >
          {roleLabels[profile.role]}
        </span>
      ),
    },
    {
      header: "Dibuat Pada",
      cell: (profile: Profile) => formatDate(profile.created_at),
    },
    {
      header: "Aksi",
      cell: (profile: Profile) => (
        <div className="flex flex-wrap gap-2">
          <Button
            disabled={isSaving}
            onClick={() => {
              setEditingProfile(profile);
              setIsFormOpen(true);
              setError("");
              setMessage("");
            }}
            type="button"
            variant="secondary"
          >
            Edit
          </Button>
          <Button
            disabled={isSaving}
            onClick={() => void handleDelete(profile)}
            type="button"
            variant="ghost"
          >
            Hapus
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <Card>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-950">
              Profil Pengguna
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Menghapus profil tidak menghapus akun login di Supabase Auth.
            </p>
          </div>
          {!isFormOpen ? (
            <Button
              onClick={() => {
                setEditingProfile(null);
                setIsFormOpen(true);
                setError("");
                setMessage("");
              }}
              type="button"
            >
              Tambah Profil Pengguna
            </Button>
          ) : null}
        </div>

        {isFormOpen ? (
          <div className="mt-5 border-t border-slate-200 pt-5">
            <UserProfileForm
              key={editingProfile?.id ?? "new-profile"}
              currentUserId={currentUserId}
              initialProfile={editingProfile}
              isSaving={isSaving}
              onCancel={() => {
                setEditingProfile(null);
                setIsFormOpen(false);
              }}
              onSubmit={handleSubmit}
            />
          </div>
        ) : null}
      </Card>

      {message ? (
        <div className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {message}
        </div>
      ) : null}

      {error ? (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {isLoading ? (
        <Card>
          <p className="text-sm text-slate-600">Memuat profil pengguna...</p>
        </Card>
      ) : (
        <Table
          columns={columns}
          data={profiles}
          emptyText="Belum ada profil pengguna."
          getRowKey={(profile) => profile.id}
        />
      )}
    </div>
  );
}
