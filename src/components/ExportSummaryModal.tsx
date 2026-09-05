import React, { useState } from 'react';
import { X, Copy, Check, Printer, FileDown, CheckCircle2 } from 'lucide-react';
import { CareerRoadmap, ProgressState } from '../types';

interface ExportSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  roadmap: CareerRoadmap;
  progress: ProgressState;
  progressPercentage: number;
}

export const ExportSummaryModal: React.FC<ExportSummaryModalProps> = ({
  isOpen,
  onClose,
  roadmap,
  progress,
  progressPercentage,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const generateMarkdown = () => {
    let md = `# SkillPath AI Career Roadmap: ${roadmap.career}\n`;
    md += `**Tagline:** ${roadmap.tagline}\n`;
    md += `**Overall Progress:** ${progressPercentage}%\n`;
    md += `**Market Demand:** ${roadmap.marketDemand?.level} (${roadmap.marketDemand?.salaryRangeUSD})\n\n`;

    md += `## 2026 Industry Paradigm\n`;
    md += `${roadmap.industryShift2026?.summary || ''}\n\n`;

    md += `## Roadmap Phases & Progress\n\n`;
    roadmap.phases.forEach((phase) => {
      md += `### ${phase.title} (${phase.durationWeeks})\n`;
      md += `*Focus: ${phase.focus}*\n\n`;

      phase.milestones.forEach((m) => {
        const isDone = Boolean(progress.completedMilestones[m.id]);
        md += `- [${isDone ? 'x' : ' '}] **${m.title}** (~${m.estimatedHours} hrs)\n`;
        md += `  - 2026 Shift: ${m.modernShift2026}\n`;
        if (m.practicalProject) {
          md += `  - Project: ${m.practicalProject.name} -> Deliverable: ${m.practicalProject.deliverable}\n`;
        }
      });
      md += `\n`;
    });

    md += `## Top Industry Certifications\n`;
    roadmap.certifications.forEach((c) => {
      md += `- **${c.name}** (${c.vendor}) | Code: ${c.examCode} | Cost: ${c.estimatedCost} | Level: ${c.difficulty}\n`;
      md += `  - 2026 Value: ${c.relevance2026}\n`;
    });

    return md;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateMarkdown());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-[#0a0a0a] border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="h-5 w-5 text-indigo-400" />
            <h3 className="text-base font-bold text-white">
              Export Career Roadmap & Progress
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body Preview */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-mono">
              Formatted Markdown Export ({progressPercentage}% Complete)
            </span>
            <div className="flex items-center space-x-2">
              <button
                onClick={handlePrint}
                className="flex items-center space-x-1 px-3 py-1 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer"
              >
                <Printer className="h-3.5 w-3.5 text-slate-400" />
                <span>Print</span>
              </button>
              <button
                onClick={handleCopy}
                className="flex items-center space-x-1 px-3 py-1 text-xs rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_10px_rgba(99,102,241,0.3)] transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-300" />
                    <span className="text-emerald-300 font-medium">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy Markdown</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <pre className="p-4 bg-[#050505] border border-slate-800 rounded-xl text-xs font-mono text-slate-300 overflow-x-auto max-h-96 whitespace-pre-wrap">
            {generateMarkdown()}
          </pre>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-[#050505] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors border border-slate-700 cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
