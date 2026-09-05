import React, { useState } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  Globe, 
  Code2, 
  ExternalLink, 
  Terminal, 
  Sparkles, 
  Search,
  BookOpen
} from 'lucide-react';
import { GroundingMetadata } from '../types';

interface GroundingSourcesModalProps {
  isOpen: boolean;
  onClose: () => void;
  groundingMetadata?: GroundingMetadata;
  career: string;
}

export const GroundingSourcesModal: React.FC<GroundingSourcesModalProps> = ({
  isOpen,
  onClose,
  groundingMetadata,
  career,
}) => {
  const [activeTab, setActiveTab] = useState<'sources' | 'code' | 'instructions'>('sources');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const codeSnippet = `import { GoogleGenAI } from "@google/genai";

// Initialize Gemini client on the server
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build'
    }
  }
});

// Configure Google Search Grounding with tools: [{ googleSearch: {} }]
async function generateGroundedCareerRoadmap(targetCareer: string) {
  const response = await ai.models.generateContent({
    model: "gemini-3.8-flash", // or gemini-3.1-pro-preview
    contents: \`Formulate an up-to-date, live-search-grounded career roadmap and industry certification matrix for: "\${targetCareer}".
Pull active 2026 certifications, exact exam codes, fees (USD), and live industry shifts.\`,
    config: {
      systemInstruction: "You are SkillPath AI. Use Google Search Grounding to extract active certification codes, real exam costs, and 2026 hiring demands.",
      // Crucial: Pass the googleSearch tool to trigger live web retrieval
      tools: [{ googleSearch: {} }]
    }
  });

  console.log("Structured Output:", response.text);

  // Extract live Grounding Chunks and Web Citation URLs
  const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
  if (chunks) {
    const liveWebSources = chunks
      .filter((chunk: any) => chunk.web && chunk.web.uri)
      .map((chunk: any) => ({
        title: chunk.web.title,
        uri: chunk.web.uri
      }));
    console.log("Verified Live Web Sources:", liveWebSources);
  }

  return response;
}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(codeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const webSources = groundingMetadata?.webSources || [];
  const searchQueries = groundingMetadata?.searchQueries || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-[#0a0a0a] border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Globe className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                Google Search Grounding & Architecture Hub
              </h3>
              <p className="text-xs text-slate-400">
                Live web citations, search queries, and complete `@google/genai` implementation code
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 px-5 bg-[#050505]">
          <button
            onClick={() => setActiveTab('sources')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-colors cursor-pointer flex items-center space-x-2 ${
              activeTab === 'sources'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Globe className="h-3.5 w-3.5" />
            <span>Live Grounding Sources ({webSources.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-colors cursor-pointer flex items-center space-x-2 ${
              activeTab === 'code'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code2 className="h-3.5 w-3.5" />
            <span>Gemini API Grounding Code</span>
          </button>
          <button
            onClick={() => setActiveTab('instructions')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-colors cursor-pointer flex items-center space-x-2 ${
              activeTab === 'instructions'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>AI Studio Instructions Prompt</span>
          </button>
        </div>

        {/* Modal Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm text-slate-300">
          {activeTab === 'sources' && (
            <div className="space-y-5">
              {/* Search queries used */}
              {searchQueries.length > 0 && (
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 flex items-center">
                    <Search className="h-3.5 w-3.5 mr-1 text-indigo-400" />
                    Web Search Retrieval Queries Executed:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {searchQueries.map((query, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-full text-xs font-mono bg-slate-900 text-indigo-300 border border-slate-800 flex items-center"
                      >
                        <Search className="h-2.5 w-2.5 mr-1.5 opacity-60" />
                        "{query}"
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Citations list */}
              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3 flex items-center">
                  <Globe className="h-3.5 w-3.5 mr-1 text-emerald-400" />
                  Grounded Citation Sources for {career}:
                </h4>
                {webSources.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {webSources.map((source, idx) => (
                      <a
                        key={idx}
                        href={source.uri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl transition-all group flex items-start justify-between"
                      >
                        <div className="min-w-0 flex-1 pr-2">
                          <p className="text-xs font-semibold text-white group-hover:text-indigo-300 truncate">
                            {source.title}
                          </p>
                          <p className="text-[11px] text-slate-500 font-mono truncate mt-0.5">
                            {source.uri}
                          </p>
                        </div>
                        <ExternalLink className="h-3.5 w-3.5 text-slate-500 group-hover:text-indigo-400 shrink-0 mt-0.5" />
                      </a>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 text-xs text-slate-400">
                    Grounded sources are extracted live during search query synthesis. When generating custom careers with your API key, all groundingChunks are dynamically pinned here.
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'code' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-mono">
                  Exact Server-Side Implementation using `@google/genai`
                </span>
                <button
                  onClick={copyToClipboard}
                  className="flex items-center space-x-1.5 px-3 py-1 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                      <span className="text-emerald-400 font-semibold">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5 text-slate-400" />
                      <span>Copy Snippet</span>
                    </>
                  )}
                </button>
              </div>

              <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-[#050505]">
                <pre className="p-4 text-xs font-mono text-slate-300 overflow-x-auto leading-relaxed">
                  {codeSnippet}
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'instructions' && (
            <div className="space-y-4">
              <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 mb-2">
                  How to Enable Live Google Search Grounding in AI Studio:
                </h4>
                <ol className="list-decimal list-inside space-y-2 text-xs text-slate-300">
                  <li>
                    <strong className="text-white">Paste System Prompt:</strong> Insert your tailored instructions in the System Instructions panel on the left sidebar in Google AI Studio.
                  </li>
                  <li>
                    <strong className="text-white">Enable Grounding Tool:</strong> In the right-hand settings panel under <strong className="text-indigo-300">Tools</strong>, check the box for <strong className="text-indigo-300">Google Search</strong> (Grounding with Google Search).
                  </li>
                  <li>
                    <strong className="text-white">Model Selection:</strong> Select <strong className="text-emerald-400">Gemini 3.8 Flash</strong> for fast inference and live search integration.
                  </li>
                  <li>
                    <strong className="text-white">Run Generation:</strong> Send your prompt: <code className="bg-slate-800 px-1.5 py-0.5 rounded text-indigo-300">"Generate the complete career roadmap and active certifications for Full Stack Developer"</code>.
                  </li>
                </ol>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-[#050505] flex items-center justify-between text-xs text-slate-500 font-mono">
          <span>Powered by Gemini 3.8 Flash & Google Search Grounding</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-colors cursor-pointer border border-slate-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
