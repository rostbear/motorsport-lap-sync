import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { VideoPlayerRef } from './VideoPlayer';
import { Clock, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface KeyframeComparisonProps {
  video1Ref: React.RefObject<VideoPlayerRef>;
  video2Ref: React.RefObject<VideoPlayerRef>;
}

const KeyframeComparison: React.FC<KeyframeComparisonProps> = ({ video1Ref, video2Ref }) => {
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    const milliseconds = Math.floor((time % 1) * 1000);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`;
  };

  const formatDelta = (delta: number) => {
    const absDelta = Math.abs(delta);
    const minutes = Math.floor(absDelta / 60);
    const seconds = Math.floor(absDelta % 60);
    const milliseconds = Math.floor((absDelta % 1) * 1000);
    const sign = delta >= 0 ? '+' : '-';
    return `${sign}${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`;
  };

  const getKeyframe1 = () => video1Ref.current?.getKeyframe1() || null;
  const getKeyframe2 = () => video1Ref.current?.getKeyframe2() || null;
  const getKeyframe1Absolute = () => video1Ref.current?.getKeyframe1Absolute() || null;
  const getKeyframe2Absolute = () => video1Ref.current?.getKeyframe2Absolute() || null;
  const getKeyframeDelta1 = () => video1Ref.current?.getKeyframeDelta() || null;

  const getKeyframe3 = () => video2Ref.current?.getKeyframe1() || null;
  const getKeyframe4 = () => video2Ref.current?.getKeyframe2() || null;
  const getKeyframe3Absolute = () => video2Ref.current?.getKeyframe1Absolute() || null;
  const getKeyframe4Absolute = () => video2Ref.current?.getKeyframe2Absolute() || null;
  const getKeyframeDelta2 = () => video2Ref.current?.getKeyframeDelta() || null;

  const keyframe1 = getKeyframe1();
  const keyframe2 = getKeyframe2();
  const keyframe1Absolute = getKeyframe1Absolute();
  const keyframe2Absolute = getKeyframe2Absolute();
  const keyframeDelta1 = getKeyframeDelta1();

  const keyframe3 = getKeyframe3();
  const keyframe4 = getKeyframe4();
  const keyframe3Absolute = getKeyframe3Absolute();
  const keyframe4Absolute = getKeyframe4Absolute();
  const keyframeDelta2 = getKeyframeDelta2();

  // Calculate the difference between the two videos' keyframe deltas
  const calculateVideoDifference = () => {
    if (keyframeDelta1 === null || keyframeDelta2 === null) return null;
    return keyframeDelta2 - keyframeDelta1;
  };

  const videoDifference = calculateVideoDifference();

  const getFasterVideo = () => {
    if (videoDifference === null) return null;
    const player1Name = video1Ref.current?.getPlayerName() || 'Video 1';
    const player2Name = video2Ref.current?.getPlayerName() || 'Video 2';
    
    if (videoDifference > 0) return player1Name;
    if (videoDifference < 0) return player2Name;
    return 'Pari';
  };

  const fasterVideo = getFasterVideo();

  const handleClearAll = () => {
    video1Ref.current?.clearKeyframes();
    video2Ref.current?.clearKeyframes();
  };

  // Check if both videos have both keyframes set
  const bothVideosReady = keyframe1 !== null && keyframe2 !== null && keyframe3 !== null && keyframe4 !== null;

  return (
    <Card className="p-6 bg-card border-border shadow-elegant">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="h-5 w-5 text-f1-gold" />
        <h2 className="text-xl font-bold text-f1-gold">Confronto Keyframe</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Video 1 Status */}
        <div className="p-4 bg-f1-dark rounded-lg border border-border">
          <h3 className="text-lg font-semibold text-f1-gold mb-2">
            {video1Ref.current?.getPlayerName() || 'Video 1'}
          </h3>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${keyframe1 !== null ? 'bg-f1-red' : 'bg-gray-500'}`}></div>
              <span className="text-sm text-muted-foreground">
                Keyframe 1: {keyframe1 !== null ? 'Impostato' : 'Non impostato'}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${keyframe2 !== null ? 'bg-f1-gold' : 'bg-gray-500'}`}></div>
              <span className="text-sm text-muted-foreground">
                Keyframe 2: {keyframe2 !== null ? 'Impostato' : 'Non impostato'}
              </span>
            </div>

            {keyframeDelta1 !== null && (
              <div className="mt-3 p-2 bg-background rounded border border-f1-gold">
                <div className="text-sm text-muted-foreground">Tempo tra keyframes:</div>
                <div className="text-lg font-mono font-bold text-f1-gold">
                  {formatTime(keyframeDelta1)}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Video 2 Status */}
        <div className="p-4 bg-f1-dark rounded-lg border border-border">
          <h3 className="text-lg font-semibold text-f1-gold mb-2">
            {video2Ref.current?.getPlayerName() || 'Video 2'}
          </h3>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${keyframe3 !== null ? 'bg-f1-red' : 'bg-gray-500'}`}></div>
              <span className="text-sm text-muted-foreground">
                Keyframe 1: {keyframe3 !== null ? 'Impostato' : 'Non impostato'}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${keyframe4 !== null ? 'bg-f1-gold' : 'bg-gray-500'}`}></div>
              <span className="text-sm text-muted-foreground">
                Keyframe 2: {keyframe4 !== null ? 'Impostato' : 'Non impostato'}
              </span>
            </div>

            {keyframeDelta2 !== null && (
              <div className="mt-3 p-2 bg-background rounded border border-f1-gold">
                <div className="text-sm text-muted-foreground">Tempo tra keyframes:</div>
                <div className="text-lg font-mono font-bold text-f1-gold">
                  {formatTime(keyframeDelta2)}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Video Comparison Results - Show immediately when both videos have keyframes */}
      {bothVideosReady && videoDifference !== null && (
        <div className="p-6 bg-f1-dark rounded-lg border border-f1-red mb-6">
          <h3 className="text-lg font-semibold text-f1-gold mb-4 text-center">
            Confronto tra i due Video
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            {/* Difference */}
            <div>
              <p className="text-sm text-muted-foreground mb-1">Differenza Tempo</p>
              <div className="text-3xl font-mono font-bold text-f1-silver">
                {formatDelta(videoDifference)}
              </div>
            </div>

            {/* Faster Video */}
            <div>
              <p className="text-sm text-muted-foreground mb-1">Video Più Veloce</p>
              <div className="text-xl font-semibold text-f1-gold">
                {fasterVideo}
              </div>
            </div>

            {/* Icon */}
            <div className="flex items-center justify-center">
              {videoDifference > 0 ? (
                <TrendingUp className="h-12 w-12 text-green-500" />
              ) : videoDifference < 0 ? (
                <TrendingDown className="h-12 w-12 text-red-500" />
              ) : (
                <Minus className="h-12 w-12 text-yellow-500" />
              )}
            </div>
          </div>

          {/* Explanation */}
          <div className="mt-4 p-3 bg-background rounded-lg">
            <p className="text-sm text-muted-foreground text-center">
              {videoDifference > 0 
                ? `${video1Ref.current?.getPlayerName() || 'Video 1'} è più veloce di ${formatDelta(videoDifference)} nel segmento misurato`
                : videoDifference < 0
                ? `${video2Ref.current?.getPlayerName() || 'Video 2'} è più veloce di ${formatDelta(Math.abs(videoDifference))} nel segmento misurato`
                : 'Entrambi i video hanno la stessa velocità nel segmento misurato'
              }
            </p>
          </div>
        </div>
      )}
    </Card>
  );
};

export default KeyframeComparison;
