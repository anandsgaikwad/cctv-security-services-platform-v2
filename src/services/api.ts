import {
  AMCContract,
  AMCPlan,
  AuditLogEntry,
  Customer,
  FAQItem,
  Lead,
  LeadStatus,
  Product,
  Project,
  RechargePlan,
  Review,
  ServiceArea,
  ServiceDetail,
  ServiceRequest,
  SolutionDetail,
  Subscription,
  TicketStatus,
  Transaction,
  User,
} from '../types';

export const authApi = {
  getMe: async (): Promise<{ user: User }> => {
    const res = await fetch('/api/auth/me');
    return res.json();
  },
  switchRole: async (role: string): Promise<{ success: boolean; user: User }> => {
    const res = await fetch('/api/auth/switch-role', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role }),
    });
    return res.json();
  },
  sendOtp: async (phone: string): Promise<{ success: boolean; demoOtp: string; message: string }> => {
    const res = await fetch('/api/auth/otp/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone }),
    });
    return res.json();
  },
  verifyOtp: async (phone: string, otp: string, name?: string): Promise<{ success: boolean; user: User; customer: Customer }> => {
    const res = await fetch('/api/auth/otp/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, otp, name }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Verification failed');
    }
    return res.json();
  },
};

export const leadsApi = {
  bookSiteSurvey: async (data: {
    name: string;
    phone: string;
    email?: string;
    property_type: string;
    city_area: string;
    preferred_date: string;
    requirement?: string;
  }): Promise<{ success: boolean; lead: Lead; message: string }> => {
    const res = await fetch('/api/leads/site-survey', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to submit site survey');
    }
    return res.json();
  },
  requestQuote: async (data: {
    name: string;
    phone: string;
    property_type: string;
    camera_count: number;
    storage_days: number;
    need_audio: boolean;
    night_vision_type: string;
  }): Promise<{ success: boolean; lead: Lead; message: string }> => {
    const res = await fetch('/api/leads/quote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to request quote');
    }
    return res.json();
  },
  productEnquiry: async (data: { name: string; phone: string; product_name: string; message?: string }) => {
    const res = await fetch('/api/leads/product-enquiry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },
  updateLeadStatus: async (id: string, status: LeadStatus, note?: string): Promise<{ success: boolean; lead: Lead }> => {
    const res = await fetch(`/api/leads/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, note }),
    });
    return res.json();
  },
};

export const catalogApi = {
  getServices: async (): Promise<{ services: ServiceDetail[] }> => {
    const res = await fetch('/api/catalog/services');
    return res.json();
  },
  getServiceBySlug: async (slug: string): Promise<{ service: ServiceDetail }> => {
    const res = await fetch(`/api/catalog/services/${slug}`);
    return res.json();
  },
  getSolutions: async (): Promise<{ solutions: SolutionDetail[] }> => {
    const res = await fetch('/api/catalog/solutions');
    return res.json();
  },
  getSolutionBySlug: async (slug: string): Promise<{ solution: SolutionDetail }> => {
    const res = await fetch(`/api/catalog/solutions/${slug}`);
    return res.json();
  },
  getProducts: async (category?: string): Promise<{ products: Product[] }> => {
    const url = category && category !== 'all' ? `/api/catalog/products?category=${category}` : '/api/catalog/products';
    const res = await fetch(url);
    return res.json();
  },
  compareAndRecommend: async (params: {
    location_type: string;
    lighting_condition: string;
    need_audio: boolean;
    need_active_deterrence: boolean;
    budget_tier: string;
  }): Promise<{ recommended_product: Product; rationale: string; alternative_options: Product[] }> => {
    const res = await fetch('/api/catalog/compare', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    return res.json();
  },
  getCategories: async (): Promise<{ categories: any[] }> => {
    const res = await fetch('/api/catalog/categories');
    return res.json();
  },
  getProjects: async (): Promise<{ projects: Project[] }> => {
    const res = await fetch('/api/content/projects');
    return res.json();
  },
  getFaqs: async (): Promise<{ faqs: FAQItem[] }> => {
    const res = await fetch('/api/content/faqs');
    return res.json();
  },
};

export const amcApi = {
  getPlans: async (): Promise<{ plans: AMCPlan[] }> => {
    const res = await fetch('/api/amc/plans');
    return res.json();
  },
  bookPlan: async (data: {
    plan_id: string;
    customer_name: string;
    customer_phone: string;
    property_type: string;
    camera_count: number;
    address?: string;
  }): Promise<{ success: boolean; contract: AMCContract; message: string }> => {
    const res = await fetch('/api/amc/book', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },
};

export const rechargeApi = {
  verifySubscription: async (query: { customerIdOrMobile?: string; subscriptionId?: string }) => {
    const res = await fetch('/api/subscriptions/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(query),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error + (err.suggestion ? ` (${err.suggestion})` : ''));
    }
    return res.json();
  },
  getEligiblePlans: async (subId: string): Promise<{ subscription: Subscription; plans: RechargePlan[] }> => {
    const res = await fetch(`/api/subscriptions/${subId}/plans`);
    return res.json();
  },
  getRenewalQuote: async (subId: string, planId: string): Promise<{
    subscriptionId: string;
    plan: RechargePlan;
    amount: number;
    currentExpiry: string;
    newExpiry: string;
    renewalRule: string;
  }> => {
    const res = await fetch(`/api/subscriptions/${subId}/renewal-quote`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ planId }),
    });
    return res.json();
  },
};

export const paymentsApi = {
  createSession: async (data: {
    subscriptionId: string;
    planId: string;
    amount: number;
    customerName?: string;
    customerPhone?: string;
  }): Promise<{
    orderId: string;
    transactionId: string;
    amount: number;
    currency: string;
    keyId: string;
    quotedNewExpiry: string;
  }> => {
    const res = await fetch('/api/payments/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },
  simulatePaymentSuccess: async (orderId: string): Promise<{ success: boolean; transaction: Transaction }> => {
    const res = await fetch('/api/payments/simulate-success', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId }),
    });
    return res.json();
  },
  getReceipt: async (txnId: string) => {
    const res = await fetch(`/api/payments/${txnId}/receipt`);
    if (!res.ok) throw new Error('Receipt not found');
    return res.json();
  },
};

export const ticketsApi = {
  createTicket: async (data: {
    category: string;
    description: string;
    customer_name: string;
    customer_phone: string;
    preferred_visit_time?: string;
  }): Promise<{ success: boolean; ticket: ServiceRequest; message: string }> => {
    const res = await fetch('/api/service-requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },
  getTickets: async (): Promise<{ tickets: ServiceRequest[] }> => {
    const res = await fetch('/api/service-requests');
    return res.json();
  },
  updateTicketStatus: async (id: string, status: TicketStatus, notes?: string): Promise<{ success: boolean; ticket: ServiceRequest }> => {
    const res = await fetch(`/api/service-requests/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, resolution_notes: notes }),
    });
    return res.json();
  },
};

