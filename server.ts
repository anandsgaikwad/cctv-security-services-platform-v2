import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import {
  AMC_PLANS,
  FAQS_DATA,
  INITIAL_CUSTOMERS,
  INITIAL_LEADS,
  INITIAL_SUBSCRIPTIONS,
  INITIAL_TRANSACTIONS,
  INITIAL_USERS,
  OWNER_CONTACTS,
  PRODUCTS_DATA,
  PROJECTS_DATA,
  RECHARGE_PLANS,
  REVIEWS_DATA,
  SERVICE_AREAS,
  SERVICES_DATA,
  SOLUTIONS_DATA,
} from './src/data/mockData';
import {
  AMCContract,
  AuditLogEntry,
  Customer,
  Lead,
  NotificationEvent,
  Product,
  RechargePlan,
  Review,
  ServiceRequest,
  Subscription,
  Transaction,
  User,
} from './src/types';

const app = express();
const PORT = 3000;

app.use(express.json());

// In-Memory Database Stores (seeded from initial constants)
let leadsStore: Lead[] = [...INITIAL_LEADS];
let customersStore: Customer[] = [...INITIAL_CUSTOMERS];
let subscriptionsStore: Subscription[] = [...INITIAL_SUBSCRIPTIONS];
let transactionsStore: Transaction[] = [...INITIAL_TRANSACTIONS];
let amcContractsStore: AMCContract[] = [
  {
    id: 'AMC-771',
    customer_id: 'cust-1',
    customer_name: 'Pooja Patil',
    customer_phone: '+919860123456',
    plan_id: 'amc-standard',
    plan_name: 'Comprehensive Shield AMC',
    property_type: 'Retail Shop',
    camera_count: 4,
    start_date: '2025-10-15',
    end_date: '2026-10-14',
    status: 'active',
    created_at: '2025-10-15T10:00:00Z',
  },
];
let serviceRequestsStore: ServiceRequest[] = [
  {
    id: 'TKT-1001',
    customer_id: 'cust-2',
    customer_name: 'Vikram Mehta',
    customer_phone: '+919823456789',
    category: 'Night Vision Glitch',
    description: 'Backyard camera IR LEDs flickering when outdoor garden lights switch off.',
    attachments: [],
    status: 'assigned',
    technician_id: 'user-tech',
    technician_name: 'Rahul Kadam',
    preferred_visit_time: 'Tomorrow 2 PM - 4 PM',
    created_at: '2026-03-04T10:30:00Z',
  },
];
let auditLogsStore: AuditLogEntry[] = [
  {
    id: 'audit-1',
    actor_id: 'user-admin',
    actor_name: 'Anand Sachin Gaikwad',
    action: 'SUBSCRIPTION_EXTEND',
    entity_type: 'Subscription',
    entity_id: 'SUB-9823',
    before: { expiry_date: '2026-02-10' },
    after: { expiry_date: '2026-03-10' },
    created_at: '2026-02-08T14:25:00Z',
  },
];
let notificationsStore: NotificationEvent[] = [];
let rechargePlansStore: RechargePlan[] = [...RECHARGE_PLANS];
let productsStore: Product[] = [...PRODUCTS_DATA];
let reviewsStore: Review[] = [...REVIEWS_DATA];

// Current mock logged-in user (default Staff/Admin for testing admin portal smoothly)
let currentUser: User = INITIAL_USERS[0]; // Anand Sachin Gaikwad (Admin)

// Helper: audit logger
function logAudit(action: string, entity_type: string, entity_id: string, before?: any, after?: any) {
  const entry: AuditLogEntry = {
    id: 'audit-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
    actor_id: currentUser.id,
    actor_name: currentUser.name,
    action,
    entity_type,
    entity_id,
    before,
    after,
    created_at: new Date().toISOString(),
  };
  auditLogsStore.unshift(entry);
  return entry;
}

// ==========================================
// 1. IDENTITY & AUTH ROUTES
// ==========================================
app.get('/api/auth/me', (req, res) => {
  res.json({ user: currentUser });
});

