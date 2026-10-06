import React from 'react';
import {
  Sparkles,
  Zap,
  Film,
  Calendar,
  Share2,
  BarChart3,
  CheckCircle2,
  Flame,
  Radio,
} from 'lucide-react';
import { ConnectedChannel } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  autopilotEnabled: boolean;
  setAutopilotEnabled: (val: boolean) => void;
  connectedChannels: ConnectedChannel[];
  onQuickRunAutopilot: () => void;
  isGenerating: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  autopilotEnabled,
  setAutopilotEnabled,
  connectedChannels,
  onQuickRunAutopilot,
  isGenerating,
}) => {
  const tabs = [
    { id: 'studio', label: 'AI Studio', icon: Film, badge: '9:16' },
    { id: 'trends', label: 'Viral Trends', icon: Flame, badge: 'AI' },
    { id: 'autopilot', label: 'Autopilot', icon: Calendar, badge: autopilotEnabled ? '2x/Day' : 'Off' },
    { id: 'channels', label: 'Channels', icon: Share2, badge: `${connectedChannels.length} Live` },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, badge: '+94%' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 text-white">
        {/* Top Banner / Ticker (Responsive for both mobile & desktop) */}
        <div className="bg-gradient-to-r from-red-950/80 via-purple-950/70 to-cyan-950/80 px-3 sm:px-4 py-1.5 text-[11px] sm:text-xs flex items-center justify-between border-b border-slate-800/60">
          <div className="flex items-center gap-1.5 sm:gap-2 truncate">
            <span className="flex h-2 w-2 relative shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-slate-300 font-medium truncate">
              Shorts &amp; TikTok Auto-Publisher:
            </span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1 shrink-0">
              <CheckCircle2 className="w-3.5 h-3.5" /> 100% Live
            </span>
          </div>

          <div className="hidden md:flex items-center gap-4 text-slate-300">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">Next Scheduled Run:</span>
              <span className="text-purple-300 font-mono font-semibold">18:45 UTC</span>
            </div>
            <div className="h-3 w-px bg-slate-700" />
            <div className="flex items-center gap-1.5 text-yellow-400 font-medium">
              <Sparkles className="w-3 h-3" /> Free Gemini AI Script &amp; Audio
            </div>
          </div>
        </div>

        {/* Main Nav Bar */}
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2 sm:py-2.5 flex items-center justify-between gap-2 sm:gap-4">
          {/* Brand */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-xl bg-gradient-to-tr from-red-600 via-purple-600 to-cyan-400 p-0.5 shadow-lg shadow-purple-500/20 shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Zap className="w-4 sm:w-5 h-4 sm:h-5 text-red-500 fill-red-500 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base sm:text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-purple-200 bg-clip-text text-transparent">
                  ShortsPilot<span className="text-red-500">.ai</span>
                </span>
                <span className="px-1 py-0.2 sm:px-1.5 sm:py-0.5 text-[9px] sm:text-[10px] uppercase font-bold tracking-wider bg-red-500/20 text-red-400 border border-red-500/30 rounded">
                  Auto
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden lg:block">
                Viral Shorts &amp; TikTok Auto-Creator
              </p>
            </div>
          </div>

          {/* Desktop Navigation Tabs (Hidden on mobile, mobile uses bottom dock) */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-red-600 to-purple-600 text-white shadow-md shadow-red-600/20'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                  <span
                    className={`text-[9px] px-1 rounded font-mono ${
                      isActive ? 'bg-black/30 text-white' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {tab.badge}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Autopilot Status & Quick Action Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Autopilot status toggle badge */}
            <button
              onClick={() => setAutopilotEnabled(!autopilotEnabled)}
              className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 border transition-all ${
                autopilotEnabled
                  ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40 hover:bg-emerald-900/50'
                  : 'bg-slate-900 text-slate-400 border-slate-700 hover:bg-slate-800'
              }`}
              title="Click to toggle automatic daily video posting"
            >
              <Radio
                className={`w-3.5 h-3.5 ${
                  autopilotEnabled ? 'text-emerald-400 animate-pulse' : 'text-slate-500'
                }`}
              />
              <span className="hidden sm:inline">
                {autopilotEnabled ? 'Autopilot: ON' : 'Paused'}
              </span>
            </button>

            {/* Quick Autopilot Run Button */}
            <button
              onClick={onQuickRunAutopilot}
              disabled={isGenerating}
              className="px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-red-600 hover:from-red-500 via-purple-600 hover:via-purple-500 to-cyan-500 text-white flex items-center gap-1 shadow-lg shadow-purple-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span className="hidden sm:inline">Cooking...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Run Autopilot</span>
                  <span className="sm:hidden">Run</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE BOTTOM NAVIGATION DOCK (100% App-Like Thumb Navigation on Phones) */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-slate-950/95 backdrop-blur-xl border-t border-slate-800 flex items-center justify-around py-2 px-1 shadow-2xl safe-area-bottom">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all relative ${
                isActive ? 'text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {isActive && (
                <span className="absolute -top-2 w-6 h-1 rounded-full bg-gradient-to-r from-red-500 via-purple-500 to-cyan-400" />
              )}
              <div
                className={`p-1.5 rounded-lg transition-transform ${
                  isActive
                    ? 'bg-gradient-to-tr from-red-600/30 to-purple-600/30 text-purple-400 scale-105'
                    : ''
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              </div>
              <span className="text-[10px] font-semibold tracking-tight mt-0.5">
                {tab.id === 'studio'
                  ? 'Studio'
                  : tab.id === 'trends'
                  ? 'Trends'
                  : tab.id === 'autopilot'
                  ? 'Autopilot'
                  : tab.id === 'channels'
                  ? 'Channels'
                  : 'Analytics'}
              </span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
