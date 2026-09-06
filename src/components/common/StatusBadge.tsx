import React from 'react';
import { LeadStatus, TicketStatus } from '../../types';

interface StatusBadgeProps {
  status: LeadStatus | TicketStatus | 'active' | 'expiring' | 'expired' | 'cancelled' | 'success' | 'pending' | 'failed';
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'sm' }) => {
  const getBadgeStyle = () => {
    switch (status) {
      case 'new':
      case 'open':
      case 'initiated':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'contacted':
      case 'assigned':
      case 'pending':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'site_survey':
      case 'en_route':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'quotation':
      case 'in_progress':
        return 'bg-cyan-50 text-cyan-700 border-cyan-200';
      case 'won':
      case 'active':
      case 'resolved':
      case 'closed':
      case 'success':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'expiring':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'lost':
      case 'expired':
      case 'cancelled':
      case 'failed':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const label = status.replace(/_/g, ' ').toUpperCase();

  return (
    <span
      className={`inline-flex items-center font-medium border rounded-full ${
        size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm'
      } ${getBadgeStyle()}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-80" />
      {label}
    </span>
  );
};