app.post('/api/auth/switch-role', (req, res) => {
  const { role } = req.body;
  const found = INITIAL_USERS.find(u => u.role === role) || {
    id: 'user-' + role,
    name: role === 'customer' ? 'Customer Demo' : 'Staff Member',
    email: `${role}@cctvsecurity.in`,
    phone: '+919999999999',
    role: role as any,
    created_at: new Date().toISOString(),
  };
  currentUser = found;
  res.json({ success: true, user: currentUser });
});

app.post('/api/auth/otp/send', (req, res) => {
  const { phone } = req.body;
  if (!phone) return res.status(400).json({ error: 'Phone number is required' });
  // Simulated OTP for rapid friction-free testing
  res.json({
    success: true,
    message: 'OTP sent successfully to ' + phone,
    demoOtp: '123456',
  });
});

app.post('/api/auth/otp/verify', (req, res) => {
  const { phone, otp, name } = req.body;
  if (otp !== '123456' && otp !== '000000') {
    return res.status(400).json({ error: 'Invalid verification code. Use demo code 123456' });
  }

  // Find or create customer
  let customer = customersStore.find(c => c.phone.replace(/\D/g, '') === phone.replace(/\D/g, ''));
  if (!customer) {
    customer = {
      id: 'cust-' + Date.now(),
      name: name || 'Valued Customer',
      phone,
      email: '',
      address: '',
      property_type: 'Residential',
      service_area: 'Baner & Balewadi',
      created_at: new Date().toISOString(),
    };
    customersStore.push(customer);
  }

  currentUser = {
    id: customer.id,
    name: customer.name,
    email: customer.email || 'customer@cctvlive.in',
    phone: customer.phone,
    role: 'customer',
    created_at: customer.created_at,
  };

  res.json({ success: true, user: currentUser, customer });
});

// ==========================================
// 2. LEADS MANAGEMENT SERVICE
// ==========================================
app.post('/api/leads/site-survey', (req, res) => {
  const { name, phone, email, property_type, city_area, preferred_date, requirement } = req.body;
  if (!name || !phone) {
    return res.status(400).json({ error: 'Name and phone number are required' });
  }

  const newLead: Lead = {
    id: 'lead-' + Date.now(),
    customer_id: currentUser.role === 'customer' ? currentUser.id : null,
    name,
    phone,
    email: email || '',
    type: 'survey',
    source: 'Website Survey Form',
    requirement: requirement || `Free Site Survey request for ${property_type || 'Premises'} in ${city_area || 'Pune'}.`,
    status: 'new',
    assigned_to: 'Anand Sachin Gaikwad',
    property_type: property_type || 'Residential',
    city_area: city_area || 'Pune',
    preferred_date: preferred_date || 'Flexible',
    notes: [
      {
        date: new Date().toISOString().replace('T', ' ').substring(0, 16),
        author: 'System',
        note: 'Site survey request logged via public portal.',
      },
    ],
    created_at: new Date().toISOString(),
  };

  leadsStore.unshift(newLead);

  // Trigger simulated notification
  notificationsStore.push({
    id: 'notif-' + Date.now(),
    event_type: 'lead_created',
    recipient: phone,
    channel: 'whatsapp',
    status: 'sent',
    content: `Hi ${name}, thank you for booking a free site survey with CCTV Security Services. Our engineer will contact you shortly.`,
    sent_at: new Date().toISOString(),
  });

  res.json({ success: true, lead: newLead, message: 'Free site survey booked successfully!' });
});

app.post('/api/leads/quote', (req, res) => {
  const { name, phone, property_type, camera_count, storage_days, need_audio, night_vision_type } = req.body;
  if (!name || !phone) {
    return res.status(400).json({ error: 'Name and phone number are required' });
  }

  const requirement = `Quote Request: ${camera_count || 4} cameras, ${night_vision_type || 'Full Color'} Night Vision, Audio: ${need_audio ? 'Yes' : 'No'}, Storage: ${storage_days || 30} days, Property: ${property_type || 'Shop'}.`;

  const newLead: Lead = {
    id: 'lead-' + Date.now(),
    customer_id: currentUser.role === 'customer' ? currentUser.id : null,
    name,
    phone,
    type: 'quote',
    source: 'Quote Calculator',
    requirement,
    status: 'quotation',
    assigned_to: 'Swapnil Anil Gandule',
    property_type: property_type || 'Commercial',
    notes: [
      {
        date: new Date().toISOString().replace('T', ' ').substring(0, 16),
        author: 'System',
        note: `Generated initial quote lead. Parameters: ${requirement}`,
      },
    ],
    created_at: new Date().toISOString(),
  };

  leadsStore.unshift(newLead);
  res.json({ success: true, lead: newLead, message: 'Quote request submitted!' });
});

