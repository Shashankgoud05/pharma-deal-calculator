import React, { useState } from 'react';
import Navbar from './components/Navbar';
import SingleDealSimulator from './components/SingleDealSimulator';
import BatchTableGrid from './components/BatchTableGrid';
import SchemeSensitivityAnalysis from './components/SchemeSensitivityAnalysis';
import PtrPtsCalculatorSection from './components/PtrPtsCalculatorSection';
import { Pill, ShieldCheck, Zap, PlusCircle } from 'lucide-react';
import { SAMPLE_PRODUCTS } from './data/presets';

export default function App() {
  const [activeTab, setActiveTab] = useState('simulator');

  // Shared state for single deal simulator inputs
  const [inputs, setInputs] = useState({
    ptr: 987.43,
    targetBill: 45000,
    schemePercent: 30,
    pts: 130, // Net Rate field
    doctorCrm: 15000
  });

  // Shared state for Batch Excel grid table rows so Quick Simulator and Batch Grid are LINKED!
  const [batchRows, setBatchRows] = useState(SAMPLE_PRODUCTS);

  // Function to push current Quick Simulator values directly into Batch Excel Table as a new row or update
  const handlePushSimulatorToBatch = (productName = 'Simulated Deal Item') => {
    const newId = Date.now().toString();
    const newRow = {
      id: newId,
      name: `${productName} (PTR ₹${inputs.ptr})`,
      ptr: Number(inputs.ptr),
      targetBill: Number(inputs.targetBill),
      schemePercent: Number(inputs.schemePercent),
      pts: Number(inputs.pts),
      doctorCrm: Number(inputs.doctorCrm)
    };

    setBatchRows(prev => [newRow, ...prev]);
  };

  // REAL-TIME AUTO SYNC HANDLER: Updates PTR from rajesh_calculator matrix below
  const handleAutoSyncPtrOnly = (calculatedPtr) => {
    setInputs(prev => ({
      ...prev,
      ptr: Number(calculatedPtr.toFixed(2))
    }));
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-between font-sans pb-12 sm:pb-0">
      <div>
        {/* Navigation Bar */}
        <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Main Content Area */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          
          {/* Top Live Link & Sync Alert Banner */}
          <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-emerald-950 text-white p-3.5 rounded-xl shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center space-x-2 font-semibold">
              <Zap className="w-4 h-4 text-amber-400 animate-bounce" />
              <span>LINKED WORKSPACE:</span>
              <span className="text-teal-200">
                Quick Simulator lo calculate chesina deals Batch Excel Grid loki single click thoni send cheyyovachu!
              </span>
            </div>
            <button
              onClick={() => {
                handlePushSimulatorToBatch();
                setActiveTab('batch');
              }}
              className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black px-3 py-1.5 rounded-lg text-xs flex items-center space-x-1.5 shadow transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Push Deal to Batch Grid →</span>
            </button>
          </div>

          {activeTab === 'simulator' && (
            <div className="space-y-10">
              {/* Top Main Deal Simulator */}
              <SingleDealSimulator 
                inputs={inputs} 
                setInputs={setInputs} 
                onPushToBatch={(productName) => {
                  handlePushSimulatorToBatch(productName);
                  setActiveTab('batch');
                }}
              />

              {/* Bottom rajesh_calculator Section */}
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <span className="w-3 h-3 bg-teal-600 rounded-full animate-ping"></span>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">
                    RAJESH_CALCULATOR Matrix Module
                  </h3>
                </div>
                <PtrPtsCalculatorSection 
                  onApplyPtrToDeal={handleAutoSyncPtrOnly}
                  autoSync={true}
                />
              </div>
            </div>
          )}

          {activeTab === 'batch' && (
            <div className="space-y-8">
              <BatchTableGrid rows={batchRows} setRows={setBatchRows} />
              <PtrPtsCalculatorSection 
                onApplyPtrToDeal={handleAutoSyncPtrOnly}
                autoSync={true}
              />
            </div>
          )}

          {activeTab === 'sensitivity' && (
            <div className="space-y-8">
              <SchemeSensitivityAnalysis inputs={inputs} />
              <PtrPtsCalculatorSection 
                onApplyPtrToDeal={handleAutoSyncPtrOnly}
                autoSync={true}
              />
            </div>
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-teal-950 text-teal-200 py-6 border-t border-teal-800 text-xs no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex items-center space-x-2">
            <Pill className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold text-white">Pharma Deal & Profit Calculator + rajesh_calculator</span>
          </div>

          <div className="flex items-center space-x-4 text-slate-400">
            <span className="flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Simulator & Batch Grid Linked</span>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
