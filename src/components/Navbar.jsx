import React, { useState, useEffect } from 'react';
import { BarChart3, Calculator, FileSpreadsheet, Download } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab }) {
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      window.deferredPrompt = e;
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    const promptEvent = deferredPrompt || window.deferredPrompt;
    if (promptEvent) {
      promptEvent.prompt();
      const choiceResult = await promptEvent.userChoice;
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted PWA installation');
      }
      setDeferredPrompt(null);
      window.deferredPrompt = null;
    } else {
      alert("📱 Mobile App Download:\n\nChrome / Mobile Browser lo website open avagane bottom lo 'Add to Home screen' or 'Install App' banner kanipisthundhi. Click 'Install'!");
    }
  };

  return (
    <header className="bg-teal-900 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between py-2 sm:py-0 sm:h-16 gap-2 sm:gap-0">
          
          {/* Custom Bubble App Logo matching uploaded image without white border */}
          <div className="flex items-center space-x-2.5 sm:space-x-3">
            <div className="relative group">
              <img 
                src="/app-logo.jpg" 
                alt="PTR PTS App Logo" 
                className="w-9 h-9 sm:w-11 sm:h-11 rounded-2xl object-cover shadow-lg border border-blue-400/40 transform group-hover:scale-105 transition-all" 
              />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            </div>

            <div>
              <div className="flex items-center space-x-1.5 sm:space-x-2">
                <span className="font-extrabold text-base sm:text-xl tracking-tight">Pharma Deal & Profit</span>
                <span className="bg-amber-500/20 text-amber-300 text-[10px] sm:text-xs px-2 py-0.5 rounded-full border border-amber-500/30 font-semibold">
                  PRO
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-teal-200 hidden sm:block">
                Calculator for Medical Distributors & Sales Managers
              </p>
            </div>
          </div>

          {/* Navigation Tabs + Install App Button */}
          <div className="w-full sm:w-auto flex items-center space-x-2">
            <nav className="flex-1 sm:flex-none flex justify-between sm:justify-start space-x-1 bg-teal-950/80 p-1 rounded-xl border border-teal-800/80 overflow-x-auto">
              <button
                onClick={() => setActiveTab('simulator')}
                className={`flex-1 sm:flex-none flex items-center justify-center space-x-1 sm:space-x-1.5 px-2.5 sm:px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                  activeTab === 'simulator'
                    ? 'bg-teal-600 text-white shadow-md'
                    : 'text-teal-200 hover:text-white hover:bg-teal-800/50'
                }`}
              >
                <Calculator className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>Simulator</span>
              </button>

              <button
                onClick={() => setActiveTab('batch')}
                className={`flex-1 sm:flex-none flex items-center justify-center space-x-1 sm:space-x-1.5 px-2.5 sm:px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                  activeTab === 'batch'
                    ? 'bg-teal-600 text-white shadow-md'
                    : 'text-teal-200 hover:text-white hover:bg-teal-800/50'
                }`}
              >
                <FileSpreadsheet className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>Batch Grid</span>
              </button>

              <button
                onClick={() => setActiveTab('sensitivity')}
                className={`flex-1 sm:flex-none flex items-center justify-center space-x-1 sm:space-x-1.5 px-2.5 sm:px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                  activeTab === 'sensitivity'
                    ? 'bg-teal-600 text-white shadow-md'
                    : 'text-teal-200 hover:text-white hover:bg-teal-800/50'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>Sensitivity</span>
              </button>
            </nav>

            {/* DOWNLOAD BUTTON */}
            <button
              onClick={handleInstallClick}
              className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-black px-3 py-2 rounded-xl text-xs flex items-center space-x-1.5 shadow transition-all border border-amber-300 flex-shrink-0 animate-bounce"
              title="Download & Install App"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Install App</span>
              <span className="sm:hidden">Install</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
