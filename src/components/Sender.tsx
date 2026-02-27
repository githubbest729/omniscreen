import { useState, useRef } from 'react';
import { ArrowLeft, Monitor, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { WebRTCManager } from '../lib/webrtc';

interface SenderProps {
  onNavigate: (page: 'home') => void;
}

export default function Sender({ onNavigate }: SenderProps) {
  const [code, setCode] = useState('');
  const [status, setStatus] = useState<'idle' | 'connecting' | 'sharing' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [connectionState, setConnectionState] = useState<string>('new');
  const videoRef = useRef<HTMLVideoElement>(null);
  const webrtcRef = useRef<WebRTCManager | null>(null);

  async function handleConnect() {
    const cleanCode = code.replace(/\D/g, '');

    if (cleanCode.length !== 6) {
      setErrorMessage('Please enter a valid 6-digit code');
      return;
    }

    setStatus('connecting');
    setErrorMessage('');

    const { data: session, error } = await supabase
      .from('sessions')
      .select('*')
      .eq('code', cleanCode)
      .maybeSingle();

    if (error || !session) {
      setErrorMessage('Invalid code. Please check and try again.');
      setStatus('error');
      return;
    }

    try {
      const manager = new WebRTCManager(cleanCode, true);
      webrtcRef.current = manager;

      manager.onConnectionState((state) => {
        setConnectionState(state);
        if (state === 'connected') {
          setStatus('sharing');
        } else if (state === 'failed' || state === 'disconnected') {
          setErrorMessage('Connection lost');
          setStatus('error');
        }
      });

      await manager.initialize();
      const stream = await manager.startScreenShare();

      if (videoRef.current && stream) {
        videoRef.current.srcObject = stream;
      }

      setStatus('sharing');
    } catch (error: any) {
      console.error('Error starting screen share:', error);
      setErrorMessage(error.message || 'Failed to start screen sharing');
      setStatus('error');
    }
  }

  function handleStopSharing() {
    if (webrtcRef.current) {
      webrtcRef.current.cleanup();
      webrtcRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setStatus('idle');
    setCode('');
  }

  function handleCodeChange(value: string) {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length <= 6) {
      setCode(cleaned);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2 text-slate-300 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </button>

        {status === 'idle' || status === 'error' ? (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <div className="bg-blue-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Monitor className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-white mb-4">
                Share Your Screen
              </h1>
              <p className="text-xl text-slate-300">
                Enter the 6-digit code from the receiver device
              </p>
            </div>

            <div className="bg-slate-800 rounded-xl p-8 border border-slate-700">
              <label className="block text-sm font-semibold text-slate-300 mb-3">
                Connection Code
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => handleCodeChange(e.target.value)}
                placeholder="000000"
                maxLength={6}
                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-6 py-4 text-3xl font-bold text-center text-white tracking-widest focus:outline-none focus:border-blue-500 transition-colors"
                disabled={status === 'connecting'}
              />

              {errorMessage && (
                <div className="mt-4 bg-red-900/30 border border-red-700 rounded-lg p-4">
                  <p className="text-red-400 text-sm">{errorMessage}</p>
                </div>
              )}

              <button
                onClick={handleConnect}
                disabled={code.length !== 6 || status === 'connecting'}
                className="w-full mt-6 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-lg transition-colors text-lg"
              >
                {status === 'connecting' ? 'Connecting...' : 'CONNECT'}
              </button>
            </div>

            <div className="mt-8 bg-slate-800 rounded-xl p-6 border border-slate-700">
              <h3 className="text-lg font-semibold text-white mb-3">
                How to Connect
              </h3>
              <ol className="space-y-2 text-slate-300">
                <li className="flex gap-3">
                  <span className="font-bold text-blue-400">1.</span>
                  <span>Open the receiver page on your target device</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-blue-400">2.</span>
                  <span>Copy the 6-digit code displayed there</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-blue-400">3.</span>
                  <span>Enter the code above and click CONNECT</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-blue-400">4.</span>
                  <span>Select which screen/window to share</span>
                </li>
              </ol>
            </div>
          </div>
        ) : status === 'connecting' ? (
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-slate-800 rounded-xl p-12 border border-slate-700">
              <Loader2 className="w-16 h-16 text-blue-400 animate-spin mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-white mb-4">
                Connecting...
              </h2>
              <p className="text-slate-300">
                Please select the screen or window you want to share
              </p>
              <p className="text-sm text-slate-400 mt-2">
                Connection state: {connectionState}
              </p>
            </div>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold text-white mb-2">
                Screen Sharing Active
              </h1>
              <p className="text-slate-300">
                Your screen is now being mirrored to the receiver
              </p>
            </div>

            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                  <div>
                    <p className="text-white font-semibold">Live Stream Active</p>
                    <p className="text-sm text-slate-400">Connection: {connectionState}</p>
                  </div>
                </div>
                <button
                  onClick={handleStopSharing}
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  Stop Sharing
                </button>
              </div>
            </div>

            <div className="bg-black rounded-xl overflow-hidden border-2 border-slate-700">
              <p className="text-center text-slate-400 py-3 bg-slate-800 text-sm">
                Preview (what the receiver sees)
              </p>
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-auto"
                style={{ maxHeight: 'calc(100vh - 350px)' }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
