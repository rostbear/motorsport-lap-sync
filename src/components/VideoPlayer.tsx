import React, { forwardRef, useImperativeHandle, useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Upload, 
  Trash2, 
  Volume2, 
  VolumeX,
  Flag
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface VideoPlayerRef {
  play: () => void;
  pause: () => void;
  setCurrentTime: (time: number) => void;
  getCurrentTime: () => number;
  setPlaybackRate: (rate: number) => void;
  getPlaybackRate: () => number;
  stepFrame: (direction: 'forward' | 'backward') => void;
  getVideoUrl: () => string | null;
  getStartOffset: () => number;
  getDuration: () => number;
  clearVideo: () => void;
  setKeyframe1: () => void;
  setKeyframe2: () => void;
  getKeyframe1: () => number | null;
  getKeyframe2: () => number | null;
  getKeyframe1Absolute: () => number | null;
  getKeyframe2Absolute: () => number | null;
  getKeyframeDelta: () => number | null;
  clearKeyframes: () => void;
  getPlayerName: () => string;
  isNameValid: () => boolean;
}

interface VideoPlayerProps {
  title: string;
  className?: string;
  onVideoLoad?: (duration: number) => void;
  onTimeUpdate?: (currentTime: number) => void;
}

const VideoPlayer = forwardRef<VideoPlayerRef, VideoPlayerProps>(({ title, className, onVideoLoad, onTimeUpdate }, ref) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [startOffset, setStartOffset] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [keyframe1, setKeyframe1State] = useState<number | null>(null);
  const [keyframe2, setKeyframe2State] = useState<number | null>(null);
  const [playerName, setPlayerName] = useState('');

  // Remove name validation - names are now optional

  useImperativeHandle(ref, () => ({
    play: () => {
      if (videoRef.current) {
        videoRef.current.play();
        setIsPlaying(true);
      }
    },
    pause: () => {
      if (videoRef.current) {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    },
    setCurrentTime: (time: number) => {
      if (videoRef.current) {
        videoRef.current.currentTime = time;
        setCurrentTime(time);
      }
    },
    getCurrentTime: () => currentTime,
    setPlaybackRate: (rate: number) => {
      if (videoRef.current) {
        videoRef.current.playbackRate = rate;
        setPlaybackRate(rate);
      }
    },
    getPlaybackRate: () => playbackRate,
    stepFrame: (direction: 'forward' | 'backward') => {
      if (videoRef.current) {
        const frameTime = 1 / 30; // Assuming 30fps
        const newTime = direction === 'forward' 
          ? currentTime + frameTime 
          : currentTime - frameTime;
        setCurrentTime(Math.max(0, Math.min(newTime, duration)));
        videoRef.current.currentTime = Math.max(0, Math.min(newTime, duration));
      }
    },
    getVideoUrl: () => videoUrl,
    getStartOffset: () => startOffset,
    getDuration: () => duration,
    clearVideo: () => {
      setVideoUrl(null);
      setCurrentTime(0);
      setDuration(0);
      setStartOffset(0);
      setKeyframe1State(null);
      setKeyframe2State(null);
      if (videoRef.current) {
        videoRef.current.src = '';
        videoRef.current.load();
      }
    },
    setKeyframe1: () => {
      setKeyframe1State(currentTime);
    },
    setKeyframe2: () => {
      setKeyframe2State(currentTime);
    },
    getKeyframe1: () => keyframe1,
    getKeyframe2: () => keyframe2,
    getKeyframe1Absolute: () => {
      if (keyframe1 === null) return null;
      return keyframe1;
    },
    getKeyframe2Absolute: () => {
      if (keyframe2 === null) return null;
      return keyframe2;
    },
    getKeyframeDelta: () => {
      if (keyframe1 === null || keyframe2 === null) return null;
      return keyframe2 - keyframe1;
    },
    clearKeyframes: () => {
      setKeyframe1State(null);
      setKeyframe2State(null);
    },
    getPlayerName: () => playerName,
    isNameValid: () => true // Always true as name is no longer mandatory
  }));

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setVideoUrl(url);
      if (videoRef.current) {
        videoRef.current.src = url;
        videoRef.current.load();
      }
    }
  };

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      onTimeUpdate?.(videoRef.current.currentTime);
    }
  };

  const handleLoadedData = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      onVideoLoad?.(videoRef.current.duration);
    }
  };

  const handleStartOffsetChange = (value: number[]) => {
    const newOffset = value[0];
    setStartOffset(newOffset);
    if (videoRef.current && currentTime < newOffset) {
      setCurrentTime(newOffset);
      videoRef.current.currentTime = newOffset;
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      if (newVolume === 0) {
        setIsMuted(true);
      } else if (isMuted) {
        setIsMuted(false);
      }
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
  };

  const handleSkipBack = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = startOffset;
      setCurrentTime(startOffset);
    }
  };

  const handleSkipForward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = duration;
      setCurrentTime(duration);
    }
  };

  const handleKeyframe1Set = () => {
    setKeyframe1State(currentTime);
  };

  const handleKeyframe2Set = () => {
    setKeyframe2State(currentTime);
  };

  const handleKeyframesClear = () => {
    setKeyframe1State(null);
    setKeyframe2State(null);
  };

  const getKeyframe1Absolute = () => {
    if (keyframe1 === null) return null;
    return keyframe1;
  };

  const getKeyframe2Absolute = () => {
    if (keyframe2 === null) return null;
    return keyframe2;
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    const milliseconds = Math.floor((time % 1) * 1000);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`;
  };

  return (
    <Card className={cn("p-6 bg-gradient-carbon border-border shadow-elegant relative", className)}>
      {/* Header Row - Name Input and Remove Button */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex-1 mr-4">
          <Input
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            onBlur={() => {}} // No longer validating name
            onKeyDown={(e) => {
              // No longer validating on Enter key
            }}
            className="text-lg font-semibold text-f1-gold bg-transparent border-f1-gold focus:border-f1-red"
            placeholder="Inserisci il nome del giocatore"
          />
        </div>
        
        {videoUrl && (
          <Button
            onClick={() => {
              if (videoRef.current) {
                setVideoUrl(null);
                setCurrentTime(0);
                setDuration(0);
                setStartOffset(0);
                setKeyframe1State(null);
                setKeyframe2State(null);
                videoRef.current.src = '';
                videoRef.current.load();
              }
            }}
            size="sm"
            variant="destructive"
            className="flex-shrink-0"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Rimuovi Video
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {/* File Upload */}
        {!videoUrl && (
          <div className="text-center">
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
              className="border-dashed border-2 h-24 w-full"
            >
              <Upload className="mr-2 h-6 w-6" />
              Carica file video
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        )}

        {/* Video Player */}
        {videoUrl && (
          <>
            <div className="relative bg-black rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                src={videoUrl}
                className="w-full h-64 object-contain"
                onLoadedData={handleLoadedData}
                onTimeUpdate={handleTimeUpdate}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />
            </div>

            {/* Keyframe Display - Only show buttons, no time info */}
            <div className="mb-4 p-3 bg-f1-dark rounded-lg border border-border">
              <div className="flex items-center justify-center gap-4">
                <Button
                  onClick={handleKeyframe1Set}
                  size="sm"
                  variant="outline"
                  className={`px-3 ${keyframe1 !== null ? 'bg-f1-red text-white' : ''}`}
                >
                  <Flag className="mr-2 h-4 w-4" />
                  Keyframe 1
                </Button>

                <Button
                  onClick={handleKeyframe2Set}
                  size="sm"
                  variant="outline"
                  className={`px-3 ${keyframe2 !== null ? 'bg-f1-gold text-white' : ''}`}
                >
                  <Flag className="mr-2 h-4 w-4" />
                  Keyframe 2
                </Button>

                {(keyframe1 !== null || keyframe2 !== null) && (
                  <Button
                    onClick={handleKeyframesClear}
                    size="sm"
                    variant="outline"
                    className="px-3 border-f1-red text-f1-red hover:bg-f1-red hover:text-white"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Clear
                  </Button>
                )}
              </div>
            </div>

            {/* Main Controls */}
            <div className="flex items-center justify-center gap-2">
              <Button
                onClick={handleSkipBack}
                size="sm"
                variant="secondary"
              >
                <SkipBack className="h-4 w-4" />
              </Button>

              <Button
                onClick={handlePlayPause}
                className="bg-gradient-f1 hover:opacity-90 shadow-f1"
              >
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              </Button>

              <Button
                onClick={handleSkipForward}
                size="sm"
                variant="secondary"
              >
                <SkipForward className="h-4 w-4" />
              </Button>
            </div>

            {/* Timeline */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
              <Slider
                value={[currentTime]}
                max={duration}
                step={0.1}
                onValueChange={(value) => {
                  if (videoRef.current) {
                    videoRef.current.currentTime = value[0];
                    setCurrentTime(value[0]);
                  }
                }}
                className="w-full"
              />
            </div>

            {/* Start Offset Control */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-f1-silver">
                  Punto di inizio: {formatTime(startOffset)}
                </label>
                <div className="flex gap-1">
                  <Button
                    onClick={() => {
                      const frameRate = 30; // Assume 30 fps
                      const frameTime = 1 / frameRate;
                      const newOffset = Math.max(startOffset - frameTime, 0);
                      setStartOffset(newOffset);
                      if (videoRef.current) {
                        videoRef.current.currentTime = newOffset;
                        setCurrentTime(newOffset);
                      }
                    }}
                    size="sm"
                    variant="outline"
                    className="h-6 w-6 p-0"
                  >
                    <SkipBack className="h-3 w-3" />
                  </Button>
                  <Button
                    onClick={() => {
                      const frameRate = 30; // Assume 30 fps
                      const frameTime = 1 / frameRate;
                      const newOffset = Math.min(startOffset + frameTime, duration);
                      setStartOffset(newOffset);
                      if (videoRef.current) {
                        videoRef.current.currentTime = newOffset;
                        setCurrentTime(newOffset);
                      }
                    }}
                    size="sm"
                    variant="outline"
                    className="h-6 w-6 p-0"
                  >
                    <SkipForward className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <Slider
                value={[startOffset]}
                max={duration}
                step={0.1}
                onValueChange={handleStartOffsetChange}
                className="w-full"
              />
            </div>

            {/* Audio Controls */}
            <div className="flex items-center gap-4">
              <Button
                onClick={toggleMute}
                size="sm"
                variant="outline"
                className="h-8 w-8 p-0"
              >
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>
              <div className="flex-1">
                <Slider
                  value={[isMuted ? 0 : volume]}
                  max={1}
                  min={0}
                  step={0.01}
                  onValueChange={handleVolumeChange}
                  className="w-full"
                />
              </div>
            </div>
          </>
        )}
      </div>
    </Card>
  );
});

VideoPlayer.displayName = 'VideoPlayer';

export default VideoPlayer;