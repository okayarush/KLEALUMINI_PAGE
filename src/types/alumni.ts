export type AlumniStatus = 'pending' | 'approved' | 'rejected';

export interface Alumni {
  id: string;
  name: string;
  batch_year: number;
  department?: string;
  description?: string;
  quote?: string;
  image_url?: string;
  image_path?: string;
  status: AlumniStatus;
  submitted_at: string;
  reviewed_at?: string;
  linkedin_url?: string;
  current_role?: string;
  current_company?: string;
}

export interface SubmissionFormData {
  name: string;
  batch_year: string;
  department: string;
  description: string;
  quote: string;
  current_role: string;
  current_company: string;
  linkedin_url: string;
  image: File | null;
}