app.post('/api/leads/product-enquiry', (req, res) => {
  const { name, phone, product_name, message } = req.body;
  const newLead: Lead = {
    id: 'lead-' + Date.now(),
    name: name || 'Prospective Buyer',
    phone: phone || '',
    type: 'product',
    source: 'Product Detail Page',
    requirement: `Inquiry for product: ${product_name}. Notes: ${message || 'Interested in price and installation warranty.'}`,
    status: 'new',
    assigned_to: 'Swapnil Anil Gandule',
    notes: [],
    created_at: new Date().toISOString(),
  };
  leadsStore.unshift(newLead);
  res.json({ success: true, lead: newLead });
});

app.get('/api/leads/:id', (req, res) => {
  const lead = leadsStore.find(l => l.id === req.params.id);
  if (!lead) return res.status(404).json({ error: 'Lead not found' });
  res.json({ lead });
});

app.patch('/api/leads/:id/status', (req, res) => {
  const { status, note } = req.body;
  const lead = leadsStore.find(l => l.id === req.params.id);
  if (!lead) return res.status(404).json({ error: 'Lead not found' });

  const beforeStatus = lead.status;
  lead.status = status;
  if (note) {
    lead.notes.push({
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      author: currentUser.name,
      note,
    });
  }

  logAudit('LEAD_STATUS_UPDATE', 'Lead', lead.id, { status: beforeStatus }, { status });
  res.json({ success: true, lead });
});

// ==========================================
// 3. CATALOG & COMPARISON RECOMMENDATION
// ==========================================
app.get('/api/catalog/services', (req, res) => {
  res.json({ services: SERVICES_DATA });
});

app.get('/api/catalog/services/:slug', (req, res) => {
  const service = SERVICES_DATA.find(s => s.slug === req.params.slug);
  if (!service) return res.status(404).json({ error: 'Service not found' });
  res.json({ service });
});

app.get('/api/catalog/solutions', (req, res) => {
  res.json({ solutions: SOLUTIONS_DATA });
});

app.get('/api/catalog/solutions/:slug', (req, res) => {
  const solution = SOLUTIONS_DATA.find(s => s.slug === req.params.slug);
  if (!solution) return res.status(404).json({ error: 'Solution not found' });
  res.json({ solution });
});

app.get('/api/catalog/products', (req, res) => {
  const { category } = req.query;
  if (category && category !== 'all') {
    return res.json({ products: productsStore.filter(p => p.category === category) });
  }
  res.json({ products: productsStore });
});

app.post('/api/catalog/compare', (req, res) => {
  const { location_type, lighting_condition, need_audio, need_active_deterrence, budget_tier } = req.body;

  // Algorithmic camera recommendation engine
  let recommended = productsStore[0];
  let rationale = 'Solid multi-purpose choice for day and night security.';

  if (need_active_deterrence || location_type === 'warehouse' || location_type === 'farm') {
    recommended = productsStore.find(p => p.category === 'ptz-cameras') || productsStore[2];
    rationale = 'TiOC / PTZ active deterrence with siren strobe and motorized zoom protects high-risk open perimeters.';
  } else if (lighting_condition === 'pitch_black' || location_type === 'society') {
    recommended = productsStore.find(p => p.name.includes('Hikvision 5MP')) || productsStore[1];
    rationale = 'Deep learning AI with Starlight night illumination delivers clear human detection even in zero street lighting.';
  } else if (budget_tier === 'economy') {
    recommended = productsStore[0];
    rationale = 'Best balance of 3MP high definition with warm full-color night vision and audio at an affordable cost.';
  }

  res.json({
    recommended_product: recommended,
    rationale,
    alternative_options: productsStore.filter(p => p.id !== recommended.id).slice(0, 2),
  });
});

