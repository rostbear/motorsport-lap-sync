import { useState, useRef } from 'react';
import VideoPlayer, { VideoPlayerRef } from '@/components/VideoPlayer';
import SyncControls from '@/components/SyncControls';
import OverlayVideoSection from '@/components/OverlayVideoSection';
import heroImage from '@/assets/f1-hero.jpg';

const Index = () => {
  const video1Ref = useRef<VideoPlayerRef>(null);
  const video2Ref = useRef<VideoPlayerRef>(null);
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
    // Sync both videos to their start offsets
    const video1StartOffset = video1Ref.current?.getStartOffset() || 0;
    const video2StartOffset = video2Ref.current?.getStartOffset() || 0;
    
    video1Ref.current?.setCurrentTime(video1StartOffset);
    video2Ref.current?.setCurrentTime(video2StartOffset);
    
    // Start playing both
    setTimeout(() => {
      video1Ref.current?.play();
      video2Ref.current?.play();
      setIsPlaying(true);
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-f1-dark to-background">
      {/* Hero Section */}
      <section className="relative h-64 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        <div className="relative h-full flex items-center justify-center text-center px-6">
          <div>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-f1 bg-clip-text text-transparent mb-4">
              F1 Lap Sync
            </h1>
            <p className="text-xl text-f1-silver max-w-2xl">
              Confronta e analizza giri di Formula 1 con sincronizzazione perfetta
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        {/* Video Players Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
          <VideoPlayer 
            ref={video1Ref}
            title="Video 1 - Giro A"
            className="w-full"
          />
          <VideoPlayer 
            ref={video2Ref}
            title="Video 2 - Giro B"
            className="w-full"
          />
        </div>

        {/* Sync Controls */}
        <div className="mb-12">
          <SyncControls 
            onPlayBoth={handlePlayBoth}
            onPauseBoth={handlePauseBoth}
            onSyncBoth={handleSyncBoth}
            isPlaying={isPlaying}
          />
        </div>

        {/* Overlay Video Section */}
        <div className="mb-12">
          <OverlayVideoSection 
            video1Ref={video1Ref}
            video2Ref={video2Ref}
          />
        </div>

        {/* Instructions */}
        <div className="mt-12 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-f1-gold mb-6">Come utilizzare F1 Lap Sync</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="text-f1-red text-2xl font-bold mb-2">1</div>
                <h3 className="font-semibold mb-2 text-f1-gold">Carica i Video</h3>
                <p className="text-muted-foreground">
                  Carica due video da confrontare tramite file locale o URL. Supporta tutti i formati video comuni.
                </p>
              </div>
              
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="text-f1-red text-2xl font-bold mb-2">2</div>
                <h3 className="font-semibold mb-2 text-f1-gold">Sincronizza</h3>
                <p className="text-muted-foreground">
                  Regola il punto di inizio di ogni video e usa i controlli frame-by-frame per l'allineamento perfetto.
                </p>
              </div>
              
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="text-f1-red text-2xl font-bold mb-2">3</div>
                <h3 className="font-semibold mb-2 text-f1-gold">Analizza</h3>
                <p className="text-muted-foreground">
                  Confronta le performance utilizzando "Play Entrambi" per una sincronizzazione perfetta dei giri.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;