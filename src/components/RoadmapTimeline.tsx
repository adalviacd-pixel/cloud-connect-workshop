import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  Sparkles, 
  Briefcase, 
  Terminal, 
  BookOpen, 
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Filter,
  Flame,
  ShieldCheck,
  Zap,
  Hammer
} from 'lucide-react';
import { CareerRoadmap, MilestoneItem, ProgressState, RoadmapPhase } from '../types';

interface RoadmapTimelineProps {
  roadmap: CareerRoadmap;
  progress: ProgressState;
  onToggleMilestone: (milestoneId: string, phaseId: string) => void;
  onToggleSkill: (skillKey: string, milestoneId: string) => void;
}

export const RoadmapTimeline: React.FC<RoadmapTimelineProps> = ({
  roadmap,
  progress,
  onToggleMilestone,
  onToggleSkill,
}) => {
  const [filterQuery, setFilterQuery] = useState('');
  const [activePhaseFilter, setActivePhaseFilter] = useState<string>('all');
  const [expandedMilestones, setExpandedMilestones] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpandedMilestones(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredPhases = roadmap.phases.filter(phase => {
    if (activePhaseFilter !== 'all' && phase.id !== activePhaseFilter) {
      return false;
    }
    return true;
  });

  return (
    <div className="w-full px-4 sm:px-8 py-6 space-y-8">
      {/* 2026 Shift vs Historical Fundamentals Comparison Banner */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Modern 2026 Requirements Card */}
        <div className="bg-gradient-to-br from-indigo-950/30 via-slate-900/80 to-[#0a0a0a] border border-indigo-500/30 rounded-xl p-5 shadow-lg relative overflow-hidden group">
          <div className="flex items-center space-x-2 text-indigo-400 mb-2">
            <Sparkles className="h-4 w-4" />
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-indigo-400">
              2026 Modern Industry Requirements
            </h2>
          </div>
          <h3 className="text-base font-semibold text-white">
            {roadmap.industryShift2026?.title || 'Current Industry Shifts & Emerging Paradigms'}
          </h3>
          <p className="mt-1 text-xs text-slate-300 leading-relaxed">
            {roadmap.industryShift2026?.summary}
          </p>

          <div className="mt-3 space-y-1.5">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Key 2026 Drivers:
            </span>
            <ul className="space-y-1 text-xs text-slate-300">
              {roadmap.industryShift2026?.keyDrivers?.map((driver, idx) => (
                <li key={idx} className="flex items-start space-x-2">
                  <span className="text-indigo-400 mt-0.5">•</span>
                  <span>{driver}</span>
                </li>
              ))}
            </ul>
          </div>

          {roadmap.industryShift2026?.emergingTechToMaster && (
            <div className="mt-3 pt-3 border-t border-slate-800 flex flex-wrap gap-1.5">
              {roadmap.industryShift2026.emergingTechToMaster.map((tech, idx) => (
                <span 
                  key={idx} 
                  className="px-2.5 py-0.5 text-[11px] font-mono rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20"
                >
                  {tech}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Historical Fundamental Skills Card */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 shadow-lg">
          <div className="flex items-center space-x-2 text-slate-400 mb-2">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Timeless Core Fundamentals
            </h2>
          </div>
          <h3 className="text-base font-semibold text-white">
            Enduring Architectural Principles
          </h3>
          <p className="mt-1 text-xs text-slate-400 leading-relaxed">
            Frameworks and libraries evolve rapidly, but foundational computer science, systems design, and protocols remain the permanent bedrock of top engineers.
          </p>

          <ul className="mt-3 space-y-2 text-xs text-slate-300">
            {roadmap.historicalFundamentals?.map((fund, idx) => (
              <li key={idx} className="flex items-start space-x-2 bg-[#050505]/60 p-2.5 rounded-lg border border-slate-800/80">
                <span className="font-mono text-emerald-400 text-xs font-bold">0{idx + 1}</span>
                <span>{fund}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Phase Controls & Search Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
        {/* Phase Pill Buttons */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            onClick={() => setActivePhaseFilter('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              activePhaseFilter === 'all'
                ? 'bg-indigo-600 text-white shadow-[0_0_10px_rgba(99,102,241,0.4)]'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
            }`}
          >
            All 4 Phases
          </button>
          {roadmap.phases.map((phase) => (
            <button
              key={phase.id}
              onClick={() => setActivePhaseFilter(phase.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                activePhaseFilter === phase.id
                  ? 'bg-indigo-600 text-white shadow-[0_0_10px_rgba(99,102,241,0.4)]'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
              }`}
            >
              Phase {phase.phaseNumber} ({phase.durationWeeks})
            </button>
          ))}
        </div>

        {/* Search / Filter input within roadmap */}
        <div className="relative min-w-[220px]">
          <Filter className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
          <input
            type="text"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            placeholder="Filter skills or topics..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded-full text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          />
        </div>
      </div>

      {/* Main Roadmap Phases Timeline */}
      <div className="space-y-8 relative">
        {filteredPhases.map((phase) => {
          // Filter milestones based on filterQuery
          const displayedMilestones = phase.milestones.filter(m => {
            if (!filterQuery) return true;
            const q = filterQuery.toLowerCase();
            return (
              m.title.toLowerCase().includes(q) ||
              m.skills.some(s => s.toLowerCase().includes(q)) ||
              m.keyTopics.some(t => t.toLowerCase().includes(q)) ||
              m.practicalProject.name.toLowerCase().includes(q)
            );
          });

          if (displayedMilestones.length === 0 && filterQuery) {
            return null;
          }

          const completedCount = phase.milestones.filter(
            m => progress.completedMilestones[m.id]
          ).length;
          const isPhaseCompleted = completedCount === phase.milestones.length && phase.milestones.length > 0;

          return (
            <section 
              key={phase.id} 
              id={`section-${phase.id}`}
              className="bg-[#0a0a0a]/70 border border-slate-800 rounded-2xl p-5 sm:p-7 relative overflow-hidden backdrop-blur-md"
            >
              {/* Phase Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-800">
                <div className="flex items-start space-x-3.5">
                  <div className={`h-9 w-9 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${
                    isPhaseCompleted 
                      ? 'bg-emerald-500 text-slate-950 shadow-[0_0_12px_rgba(16,185,129,0.4)]' 
                      : 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                  }`}>
                    {phase.phaseNumber}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-lg font-bold text-white tracking-tight">
                        {phase.title}
                      </h3>
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                        {phase.durationWeeks}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      {phase.description}
                    </p>
                  </div>
                </div>

                {/* Focus Pill & Phase Progress */}
                <div className="flex items-center space-x-3 text-xs sm:self-start">
                  <span className="hidden md:inline px-2.5 py-1 rounded-md bg-slate-800/80 text-indigo-300 border border-slate-700 font-medium text-[11px]">
                    Focus: {phase.focus}
                  </span>
                  <span className="font-mono text-slate-300 bg-slate-900 px-2.5 py-1 rounded-md border border-slate-800 text-[11px]">
                    {completedCount}/{phase.milestones.length} Milestones
                  </span>
                </div>
              </div>

              {/* Milestones List with Timeline Track */}
              <div className="mt-6 space-y-4 relative">
                {displayedMilestones.map((milestone, mIdx) => {
                  const isCompleted = Boolean(progress.completedMilestones[milestone.id]);
                  const isExpanded = expandedMilestones[milestone.id] ?? true;

                  // Check how many individual skills in this milestone are checked
                  const milestoneSkillKeys = milestone.skills.map((_, sIdx) => `${milestone.id}-skill-${sIdx}`);
                  const checkedSkillsCount = milestoneSkillKeys.filter(k => progress.completedSkills[k]).length;

                  return (
                    <div
                      key={milestone.id}
                      id={`milestone-${milestone.id}`}
                      className={`rounded-xl border transition-all ${
                        isCompleted
                          ? 'bg-slate-900/60 border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.05)]'
                          : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {/* Milestone Summary Header Bar */}
                      <div className="p-4 sm:p-5 flex items-start justify-between gap-3">
                        <div className="flex items-start space-x-3 flex-1 min-w-0">
                          {/* Complete Milestone Checkbox */}
                          <button
                            id={`toggle-milestone-${milestone.id}`}
                            onClick={() => onToggleMilestone(milestone.id, phase.id)}
                            className="mt-0.5 text-slate-500 hover:text-indigo-400 transition-colors focus:outline-none cursor-pointer shrink-0"
                            title={isCompleted ? 'Mark milestone incomplete' : 'Mark milestone complete'}
                          >
                            {isCompleted ? (
                              <CheckCircle2 className="h-5 w-5 text-emerald-400 fill-emerald-500/10" />
                            ) : (
                              <Circle className="h-5 w-5 text-slate-600 hover:text-slate-400" />
                            )}
                          </button>

                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <h4 className={`text-sm sm:text-base font-semibold ${
                                isCompleted ? 'text-slate-400 line-through decoration-slate-600' : 'text-white'
                              }`}>
                                {milestone.title}
                              </h4>
                              <span className="flex items-center text-[11px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                                <Clock className="h-3 w-3 mr-1 text-slate-400" />
                                ~{milestone.estimatedHours} hrs
                              </span>
                              {checkedSkillsCount > 0 && (
                                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/40">
                                  {checkedSkillsCount}/{milestone.skills.length} skills
                                </span>
                              )}
                            </div>

                            {/* 2026 Shift Note Badge */}
                            {milestone.modernShift2026 && (
                              <div className="mt-1.5 flex items-center space-x-1.5 text-xs text-indigo-300 font-medium">
                                <Sparkles className="h-3 w-3 text-indigo-400 shrink-0" />
                                <span>2026 Requirement: {milestone.modernShift2026}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Expand / Collapse toggle */}
                        <button
                          onClick={() => toggleExpand(milestone.id)}
                          className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                        >
                          {isExpanded ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </button>
                      </div>

                      {/* Expanded Details Body */}
                      {isExpanded && (
                        <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-1 border-t border-slate-800/80 space-y-4">
                          {/* Interactive Skills Checklist */}
                          <div>
                            <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-2 block">
                              Required Competencies & Checkpoints:
                            </span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {milestone.skills.map((skill, sIdx) => {
                                const skillKey = `${milestone.id}-skill-${sIdx}`;
                                const isSkillDone = Boolean(progress.completedSkills[skillKey]) || isCompleted;

                                return (
                                  <label
                                    key={skillKey}
                                    id={`skill-label-${skillKey}`}
                                    className={`flex items-center space-x-2.5 p-2 rounded-lg text-xs transition-colors cursor-pointer border ${
                                      isSkillDone
                                        ? 'bg-slate-800/40 text-slate-300 border-slate-700/60'
                                        : 'bg-[#050505]/60 text-slate-400 hover:text-slate-200 border-slate-800 hover:border-slate-700'
                                    }`}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={isSkillDone}
                                      onChange={() => onToggleSkill(skillKey, milestone.id)}
                                      className="h-3.5 w-3.5 rounded bg-slate-800 border-slate-600 text-indigo-500 focus:ring-0 focus:ring-offset-0 cursor-pointer accent-indigo-500"
                                    />
                                    <span className={isSkillDone ? 'line-through text-slate-500' : ''}>
                                      {skill}
                                    </span>
                                  </label>
                                );
                              })}
                            </div>
                          </div>

                          {/* Practical Project Card */}
                          {milestone.practicalProject && (
                            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
                              <div className="flex items-center space-x-2 text-indigo-400 mb-1">
                                <Hammer className="h-3.5 w-3.5" />
                                <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400">
                                  Practical Hands-On Project:
                                </span>
                              </div>
                              <h5 className="text-xs sm:text-sm font-semibold text-white">
                                {milestone.practicalProject.name}
                              </h5>
                              <p className="text-xs text-slate-400 mt-1">
                                {milestone.practicalProject.description}
                              </p>
                              <div className="mt-2 text-[11px] font-mono text-emerald-400 bg-[#050505] px-2.5 py-1 rounded border border-slate-800 flex items-center space-x-1.5">
                                <span className="text-slate-500">Deliverable:</span>
                                <span>{milestone.practicalProject.deliverable}</span>
                              </div>
                            </div>
                          )}

                          {/* Learning Resources */}
                          {milestone.learningResources && milestone.learningResources.length > 0 && (
                            <div className="flex flex-wrap items-center gap-2 pt-1">
                              <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold flex items-center">
                                <BookOpen className="h-3 w-3 mr-1 text-slate-500" />
                                Resources:
                              </span>
                              {milestone.learningResources.map((res, rIdx) => (
                                <a
                                  key={rIdx}
                                  href={res.urlHint || `https://www.google.com/search?q=${encodeURIComponent(res.title)}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center space-x-1 text-[11px] text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded border border-slate-700 transition-colors"
                                >
                                  <span>{res.title}</span>
                                  <ExternalLink className="h-2.5 w-2.5 text-slate-400" />
                                </a>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
};
