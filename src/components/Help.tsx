import { ArrowLeft, Monitor, Laptop, Usb, Cable } from 'lucide-react';

interface HelpProps {
  onNavigate: (page: 'home' | 'sender' | 'receiver') => void;
}

export default function Help({ onNavigate }: HelpProps) {
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

        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">
              Wireless Second Screen Setup Guide
            </h1>
            <p className="text-xl text-slate-300">
              Extend your desktop with a virtual display over WiFi
            </p>
          </div>

          <div className="bg-blue-900/30 border border-blue-700 rounded-xl p-6 mb-8">
            <h2 className="text-xl font-bold text-white mb-3">
              How It Works
            </h2>
            <p className="text-slate-300 leading-relaxed">
              To use a device as a wireless second screen, you need to create a virtual display on your computer,
              then mirror that virtual display to another device. This allows you to drag windows to the "second screen"
              and they'll appear on your remote device.
            </p>
          </div>

          <div className="space-y-6 mb-8">
            <div className="bg-slate-800 rounded-xl p-8 border border-slate-700">
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-green-600 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Laptop className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Step 1: Create a Virtual Display
                  </h3>
                  <p className="text-slate-400">
                    Choose the method that works best for your system
                  </p>
                </div>
              </div>

              <div className="space-y-6 ml-16">
                <div className="bg-slate-900 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-white mb-3">
                    For Mac M1/M2/M3 (Apple Silicon)
                  </h4>
                  <ol className="space-y-3 text-slate-300">
                    <li className="flex gap-3">
                      <span className="font-bold text-green-400 flex-shrink-0">1.</span>
                      <span>
                        Install <span className="font-mono bg-slate-800 px-2 py-1 rounded">BetterDummy</span> from{' '}
                        <a
                          href="https://github.com/waydabber/BetterDummy"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 underline"
                        >
                          GitHub
                        </a>
                      </span>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-bold text-green-400 flex-shrink-0">2.</span>
                      <span>Open BetterDummy and create a new virtual display</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-bold text-green-400 flex-shrink-0">3.</span>
                      <span>Configure the resolution to match your target device</span>
                    </li>
                  </ol>
                </div>

                <div className="bg-slate-900 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    <Usb className="w-5 h-5" />
                    For Windows, Mac (Intel), Chromebook, Linux
                  </h4>
                  <ol className="space-y-3 text-slate-300">
                    <li className="flex gap-3">
                      <span className="font-bold text-green-400 flex-shrink-0">1.</span>
                      <span>
                        Purchase a dummy display adapter (HDMI, DisplayPort, or USB)
                        <ul className="mt-2 ml-6 space-y-1 text-sm text-slate-400">
                          <li>HDMI Dummy Plug (4K support recommended)</li>
                          <li>DisplayPort Dummy Plug</li>
                          <li>USB to HDMI adapter with dummy plug</li>
                        </ul>
                      </span>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-bold text-green-400 flex-shrink-0">2.</span>
                      <span>Plug the dummy adapter into an available port</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-bold text-green-400 flex-shrink-0">3.</span>
                      <span>Your system will detect it as a real second monitor</span>
                    </li>
                  </ol>
                </div>

                <div className="bg-slate-900 rounded-lg p-6 border-2 border-yellow-700">
                  <h4 className="text-lg font-semibold text-yellow-400 mb-3 flex items-center gap-2">
                    <Cable className="w-5 h-5" />
                    Workaround: Dual Cable Trick
                  </h4>
                  <p className="text-slate-300 mb-3">
                    If you already have an external monitor connected, you can create a virtual second screen
                    without buying anything:
                  </p>
                  <ol className="space-y-3 text-slate-300">
                    <li className="flex gap-3">
                      <span className="font-bold text-yellow-400 flex-shrink-0">1.</span>
                      <span>Connect your external monitor with TWO cables simultaneously</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-bold text-yellow-400 flex-shrink-0">2.</span>
                      <span>
                        Example: Use both HDMI AND DisplayPort to the same monitor
                      </span>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-bold text-yellow-400 flex-shrink-0">3.</span>
                      <span>
                        Your computer will see it as TWO separate displays
                      </span>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-bold text-yellow-400 flex-shrink-0">4.</span>
                      <span>
                        Share one of these "displays" to OmniScreen Mirror
                      </span>
                    </li>
                  </ol>
                </div>
              </div>
            </div>

            <div className="bg-slate-800 rounded-xl p-8 border border-slate-700">
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-blue-600 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Monitor className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Step 2: Start the Desktop App
                  </h3>
                  <p className="text-slate-400">
                    Open OmniScreen Mirror in your browser
                  </p>
                </div>
              </div>

              <div className="ml-16">
                <p className="text-slate-300 mb-4">
                  Launch this app in Chrome, Firefox, Safari, Edge, or Opera on your Windows PC, Mac, or Chromebook.
                </p>
                <button
                  onClick={() => onNavigate('sender')}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  Go to Sender Page
                </button>
              </div>
            </div>

            <div className="bg-slate-800 rounded-xl p-8 border border-slate-700">
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-purple-600 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Monitor className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Step 3: Enter ID and Connect
                  </h3>
                  <p className="text-slate-400">
                    Link your devices together
                  </p>
                </div>
              </div>

              <div className="ml-16">
                <ol className="space-y-3 text-slate-300 mb-4">
                  <li className="flex gap-3">
                    <span className="font-bold text-purple-400">1.</span>
                    <span>On your second device, open the receiver page</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-purple-400">2.</span>
                    <span>Copy the 6-digit ID displayed</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-purple-400">3.</span>
                    <span>Return to the sender page and enter the code</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-purple-400">4.</span>
                    <span>Press CONNECT and select your virtual second screen</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-purple-400">5.</span>
                    <span>
                      Drag windows to the virtual display and they'll appear on your remote device
                    </span>
                  </li>
                </ol>
                <div className="flex gap-4">
                  <button
                    onClick={() => onNavigate('receiver')}
                    className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                  >
                    Open Receiver
                  </button>
                  <button
                    onClick={() => onNavigate('sender')}
                    className="bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                  >
                    Open Sender
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-3">
              Troubleshooting Tips
            </h3>
            <ul className="space-y-2 text-slate-300 text-sm">
              <li className="flex gap-3">
                <span className="text-blue-400">•</span>
                <span>
                  Make sure both devices are connected to the internet (they don't need to be on the same network)
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-blue-400">•</span>
                <span>Use Chrome, Edge, or Firefox for best compatibility</span>
              </li>
              <li className="flex gap-3">
                <span className="text-blue-400">•</span>
                <span>
                  If the connection fails, try refreshing both pages and generating a new code
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-blue-400">•</span>
                <span>For lower latency, ensure both devices have a strong internet connection</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
