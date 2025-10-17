export interface Professional {
  id: string;
  user_id: string;
  business_name: string;
  business_slug: string;
  phone?: string;
  email: string;
  description?: string;
  address?: string;
  plan: string;
  role?: 'user' | 'admin' | 'moderator';
  subscription_status?: 'active' | 'pending_payment' | 'grace_period' | 'suspended' | 'cancelled' | 'past_due' | 'trial' | 'expired' | 'none';
  created_at: string;
  updated_at: string;
  // Nuevos campos para onboarding y trial
  logo_url?: string;
  whatsapp?: string;
  website?: string;
  instagram?: string;
  business_category?: string;
  branch_count?: number;
  staff_count?: number;
  trial_start_date?: string;
  trial_end_date?: string;
  onboarding_completed?: boolean;
  tutorial_watched?: boolean;
  selected_plan?: string;
}

export interface Notification {
  id: string;
  professional_id: string;
  user_id: string;
  type: 'new_booking' | 'booking_confirmed' | 'booking_cancelled' | 'payment_reminder' | 'subscription_grace_period' | 'subscription_suspended' | 'subscription_expired' | 'system_maintenance' | 'welcome_message' | 'service_created' | 'availability_updated';
  title: string;
  message: string;
  data: Record<string, any>;
  is_read: boolean;
  is_archived: boolean;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  expires_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: string;
  professional_id: string;
  name: string;
  description?: string;
  duration: number; // en minutos
  price: number; // en centavos
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Availability {
  id: string;
  professional_id: string;
  day_of_week: number; // 0=Sunday, 1=Monday, etc.
  start_time: string;
  end_time: string;
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: string;
  professional_id: string;
  service_id: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  booking_date: string;
  booking_time: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface BusinessData {
  name: string;
  description: string;
  rating: number;
  reviewCount: number;
  address: string;
  phone: string;
}

export interface TimeSlot {
  time: string;
  available: boolean;
}

export interface AvailableDate {
  date: string;
  day: string;
  available: boolean;
}

export interface BookingFormData {
  service: Service | null;
  date: string;
  time: string;
  clientName: string;
  clientPhone: string;
}

export interface DashboardStats {
  totalBookings: number;
  thisWeek: number;
  totalRevenue: number;
  averageRating: number;
}

export interface RecentBooking {
  id: number;
  clientName: string;
  service: string;
  date: string;
  time: string;
  status: 'confirmed' | 'pending';
}

// Tipos para formularios
export interface RegisterFormData {
  name: string;
  businessName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface ServiceFormData {
  name: string;
  description: string;
  duration: number;
  price: number;
}

export interface AvailabilityFormData {
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_available: boolean;
} 