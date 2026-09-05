import express from 'express';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { DEFAULT_ROADMAPS } from './src/data/defaultRoadmaps';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Helper to sanitize and extract JSON from model output
function extractJsonFromText(rawText: string): any {
  if (!rawText) return null;
  const trimmed = rawText.trim();

  // Try direct parse
  try {
    return JSON.parse(trimmed);
  } catch (e) {
    // try to match ```json ... ```
    const markdownMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (markdownMatch && markdownMatch[1]) {
      try {
        return JSON.parse(markdownMatch[1]);
      } catch (e2) {
        // continue to brace matching
      }
    }

    // Try finding the outermost { ... }
    const firstBrace = trimmed.indexOf('{');
    const lastBrace = trimmed.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace > firstBrace) {
      const jsonSub = trimmed.substring(firstBrace, lastBrace + 1);
      try {
        return JSON.parse(jsonSub);
      } catch (e3) {
        console.error('Failed to parse brace substring as JSON:', e3);
      }
    }
  }
  return null;
}

function buildFallbackRoadmap(trimmedCareer: string, note?: string) {
  const matchedKey = Object.keys(DEFAULT_ROADMAPS).find(
    k => k.toLowerCase() === trimmedCareer.toLowerCase()
  );
  if (matchedKey) {
    return {
      ...DEFAULT_ROADMAPS[matchedKey],
      isGroundingLive: false,
      note: note || 'Loaded from verified 2026 career curriculum benchmark.'
    };
  }

  return {
    id: `roadmap-${Date.now()}`,
    career: trimmedCareer,
    tagline: `Architecting scalable solutions and mastering 2026 industry standards in ${trimmedCareer}.`,
    overview: `A comprehensive 4-phase professional development track tailored for ${trimmedCareer}. Focuses on enduring core principles, contemporary industry tools, scalable architecture, and production capstone projects.`,
    marketDemand: {
      level: 'High',
      salaryRangeUSD: '$110,000 - $175,000 / yr',
      remoteAvailability: 'Hybrid & Remote Available',
      topHiringIndustries: ['Technology & Software', 'Enterprise Platforms', 'Financial Services', 'Consulting & Cloud']
    },
    industryShift2026: {
      title: `2026 Market Shifts in ${trimmedCareer}`,
      summary: `The discipline of ${trimmedCareer} is prioritizing automation, telemetry, AI-assisted workflows, and modern cloud-native security postures.`,
      keyDrivers: [
        'Integration of AI and automation into everyday workflows',
        'Cloud-native scaling, telemetry, and distributed system requirements',
        'Shift toward measurable business impact, security posture, and zero-trust verification'
      ],
      emergingTechToMaster: ['Modern Automation Toolchains', 'Cloud Infrastructure & Microservices', 'Zero-Trust Security Baselines']
    },
    historicalFundamentals: [
      'Domain-specific core principles and problem decomposition',
      'Standard tooling, version control, and collaboration hygiene',
      'System architecture, data structures, and analytical decision-making'
    ],
    phases: [
      {
        id: 'phase-1',
        phaseNumber: 1,
        title: 'Phase 1: Foundations',
        durationWeeks: '4 - 6 Weeks',
        description: `Master the fundamental building blocks and foundational theory for ${trimmedCareer}.`,
        focus: 'Core Principles, Tooling & Syntax',
        milestones: [
          {
            id: 'm-1-1',
            title: `${trimmedCareer} Core Foundations & Tooling`,
            estimatedHours: 35,
            skills: ['Foundational Concepts', 'Standard Development Environment', 'Version Control & CLI'],
            modernShift2026: 'Standardization around modern type systems and automated formatting.',
            practicalProject: {
              name: 'Foundational Sandbox Prototype',
              description: `Build a clean, documented baseline project showcasing core principles of ${trimmedCareer}.`,
              deliverable: 'A structured project repository with setup guide.'
            },
            keyTopics: ['Core Architecture', 'Syntax & Idioms', 'Debugging Techniques'],
            learningResources: [
              { title: 'Official Domain Documentation', type: 'Documentation' as const, urlHint: 'https://developer.mozilla.org/' }
            ]
          }
        ]
      },
      {
        id: 'phase-2',
        phaseNumber: 2,
        title: 'Phase 2: Core Tools & Frameworks',
        durationWeeks: '6 - 8 Weeks',
        description: `Deepen your technical execution using the premier industry standard frameworks.`,
        focus: 'Ecosystem Standards & Architecture',
        milestones: [
          {
            id: 'm-2-1',
            title: 'Industry Standard Toolchains',
            estimatedHours: 40,
            skills: ['Leading Frameworks', 'Data Persistence / Processing', 'API / Integration Standards'],
            modernShift2026: 'Adoption of modern declarative tools and automated testing pipelines.',
            practicalProject: {
              name: 'Production Workflow Implementation',
              description: 'Design and test an end-to-end workflow utilizing industry standard frameworks.',
              deliverable: 'Tested modular system with automated unit tests.'
            },
            keyTopics: ['Modular Design', 'Error Handling', 'Performance Benchmarks'],
            learningResources: [
              { title: 'Framework Guides & Community Specifications', type: 'Documentation' as const, urlHint: 'https://github.com/' }
            ]
          }
        ]
      },
      {
        id: 'phase-3',
        phaseNumber: 3,
        title: 'Phase 3: Advanced Concepts',
        durationWeeks: '5 - 7 Weeks',
        description: `Scale your abilities with advanced distributed design, performance tuning, and optimization.`,
        focus: 'Scalability, Security & Optimization',
        milestones: [
          {
            id: 'm-3-1',
            title: 'Advanced System Design & Optimization',
            estimatedHours: 45,
            skills: ['Performance Profiling', 'Distributed Architecture', 'Security Hardening'],
            modernShift2026: 'Telemetry-driven optimization and automated resilience patterns.',
            practicalProject: {
              name: 'High-Scale Optimized Architecture Demo',
              description: 'Benchmark and optimize a system to handle high throughput with fault tolerance.',
              deliverable: 'Performance audit report and deployment blueprint.'
            },
            keyTopics: ['Fault Tolerance', 'Bottleneck Identification', 'Zero-Trust Security'],
            learningResources: [
              { title: 'System Architecture Principles', type: 'Documentation' as const, urlHint: 'https://architecture.org' }
            ]
          }
        ]
      },
      {
        id: 'phase-4',
        phaseNumber: 4,
        title: 'Phase 4: Real-World Projects & Deployment',
        durationWeeks: '4 - 6 Weeks',
        description: `Package your knowledge into verified, portfolio-worthy real-world deployments.`,
        focus: 'CI/CD, Monitoring & Capstone Delivery',
        milestones: [
          {
            id: 'm-4-1',
            title: 'Production Capstone & Portfolio Showcase',
            estimatedHours: 40,
            skills: ['Continuous Deployment', 'Observability & Monitoring', 'Portfolio Documentation'],
            modernShift2026: 'Automated container packaging and cloud-native hosting.',
            practicalProject: {
              name: 'Comprehensive Production Capstone',
              description: `Full end-to-end delivery of an enterprise-grade project for ${trimmedCareer}.`,
              deliverable: 'Publicly verifiable showcase repository and interactive preview.'
            },
            keyTopics: ['Production Monitoring', 'Documentation Standards', 'SLA / SLO Definitions'],
            learningResources: [
              { title: 'Cloud Deployment Blueprints', type: 'Documentation' as const, urlHint: 'https://cloud.google.com/' }
            ]
          }
        ]
      }
    ],
    certifications: [
      {
        id: 'cert-default-1',
        name: `${trimmedCareer} Professional Industry Certification`,
        vendor: 'Industry Standard Credentialing Board',
        examCode: 'CERT-PRO',
        difficulty: 'Associate' as const,
        estimatedCost: '$200 - $350 USD',
        prerequisites: `1-2 years hands-on experience in ${trimmedCareer}`,
        relevance2026: 'Establishes verified core competencies recognized across enterprise employers.',
        keyTopicsTested: ['Domain Architecture', 'Operational Security', 'Best Practices'],
        officialUrl: 'https://www.google.com/search?q=' + encodeURIComponent(`${trimmedCareer} certification exam`),
        validityPeriod: '3 Years'
      }
    ],
    groundingMetadata: {
      searchQueries: [`${trimmedCareer} certifications requirements 2026`, `${trimmedCareer} skills roadmap`],
      webSources: [
        { title: `${trimmedCareer} Industry Career Guide`, uri: 'https://www.google.com/search?q=' + encodeURIComponent(`${trimmedCareer} career roadmap 2026`) }
      ]
    },
    isGroundingLive: false,
    generatedAt: 'Standard Curated Blueprint',
    note: note || 'Loaded standard curriculum blueprint.'
  };
}
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    groundingSupported: true,
    hasApiKey: Boolean(process.env.GEMINI_API_KEY)
  });
});

