export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function isValidOptionalPhoneNumber(phone: string) {
  const value = phone.trim();

  if (!value) {
    return true;
  }

  return /^[0-9+\-\s()]{8,20}$/.test(value);
}

export function isPositiveNumber(value: string) {
  const number = Number(value);
  return Number.isFinite(number) && number > 0;
}

export function isValidYear(value: string) {
  return /^\d{4}$/.test(value) && Number(value) >= 2000;
}

export function formatResidenceType(value: string | null | undefined) {
  if (value === "mukim") {
    return "Mukim";
  }

  return "Non Mukim";
}
