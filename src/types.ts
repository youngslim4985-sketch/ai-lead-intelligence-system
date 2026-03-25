export type LeadStatus = 'pending' | 'scraping' | 'enriching' | 'verifying' | 'completed' | 'failed';

export interface Lead {
  id: string;
  companyName: string;
  website: string;
  location?: string;
  email?: string;
  isVerified?: boolean;
  isIdeal?: boolean;
  status: LeadStatus;
  summary?: string;
  icebreaker?: string;
  subjectLine?: string;
  emailBody?: string;
  enrichedAt?: string;
}

export interface DashboardStats {
  totalLeads: number;
  enrichedLeads: number;
  verifiedEmails: number;
  idealLeads: number;
}