export const reviewApi = {
  getReviews: async (): Promise<{ reviews: Review[] }> => {
    const res = await fetch('/api/content/reviews');
    return res.json();
  },
  submitReview: async (data: {
    customer_name: string;
    customer_type?: string;
    location?: string;
    rating: number;
    review_text: string;
  }): Promise<{ success: boolean; review: Review }> => {
    const res = await fetch('/api/content/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },
};

export const contentApi = {
  getProjects: async (): Promise<{ projects: Project[] }> => {
    const res = await fetch('/api/content/projects');
    return res.json();
  },
  getReviews: async (): Promise<{ reviews: Review[] }> => {
    const res = await fetch('/api/content/reviews');
    return res.json();
  },
  getFaqs: async (): Promise<{ faqs: FAQItem[] }> => {
    const res = await fetch('/api/content/faqs');
    return res.json();
  },
  getServiceAreas: async (): Promise<{ areas: ServiceArea[] }> => {
    const res = await fetch('/api/content/service-areas');
    return res.json();
  },
};

export const chatbotApi = {
  sendMessage: async (text: string, category?: string) => {
    const res = await fetch('/api/chatbot/message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, category }),
    });
    return res.json();
  },
};

export const adminApi = {
  getLeads: async (): Promise<{ leads: Lead[] }> => {
    const res = await fetch('/api/admin/leads');
    return res.json();
  },
  getCustomers: async (): Promise<{ customers: Customer[] }> => {
    const res = await fetch('/api/admin/customers');
    return res.json();
  },
  getSubscribers: async (): Promise<{ subscribers: Subscription[] }> => {
    const res = await fetch('/api/admin/recharge/subscribers');
    return res.json();
  },
  getTransactions: async (): Promise<{ transactions: Transaction[] }> => {
    const res = await fetch('/api/admin/recharge/transactions');
    return res.json();
  },
  getAuditLogs: async (): Promise<{ logs: AuditLogEntry[] }> => {
    const res = await fetch('/api/admin/audit-logs');
    return res.json();
  },
  extendSubscription: async (id: string, additional_days: number, reason: string) => {
    const res = await fetch(`/api/admin/recharge/subscriptions/${id}/extend`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ additional_days, reason }),
    });
    return res.json();
  },
  cancelSubscription: async (id: string, reason: string) => {
    const res = await fetch(`/api/admin/recharge/subscriptions/${id}/cancel`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason }),
    });
    return res.json();
  },
  getReports: async (type: string = 'sales') => {
    const res = await fetch(`/api/admin/reports/${type}`);
    return res.json();
  },
};
