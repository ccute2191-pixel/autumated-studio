import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { VideoStudio } from './components/VideoStudio';
import { ViralIdeaHunter } from './components/ViralIdeaHunter';
import { AutopilotScheduler } from './components/AutopilotScheduler';
import { SocialConnectors } from './components/SocialConnectors';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { PublishModal } from './components/PublishModal';
import {
  VideoPackage,
  ViralIdea,
  ConnectedChannel,
  ScheduledPost,
  AutopilotConfig,
} from './types';
import { Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

const defaultVideoPackage: VideoPackage = {
  title: '3 Secret Websites That Feel Illegal To Know in 2026',
  hook: 'Stop scrolling! These 3 free websites are so powerful they feel completely illegal...',
  estimatedViralPotential: 97,
  youtubeDescription:
    'Discover the top 3 secret websites in 2026 that will 10x your productivity and automate boring tasks completely free! Subscribe for automated daily viral tech hacks.\n\n#Shorts #TechHacks #FreeAITools #Websites',
  tiktokCaption:
    'Stop scrolling! These 3 free websites feel illegal to know in 2026 🤯 #Shorts #TechHacks #FreeTools #Viral #fyp',
  backgroundMusicMood: 'Phonk Fast Drift',
  seoKeywords: [
    'secret websites 2026',
    'free ai tools',
    'feel illegal to know',
    'productivity hacks',
    'chatgpt alternatives',
    'work smarter',
    'best websites',
    'automation tools',
    'tech shorts',
    'viral hacks',
  ],
  trendingHashtags: [
    '#Shorts',
    '#viral',
    '#techhacks',
    '#freeaitools',
    '#tiktoktips',
    '#fyp',
    '#trending',
    '#mindblown',
  ],
  scenes: [
    {
      sceneId: 'scene_1',
      durationSec: 6,
      narration:
        'Stop scrolling! These three free websites feel completely illegal to know in 2026.',
      visualPrompt:
        'A futuristic cyber hacker room with holograms displaying glowing warning signs and encrypted code.',
      badge: 'STOP SCROLLING 🚨',
      themeStyle: 'neon_cyber',
      visualKeywords: ['cyber matrix', 'glowing holographic', 'high tech'],
      words: [
        { word: 'Stop', highlight: true },
        { word: 'scrolling!', highlight: true },
        { word: 'These', highlight: false },
        { word: 'three', highlight: true },
        { word: 'free', highlight: true },
        { word: 'websites', highlight: false },
        { word: 'feel', highlight: false },
        { word: 'completely', highlight: false },
        { word: 'illegal', highlight: true },
        { word: 'to', highlight: false },
        { word: 'know.', highlight: false },
      ],
    },
    {
      sceneId: 'scene_2',
      durationSec: 7,
      narration:
        'Number one is Gamma App. It builds entire presentations, web pages, and documents in thirty seconds using AI.',
      visualPrompt:
        'Futuristic 3D dashboard automatically generating sleek slides and interactive websites at lightspeed.',
      badge: 'TOOL #1 ⚡',
      themeStyle: 'hyper_matrix',
      visualKeywords: ['presentation generator', 'modern ui', 'lightspeed render'],
      words: [
        { word: 'Number', highlight: false },
        { word: 'one', highlight: true },
        { word: 'is', highlight: false },
        { word: 'Gamma', highlight: true },
        { word: 'App.', highlight: true },
        { word: 'It', highlight: false },
        { word: 'builds', highlight: false },
        { word: 'entire', highlight: false },
        { word: 'presentations', highlight: true },
        { word: 'in', highlight: false },
        { word: '30', highlight: true },
        { word: 'seconds!', highlight: true },
      ],
    },
    {
      sceneId: 'scene_3',
      durationSec: 7,
      narration:
        'Number two is TinyWow. Over two hundred free online tools to edit PDFs, remove backgrounds, and unlock files.',
      visualPrompt:
        'Swiss-army knife of cyber widgets glowing with digital tools transforming media files instantly.',
      badge: 'TOOL #2 🛠️',
      themeStyle: 'cinematic_gold',
      visualKeywords: ['toolbox', 'pdf editor', 'gold cyber glow'],
      words: [
        { word: 'Number', highlight: false },
        { word: 'two', highlight: true },
        { word: 'is', highlight: false },
        { word: 'TinyWow.', highlight: true },
        { word: 'Over', highlight: false },
        { word: '200', highlight: true },
        { word: 'free', highlight: true },
        { word: 'tools', highlight: false },
        { word: 'for', highlight: false },
        { word: 'everything!', highlight: true },
      ],
    },
    {
      sceneId: 'scene_4',
      durationSec: 7,
      narration:
        'Number three is Claude 3.5 Sonnet. It writes code, solves complex math, and analyzes entire books instantly.',
      visualPrompt:
        'Deep artificial intelligence neural brain pulsing with high-speed quantum energy pulses.',
      badge: 'TOOL #3 🧠',
      themeStyle: 'dark_lux',
      visualKeywords: ['quantum neural', 'super intelligence', 'energy pulse'],
      words: [
        { word: 'Number', highlight: false },
        { word: 'three', highlight: true },
        { word: 'is', highlight: false },
        { word: 'super', highlight: true },
        { word: 'intelligence.', highlight: true },
        { word: 'Solves', highlight: false },
        { word: 'anything', highlight: true },
        { word: 'instantly!', highlight: true },
      ],
    },
    {
      sceneId: 'scene_5',
      durationSec: 5,
      narration:
        'Save this video before it gets deleted and follow for daily secret AI hacks!',
      visualPrompt:
        'Dynamic follow and save icons with neon particles bursting in high definition 9:16 vertical view.',
      badge: 'SAVE THIS 💾',
      themeStyle: 'vibrant_synth',
      visualKeywords: ['particle explosion', 'follow button', 'viral neon'],
      words: [
        { word: 'Save', highlight: true },
        { word: 'this', highlight: true },
        { word: 'video', highlight: false },
        { word: 'now', highlight: true },
        { word: 'and', highlight: false },
        { word: 'follow', highlight: true },
        { word: 'for', highlight: false },
        { word: 'more!', highlight: true },
      ],
    },
  ],
};

export default function App() {
  const [activeTab, setActiveTab] = useState('studio');
  const [videoPackage, setVideoPackage] = useState<VideoPackage>(defaultVideoPackage);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Autopilot configuration
  const [autopilotConfig, setAutopilotConfig] = useState<AutopilotConfig>({
    enabled: true,
    postsPerDay: 2,
    primaryNiche: 'Tech & AI Hacks',
    voicePersona: 'Kore (Enthusiastic High-Energy)',
    autoHashtagMaxSEO: true,
    preferredTimes: ['12:30', '18:45'],
    platforms: ['youtube', 'tiktok', 'instagram'],
    lastRun: new Date().toISOString(),
    nextRun: new Date(Date.now() + 2 * 3600 * 1000).toISOString(),
  });

  // Scheduled Queue
  const [scheduledQueue, setScheduledQueue] = useState<ScheduledPost[]>([]);

  // Connected Channels
  const [connectedChannels, setConnectedChannels] = useState<ConnectedChannel[]>([
    {
      id: 'yt-1',
      platform: 'youtube',
      name: 'TechPulse Shorts',
      handle: '@TechPulseDaily',
      avatar:
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
      subscribers: '142.8K',
      status: 'connected',
      autoPublish: true,
      niche: 'Tech & AI Hacks',
      bestTime: '17:30 UTC',
    },
    {
      id: 'tt-1',
      platform: 'tiktok',
      name: 'MindBenders Daily',
      handle: '@mindbenders.ai',
      avatar:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      subscribers: '320.5K',
      status: 'connected',
      autoPublish: true,
      niche: 'Psychology & Facts',
      bestTime: '19:00 UTC',
    },
    {
      id: 'ig-1',
      platform: 'instagram',
      name: 'FutureCraft Reels',
      handle: '@futurecraft.shorts',
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      subscribers: '89.2K',
      status: 'connected',
      autoPublish: true,
      niche: 'Futuristic Tech',
      bestTime: '18:15 UTC',
    },
  ]);

  // Load initial backend state
  useEffect(() => {
    fetch('/api/autopilot/status')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          if (data.config) setAutopilotConfig(data.config);
          if (data.queue) setScheduledQueue(data.queue);
        }
      })
      .catch((err) => console.error('Load status error:', err));

    fetch('/api/social/channels')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.channels) {
          setConnectedChannels(data.channels);
        }
      })
      .catch((err) => console.error('Load channels error:', err));
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Generate full video package from topic or idea
  const handleGenerateVideo = async (topic: string, niche: string = 'Tech & AI Hacks') => {
    setIsGenerating(true);
    showToast('AI is crafting 9:16 script, kinetic subtitles & viral SEO tags...');
    try {
      const response = await fetch('/api/ai/generate-video-package', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          niche,
          tone: 'High-Energy Fast-Paced',
        }),
      });
      const data = await response.json();
      if (data.success && data.package) {
        setVideoPackage(data.package);
        setActiveTab('studio');
        showToast('🎉 Video created! Ready to preview & publish.');
      }
    } catch (err) {
      console.error('Generate video error:', err);
      showToast('Error generating video package. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Turn idea card from Viral Idea Hunter into ready video
  const handleSelectIdea = (idea: ViralIdea) => {
    handleGenerateVideo(idea.title);
  };

  // Run quick autopilot cycle
  const handleQuickRunAutopilot = async () => {
    setIsGenerating(true);
    showToast('⚡ Running Autopilot: Hunting viral trends & assembling video...');
    try {
      // 1. Discover trend
      const trendRes = await fetch('/api/ai/discover-trends', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ niche: autopilotConfig.primaryNiche }),
      });
      const trendData = await trendRes.json();
      const topIdea = trendData.ideas?.[0] || {
        title: '3 Secret Websites That Feel Illegal To Know in 2026',
      };

      // 2. Generate video package
      await handleGenerateVideo(topIdea.title, autopilotConfig.primaryNiche);
      setActiveTab('studio');
      showToast(`⚡ Autopilot created: "${topIdea.title}". Ready for 1-click publishing!`);
    } catch (err) {
      console.error('Autopilot cycle error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Autopilot config update
  const handleUpdateConfig = async (newCfg: Partial<AutopilotConfig>) => {
    const updated = { ...autopilotConfig, ...newCfg };
    setAutopilotConfig(updated);
    try {
      await fetch('/api/autopilot/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCfg),
      });
      showToast(
        updated.enabled
          ? 'Autopilot activated! Daily videos scheduled.'
          : 'Autopilot paused.'
      );
    } catch (err) {
      console.error('Update autopilot error:', err);
    }
  };

  // Trigger post now from schedule
  const handleTriggerPostNow = async (post: ScheduledPost) => {
    showToast(`Posting "${post.title}" to ${post.platforms.join(' & ')}...`);
    try {
      const response = await fetch('/api/social/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: post.title,
          platforms: post.platforms,
          hashtags: post.hashtags,
          seoKeywords: post.keywords,
        }),
      });
      const data = await response.json();
      if (data.success) {
        setScheduledQueue((prev) =>
          prev.map((p) => (p.id === post.id ? { ...p, status: 'published' } : p))
        );
        showToast('🚀 Video is now live across feeds!');
      }
    } catch (err) {
      console.error('Publish now error:', err);
    }
  };

  // Add new post to queue
  const handleAddNewScheduledPost = async (title: string, niche: string) => {
    try {
      const response = await fetch('/api/autopilot/schedule-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, niche }),
      });
      const data = await response.json();
      if (data.success && data.queue) {
        setScheduledQueue(data.queue);
        showToast('Video added to automated schedule!');
      }
    } catch (err) {
      console.error('Add scheduled post error:', err);
    }
  };

  // Toggle channel auto publish
  const handleToggleAutoPublish = async (channelId: string) => {
    setConnectedChannels((prev) =>
      prev.map((c) => (c.id === channelId ? { ...c, autoPublish: !c.autoPublish } : c))
    );
    try {
      await fetch('/api/social/channels/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ channelId }),
      });
    } catch (err) {
      console.error('Toggle channel error:', err);
    }
  };

  // Connect new channel
  const handleConnectChannel = async (
    platform: string,
    handle: string,
    name: string,
    details?: {
      niche?: string;
      bestTime?: string;
      category?: string;
      privacyDefault?: 'public' | 'unlisted' | 'private';
    }
  ) => {
    try {
      const response = await fetch('/api/social/channels/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform,
          handle,
          name,
          niche: details?.niche,
          bestTime: details?.bestTime,
          category: details?.category,
          privacyDefault: details?.privacyDefault,
        }),
      });
      const data = await response.json();
      if (data.success && data.channels) {
        setConnectedChannels(data.channels);
        showToast(`🎉 Connected & Verified ${name} (${handle})!`);
      }
    } catch (err) {
      console.error('Connect channel error:', err);
    }
  };

  // Disconnect channel
  const handleDisconnectChannel = async (channelId: string) => {
    try {
      const response = await fetch('/api/social/channels/disconnect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ channelId }),
      });
      const data = await response.json();
      if (data.success && data.channels) {
        setConnectedChannels(data.channels);
        showToast('Channel disconnected from automated posting.');
      }
    } catch (err) {
      console.error('Disconnect channel error:', err);
    }
  };

  // Update channel
  const handleUpdateChannel = async (channelId: string, updates: Partial<ConnectedChannel>) => {
    setConnectedChannels((prev) =>
      prev.map((c) => (c.id === channelId ? { ...c, ...updates } : c))
    );
    try {
      await fetch('/api/social/channels/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ channelId, ...updates }),
      });
    } catch (err) {
      console.error('Update channel error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-purple-600 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-14 right-6 z-50 bg-purple-950/90 border border-purple-500/50 text-white px-4 py-2.5 rounded-xl shadow-2xl backdrop-blur-md flex items-center gap-2 text-xs font-semibold animate-fadeIn">
          <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        autopilotEnabled={autopilotConfig.enabled}
        setAutopilotEnabled={(val) => handleUpdateConfig({ enabled: val })}
        connectedChannels={connectedChannels}
        onQuickRunAutopilot={handleQuickRunAutopilot}
        isGenerating={isGenerating}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-24 md:pb-12">
        {activeTab === 'studio' && (
          <VideoStudio
            videoPackage={videoPackage}
            onUpdatePackage={setVideoPackage}
            onOpenPublishModal={() => setIsPublishModalOpen(true)}
            onGenerateNewTopic={(topic) => handleGenerateVideo(topic)}
            isGenerating={isGenerating}
          />
        )}

        {activeTab === 'trends' && (
          <ViralIdeaHunter
            onSelectIdea={handleSelectIdea}
            isGenerating={isGenerating}
          />
        )}

        {activeTab === 'autopilot' && (
          <AutopilotScheduler
            config={autopilotConfig}
            onUpdateConfig={handleUpdateConfig}
            queue={scheduledQueue}
            onTriggerPostNow={handleTriggerPostNow}
            onAddNewScheduledPost={handleAddNewScheduledPost}
          />
        )}

        {activeTab === 'channels' && (
          <SocialConnectors
            channels={connectedChannels}
            onToggleAutoPublish={handleToggleAutoPublish}
            onConnectChannel={handleConnectChannel}
            onDisconnectChannel={handleDisconnectChannel}
            onUpdateChannel={handleUpdateChannel}
          />
        )}

        {activeTab === 'analytics' && <AnalyticsDashboard />}
      </main>

      {/* Publish Modal */}
      <PublishModal
        isOpen={isPublishModalOpen}
        onClose={() => setIsPublishModalOpen(false)}
        videoPackage={videoPackage}
        onPublishSuccess={() => {
          showToast('Video published successfully across your connected feeds!');
        }}
      />
    </div>
  );
}
