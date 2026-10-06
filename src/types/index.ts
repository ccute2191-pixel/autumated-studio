export interface WordTiming {
  word: string;
  highlight: boolean;
}

export interface VideoScene {
  sceneId: string;
  durationSec: number;
  narration: string;
  visualPrompt: string;
  badge: string;
  themeStyle: 'neon_cyber' | 'dark_lux' | 'cinematic_gold' | 'hyper_matrix' | 'vibrant_synth' | string;
  visualKeywords: string[];
  words: WordTiming[];
}

export interface VideoPackage {
  title: string;
  hook: string;
  estimatedViralPotential: number;
  youtubeDescription: string;
  tiktokCaption: string;
  backgroundMusicMood: string;
  seoKeywords: string[];
  trendingHashtags: string[];
  scenes: VideoScene[];
}

export interface ViralIdea {
  id: string;
  title: string;
  hook: string;
  predictedViralScore: number;
  targetAngle: string;
  estimatedReach: string;
  topKeywords: string[];
  topHashtags: string[];
}

export interface ConnectedChannel {
  id: string;
  platform: 'youtube' | 'tiktok' | 'instagram' | 'x';
  name: string;
  handle: string;
  avatar: string;
  subscribers: string;
  status: 'connected' | 'disconnected';
  autoPublish: boolean;
  niche: string;
  bestTime: string;
  privacyDefault?: 'public' | 'unlisted' | 'private';
  tokenStatus?: 'active' | 'expiring' | 'verified';
  tokenExpiry?: string;
  category?: string;
  channelUrl?: string;
  apiLatency?: string;
}

export interface ScheduledPost {
  id: string;
  title: string;
  niche: string;
  scheduledTime: string;
  status: 'scheduled' | 'publishing' | 'published' | 'draft';
  platforms: string[];
  hook: string;
  keywords: string[];
  hashtags: string[];
  scenesCount: number;
  estimatedViews: number;
  publishedUrl?: string;
  publishedAt?: string;
}

export interface AutopilotConfig {
  enabled: boolean;
  postsPerDay: number;
  primaryNiche: string;
  voicePersona: string;
  autoHashtagMaxSEO: boolean;
  preferredTimes: string[];
  platforms: string[];
  lastRun: string;
  nextRun: string;
}
