import React from 'react';
import { WifiOff, RefreshCw, AlertTriangle } from 'lucide-react';

interface BackendOfflineBannerProps {
  onRetry: () => void;
  isRetrying?: boolean;
}

export const BackendOfflineBanner: React.FC<BackendOfflineBannerProps> = ({ onRetry, isRetrying }) => {
  return (
    <div className="bg-rose-50 border-b border-rose-200 text-rose-900 px-4 py-3 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-rose-100 flex items-center justify-center shrink-0">
            <WifiOff className="w-4 h-4 text-rose-600" />
          </div>
          <div>
            <div className="text-xs sm:text-sm font-bold flex items-center gap-1.5 justify-center sm:justify-start">
              <span>TeachLens backend is unavailable.</span>
              <span className="hidden sm:inline text-rose-600">•</span>
              <span className="text-rose-600 font-normal hidden sm:inline">Port 8001 connection lost</span>
            </div>
            <p className="text-[11px] text-rose-700">
              The application requires the active FastAPI backend service. Demo mode is disabled.
            </p>
          </div>
        </div>

        <button
          onClick={onRetry}
          disabled={isRetrying}
          className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 shrink-0 disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRetrying ? 'animate-spin' : ''}`} />
          <span>{isRetrying ? 'Connecting...' : 'Retry Connection'}</span>
        </button>
      </div>
    </div>
  );
};
