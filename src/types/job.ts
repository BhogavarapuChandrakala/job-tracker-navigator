
export type JobStatus = 'Applied' | 'Interview' | 'Offer' | 'Rejected';

export interface Job {
  _id?: string;
  company: string;
  role: string;
  status: JobStatus;
  date: string; // ISO date string
  link: string;
}

export interface JobFormData {
  company: string;
  role: string;
  status: JobStatus;
  date: string;
  link: string;
}
