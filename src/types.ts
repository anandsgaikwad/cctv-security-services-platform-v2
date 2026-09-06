export type Role = 'customer' | 'staff' | 'admin' | 'technician';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  created_at: string;
}

export interface Customer {
  id: string;
  user_id?: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  property_type: string;
  service_area: string;
  created_at: string;
}

export type LeadType = 'survey' | 'quote' | 'repair' | 'amc' | 'product' | 'recharge_support' | 'general';
export type LeadStatus = 'new' | 'contacted' | 'site_survey' | 'quotation' | 'negotiation' | 'won' | 'lost';

export interface LeadNote {
  date: string;
  author: string;
  note: string;
}

export interface Lead {
  id: string;
  customer_id?: string | null;
  name: string;
  phone: string;
  email?: string;
  type: LeadType;
  source: string;
  requirement: string;
  status: LeadStatus;
  assigned_to?: string;
  property_type?: string;
  city_area?: string;
  preferred_date?: string;
  notes: LeadNote[];
  created_at: string;
}

export type TicketStatus = 'open' | 'assigned' | 'en_route' | 'in_progress' | 'resolved' | 'closed';

export interface ServiceRequest {
  id: string;
  customer_id: string;
  customer_name: string;
  customer_phone: string;
  category: string;
  description: string;
  attachments: string[];
  status: TicketStatus;
  technician_id?: string;
  technician_name?: string;
  preferred_visit_time?: string;
  created_at: string;
  resolution_notes?: string;
}

export interface Product {
  id: string;
  name: string;
  category: 'ip-cameras' | 'hd-analog' | 'ptz-cameras' | 'dvr-nvr' | 'wifi-smart' | 'accessories';
  brand: string;
  specifications: {
    resolution: string;
    lens: string;
    night_vision: string;
    weatherproof: string;
    storage_support: string;
    power_source: string;
    ai_features?: string;
  };
  price: number;
  is_active: boolean;
  image_url: string;
  tagline: string;
  recommended_for: string;
}

export interface AMCPlan {
  id: string;
  name: string;
  tier: 'basic' | 'standard' | 'premium';
  duration_months: number;
  price: number;
  features: string[];
  max_visits: number;
  emergency_support: string;
  spare_parts_included: boolean;
  best_for: string;
}

export interface AMCContract {
  id: string;
  customer_id: string;
  customer_name: string;
  customer_phone: string;
  plan_id: string;
  plan_name: string;
  property_type: string;
  camera_count: number;
  start_date: string;
  end_date: string;
  status: 'active' | 'expiring' | 'expired';
  created_at: string;
}

export type BillingCycle = 'monthly' | 'quarterly' | 'half_yearly' | 'yearly';

export interface RechargePlan {
  id: string;
  provider_service: string;
  name: string;
  billing_cycle: BillingCycle;
  duration_days: number;
  price: number;
  promo_price?: number;
  is_active: boolean;
  cloud_storage_days: number;
  sim_data_allowance: string;
  features: string[];
}

export interface Subscription {
  id: string;
  customer_id: string;
  customer_name: string;
  customer_phone: string;
  provider_service: string;
  plan_id: string;
  plan_name: string;
  start_date: string;
  expiry_date: string;
  status: 'active' | 'expiring' | 'expired' | 'cancelled';
  renewal_rule: 'from_expiry' | 'from_payment_date';
  camera_count?: number;
  sim_number?: string;
  location?: string;
}

export type TransactionStatus = 'initiated' | 'pending' | 'success' | 'failed' | 'refunded';

export interface Transaction {
  id: string;
  subscription_id?: string;
  customer_id: string;
  customer_name: string;
  customer_phone: string;
  amount: number;
  gateway: string;
  gateway_reference: string;
  status: TransactionStatus;
  created_at: string;
  verified_at?: string;
  quoted_new_expiry?: string;
  plan_name?: string;
}

export interface Project {
  id: string;
  title: string;
  category: string;
  location: string;
  camera_count: number;
  problem: string;
  solution: string;
  images: string[];
  equipment_used: string[];
  completion_date: string;
}

export interface Review {
  id: string;
  customer_name: string;
  customer_type: string;
  rating: number;
  review_text: string;
  service: string;
  location: string;
  is_published: boolean;
  date: string;
}

export interface ServiceDetail {
  id: string;
  slug: string;
  title: string;
  short_desc: string;
  full_desc: string;
  icon: string;
  benefits: string[];
  process_steps: { step: number; title: string; desc: string }[];
  starting_price: number;
  ideal_for: string;
}

export interface SolutionDetail {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  recommended_cameras: string;
  key_challenges: string[];
  solutions_offered: string[];
  package_estimate: string;
  icon: string;
}

export interface ServiceArea {
  id: string;
  name: string;
  district: string;
  pincodes: string[];
  eta_hours: number;
  active: boolean;
}

export interface FAQItem {
  id: string;
  category: 'general' | 'installation' | 'amc' | 'recharge' | 'technical';
  question: string;
  answer: string;
}

export interface AuditLogEntry {
  id: string;
  actor_id: string;
  actor_name: string;
  action: string;
  entity_type: string;
  entity_id: string;
  before?: any;
  after?: any;
  created_at: string;
}

export interface NotificationEvent {
  id: string;
  event_type: string;
  recipient: string;
  channel: 'email' | 'whatsapp' | 'sms';
  status: 'sent' | 'pending' | 'failed';
  content?: string;
  sent_at: string;
}
