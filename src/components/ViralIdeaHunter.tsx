import React, { useState } from 'react';
import {
  Flame,
  Sparkles,
  Zap,
  TrendingUp,
  Search,
  ArrowRight,
  ShieldAlert,
  Eye,
  Hash,
} from 'lucide-react';
import { ViralIdea } from '../types';

interface ViralIdeaHunterProps {
  onSelectIdea: (idea: ViralIdea) => void;
  isGenerating: boolean;
}

export const ViralIdeaHunter: React.FC<ViralIdeaHunterProps> = ({
  onSelectIdea,
  isGenerating,
}) => {
  const [selectedNiche, setSelectedNiche] = useState('Tech & AI Hacks');
  const [isScanning, setIsScanning] = useState(false);
  const [ideas, setIdeas] = useState<ViralIdea[]>([
    {
      id: 'trend-1',
      title: '3 Secret Websites That Feel Illegal To Know in 2026',
      hook: 'Stop scrolling! These 3 free websites are so powerful they feel completely illegal...',
      predictedViralScore: 98,
      targetAngle: 'FOMO & Secret Weapon',
      estimatedReach: '500K - 2.1M views',
      topKeywords: ['secret websites', 'free ai tools 2026', 'productivity hacks', 'automation'],
      topHashtags: ['#Shorts', '#viral', '#techhacks', '#freeaitools', '#fyp'],
    },
    {
      id: 'trend-2',
      title: 'The 3-Second Psychological Trick To Read Any Human',
      hook: 'Watch their left eye when they answer. FBI interrogators swear by this subconscious cue...',
      predictedViralScore: 96,
      targetAngle: 'Dark Psychology & Curiosity Gap',
      estimatedReach: '750K - 3.4M views',
      topKeywords: ['dark psychology', 'body language hack', 'fbi tricks', 'mind reading'],
      topHashtags: ['#Shorts', '#psychologyfacts', '#mindblown', '#shortsfeed', '#tiktok'],
    },
    {
      id: 'trend-3',
      title: 'Why 99% Of People Never Get Rich (Dark Money Truth)',
      hook: 'You work 8 hours a day, but billionaires only do this ONE thing with their mornings...',
      predictedViralScore: 95,
      targetAngle: 'Wealth Awakening & Controversy',
      estimatedReach: '400K - 1.6M views',
      topKeywords: ['wealth mindset', 'money rules', 'financial freedom', 'dark truth'],
      topHashtags: ['#shorts', '#wealthmindset', '#moneymindset', '#successquotes', '#rich'],
    },
    {
      id: 'trend-4',
      title: 'Delete This ONE iPhone Setting Right Now (Saves 40% Battery)',
      hook: 'Apple hides this background tracking toggle, and it is silently destroying your battery life...',
      predictedViralScore: 93,
      targetAngle: 'Urgency & Instant Action',
      estimatedReach: '600K - 1.9M views',
      topKeywords: ['iphone hacks', 'battery life secret', 'hidden ios features', 'apple tips'],
      topHashtags: ['#Shorts', '#iphonetips', '#applehacks', '#tech', '#trending'],
    },
    {
      id: 'trend-5',
      title: 'The AI Tool NASA Uses That Nobody Talks About',
      hook: 'NASA just unlocked a secret algorithm and it solved a 50-year mystery in 4 seconds...',
      predictedViralScore: 94,
      targetAngle: 'Scientific Awe & Secret Discovery',
      estimatedReach: '350K - 1.2M views',
      topKeywords: ['nasa secret', 'space ai', 'quantum physics', 'scientific mystery'],
      topHashtags: ['#Shorts', '#space', '#nasa', '#mindblowing', '#technology'],
    },
  ]);

  const niches = [
    'Tech & AI Hacks',
    'Dark Psychology & Facts',
    'Wealth & Money Secrets',
    'Mindblowing Science & Space',
    'Productivity & Life Hacks',
    'True Crime & Mysteries',
  ];

  const handleScanTrends = async (nicheToScan: string) => {
    setIsScanning(true);
    try {
      const response = await fetch('/api/ai/discover-trends', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ niche: nicheToScan }),
      });
      const data = await response.json();
      if (data.ideas && data.ideas.length > 0) {
        setIdeas(data.ideas);
      }
    } catch (err) {
      console.error('Scan trends error:', err);
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-red-600 flex items-center justify-center text-white">
              <Flame className="w-5 h-5 fill-amber-300" />
            </div>
            <h2 className="text-xl font-extrabold text-white">
              Viral Idea &amp; Trend Hunter
            </h2>
            <span className="px-2 py-0.5 text-[10px] uppercase font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded">
              Algorithm Scanner
            </span>
          </div>
          <p className="text-xs text-slate-400 max-w-xl">
            Real-time viral trend discovery optimized for YouTube Shorts shelf and TikTok FYP algorithms. One click generates full 9:16 video packages.
          </p>
        </div>

        <button
          onClick={() => handleScanTrends(selectedNiche)}
          disabled={isScanning}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 hover:from-amber-400 via-red-600 hover:via-red-500 to-purple-600 text-white flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 hover:scale-[1.02] transition-all disabled:opacity-50"
        >
          {isScanning ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Scanning Social Algorithms...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Scan Viral Trends ({selectedNiche})</span>
            </>
          )}
        </button>
      </div>

      {/* Niche Pills Selector (Smooth Mobile Horizontal Scroll) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none touch-pan-x">
        {niches.map((niche) => {
          const isSelected = selectedNiche === niche;
          return (
            <button
              key={niche}
              onClick={() => {
                setSelectedNiche(niche);
                handleScanTrends(niche);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-gradient-to-r from-red-600 to-purple-600 text-white shadow-md shadow-red-600/20'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
              }`}
            >
              {niche}
            </button>
          );
        })}
      </div>

      {/* Ideas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ideas.map((idea) => (
          <div
            key={idea.id}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-purple-500/60 transition-all flex flex-col justify-between group shadow-lg shadow-black/20 hover:shadow-purple-900/20"
          >
            <div className="space-y-3">
              {/* Top Meta: Score & Angle */}
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 text-[11px] font-extrabold bg-gradient-to-r from-amber-500/20 to-red-500/20 text-amber-300 border border-amber-500/30 rounded-lg flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  Score: {idea.predictedViralScore}/100
                </span>

                <span className="text-[10px] font-mono font-medium text-purple-300 bg-purple-950/60 border border-purple-800/40 px-2 py-0.5 rounded-full">
                  {idea.targetAngle}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-sm font-extrabold text-white group-hover:text-purple-300 transition-colors leading-snug">
                {idea.title}
              </h3>

              {/* 3-Second Hook */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80">
                <span className="text-[10px] font-bold uppercase tracking-wider text-red-400 block mb-1">
                  3-Second Retention Hook
                </span>
                <p className="text-xs text-slate-300 italic font-medium leading-relaxed">
                  "{idea.hook}"
                </p>
              </div>

              {/* Estimated reach */}
              <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                <span className="flex items-center gap-1 text-emerald-400 font-semibold text-[11px]">
                  <Eye className="w-3.5 h-3.5" /> Est. Reach: {idea.estimatedReach}
                </span>
              </div>

              {/* Hashtags Preview */}
              <div className="flex flex-wrap gap-1 pt-1">
                {idea.topHashtags.slice(0, 4).map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-mono px-2 py-0.5 bg-slate-950 text-cyan-300 border border-slate-800 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Action button: Turn into Video */}
            <div className="pt-4 mt-4 border-t border-slate-800">
              <button
                onClick={() => onSelectIdea(idea)}
                disabled={isGenerating}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-gradient-to-r from-red-600 via-purple-600 to-cyan-500 hover:opacity-95 text-white flex items-center justify-center gap-2 shadow-md shadow-purple-600/20 group-hover:scale-[1.01] transition-all disabled:opacity-50"
              >
                <Zap className="w-3.5 h-3.5 fill-white" />
                <span>Auto-Generate 9:16 Video</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
