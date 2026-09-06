import React, { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { CallWhatsAppBar } from './components/common/CallWhatsAppBar';
import { ChatWidget } from './components/chatbot/ChatWidget';

// Pages
import { HomePage } from './pages/HomePage';
import { ServicesPage } from './pages/ServicesPage';
import { SolutionsPage } from './pages/SolutionsPage';
import { ProductsPage } from './pages/ProductsPage';
import { ComparePage } from './pages/ComparePage';
import { AMCPage } from './pages/AMCPage';
import { RechargePage } from './pages/RechargePage';
import { ProjectsPage } from './pages/ProjectsPage';
import { ReviewsPage } from './pages/ReviewsPage';
import { ContactPage } from './pages/ContactPage';
import { AdminPage } from './pages/AdminPage';
import { SiteSurveyForm } from './components/forms/SiteSurveyForm';
import { ServiceRequestForm } from './components/forms/ServiceRequestForm';

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<string>('/');
  const [isAdminView, setIsAdminView] = useState<boolean>(false);

  // Sync scroll on route change
  const navigate = (route: string) => {
    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleAdmin = () => {
    if (isAdminView) {
      setIsAdminView(false);
      navigate('/');
    } else {
      setIsAdminView(true);
      navigate('/admin');
    }
  };

  // Render current active page
  const renderPage = () => {
    if (isAdminView || currentRoute === '/admin') {
      return <AdminPage />;
    }

    switch (currentRoute) {
      case '/':
        return <HomePage onNavigate={navigate} />;
      case '/services':
        return <ServicesPage onNavigate={navigate} />;
      case '/solutions':
        return <SolutionsPage onNavigate={navigate} />;
      case '/products':
        return <ProductsPage onNavigate={navigate} />;
      case '/compare':
        return <ComparePage onNavigate={navigate} />;
      case '/amc':
        return <AMCPage />;
      case '/recharge':
        return <RechargePage />;
      case '/projects':
        return <ProjectsPage />;
      case '/reviews':
        return <ReviewsPage />;
      case '/contact':
        return <ContactPage />;
      case '/survey':
        return (
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <SiteSurveyForm onSuccess={() => setTimeout(() => navigate('/'), 4000)} />
          </div>
        );
      case '/service-request':
        return (
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <ServiceRequestForm onSuccess={() => setTimeout(() => navigate('/'), 4000)} />
          </div>
        );
      default:
        return <HomePage onNavigate={navigate} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F0] text-[#1A1A1A] selection:bg-[#5A5A40] selection:text-white">
      {/* Top Navigation */}
      <Navbar
        currentRoute={currentRoute}
        onNavigate={(route) => {
          if (route === '/admin') {
            setIsAdminView(true);
          } else {
            setIsAdminView(false);
          }
          navigate(route);
        }}
        isAdminView={isAdminView || currentRoute === '/admin'}
        onToggleAdmin={handleToggleAdmin}
      />

      {/* Main Content Body */}
      <main className="flex-1">
        {renderPage()}
      </main>

      {/* Global Footer */}
      <Footer onNavigate={navigate} />

      {/* Sticky Mobile Call & WhatsApp Bar */}
      <CallWhatsAppBar />

      {/* AI & Decision-Tree Chatbot Assistant */}
      <ChatWidget onNavigate={navigate} />
    </div>
  );
}
