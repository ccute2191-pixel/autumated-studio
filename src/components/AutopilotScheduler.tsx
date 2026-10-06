import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Radio,
  CheckCircle2,
  Play,
  Sparkles,
  Settings,
  Share2,
  Trash2,
  Plus,
  Send,
  Eye,
  Activity,
} from 'lucide-react';
import { AutopilotConfig, ScheduledPost } from '../types';

interface AutopilotSchedulerProps {
  config: AutopilotConfig;
  onUpdateConfig: (cfg: Partial<AutopilotConfig>) => void;
  queue: ScheduledPost[];
  onTriggerPostNow: (post: ScheduledPost) => void;
  onAddNewScheduledPost: (title: string, niche: string) => void;
}

export const AutopilotScheduler: React.FC<AutopilotSchedulerProps> = ({
  config,
  onUpdateConfig,
  queue,
  onTriggerPostNow,
  onAddNewScheduledPost,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newNiche, setNewNiche] = useState('Tech & AI Hacks');

  const activityLogs = [
    {
      time: '18:45 UTC',
      event: 'Autopilot published "The AI Tool NASA Uses" to YouTube Shorts & TikTok',
      reach: '310,000 views reached',
      type: 'published',
    },
    {
      time: '18:40 UTC',
      event: 'AI generated 5-scene 9:16 video package with 15 SEO tags',
      type: 'generated',
    },
    {
      time: '12:30 UTC',
      event: 'Autopilot published "3 Secret Websites" to YouTube Shorts',
      reach: '185,000 views reached',
      type: 'published',
    },
    {
      time: '08:15 UTC',
      event: 'Algorithm scanned trending hashtags: #Shorts, #viral, #techhacks',
      type: 'scanned',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Autopilot Control Panel */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-white">
              <Radio className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold text-white">
                  Autopilot Engine
                </h2>
                <span
                  className={`px-2.5 py-0.5 text-xs font-bold rounded-full border ${
                    config.enabled
                      ? 'bg-emerald-950/60 text-emerald-400 border-emerald-500/40'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                >
                  {config.enabled ? 'ACTIVE & SCHEDULING' : 'PAUSED'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Automatically finds viral ideas, renders 9:16 videos, and posts to YouTube Shorts &amp; TikTok every day.
              </p>
            </div>
          </div>

          {/* Master Toggle */}
          <button
            onClick={() => onUpdateConfig({ enabled: !config.enabled })}
            className={`px-6 py-3 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-lg ${
              config.enabled
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
          >
            <Radio className="w-4 h-4" />
            <span>{config.enabled ? 'Autopilot Enabled' : 'Enable Autopilot'}</span>
          </button>
        </div>

        {/* Configuration Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Daily Post Frequency */}
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              Daily Post Frequency
            </span>
            <div className="grid grid-cols-4 gap-1.5 pt-1">
              {[1, 2, 3, 4].map((count) => (
                <button
                  key={count}
                  onClick={() => onUpdateConfig({ postsPerDay: count })}
                  className={`py-2 rounded-lg text-xs font-bold transition-all ${
                    config.postsPerDay === count
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  {count}x/day
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-500 pt-1">
              Recommended: 2x/day for steady algorithmic momentum without spam penalties.
            </p>
          </div>

          {/* Peak Upload Time Slots */}
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              Algorithmic Peak Time Slots
            </span>
            <div className="flex items-center gap-2 pt-1">
              {config.preferredTimes.map((time, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 bg-slate-900 border border-purple-800/40 text-purple-300 font-mono text-xs font-bold rounded-lg flex items-center gap-1.5"
                >
                  <Clock className="w-3 h-3 text-purple-400" />
                  {time} UTC
                </span>
              ))}
            </div>
            <p className="text-[11px] text-slate-500 pt-1">
              Calculated dynamically based on viewer engagement spikes for vertical video.
            </p>
          </div>

          {/* Connected Auto-Target Channels */}
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              Active Autopilot Channels
            </span>
            <div className="flex items-center gap-2 pt-1">
              <span className="px-2.5 py-1 text-xs font-bold bg-red-950/60 text-red-300 border border-red-800/50 rounded-lg">
                YouTube Shorts
              </span>
              <span className="px-2.5 py-1 text-xs font-bold bg-cyan-950/60 text-cyan-300 border border-cyan-800/50 rounded-lg">
                TikTok
              </span>
              <span className="px-2.5 py-1 text-xs font-bold bg-pink-950/60 text-pink-300 border border-pink-800/50 rounded-lg">
                Reels
              </span>
            </div>
            <p className="text-[11px] text-slate-500 pt-1">
              Videos auto-adapt aspect ratio (9:16) and tags per platform API.
            </p>
          </div>
        </div>
      </div>

      {/* Scheduled Queue & Activity Log Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Upcoming Scheduled Posts Queue (Cols 7) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-purple-400" />
              <h3 className="text-sm font-bold text-white">
                Upcoming Autopilot Video Queue ({queue.length})
              </h3>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="px-3 py-1.5 text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white rounded-lg flex items-center gap-1 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Queue Video</span>
            </button>
          </div>

          <div className="space-y-3">
            {queue.map((item) => (
              <div
                key={item.id}
                className="p-4 bg-slate-950 rounded-xl border border-slate-800 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded ${
                        item.status === 'published'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                      }`}
                    >
                      {item.status}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      {new Date(item.scheduledTime).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    <span className="text-[11px] text-slate-400">&bull; {item.niche}</span>
                  </div>

                  <h4 className="text-xs font-bold text-white leading-snug">
                    {item.title}
                  </h4>

                  <div className="flex items-center gap-2 text-[10px] text-slate-400 pt-0.5">
                    <span>Platforms: {item.platforms.join(', ')}</span>
                    <span>&bull;</span>
                    <span className="text-emerald-400 font-semibold">
                      Est. Views: {item.estimatedViews.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Action button */}
                <div className="shrink-0 flex items-center gap-2">
                  {item.status === 'scheduled' && (
                    <button
                      onClick={() => onTriggerPostNow(item)}
                      className="px-3 py-1.5 text-xs font-bold bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-500 hover:to-purple-500 text-white rounded-lg flex items-center gap-1.5 shadow transition-all"
                    >
                      <Send className="w-3 h-3" />
                      <span>Post Now</span>
                    </button>
                  )}
                  {item.status === 'published' && (
                    <span className="text-xs font-medium text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Published
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Live Autopilot Activity Feed (Cols 5) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <Activity className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">
              Autopilot Activity &amp; Reach Feed
            </h3>
          </div>

          <div className="space-y-3">
            {activityLogs.map((log, idx) => (
              <div
                key={idx}
                className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 space-y-1"
              >
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-purple-400 font-mono font-semibold">{log.time}</span>
                  {log.reach && (
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <Eye className="w-3 h-3" /> {log.reach}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-200">{log.event}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Scheduled Post Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 text-white space-y-4 shadow-2xl">
            <h3 className="text-base font-bold">Queue New Automated Short</h3>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Video Title / Topic</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="E.g. 5 AI Websites To Make Money in 2026..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Niche</label>
              <select
                value={newNiche}
                onChange={(e) => setNewNiche(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none"
              >
                <option value="Tech & AI Hacks">Tech & AI Hacks</option>
                <option value="Dark Psychology">Dark Psychology</option>
                <option value="Wealth & Money">Wealth & Money</option>
                <option value="Science Mysteries">Science Mysteries</option>
              </select>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (newTitle.trim()) {
                    onAddNewScheduledPost(newTitle, newNiche);
                    setNewTitle('');
                    setShowAddModal(false);
                  }
                }}
                className="px-5 py-2 text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white rounded-xl shadow"
              >
                Schedule Video
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
