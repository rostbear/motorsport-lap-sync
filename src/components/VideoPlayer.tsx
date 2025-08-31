import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Play, Pause, SkipBack, SkipForward, Upload, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VideoPlayerProps {
  title: string;
  className?: string;
  onVideoLoad?: (duration: number) => void;
  onTimeUpdate?: (currentTime: number) => void;
}

export interface VideoPlayerRef {
  play: () => void;
  pause: () => void;
  setCurrentTime: (time: number) => void;
  getCurrentTime: () => number;
  setPlaybackRate: (rate: number) => void;
  stepFrame: (direction: 'forward' | 'backward') => void;
  getVideoUrl: () => string;
  getStartOffset: () => number;
  clearVideo: () => void;
}

const VideoPlayer = forwardRef<VideoPlayerRef, VideoPlayerProps>(
  ({ title, className, onVideoLoad, onTimeUpdate }, ref) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [videoUrl, setVideoUrl] = useState<string>('');
    const [urlInput, setUrlInput] = useState('');
    const [startOffset, setStartOffset] = useState(0);

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
        }
      },
      stepFrame: (direction: 'forward' | 'backward') => {
        if (videoRef.current) {
          const frameRate = 30; // Assume 30 fps
          const frameTime = 1 / frameRate;
          const newTime = direction === 'forward' 
            ? Math.min(currentTime + frameTime, duration)
            : Math.max(currentTime - frameTime, 0);
          videoRef.current.currentTime = newTime;
          setCurrentTime(newTime);
        }
      },
      getVideoUrl: () => videoUrl,
      getStartOffset: () => startOffset,
      clearVideo: () => {
        setVideoUrl('');
        setUrlInput('');
        setCurrentTime(0);
        setStartOffset(0);
        setDuration(0);
        setIsPlaying(false);
      }
    }));

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        const url = URL.createObjectURL(file);
        setVideoUrl(url);
        setUrlInput('');
      }
    };

    const handleUrlLoad = () => {
      if (urlInput.trim()) {
        setVideoUrl(urlInput.trim());
        setUrlInput('');
      }
    };

    const handleLoadedData = () => {
      if (videoRef.current) {
        const videoDuration = videoRef.current.duration;
        setDuration(videoDuration);
        onVideoLoad?.(videoDuration);
      }
    };

    const handleTimeUpdate = () => {
      if (videoRef.current) {
        const time = videoRef.current.currentTime;
        setCurrentTime(time);
        onTimeUpdate?.(time);
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

    const handleSliderChange = (value: number[]) => {
      if (videoRef.current) {
        const time = value[0];
        videoRef.current.currentTime = time;
        setCurrentTime(time);
      }
    };

    const handleOffsetChange = (value: number[]) => {
      const offset = value[0];
      setStartOffset(offset);
      if (videoRef.current) {
        videoRef.current.currentTime = offset;
        setCurrentTime(offset);
      }
    };

    const formatTime = (time: number) => {
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60);
      const milliseconds = Math.floor((time % 1) * 1000);
      return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`;
    };

    return (
      <Card className={cn("p-6 bg-gradient-carbon border-border shadow-elegant", className)}>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-f1-gold">{title}</h3>
          
          {/* Upload Section */}
          {!videoUrl && (
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Inserisci URL video..."
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  className="bg-muted/50"
                />
                <Button onClick={handleUrlLoad} variant="secondary">
                  Carica URL
                </Button>
              </div>
              
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
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
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

              {/* Controls */}
              <div className="space-y-4">
                {/* Main Timeline */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                  <Slider
                    value={[currentTime]}
                    max={duration}
                    step={0.1}
                    onValueChange={handleSliderChange}
                    className="w-full"
                  />
                </div>

                {/* Start Offset Control */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-f1-silver">
                    Punto di inizio: {formatTime(startOffset)}
                  </label>
                  <Slider
                    value={[startOffset]}
                    max={duration}
                    step={0.1}
                    onValueChange={handleOffsetChange}
                    className="w-full"
                  />
                </div>

                {/* Control Buttons */}
                <div className="flex items-center justify-center gap-2">
                  <Button
                    onClick={() => ref && 'current' in ref && ref.current?.stepFrame('backward')}
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
                    onClick={() => ref && 'current' in ref && ref.current?.stepFrame('forward')}
                    size="sm"
                    variant="secondary"
                  >
                    <SkipForward className="h-4 w-4" />
                  </Button>

                  <Button
                    onClick={() => ref && 'current' in ref && ref.current?.clearVideo()}
                    size="sm"
                    variant="destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </Card>
    );
  }
);

VideoPlayer.displayName = 'VideoPlayer';

export default VideoPlayer;