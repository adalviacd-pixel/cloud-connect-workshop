import React, { useState } from 'react';
import { Search, Sparkles, Loader2, Zap, ArrowRight } from 'lucide-react';
import { POPULAR_CAREERS } from '../data/defaultRoadmaps';

interface CareerSearchBarProps {
  onSearch: (career: string, experienceLevel: string) => void;
  isLoading: boolean;
  activeCareer: string;
  loadingStageText?: string;
}

export const CareerSearchBar: React.FC<CareerSearchBarProps> = ({
  onSearch,
  isLoading,
  activeCareer,
  loadingStageText,
}) => {
  const [careerInput, setCareerInput] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('All Levels');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (careerInput.trim() && !isLoading) {
      onSearch(careerInput.trim(), experienceLevel);
    }
  };

  const handleChipClick = (career: string) => {
    setCareerInput(career);
    onSearch(career, experienceLevel);
  };

  return (
    <div className="w-full px-4 sm:px-8 py-5 border-b border-slate-800 bg-[#050505]/90 backdrop-blur-md sticky top-0 z-20">
      {/* Search Container matching Immersive UI */}
      <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Search input with rounded-full styling */}
        <div className="flex-1 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
          <input
            id="career-input-field"
            type="text"
            value={careerInput}
            onChange={(e) => setCareerInput(e.target.value)}
            placeholder="Enter target career (e.g. Cybersecurity Architect, AI Engineer, Full Stack...)"
            disabled={isLoading}
            className="w-full bg-slate-900 border border-slate-700 rounded-full py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-white placeholder-slate-500 shadow-inner disabled:opacity-50"
          />
        </div>

        {/* Experience Level & Generate button */}
        <div className="flex items-center gap-2">
          <select
            id="experience-level-select"
            value={experienceLevel}
            onChange={(e) => setExperienceLevel(e.target.value)}
            disabled={isLoading}
            className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-xs font-medium text-slate-300 rounded-full border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 cursor-pointer disabled:opacity-50"
          >
            <option value="All Levels">All Career Stages</option>
            <option value="Entry-Level / Career Switcher">Entry / Switcher</option>
            <option value="Mid-Level Specialist">Mid-Level Specialist</option>
            <option value="Senior / Principal Architect">Senior / Architect</option>
          </select>

          <button
            id="generate-roadmap-btn"
            type="submit"
            disabled={isLoading || !careerInput.trim()}
            className="flex items-center justify-center space-x-2 px-5 py-2 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs sm:text-sm transition-all shadow-[0_0_15px_rgba(99,102,241,0.4)] disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none whitespace-nowrap cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-white" />
                <span>Grounding...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-3.5 w-3.5 text-indigo-200" />
                <span>Generate Roadmap</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Loading Stages Subtext when Grounding is Active */}
      {isLoading && (
        <div className="mt-2.5 flex items-center space-x-2 text-xs text-indigo-300 animate-pulse">
          <Loader2 className="h-3.5 w-3.5 animate-spin text-indigo-400" />
          <span>
            {loadingStageText || 'Triggering Google Search Grounding with Gemini 3.8 Flash...'}
          </span>
        </div>
      )}

      {/* Quick Select Career Chips */}
      <div className="mt-3 flex items-center flex-wrap gap-2 pt-2 border-t border-slate-900">
        <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider flex items-center mr-1">
          <Zap className="h-3 w-3 mr-1 text-slate-500" /> Quick Select:
        </span>
        {POPULAR_CAREERS.map((career) => {
          const isSelected = activeCareer.toLowerCase() === career.toLowerCase();
          return (
            <button
              key={career}
              id={`quick-chip-${career.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
              onClick={() => handleChipClick(career)}
              disabled={isLoading}
              className={`px-3 py-1 text-[11px] font-bold rounded-md border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.4)]'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              {career}
            </button>
          );
        })}
      </div>
    </div>
  );
};
