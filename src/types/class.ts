export type ClassGroup = {
  id: string;
  name: string;
  level: string | null;
  description: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export type ClassFormData = {
  name: string;
  level: string;
  description: string;
};
