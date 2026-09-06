import React, { useState, useEffect } from 'react';
import {
  Users,
  Shield,
  CreditCard,
  FileText,
  Clock,
  Search,
  Filter,
  Download,
  CheckCircle,
  AlertTriangle,
  RotateCcw,
  Plus,
  ArrowUpRight,
  TrendingUp,
} from 'lucide-react';
import { adminApi, leadsApi } from '../../services/api';
import { AuditLogEntry, Customer, Lead, LeadStatus, Subscription, Transaction } from '../../types';
import { StatusBadge } from '../common/StatusBadge';

export const AdminLeadManager: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [noteText, setNoteText] = useState('');

  const fetchLeads = async () => {
    try {
      const res = await adminApi.getLeads();
      setLeads(res?.leads || []);
    } catch (e) {
      console.error(e);
      setLeads([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleUpdateStatus = async (leadId: string, newStatus: LeadStatus) => {
    try {
      await leadsApi.updateLeadStatus(leadId, newStatus, noteText || undefined);
      setNoteText('');
      fetchLeads();
      if (selectedLead && selectedLead.id === leadId) {
        setSelectedLead(prev => (prev ? { ...prev, status: newStatus } : null));
      }
    } catch (e) {
      alert('Error updating status');
    }
  };

  const filtered = leads.filter(l => {
    const matchSearch =
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.phone.includes(search) ||
      (l.property_type && l.property_type.toLowerCase().includes(search.toLowerCase()));
    const matchFilter = filterStatus === 'all' || l.status === filterStatus;
    return matchSearch && matchFilter;
  });

  const exportCSV = () => {
    const headers = ['ID', 'Name', 'Phone', 'Type', 'Status', 'Property', 'Area', 'Created'];
    const rows = filtered.map(l => [
      l.id,
      `"${l.name}"`,
      l.phone,
      l.type,
      l.status,
      `"${l.property_type || ''}"`,
      `"${l.city_area || ''}"`,
      l.created_at,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `leads_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-900">Lead Generation Pipeline</h3>
          <p className="text-xs text-slate-500">
            Intake from Site Survey, Instant Quote, Product Enquiries & Direct WhatsApp.
          </p>
        </div>
        <button
          onClick={exportCSV}
          className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 self-start"
        >
          <Download className="w-4 h-4" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center gap-3 bg-white p-4 rounded-xl border border-slate-200">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by name, phone, or premises..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
          >
            <option value="all">All Stages</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="site_survey">Site Survey</option>
            <option value="quotation">Quotation</option>
            <option value="negotiation">Negotiation</option>
            <option value="won">Won (Closed)</option>
            <option value="lost">Lost</option>
          </select>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px]">
                <th className="p-3.5 font-semibold">Lead ID & Date</th>
                <th className="p-3.5 font-semibold">Customer Contact</th>
                <th className="p-3.5 font-semibold">Requirement</th>
                <th className="p-3.5 font-semibold">Type & Area</th>
                <th className="p-3.5 font-semibold">Status Stage</th>
                <th className="p-3.5 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.map(lead => (
                <tr key={lead.id} className="hover:bg-slate-50">
                  <td className="p-3.5 font-mono">
                    <span className="font-semibold text-slate-900 block">{lead.id}</span>
                    <span className="text-[10px] text-slate-400">{new Date(lead.created_at).toLocaleDateString()}</span>
                  </td>
                  <td className="p-3.5">
                    <span className="font-semibold text-slate-900 block">{lead.name}</span>
                    <a href={`tel:${lead.phone}`} className="text-emerald-700 hover:underline font-mono">
                      {lead.phone}
                    </a>
                  </td>
                  <td className="p-3.5 max-w-xs">
                    <p className="line-clamp-2 text-slate-600">{lead.requirement}</p>
                  </td>
                  <td className="p-3.5">
                    <span className="inline-block uppercase font-bold text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                      {lead.type}
                    </span>
                    <span className="text-[11px] text-slate-400 block mt-0.5">{lead.city_area || 'Pune'}</span>
                  </td>
                  <td className="p-3.5">
                    <StatusBadge status={lead.status} />
                  </td>
                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => setSelectedLead(lead)}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-md font-medium text-[11px]"
                    >
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    No leads found matching current search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Lead Management Modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h4 className="font-bold text-slate-900 text-base">Update Lead: {selectedLead.name}</h4>
                <p className="text-xs text-slate-500 font-mono">{selectedLead.id} • {selectedLead.phone}</p>
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                className="text-slate-400 hover:text-slate-600 text-sm p-1"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Advance Pipeline Stage</label>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5">
                {(['new', 'contacted', 'site_survey', 'quotation', 'negotiation', 'won', 'lost'] as LeadStatus[]).map(st => (
                  <button
                    key={st}
                    onClick={() => handleUpdateStatus(selectedLead.id, st)}
                    className={`py-1.5 px-2 rounded-lg text-[11px] font-semibold border transition-all ${
                      selectedLead.status === st
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {st.replace(/_/g, ' ')}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Add Follow-up Note</label>
              <textarea
                rows={2}
                value={noteText}
                onChange={e => setNoteText(e.target.value)}
                placeholder="Log call outcome, quotation value, or inspection observation..."
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            {selectedLead.notes && selectedLead.notes.length > 0 && (
              <div className="space-y-1.5 max-h-36 overflow-y-auto pt-2 border-t border-slate-100">
                <span className="text-[11px] font-semibold text-slate-500 uppercase">Activity History:</span>
                {(selectedLead.notes || []).map((n, i) => (
                  <div key={i} className="text-[11px] bg-slate-50 p-2 rounded-lg border border-slate-100">
                    <span className="font-semibold text-slate-700">{n.author}</span>
                    <span className="text-slate-400 text-[10px] ml-1.5">({n.date})</span>
                    <p className="text-slate-600 mt-0.5">{n.note}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedLead(null)}
                className="px-4 py-2 bg-slate-800 text-white text-xs font-medium rounded-xl hover:bg-slate-700"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const AdminSubscriptionManager: React.FC = () => {
  const [subscribers, setSubscribers] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSub, setSelectedSub] = useState<Subscription | null>(null);
  const [extendDays, setExtendDays] = useState(30);
  const [extendReason, setExtendReason] = useState('Customer paid offline via cash / goodwill');

  const fetchSubs = async () => {
    try {
      const res = await adminApi.getSubscribers();
      setSubscribers(res?.subscribers || []);
    } catch (e) {
      console.error(e);
      setSubscribers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubs();
  }, []);

  const handleManualExtend = async () => {
    if (!selectedSub) return;
    try {
      await adminApi.extendSubscription(selectedSub.id, extendDays, extendReason);
      alert(`Subscription ${selectedSub.id} extended by ${extendDays} days! Audit log entry recorded.`);
      setSelectedSub(null);
      fetchSubs();
    } catch (e) {
      alert('Failed to extend subscription');
    }
  };

  const handleManualCancel = async (id: string) => {
    if (!confirm('Are you sure you want to cancel this subscription? An audit entry will be recorded.')) return;
    try {
      await adminApi.cancelSubscription(id, 'Admin manual cancellation per customer request');
      fetchSubs();
    } catch (e) {
      alert('Failed to cancel subscription');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-slate-900">4G SIM & Cloud Subscribers</h3>
          <p className="text-xs text-slate-500">
            Dedicated manual mutation endpoints writing audit logs per PRD §46.
          </p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px]">
                <th className="p-3.5 font-semibold">Subscription ID</th>
                <th className="p-3.5 font-semibold">Subscriber</th>
                <th className="p-3.5 font-semibold">Service & Plan</th>
                <th className="p-3.5 font-semibold">Expiry Date</th>
                <th className="p-3.5 font-semibold">Status</th>
                <th className="p-3.5 font-semibold text-right">Audit Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {(subscribers || []).map(sub => (
                <tr key={sub.id} className="hover:bg-slate-50">
                  <td className="p-3.5 font-mono font-bold text-slate-900">{sub.id}</td>
                  <td className="p-3.5">
                    <span className="font-semibold text-slate-900 block">{sub.customer_name}</span>
                    <span className="text-slate-400 font-mono text-[11px]">{sub.customer_phone}</span>
                  </td>
                  <td className="p-3.5">
                    <span className="font-medium text-slate-800 block">{sub.provider_service}</span>
                    <span className="text-[11px] text-slate-500">{sub.plan_name}</span>
                  </td>
                  <td className="p-3.5 font-mono font-semibold text-slate-800">
                    {sub.expiry_date}
                  </td>
                  <td className="p-3.5">
                    <StatusBadge status={sub.status} />
                  </td>
                  <td className="p-3.5 text-right space-x-2">
                    <button
                      onClick={() => setSelectedSub(sub)}
                      className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-md font-medium text-[11px]"
                    >
                      Extend
                    </button>
                    {sub.status !== 'cancelled' && (
                      <button
                        onClick={() => handleManualCancel(sub.id)}
                        className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 rounded-md font-medium text-[11px]"
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Extend Modal */}
      {selectedSub && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h4 className="font-bold text-slate-900 text-base">Manual Subscription Extension</h4>
                <p className="text-xs text-slate-500 font-mono">{selectedSub.id} • {selectedSub.customer_name}</p>
              </div>
              <button onClick={() => setSelectedSub(null)} className="text-slate-400 text-sm">✕</button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Additional Days to Add</label>
              <select
                value={extendDays}
                onChange={e => setExtendDays(Number(e.target.value))}
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              >
                <option value={15}>+15 Days</option>
                <option value={30}>+30 Days (1 Month)</option>
                <option value={90}>+90 Days (Quarterly)</option>
                <option value={365}>+365 Days (Annual)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Mandatory Audit Reason (PRD §46)</label>
              <input
                type="text"
                value={extendReason}
                onChange={e => setExtendReason(e.target.value)}
                placeholder="Reason for manual override..."
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                required
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedSub(null)}
                className="px-3 py-2 text-xs text-slate-600 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleManualExtend}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-xs"
              >
                Apply Extension & Write Audit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const AdminReportPanel: React.FC = () => {
  const [report, setReport] = useState<any>(null);

  useEffect(() => {
    adminApi.getReports('sales').then(data => setReport(data));
  }, []);

  if (!report) return <div className="p-8 text-center text-xs text-slate-400">Loading platform reports...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-slate-900">Platform Analytics & Business Funnel</h3>
        <p className="text-xs text-slate-500">Live transaction volume, lead conversions, and renewal metrics.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>TOTAL REVENUE</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">
            ₹{report.summary.totalRevenue.toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-emerald-700 font-medium mt-0.5 block">Recharge & AMC ledger</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>ACTIVE SUBSCRIBERS</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">{report.summary.activeSubscribers}</div>
          <span className="text-[11px] text-slate-500 mt-0.5 block">Cloud & SIM Subscriptions</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>OPEN LEADS</span>
            <FileText className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">{report.summary.openLeads}</div>
          <span className="text-[11px] text-slate-500 mt-0.5 block">Active Survey & Quotes</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>CONVERSION RATE</span>
            <CheckCircle className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-700 mt-2">{report.summary.conversionRate}</div>
          <span className="text-[11px] text-slate-500 mt-0.5 block">Won vs Total Inquiries</span>
        </div>
      </div>
    </div>
  );
};
