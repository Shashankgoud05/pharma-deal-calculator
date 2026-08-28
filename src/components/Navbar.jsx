import React from 'react';
import { Pill, BarChart3, Table, Calculator, FileSpreadsheet, ShieldCheck } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab }) {
  return (
    <header className="bg-teal-900 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-emerald-300 shadow-inner">
              <Pill className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg sm:text-xl tracking-tight">Pharma Deal & Profit</span>
                <span className="bg-amber-500/20 text-amber-300 text-xs px-2 py-0.5 rounded-full border border-amber-500/30 font-medium">
                  Pro v2.0
                </span>
              </div>
              <p className="text-xs text-teal-200 hidden sm:block">
                Calculator for Medical Distributors, Stockists & Sales Managers
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex space-x-1 sm:space-x-2 bg-teal-950/60 p-1.5 rounded-xl border border-teal-800/60">
            <button
              onClick={() => setActiveTab('simulator')}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'simulator'
                  ? 'bg-teal-600 text-white shadow-md'
                  : 'text-teal-200 hover:text-white hover:bg-teal-800/50'
              }`}
            >
              <Calculator className="w-4 h-4" />
              <span>Quick Simulator</span>
            </button>

            <button
              onClick={() => setActiveTab('batch')}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'batch'
                  ? 'bg-teal-600 text-white shadow-md'
                  : 'text-teal-200 hover:text-white hover:bg-teal-800/50'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Batch Excel Grid</span>
            </button>

            <button
              onClick={() => setActiveTab('sensitivity')}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'sensitivity'
                  ? 'bg-teal-600 text-white shadow-md'
                  : 'text-teal-200 hover:text-white hover:bg-teal-800/50'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span className="hidden md:inline">Scheme Sensitivity</span>
              <span className="md:hidden">Sensitivity</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}
