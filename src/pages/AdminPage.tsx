import React, { useState, useEffect } from 'react';
import {
  AdminLeadManager,
  AdminSubscriptionManager,
  AdminReportPanel,
} from '../components/admin/AdminComponents';
import { adminApi } from '../services/api';
import { AuditLogEntry } from '../types';
import { Shield, Users, FileText, Activity, Lock } from 'lucide-react';

export const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'leads' | 'subscribers' | 'reports' | 'audit'>('leads');
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);

  const fetchAuditLogs = async () => {
    try {
      const res = await adminApi.getAuditLogs();
      setAuditLogs(res?.logs || []);
    } catch (e) {
      console.error(e);
      setAuditLogs([]);
    }
  };

  useEffect(() => {
    if (activeTab === 'audit') {
      fetchAuditLogs();
    }
  }, [activeTab]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Admin Header Banner */}
      <div className="bg-[#1A1A1A] rounded-[32px] p-6 sm:p-8 text-white border border-stone-800 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-stone-300">
            <Lock className="w-3.5 h-3.5 text-[#5A5A40]" />
            <span>Operational Control Center (Staff &amp; Partner Portal)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1.5">
            CCTV Security Management Desk
          </h1>
          <p className="text-xs text-stone-400 mt-1">
            Superuser view: Pipeline management, subscription manual overrides, and audit log inspection.
          </p>
        </div>

        {/* Tab Switcher Pills */}
        <div className="flex flex-wrap gap-1.5 bg-stone-900 p-1.5 rounded-full border border-stone-800 self-start">
          {[
            { id: 'leads', label: 'Lead Pipeline', icon: FileText },
            { id: 'subscribers', label: 'Subscriptions', icon: Users },
            { id: 'reports', label: 'Reports & Funnel', icon: Activity },
            { id: 'audit', label: 'Audit Trail', icon: Shield },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[#5A5A40] text-white shadow-xs'
                    : 'text-stone-400 hover:text-white hover:bg-stone-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Panels */}
      <div>
        {activeTab === 'leads' && <AdminLeadManager />}
        {activeTab === 'subscribers' && <AdminSubscriptionManager />}
        {activeTab === 'reports' && <AdminReportPanel />}
        {activeTab === 'audit' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-serif font-bold text-[#1A1A1A]">System Audit Trail</h3>
                <p className="text-xs text-stone-500">
                  Strict compliance log tracking every manual expiry extension, payment mutation, and cancellation per PRD §46.
                </p>
              </div>
              <button
                onClick={fetchAuditLogs}
                className="px-4 py-2 bg-white border border-stone-200 hover:bg-[#F5F5F0] text-stone-700 rounded-full text-xs font-medium transition-colors"
              >
                Refresh Log
              </button>
            </div>

            <div className="bg-white rounded-[28px] border border-stone-200/90 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#F5F5F0] border-b border-stone-200 text-stone-600 uppercase tracking-widest text-[10px]">
                      <th className="p-3.5 font-semibold">Timestamp</th>
                      <th className="p-3.5 font-semibold">Actor</th>
                      <th className="p-3.5 font-semibold">Action</th>
                      <th className="p-3.5 font-semibold">Target Entity</th>
                      <th className="p-3.5 font-semibold">Change Details &amp; Justification</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 text-stone-700">
                    {(auditLogs || []).map(log => (
                      <tr key={log.id} className="hover:bg-[#F5F5F0] transition-colors">
                        <td className="p-3.5 font-mono text-[11px] text-stone-500">
                          {new Date(log.timestamp).toLocaleString()}
                        </td>
                        <td className="p-3.5 font-semibold text-[#1A1A1A]">
                          {log.actor_name}
                        </td>
                        <td className="p-3.5">
                          <span className="font-mono uppercase font-bold text-[10px] bg-[#F5F5F0] text-[#5A5A40] border border-stone-200 px-2 py-0.5 rounded-full">
                            {log.action}
                          </span>
                        </td>
                        <td className="p-3.5 font-mono text-[#5A5A40]">
                          {log.target_entity}:{log.target_id}
                        </td>
                        <td className="p-3.5 max-w-md">
                          <div className="text-[11px] text-[#1A1A1A] font-mono">
                            {JSON.stringify(log.diff)}
                          </div>
                          {log.reason && (
                            <span className="text-[10px] text-stone-500 italic block mt-0.5">
                              Reason: {log.reason}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                    {auditLogs.length === 0 && (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-stone-400">
                          No audit log entries recorded yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
