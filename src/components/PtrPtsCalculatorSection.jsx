import React, { useState, useEffect } from 'react';
import { calculatePtrPts, calculateSpecialRate } from '../utils/ptrPtsMath';
import { RotateCcw, Zap, CheckCircle2 } from 'lucide-react';

export default function PtrPtsCalculatorSection({ onApplyPtrToDeal, autoSync = true }) {
  const [subTab, setSubTab] = useState('ptr-pts');

  const [inputs, setInputs] = useState({
    mrp: 1350,
    gstPercent: 5,
    schemePercent: 0,
    discountPercent: 4,
    stockistMarginPercent: 10,
    retailMarginPercent: 20
  });

  const [redirectSource, setRedirectSource] = useState('cdDiscountPtr');
  const [includeGstInSync, setIncludeGstInSync] = useState(false);

  const [specialInputs, setSpecialInputs] = useState({
    mrp: 1350,
    pts: 925.71,
    ptr: 987.43,
    gstPercent: 5
  });

  const results = calculatePtrPts(inputs);
  const specialResults = calculateSpecialRate(specialInputs);

  let selectedPtrToSync = includeGstInSync ? results.cdDiscountPtrWithGst : results.cdDiscountPtrWithoutGst;

  if (redirectSource === 'ptr') {
    selectedPtrToSync = includeGstInSync ? results.ptrWithGst : results.ptrWithoutGst;
  } else if (redirectSource === 'netRate') {
    selectedPtrToSync = includeGstInSync ? results.netRateWithGst : results.netRateWithoutGst;
  }

  useEffect(() => {
    if (autoSync && onApplyPtrToDeal && subTab === 'ptr-pts') {
      onApplyPtrToDeal(selectedPtrToSync);
    }
  }, [inputs, redirectSource, includeGstInSync, autoSync, subTab]);

  const handleInputChange = (field, val) => {
    setInputs(prev => ({ ...prev, [field]: val }));
  };

  const handleReset = () => {
    setInputs({
      mrp: 1350,
      gstPercent: 5,
      schemePercent: 0,
      discountPercent: 4,
      stockistMarginPercent: 10,
      retailMarginPercent: 20
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden my-4 sm:my-6">
      {/* Header */}
      <div className="bg-slate-900 text-white p-3.5 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800">
        <div className="flex items-center space-x-2.5 sm:space-x-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center font-black text-lg sm:text-xl text-slate-950 shadow flex-shrink-0">
            R
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-base sm:text-xl tracking-tight text-white uppercase">RAJESH_CALCULATOR</span>
              <span className="bg-emerald-500/20 text-emerald-300 text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-emerald-500/30 flex items-center space-x-1">
                <Zap className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-400" />
                <span>SYNC ₹{selectedPtrToSync.toFixed(0)}</span>
              </span>
            </div>
            <p className="text-[10px] sm:text-xs text-slate-300">
              CD/Dis PTR (₹{selectedPtrToSync.toFixed(2)}) auto-redirects to PTR field above!
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="w-full sm:w-auto flex bg-slate-800 p-1 rounded-xl border border-slate-700">
          <button
            onClick={() => setSubTab('ptr-pts')}
            className={`flex-1 sm:flex-none text-center px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              subTab === 'ptr-pts'
                ? 'bg-teal-600 text-white shadow'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            PTR - PTS
          </button>
          <button
            onClick={() => setSubTab('special-rate')}
            className={`flex-1 sm:flex-none text-center px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              subTab === 'special-rate'
                ? 'bg-teal-600 text-white shadow'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            SPECIAL RATE
          </button>
        </div>
      </div>

      {subTab === 'ptr-pts' ? (
        <div className="p-3.5 sm:p-6 space-y-4 sm:space-y-6">
          
          {/* Target Selector */}
          <div className="bg-slate-100 p-2.5 sm:p-3 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
            <span className="font-bold text-slate-800 text-[11px] sm:text-xs">Redirect Target:</span>

            <div className="w-full sm:w-auto flex flex-wrap items-center gap-1.5 font-semibold">
              <button
                type="button"
                onClick={() => setRedirectSource('cdDiscountPtr')}
                className={`flex-1 sm:flex-none text-center text-[10px] sm:text-xs px-2.5 py-1.5 rounded-lg transition-all ${
                  redirectSource === 'cdDiscountPtr'
                    ? 'bg-emerald-600 text-white shadow font-bold'
                    : 'bg-white text-slate-700 border border-slate-300'
                }`}
              >
                CD/Dis PTR (₹{includeGstInSync ? results.cdDiscountPtrWithGst.toFixed(0) : results.cdDiscountPtrWithoutGst.toFixed(0)})
              </button>

              <button
                type="button"
                onClick={() => setRedirectSource('ptr')}
                className={`flex-1 sm:flex-none text-center text-[10px] sm:text-xs px-2.5 py-1.5 rounded-lg transition-all ${
                  redirectSource === 'ptr'
                    ? 'bg-blue-600 text-white shadow font-bold'
                    : 'bg-white text-slate-700 border border-slate-300'
                }`}
              >
                PTR (₹{includeGstInSync ? results.ptrWithGst.toFixed(0) : results.ptrWithoutGst.toFixed(0)})
              </button>

              <label className="flex items-center space-x-1 bg-white px-2 py-1 rounded-lg border border-slate-300 text-slate-800 text-[10px] sm:text-xs font-bold cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeGstInSync}
                  onChange={(e) => setIncludeGstInSync(e.target.checked)}
                  className="rounded text-teal-600"
                />
                <span>GST</span>
              </label>
            </div>
          </div>

          {/* Grid Without GST */}
          <div>
            <div className="bg-emerald-700 text-white text-[10px] sm:text-xs font-black uppercase tracking-wider px-3 py-1.5 rounded-t-xl text-center">
              PTR / PTS without GST
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 text-center text-white font-bold text-xs sm:text-sm">
              <div className="bg-red-600 p-2.5">
                <div className="text-[10px] opacity-90">PTS</div>
                <div className="text-base sm:text-xl font-black mt-0.5">{results.ptsWithoutGst.toFixed(2)}</div>
              </div>
              <div className="bg-blue-600 p-2.5">
                <div className="text-[10px] opacity-90">PTR</div>
                <div className="text-base sm:text-xl font-black mt-0.5">{results.ptrWithoutGst.toFixed(2)}</div>
              </div>
              <div className="bg-amber-500 p-2.5">
                <div className="text-[10px] opacity-90">Net Rate</div>
                <div className="text-base sm:text-xl font-black mt-0.5">{results.netRateWithoutGst.toFixed(2)}</div>
              </div>
              <div className="bg-emerald-600 p-2.5">
                <div className="text-[10px] opacity-90 font-black">CD/Dis. PTR</div>
                <div className="text-base sm:text-xl font-black mt-0.5">{results.cdDiscountPtrWithoutGst.toFixed(2)}</div>
              </div>
            </div>
          </div>

          {/* Inputs */}
          <div className="bg-slate-50 p-3 sm:p-5 rounded-2xl border border-slate-200 space-y-3 sm:space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4">
              <div>
                <label className="block text-[10px] sm:text-[11px] font-bold text-slate-700 uppercase mb-1">MRP (₹)</label>
                <input
                  type="number"
                  inputMode="decimal"
                  value={inputs.mrp}
                  onChange={(e) => handleInputChange('mrp', e.target.value)}
                  className="w-full px-2.5 py-2 bg-white text-slate-900 font-bold text-sm sm:text-base border-2 border-teal-600 rounded-xl"
                  placeholder="1350"
                />
              </div>

              <div>
                <label className="block text-[10px] sm:text-[11px] font-bold text-slate-700 uppercase mb-1">GST %</label>
                <input
                  type="number"
                  inputMode="decimal"
                  value={inputs.gstPercent}
                  onChange={(e) => handleInputChange('gstPercent', e.target.value)}
                  className="w-full px-2.5 py-2 bg-white text-slate-900 font-bold text-sm sm:text-base border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-[10px] sm:text-[11px] font-bold text-slate-700 uppercase mb-1">Sch. %</label>
                <input
                  type="number"
                  inputMode="decimal"
                  value={inputs.schemePercent}
                  onChange={(e) => handleInputChange('schemePercent', e.target.value)}
                  className="w-full px-2.5 py-2 bg-white text-slate-900 font-bold text-sm sm:text-base border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-[10px] sm:text-[11px] font-bold text-slate-700 uppercase mb-1">Dis. %</label>
                <input
                  type="number"
                  inputMode="decimal"
                  value={inputs.discountPercent}
                  onChange={(e) => handleInputChange('discountPercent', e.target.value)}
                  className="w-full px-2.5 py-2 bg-white text-slate-900 font-bold text-sm sm:text-base border border-slate-300 rounded-xl"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5 sm:gap-4">
              <div>
                <label className="block text-[10px] sm:text-[11px] font-bold text-slate-700 uppercase mb-1">Stockiest %</label>
                <input
                  type="number"
                  inputMode="decimal"
                  value={inputs.stockistMarginPercent}
                  onChange={(e) => handleInputChange('stockistMarginPercent', e.target.value)}
                  className="w-full px-2.5 py-2 bg-white text-slate-900 font-bold text-sm sm:text-base border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-[10px] sm:text-[11px] font-bold text-slate-700 uppercase mb-1">Retail %</label>
                <input
                  type="number"
                  inputMode="decimal"
                  value={inputs.retailMarginPercent}
                  onChange={(e) => handleInputChange('retailMarginPercent', e.target.value)}
                  className="w-full px-2.5 py-2 bg-white text-slate-900 font-bold text-sm sm:text-base border border-slate-300 rounded-xl"
                />
              </div>
            </div>
          </div>

          {/* Grid Including GST */}
          <div>
            <div className="bg-emerald-700 text-white text-[10px] sm:text-xs font-black uppercase tracking-wider px-3 py-1.5 rounded-t-xl text-center">
              PTR / PTS Including GST
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 text-center text-white font-bold text-xs sm:text-sm">
              <div className="bg-red-600 p-2.5">
                <div className="text-[10px] opacity-90">PTS (Inc GST)</div>
                <div className="text-base sm:text-xl font-black mt-0.5">{results.ptsWithGst.toFixed(2)}</div>
              </div>
              <div className="bg-blue-600 p-2.5">
                <div className="text-[10px] opacity-90">PTR (Inc GST)</div>
                <div className="text-base sm:text-xl font-black mt-0.5">{results.ptrWithGst.toFixed(2)}</div>
              </div>
              <div className="bg-amber-500 p-2.5">
                <div className="text-[10px] opacity-90">Net Rate</div>
                <div className="text-base sm:text-xl font-black mt-0.5">{results.netRateWithGst.toFixed(2)}</div>
              </div>
              <div className="bg-emerald-600 p-2.5">
                <div className="text-[10px] opacity-90">CD/Dis. PTR</div>
                <div className="text-base sm:text-xl font-black mt-0.5">{results.cdDiscountPtrWithGst.toFixed(2)}</div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Special Rate View */
        <div className="p-4 sm:p-6 space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">MRP (₹)</label>
              <input
                type="number"
                inputMode="decimal"
                value={specialInputs.mrp}
                onChange={(e) => setSpecialInputs(prev => ({ ...prev, mrp: e.target.value }))}
                className="w-full px-2.5 py-2 bg-white text-slate-900 font-bold border border-slate-300 rounded-xl text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Special PTS</label>
              <input
                type="number"
                inputMode="decimal"
                value={specialInputs.pts}
                onChange={(e) => setSpecialInputs(prev => ({ ...prev, pts: e.target.value }))}
                className="w-full px-2.5 py-2 bg-white text-slate-900 font-bold border border-slate-300 rounded-xl text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Special PTR</label>
              <input
                type="number"
                inputMode="decimal"
                value={specialInputs.ptr}
                onChange={(e) => setSpecialInputs(prev => ({ ...prev, ptr: e.target.value }))}
                className="w-full px-2.5 py-2 bg-white text-slate-900 font-bold border border-slate-300 rounded-xl text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">GST %</label>
              <input
                type="number"
                inputMode="decimal"
                value={specialInputs.gstPercent}
                onChange={(e) => setSpecialInputs(prev => ({ ...prev, gstPercent: e.target.value }))}
                className="w-full px-2.5 py-2 bg-white text-slate-900 font-bold border border-slate-300 rounded-xl text-sm"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
