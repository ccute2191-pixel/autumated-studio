import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Download,
  Share2,
  Sparkles,
  Music,
  Mic,
  Palette,
  Hash,
  Search,
  Copy,
  Check,
  Heart,
  MessageCircle,
  Bookmark,
  Share,
  Layers,
  Wand2,
  Sliders,
  ChevronRight,
  Flame,
} from 'lucide-react';
import { VideoPackage, VideoScene } from '../types';
import { audioSynthesizer, SpeechEngine } from '../utils/audioSynthesizer';
import { VideoCanvasRecorder } from '../utils/videoRecorder';

interface VideoStudioProps {
  videoPackage: VideoPackage;
  onUpdatePackage: (pkg: VideoPackage) => void;
  onOpenPublishModal: () => void;
  onGenerateNewTopic: (topic: string) => void;
  isGenerating: boolean;
}

export const VideoStudio: React.FC<VideoStudioProps> = ({
  videoPackage,
  onUpdatePackage,
  onOpenPublishModal,
  onGenerateNewTopic,
  isGenerating,
}) => {
  // Playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [currentTimeSec, setCurrentTimeSec] = useState(0);
  const [activeWordIndex, setActiveWordIndex] = useState(0);
  const [activeInspectorTab, setActiveInspectorTab] = useState<'script' | 'seo' | 'audio' | 'style'>('script');

  // Audio settings
  const [isMusicEnabled, setIsMusicEnabled] = useState(true);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [musicVolume, setMusicVolume] = useState(0.25);
  const [selectedMusicMood, setSelectedMusicMood] = useState('Phonk Fast Drift');
  const [speechRate, setSpeechRate] = useState(1.15);
  const [selectedVoiceIndex, setSelectedVoiceIndex] = useState(0);
  const [captionTheme, setCaptionTheme] = useState<'hormozi' | 'cyber' | 'toxic' | 'neon'>('hormozi');

  // Video recording/export state
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [customPrompt, setCustomPrompt] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [likesCount, setLikesCount] = useState(148200);
  const [isLiked, setIsLiked] = useState(false);

  // Canvas ref
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const recorderRef = useRef<VideoCanvasRecorder>(new VideoCanvasRecorder());

  const scenes = videoPackage.scenes || [];
  const currentScene: VideoScene = scenes[currentSceneIndex] || scenes[0];
  const totalDuration = scenes.reduce((acc, s) => acc + (s.durationSec || 6), 0);

  // Calculate accumulated start time of each scene
  const sceneStartTimes = scenes.reduce<number[]>((acc, s, idx) => {
    if (idx === 0) return [0];
    return [...acc, acc[idx - 1] + (scenes[idx - 1].durationSec || 6)];
  }, []);

  // Update canvas graphics on every animation tick
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particleTime = 0;

    const render = () => {
      particleTime += 0.03;
      const w = canvas.width;
      const h = canvas.height;

      // 1. Draw dynamic background based on scene style
      const theme = currentScene?.themeStyle || 'neon_cyber';
      const grad = ctx.createLinearGradient(0, 0, w, h);

      if (theme === 'neon_cyber') {
        grad.addColorStop(0, '#0a001a');
        grad.addColorStop(0.5, '#1e0836');
        grad.addColorStop(1, '#050212');
      } else if (theme === 'hyper_matrix') {
        grad.addColorStop(0, '#001a14');
        grad.addColorStop(0.5, '#053326');
        grad.addColorStop(1, '#000f0c');
      } else if (theme === 'cinematic_gold') {
        grad.addColorStop(0, '#1a1200');
        grad.addColorStop(0.5, '#3d2b05');
        grad.addColorStop(1, '#0d0900');
      } else if (theme === 'dark_lux') {
        grad.addColorStop(0, '#0f051d');
        grad.addColorStop(0.5, '#1a0033');
        grad.addColorStop(1, '#080112');
      } else {
        grad.addColorStop(0, '#1a001a');
        grad.addColorStop(0.5, '#330533');
        grad.addColorStop(1, '#0d0014');
      }

      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // 2. Animated grid lines (Cyber aesthetics)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      const gridSize = 40;
      const offsetY = (particleTime * 20) % gridSize;

      for (let x = 0; x < w; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = offsetY; y < h; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // 3. Ambient glowing neon orb in center
      const orbGrad = ctx.createRadialGradient(
        w / 2 + Math.sin(particleTime) * 30,
        h / 2 - 50 + Math.cos(particleTime * 0.8) * 30,
        10,
        w / 2,
        h / 2 - 50,
        220
      );
      if (theme === 'hyper_matrix') {
        orbGrad.addColorStop(0, 'rgba(0, 255, 170, 0.25)');
        orbGrad.addColorStop(1, 'rgba(0, 255, 170, 0)');
      } else if (theme === 'cinematic_gold') {
        orbGrad.addColorStop(0, 'rgba(255, 200, 0, 0.25)');
        orbGrad.addColorStop(1, 'rgba(255, 200, 0, 0)');
      } else {
        orbGrad.addColorStop(0, 'rgba(168, 85, 247, 0.3)');
        orbGrad.addColorStop(1, 'rgba(236, 72, 153, 0)');
      }
      ctx.fillStyle = orbGrad;
      ctx.fillRect(0, 0, w, h);

      // 4. Floating cyber particles
      for (let i = 0; i < 15; i++) {
        const px = (Math.sin(particleTime * 0.5 + i * 2) * 0.5 + 0.5) * w;
        const py = ((particleTime * 30 + i * 50) % (h + 50)) - 25;
        const radius = (i % 3) + 1.5;

        ctx.fillStyle = i % 2 === 0 ? 'rgba(255, 255, 255, 0.4)' : 'rgba(192, 132, 252, 0.5)';
        ctx.beginPath();
        ctx.arc(px, py, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // 5. Visual Prompt Graphic Card
      const cardY = h * 0.22;
      const cardH = h * 0.32;
      const cardW = w * 0.88;
      const cardX = (w - cardW) / 2;

      // Glow behind card
      ctx.save();
      ctx.shadowColor = theme === 'hyper_matrix' ? '#00f2fe' : '#ec4899';
      ctx.shadowBlur = 20;
      ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
      ctx.beginPath();
      ctx.roundRect(cardX, cardY, cardW, cardH, 20);
      ctx.fill();
      ctx.restore();

      // Card border
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(cardX, cardY, cardW, cardH, 20);
      ctx.stroke();

      // Card visual imagery representation
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(cardX, cardY, cardW, cardH, 20);
      ctx.clip();

      // Cyber hologram waves inside card
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.fillRect(cardX, cardY, cardW, cardH);

      // Abstract dynamic visual waveform / art
      ctx.strokeStyle = theme === 'hyper_matrix' ? '#10b981' : '#a855f7';
      ctx.lineWidth = 3;
      ctx.beginPath();
      for (let x = 0; x <= cardW; x += 10) {
        const y =
          cardY +
          cardH / 2 +
          Math.sin(x * 0.05 + particleTime * 3) * 25 +
          Math.cos(x * 0.02 - particleTime * 2) * 15;
        if (x === 0) ctx.moveTo(cardX + x, y);
        else ctx.lineTo(cardX + x, y);
      }
      ctx.stroke();

      // Scene Badge Banner inside Card
      if (currentScene?.badge) {
        const badgeText = currentScene.badge;
        ctx.font = 'bold 15px "Inter", sans-serif';
        const badgeMetrics = ctx.measureText(badgeText);
        const bw = badgeMetrics.width + 24;
        const bh = 28;
        const bx = cardX + (cardW - bw) / 2;
        const by = cardY + 16;

        ctx.fillStyle = 'rgba(239, 68, 68, 0.9)';
        ctx.beginPath();
        ctx.roundRect(bx, by, bw, bh, 8);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(badgeText, cardX + cardW / 2, by + bh / 2);
      }

      // Visual Prompt caption hint inside Card
      ctx.font = '11px "Inter", sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.textAlign = 'center';
      const promptSnippet = currentScene?.visualPrompt || '';
      const displayPrompt =
        promptSnippet.length > 55 ? promptSnippet.substring(0, 52) + '...' : promptSnippet;
      ctx.fillText(displayPrompt, cardX + cardW / 2, cardY + cardH - 20);

      ctx.restore();

      // 6. Kinetic Alex Hormozi Style Subtitles (Lower-Third center)
      const captionY = h * 0.64;
      const words = currentScene?.words || [];

      if (words.length > 0) {
        // Group words in chunks of 3-4 for maximum kinetic readability
        const chunkSize = 3;
        const activeChunk = Math.floor(activeWordIndex / chunkSize);
        const startIdx = activeChunk * chunkSize;
        const visibleWords = words.slice(startIdx, startIdx + chunkSize);

        let totalTextWidth = 0;
        ctx.font = '900 24px "Inter", Impact, sans-serif';
        const wordMetrics = visibleWords.map((w) => {
          const m = ctx.measureText(w.word.toUpperCase());
          totalTextWidth += m.width + 10;
          return { ...w, width: m.width };
        });

        let currentX = (w - totalTextWidth) / 2;

        visibleWords.forEach((wordObj, i) => {
          const globalIdx = startIdx + i;
          const isWordActive = globalIdx === activeWordIndex;
          const isHighlighted = wordObj.highlight || isWordActive;

          ctx.save();
          // Scale bounce if active word
          if (isWordActive) {
            ctx.translate(currentX + wordObj.word.length * 5, captionY);
            ctx.scale(1.15, 1.15);
            ctx.translate(-(currentX + wordObj.word.length * 5), -captionY);
          }

          // Dark stroke / drop shadow
          ctx.font = '900 25px "Inter", Impact, sans-serif';
          ctx.strokeStyle = '#000000';
          ctx.lineWidth = 6;
          ctx.lineJoin = 'miter';
          ctx.strokeText(wordObj.word.toUpperCase(), currentX, captionY);

          // Kinetic color highlight
          if (captionTheme === 'hormozi') {
            ctx.fillStyle = isHighlighted ? '#facc15' : '#ffffff'; // Neon Hormozi Yellow
          } else if (captionTheme === 'toxic') {
            ctx.fillStyle = isHighlighted ? '#4ade80' : '#ffffff'; // Toxic Neon Green
          } else if (captionTheme === 'cyber') {
            ctx.fillStyle = isHighlighted ? '#22d3ee' : '#ffffff'; // Cyber Cyan
          } else {
            ctx.fillStyle = isHighlighted ? '#f43f5e' : '#ffffff'; // Hot Rose
          }

          ctx.fillText(wordObj.word.toUpperCase(), currentX, captionY);
          ctx.restore();

          currentX += ctx.measureText(wordObj.word.toUpperCase()).width + 10;
        });
      }

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [currentScene, activeWordIndex, captionTheme]);

  // Handle Play/Pause
  const togglePlay = () => {
    if (isPlaying) {
      pausePlayback();
    } else {
      startPlayback();
    }
  };

  const startPlayback = () => {
    setIsPlaying(true);
    startTimeRef.current = Date.now() - currentTimeSec * 1000;

    // Start background music
    if (isMusicEnabled) {
      audioSynthesizer.setMusicVolume(musicVolume);
      audioSynthesizer.startBackgroundMusic(selectedMusicMood);
    }

    // Play narration of current scene
    playCurrentSceneAudio();
  };

  const pausePlayback = () => {
    setIsPlaying(false);
    audioSynthesizer.stopBackgroundMusic();
    SpeechEngine.stop();
  };

  const playCurrentSceneAudio = () => {
    if (!isVoiceEnabled || !currentScene) return;

    // Trigger scene change whoosh
    audioSynthesizer.playWhoosh();

    const words = currentScene.words || [];
    SpeechEngine.speak(currentScene.narration, {
      rate: speechRate,
      voiceIndex: selectedVoiceIndex,
      onWord: (charIdx) => {
        // Approximate which word index is being spoken
        const wordsSoFar = currentScene.narration.slice(0, charIdx).trim().split(/\s+/).length;
        setActiveWordIndex(Math.min(wordsSoFar, words.length - 1));
      },
      onEnd: () => {
        // Automatically progress to next scene
        if (currentSceneIndex < scenes.length - 1) {
          audioSynthesizer.playDing();
          setCurrentSceneIndex((prev) => prev + 1);
          setActiveWordIndex(0);
        } else {
          // Loop or stop
          setIsPlaying(false);
          audioSynthesizer.stopBackgroundMusic();
        }
      },
    });
  };

  // Watch scene transitions during playback
  useEffect(() => {
    if (isPlaying) {
      playCurrentSceneAudio();
    }
  }, [currentSceneIndex]);

  // Timeline scrubber update loop
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      if (elapsed >= totalDuration) {
        setCurrentTimeSec(totalDuration);
        pausePlayback();
      } else {
        setCurrentTimeSec(elapsed);

        // Detect which scene we are in based on elapsed
        for (let i = scenes.length - 1; i >= 0; i--) {
          if (elapsed >= sceneStartTimes[i]) {
            if (currentSceneIndex !== i) {
              setCurrentSceneIndex(i);
              setActiveWordIndex(0);
            }
            break;
          }
        }
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying, totalDuration, sceneStartTimes, currentSceneIndex]);

  // Manual scene jump
  const jumpToScene = (idx: number) => {
    setCurrentSceneIndex(idx);
    setActiveWordIndex(0);
    setCurrentTimeSec(sceneStartTimes[idx] || 0);
    if (isPlaying) {
      SpeechEngine.stop();
      playCurrentSceneAudio();
    }
  };

  // Export 9:16 video directly
  const handleExportVideo = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsExporting(true);
    setExportProgress(10);

    // Start recorder
    recorderRef.current.startRecording(canvas);

    // Play all scenes sequentially
    jumpToScene(0);
    startPlayback();

    // Progress updates
    const progressInterval = setInterval(() => {
      setExportProgress((prev) => Math.min(prev + 15, 95));
    }, 1500);

    // Wait for full video duration
    setTimeout(async () => {
      clearInterval(progressInterval);
      pausePlayback();
      const blob = await recorderRef.current.stopRecording();
      setExportProgress(100);
      setIsExporting(false);

      if (blob) {
        VideoCanvasRecorder.downloadBlob(
          blob,
          `${videoPackage.title.replace(/[^a-zA-Z0-9]/g, '_')}_ShortsPilot.webm`
        );
      }
    }, (totalDuration + 1) * 1000);
  };

  const copyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Top Header / Quick Topic Generation Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 to-purple-600 flex items-center justify-center shrink-0 shadow-md shadow-red-600/20">
            <Wand2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-white">
                ShortsPilot Video Generator &amp; Editor
              </h2>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full flex items-center gap-1">
                <Flame className="w-3 h-3 text-red-500" /> Viral Potential: {videoPackage.estimatedViralPotential}/100
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Kinetic Subtitles &bull; Procedural Phonk Audio &bull; Direct YouTube &amp; TikTok Publisher
            </p>
          </div>
        </div>

        {/* Custom AI prompt input */}
        <div className="flex items-center gap-2 flex-1 max-w-xl">
          <div className="relative flex-1">
            <input
              type="text"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && customPrompt.trim()) {
                  onGenerateNewTopic(customPrompt);
                  setCustomPrompt('');
                }
              }}
              placeholder="E.g. 3 Dark Psychology Tricks to Read Anyone..."
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>
          <button
            onClick={() => {
              if (customPrompt.trim()) {
                onGenerateNewTopic(customPrompt);
                setCustomPrompt('');
              }
            }}
            disabled={isGenerating || !customPrompt.trim()}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-500 hover:to-purple-500 text-white shrink-0 shadow-md shadow-red-600/20 disabled:opacity-50 transition-all"
          >
            {isGenerating ? 'Cooking...' : 'Generate AI Short'}
          </button>
        </div>
      </div>

      {/* Main Studio Grid: Left 9:16 Player + Right Studio Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: 9:16 Vertical Video Player (Cols 5 on desktop) */}
        <div className="lg:col-span-5 flex flex-col items-center w-full">
          {/* Phone Frame Container */}
          <div className="relative w-full max-w-[280px] sm:max-w-[320px] md:max-w-[350px] aspect-[9/16] bg-slate-950 rounded-[34px] sm:rounded-[38px] p-2 sm:p-2.5 shadow-2xl shadow-purple-950/40 border-4 border-slate-800">
            {/* Phone Speaker Notch */}
            <div className="absolute top-3 sm:top-4 left-1/2 -translate-x-1/2 w-24 sm:w-28 h-3.5 sm:h-4 bg-slate-900 rounded-full z-30 flex items-center justify-center">
              <div className="w-7 sm:w-8 h-1 bg-slate-700 rounded-full" />
              <div className="w-2 sm:w-2.5 h-2 sm:h-2.5 bg-slate-800 rounded-full ml-2 sm:ml-3 border border-slate-700" />
            </div>

            {/* Canvas Video Viewport */}
            <div className="relative w-full h-full rounded-[26px] sm:rounded-[30px] overflow-hidden bg-black">
              <canvas
                ref={canvasRef}
                width={360}
                height={640}
                className="w-full h-full object-cover"
              />

              {/* TikTok / Shorts HUD Overlay */}
              <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-3 sm:p-4 z-20">
                {/* Top Channel Bar */}
                <div className="flex items-center justify-between pt-5 sm:pt-6">
                  <div className="flex items-center gap-1.5 sm:gap-2 pointer-events-auto bg-black/40 backdrop-blur-md px-2 sm:px-2.5 py-1 rounded-full border border-white/10">
                    <div className="w-4 sm:w-5 h-4 sm:h-5 rounded-full bg-gradient-to-tr from-red-500 to-purple-600 flex items-center justify-center text-[9px] sm:text-[10px] font-bold text-white">
                      SP
                    </div>
                    <span className="text-[10px] sm:text-[11px] font-bold text-white truncate max-w-[100px] sm:max-w-none">@ShortsPilotAI</span>
                    <span className="text-[9px] sm:text-[10px] bg-red-600 text-white font-bold px-1 sm:px-1.5 rounded-full">
                      +
                    </span>
                  </div>

                  <span className="text-[9px] sm:text-[10px] font-mono bg-black/50 text-emerald-400 px-1.5 sm:px-2 py-0.5 rounded-full border border-emerald-500/30">
                    9:16 HD
                  </span>
                </div>

                {/* Right Engagement Sidebar (Shorts / TikTok style) */}
                <div className="self-end flex flex-col items-center gap-2.5 sm:gap-3.5 pb-12 sm:pb-16 pointer-events-auto">
                  {/* Like Button */}
                  <button
                    onClick={() => {
                      setIsLiked(!isLiked);
                      setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));
                    }}
                    className="flex flex-col items-center gap-0.5 sm:gap-1 group"
                  >
                    <div
                      className={`w-9 sm:w-10 h-9 sm:h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center transition-transform group-hover:scale-110 ${
                        isLiked ? 'text-red-500 fill-red-500' : 'text-white'
                      }`}
                    >
                      <Heart className={`w-4 sm:w-5 h-4 sm:h-5 ${isLiked ? 'fill-red-500' : ''}`} />
                    </div>
                    <span className="text-[9px] sm:text-[10px] font-bold text-white drop-shadow">
                      {(likesCount / 1000).toFixed(1)}K
                    </span>
                  </button>

                  {/* Comment */}
                  <div className="flex flex-col items-center gap-0.5 sm:gap-1">
                    <div className="w-9 sm:w-10 h-9 sm:h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center text-white">
                      <MessageCircle className="w-4 sm:w-5 h-4 sm:h-5" />
                    </div>
                    <span className="text-[9px] sm:text-[10px] font-bold text-white drop-shadow">2.4K</span>
                  </div>

                  {/* Bookmark */}
                  <div className="flex flex-col items-center gap-0.5 sm:gap-1">
                    <div className="w-9 sm:w-10 h-9 sm:h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center text-white">
                      <Bookmark className="w-4 sm:w-5 h-4 sm:h-5" />
                    </div>
                    <span className="text-[9px] sm:text-[10px] font-bold text-white drop-shadow">45K</span>
                  </div>

                  {/* Share */}
                  <button
                    onClick={onOpenPublishModal}
                    className="flex flex-col items-center gap-0.5 sm:gap-1 group"
                  >
                    <div className="w-9 sm:w-10 h-9 sm:h-10 rounded-full bg-gradient-to-tr from-red-600 to-purple-600 border border-white/30 flex items-center justify-center text-white shadow-lg shadow-purple-600/40 group-hover:scale-110 transition-transform">
                      <Share className="w-4 sm:w-5 h-4 sm:h-5" />
                    </div>
                    <span className="text-[9px] sm:text-[10px] font-bold text-white drop-shadow">Share</span>
                  </button>
                </div>

                {/* Bottom Sound Pill */}
                <div className="flex items-center gap-1.5 sm:gap-2 bg-black/50 backdrop-blur-md px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full border border-white/10 max-w-[200px] sm:max-w-[240px]">
                  <Music className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-cyan-400 animate-spin shrink-0" />
                  <span className="text-[9px] sm:text-[10px] text-slate-200 truncate font-medium">
                    ♬ {selectedMusicMood} &bull; ShortsPilot Original
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Video Player Controls Bar */}
          <div className="w-full max-w-[280px] sm:max-w-[320px] md:max-w-[350px] mt-3 sm:mt-4 bg-slate-900 border border-slate-800 rounded-2xl p-3 sm:p-3.5 space-y-3">
            {/* Scrubber Timeline (Touch & Click Support) */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span>{formatTime(currentTimeSec)}</span>
                <span className="text-purple-400 font-semibold">
                  Scene {currentSceneIndex + 1} of {scenes.length}
                </span>
                <span>{formatTime(totalDuration)}</span>
              </div>
              <div
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
                  setCurrentTimeSec(pos * totalDuration);
                }}
                onTouchStart={(e) => {
                  const touch = e.touches[0];
                  const rect = e.currentTarget.getBoundingClientRect();
                  const pos = Math.max(0, Math.min(1, (touch.clientX - rect.left) / rect.width));
                  setCurrentTimeSec(pos * totalDuration);
                }}
                onTouchMove={(e) => {
                  const touch = e.touches[0];
                  const rect = e.currentTarget.getBoundingClientRect();
                  const pos = Math.max(0, Math.min(1, (touch.clientX - rect.left) / rect.width));
                  setCurrentTimeSec(pos * totalDuration);
                }}
                className="w-full h-3 sm:h-2 bg-slate-800 rounded-full overflow-hidden cursor-pointer relative group touch-none"
              >
                <div
                  className="h-full bg-gradient-to-r from-red-500 via-purple-500 to-cyan-400 transition-all"
                  style={{ width: `${(currentTimeSec / (totalDuration || 1)) * 100}%` }}
                />
              </div>
            </div>

            {/* Scene Markers */}
            <div className="flex gap-1">
              {scenes.map((s, idx) => (
                <button
                  key={s.sceneId || idx}
                  onClick={() => jumpToScene(idx)}
                  className={`flex-1 py-1 rounded text-[10px] font-mono font-bold transition-all ${
                    currentSceneIndex === idx
                      ? 'bg-purple-600 text-white shadow'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  S{idx + 1}
                </button>
              ))}
            </div>

            {/* Play, Rewind, Sound buttons */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => jumpToScene(0)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                  title="Rewind to start"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={togglePlay}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-500 hover:to-purple-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-red-600/30 transition-all active:scale-95"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-4 h-4" />
                      <span>Pause</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-white" />
                      <span>Preview</span>
                    </>
                  )}
                </button>
              </div>

              {/* Music mute & volume quick toggle */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const next = !isMusicEnabled;
                    setIsMusicEnabled(next);
                    if (!next) audioSynthesizer.stopBackgroundMusic();
                    else if (isPlaying) audioSynthesizer.startBackgroundMusic(selectedMusicMood);
                  }}
                  className={`p-2 rounded-xl border transition-colors ${
                    isMusicEnabled
                      ? 'bg-purple-950/60 text-purple-300 border-purple-700/50'
                      : 'bg-slate-800 text-slate-500 border-slate-700'
                  }`}
                  title="Toggle background phonk/lo-fi beat"
                >
                  {isMusicEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Quick Action Buttons: Download & Publish */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={handleExportVideo}
                disabled={isExporting}
                className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 border border-slate-700 transition-all disabled:opacity-50"
              >
                {isExporting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
                    <span>{exportProgress}%</span>
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Download 9:16</span>
                  </>
                )}
              </button>

              <button
                onClick={onOpenPublishModal}
                className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-red-600 via-purple-600 to-cyan-500 hover:opacity-95 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-lg shadow-purple-600/30 transition-all hover:scale-[1.02]"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>1-Click Publish</span>
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Studio Inspector & Video Controls (Cols 7 on desktop) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          {/* Tabs Header */}
          <div className="flex border-b border-slate-800 bg-slate-950/60 p-2 gap-1 overflow-x-auto">
            {[
              { id: 'script', label: 'Scene Script', icon: Layers },
              { id: 'seo', label: 'Viral SEO & Tags', icon: Hash },
              { id: 'audio', label: 'Audio & Voiceover', icon: Mic },
              { id: 'style', label: 'Captions & Theme', icon: Palette },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeInspectorTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveInspectorTab(tab.id as any)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 ${
                    isActive
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="p-5">
            {/* TAB 1: SCENE SCRIPT & STORYBOARD */}
            {activeInspectorTab === 'script' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div>
                    <h3 className="text-sm font-bold text-white">
                      Scene-by-Scene Viral Storyboard
                    </h3>
                    <p className="text-xs text-slate-400">
                      Total scenes: {scenes.length} &bull; Word-by-word synced Alex Hormozi captions
                    </p>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-2 py-1 rounded-lg">
                    ~{totalDuration}s Total Runtime
                  </span>
                </div>

                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                  {scenes.map((sc, idx) => {
                    const isSelected = currentSceneIndex === idx;
                    return (
                      <div
                        key={sc.sceneId || idx}
                        onClick={() => jumpToScene(idx)}
                        className={`p-4 rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'border-purple-500 bg-purple-950/20 shadow-md shadow-purple-500/10'
                            : 'border-slate-800 bg-slate-950/50 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span
                              className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold font-mono ${
                                isSelected ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-400'
                              }`}
                            >
                              {idx + 1}
                            </span>
                            <span className="text-xs font-bold text-white">
                              {sc.badge || `Scene ${idx + 1}`}
                            </span>
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                              {sc.durationSec}s
                            </span>
                          </div>

                          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-slate-800 text-purple-300 border border-purple-800/30">
                            {sc.themeStyle}
                          </span>
                        </div>

                        {/* Narration line */}
                        <div className="text-xs text-slate-200 bg-slate-900/80 p-2.5 rounded-lg border border-slate-800/80 leading-relaxed font-medium">
                          {sc.narration}
                        </div>

                        {/* Visual imagery prompt */}
                        <div className="mt-2 text-[11px] text-slate-400 flex items-center gap-1.5">
                          <span className="text-purple-400 font-semibold shrink-0">Visual:</span>
                          <span className="truncate">{sc.visualPrompt}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 2: SEO KEYWORDS & HASHTAGS */}
            {activeInspectorTab === 'seo' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-cyan-400" />
                      Algorithmic SEO &amp; Maximum Reach Optimizer
                    </h3>
                    <p className="text-xs text-slate-400">
                      Auto-calculated tags to trigger the YouTube Shorts shelf &amp; TikTok FYP algorithm
                    </p>
                  </div>
                </div>

                {/* Viral Title */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-slate-300">
                      Viral Click-Through Title
                    </span>
                    <button
                      onClick={() => copyText(videoPackage.title, 'title')}
                      className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1"
                    >
                      {copiedKey === 'title' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      Copy Title
                    </button>
                  </div>
                  <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-xs font-bold text-white">
                    {videoPackage.title}
                  </div>
                </div>

                {/* Trending Hashtags */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                      <Hash className="w-3.5 h-3.5 text-cyan-400" />
                      Trending Hashtags ({videoPackage.trendingHashtags.length})
                    </span>
                    <button
                      onClick={() => copyText(videoPackage.trendingHashtags.join(' '), 'tags')}
                      className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1"
                    >
                      {copiedKey === 'tags' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      Copy All Tags
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5 p-3 bg-slate-950 rounded-xl border border-slate-800">
                    {videoPackage.trendingHashtags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 text-xs font-mono font-medium bg-cyan-950/60 text-cyan-300 border border-cyan-800/50 rounded-lg hover:border-cyan-400 transition-colors"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* High Search Volume SEO Keywords */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                      <Search className="w-3.5 h-3.5 text-purple-400" />
                      High Search Volume Keywords ({videoPackage.seoKeywords.length})
                    </span>
                    <button
                      onClick={() => copyText(videoPackage.seoKeywords.join(', '), 'keywords')}
                      className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1"
                    >
                      {copiedKey === 'keywords' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      Copy Keywords
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5 p-3 bg-slate-950 rounded-xl border border-slate-800">
                    {videoPackage.seoKeywords.map((kw, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 text-xs bg-purple-950/60 text-purple-300 border border-purple-800/50 rounded-lg"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>

                {/* YouTube & TikTok Ready Descriptions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] font-bold text-red-400 uppercase">
                        YouTube Shorts Description
                      </span>
                      <button
                        onClick={() => copyText(videoPackage.youtubeDescription, 'yt-desc')}
                        className="text-[11px] text-slate-400 hover:text-white"
                      >
                        {copiedKey === 'yt-desc' ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-300 line-clamp-3">
                      {videoPackage.youtubeDescription}
                    </p>
                  </div>

                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] font-bold text-cyan-400 uppercase">
                        TikTok Caption &amp; Hook
                      </span>
                      <button
                        onClick={() => copyText(videoPackage.tiktokCaption, 'tt-desc')}
                        className="text-[11px] text-slate-400 hover:text-white"
                      >
                        {copiedKey === 'tt-desc' ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-300 line-clamp-3">
                      {videoPackage.tiktokCaption}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: AUDIO & VOICEOVER MIXER */}
            {activeInspectorTab === 'audio' && (
              <div className="space-y-4">
                <div className="pb-3 border-b border-slate-800">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-purple-400" />
                    AI Voiceover &amp; Procedural Background Audio
                  </h3>
                  <p className="text-xs text-slate-400">
                    Adjust narration cadence, voice persona, and royalty-free music mix
                  </p>
                </div>

                {/* Voice narration settings */}
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Mic className="w-4 h-4 text-red-500" /> AI Speech Narrator
                    </span>
                    <input
                      type="checkbox"
                      checked={isVoiceEnabled}
                      onChange={(e) => setIsVoiceEnabled(e.target.checked)}
                      className="w-4 h-4 accent-purple-600 rounded"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="text-slate-400 block mb-1">Narrator Persona</label>
                      <select
                        value={selectedVoiceIndex}
                        onChange={(e) => setSelectedVoiceIndex(Number(e.target.value))}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white text-xs focus:outline-none"
                      >
                        <option value={0}>Kore (Enthusiastic High-Energy)</option>
                        <option value={1}>Puck (Fast-Paced Tech Explainer)</option>
                        <option value={2}>Fenrir (Deep Cinematic Narrator)</option>
                        <option value={3}>Zephyr (Crisp Viral Podcaster)</option>
                      </select>
                    </div>

                    <div>
                      <div className="flex justify-between text-slate-400 mb-1">
                        <span>Pacing (Rate)</span>
                        <span className="text-purple-400 font-mono font-bold">{speechRate}x</span>
                      </div>
                      <input
                        type="range"
                        min="0.9"
                        max="1.5"
                        step="0.05"
                        value={speechRate}
                        onChange={(e) => setSpeechRate(Number(e.target.value))}
                        className="w-full accent-purple-600"
                      />
                    </div>
                  </div>
                </div>

                {/* Background Beat & Synth */}
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Music className="w-4 h-4 text-cyan-400" /> Procedural Background Track (Royalty-Free)
                    </span>
                    <input
                      type="checkbox"
                      checked={isMusicEnabled}
                      onChange={(e) => {
                        setIsMusicEnabled(e.target.checked);
                        if (!e.target.checked) audioSynthesizer.stopBackgroundMusic();
                      }}
                      className="w-4 h-4 accent-cyan-500 rounded"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="text-slate-400 block mb-1">Track Style</label>
                      <select
                        value={selectedMusicMood}
                        onChange={(e) => {
                          setSelectedMusicMood(e.target.value);
                          if (isPlaying && isMusicEnabled) {
                            audioSynthesizer.stopBackgroundMusic();
                            audioSynthesizer.startBackgroundMusic(e.target.value);
                          }
                        }}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white text-xs focus:outline-none"
                      >
                        <option value="Phonk Fast Drift">Phonk Fast Drift (130 BPM)</option>
                        <option value="Lo-Fi Chill Beat">Lo-Fi Chill Beat (90 BPM)</option>
                        <option value="Suspense Dramatic Bass">Suspense Dramatic Bass</option>
                        <option value="Cyber Synthwave">Cyber Synthwave (120 BPM)</option>
                      </select>
                    </div>

                    <div>
                      <div className="flex justify-between text-slate-400 mb-1">
                        <span>Music Volume</span>
                        <span className="text-cyan-400 font-mono font-bold">
                          {Math.round(musicVolume * 100)}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="0.8"
                        step="0.05"
                        value={musicVolume}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setMusicVolume(val);
                          audioSynthesizer.setMusicVolume(val);
                        }}
                        className="w-full accent-cyan-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: CAPTIONS & VISUAL THEMES */}
            {activeInspectorTab === 'style' && (
              <div className="space-y-4">
                <div className="pb-3 border-b border-slate-800">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Palette className="w-4 h-4 text-purple-400" />
                    Kinetic Subtitle &amp; Visual Theme Preset
                  </h3>
                  <p className="text-xs text-slate-400">
                    Alex Hormozi style animated text colors &amp; scene rendering presets
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { id: 'hormozi', name: 'Alex Hormozi', color: '#facc15', desc: 'Neon Yellow Highlight' },
                    { id: 'toxic', name: 'Toxic Green', color: '#4ade80', desc: 'Cyber Green Pop' },
                    { id: 'cyber', name: 'Cyber Cyan', color: '#22d3ee', desc: 'Electric Blue' },
                    { id: 'neon', name: 'Hot Pink', color: '#f43f5e', desc: 'Punchy Glow' },
                  ].map((st) => (
                    <button
                      key={st.id}
                      onClick={() => setCaptionTheme(st.id as any)}
                      className={`p-3 rounded-xl border flex flex-col items-center gap-2 text-center transition-all ${
                        captionTheme === st.id
                          ? 'border-purple-500 bg-purple-950/40 shadow-lg shadow-purple-500/20'
                          : 'border-slate-800 bg-slate-950/50 hover:border-slate-700'
                      }`}
                    >
                      <div
                        className="w-8 h-8 rounded-full border-2 border-white/40 flex items-center justify-center font-black text-xs"
                        style={{ backgroundColor: st.color, color: '#000000' }}
                      >
                        Aa
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">{st.name}</div>
                        <div className="text-[10px] text-slate-400">{st.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
