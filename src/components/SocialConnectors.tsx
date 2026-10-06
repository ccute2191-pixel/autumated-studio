import React, { useState } from 'react';
import {
  Share2,
  CheckCircle2,
  Youtube,
  Send,
  Plus,
  ShieldCheck,
  Clock,
  ExternalLink,
  Lock,
  Trash2,
  Activity,
  Settings2,
  RefreshCw,
  Globe,
  Check,
  AlertTriangle,
  X,
  Sparkles,
} from 'lucide-react';
import { ConnectedChannel } from '../types';

interface SocialConnectorsProps {
  channels: ConnectedChannel[];
  onToggleAutoPublish: (channelId: string) => void;
  onConnectChannel: (
    platform: string,
    handle: string,
    name: string,
    details?: {
      niche?: string;
      bestTime?: string;
      category?: string;
      privacyDefault?: 'public' | 'unlisted' | 'private';
    }
  ) => void;
  onDisconnectChannel: (channelId: string) => void;
  onUpdateChannel: (channelId: string, updates: Partial<ConnectedChannel>) => void;
}

export const SocialConnectors: React.FC<SocialConnectorsProps> = ({
  channels,
  onToggleAutoPublish,
  onConnectChannel,
  onDisconnectChannel,
  onUpdateChannel,
}) => {
  // Modal states
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [editingChannel, setEditingChannel] = useState<ConnectedChannel | null>(null);
  const [connectMethod, setConnectMethod] = useState<'oauth' | 'manual'>('oauth');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authStep, setAuthStep] = useState(0);

  // Form states
  const [targetPlatform, setTargetPlatform] = useState<'youtube' | 'tiktok' | 'instagram' | 'x'>('youtube');
  const [channelHandle, setChannelHandle] = useState('');
  const [channelName, setChannelName] = useState('');
  const [channelNiche, setChannelNiche] = useState('Tech & AI Hacks');
  const [privacyDefault, setPrivacyDefault] = useState<'public' | 'unlisted' | 'private'>('public');
  const [bestTime, setBestTime] = useState('18:00 UTC');
  const [category, setCategory] = useState('Science & Technology');

  // Ping test states per channel
  const [testingChannelId, setTestingChannelId] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<Record<string, { latency: string; message: string }>>({});

  // 1-Click Fast OAuth flow simulation
  const handleStartOAuth = async () => {
    setIsAuthenticating(true);
    setAuthStep(1); // Opening OAuth dialog

    setTimeout(() => {
      setAuthStep(2); // Authorizing permissions
    }, 700);

    setTimeout(() => {
      setAuthStep(3); // Token exchange & Verification
    }, 1400);

    setTimeout(() => {
      const generatedHandle =
        channelHandle.trim() ||
        (targetPlatform === 'youtube'
          ? '@AIHacksViral'
          : targetPlatform === 'tiktok'
          ? '@dailyviral.ai'
          : '@future.creator');
      const generatedName =
        channelName.trim() ||
        (targetPlatform === 'youtube'
          ? 'AI Hacks Official'
          : targetPlatform === 'tiktok'
          ? 'Daily Viral AI'
          : 'Future Reels Hub');

      onConnectChannel(targetPlatform, generatedHandle, generatedName, {
        niche: channelNiche,
        bestTime,
        category,
        privacyDefault,
      });

      setIsAuthenticating(false);
      setAuthStep(0);
      setShowConnectModal(false);
      setChannelHandle('');
      setChannelName('');
    }, 2100);
  };

  // Test live API connection
  const handleTestConnection = async (channelId: string) => {
    setTestingChannelId(channelId);
    try {
      const res = await fetch('/api/social/channels/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ channelId }),
      });
      const data = await res.json();
      if (data.success) {
        setTestResults((prev) => ({
          ...prev,
          [channelId]: { latency: data.latency, message: data.message },
        }));
        onUpdateChannel(channelId, { apiLatency: data.latency, tokenStatus: 'verified' });
      }
    } catch (err) {
      console.error('Test connection error:', err);
    } finally {
      setTestingChannelId(null);
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'youtube':
        return <Youtube className="w-4 h-4 text-red-500" />;
      case 'tiktok':
        return <Send className="w-4 h-4 text-cyan-400" />;
      case 'instagram':
        return <Share2 className="w-4 h-4 text-pink-500" />;
      default:
        return <Share2 className="w-4 h-4 text-slate-300" />;
    }
  };

  const getPlatformStudioUrl = (channel: ConnectedChannel) => {
    switch (channel.platform) {
      case 'youtube':
        return 'https://studio.youtube.com';
      case 'tiktok':
        return 'https://www.tiktok.com/creator-center/upload';
      case 'instagram':
        return 'https://www.instagram.com';
      default:
        return 'https://x.com';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Share2 className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-extrabold text-white">
              Social Platform Connectors &amp; Accounts
            </h2>
            <span className="px-2.5 py-0.5 text-[10px] uppercase font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {channels.length} Verified Channels
            </span>
          </div>
          <p className="text-xs text-slate-400 max-w-xl">
            Directly connect YouTube Shorts and TikTok accounts with OAuth 2.0. The automated engine auto-schedules videos, attaches maximum SEO tags, and monitors analytics automatically.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setShowConnectModal(true)}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-red-600 via-purple-600 to-cyan-500 hover:opacity-95 text-white flex items-center justify-center gap-2 shadow-lg shadow-purple-600/20 transition-all hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" />
            <span>Connect Account (YouTube / TikTok)</span>
          </button>
        </div>
      </div>

      {/* Platform Quick Links & Supported APIs Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {
            name: 'YouTube Shorts',
            api: 'YouTube Data API v3',
            scope: 'Video Upload & Metadata',
            color: 'border-red-500/30 bg-red-950/20 text-red-300',
            icon: Youtube,
          },
          {
            name: 'TikTok Creator',
            api: 'Content Posting API',
            scope: 'Direct Video Sharing',
            color: 'border-cyan-500/30 bg-cyan-950/20 text-cyan-300',
            icon: Send,
          },
          {
            name: 'Instagram Reels',
            api: 'Meta Graph API',
            scope: 'Reels Auto-Publish',
            color: 'border-pink-500/30 bg-pink-950/20 text-pink-300',
            icon: Share2,
          },
          {
            name: 'X (Twitter)',
            api: 'Twitter API v2',
            scope: 'Media & Thread Post',
            color: 'border-slate-500/30 bg-slate-900 text-slate-300',
            icon: Share2,
          },
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className={`p-3 rounded-xl border flex items-center gap-3 ${item.color}`}
            >
              <div className="w-8 h-8 rounded-lg bg-black/40 flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold truncate">{item.name}</div>
                <div className="text-[10px] opacity-75 truncate">{item.api}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Connected Accounts Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {channels.map((ch) => {
          const isYouTube = ch.platform === 'youtube';
          const isTikTok = ch.platform === 'tiktok';
          const isInstagram = ch.platform === 'instagram';
          const testResult = testResults[ch.id];
          const isTesting = testingChannelId === ch.id;

          return (
            <div
              key={ch.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all shadow-xl space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Card Header with Avatar and Platform Badge */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={ch.avatar}
                        alt={ch.name}
                        className="w-12 h-12 rounded-xl object-cover border-2 border-slate-700"
                      />
                      <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center text-[9px] text-white font-bold">
                        ✓
                      </span>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                        {ch.name}
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                      </h3>
                      <span className="text-xs text-slate-400 font-mono">{ch.handle}</span>
                    </div>
                  </div>

                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-md ${
                      isYouTube
                        ? 'bg-red-600'
                        : isTikTok
                        ? 'bg-black border border-cyan-400 text-cyan-400'
                        : isInstagram
                        ? 'bg-gradient-to-tr from-fuchsia-600 to-pink-500'
                        : 'bg-slate-800'
                    }`}
                  >
                    {isYouTube ? (
                      <Youtube className="w-5 h-5" />
                    ) : isTikTok ? (
                      <Send className="w-5 h-5" />
                    ) : (
                      <Share2 className="w-5 h-5" />
                    )}
                  </div>
                </div>

                {/* Channel Stats Matrix */}
                <div className="grid grid-cols-2 gap-2 p-3 bg-slate-950 rounded-xl border border-slate-800/80 text-xs">
                  <div>
                    <span className="text-slate-500 text-[10px] block uppercase font-semibold">
                      Followers / Subs
                    </span>
                    <span className="text-white font-bold text-sm">{ch.subscribers}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block uppercase font-semibold">
                      Optimal Peak Time
                    </span>
                    <span className="text-purple-300 font-mono font-bold flex items-center gap-1">
                      <Clock className="w-3 h-3 text-purple-400" /> {ch.bestTime}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block uppercase font-semibold">
                      Target Niche
                    </span>
                    <span className="text-slate-300 font-medium truncate block">
                      {ch.niche}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block uppercase font-semibold">
                      Upload Privacy
                    </span>
                    <span className="text-emerald-400 capitalize font-medium">
                      {ch.privacyDefault || 'Public'}
                    </span>
                  </div>
                </div>

                {/* API Token Health & Ping Test Badge */}
                <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-emerald-400 font-medium text-[11px]">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      OAuth 2.0 Verified ({ch.tokenExpiry || '60 days'})
                    </span>
                    <span className="text-[10px] font-mono text-cyan-400 font-bold bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/50">
                      {ch.apiLatency || '32ms'}
                    </span>
                  </div>

                  {testResult && (
                    <div className="text-[11px] text-emerald-300 bg-emerald-950/40 p-2 rounded border border-emerald-800/50 flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{testResult.message}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => handleTestConnection(ch.id)}
                      disabled={isTesting}
                      className="flex-1 py-1.5 px-2.5 rounded-lg text-[11px] font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
                    >
                      <Activity className={`w-3 h-3 text-cyan-400 ${isTesting ? 'animate-spin' : ''}`} />
                      <span>{isTesting ? 'Testing Ping...' : 'Test API Ping'}</span>
                    </button>

                    <a
                      href={getPlatformStudioUrl(ch)}
                      target="_blank"
                      rel="noreferrer"
                      className="py-1.5 px-2.5 rounded-lg text-[11px] font-bold bg-slate-800 hover:bg-slate-700 text-purple-300 flex items-center gap-1 transition-all"
                      title="Open Creator Studio"
                    >
                      <span>Studio</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>

                    <button
                      onClick={() => setEditingChannel(ch)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                      title="Configure Channel Settings"
                    >
                      <Settings2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => {
                        if (confirm(`Disconnect ${ch.name} from automated posting?`)) {
                          onDisconnectChannel(ch.id);
                        }
                      }}
                      className="p-1.5 rounded-lg text-red-400/80 hover:text-red-400 hover:bg-red-950/40 transition-colors"
                      title="Disconnect Account"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Auto-Publish Toggle Switch Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-800 mt-2">
                <div>
                  <span className="text-xs font-bold text-white block">Daily Auto-Publish</span>
                  <span className="text-[10px] text-slate-400">
                    Include in Autopilot cycle
                  </span>
                </div>
                <button
                  onClick={() => onToggleAutoPublish(ch.id)}
                  className={`w-11 h-6 rounded-full transition-colors relative ${
                    ch.autoPublish ? 'bg-purple-600' : 'bg-slate-800'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                      ch.autoPublish ? 'left-6' : 'left-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Connect Account Modal (1-Click OAuth + Manual API) */}
      {showConnectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 text-white space-y-5 shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-red-600 via-purple-600 to-cyan-500 flex items-center justify-center shadow">
                  <Share2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-base font-bold">Connect Social Platform</h3>
                  <p className="text-xs text-slate-400">
                    Directly authorize YouTube Shorts or TikTok Creator account
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowConnectModal(false);
                  setIsAuthenticating(false);
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Platform Selection */}
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-2 uppercase tracking-wider">
                1. Select Platform
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  {
                    id: 'youtube',
                    name: 'YouTube Shorts',
                    sub: 'YouTube Studio API',
                    color: 'from-red-600 to-red-700',
                    icon: Youtube,
                  },
                  {
                    id: 'tiktok',
                    name: 'TikTok Creator',
                    sub: 'TikTok Open API',
                    color: 'from-cyan-500 to-blue-600',
                    icon: Send,
                  },
                  {
                    id: 'instagram',
                    name: 'Instagram Reels',
                    sub: 'Meta Graph API',
                    color: 'from-fuchsia-600 to-pink-600',
                    icon: Share2,
                  },
                  {
                    id: 'x',
                    name: 'X (Twitter)',
                    sub: 'Twitter Media API',
                    color: 'from-slate-700 to-slate-800',
                    icon: Share2,
                  },
                ].map((item) => {
                  const isSelected = targetPlatform === item.id;
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setTargetPlatform(item.id as any)}
                      className={`p-3 rounded-xl border flex items-center gap-3 text-left transition-all ${
                        isSelected
                          ? 'border-purple-500 bg-purple-950/40 shadow-md'
                          : 'border-slate-800 bg-slate-950/50 hover:border-slate-700 text-slate-400'
                      }`}
                    >
                      <div
                        className={`w-9 h-9 rounded-lg bg-gradient-to-tr ${item.color} flex items-center justify-center text-white shrink-0`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-white truncate">
                          {item.name}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate">{item.sub}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Authentication Flow / Settings */}
            {!isAuthenticating ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">
                      Account Handle
                    </label>
                    <input
                      type="text"
                      value={channelHandle}
                      onChange={(e) => setChannelHandle(e.target.value)}
                      placeholder={targetPlatform === 'youtube' ? '@TechHacksDaily' : '@viral_reels'}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-400 block mb-1">
                      Channel Display Name
                    </label>
                    <input
                      type="text"
                      value={channelName}
                      onChange={(e) => setChannelName(e.target.value)}
                      placeholder="E.g. Tech Hacks Daily"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Default Privacy</label>
                    <select
                      value={privacyDefault}
                      onChange={(e) => setPrivacyDefault(e.target.value as any)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none"
                    >
                      <option value="public">Public (Immediate Feed)</option>
                      <option value="unlisted">Unlisted (Review First)</option>
                      <option value="private">Private (Drafts Only)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Peak Upload Time</label>
                    <select
                      value={bestTime}
                      onChange={(e) => setBestTime(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none"
                    >
                      <option value="12:30 UTC">12:30 UTC (Lunch Peak)</option>
                      <option value="17:30 UTC">17:30 UTC (YouTube Peak)</option>
                      <option value="19:00 UTC">19:00 UTC (TikTok Prime)</option>
                      <option value="21:15 UTC">21:15 UTC (Night Owl)</option>
                    </select>
                  </div>
                </div>

                {/* OAuth Consent Note */}
                <div className="p-3 bg-purple-950/30 rounded-xl border border-purple-800/40 text-xs text-purple-200 flex items-start gap-2.5">
                  <Lock className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <span className="font-semibold block">
                      Secure OAuth 2.0 Authorization
                    </span>
                    <p className="text-[11px] text-purple-300/80 leading-relaxed">
                      Authorizing grants ShortsPilot automated posting rights, subtitle syncing, and performance analytics for this channel.
                    </p>
                  </div>
                </div>

                {/* Submit button */}
                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    onClick={() => setShowConnectModal(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleStartOAuth}
                    className="px-5 py-2.5 text-xs font-bold bg-gradient-to-r from-red-600 via-purple-600 to-cyan-500 hover:opacity-95 text-white rounded-xl shadow-lg shadow-purple-600/30 flex items-center gap-2 transition-all hover:scale-[1.02]"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Authorize with {targetPlatform.toUpperCase()}</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Live OAuth Handshake Step Animation */
              <div className="p-6 bg-slate-950 rounded-xl border border-slate-800 text-center space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-600/20 text-purple-400 border border-purple-500/40 flex items-center justify-center mx-auto">
                  <RefreshCw className="w-6 h-6 animate-spin" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">
                    {authStep === 1
                      ? `Contacting ${targetPlatform.toUpperCase()} OAuth Service...`
                      : authStep === 2
                      ? 'Authorizing Video Upload & SEO Tag Permissions...'
                      : 'Exchanging & Securing OAuth 2.0 Refresh Token...'}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Please wait while your channel is verified and registered with ShortsPilot.
                  </p>
                </div>
                <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden max-w-xs mx-auto">
                  <div
                    className="h-full bg-gradient-to-r from-red-500 via-purple-500 to-cyan-400 transition-all duration-500"
                    style={{ width: `${(authStep / 3) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Edit Channel Settings Modal */}
      {editingChannel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 text-white space-y-4 shadow-2xl">
            <h3 className="text-base font-bold">Configure {editingChannel.name}</h3>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Target Niche</label>
              <input
                type="text"
                value={editingChannel.niche}
                onChange={(e) =>
                  setEditingChannel({ ...editingChannel, niche: e.target.value })
                }
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Optimal Peak Time</label>
              <select
                value={editingChannel.bestTime}
                onChange={(e) =>
                  setEditingChannel({ ...editingChannel, bestTime: e.target.value })
                }
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none"
              >
                <option value="12:30 UTC">12:30 UTC</option>
                <option value="17:30 UTC">17:30 UTC</option>
                <option value="19:00 UTC">19:00 UTC</option>
                <option value="21:15 UTC">21:15 UTC</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Default Privacy</label>
              <select
                value={editingChannel.privacyDefault || 'public'}
                onChange={(e) =>
                  setEditingChannel({
                    ...editingChannel,
                    privacyDefault: e.target.value as any,
                  })
                }
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none"
              >
                <option value="public">Public</option>
                <option value="unlisted">Unlisted</option>
                <option value="private">Private</option>
              </select>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setEditingChannel(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onUpdateChannel(editingChannel.id, {
                    niche: editingChannel.niche,
                    bestTime: editingChannel.bestTime,
                    privacyDefault: editingChannel.privacyDefault,
                  });
                  setEditingChannel(null);
                }}
                className="px-5 py-2 text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white rounded-xl shadow"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