// ==========================================
// 4. AMC (ANNUAL MAINTENANCE CONTRACTS)
// ==========================================
app.get('/api/amc/plans', (req, res) => {
  res.json({ plans: AMC_PLANS });
});

app.post('/api/amc/book', (req, res) => {
  const { plan_id, customer_name, customer_phone, property_type, camera_count, address } = req.body;
  const plan = AMC_PLANS.find(p => p.id === plan_id) || AMC_PLANS[1];

  const contract: AMCContract = {
    id: 'AMC-' + Math.floor(100 + Math.random() * 900),
    customer_id: currentUser.id || 'cust-' + Date.now(),
    customer_name: customer_name || currentUser.name,
    customer_phone: customer_phone || currentUser.phone,
    plan_id: plan.id,
    plan_name: plan.name,
    property_type: property_type || 'Commercial',
    camera_count: Number(camera_count) || 4,
    start_date: new Date().toISOString().split('T')[0],
    end_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'active',
    created_at: new Date().toISOString(),
  };

  amcContractsStore.unshift(contract);

  // Also record a lead for scheduling the first onboarding maintenance visit
  leadsStore.unshift({
    id: 'lead-' + Date.now(),
    name: contract.customer_name,
    phone: contract.customer_phone,
    type: 'amc',
    source: 'AMC Online Booking',
    requirement: `Booked ${plan.name} for ${contract.camera_count} cameras at ${property_type}. Schedule onboarding inspection.`,
    status: 'won',
    assigned_to: 'Anand Sachin Gaikwad',
    notes: [{ date: new Date().toISOString().substring(0, 10), author: 'System', note: 'AMC contract created.' }],
    created_at: new Date().toISOString(),
  });

  res.json({ success: true, contract, message: `AMC booking confirmed for ${plan.name}!` });
});

// ==========================================
// 5. SUBSCRIPTIONS & RECHARGE WIZARD ENGINE
// ==========================================
// Step 1: Verification
app.post('/api/subscriptions/verify', (req, res) => {
  const { customerIdOrMobile, subscriptionId } = req.body;
  if (!customerIdOrMobile && !subscriptionId) {
    return res.status(400).json({ error: 'Please enter registered Mobile number or Subscription ID' });
  }

  const query = (customerIdOrMobile || subscriptionId || '').trim();
  const cleanPhone = query.replace(/\D/g, '');

  const found = subscriptionsStore.find(sub => {
    if (subscriptionId && sub.id.toLowerCase() === subscriptionId.toLowerCase()) return true;
    if (sub.id.toLowerCase() === query.toLowerCase()) return true;
    if (cleanPhone && sub.customer_phone.replace(/\D/g, '').includes(cleanPhone)) return true;
    return false;
  });

  if (!found) {
    // If not found, return helpful guidance with sample test IDs
    return res.status(404).json({
      error: 'No active subscription found for the provided details.',
      suggestion: 'Try test Subscription ID: SUB-9823 or Phone: 9823456789 (or SUB-4412 / 9860123456)',
    });
  }

  res.json({
    success: true,
    subscription: found,
    customerName: found.customer_name,
    providerService: found.provider_service,
    currentPlan: found.plan_name,
    currentExpiry: found.expiry_date,
    status: found.status,
  });
});

// Step 2: Eligible plans for subscription
app.get('/api/subscriptions/:id/plans', (req, res) => {
  const sub = subscriptionsStore.find(s => s.id === req.params.id);
  if (!sub) return res.status(404).json({ error: 'Subscription not found' });

  // Filter plans compatible with the subscription's provider service
  let eligible = rechargePlansStore.filter(p =>
    p.provider_service.toLowerCase().includes(sub.provider_service.split(' ')[0].toLowerCase())
  );
  if (eligible.length === 0) eligible = rechargePlansStore;

  res.json({ subscription: sub, plans: eligible });
});

