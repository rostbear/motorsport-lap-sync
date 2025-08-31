import { useState, useRef } from 'react';
import VideoPlayer, { VideoPlayerRef } from '@/components/VideoPlayer';
import SyncControls from '@/components/SyncControls';
import KeyframeComparison from '@/components/KeyframeComparison';

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
      <section className="relative h-64 overflow-hidden bg-f1-dark">
        <div className="relative h-full flex items-center justify-center text-center px-6">
          <div>
            {/* F1 Car Logo */}
            <div className="mb-4 flex justify-center">
              <div className="text-6xl">🏎️</div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-f1 bg-clip-text text-transparent mb-4">
              Motorsport Lap Sync
            </h1>
            <p className="text-xl text-f1-silver max-w-2xl">
              Confronta e analizza giri di motorsport con sincronizzazione perfetta
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
            title="Giocatore 1"
            className="w-full"
          />
          <VideoPlayer 
            ref={video2Ref}
            title="Giocatore 2"
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
            video1Ref={video1Ref}
            video2Ref={video2Ref}
          />
        </div>

        {/* Keyframe Comparison */}
        <div className="mb-12">
          <KeyframeComparison 
            video1Ref={video1Ref}
            video2Ref={video2Ref}
          />
        </div>

        {/* Instructions */}
        <div className="mt-12 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-f1-gold mb-6">Come utilizzare Motorsport Lap Sync</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="text-f1-red text-2xl font-bold mb-2">1</div>
                <h3 className="font-semibold mb-2 text-f1-gold">Carica i Video</h3>
                <p className="text-muted-foreground">
                  Carica due video da confrontare tramite file locale. Supporta tutti i formati video comuni.
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
                <h3 className="font-semibold mb-2 text-f1-gold">Imposta i Keyframe</h3>
                <p className="text-muted-foreground">
                  Usa i pulsanti "Keyframe 1" e "Keyframe 2" in ogni video per misurare segmenti specifici. 
                  Il primo keyframe marca l'inizio del segmento, il secondo la fine.
                </p>
              </div>
              
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="text-f1-red text-2xl font-bold mb-2">4</div>
                <h3 className="font-semibold mb-2 text-f1-gold">Confronta le Performance</h3>
                <p className="text-muted-foreground">
                  Una volta impostati i keyframe in entrambi i video, la sezione "Confronto Keyframe" 
                  mostrerà automaticamente quale video è più veloce nel segmento misurato.
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