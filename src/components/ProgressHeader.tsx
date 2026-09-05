import React from 'react';
import { 
  CheckCircle2, 
  TrendingUp, 
  DollarSign, 
  Wifi, 
  Briefcase, 
  RotateCcw,
  Clock,
  Layers,
  Award,
  Sparkles,
  Zap
} from 'lucide-react';
import { CareerRoadmap, ProgressState } from '../types';

interface ProgressHeaderProps {
  roadmap: CareerRoadmap;
  progress: ProgressState;
  onResetProgress: () => void;
  totalMilestones: number;
  completedMilestonesCount: number;
  totalSkills: number;
  completedSkillsCount: number;
  totalHours: number;
  completedHours: number;
  progressPercentage: number;
}

export const ProgressHeader: React.FC<ProgressHeaderProps> = ({
  roadmap,
  progress,
  onResetProgress,
  totalMilestones,
  completedMilestonesCount,
  totalSkills,
  completedSkillsCount,
  totalHours,
  completedHours,
  progressPercentage,
}) => {
  return (
    <div className="w-full px-4 sm:px-8 py-6 space-y-6">
      {/* Top Banner with Career Overview & Highlight Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Role Title, Tagline & Overview (2 cols) */}
        <div className="lg:col-span-2 bg-slate-900/50 border border-slate-800 rounded-2xl p-6 sm:p-7 backdrop-blur-md relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          <div>
            <div className="flex items-center space-x-2.5 mb-3">
              <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                {roadmap.marketDemand?.level || 'High'} Market Demand
              </span>
              <span className="text-xs text-slate-500 font-mono">
                {roadmap.phases.length} Phases • {roadmap.certifications.length} Certifications
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {roadmap.career}
            </h1>
            <p className="mt-2 text-sm sm:text-base text-indigo-300 font-medium leading-relaxed">
              {roadmap.tagline}
            </p>
            <p className="mt-3 text-xs sm:text-sm text-slate-400 leading-relaxed">
              {roadmap.overview}
            </p>
          </div>

          {/* Quick Market Stats Chips */}
          {roadmap.marketDemand && (
            <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
              <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/60 text-slate-200 font-mono">
                <DollarSign className="h-3.5 w-3.5 text-emerald-400" />
                <span className="font-semibold text-white">{roadmap.marketDemand.salaryRangeUSD}</span>
              </div>
              <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/60 text-slate-300">
                <Wifi className="h-3.5 w-3.5 text-indigo-400" />
                <span>{roadmap.marketDemand.remoteAvailability}</span>
              </div>
              {roadmap.marketDemand.topHiringIndustries && (
                <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/60 text-slate-400">
                  <Briefcase className="h-3.5 w-3.5 text-slate-500" />
                  <span>Hiring: {roadmap.marketDemand.topHiringIndustries.slice(0, 3).join(', ')}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: Immersive UI Pathway Highlight Card (1 col) */}
        <div className="bg-indigo-600 rounded-2xl p-6 shadow-[0_20px_50px_rgba(79,70,229,0.3)] text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />

          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-bold uppercase tracking-widest bg-white/20 px-2.5 py-1 rounded-md text-white">
                Active Pathway
              </span>
              {progressPercentage > 0 && (
                <button
                  onClick={onResetProgress}
                  title="Reset progress"
                  className="text-white/80 hover:text-white p-1 rounded hover:bg-white/10 transition-colors"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-baseline justify-between mb-2">
              <h3 className="text-3xl font-extrabold tracking-tight">
                {progressPercentage}%
              </h3>
              <span className="text-xs text-indigo-100 font-mono">
                {completedMilestonesCount}/{totalMilestones} Milestones
              </span>
            </div>

            {/* Custom progress bar */}
            <div className="w-full bg-indigo-950/40 h-2.5 rounded-full overflow-hidden p-0.5 mb-4">
              <div 
                className="bg-white h-full rounded-full transition-all duration-500 shadow-sm"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>

            <p className="text-xs text-indigo-100/90 leading-snug">
              {progressPercentage === 100 
                ? 'All roadmap milestones and industry competencies completed! Ready for certification exams.'
                : `${completedSkillsCount} of ${totalSkills} core competencies verified. Keep going to reach market readiness!`}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-indigo-500/50 flex items-center justify-between text-[11px] text-indigo-100 font-mono">
            <span className="flex items-center">
              <Clock className="w-3.5 h-3.5 mr-1 text-indigo-200" />
              {completedHours} / {totalHours} hrs estimated
            </span>
            <span className="bg-indigo-700/60 px-2 py-0.5 rounded text-[10px] font-sans">
              2026 Ready
            </span>
          </div>
        </div>
      </div>

      {/* Phase Mini Progress breakdown cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {roadmap.phases.map((phase) => {
          const phaseTotal = phase.milestones.length;
          const phaseCompleted = phase.milestones.filter(
            m => progress.completedMilestones[m.id]
          ).length;
          const phasePercent = phaseTotal > 0 ? Math.round((phaseCompleted / phaseTotal) * 100) : 0;

          return (
            <div 
              key={phase.id} 
              className="bg-slate-900/40 p-3.5 rounded-xl border border-slate-800 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-slate-300 font-semibold truncate">
                  Phase {phase.phaseNumber}
                </span>
                <span className="font-mono text-indigo-400 font-bold text-[11px]">
                  {phasePercent}%
                </span>
              </div>
              <div className="text-[10px] text-slate-500 truncate mb-2">
                {phase.focus}
              </div>
              {/* Progress Mini Bar */}
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-indigo-500 h-full rounded-full transition-all duration-300 shadow-[0_0_8px_rgba(99,102,241,0.5)]"
                  style={{ width: `${phasePercent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
