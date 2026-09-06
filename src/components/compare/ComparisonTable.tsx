import React from 'react';
import { Product } from '../../types';
import { Shield, Eye, Cpu, Zap } from 'lucide-react';

interface ComparisonTableProps {
  products: Product[];
  onSelectProduct?: (p: Product) => void;
}

export const ComparisonTable: React.FC<ComparisonTableProps> = ({ products }) => {
  const safeProducts = products || [];

  if (safeProducts.length === 0) {
    return (
      <div className="p-8 text-center text-xs text-stone-500 bg-white rounded-2xl border border-stone-200">
        No cameras selected for comparison.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border border-stone-200/90 rounded-[28px] bg-white shadow-xs">
      <table className="w-full text-left text-xs border-collapse">
        <thead>
          <tr className="bg-[#5A5A40] text-white divide-x divide-stone-400/30">
            <th className="p-4.5 min-w-[180px] font-serif font-semibold text-sm">Specification</th>
            {safeProducts.map(p => (
              <th key={p.id} className="p-4.5 min-w-[220px] font-medium">
                <span className="text-[10px] text-stone-200 font-mono uppercase tracking-widest block">{p.brand}</span>
                <span className="text-sm font-serif font-bold text-white block mt-0.5 line-clamp-2">{p.name}</span>
                <span className="text-stone-200 font-bold text-sm block mt-1.5 font-sans">
                  ₹{p.price.toLocaleString('en-IN')}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-100 text-stone-700">
          <tr className="hover:bg-[#F5F5F0] divide-x divide-stone-100 transition-colors">
            <td className="p-4 font-semibold text-[#1A1A1A] flex items-center gap-2">
              <Eye className="w-4 h-4 text-[#5A5A40]" />
              <span>Resolution</span>
            </td>
            {safeProducts.map(p => (
              <td key={p.id} className="p-4 font-medium text-stone-900">
                {p.specifications?.resolution || 'N/A'}
              </td>
            ))}
          </tr>
          <tr className="hover:bg-[#F5F5F0] divide-x divide-stone-100 transition-colors">
            <td className="p-4 font-semibold text-[#1A1A1A]">Night Vision Tech</td>
            {safeProducts.map(p => (
              <td key={p.id} className="p-4">
                {p.specifications?.night_vision || 'N/A'}
              </td>
            ))}
          </tr>
          <tr className="hover:bg-[#F5F5F0] divide-x divide-stone-100 transition-colors">
            <td className="p-4 font-semibold text-[#1A1A1A] flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#5A5A40]" />
              <span>AI Target Analytics</span>
            </td>
            {safeProducts.map(p => (
              <td key={p.id} className="p-4 text-stone-900">
                {p.specifications?.ai_features || 'Motion Trigger'}
              </td>
            ))}
          </tr>
          <tr className="hover:bg-[#F5F5F0] divide-x divide-stone-100 transition-colors">
            <td className="p-4 font-semibold text-[#1A1A1A] flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#5A5A40]" />
              <span>Weatherproofing</span>
            </td>
            {safeProducts.map(p => (
              <td key={p.id} className="p-4">
                {p.specifications?.weatherproof || 'Standard'}
              </td>
            ))}
          </tr>
          <tr className="hover:bg-[#F5F5F0] divide-x divide-stone-100 transition-colors">
            <td className="p-4 font-semibold text-[#1A1A1A] flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#5A5A40]" />
              <span>Power Source</span>
            </td>
            {safeProducts.map(p => (
              <td key={p.id} className="p-4">
                {p.specifications?.power_source || '12V DC'}
              </td>
            ))}
          </tr>
          <tr className="hover:bg-[#F5F5F0] divide-x divide-stone-100 transition-colors">
            <td className="p-4 font-semibold text-[#1A1A1A]">Recommended Use Case</td>
            {safeProducts.map(p => (
              <td key={p.id} className="p-4 text-xs text-stone-600 italic">
                {p.recommended_for || p.tagline || ''}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
};
