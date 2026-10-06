import React, { useEffect, useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Eye,
  Users,
  Percent,
  CheckCircle2,
  Hash,
  Flame,
  ArrowUpRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export const AnalyticsDashboard: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<any>(null);

  useEffect(() => {
    fetch('/api/analytics')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setAnalyticsData(data);
      })
      .catch((err) => console.error('Fetch analytics error:', err));
  }, []);

  const summary = analyticsData?.summary || {
    totalViews: '2,842,500',
    totalPosts: 38,
    avgWatchTimePercentage: '84.2%',
    overallEngagementRate: '9.4%',
    subscribersGained: '+14,320',
    autopilotEfficiency: '99.8%',
  };

  const platforms = analyticsData?.platformBreakdown || [
    { platform: 'YouTube Shorts', views: '1,420,000', percentage: 50, color: '#FF0000' },
    { platform: 'TikTok', views: '1,050,000', percentage: 37, color: '#00F2FE' },
    { platform: 'Instagram Reels', views: '372,500', percentage: 13, color: '#E1306C' },
  ];

  const topHashtags = analyticsData?.topHashtags || [
    { tag: '#Shorts', uses: 36, avgViews: '82.4K', engagement: '10.2%' },
    { tag: '#fyp', uses: 34, avgViews: '79.1K', engagement: '9.8%' },
    { tag: '#techhacks', uses: 28, avgViews: '91.3K', engagement: '11.5%' },
    { tag: '#freeaitools', uses: 24, avgViews: '105.7K', engagement: '12.4%' },
    { tag: '#viral', uses: 38, avgViews: '74.2K', engagement: '8.9%' },
    { tag: '#psychologyfacts', uses: 12, avgViews: '118.0K', engagement: '13.1%' },
  ];

  const retentionPoints = analyticsData?.audienceRetentionCurve || [
    { second: 0, retention: 100 },
    { second: 3, retention: 94 },
    { second: 8, retention: 88 },
    { second: 15, retention: 83 },
    { second: 25, retention: 79 },
    { second: 35, retention: 74 },
    { second: 40, retention: 71 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-extrabold text-white">
              Automated Reach &amp; SEO Performance Tracker
            </h2>
            <span className="px-2 py-0.5 text-[10px] uppercase font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded">
              Real-Time Algorithmic Feed
            </span>
          </div>
          <p className="text-xs text-slate-400 max-w-xl">
            Continuous tracking of view velocity, 3-second hook retention drop-offs, and hashtag SEO efficiency across YouTube Shorts &amp; TikTok.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold bg-emerald-950/50 border border-emerald-500/30 px-3.5 py-2 rounded-xl">
          <ShieldCheck className="w-4 h-4" />
          <span>Autopilot Indexing Active: 99.8% Reliability</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {[
          { label: 'Total Views', value: summary.totalViews, icon: Eye, color: 'text-cyan-400' },
          { label: 'Shorts Published', value: `${summary.totalPosts} Videos`, icon: Zap, color: 'text-amber-400' },
          { label: 'Avg. Retention', value: summary.avgWatchTimePercentage, icon: Percent, color: 'text-emerald-400' },
          { label: 'Engagement Rate', value: summary.overallEngagementRate, icon: TrendingUp, color: 'text-purple-400' },
          { label: 'Followers Gained', value: summary.subscribersGained, icon: Users, color: 'text-pink-400' },
          { label: 'Autopilot Success', value: summary.autopilotEfficiency, icon: CheckCircle2, color: 'text-blue-400' },
        ].map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-1 shadow-lg"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-medium">{kpi.label}</span>
                <Icon className={`w-4 h-4 ${kpi.color}`} />
              </div>
              <div className="text-base sm:text-lg font-extrabold text-white tracking-tight truncate">
                {kpi.value}
              </div>
              <div className="text-[10px] text-emerald-400 flex items-center gap-0.5 font-medium">
                <ArrowUpRight className="w-3 h-3" /> +18.4% this week
              </div>
            </div>
          );
        })}
      </div>

      {/* Middle Grid: Audience Retention Curve + Platform Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Retention Curve (Cols 7) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                Audience Retention Curve (Hook Strength Analysis)
              </h3>
              <p className="text-xs text-slate-400">
                Measures the percentage of viewers watching second-by-second
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-1 rounded-lg">
              94% Hook Hold Rate
            </span>
          </div>

          {/* Retention Visual Bars */}
          <div className="space-y-3 pt-2">
            {retentionPoints.map((pt: any, idx: number) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-mono">
                    {pt.second === 0 ? 'Start (0s)' : pt.second === 3 ? 'Hook (3s) 🔥' : `${pt.second}s`}
                  </span>
                  <span className="text-white font-mono font-bold">{pt.retention}%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      pt.retention > 90
                        ? 'bg-gradient-to-r from-emerald-500 to-cyan-400'
                        : pt.retention > 75
                        ? 'bg-gradient-to-r from-purple-500 to-indigo-400'
                        : 'bg-gradient-to-r from-amber-500 to-red-400'
                    }`}
                    style={{ width: `${pt.retention}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-purple-950/30 rounded-xl border border-purple-800/40 text-xs text-purple-200 mt-2">
            💡 <span className="font-semibold">Algorithmic Insight:</span> Videos that retain over 80% past 15 seconds are automatically favored for the YouTube Shorts shelf &amp; TikTok FYP expansion!
          </div>
        </div>

        {/* Platform Share Breakdown (Cols 5) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white">
              Platform Views Distribution
            </h3>
            <p className="text-xs text-slate-400">
              Share of total views across connected channels
            </p>
          </div>

          <div className="space-y-4 pt-2">
            {platforms.map((p: any, idx: number) => (
              <div key={idx} className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{p.platform}</span>
                  <span className="text-xs font-mono font-extrabold text-cyan-400">
                    {p.views} views
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${p.percentage}%`,
                      backgroundColor: p.color,
                    }}
                  />
                </div>
                <span className="text-[10px] text-slate-500 block text-right font-mono">
                  {p.percentage}% of overall reach
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Leaderboard: Top Performing SEO Hashtags */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Hash className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white">
              Top Performing SEO Hashtags Leaderboard
            </h3>
          </div>
          <span className="text-xs text-slate-400">
            Ranked by organic view expansion score
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {topHashtags.map((ht: any, idx: number) => (
            <div
              key={idx}
              className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between"
            >
              <div className="space-y-0.5">
                <span className="text-xs font-mono font-bold text-cyan-300">
                  {ht.tag}
                </span>
                <div className="text-[10px] text-slate-400">
                  Used in {ht.uses} videos &bull; {ht.engagement} engagement
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-bold text-emerald-400 font-mono">
                  {ht.avgViews}
                </span>
                <span className="text-[10px] text-slate-500 block">Avg. Views</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
