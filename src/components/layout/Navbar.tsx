import React, { useState } from 'react';
import { Shield, Phone, MessageSquare, Menu, X, ArrowRight, UserCheck, Layers, Sparkles } from 'lucide-react';
import { OWNER_CONTACTS } from '../../data/mockData';

interface NavbarProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
  isAdminView?: boolean;
  onToggleAdmin?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRoute,
  onNavigate,
  isAdminView = false,
  onToggleAdmin,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Home', route: '/' },
    { label: 'Services', route: '/services' },
    { label: 'Solutions', route: '/solutions' },
    { label: 'Products', route: '/products' },
    { label: 'Compare', route: '/compare' },
    { label: 'AMC Plans', route: '/amc' },
    { label: 'Instant Recharge', route: '/recharge', highlight: true },
    { label: 'Projects', route: '/projects' },
    { label: 'Reviews', route: '/reviews' },
    { label: 'Contact', route: '/contact' },
  ];

  const handleLinkClick = (route: string) => {
    onNavigate(route);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#F5F5F0]/95 backdrop-blur-md border-b border-stone-200 text-[#1A1A1A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Brand Logo */}
          <div
            onClick={() => handleLinkClick('/')}
            className="flex items-center gap-3 cursor-pointer select-none shrink-0"
          >
            <div className="w-10 h-10 rounded-2xl bg-[#5A5A40] flex items-center justify-center text-white shadow-sm">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <span className="font-serif font-bold text-lg tracking-tight text-[#5A5A40] block leading-tight">
                SECUREVISION <span className="text-[#1A1A1A] font-light">SYSTEMS</span>
              </span>
              <span className="text-[10px] text-stone-500 font-sans tracking-wide block">
                CCTV Security &bullet; Pune & Maharashtra
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1.5 text-xs font-medium">
            {navLinks.map(link => {
              const isActive = currentRoute === link.route;
              return (
                <button
                  key={link.route}
                  onClick={() => handleLinkClick(link.route)}
                  className={`px-3.5 py-2 rounded-full transition-all ${
                    link.highlight
                      ? 'bg-[#5A5A40]/10 text-[#5A5A40] border border-[#5A5A40]/30 hover:bg-[#5A5A40]/20 font-semibold'
                      : isActive
                      ? 'bg-[#5A5A40] text-white font-semibold shadow-xs'
                      : 'text-stone-600 hover:text-[#1A1A1A] hover:bg-stone-200/60'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Quick Actions & Admin Toggle */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Direct WhatsApp Callout */}
            <a
              href={`https://wa.me/${OWNER_CONTACTS[0].phone.replace(/\D/g, '')}?text=${encodeURIComponent(
                'Hello Anand Gaikwad, I need CCTV installation guidance.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-[#5A5A40] border border-stone-300/80 rounded-full text-xs font-semibold transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp Anand</span>
            </a>

            {/* Quick Free Survey Button */}
            <button
              onClick={() => handleLinkClick('/survey')}
              className="hidden md:flex items-center gap-1.5 bg-[#5A5A40] hover:bg-[#4A4A35] text-white font-medium text-xs px-5 py-2 rounded-full transition-all shadow-xs"
            >
              <span>Free Survey</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {/* Admin Switcher Toggle */}
            {onToggleAdmin && (
              <button
                onClick={onToggleAdmin}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium border transition-colors ${
                  isAdminView
                    ? 'bg-stone-900 text-white border-stone-800'
                    : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50'
                }`}
                title="Toggle Admin Control Center"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{isAdminView ? 'Exit Admin' : 'Admin'}</span>
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2.5 rounded-xl bg-white border border-stone-200 text-stone-700 hover:text-black"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="xl:hidden py-4 border-t border-stone-200 space-y-2 bg-[#F5F5F0]">
            <div className="grid grid-cols-2 gap-2 pb-3">
              {navLinks.map(link => (
                <button
                  key={link.route}
                  onClick={() => handleLinkClick(link.route)}
                  className={`px-3.5 py-2.5 text-left rounded-xl text-xs font-medium transition-colors ${
                    currentRoute === link.route
                      ? 'bg-[#5A5A40] text-white font-semibold'
                      : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </div>

            <div className="pt-3 border-t border-stone-200 flex flex-col gap-2">
              <button
                onClick={() => handleLinkClick('/survey')}
                className="w-full py-2.5 bg-[#5A5A40] text-white font-medium text-xs rounded-xl text-center shadow-xs"
              >
                Book Free On-Site Survey
              </button>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {OWNER_CONTACTS.map((c, i) => (
                  <a
                    key={i}
                    href={`tel:${c.phone}`}
                    className="p-2.5 bg-white border border-stone-200 rounded-xl text-center font-mono text-[#5A5A40] font-semibold hover:bg-stone-50"
                  >
                    Call {c.name.split(' ')[0]}
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
