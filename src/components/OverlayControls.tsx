import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlayCircle, PauseCircle, RotateCcw, Eye, Lightbulb, Contrast, Focus } from 'lucide-react';
import { VideoPlayerRef } from '@/components/VideoPlayer';
import { useState } from 'react';

interface OverlayControlsProps {
  overlayOpacity: number;
  setOverlayOpacity: (value: number) => void;
  overlayBrightness: number;
  setOverlayBrightness: (value: number) => void;
  overlayContrast: number;
  setOverlayContrast: (value: number) => void;
  overlayBlur: number;
  setOverlayBlur: (value: number) => void;
  overlayVideo: 'video1' | 'video2';
  setOverlayVideo: (value: 'video1' | 'video2') => void;
  video1Ref: React.RefObject<VideoPlayerRef>;
  video2Ref: React.RefObject<VideoPlayerRef>;
}

export default function OverlayControls({
  overlayOpacity,
  setOverlayOpacity,
  overlayBrightness,
  setOverlayBrightness,
  overlayContrast,
  setOverlayContrast,
  overlayBlur,
  setOverlayBlur,
  overlayVideo,
  setOverlayVideo,
  video1Ref,
  video2Ref
}: OverlayControlsProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayBoth = () => {
    video1Ref.current?.play();
    video2Ref.current?.play();
    setIsPlaying(true);
  };

  const handlePauseBoth = () => {
    video1Ref.current?.pause();
    video2Ref.current?.pause();
    setIsPlaying(false);
  };

  const handleSyncBoth = () => {
    const video1StartOffset = video1Ref.current?.getStartOffset() || 0;
    const video2StartOffset = video2Ref.current?.getStartOffset() || 0;
    
    video1Ref.current?.setCurrentTime(video1StartOffset);
    video2Ref.current?.setCurrentTime(video2StartOffset);
    
    setTimeout(() => {
      video1Ref.current?.play();
      video2Ref.current?.play();
      setIsPlaying(true);
    }, 100);
  };

  return (
    <Card className="p-6 bg-gradient-carbon border-border shadow-elegant">
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-xl font-bold bg-gradient-f1 bg-clip-text text-transparent mb-2">
            Controlli Sovraimpressione
          </h3>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center justify-center gap-4">
          <Button
            onClick={isPlaying ? handlePauseBoth : handlePlayBoth}
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
            onClick={handleSyncBoth}
            variant="secondary"
            size="lg"
            className="px-8"
          >
            <RotateCcw className="mr-2 h-5 w-5" />
            Sync
          </Button>
        </div>

        {/* Video Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-f1-silver flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Video in sovraimpressione
          </label>
          <Select value={overlayVideo} onValueChange={setOverlayVideo}>
            <SelectTrigger className="bg-muted/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="video1">Video 1 - Giro A</SelectItem>
              <SelectItem value="video2">Video 2 - Giro B</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Visual Controls Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Opacity Control */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-f1-silver flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Opacità: {Math.round(overlayOpacity * 100)}%
            </label>
            <Slider
              value={[overlayOpacity]}
              max={1}
              min={0}
              step={0.01}
              onValueChange={(value) => setOverlayOpacity(value[0])}
              className="w-full"
            />
          </div>

          {/* Brightness Control */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-f1-silver flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              Luminosità: {Math.round(overlayBrightness * 100)}%
            </label>
            <Slider
              value={[overlayBrightness]}
              max={2}
              min={0}
              step={0.01}
              onValueChange={(value) => setOverlayBrightness(value[0])}
              className="w-full"
            />
          </div>

          {/* Contrast Control */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-f1-silver flex items-center gap-2">
              <Contrast className="h-4 w-4" />
              Contrasto: {Math.round(overlayContrast * 100)}%
            </label>
            <Slider
              value={[overlayContrast]}
              max={2}
              min={0}
              step={0.01}
              onValueChange={(value) => setOverlayContrast(value[0])}
              className="w-full"
            />
          </div>

          {/* Blur Control */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-f1-silver flex items-center gap-2">
              <Focus className="h-4 w-4" />
              Sfocatura: {overlayBlur}px
            </label>
            <Slider
              value={[overlayBlur]}
              max={10}
              min={0}
              step={0.1}
              onValueChange={(value) => setOverlayBlur(value[0])}
              className="w-full"
            />
          </div>
        </div>

        <p className="text-sm text-muted-foreground text-center">
          Regola i parametri visivi per ottimizzare il confronto tra i video sovrapposti
        </p>
      </div>
    </Card>
  );
}