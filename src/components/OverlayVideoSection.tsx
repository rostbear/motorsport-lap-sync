import { useState, useRef } from 'react';
import VideoPlayer, { VideoPlayerRef } from '@/components/VideoPlayer';
import OverlayControls from '@/components/OverlayControls';
import { Card } from '@/components/ui/card';

interface OverlayVideoSectionProps {
  video1Ref: React.RefObject<VideoPlayerRef>;
  video2Ref: React.RefObject<VideoPlayerRef>;
}

const OverlayVideoSection = ({ video1Ref, video2Ref }: OverlayVideoSectionProps) => {
  const [overlayOpacity, setOverlayOpacity] = useState(0.5);
  const [overlayBrightness, setOverlayBrightness] = useState(1);
  const [overlayContrast, setOverlayContrast] = useState(1);
  const [overlayBlur, setOverlayBlur] = useState(0);
  const [overlayVideo, setOverlayVideo] = useState<'video1' | 'video2'>('video2');

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold bg-gradient-f1 bg-clip-text text-transparent mb-2">
          Sovraimpressione Video
        </h2>
        <p className="text-f1-silver">
          Confronta i video sovrapposti per un'analisi dettagliata delle traiettorie
        </p>
      </div>

      {/* Overlay Video Display */}
      <Card className="p-6 bg-gradient-carbon border-border shadow-elegant">
        <div className="relative w-full max-w-4xl mx-auto">
          <div 
            className="relative bg-black rounded-lg overflow-hidden"
            style={{ aspectRatio: '16/9' }}
          >
            {/* Base video */}
            <div className="absolute inset-0">
              {(() => {
                const baseVideoRef = overlayVideo === 'video2' ? video1Ref : video2Ref;
                const baseVideoUrl = baseVideoRef.current?.getVideoUrl();
                return baseVideoUrl ? (
                  <video
                    src={baseVideoUrl}
                    className="w-full h-full object-contain"
                    muted
                    loop
                  />
                ) : (
                  <div className="w-full h-full bg-muted/20 flex items-center justify-center text-muted-foreground">
                    Video di base (Video {overlayVideo === 'video2' ? '1' : '2'}) - Nessun video caricato
                  </div>
                );
              })()}
            </div>
            
            {/* Overlay video */}
            <div 
              className="absolute inset-0"
              style={{
                opacity: overlayOpacity,
                filter: `brightness(${overlayBrightness}) contrast(${overlayContrast}) blur(${overlayBlur}px)`,
                mixBlendMode: 'normal'
              }}
            >
              {(() => {
                const overlayVideoRef = overlayVideo === 'video1' ? video1Ref : video2Ref;
                const overlayVideoUrl = overlayVideoRef.current?.getVideoUrl();
                return overlayVideoUrl ? (
                  <video
                    src={overlayVideoUrl}
                    className="w-full h-full object-contain"
                    muted
                    loop
                  />
                ) : (
                  <div className="w-full h-full bg-muted/30 flex items-center justify-center text-muted-foreground">
                    Video sovrapposto (Video {overlayVideo}) - Nessun video caricato
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      </Card>

      {/* Overlay Controls */}
      <OverlayControls
        overlayOpacity={overlayOpacity}
        setOverlayOpacity={setOverlayOpacity}
        overlayBrightness={overlayBrightness}
        setOverlayBrightness={setOverlayBrightness}
        overlayContrast={overlayContrast}
        setOverlayContrast={setOverlayContrast}
        overlayBlur={overlayBlur}
        setOverlayBlur={setOverlayBlur}
        overlayVideo={overlayVideo}
        setOverlayVideo={setOverlayVideo}
        video1Ref={video1Ref}
        video2Ref={video2Ref}
      />
    </div>
  );
};

export default OverlayVideoSection;