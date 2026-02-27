import { useState, useEffect, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { generateCode, formatCode } from '../lib/utils';
import { WebRTCManager } from '../lib/webrtc';

interface ReceiverProps {
  onNavigate: (page: 'home') => void;
}

export default function Receiver({ onNavigate }: ReceiverProps) {
  const [code, setCode] = useState<string>('');
  const [status, setStatus] = useState<string>('initializing');
  const [connectionState, setConnectionState] = useState<string>('new');
  const videoRef = useRef<HTMLVideoElement>(null);
  const webrtcRef = useRef<WebRTCManager | null>(null);

  useEffect(() => {
    initializeSession();

    return () => {
      if (webrtcRef.current) {
        webrtcRef.current.cleanup();
      }
    };
  }, []);

  async function initializeSession() {
    const newCode = generateCode();
    setCode(newCode);

    const { error } = await supabase.from('sessions').insert({
      code: newCode,
      status: 'waiting',
    });

    if (error) {
      console.error('Error creating session:', error);
      setStatus('error');
      return;
    }

    setStatus('waiting');

    const manager = new WebRTCManager(newCode, false);
    webrtcRef.current = manager;

    manager.onStream((stream) => {
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setStatus('streaming');
      }
    });

    manager.onConnectionState((state) => {
      setConnectionState(state);
      if (state === 'connected') {
        setStatus('connected');
      } else if (state === 'disconnected' || state === 'failed') {
        setStatus('disconnected');
      }
    });

    await manager.initialize();
  }

  const currentUrl = window.location.origin + window.location.pathname;
  const qrData = JSON.stringify({ url: currentUrl, code });

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

        {status === 'waiting' || status === 'initializing' ? (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-white mb-4">
                Ready to Receive Screen
              </h1>
              <p className="text-xl text-slate-300">
                Share this code with the sender device
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-slate-800 rounded-xl p-8 border border-slate-700">
                <h2 className="text-xl font-semibold text-white mb-4">
                  6-Digit Code
                </h2>
                <div className="bg-slate-900 rounded-lg p-8 mb-6">
                  <div className="text-6xl font-bold text-center text-green-400 tracking-wider">
                    {formatCode(code)}
                  </div>
                </div>
                <p className="text-sm text-slate-400 text-center">
                  Enter this code on the sender device
                </p>
              </div>

              <div className="bg-slate-800 rounded-xl p-8 border border-slate-700">
                <h2 className="text-xl font-semibold text-white mb-4">
                  QR Code
                </h2>
                <div className="bg-white rounded-lg p-6 flex items-center justify-center mb-6">
                  <QRCodeSVG value={qrData} size={200} level="H" />
                </div>
                <p className="text-sm text-slate-400 text-center">
                  Scan with mobile app to connect instantly
                </p>
              </div>
            </div>

            <div className="mt-8 bg-blue-900/30 border border-blue-700 rounded-lg p-6">
              <div className="flex items-center gap-3">
                <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
                <div>
                  <p className="text-white font-semibold">Waiting for connection...</p>
                  <p className="text-sm text-slate-300">
                    Connection state: {connectionState}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : status === 'streaming' || status === 'connected' ? (
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold text-white mb-2">
                Screen Mirror Active
              </h1>
              <p className="text-slate-300">Code: {formatCode(code)}</p>
            </div>

            <div className="bg-black rounded-xl overflow-hidden border-4 border-green-600">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-auto"
                style={{ maxHeight: 'calc(100vh - 250px)' }}
              />
            </div>

            <div className="mt-6 text-center">
              <div className="inline-flex items-center gap-2 bg-green-900/30 border border-green-700 rounded-lg px-6 py-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                <span className="text-green-400 font-semibold">Connected</span>
              </div>
            </div>
          </div>
        ) : status === 'disconnected' ? (
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-slate-800 rounded-xl p-12 border border-slate-700">
              <h2 className="text-2xl font-bold text-white mb-4">
                Connection Lost
              </h2>
              <p className="text-slate-300 mb-6">
                The screen sharing session has ended.
              </p>
              <button
                onClick={() => {
                  window.location.reload();
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
              >
                Start New Session
              </button>
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-slate-800 rounded-xl p-12 border border-red-700">
              <h2 className="text-2xl font-bold text-white mb-4">
                Error
              </h2>
              <p className="text-slate-300 mb-6">
                Failed to initialize session. Please try again.
              </p>
              <button
                onClick={() => onNavigate('home')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
              >
                Back to Home
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
