import { Monitor, Smartphone, Tv } from 'lucide-react';

interface HomeProps {
  onNavigate: (page: 'sender' | 'receiver' | 'help') => void;
}

export default function Home({ onNavigate }: HomeProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-4">
            OmniScreen Mirror
          </h1>
          <p className="text-xl text-slate-300">
            Universal real-time screen mirroring that works with any device, anywhere
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
          <div className="bg-slate-800 rounded-xl p-8 border border-slate-700 hover:border-slate-500 transition-all">
            <div className="bg-blue-600 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
              <Monitor className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">
              Flow 1: Standard Mirroring
            </h2>
            <p className="text-slate-300 mb-6 leading-relaxed">
              Desktop to any device. Perfect for presentations and demonstrations.
            </p>
            <ol className="text-sm text-slate-400 space-y-2 mb-6">
              <li>1. Start the receiver on target device</li>
              <li>2. Click "Share Screen" below</li>
              <li>3. Enter the 6-digit ID and connect</li>
            </ol>
            <button
              onClick={() => onNavigate('sender')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Share Screen
            </button>
          </div>

          <div className="bg-slate-800 rounded-xl p-8 border border-slate-700 hover:border-slate-500 transition-all">
            <div className="bg-green-600 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
              <Smartphone className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">
              Flow 2: Mobile to Browser
            </h2>
            <p className="text-slate-300 mb-6 leading-relaxed">
              Mirror your phone or tablet screen to any browser.
            </p>
            <ol className="text-sm text-slate-400 space-y-2 mb-6">
              <li>1. Click "Receive Screen" below</li>
              <li>2. Scan QR code with mobile app</li>
              <li>3. Your screen appears here</li>
            </ol>
            <button
              onClick={() => onNavigate('receiver')}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Receive Screen
            </button>
          </div>

          <div className="bg-slate-800 rounded-xl p-8 border border-slate-700 hover:border-slate-500 transition-all">
            <div className="bg-purple-600 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
              <Tv className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">
              Flow 3: Wireless Second Screen
            </h2>
            <p className="text-slate-300 mb-6 leading-relaxed">
              Extend your desktop with a virtual display over WiFi.
            </p>
            <ol className="text-sm text-slate-400 space-y-2 mb-6">
              <li>1. Create a virtual display</li>
              <li>2. Open receiver on second device</li>
              <li>3. Share the virtual screen</li>
            </ol>
            <button
              onClick={() => onNavigate('help')}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              View Setup Guide
            </button>
          </div>
        </div>

        <div className="text-center">
          <p className="text-slate-400 text-sm">
            Works on Windows, Mac, Linux, Chromebook, iOS, Android, and any device with a modern browser
          </p>
        </div>
      </div>
    </div>
  );
}
