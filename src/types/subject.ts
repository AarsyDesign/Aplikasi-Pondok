export type Subject = {
  id: string;
  name: string;
  class_id: string | null;
  classId: string | null;
  className: string;
  description: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export type SubjectFormData = {
  name: string;
  class_id: string;
  description: string;
};
