import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { PlayCircle, PauseCircle, RotateCcw } from 'lucide-react';

interface SyncControlsProps {
  onPlayBoth: () => void;
  onPauseBoth: () => void;
  onSyncBoth: () => void;
  isPlaying: boolean;
}

export default function SyncControls({ onPlayBoth, onPauseBoth, onSyncBoth, isPlaying }: SyncControlsProps) {
  return (
    <Card className="p-6 bg-gradient-carbon border-border shadow-elegant">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold bg-gradient-f1 bg-clip-text text-transparent">
          Controlli Sincronizzazione
        </h2>
        
        <div className="flex items-center justify-center gap-4">
          <Button
            onClick={isPlaying ? onPauseBoth : onPlayBoth}
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
            onClick={onSyncBoth}
            variant="secondary"
            size="lg"
            className="px-8"
          >
            <RotateCcw className="mr-2 h-5 w-5" />
            Sync
          </Button>
        </div>
        
        <p className="text-sm text-muted-foreground">
          Usa "Play Entrambi" per avviare i video in sincronia perfetta
        </p>
      </div>
    </Card>
  );
}