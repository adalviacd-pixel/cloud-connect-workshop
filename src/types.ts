export interface LearningResource {
  title: string;
  type: 'Documentation' | 'Hands-on Lab' | 'Course' | 'Specification' | 'Tool';
  urlHint?: string;
}

export interface PracticalProject {
  name: string;
  description: string;
  deliverable: string;
}

export interface MilestoneItem {
  id: string;
  title: string;
  estimatedHours: number;
  skills: string[];
  modernShift2026: string;
  practicalProject: PracticalProject;
  keyTopics: string[];
  learningResources: LearningResource[];
}

export interface RoadmapPhase {
  id: string;
  phaseNumber: number;
  title: string;
  durationWeeks: string;
  description: string;
  focus: string;
  milestones: MilestoneItem[];
}

export interface CertificationItem {
  id: string;
  name: string;
  vendor: string;
  examCode: string;
  difficulty: 'Foundational' | 'Associate' | 'Professional' | 'Specialty' | 'Expert';
  estimatedCost: string;
  prerequisites: string;
  relevance2026: string;
  keyTopicsTested: string[];
  officialUrl?: string;
  validityPeriod?: string;
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface GroundingMetadata {
  searchQueries?: string[];
  groundingChunks?: Array<{
    web?: {
      uri: string;
      title: string;
    };
  }>;
  webSources?: GroundingSource[];
}

export interface MarketDemand {
  level: 'High' | 'Very High' | 'Critical' | 'Rapidly Growing' | string;
  salaryRangeUSD: string;
  remoteAvailability: string;
  topHiringIndustries: string[];
}

export interface IndustryShift2026 {
  title: string;
  summary: string;
  keyDrivers: string[];
  emergingTechToMaster: string[];
}

export interface CareerRoadmap {
  id: string;
  career: string;
  tagline: string;
  overview: string;
  marketDemand: MarketDemand;
  industryShift2026: IndustryShift2026;
  historicalFundamentals: string[];
  phases: RoadmapPhase[];
  certifications: CertificationItem[];
  groundingMetadata?: GroundingMetadata;
  generatedAt: string;
  isGroundingLive: boolean;
}

export interface ProgressState {
  completedMilestones: Record<string, boolean>;
  completedSkills: Record<string, boolean>;
  targetCareer: string;
  lastUpdated: string;
}