// Step 2 & 3: Renewal Quote computation
app.post('/api/subscriptions/:id/renewal-quote', (req, res) => {
  const { planId } = req.body;
  const sub = subscriptionsStore.find(s => s.id === req.params.id);
  if (!sub) return res.status(404).json({ error: 'Subscription not found' });

  const plan = rechargePlansStore.find(p => p.id === planId) || rechargePlansStore[0];
  const now = new Date();
  const currentExpiry = new Date(sub.expiry_date);

  // Business Rule per PRD §45:
  // newExpiry = renewal_rule == "from_expiry" && currentExpiry > today ? currentExpiry + duration : today + duration
  let baseDate: Date;
  if (sub.renewal_rule === 'from_expiry' && currentExpiry > now) {
    baseDate = currentExpiry;
  } else {
    baseDate = now;
  }

  const newExpiryDate = new Date(baseDate.getTime() + plan.duration_days * 24 * 60 * 60 * 1000);
  const formattedNewExpiry = newExpiryDate.toISOString().split('T')[0];
  const amount = plan.promo_price || plan.price;

  res.json({
    subscriptionId: sub.id,
    plan,
    amount,
    currentExpiry: sub.expiry_date,
    newExpiry: formattedNewExpiry,
    renewalRule: sub.renewal_rule,
  });
});

