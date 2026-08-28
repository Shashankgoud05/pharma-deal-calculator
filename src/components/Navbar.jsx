import React from 'react';
import { Pill, BarChart3, Calculator, FileSpreadsheet } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab }) {
  return (
    <header className="bg-teal-900 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between py-2 sm:py-0 sm:h-16 gap-2 sm:gap-0">
          
          {/* Logo & Title */}
          <div className="flex items-center space-x-2.5 sm:space-x-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-teal-600 flex items-center justify-center text-emerald-300 shadow-inner">
              <Pill className="w-5 h-5 sm:w-6 sm:h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5 sm:space-x-2">
                <span className="font-bold text-base sm:text-xl tracking-tight">Pharma Deal & Profit</span>
                <span className="bg-amber-500/20 text-amber-300 text-[10px] sm:text-xs px-2 py-0.5 rounded-full border border-amber-500/30 font-medium">
                  Mobile Pro
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-teal-200 hidden sm:block">
                Calculator for Medical Distributors & Sales Managers
              </p>
            </div>
          </div>

          {/* Navigation Tabs Optimized for Touch & Small Screens */}
          <nav className="w-full sm:w-auto flex justify-between sm:justify-start space-x-1 bg-teal-950/80 p-1 rounded-xl border border-teal-800/80 overflow-x-auto">
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
        </div>
      </div>
    </header>
  );
}
