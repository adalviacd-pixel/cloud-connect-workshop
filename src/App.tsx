import React, { useState, useEffect, useMemo } from 'react';
import { 
  DEFAULT_ROADMAPS 
} from './data/defaultRoadmaps';
import { 
  CareerRoadmap, 
  ProgressState 
} from './types';
import { Header } from './components/Header';
import { CareerSearchBar } from './components/CareerSearchBar';
import { ProgressHeader } from './components/ProgressHeader';
import { RoadmapTimeline } from './components/RoadmapTimeline';
import { CertificationHub } from './components/CertificationHub';
import { GroundingSourcesModal } from './components/GroundingSourcesModal';
import { ExportSummaryModal } from './components/ExportSummaryModal';
import { 
  Compass, 
  Sparkles, 
  Award, 
  Layers, 
  AlertCircle,
  ExternalLink,
  ShieldAlert,
  Search
} from 'lucide-react';

export default function App() {
  const initialRoadmap = DEFAULT_ROADMAPS['Full Stack Developer'];
  const [roadmap, setRoadmap] = useState<CareerRoadmap>(initialRoadmap);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStageText, setLoadingStageText] = useState('');
  const [errorNotice, setErrorNotice] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'roadmap' | 'certifications'>('all');

  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Local storage based progress tracking keyed by career
  const [progress, setProgress] = useState<ProgressState>(() => {
    const saved = localStorage.getItem(`skillpath_progress_${initialRoadmap.career}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved progress', e);
      }
    }
    return {
      completedMilestones: {},
      completedSkills: {},
      targetCareer: initialRoadmap.career,
      lastUpdated: new Date().toISOString(),
    };
  });

  // Switch progress when career changes
  useEffect(() => {
    const saved = localStorage.getItem(`skillpath_progress_${roadmap.career}`);
    if (saved) {
      try {
        setProgress(JSON.parse(saved));
        return;
      } catch (e) {}
    }
    setProgress({
      completedMilestones: {},
      completedSkills: {},
      targetCareer: roadmap.career,
      lastUpdated: new Date().toISOString(),
    });
  }, [roadmap.career]);

  // Persist progress to local storage
  const saveProgress = (newProgress: ProgressState) => {
    setProgress(newProgress);
    localStorage.setItem(
      `skillpath_progress_${roadmap.career}`,
      JSON.stringify(newProgress)
    );
  };

  // Progress calculations
  const {
    totalMilestones,
    completedMilestonesCount,
    totalSkills,
    completedSkillsCount,
    totalHours,
    completedHours,
    progressPercentage,
  } = useMemo(() => {
    let tMilestones = 0;
    let cMilestones = 0;
    let tSkills = 0;
    let cSkills = 0;
    let tHours = 0;
    let cHours = 0;

    roadmap.phases.forEach((phase) => {
      phase.milestones.forEach((m) => {
        tMilestones += 1;
        tHours += m.estimatedHours;
        const isMilestoneDone = Boolean(progress.completedMilestones[m.id]);

        if (isMilestoneDone) {
          cMilestones += 1;
          cHours += m.estimatedHours;
        }

        m.skills.forEach((_, sIdx) => {
          tSkills += 1;
          const skillKey = `${m.id}-skill-${sIdx}`;
          if (progress.completedSkills[skillKey] || isMilestoneDone) {
            cSkills += 1;
          }
        });
      });
    });

    const percent = tMilestones > 0 ? Math.round((cMilestones / tMilestones) * 100) : 0;

    return {
      totalMilestones: tMilestones,
      completedMilestonesCount: cMilestones,
      totalSkills: tSkills,
      completedSkillsCount: cSkills,
      totalHours: tHours,
      completedHours: cHours,
      progressPercentage: percent,
    };
  }, [roadmap, progress]);

  // Toggle milestone completion
  const handleToggleMilestone = (milestoneId: string, phaseId: string) => {
    const currentStatus = Boolean(progress.completedMilestones[milestoneId]);
    const newStatus = !currentStatus;

    // Find milestone to toggle its skills
    let targetMilestone: any = null;
    roadmap.phases.forEach((p) => {
      p.milestones.forEach((m) => {
        if (m.id === milestoneId) targetMilestone = m;
      });
    });

    const updatedCompletedSkills = { ...progress.completedSkills };
    if (targetMilestone) {
      targetMilestone.skills.forEach((_: any, idx: number) => {
        updatedCompletedSkills[`${milestoneId}-skill-${idx}`] = newStatus;
      });
    }

    saveProgress({
      ...progress,
      completedMilestones: {
        ...progress.completedMilestones,
        [milestoneId]: newStatus,
      },
      completedSkills: updatedCompletedSkills,
      lastUpdated: new Date().toISOString(),
    });
  };

  // Toggle individual skill
  const handleToggleSkill = (skillKey: string, milestoneId: string) => {
    const currentStatus = Boolean(progress.completedSkills[skillKey]);
    const newStatus = !currentStatus;

    const updatedCompletedSkills = {
      ...progress.completedSkills,
      [skillKey]: newStatus,
    };

    // Find the milestone and check if all its skills are checked
    let targetMilestone: any = null;
    roadmap.phases.forEach((p) => {
      p.milestones.forEach((m) => {
        if (m.id === milestoneId) targetMilestone = m;
      });
    });

    let allChecked = false;
    if (targetMilestone) {
      allChecked = targetMilestone.skills.every((_: any, idx: number) => {
        const key = `${milestoneId}-skill-${idx}`;
        return key === skillKey ? newStatus : Boolean(updatedCompletedSkills[key]);
      });
    }

    saveProgress({
      ...progress,
      completedSkills: updatedCompletedSkills,
      completedMilestones: {
        ...progress.completedMilestones,
        [milestoneId]: allChecked,
      },
      lastUpdated: new Date().toISOString(),
    });
  };

  // Reset progress for current career
  const handleResetProgress = () => {
    if (window.confirm(`Reset your progress for ${roadmap.career}?`)) {
      saveProgress({
        completedMilestones: {},
        completedSkills: {},
        targetCareer: roadmap.career,
        lastUpdated: new Date().toISOString(),
      });
    }
  };

  // Trigger Grounding Search Generation
  const handleSearch = async (career: string, experienceLevel: string) => {
    setIsLoading(true);
    setErrorNotice(null);
    setLoadingStageText('Connecting to Gemini 3.8 Flash...');

    const stageTimers: NodeJS.Timeout[] = [];
    stageTimers.push(
      setTimeout(() => {
        setLoadingStageText('Triggering Google Search Grounding (googleSearch tool)...');
      }, 1200)
    );
    stageTimers.push(
      setTimeout(() => {
        setLoadingStageText('Retrieving live 2026 certification codes, fees, and requirements...');
      }, 3000)
    );
    stageTimers.push(
      setTimeout(() => {
        setLoadingStageText('Parsing web sources into structured milestones & project briefs...');
      }, 5500)
    );

    try {
      const res = await fetch('/api/roadmap/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ career, experienceLevel }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Server responded with status ${res.status}`);
      }

      const data: CareerRoadmap = await res.json();
      setRoadmap(data);

      if (!data.isGroundingLive) {
        setErrorNotice(
          'Generated from verified 2026 standard curriculum. Connect your GEMINI_API_KEY in Settings > Secrets to activate live Google Search Grounding for any arbitrary career.'
        );
      }
    } catch (err: any) {
      console.error('Failed to generate career roadmap:', err);
      setErrorNotice(
        err?.message || 'Failed to connect to the roadmap server. Please verify your connection.'
      );
    } finally {
      stageTimers.forEach(clearTimeout);
      setIsLoading(false);
      setLoadingStageText('');
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-slate-100 flex flex-col md:flex-row font-sans selection:bg-indigo-500 selection:text-white">
      {/* Sidebar Navigation */}
      <Header
        career={roadmap.career}
        isGroundingLive={roadmap.isGroundingLive}
        generatedAt={roadmap.generatedAt}
        onOpenCodeModal={() => setIsCodeModalOpen(true)}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        progressPercent={progressPercentage}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        certCount={roadmap.certifications.length}
        phasesCount={roadmap.phases.length}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-x-hidden">
        <main className="flex-1 pb-16">
          <CareerSearchBar
            onSearch={handleSearch}
            isLoading={isLoading}
            activeCareer={roadmap.career}
            loadingStageText={loadingStageText}
          />

          {/* Optional Notice / Alert */}
          {errorNotice && (
            <div className="w-full px-4 sm:px-8 mt-2">
              <div className="p-3.5 bg-slate-900/90 border border-indigo-500/30 rounded-xl text-xs text-indigo-300 flex items-center justify-between shadow-lg">
                <div className="flex items-center space-x-2">
                  <ShieldAlert className="h-4 w-4 text-indigo-400 shrink-0" />
                  <span>{errorNotice}</span>
                </div>
                <button
                  onClick={() => setErrorNotice(null)}
                  className="text-indigo-400 hover:text-white ml-2 text-xs font-semibold cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}

          {/* Progress Metrics & Career Overview */}
          <ProgressHeader
            roadmap={roadmap}
            progress={progress}
            onResetProgress={handleResetProgress}
            totalMilestones={totalMilestones}
            completedMilestonesCount={completedMilestonesCount}
            totalSkills={totalSkills}
            completedSkillsCount={completedSkillsCount}
            totalHours={totalHours}
            completedHours={completedHours}
            progressPercentage={progressPercentage}
          />

          {/* View Navigation Tabs */}
          <div className="w-full px-4 sm:px-8 mt-2">
            <div className="flex border-b border-slate-800 space-x-4 sm:space-x-8">
              <button
                onClick={() => setActiveTab('all')}
                className={`pb-3 text-xs sm:text-sm font-semibold border-b-2 transition-colors cursor-pointer flex items-center space-x-2 ${
                  activeTab === 'all'
                    ? 'border-indigo-500 text-white'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Compass className="h-4 w-4" />
                <span>Full Pathway & Hub</span>
              </button>
              <button
                onClick={() => setActiveTab('roadmap')}
                className={`pb-3 text-xs sm:text-sm font-semibold border-b-2 transition-colors cursor-pointer flex items-center space-x-2 ${
                  activeTab === 'roadmap'
                    ? 'border-indigo-500 text-white'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Layers className="h-4 w-4" />
                <span>4-Phase Timeline ({roadmap.phases.length})</span>
              </button>
              <button
                onClick={() => setActiveTab('certifications')}
                className={`pb-3 text-xs sm:text-sm font-semibold border-b-2 transition-colors cursor-pointer flex items-center space-x-2 ${
                  activeTab === 'certifications'
                    ? 'border-indigo-500 text-white'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Award className="h-4 w-4" />
                <span>Live Certifications ({roadmap.certifications.length})</span>
              </button>
            </div>
          </div>

          {/* Content Views */}
          {(activeTab === 'all' || activeTab === 'roadmap') && (
            <RoadmapTimeline
              roadmap={roadmap}
              progress={progress}
              onToggleMilestone={handleToggleMilestone}
              onToggleSkill={handleToggleSkill}
            />
          )}

          {(activeTab === 'all' || activeTab === 'certifications') && (
            <CertificationHub
              certifications={roadmap.certifications}
              career={roadmap.career}
            />
          )}
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-800/80 bg-[#050505] py-6 text-center text-xs text-slate-500">
          <div className="w-full px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span>
              SkillPath AI • Grounded Career Engineering with Google Search & Gemini 3.8 Flash
            </span>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsCodeModalOpen(true)}
                className="text-slate-400 hover:text-indigo-400 transition-colors cursor-pointer"
              >
                View Grounding Architecture
              </button>
              <button
                onClick={() => setIsExportModalOpen(true)}
                className="text-slate-400 hover:text-indigo-400 transition-colors cursor-pointer"
              >
                Export Summary
              </button>
            </div>
          </div>
        </footer>
      </div>

      {/* Grounding & Code Inspection Modal */}
      <GroundingSourcesModal
        isOpen={isCodeModalOpen}
        onClose={() => setIsCodeModalOpen(false)}
        groundingMetadata={roadmap.groundingMetadata}
        career={roadmap.career}
      />

      {/* Export Summary Modal */}
      <ExportSummaryModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        roadmap={roadmap}
        progress={progress}
        progressPercentage={progressPercentage}
      />
    </div>
  );
}
