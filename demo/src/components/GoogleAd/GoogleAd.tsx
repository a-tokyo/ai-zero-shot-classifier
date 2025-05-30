'use client';

import { useEffect, useRef } from 'react';

// Add type declaration for window.adsbygoogle
declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

interface GoogleAdProps {
  slot: string;
  className?: string;
  variant?: 'side' | 'center';
}

export default function GoogleAd({ slot, className = "", variant = 'center' }: GoogleAdProps) {
  const adRef = useRef<HTMLModElement>(null);
  const isAdLoaded = useRef(false);
  const isDevelopment = process.env.NODE_ENV === 'development';

  useEffect(() => {
    if (!isAdLoaded.current && !isDevelopment) {
      try {
        if (typeof window !== 'undefined') {
          // Initialize adsbygoogle array if it doesn't exist
          if (!window.adsbygoogle) {
            window.adsbygoogle = [];
          }
          window.adsbygoogle.push({});
          isAdLoaded.current = true;
        }
      } catch (err) {
        console.error('Error loading Google AdSense:', err);
      }
    }
  }, []);

  const isSideAd = variant === 'side';
  const adHeight = isSideAd ? 'min-h-[600px]' : 'min-h-[200px]';

  if (isDevelopment) {
    return (
      <div className={`w-full overflow-hidden ${adHeight} bg-slate-800 border border-slate-700 rounded-lg flex items-center justify-center ${className}`}>
        <div className="text-slate-400 text-sm text-center">
          <div>Ad Placeholder</div>
          <div className="text-xs mt-1">Slot: {slot}</div>
          <div className="text-xs">Type: {variant}</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full overflow-hidden ${adHeight} ${className}`}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block', minHeight: isSideAd ? '600px' : '200px' }}
        data-ad-client="ca-pub-5266987079964279"
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
} 