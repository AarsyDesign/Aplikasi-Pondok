"use client";

import { Button } from "@/components/ui/Button";

export function PrintButton() {
  return (
    <Button className="no-print" type="button" onClick={() => window.print()}>
      Cetak Raport
    </Button>
  );
}
