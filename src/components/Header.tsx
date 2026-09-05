import React, { useState } from 'react';
import { 
  Zap,
  Layers, 
  Award, 
  Code2, 
  Share2, 
  Menu,
  X,
  Compass,
  CheckCircle2,
  BookOpen
} from 'lucide-react';

interface HeaderProps {
  career: string;
  isGroundingLive: boolean;
  generatedAt: string;
  onOpenCodeModal: () => void;
  onOpenExportModal: () => void;
  progressPercent: number;
  activeTab: 'all' | 'roadmap' | 'certifications';
  onSelectTab: (tab: 'all' | 'roadmap' | 'certifications') => void;
  certCount?: number;
  phasesCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  career,
  isGroundingLive,
  generatedAt,
  onOpenCodeModal,
  onOpenExportModal,
  progressPercent,
  activeTab,
  onSelectTab,
  certCount = 4,
  phasesCount = 4,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Mobile Top Header */}
      <div className="md:hidden border-b border-slate-800 bg-[#0a0a0a] px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-indigo-500 rounded-md flex items-center justify-center shadow-[0_0_10px_rgba(99,102,241,0.5)]">
            <Zap className="w-4 h-4 text-white fill-white" />
          </div>
          <div>
            <span className="text-base font-bold tracking-tight text-white">SkillPath AI</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Grounding pulse indicator */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
            <span className="text-slate-300 font-medium">{isGroundingLive ? 'Live' : 'Curated'}</span>
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-900 border border-slate-800"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#0a0a0a] border-b border-slate-800 px-4 py-4 space-y-2 z-40">
          <button
            onClick={() => { onSelectTab('all'); setIsMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors text-left ${
              activeTab === 'all'
                ? 'bg-slate-800/60 text-indigo-400 font-medium'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Complete Overview</span>
          </button>

          <button
            onClick={() => { onSelectTab('roadmap'); setIsMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors text-left ${
              activeTab === 'roadmap'
                ? 'bg-slate-800/60 text-indigo-400 font-medium'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Career Roadmap ({phasesCount} Phases)</span>
          </button>

          <button
            onClick={() => { onSelectTab('certifications'); setIsMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors text-left ${
              activeTab === 'certifications'
                ? 'bg-slate-800/60 text-indigo-400 font-medium'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Certifications Hub ({certCount})</span>
          </button>

          <div className="pt-2 border-t border-slate-800 flex items-center gap-2">
            <button
              onClick={() => { onOpenCodeModal(); setIsMobileMenuOpen(false); }}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs rounded-lg text-slate-300 bg-slate-900 border border-slate-800"
            >
              <Code2 className="w-3.5 h-3.5 text-indigo-400" />
              <span>Grounding API</span>
            </button>
            <button
              onClick={() => { onOpenExportModal(); setIsMobileMenuOpen(false); }}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs rounded-lg text-indigo-300 bg-indigo-600/20 border border-indigo-500/30"
            >
              <Share2 className="w-3.5 h-3.5 text-indigo-400" />
              <span>Export</span>
            </button>
          </div>
        </div>
      )}

      {/* Desktop Aside Sidebar (Immersive UI Layout) */}
      <aside className="hidden md:flex w-64 border-r border-slate-800 flex-col bg-[#0a0a0a] shrink-0 sticky top-0 h-screen overflow-y-auto">
        {/* Branding */}
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-2.5 mb-1.5">
            <div className="w-7 h-7 bg-indigo-500 rounded-md flex items-center justify-center shadow-[0_0_12px_rgba(99,102,241,0.5)]">
              <Zap className="w-4 h-4 text-white fill-white" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white">SkillPath AI</span>
          </div>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">
            Intelligence-Driven Career Mapping
          </p>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex-1 p-4 space-y-1.5">
          <button
            onClick={() => onSelectTab('all')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm transition-all text-left cursor-pointer ${
              activeTab === 'all'
                ? 'bg-slate-800/70 text-indigo-400 font-medium shadow-inner'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <Compass className="w-4 h-4 text-indigo-400" />
            <span>Complete Overview</span>
          </button>

          <button
            onClick={() => onSelectTab('roadmap')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm transition-all text-left cursor-pointer ${
              activeTab === 'roadmap'
                ? 'bg-slate-800/70 text-indigo-400 font-medium shadow-inner'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <Layers className="w-4 h-4 text-indigo-400" />
            <span>Career Roadmap</span>
            <span className="ml-auto text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
              {phasesCount}
            </span>
          </button>

          <button
            onClick={() => onSelectTab('certifications')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm transition-all text-left cursor-pointer ${
              activeTab === 'certifications'
                ? 'bg-slate-800/70 text-indigo-400 font-medium shadow-inner'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <Award className="w-4 h-4 text-indigo-400" />
            <span>Certifications Hub</span>
            <span className="ml-auto text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
              {certCount}
            </span>
          </button>

          <div className="pt-4 pb-1">
            <span className="text-[10px] uppercase font-bold text-slate-600 tracking-wider px-3.5">
              Tools & Grounding
            </span>
          </div>

          {/* Grounding API Code inspection */}
          <button
            id="open-code-modal-btn"
            onClick={onOpenCodeModal}
            className="w-full flex items-center gap-3 px-3.5 py-2 rounded-lg text-sm text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 transition-colors text-left cursor-pointer"
          >
            <Code2 className="w-4 h-4 text-slate-500" />
            <span className="text-xs">Grounding API Code</span>
          </button>

          {/* Export Roadmap */}
          <button
            id="open-export-modal-btn"
            onClick={onOpenExportModal}
            className="w-full flex items-center gap-3 px-3.5 py-2 rounded-lg text-sm text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 transition-colors text-left cursor-pointer"
          >
            <Share2 className="w-4 h-4 text-slate-500" />
            <span className="text-xs">Export Roadmap</span>
          </button>
        </nav>

        {/* Bottom Status Card matching Immersive UI */}
        <div className="p-4 mt-auto border-t border-slate-900">
          <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider">
                Status
              </span>
              <div 
                className={`w-2 h-2 rounded-full ${
                  isGroundingLive 
                    ? 'bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]' 
                    : 'bg-amber-400'
                }`}
              />
            </div>
            <p className="text-xs text-slate-300 leading-snug">
              Google Search Grounding <br />
              <span className="text-indigo-300 font-semibold text-xs">
                {isGroundingLive ? 'ACTIVE (Live Data)' : 'CURATED (2026 Shift)'}
              </span>
            </p>
            <p className="text-[10px] text-slate-500 font-mono mt-1">
              Synced: {generatedAt}
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
