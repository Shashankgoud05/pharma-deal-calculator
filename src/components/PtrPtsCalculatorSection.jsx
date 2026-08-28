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

  const [redirectSource, setRedirectSource] = useState('cdDiscountPtr'); // CD/Dis PTR (987.43)
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

  // REAL-TIME AUTO SYNC EFFECT (ONLY SYNC PTR TO TOP, DO NOT TOUCH NET RATE / PTS):
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
    <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden my-6">
      {/* BRANDING RENAMED TO: RAJESH_CALCULATOR */}
      <div className="bg-slate-900 text-white p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center font-black text-xl text-slate-950 shadow">
            R
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white uppercase">RAJESH_CALCULATOR</span>
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center space-x-1">
                <Zap className="w-3 h-3 text-amber-400" />
                <span>PTR SYNC: ₹{selectedPtrToSync.toFixed(0)}</span>
              </span>
            </div>
            <p className="text-xs text-slate-300">
              CD/Dis. PTR (₹{selectedPtrToSync.toFixed(2)}) paina PTR Field ki matrame auto-sync avthundhi!
            </p>
          </div>
        </div>

        {/* Sub Navigation Tabs */}
        <div className="flex bg-slate-800 p-1 rounded-xl border border-slate-700">
          <button
            onClick={() => setSubTab('ptr-pts')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              subTab === 'ptr-pts'
                ? 'bg-teal-600 text-white shadow'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            PTR - PTS
          </button>
          <button
            onClick={() => setSubTab('special-rate')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              subTab === 'special-rate'
                ? 'bg-teal-600 text-white shadow'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            SPECIAL RATE
          </button>
        </div>
      </div>

      {/* Main Content Body */}
      {subTab === 'ptr-pts' ? (
        <div className="p-4 sm:p-6 space-y-6">
          
          {/* Redirect Selector Bar */}
          <div className="bg-slate-100 p-3 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center space-x-2 font-bold text-slate-800">
              <span>Select Redirect Target to PTR Field Above:</span>
            </div>

            <div className="flex flex-wrap items-center gap-2 font-semibold">
              <button
                type="button"
                onClick={() => setRedirectSource('cdDiscountPtr')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  redirectSource === 'cdDiscountPtr'
                    ? 'bg-emerald-600 text-white shadow font-bold ring-2 ring-emerald-500'
                    : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-300'
                }`}
              >
                CD / Dis. PTR (₹{includeGstInSync ? results.cdDiscountPtrWithGst.toFixed(0) : results.cdDiscountPtrWithoutGst.toFixed(0)})
              </button>

              <button
                type="button"
                onClick={() => setRedirectSource('ptr')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  redirectSource === 'ptr'
                    ? 'bg-blue-600 text-white shadow font-bold ring-2 ring-blue-500'
                    : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-300'
                }`}
              >
                Standard PTR (₹{includeGstInSync ? results.ptrWithGst.toFixed(0) : results.ptrWithoutGst.toFixed(0)})
              </button>

              <label className="flex items-center space-x-1.5 bg-white px-2.5 py-1 rounded-lg border border-slate-300 text-slate-800 font-bold cursor-pointer ml-2">
                <input
                  type="checkbox"
                  checked={includeGstInSync}
                  onChange={(e) => setIncludeGstInSync(e.target.checked)}
                  className="rounded text-teal-600 focus:ring-teal-500"
                />
                <span>Include GST</span>
              </label>
            </div>
          </div>

          {/* Section 1: PTR/PTS Without GST Grid */}
          <div>
            <div className="bg-emerald-700 text-white text-xs font-black uppercase tracking-wider px-3 py-2 rounded-t-xl text-center flex items-center justify-center space-x-2">
              <span>PTR / PTS without GST</span>
              {!includeGstInSync && <span className="bg-amber-400 text-slate-950 text-[10px] px-2 py-0.5 rounded-full font-black">ACTIVE REDIRECT SOURCE</span>}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 text-center text-white font-bold">
              <div className="bg-red-600 p-3">
                <div className="text-[11px] opacity-90">PTS</div>
                <div className="text-xl sm:text-2xl font-black mt-0.5">{results.ptsWithoutGst.toFixed(2)}</div>
              </div>
              <div className={`bg-blue-600 p-3 ${redirectSource === 'ptr' && !includeGstInSync ? 'ring-4 ring-amber-400 ring-offset-2 z-10' : ''}`}>
                <div className="text-[11px] opacity-90">PTR</div>
                <div className="text-xl sm:text-2xl font-black mt-0.5">{results.ptrWithoutGst.toFixed(2)}</div>
              </div>
              <div className="bg-amber-500 p-3">
                <div className="text-[11px] opacity-90">Net Rate (PTR)</div>
                <div className="text-xl sm:text-2xl font-black mt-0.5">{results.netRateWithoutGst.toFixed(2)}</div>
              </div>
              <div className={`bg-emerald-600 p-3 ${redirectSource === 'cdDiscountPtr' && !includeGstInSync ? 'ring-4 ring-amber-400 ring-offset-2 z-10' : ''}`}>
                <div className="text-[11px] opacity-90 font-black">CD / Dis. (PTR)</div>
                <div className="text-xl sm:text-2xl font-black mt-0.5">{results.cdDiscountPtrWithoutGst.toFixed(2)}</div>
                {redirectSource === 'cdDiscountPtr' && !includeGstInSync && (
                  <span className="bg-amber-400 text-slate-950 text-[9px] px-1.5 py-0.5 rounded font-black mt-1 inline-block">PTR REDIRECTED</span>
                )}
              </div>
            </div>
          </div>

          {/* Section 2: Input Controls */}
          <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">MRP (₹)</label>
                <input
                  type="number"
                  value={inputs.mrp}
                  onChange={(e) => handleInputChange('mrp', e.target.value)}
                  className="w-full px-3 py-2 bg-white text-slate-900 font-bold text-base border-2 border-teal-600 rounded-xl focus:ring-2 focus:ring-teal-600 shadow-sm"
                  placeholder="1350"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">GST %</label>
                <input
                  type="number"
                  value={inputs.gstPercent}
                  onChange={(e) => handleInputChange('gstPercent', e.target.value)}
                  className="w-full px-3 py-2 bg-white text-slate-900 font-bold text-base border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-600"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Sch. %</label>
                <input
                  type="number"
                  value={inputs.schemePercent}
                  onChange={(e) => handleInputChange('schemePercent', e.target.value)}
                  className="w-full px-3 py-2 bg-white text-slate-900 font-bold text-base border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-600"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Dis. %</label>
                <input
                  type="number"
                  value={inputs.discountPercent}
                  onChange={(e) => handleInputChange('discountPercent', e.target.value)}
                  className="w-full px-3 py-2 bg-white text-slate-900 font-bold text-base border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Stockiest Margin %</label>
                <input
                  type="number"
                  value={inputs.stockistMarginPercent}
                  onChange={(e) => handleInputChange('stockistMarginPercent', e.target.value)}
                  className="w-full px-3 py-2 bg-white text-slate-900 font-bold text-base border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-600"
                  placeholder="10"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Retail Margin %</label>
                <input
                  type="number"
                  value={inputs.retailMarginPercent}
                  onChange={(e) => handleInputChange('retailMarginPercent', e.target.value)}
                  className="w-full px-3 py-2 bg-white text-slate-900 font-bold text-base border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-600"
                  placeholder="20"
                />
              </div>
            </div>
          </div>

          {/* Section 3: PTR/PTS Including GST Grid */}
          <div>
            <div className="bg-emerald-700 text-white text-xs font-black uppercase tracking-wider px-3 py-2 rounded-t-xl text-center flex items-center justify-center space-x-2">
              <span>PTR / PTS Including GST</span>
              {includeGstInSync && <span className="bg-amber-400 text-slate-950 text-[10px] px-2 py-0.5 rounded-full font-black">ACTIVE REDIRECT SOURCE</span>}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 text-center text-white font-bold">
              <div className="bg-red-600 p-3">
                <div className="text-[11px] opacity-90">PTS (Inc GST)</div>
                <div className="text-xl sm:text-2xl font-black mt-0.5">{results.ptsWithGst.toFixed(2)}</div>
              </div>
              <div className={`bg-blue-600 p-3 ${redirectSource === 'ptr' && includeGstInSync ? 'ring-4 ring-amber-400 ring-offset-2 z-10' : ''}`}>
                <div className="text-[11px] opacity-90">PTR (Inc GST)</div>
                <div className="text-xl sm:text-2xl font-black mt-0.5">{results.ptrWithGst.toFixed(2)}</div>
              </div>
              <div className="bg-amber-500 p-3">
                <div className="text-[11px] opacity-90">Net Rate (PTR)</div>
                <div className="text-xl sm:text-2xl font-black mt-0.5">{results.netRateWithGst.toFixed(2)}</div>
              </div>
              <div className={`bg-emerald-600 p-3 ${redirectSource === 'cdDiscountPtr' && includeGstInSync ? 'ring-4 ring-amber-400 ring-offset-2 z-10' : ''}`}>
                <div className="text-[11px] opacity-90">CD / Dis. (PTR)</div>
                <div className="text-xl sm:text-2xl font-black mt-0.5">{results.cdDiscountPtrWithGst.toFixed(2)}</div>
                {redirectSource === 'cdDiscountPtr' && includeGstInSync && (
                  <span className="bg-amber-400 text-slate-950 text-[9px] px-1.5 py-0.5 rounded font-black mt-1 inline-block">PTR REDIRECTED</span>
                )}
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
            <button
              onClick={handleReset}
              className="w-full sm:w-auto bg-slate-800 hover:bg-slate-900 text-white font-bold py-2.5 px-6 rounded-xl shadow-sm text-xs uppercase tracking-wide flex items-center justify-center space-x-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset Values</span>
            </button>

            <div className="text-xs text-emerald-800 font-bold bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-200 flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>CD/Dis PTR ₹{selectedPtrToSync.toFixed(2)} paina PTR field loki sync avthundhi! (Net Rate meere manual ga ivvachu)</span>
            </div>
          </div>
        </div>
      ) : (
        /* Special Rate View */
        <div className="p-4 sm:p-6 space-y-6">
          <div className="bg-slate-100 p-4 rounded-xl border border-slate-300">
            <h3 className="text-sm font-bold text-slate-900 mb-1">Special Net Rate & Margin Calculator</h3>
            <p className="text-xs text-slate-700">
              Enter custom MRP, PTS, and PTR values to calculate effective retail and stockist margin percentages.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">MRP (₹)</label>
              <input
                type="number"
                value={specialInputs.mrp}
                onChange={(e) => setSpecialInputs(prev => ({ ...prev, mrp: e.target.value }))}
                className="w-full px-3 py-2 bg-white text-slate-900 font-bold border border-slate-300 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Special PTS (₹)</label>
              <input
                type="number"
                value={specialInputs.pts}
                onChange={(e) => setSpecialInputs(prev => ({ ...prev, pts: e.target.value }))}
                className="w-full px-3 py-2 bg-white text-slate-900 font-bold border border-slate-300 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Special PTR (₹)</label>
              <input
                type="number"
                value={specialInputs.ptr}
                onChange={(e) => setSpecialInputs(prev => ({ ...prev, ptr: e.target.value }))}
                className="w-full px-3 py-2 bg-white text-slate-900 font-bold border border-slate-300 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">GST %</label>
              <input
                type="number"
                value={specialInputs.gstPercent}
                onChange={(e) => setSpecialInputs(prev => ({ ...prev, gstPercent: e.target.value }))}
                className="w-full px-3 py-2 bg-white text-slate-900 font-bold border border-slate-300 rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-900 text-white p-4 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 font-medium">Calculated Retail Margin</span>
              <div className="text-3xl font-black text-emerald-400 mt-1">
                {specialResults.calculatedRetailMargin.toFixed(2)}%
              </div>
            </div>

            <div className="bg-slate-900 text-white p-4 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 font-medium">Calculated Stockist Margin</span>
              <div className="text-3xl font-black text-amber-400 mt-1">
                {specialResults.calculatedStockistMargin.toFixed(2)}%
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