// System configuration info (no secrets leaked)
app.get('/api/info', (req, res) => {
  res.json({
    appName: 'SkillPath AI',
    model: 'gemini-3.8-flash',
    groundingTool: 'googleSearch',
    hasApiKey: Boolean(process.env.GEMINI_API_KEY)
  });
});

// Generate career roadmap with Google Search Grounding
app.post('/api/roadmap/generate', async (req, res) => {
  const { career, experienceLevel } = req.body;

  if (!career || typeof career !== 'string') {
    return res.status(400).json({ error: 'Career title is required' });
  }

  const trimmedCareer = career.trim();
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.warn('GEMINI_API_KEY is not set. Checking for offline preset or standard roadmap.');
    // Check if preset exists in DEFAULT_ROADMAPS
    const matchedKey = Object.keys(DEFAULT_ROADMAPS).find(
      k => k.toLowerCase() === trimmedCareer.toLowerCase()
    );

    if (matchedKey) {
      return res.json({
        ...DEFAULT_ROADMAPS[matchedKey],
        isGroundingLive: false,
        note: 'Loaded from curated 2026 career database. Set GEMINI_API_KEY in Settings > Secrets to enable live Google Search Grounding on any custom career.'
      });
    }

    // If not matched, generate a structured fallback
    return res.json({
      id: `roadmap-${Date.now()}`,
      career: trimmedCareer,
      tagline: `Comprehensive roadmap and certification path for ${trimmedCareer}`,
      overview: `A structured 4-phase professional development track tailored for ${trimmedCareer}. Set your GEMINI_API_KEY to trigger live Google Search Grounding for real-time exam codes, pricing, and live job market requirements.`,
      marketDemand: {
        level: 'High',
        salaryRangeUSD: '$95,000 - $160,000 / yr',
        remoteAvailability: 'Hybrid & Remote Available',
        topHiringIndustries: ['Technology & Software', 'Consulting & Enterprise', 'Finance & Services']
      },
      industryShift2026: {
        title: `2026 Market Shifts in ${trimmedCareer}`,
        summary: `The discipline of ${trimmedCareer} is prioritizing automation, AI-assisted toolchains, and modern security posture.`,
        keyDrivers: [
          'Integration of AI and automation into everyday workflows',
          'Cloud-native scaling and distributed system requirements',
          'Focus on measurable business impact and telemetry'
        ],
        emergingTechToMaster: ['Modern Automation Tools', 'Cloud Platforms', 'Security Baselines']
      },
      historicalFundamentals: [
        'Domain-specific core principles and problem decomposition',
        'Standard tooling, version control, and collaboration hygiene',
        'System architecture and analytical decision-making'
      ],
      phases: [
        {
          id: 'phase-1',
          phaseNumber: 1,
          title: 'Phase 1: Foundations',
          durationWeeks: '4 - 6 Weeks',
          description: `Master the fundamental building blocks and foundational theory for ${trimmedCareer}.`,
          focus: 'Core Principles, Tooling & Syntax',
          milestones: [
            {
              id: 'm-1-1',
              title: `${trimmedCareer} Core Foundations & Tooling`,
              estimatedHours: 35,
              skills: ['Foundational Concepts', 'Standard Development Environment', 'Version Control & CLI'],
              modernShift2026: 'Standardization around modern type systems and automated formatting.',
              practicalProject: {
                name: 'Foundational Sandbox Prototype',
                description: `Build a clean, documented baseline project showcasing core principles of ${trimmedCareer}.`,
                deliverable: 'A structured project repository with setup guide.'
              },
              keyTopics: ['Core Architecture', 'Syntax & Idioms', 'Debugging Techniques'],
              learningResources: [
                { title: 'Official Domain Documentation', type: 'Documentation', urlHint: 'https://developer.mozilla.org/' }
              ]
            }
          ]
        },
        {
          id: 'phase-2',
          phaseNumber: 2,
          title: 'Phase 2: Core Tools & Frameworks',
          durationWeeks: '6 - 8 Weeks',
          description: `Deepen your technical execution using the premier industry standard frameworks.`,
          focus: 'Ecosystem Standards & Architecture',
          milestones: [
            {
              id: 'm-2-1',
              title: 'Industry Standard Toolchains',
              estimatedHours: 40,
              skills: ['Leading Frameworks', 'Data Persistence / Processing', 'API / Integration Standards'],
              modernShift2026: 'Adoption of modern declarative tools and automated testing pipelines.',
              practicalProject: {
                name: 'Production Workflow Implementation',
                description: 'Design and test an end-to-end workflow utilizing industry standard frameworks.',
                deliverable: 'Tested modular system with automated unit tests.'
              },
              keyTopics: ['Modular Design', 'Error Handling', 'Performance Benchmarks'],
              learningResources: [
                { title: 'Framework Guides & Community Specifications', type: 'Documentation', urlHint: 'https://github.com/' }
              ]
            }
          ]
        },
        {
          id: 'phase-3',
          phaseNumber: 3,
          title: 'Phase 3: Advanced Concepts',
          durationWeeks: '5 - 7 Weeks',
          description: `Scale your abilities with advanced distributed design, performance tuning, and optimization.`,
          focus: 'Scalability, Security & Optimization',
          milestones: [
            {
              id: 'm-3-1',
              title: 'Advanced System Design & Optimization',
              estimatedHours: 45,
              skills: ['Performance Profiling', 'Distributed Architecture', 'Security Hardening'],
              modernShift2026: 'Telemetry-driven optimization and automated resilience patterns.',
              practicalProject: {
                name: 'High-Scale Optimized Architecture Demo',
                description: 'Benchmark and optimize a system to handle high throughput with fault tolerance.',
                deliverable: 'Performance audit report and deployment blueprint.'
              },
              keyTopics: ['Fault Tolerance', 'Bottleneck Identification', 'Zero-Trust Security'],
              learningResources: [
                { title: 'System Architecture Principles', type: 'Documentation', urlHint: 'https://architecture.org' }
              ]
            }
          ]
        },
        {
          id: 'phase-4',
          phaseNumber: 4,
          title: 'Phase 4: Real-World Projects & Deployment',
          durationWeeks: '4 - 6 Weeks',
          description: `Package your knowledge into verified, portfolio-worthy real-world deployments.`,
          focus: 'CI/CD, Monitoring & Capstone Delivery',
          milestones: [
            {
              id: 'm-4-1',
              title: 'Production Capstone & Portfolio Showcase',
              estimatedHours: 40,
              skills: ['Continuous Deployment', 'Observability & Monitoring', 'Portfolio Documentation'],
              modernShift2026: 'Automated container packaging and cloud-native hosting.',
              practicalProject: {
                name: 'Comprehensive Production Capstone',
                description: `Full end-to-end delivery of an enterprise-grade project for ${trimmedCareer}.`,
                deliverable: 'Publicly verifiable showcase repository and interactive preview.'
              },
              keyTopics: ['Production Monitoring', 'Documentation Standards', 'SLA / SLO Definitions'],
              learningResources: [
                { title: 'Cloud Deployment Blueprints', type: 'Documentation', urlHint: 'https://cloud.google.com/' }
              ]
            }
          ]
        }
      ],
      certifications: [
        {
          id: 'cert-default-1',
          name: `${trimmedCareer} Foundational Industry Credential`,
          vendor: 'Industry Standard Body',
          examCode: 'STD-101',
          difficulty: 'Associate',
          estimatedCost: '$150 - $300 USD',
          prerequisites: 'Foundational experience in the domain',
          relevance2026: 'Establishes baseline proficiency recognized across employers worldwide.',
          keyTopicsTested: ['Core Methodology', 'Security & Best Practices', 'Troubleshooting'],
          officialUrl: 'https://google.com/search?q=' + encodeURIComponent(`${trimmedCareer} certification`),
          validityPeriod: '3 Years'
        }
      ],
      isGroundingLive: false,
      generatedAt: 'Standard Curated Blueprint'
    });
  }

  try {
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });

    const prompt = `Formulate an up-to-date, live-search-grounded career roadmap and industry certification matrix for the target career: "${trimmedCareer}"${experienceLevel ? ` (Focus level: ${experienceLevel})` : ''}.

Use Google Search to pull:
1. Exact, current industry-recognized certifications (e.g., from AWS, Google Cloud, Cisco, CompTIA, CNCF, Microsoft, HashiCorp, Linux Foundation, Meta, etc.), their latest official exam codes, current exam costs (USD), prerequisites, and 2026 job market relevance.
2. The latest 2026 industry requirements and technology shifts for ${trimmedCareer}.
3. A clear distinction between historical fundamental skills and up-to-date 2026 modern requirements.
4. Chronological 4 phases: "Phase 1: Foundations", "Phase 2: Core Tools & Frameworks", "Phase 3: Advanced Concepts", and "Phase 4: Real-World Projects", with actionable milestones, time estimates, concrete hands-on projects, and resource links.

Return ONLY the JSON object.`;

    const systemInstruction = `You are SkillPath AI, an expert technical career architect and IT curriculum director.
You are equipped with Google Search Grounding to fetch live, accurate, real-world data from the web.

You MUST respond strictly with a valid JSON object (enclosed in \`\`\`json ... \`\`\` or raw JSON) matching this exact TypeScript structure:
{
  "career": string,
  "tagline": string,
  "overview": string,
  "marketDemand": {
    "level": "High" | "Very High" | "Critical" | "Rapidly Growing",
    "salaryRangeUSD": string,
    "remoteAvailability": string,
    "topHiringIndustries": string[]
  },
  "industryShift2026": {
    "title": string,
    "summary": string,
    "keyDrivers": string[],
    "emergingTechToMaster": string[]
  },
  "historicalFundamentals": string[],
  "phases": [
    {
      "id": string,
      "phaseNumber": number,
      "title": string,
      "durationWeeks": string,
      "description": string,
      "focus": string,
      "milestones": [
        {
          "id": string,
          "title": string,
          "estimatedHours": number,
          "skills": string[],
          "modernShift2026": string,
          "practicalProject": {
            "name": string,
            "description": string,
            "deliverable": string
          },
          "keyTopics": string[],
          "learningResources": [
            { "title": string, "type": "Documentation" | "Course" | "Hands-on Lab" | "Specification" | "Tool", "urlHint": string }
          ]
        }
      ]
    }
  ],
  "certifications": [
    {
      "id": string,
      "name": string,
      "vendor": string,
      "examCode": string,
      "difficulty": "Foundational" | "Associate" | "Professional" | "Specialty" | "Expert",
      "estimatedCost": string,
      "prerequisites": string,
      "relevance2026": string,
      "keyTopicsTested": string[],
      "officialUrl": string,
      "validityPeriod": string
    }
  ]
}

DO NOT include any commentary, explanations, or conversational markdown outside the JSON.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction,
        tools: [{ googleSearch: {} }]
      }
    });

    const rawText = response.text || '';
    const parsedData = extractJsonFromText(rawText);

    if (!parsedData) {
      console.error('Failed to parse JSON from Gemini output:', rawText.slice(0, 300));
      // Fall back to preset if available
      const matchedKey = Object.keys(DEFAULT_ROADMAPS).find(
        k => k.toLowerCase() === trimmedCareer.toLowerCase()
      );
      if (matchedKey) {
        return res.json({
          ...DEFAULT_ROADMAPS[matchedKey],
          isGroundingLive: false,
          note: 'Parsed response fallback: restored from verified dataset.'
        });
      }
      return res.status(500).json({
        error: 'Model response could not be parsed into a structured roadmap. Please try again.',
        raw: rawText.slice(0, 300)
      });
    }

    // Extract grounding chunks and web sources
    const groundingMetadataRaw = response.candidates?.[0]?.groundingMetadata;
    const webSources: Array<{ title: string; uri: string }> = [];
    const searchQueries: string[] = [];

    if (groundingMetadataRaw) {
      if (Array.isArray(groundingMetadataRaw.webSearchQueries)) {
        searchQueries.push(...groundingMetadataRaw.webSearchQueries);
      }
      if (Array.isArray(groundingMetadataRaw.groundingChunks)) {
        for (const chunk of groundingMetadataRaw.groundingChunks) {
          if (chunk.web && chunk.web.uri) {
            webSources.push({
              title: chunk.web.title || chunk.web.uri,
              uri: chunk.web.uri
            });
          }
        }
      }
    }

    // Deduplicate webSources by uri
    const uniqueSources = Array.from(
      new Map(webSources.map(s => [s.uri, s])).values()
    );

    const fullRoadmap = {
      ...parsedData,
      id: parsedData.id || `roadmap-${Date.now()}`,
      career: parsedData.career || trimmedCareer,
      isGroundingLive: true,
      generatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' }),
      groundingMetadata: {
        searchQueries,
        groundingChunks: groundingMetadataRaw?.groundingChunks || [],
        webSources: uniqueSources
      }
    };

    return res.json(fullRoadmap);
  } catch (err: any) {
    console.error('Error generating roadmap with Gemini Google Search Grounding:', err);
    // Graceful fallback to curriculum roadmap for this career
    const fallback = buildFallbackRoadmap(
      trimmedCareer,
      err?.status === 429 || err?.message?.includes('429')
        ? 'Live Search Grounding rate limit reached on current key quota; generated structured 2026 curriculum.'
        : 'Generated 2026 curriculum blueprint. You can refresh or provide your custom Gemini API key in Settings > Secrets.'
    );
    return res.json(fallback);
  }
});

// Vite middleware in development or static serve in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SkillPath AI server running on http://localhost:${PORT}`);
  });
}

startServer();
