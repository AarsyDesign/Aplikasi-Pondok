"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { loginAdmin } from "@/services/authService";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    if (!email || !password) {
      setError("Email dan password wajib diisi.");
      setIsSubmitting(false);
      return;
    }

    const { error: loginError } = await loginAdmin({ email, password });

    if (loginError) {
      setError(loginError.message);
      setIsSubmitting(false);
      return;
    }

    router.replace("/dashboard");
    router.refresh();
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <Input
        autoComplete="email"
        label="Email"
        name="email"
        required
        type="email"
      />
      <Input
        autoComplete="current-password"
        label="Password"
        name="password"
        required
        type="password"
      />
      {error ? (
        <Alert variant="danger">{error}</Alert>
      ) : null}
      <Button className="w-full" isLoading={isSubmitting} type="submit">
        Masuk
      </Button>
    </form>
  );
}
