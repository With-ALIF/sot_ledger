export type PaymentMethod = 'Bkash' | 'Nagad' | 'Rocket' | 'Bank' | 'Other';

export type SortOption = 'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc' | 'name-asc' | 'name-desc';

export interface Course {
  id: string;
  name: string;
  logo_url: string;
  created_at: string;
}

export interface Payment {
  id: string;
  amount: number;
  method: PaymentMethod;
  phone_number: string;
  label?: string;
  message?: string;
  created_at: string;
  partner?: string;
  course_id?: string;
}

export interface PartnerSummary {
  name: string;
  totalPaid: number;
  targetAmount: number;
  dueAmount: number;
  totalPercentage: number;
  tasks: PartnerTask[];
}

export interface PartnerTask {
  id: string;
  category: string;
  sub_category: string;
  percentage: number;
  partner_name: string | null;
}

export interface PaymentStats {
  totalAmount: number; // General/Old payments only
  count: number;       // General/Old student count
  totalDue: number;
  byMethod: Record<PaymentMethod, number>;
  byCourse: Record<string, number>;
  totalCourseAmount: number;
  totalCourseCount: number;
}

export interface AppSettings {
  id: string;
  telegram_bot_token: string;
  telegram_channel_id: string;
  updated_at: string;
}
