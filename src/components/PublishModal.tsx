import React, { useState } from 'react';
import {
  X,
  Share2,
  CheckCircle2,
  Youtube,
  Send,
  ExternalLink,
  Sparkles,
  Hash,
  Search,
  Copy,
  Check,
  Download,
  Smartphone,
  Upload,
} from 'lucide-react';
import { VideoPackage } from '../types';

interface PublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoPackage: VideoPackage;
  onPublishSuccess: (result: any) => void;
}

export const PublishModal: React.FC<PublishModalProps> = ({
  isOpen,
  onClose,
  videoPackage,
  onPublishSuccess,
}) => {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['youtube', 'tiktok']);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishProgress, setPublishProgress] = useState(0);
  const [progressStage, setProgressStage] = useState('');
  const [publishedResult, setPublishedResult] = useState<any>(null);
  const [copiedType, setCopiedType] = useState<string | null>(null);

  if (!isOpen) return null;

  const togglePlatform = (platform: string) => {
    if (selectedPlatforms.includes(platform)) {
      if (selectedPlatforms.length > 1) {
        setSelectedPlatforms(selectedPlatforms.filter((p) => p !== platform));
      }
    } else {
      setSelectedPlatforms([...selectedPlatforms, platform]);
    }
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    setPublishProgress(15);
    setProgressStage('Compiling 9:16 vertical video & kinetic captions...');

    setTimeout(() => {
      setPublishProgress(45);
      setProgressStage('Authorizing API credentials with YouTube Studio & TikTok...');
    }, 700);

    setTimeout(() => {
      setPublishProgress(75);
      setProgressStage('Injecting algorithm SEO keywords & viral hashtags...');
    }, 1400);

    try {
      const response = await fetch('/api/social/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: videoPackage.title,
          platforms: selectedPlatforms,
          hashtags: videoPackage.trendingHashtags,
          seoKeywords: videoPackage.seoKeywords,
        }),
      });

      const data = await response.json();
      setTimeout(() => {
        setPublishProgress(100);
        setProgressStage('Video broadcast LIVE across social feeds! 🎉');
        setIsPublishing(false);
        setPublishedResult(data);
        onPublishSuccess(data);
      }, 2100);
    } catch (err) {
      console.error('Publish error:', err);
      setIsPublishing(false);
    }
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  // Web Share API support
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: videoPackage.title,
          text: `${videoPackage.title}\n\n${videoPackage.trendingHashtags.slice(0, 5).join(' ')}`,
          url: publishedResult?.platformsPublished?.[0]?.postUrl || window.location.href,
        });
      } catch (err) {
        console.log('Share canceled or failed', err);
      }
    } else {
      copyToClipboard(
        `${videoPackage.title}\n\n${videoPackage.trendingHashtags.join(' ')}`,
        'native-share'
      );
    }
  };

  // Download metadata text bundle
  const handleDownloadMetadataBundle = () => {
    const textContent = `=== SHORTSPILOT AI VIDEO METADATA BUNDLE ===
TITLE:
${videoPackage.title}

HOOK (First 3s):
${videoPackage.hook}

YOUTUBE SHORTS DESCRIPTION:
${videoPackage.youtubeDescription}

TIKTOK CAPTION:
${videoPackage.tiktokCaption}

HIGH-SEARCH SEO KEYWORDS:
${videoPackage.seoKeywords.join(', ')}

TRENDING HASHTAGS:
${videoPackage.trendingHashtags.join(' ')}

ESTIMATED VIRAL SCORE:
${videoPackage.estimatedViralPotential}/100
`;

    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${videoPackage.title.slice(0, 30).replace(/[^a-zA-Z0-9]/g, '_')}_SEO_Metadata.txt`;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 text-white shadow-2xl shadow-purple-900/40 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 via-purple-600 to-cyan-500 flex items-center justify-center shadow-md">
              <Share2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Direct Publish to Social Platforms</h3>
              <p className="text-xs text-slate-400">
                1-Click Multi-Platform Auto-Distribution &bull; Maximum SEO Algorithmic Reach
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {!publishedResult ? (
          <div className="mt-5 space-y-5">
            {/* Platform Pickers */}
            <div>
              <label className="text-xs font-semibold uppercase text-slate-400 tracking-wider block mb-2">
                1. Select Target Social Platforms (Connected &amp; Verified)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  {
                    id: 'youtube',
                    name: 'YouTube Shorts',
                    icon: Youtube,
                    color: 'from-red-600 to-red-700',
                    badge: '#Shorts Shelf',
                  },
                  {
                    id: 'tiktok',
                    name: 'TikTok',
                    icon: Send,
                    color: 'from-cyan-500 to-blue-600',
                    badge: 'FYP Boost',
                  },
                  {
                    id: 'instagram',
                    name: 'Instagram Reels',
                    icon: Share2,
                    color: 'from-fuchsia-600 to-pink-600',
                    badge: 'Reels Reach',
                  },
                  {
                    id: 'x',
                    name: 'X (Twitter)',
                    icon: Share2,
                    color: 'from-slate-700 to-slate-800',
                    badge: 'Viral Thread',
                  },
                ].map((plat) => {
                  const isSelected = selectedPlatforms.includes(plat.id);
                  const Icon = plat.icon;
                  return (
                    <button
                      key={plat.id}
                      onClick={() => togglePlatform(plat.id)}
                      className={`p-3 rounded-xl border flex flex-col items-center gap-2 text-center transition-all ${
                        isSelected
                          ? 'border-purple-500 bg-purple-950/40 shadow-md shadow-purple-500/10'
                          : 'border-slate-800 bg-slate-950/40 text-slate-500 opacity-60 hover:opacity-90'
                      }`}
                    >
                      <div
                        className={`w-9 h-9 rounded-lg bg-gradient-to-tr ${plat.color} flex items-center justify-center text-white`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">{plat.name}</div>
                        <span className="text-[10px] text-emerald-400 font-medium">
                          {plat.badge}
                        </span>
                      </div>
                      <div className="mt-1">
                        <span
                          className={`inline-block w-4 h-4 rounded-full border flex items-center justify-center text-[10px] ${
                            isSelected
                              ? 'bg-purple-600 border-purple-400 text-white'
                              : 'border-slate-600'
                          }`}
                        >
                          {isSelected && '✓'}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Video Package Preview */}
            <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-3">
              <div>
                <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block mb-1">
                  Video Title (Optimized for 90%+ CTR)
                </span>
                <p className="text-sm font-semibold text-white bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  {videoPackage.title}
                </p>
              </div>

              {/* Hashtags Preview */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <Hash className="w-3 h-3 text-cyan-400" /> Auto-Injected Trending Hashtags ({videoPackage.trendingHashtags.length})
                  </span>
                  <button
                    onClick={() =>
                      copyToClipboard(videoPackage.trendingHashtags.join(' '), 'tags')
                    }
                    className="text-[11px] text-purple-400 hover:text-purple-300 flex items-center gap-1"
                  >
                    {copiedType === 'tags' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    Copy Tags
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto p-2 bg-slate-900 rounded-lg border border-slate-800">
                  {videoPackage.trendingHashtags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 text-xs font-mono font-medium bg-cyan-950/60 text-cyan-300 border border-cyan-800/50 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* SEO Keywords */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <Search className="w-3 h-3 text-purple-400" /> Algorithmic SEO Search Keywords ({videoPackage.seoKeywords.length})
                  </span>
                  <button
                    onClick={() =>
                      copyToClipboard(videoPackage.seoKeywords.join(', '), 'keywords')
                    }
                    className="text-[11px] text-purple-400 hover:text-purple-300 flex items-center gap-1"
                  >
                    {copiedType === 'keywords' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    Copy Keywords
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto p-2 bg-slate-900 rounded-lg border border-slate-800">
                  {videoPackage.seoKeywords.map((kw, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 text-[11px] bg-purple-950/60 text-purple-300 border border-purple-800/50 rounded"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs text-slate-400">
                <span className="flex items-center gap-1 text-emerald-400 font-medium">
                  <Sparkles className="w-3.5 h-3.5" /> High Viral Score: {videoPackage.estimatedViralPotential}/100
                </span>
                <button
                  onClick={handleDownloadMetadataBundle}
                  className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1"
                >
                  <Download className="w-3 h-3" />
                  <span>Download Metadata TXT</span>
                </button>
              </div>
            </div>

            {/* Publishing progress bar if active */}
            {isPublishing && (
              <div className="space-y-2 p-3 bg-purple-950/30 border border-purple-800/40 rounded-xl">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-purple-300 font-medium">{progressStage}</span>
                  <span className="text-purple-400 font-mono font-bold">{publishProgress}%</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-red-500 via-purple-500 to-cyan-400 transition-all duration-300"
                    style={{ width: `${publishProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={onClose}
                disabled={isPublishing}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handlePublish}
                disabled={isPublishing || selectedPlatforms.length === 0}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-red-600 via-purple-600 to-cyan-500 text-white flex items-center gap-2 shadow-lg shadow-purple-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {isPublishing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Publishing Across Feeds...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Publish Directly to {selectedPlatforms.length} Platforms Now</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          /* Published Success View */
          <div className="mt-5 space-y-5 text-center py-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h4 className="text-xl font-extrabold text-white">
                Short Video Successfully Published!
              </h4>
              <p className="text-xs text-slate-300 mt-1 max-w-md mx-auto">
                Your video is now live with optimized SEO tags and trending hashtags. YouTube Shorts &amp; TikTok algorithms are now indexing the content.
              </p>
            </div>

            {/* Direct Social Platform Links */}
            <div className="space-y-2 text-left max-w-lg mx-auto">
              {publishedResult.platformsPublished?.map((item: any, idx: number) => (
                <div
                  key={idx}
                  className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <div>
                      <span className="text-xs font-bold capitalize text-white">
                        {item.platform === 'youtube' ? 'YouTube Shorts' : item.platform}
                      </span>
                      <div className="text-[10px] text-slate-400">
                        Predicted initial reach:{' '}
                        <span className="text-emerald-400 font-semibold">
                          {item.initialReachEstimate.toLocaleString()} views
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href={
                        item.platform === 'youtube'
                          ? 'https://studio.youtube.com'
                          : item.platform === 'tiktok'
                          ? 'https://www.tiktok.com/creator-center/upload'
                          : 'https://instagram.com'
                      }
                      target="_blank"
                      rel="noreferrer"
                      className="px-2.5 py-1 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-lg flex items-center gap-1 transition-colors"
                      title="Open Studio"
                    >
                      <Upload className="w-3 h-3 text-cyan-400" />
                      <span>Studio</span>
                    </a>
                    <a
                      href={item.postUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-2.5 py-1 text-xs font-medium bg-purple-900/40 hover:bg-purple-900/70 text-purple-300 border border-purple-700/50 rounded-lg flex items-center gap-1 transition-colors"
                    >
                      <span>View Live</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Share / Export Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
              <button
                onClick={handleNativeShare}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors"
              >
                <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
                <span>Share via Phone / Apps</span>
              </button>

              <button
                onClick={handleDownloadMetadataBundle}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-purple-300 border border-slate-700 flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download SEO Package (.txt)</span>
              </button>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-center gap-3">
              <button
                onClick={() => {
                  setPublishedResult(null);
                  onClose();
                }}
                className="px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg transition-all"
              >
                Done &amp; Return to Studio
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
