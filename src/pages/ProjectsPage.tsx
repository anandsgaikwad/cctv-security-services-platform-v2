import React, { useState, useEffect } from 'react';
import { catalogApi } from '../services/api';
import { Project } from '../types';
import { ProjectCard } from '../components/marketing/MarketingComponents';
import { SiteSurveyForm } from '../components/forms/SiteSurveyForm';

export const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filterCat, setFilterCat] = useState('all');

  useEffect(() => {
    catalogApi.getProjects().then(res => setProjects(res.projects));
  }, []);

  const filtered = projects.filter(p => filterCat === 'all' || p.category === filterCat);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#5A5A40] bg-[#F5F5F0] px-3 py-1 rounded-full border border-stone-200 inline-block">
          Field Portfolio
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#1A1A1A] tracking-tight">
          Installed Projects &amp; Real Case Studies
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
          Surveillance architecture executed across high-density residential complexes, retail chains, and manufacturing facilities in Pune.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {['all', 'Residential Society', 'Commercial / Retail', 'Industrial / Logistics'].map(cat => (
          <button
            key={cat}
            onClick={() => setFilterCat(cat)}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
              filterCat === cat
                ? 'bg-[#5A5A40] text-white shadow-xs'
                : 'bg-[#F5F5F0] border border-stone-200 text-stone-700 hover:bg-stone-200'
            }`}
          >
            {cat === 'all' ? 'All Projects' : cat}
          </button>
        ))}
      </div>

      {/* Grid of Projects */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(project => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

      {/* Survey Banner */}
      <SiteSurveyForm />
    </div>
  );
};
