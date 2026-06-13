import { Badge, type BadgeVariant } from "@/components/ui/Badge";
import type { ReactNode } from "react";
import type { SppBillStatus } from "@/types/spp";
import type { TeacherAttendanceStatus } from "@/types/teacherAttendance";

type BasicStatus = "aktif" | "nonaktif";
type RoleStatus = "admin" | "guru" | "bendahara";

type StatusBadgeProps = {
  children?: ReactNode;
  status: BasicStatus | RoleStatus | SppBillStatus | TeacherAttendanceStatus | string;
};

function getStatusLabel(status: string) {
  const labels: Record<string, string> = {
    admin: "Admin",
    aktif: "Aktif",
    alfa: "Alfa",
    belum_bayar: "Belum Bayar",
    bendahara: "Bendahara",
    guru: "Guru",
    hadir: "Hadir",
    izin: "Izin",
    lunas: "Lunas",
    mukim: "Mukim",
    nonaktif: "Nonaktif",
    non_mukim: "Non Mukim",
    sakit: "Sakit",
    sebagian: "Sebagian",
  };

  return labels[status] ?? status;
}

function getStatusVariant(status: string): BadgeVariant {
  if (["aktif", "admin", "guru", "bendahara", "hadir", "lunas", "mukim"].includes(status)) {
    return "success";
  }

  if (["izin", "sebagian", "non_mukim"].includes(status)) {
    return "warning";
  }

  if (["alfa", "belum_bayar", "nonaktif"].includes(status)) {
    return "danger";
  }

  if (status === "sakit") {
    return "info";
  }

  return "muted";
}

export function StatusBadge({ children, status }: StatusBadgeProps) {
  return (
    <Badge variant={getStatusVariant(status)}>
      {children ?? getStatusLabel(status)}
    </Badge>
  );
}
