import React, { useState } from 'react';
import { 
  Award, 
  ExternalLink, 
  DollarSign, 
  CheckCircle2, 
  FileText, 
  Compass, 
  Search, 
  Tag,
  Clock,
  Sparkles
} from 'lucide-react';
import { CertificationItem } from '../types';

interface CertificationHubProps {
  certifications: CertificationItem[];
  career: string;
}

export const CertificationHub: React.FC<CertificationHubProps> = ({
  certifications,
  career,
}) => {
  const [difficultyFilter, setDifficultyFilter] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const difficultyColors: Record<string, string> = {
    Foundational: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    Associate: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    Professional: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    Specialty: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    Expert: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
  };

  const filteredCerts = certifications.filter((cert) => {
    if (difficultyFilter !== 'All' && cert.difficulty !== difficultyFilter) {
      return false;
    }
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        cert.name.toLowerCase().includes(q) ||
        cert.vendor.toLowerCase().includes(q) ||
        cert.examCode.toLowerCase().includes(q) ||
        cert.relevance2026.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="w-full px-4 sm:px-8 py-6 space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <Award className="h-5 w-5 text-indigo-400" />
            <h2 className="text-xl font-bold text-white tracking-tight">
              Live Certification Hub
            </h2>
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 font-medium">
              Live Web Verified
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Top industry-recognized credentials, official exam codes, current fees, and 2026 employer valuation for {career}.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Difficulty Filter */}
          <div className="flex items-center space-x-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
            {['All', 'Foundational', 'Associate', 'Professional', 'Specialty'].map((level) => (
              <button
                key={level}
                onClick={() => setDifficultyFilter(level)}
                className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors cursor-pointer ${
                  difficultyFilter === level
                    ? 'bg-indigo-600 text-white shadow-[0_0_10px_rgba(99,102,241,0.4)]'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {level}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search vendor or code..."
              className="pl-8 pr-3 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded-full text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 w-44 sm:w-52"
            />
          </div>
        </div>
      </div>

      {/* Certifications Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredCerts.map((cert) => {
          const diffBadgeClass = difficultyColors[cert.difficulty] || 'bg-slate-800 text-slate-300 border-slate-700';

          return (
            <div
              key={cert.id}
              id={`cert-card-${cert.id}`}
              className="bg-[#0a0a0a]/70 hover:bg-slate-900/50 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 sm:p-6 transition-all duration-200 flex flex-col justify-between group backdrop-blur-md"
            >
              <div>
                {/* Top Vendor & Difficulty Row */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest flex items-center">
                    <Tag className="h-3 w-3 mr-1" />
                    {cert.vendor}
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${diffBadgeClass}`}>
                      {cert.difficulty}
                    </span>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#050505] text-slate-300 border border-slate-800">
                      {cert.examCode}
                    </span>
                  </div>
                </div>

                {/* Certification Title */}
                <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-indigo-200 transition-colors leading-snug">
                  {cert.name}
                </h3>

                {/* Exam Fee & Validity Row */}
                <div className="mt-3 flex items-center space-x-4 text-xs text-slate-300">
                  <div className="flex items-center space-x-1 font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    <DollarSign className="h-3 w-3" />
                    <span>{cert.estimatedCost}</span>
                  </div>
                  {cert.validityPeriod && (
                    <div className="flex items-center space-x-1 text-slate-400">
                      <Clock className="h-3 w-3 text-slate-500" />
                      <span>Valid: {cert.validityPeriod}</span>
                    </div>
                  )}
                </div>

                {/* 2026 Job Market Relevance */}
                <div className="mt-3.5 bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                  <div className="flex items-center space-x-1.5 text-xs text-indigo-300 font-semibold mb-1">
                    <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
                    <span>2026 Industry Relevance:</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {cert.relevance2026}
                  </p>
                </div>

                {/* Prerequisites */}
                {cert.prerequisites && (
                  <div className="mt-3 text-xs text-slate-400">
                    <span className="font-semibold text-slate-300">Prerequisites: </span>
                    <span>{cert.prerequisites}</span>
                  </div>
                )}

                {/* Key Topics Tested */}
                {cert.keyTopicsTested && cert.keyTopicsTested.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-800">
                    <span className="text-[10px] uppercase tracking-widest font-bold text-slate-500 block mb-1.5">
                      Core Domains Evaluated:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {cert.keyTopicsTested.map((topic, tIdx) => (
                        <span
                          key={tIdx}
                          className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#050505] text-slate-400 border border-slate-800"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Official Vendor Link CTA */}
              <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 font-mono">Verified Credential</span>
                <a
                  href={cert.officialUrl || `https://www.google.com/search?q=${encodeURIComponent(cert.name + ' certification')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-white transition-colors cursor-pointer border border-slate-700"
                >
                  <span>Verify / Register</span>
                  <ExternalLink className="h-3 w-3 text-indigo-400" />
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {filteredCerts.length === 0 && (
        <div className="text-center py-12 bg-[#0a0a0a] rounded-xl border border-slate-800">
          <Award className="h-8 w-8 text-slate-600 mx-auto mb-2" />
          <p className="text-slate-400 text-sm">No certifications match your filter criteria.</p>
          <button
            onClick={() => { setDifficultyFilter('All'); setSearchTerm(''); }}
            className="mt-2 text-xs text-indigo-400 hover:underline cursor-pointer"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
};