// ==========================================
// 6. PAYMENTS & WEBHOOK ARCHITECTURE
// ==========================================
// Step 3: Create Gateway Session
app.post('/api/payments/session', (req, res) => {
  const { subscriptionId, planId, amount, customerName, customerPhone } = req.body;
  const sub = subscriptionsStore.find(s => s.id === subscriptionId);
  const plan = rechargePlansStore.find(p => p.id === planId);

  // Compute and freeze quotedNewExpiry at session creation time (PRD §45 requirement)
  let quotedNewExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  if (sub && plan) {
    const currentExpiry = new Date(sub.expiry_date);
    const now = new Date();
    const baseDate = sub.renewal_rule === 'from_expiry' && currentExpiry > now ? currentExpiry : now;
    quotedNewExpiry = new Date(baseDate.getTime() + plan.duration_days * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  }

  const gatewayRef = 'order_' + Math.random().toString(36).substring(2, 12).toUpperCase();
  const txnId = 'TXN-' + Math.floor(100000 + Math.random() * 900000);

  const newTxn: Transaction = {
    id: txnId,
    subscription_id: subscriptionId,
    customer_id: sub ? sub.customer_id : currentUser.id,
    customer_name: customerName || (sub ? sub.customer_name : currentUser.name),
    customer_phone: customerPhone || (sub ? sub.customer_phone : currentUser.phone),
    amount: Number(amount) || (plan ? (plan.promo_price || plan.price) : 499),
    gateway: 'Razorpay',
    gateway_reference: gatewayRef,
    status: 'initiated',
    created_at: new Date().toISOString(),
    quoted_new_expiry: quotedNewExpiry,
    plan_name: plan ? plan.name : 'Subscription Renewal',
  };

  transactionsStore.unshift(newTxn);

  res.json({
    orderId: gatewayRef,
    transactionId: txnId,
    amount: newTxn.amount,
    currency: 'INR',
    keyId: 'rzp_live_public_cctv_gateway', // Client-safe key
    quotedNewExpiry,
  });
});

// Webhook intake (Idempotent per gateway_reference) - PRD §29, §45
app.post('/api/payments/webhook/:gateway', (req, res) => {
  const { gateway_reference, status } = req.body;
  if (!gateway_reference) {
    return res.status(400).json({ error: 'gateway_reference is required for webhook intake' });
  }

  const txn = transactionsStore.find(t => t.gateway_reference === gateway_reference);
  if (!txn) {
    return res.status(404).json({ error: 'Transaction matching gateway reference not found' });
  }

  // Idempotency check: If already processed, return 200 OK immediately without double-renewal
  if (txn.status === 'success') {
    return res.json({ status: 'already_processed', message: 'Idempotency check passed: Transaction already verified.' });
  }

  if (status === 'success') {
    txn.status = 'success';
    txn.verified_at = new Date().toISOString();

    // Extend subscription per captured quoted_new_expiry
    if (txn.subscription_id) {
      const sub = subscriptionsStore.find(s => s.id === txn.subscription_id);
      if (sub) {
        const oldExpiry = sub.expiry_date;
        sub.expiry_date = txn.quoted_new_expiry || sub.expiry_date;
        sub.status = 'active';
        logAudit('SUBSCRIPTION_RENEWAL_WEBHOOK', 'Subscription', sub.id, { expiry_date: oldExpiry }, { expiry_date: sub.expiry_date });

        // Emit notification
        notificationsStore.push({
          id: 'notif-' + Date.now(),
          event_type: 'recharge_success',
          recipient: txn.customer_phone,
          channel: 'whatsapp',
          status: 'sent',
          content: `Payment of ₹${txn.amount} confirmed for ${sub.plan_name}. New expiry date is ${sub.expiry_date}. Receipt: ${txn.id}`,
          sent_at: new Date().toISOString(),
        });
      }
    }
  } else {
    txn.status = 'failed';
  }

  res.json({ success: true, transaction: txn });
});

// UI helper to simulate gateway callback triggering the server webhook
app.post('/api/payments/simulate-success', (req, res) => {
  const { orderId } = req.body;
  const txn = transactionsStore.find(t => t.gateway_reference === orderId || t.id === orderId);
  if (!txn) return res.status(404).json({ error: 'Transaction not found' });

  txn.status = 'success';
  txn.verified_at = new Date().toISOString();

  if (txn.subscription_id) {
    const sub = subscriptionsStore.find(s => s.id === txn.subscription_id);
    if (sub) {
      sub.expiry_date = txn.quoted_new_expiry || sub.expiry_date;
      sub.status = 'active';
      logAudit('SUBSCRIPTION_RENEWAL_SIMULATED', 'Subscription', sub.id, {}, { expiry_date: sub.expiry_date });
    }
  }

  res.json({ success: true, transaction: txn });
});

app.get('/api/payments/:txnId/receipt', (req, res) => {
  const txn = transactionsStore.find(t => t.id === req.params.txnId || t.gateway_reference === req.params.txnId);
  if (!txn) return res.status(404).json({ error: 'Receipt not found' });

  const sub = txn.subscription_id ? subscriptionsStore.find(s => s.id === txn.subscription_id) : null;
  res.json({
    transaction: txn,
    subscription: sub,
    issued_by: 'CCTV Security Services Platform',
    gstin: '27AABCU9603R1ZN',
    contact_partners: OWNER_CONTACTS,
  });
});

// ==========================================
// 7. SERVICE REQUESTS (TICKETS) - PHASE 3
// ==========================================
app.post('/api/service-requests', (req, res) => {
  const { category, description, customer_name, customer_phone, preferred_visit_time } = req.body;
  const newTicket: ServiceRequest = {
    id: 'TKT-' + Math.floor(1000 + Math.random() * 9000),
    customer_id: currentUser.id || 'cust-anonymous',
    customer_name: customer_name || currentUser.name,
    customer_phone: customer_phone || currentUser.phone,
    category: category || 'General Repair',
    description: description || 'Camera offline / need technician checkup.',
    attachments: [],
    status: 'open',
    preferred_visit_time: preferred_visit_time || 'Earliest Available',
    created_at: new Date().toISOString(),
  };

  serviceRequestsStore.unshift(newTicket);
  res.json({ success: true, ticket: newTicket, message: 'Ticket generated successfully! Reference #' + newTicket.id });
});

app.get('/api/service-requests', (req, res) => {
  if (currentUser.role === 'customer') {
    return res.json({ tickets: serviceRequestsStore.filter(t => t.customer_phone.includes(currentUser.phone.slice(-6))) });
  }
  res.json({ tickets: serviceRequestsStore });
});

app.patch('/api/service-requests/:id/status', (req, res) => {
  const { status, resolution_notes, technician_name } = req.body;
  const ticket = serviceRequestsStore.find(t => t.id === req.params.id);
  if (!ticket) return res.status(404).json({ error: 'Ticket not found' });

  ticket.status = status;
  if (resolution_notes) ticket.resolution_notes = resolution_notes;
  if (technician_name) ticket.technician_name = technician_name;

  logAudit('TICKET_STATUS_CHANGE', 'ServiceRequest', ticket.id, {}, { status });
  res.json({ success: true, ticket });
});

// ==========================================
// 8. CHATBOT SERVICE (WITH EXPERT HANDOFF)
// ==========================================
app.post('/api/chatbot/message', (req, res) => {
  const { text, category } = req.body;
  const input = (text || '').toLowerCase();

  let reply = '';
  let quickReplies: string[] = [];
  let handoff = false;

  // Intent-based routing per PRD §12
  if (input.includes('recharge') || category === 'Recharge') {
    reply = 'For 4G CCTV SIMs or cloud storage renewals, you can use our 4-Step Instant Recharge Wizard. Simply enter your mobile or Subscription ID (e.g., SUB-9823) to review and extend.';
    quickReplies = ['Open Recharge Wizard', 'Check Expiry Date', 'Talk to Anand Gaikwad'];
  } else if (input.includes('amc') || category === 'Commercial') {
    reply = 'We provide Basic, Standard, and Comprehensive AMC packages starting from ₹2,499/year with preventive quarterly servicing and emergency on-site technician callouts.';
    quickReplies = ['View AMC Plans', 'Book AMC Inspection', 'Talk to Swapnil Gandule'];
  } else if (input.includes('repair') || input.includes('not working') || category === 'Service') {
    reply = 'Experiencing black screens, disk clicking, or offline mobile app? Our emergency technicians provide rapid same-day diagnosis.';
    quickReplies = ['Book Emergency Repair', 'Troubleshooting Tips', 'Call Technical Lead'];
  } else if (input.includes('price') || input.includes('quote') || input.includes('cost') || category === 'Sales') {
    reply = 'Camera packages start from ₹14,999 for 4-camera full residential kits with installation, 1TB surveillance hard drive, and mobile setup. Would you like a free on-site survey?';
    quickReplies = ['Book Free Site Survey', 'Calculate Custom Quote', 'Compare Cameras'];
  } else if (input.includes('talk') || input.includes('expert') || input.includes('call') || input.includes('owner')) {
    reply = 'Connecting you directly to our leadership team. You can reach Anand Sachin Gaikwad or Swapnil Anil Gandule right now via phone or direct WhatsApp.';
    handoff = true;
    quickReplies = ['Call Anand Gaikwad', 'Call Swapnil Gandule', 'Chat on WhatsApp'];
  } else {
    reply = 'Welcome to CCTV Security Services! How can we protect your property today? Choose a quick topic below or connect directly with our technical partners.';
    quickReplies = ['Book Free Site Survey', 'Compare Cameras', 'Renew 4G/Cloud Plan', 'Emergency Repair'];
  }

  res.json({
    reply,
    quickReplies,
    handoff,
    owners: OWNER_CONTACTS,
  });
});

// ==========================================
// 9. CONTENT & COMMON RESOURCES
// ==========================================
app.get('/api/content/projects', (req, res) => res.json({ projects: PROJECTS_DATA }));
app.get('/api/content/reviews', (req, res) => res.json({ reviews: reviewsStore }));
app.get('/api/content/faqs', (req, res) => res.json({ faqs: FAQS_DATA }));
app.get('/api/content/service-areas', (req, res) => res.json({ areas: SERVICE_AREAS }));

// ==========================================
// 10. ADMIN ROUTES (ROLE-GATED)
// ==========================================
// Middleware check helper
function verifyStaffRole(req: express.Request, res: express.Response, next: express.NextFunction) {
  if (currentUser.role === 'customer') {
    return res.status(403).json({ error: 'Access denied. Staff or Admin privilege required.' });
  }
  next();
}

app.get('/api/admin/leads', verifyStaffRole, (req, res) => {
  res.json({ leads: leadsStore });
});

app.get('/api/admin/customers', verifyStaffRole, (req, res) => {
  res.json({ customers: customersStore });
});

app.get('/api/admin/recharge/plans', verifyStaffRole, (req, res) => {
  res.json({ plans: rechargePlansStore });
});

app.post('/api/admin/recharge/plans', verifyStaffRole, (req, res) => {
  const planData = req.body;
  const newPlan: RechargePlan = {
    id: 'plan-' + Date.now(),
    provider_service: planData.provider_service || 'Cloud CCTV Vault',
    name: planData.name || 'New Pack',
    billing_cycle: planData.billing_cycle || 'monthly',
    duration_days: Number(planData.duration_days) || 30,
    price: Number(planData.price) || 499,
    promo_price: planData.promo_price ? Number(planData.promo_price) : undefined,
    is_active: true,
    cloud_storage_days: Number(planData.cloud_storage_days) || 7,
    sim_data_allowance: planData.sim_data_allowance || '2GB/day',
    features: planData.features || ['High definition streaming'],
  };
  rechargePlansStore.push(newPlan);
  logAudit('CREATE_RECHARGE_PLAN', 'RechargePlan', newPlan.id, null, newPlan);
  res.json({ success: true, plan: newPlan });
});

app.get('/api/admin/recharge/subscribers', verifyStaffRole, (req, res) => {
  res.json({ subscribers: subscriptionsStore });
});

// Dedicated manual subscription extend with Audit Logging (PRD §46)
app.post('/api/admin/recharge/subscriptions/:id/extend', verifyStaffRole, (req, res) => {
  const { additional_days, reason } = req.body;
  const sub = subscriptionsStore.find(s => s.id === req.params.id);
  if (!sub) return res.status(404).json({ error: 'Subscription not found' });

  const days = Number(additional_days) || 30;
  const current = new Date(sub.expiry_date);
  const oldExpiry = sub.expiry_date;
  const updatedDate = new Date(current.getTime() + days * 24 * 60 * 60 * 1000);
  sub.expiry_date = updatedDate.toISOString().split('T')[0];
  sub.status = 'active';

  const audit = logAudit(
    'MANUAL_SUBSCRIPTION_EXTEND',
    'Subscription',
    sub.id,
    { expiry_date: oldExpiry },
    { expiry_date: sub.expiry_date, days_added: days, reason: reason || 'Admin manual goodwill extension' }
  );

  res.json({ success: true, subscription: sub, audit });
});

// Dedicated manual subscription cancel with Audit Logging (PRD §46)
app.post('/api/admin/recharge/subscriptions/:id/cancel', verifyStaffRole, (req, res) => {
  const { reason } = req.body;
  const sub = subscriptionsStore.find(s => s.id === req.params.id);
  if (!sub) return res.status(404).json({ error: 'Subscription not found' });

  const oldStatus = sub.status;
  sub.status = 'cancelled';

  const audit = logAudit(
    'MANUAL_SUBSCRIPTION_CANCEL',
    'Subscription',
    sub.id,
    { status: oldStatus },
    { status: 'cancelled', reason: reason || 'Customer requested termination' }
  );

  res.json({ success: true, subscription: sub, audit });
});

app.get('/api/admin/recharge/transactions', verifyStaffRole, (req, res) => {
  res.json({ transactions: transactionsStore });
});

app.get('/api/admin/audit-logs', verifyStaffRole, (req, res) => {
  res.json({ logs: auditLogsStore });
});

app.get('/api/admin/reports/:type', verifyStaffRole, (req, res) => {
  const { type } = req.params;
  const totalRevenue = transactionsStore
    .filter(t => t.status === 'success')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const activeSubscribers = subscriptionsStore.filter(s => s.status === 'active' || s.status === 'expiring').length;
  const openLeads = leadsStore.filter(l => l.status !== 'won' && l.status !== 'lost').length;
  const pendingTickets = serviceRequestsStore.filter(t => t.status !== 'closed' && t.status !== 'resolved').length;

  res.json({
    type,
    summary: {
      totalRevenue,
      activeSubscribers,
      openLeads,
      pendingTickets,
      totalLeads: leadsStore.length,
      conversionRate: Math.round((leadsStore.filter(l => l.status === 'won').length / (leadsStore.length || 1)) * 100) + '%',
    },
    recentTransactions: transactionsStore.slice(0, 5),
  });
});

// ==========================================
// VITE INTEGRATION / SERVER STARTUP
// ==========================================
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CCTV Security Platform running on http://localhost:${PORT}`);
  });
}

startServer();
