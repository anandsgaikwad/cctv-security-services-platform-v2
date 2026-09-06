import React, { useState, useEffect } from 'react';
import { catalogApi } from '../services/api';
import { Product } from '../types';
import { Search } from 'lucide-react';

interface ProductsPageProps {
  onNavigate: (route: string) => void;
  onCompareSelect?: (product: Product) => void;
}

export const ProductsPage: React.FC<ProductsPageProps> = ({ onNavigate }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    catalogApi.getProducts().then(res => setProducts(res?.products || [])).catch(() => setProducts([]));
  }, []);

  const filtered = (products || []).filter(p => {
    const matchCat = selectedCategory === 'all' || p.category === selectedCategory;
    const matchBrand = selectedBrand === 'all' || p.brand === selectedBrand;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.brand.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchBrand && matchSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Page Title */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#5A5A40] bg-[#F5F5F0] px-3 py-1 rounded-full border border-stone-200 inline-block">
          Genuine OEM Hardware
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#1A1A1A] tracking-tight">
          CCTV Cameras, NVRs &amp; Storage Catalog
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
          Authorized distribution with manufacturer serial verification, on-site testing, and 2-year warranty replacement.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-[28px] border border-stone-200/90 p-4 sm:p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Search by camera model or feature..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full text-xs pl-10 pr-4 py-2.5 bg-[#F5F5F0] border border-stone-200 rounded-2xl focus:bg-white focus:border-[#5A5A40] text-[#1A1A1A]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="text-xs px-3.5 py-2.5 bg-[#F5F5F0] border border-stone-200 rounded-2xl text-[#1A1A1A] focus:bg-white focus:border-[#5A5A40]"
          >
            <option value="all">All Hardware Categories</option>
            <option value="ip-cameras">IP Cameras (PoE / 4K)</option>
            <option value="hd-analog">HD Analog Cameras</option>
            <option value="ptz-cameras">PTZ 360° Zoom</option>
            <option value="nvrs-dvrs">NVR &amp; DVR Recorders</option>
            <option value="storage">Surveillance HDDs</option>
            <option value="power-accessories">Accessories &amp; Cables</option>
          </select>

          <select
            value={selectedBrand}
            onChange={e => setSelectedBrand(e.target.value)}
            className="text-xs px-3.5 py-2.5 bg-[#F5F5F0] border border-stone-200 rounded-2xl text-[#1A1A1A] focus:bg-white focus:border-[#5A5A40]"
          >
            <option value="all">All Brands</option>
            <option value="Hikvision">Hikvision</option>
            <option value="CP PLUS">CP PLUS</option>
            <option value="Dahua">Dahua</option>
            <option value="Seagate">Seagate</option>
          </select>

          <button
            onClick={() => onNavigate('/compare')}
            className="text-xs font-semibold text-[#5A5A40] bg-[#F5F5F0] hover:bg-stone-200 border border-stone-200 px-4 py-2.5 rounded-full transition-colors"
          >
            Open Comparison Tool
          </button>
        </div>
      </div>

      {/* Product Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(product => (
          <div
            key={product.id}
            className="bg-white rounded-[28px] border border-stone-200/90 overflow-hidden flex flex-col justify-between hover:border-[#5A5A40] hover:shadow-md transition-all group"
          >
            <div>
              <div className="aspect-4/3 bg-stone-100 overflow-hidden relative">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[10px] font-mono text-white">
                  {product.brand}
                </div>
                <div className="absolute bottom-3 left-3 bg-[#5A5A40]/90 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[10px] font-mono text-white">
                  {product.specifications.resolution}
                </div>
              </div>

              <div className="p-5 space-y-2">
                <h3 className="text-base font-serif font-bold text-[#1A1A1A] group-hover:text-[#5A5A40] transition-colors line-clamp-2">
                  {product.name}
                </h3>
                <p className="text-xs text-stone-500 line-clamp-2">{product.tagline}</p>

                <div className="grid grid-cols-2 gap-2 text-[11px] text-stone-600 pt-2 border-t border-stone-100">
                  <div>
                    <span className="text-stone-400 block">Night Vision:</span>
                    <span className="font-medium text-stone-800">{product.specifications.night_vision}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block">Form Factor:</span>
                    <span className="font-medium text-stone-800">{product.specifications.form_factor}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-5 pt-0">
              <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-stone-400 uppercase tracking-wider block">Indicative Unit MRP</span>
                  <span className="text-base font-serif font-bold text-[#1A1A1A]">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                </div>
                <button
                  onClick={() => onNavigate('/survey')}
                  className="px-4 py-2 bg-[#5A5A40] hover:bg-[#4A4A35] text-white rounded-full text-xs font-medium transition-colors"
                >
                  Enquire Install
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
