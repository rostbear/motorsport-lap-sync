import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { PlayCircle, PauseCircle, RotateCcw, SkipBack, SkipForward, FastForward, Rewind } from 'lucide-react';
import { VideoPlayerRef } from '@/components/VideoPlayer';
import { useState } from 'react';

interface SyncControlsProps {
  onPlayBoth: () => void;
  onPauseBoth: () => void;
  onSyncBoth: () => void;
  isPlaying: boolean;
  video1Ref: React.RefObject<VideoPlayerRef>;
  video2Ref: React.RefObject<VideoPlayerRef>;
}

export default function SyncControls({ 
  onPlayBoth, 
  onPauseBoth, 
  onSyncBoth, 
  isPlaying, 
  video1Ref, 
  video2Ref 
}: SyncControlsProps) {
  
  const [currentSpeed, setCurrentSpeed] = useState(1.0);
  
  const handleJumpToStart = () => {
    // Jump both videos to their respective start offsets
    const video1StartOffset = video1Ref.current?.getStartOffset() || 0;
    const video2StartOffset = video2Ref.current?.getStartOffset() || 0;
    
    video1Ref.current?.setCurrentTime(video1StartOffset);
    video2Ref.current?.setCurrentTime(video2StartOffset);
  };

  const handleJumpToEnd = () => {
    // Jump both videos to their respective end positions
    if (video1Ref.current && video2Ref.current) {
      // Get the actual video durations
      const video1Duration = video1Ref.current.getDuration();
      const video2Duration = video2Ref.current.getDuration();
      
      video1Ref.current.setCurrentTime(video1Duration);
      video2Ref.current.setCurrentTime(video2Duration);
    }
  };

  const handleSpeedUp = () => {
    // Increase speed for both videos by 0.05
    const newSpeed = Math.min(currentSpeed + 0.05, 4);
    setCurrentSpeed(newSpeed);
    
    if (video1Ref.current && video2Ref.current) {
      video1Ref.current.setPlaybackRate(newSpeed);
      video2Ref.current.setPlaybackRate(newSpeed);
    }
  };

  const handleSpeedDown = () => {
    // Decrease speed for both videos by 0.05
    const newSpeed = Math.max(currentSpeed - 0.05, 0.05);
    setCurrentSpeed(newSpeed);
    
    if (video1Ref.current && video2Ref.current) {
      video1Ref.current.setPlaybackRate(newSpeed);
      video2Ref.current.setPlaybackRate(newSpeed);
    }
  };

  const handleResetSpeed = () => {
    // Reset speed to normal (1x) for both videos
    if (video1Ref.current && video2Ref.current) {
      video1Ref.current.setPlaybackRate(1);
      video2Ref.current.setPlaybackRate(1);
    }
  };

  // Get current speed for display
  const getCurrentSpeed = () => {
    return `${currentSpeed.toFixed(2)}x`;
  };

  return (
    <Card className="p-6 bg-gradient-carbon border-border shadow-elegant">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold bg-gradient-f1 bg-clip-text text-transparent">
          Controlli Sincronizzazione
        </h2>
        
        <div className="flex items-center justify-center gap-4">
          <Button
            onClick={handleJumpToStart}
            size="lg"
            variant="outline"
            className="px-6"
          >
            <SkipBack className="mr-2 h-5 w-5" />
            Inizio
          </Button>

          <Button
            onClick={() => {
              if (video1Ref.current && video2Ref.current) {
                const currentTime1 = video1Ref.current.getCurrentTime();
                const currentTime2 = video2Ref.current.getCurrentTime();
                video1Ref.current.setCurrentTime(Math.max(0, currentTime1 - 1));
                video2Ref.current.setCurrentTime(Math.max(0, currentTime2 - 1));
              }
            }}
            size="lg"
            variant="outline"
            className="px-4"
          >
            <SkipBack className="mr-2 h-5 w-5" />
            -1s
          </Button>

          <Button
            onClick={() => {
              if (isPlaying) {
                onPauseBoth();
              } else {
                onPlayBoth();
              }
            }}
            size="lg"
            className="bg-gradient-f1 hover:opacity-90 shadow-f1 px-8"
          >
            {isPlaying ? (
              <>
                <PauseCircle className="mr-2 h-6 w-6" />
                Pausa Entrambi
              </>
            ) : (
              <>
                <PlayCircle className="mr-2 h-6 w-6" />
                Play Entrambi
              </>
            )}
          </Button>

          <Button
            onClick={() => {
              if (video1Ref.current && video2Ref.current) {
                const currentTime1 = video1Ref.current.getCurrentTime();
                const currentTime2 = video2Ref.current.getCurrentTime();
                const duration1 = video1Ref.current.getDuration();
                const duration2 = video2Ref.current.getDuration();
                video1Ref.current.setCurrentTime(Math.min(duration1, currentTime1 + 1));
                video2Ref.current.setCurrentTime(Math.min(duration2, currentTime2 + 1));
              }
            }}
            size="lg"
            variant="outline"
            className="px-4"
          >
            <SkipForward className="mr-2 h-5 w-5" />
            +1s
          </Button>

          <Button
            onClick={handleJumpToEnd}
            size="lg"
            variant="outline"
            className="px-6"
          >
            <SkipForward className="mr-2 h-5 w-5" />
            Fine
          </Button>
        </div>

        {/* Speed Controls */}
        <div className="flex items-center justify-center gap-4">
          <Button
            onClick={handleSpeedDown}
            size="lg"
            variant="outline"
            className="px-6"
          >
            <Rewind className="mr-2 h-5 w-5" />
            Rallenta
          </Button>

          <div className="flex items-center justify-center px-6 py-2">
            <span className="text-lg font-semibold text-f1-gold">
              {getCurrentSpeed()}
            </span>
          </div>

          <Button
            onClick={handleSpeedUp}
            size="lg"
            variant="outline"
            className="px-6"
          >
            <FastForward className="mr-2 h-5 w-5" />
            Accelera
          </Button>
        </div>
        
      </div>
    </Card>
  );
}