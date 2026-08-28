import React, { useState } from 'react';
import { calculateSingleDeal, formatINR, formatNumber } from '../utils/pharmaMath';
import { 
  TrendingUp, 
  TrendingDown, 
  PackageCheck, 
  Gift, 
  Wallet, 
  CheckCircle2, 
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Info,
  PlusCircle
} from 'lucide-react';
import { PRESET_DEALS } from '../data/presets';

export default function SingleDealSimulator({ inputs, setInputs, onPushToBatch }) {
  const [productNameInput, setProductNameInput] = useState('Amoxyclav 625mg');
  const results = calculateSingleDeal(inputs);

  const handleInputChange = (field, value) => {
    setInputs(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePresetSelect = (preset) => {
    setInputs({
      ptr: preset.ptr,
      targetBill: preset.targetBill,
      schemePercent: preset.schemePercent,
      pts: preset.pts,
      doctorCrm: preset.doctorCrm
    });
  };

  const isProfit = results.netProfit >= 0;
  const quickSchemes = [20, 30, 40];

  return (
    <div className="space-y-6">
      {/* Quick Preset Selector */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center space-x-2 text-teal-800 font-semibold text-sm">
          <Sparkles className="w-5 h-5 text-amber-500" />
          <span>Quick Deal Templates:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {PRESET_DEALS.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => handlePresetSelect(preset)}
              className="text-xs bg-teal-50 text-teal-700 hover:bg-teal-100 border border-teal-200 px-3 py-1.5 rounded-lg font-medium transition-colors"
            >
              {preset.name}
            </button>
          ))}
          <button
            onClick={() => setInputs({ ptr: 987.43, targetBill: 45000, schemePercent: 30, pts: 130, doctorCrm: 15000 })}
            className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1.5 rounded-lg font-medium flex items-center space-x-1"
            title="Reset to default values"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Input Controls */}
        <div className="lg:col-span-5 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
          <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-800 flex items-center space-x-2">
              <span className="w-2.5 h-6 bg-teal-600 rounded-full"></span>
              <span>Deal Input Parameters</span>
            </h2>
            <span className="text-xs text-slate-500 font-medium bg-slate-100 px-2 py-1 rounded">Instant Sync</span>
          </div>

          {/* Product Name for Batch Link */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Product Name (For Batch Grid Link)
            </label>
            <input
              type="text"
              value={productNameInput}
              onChange={(e) => setProductNameInput(e.target.value)}
              className="w-full px-3 py-2 text-slate-900 font-bold text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500"
              placeholder="e.g. Amoxyclav 625mg"
            />
          </div>

          {/* Input 1: Target Bill Amount */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              1. Target Total Bill Amount (₹)
            </label>
            <div className="relative rounded-xl shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 font-semibold">₹</div>
              <input
                type="number"
                value={inputs.targetBill}
                onChange={(e) => handleInputChange('targetBill', e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-slate-900 font-bold text-lg bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 transition-all"
                placeholder="45000"
              />
            </div>
          </div>

          {/* Input 2: PTR */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              2. PTR / Billing Price per Box (₹)
            </label>
            <div className="relative rounded-xl shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 font-semibold">₹</div>
              <input
                type="number"
                value={inputs.ptr}
                onChange={(e) => handleInputChange('ptr', e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-slate-900 font-bold text-lg bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 transition-all"
                placeholder="987.43"
              />
            </div>
          </div>

          {/* Input 3: Free Scheme % */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                3. Free Quantity Scheme (%)
              </label>
              <span className="text-xs font-bold text-teal-700">{inputs.schemePercent}% Scheme</span>
            </div>
            
            <div className="grid grid-cols-4 gap-2 mb-2">
              {[20, 30, 40, 50].map((sc) => (
                <button
                  key={sc}
                  type="button"
                  onClick={() => handleInputChange('schemePercent', sc)}
                  className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                    Number(inputs.schemePercent) === sc
                      ? 'bg-teal-600 text-white shadow-sm ring-2 ring-teal-600 ring-offset-1'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {sc}% Free
                </button>
              ))}
            </div>

            <div className="relative rounded-xl shadow-sm">
              <input
                type="number"
                value={inputs.schemePercent}
                onChange={(e) => handleInputChange('schemePercent', e.target.value)}
                className="w-full pl-4 pr-10 py-2.5 text-slate-900 font-bold text-lg bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 transition-all"
                placeholder="30"
              />
              <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400 font-bold">%</div>
            </div>
          </div>

          {/* Input 4: Net Rate */}
          <div>
            <label className="block text-xs font-bold text-teal-900 uppercase tracking-wider mb-1 flex items-center justify-between">
              <span>4. Net Rate per Box (₹)</span>
              <span className="text-[10px] bg-teal-100 text-teal-800 font-bold px-2 py-0.5 rounded">CUSTOM ENTRY</span>
            </label>
            <div className="relative rounded-xl shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 font-semibold">₹</div>
              <input
                type="number"
                value={inputs.pts}
                onChange={(e) => handleInputChange('pts', e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-slate-900 font-bold text-lg bg-teal-50/50 border border-teal-300 rounded-xl focus:ring-2 focus:ring-teal-500 transition-all"
                placeholder="130"
              />
            </div>
          </div>

          {/* Input 5: Doctor CRM */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              5. Doctor CRM / Expense Amount (₹)
            </label>
            <div className="relative rounded-xl shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 font-semibold">₹</div>
              <input
                type="number"
                value={inputs.doctorCrm}
                onChange={(e) => handleInputChange('doctorCrm', e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-slate-900 font-bold text-lg bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 transition-all"
                placeholder="15000"
              />
            </div>
          </div>

          {/* LINK BUTTON TO SEND THIS SIMULATED DEAL TO BATCH GRID */}
          {onPushToBatch && (
            <button
              onClick={() => onPushToBatch(productNameInput)}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl shadow flex items-center justify-center space-x-2 text-xs uppercase tracking-wider transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add This Calculated Deal To Batch Excel Grid →</span>
            </button>
          )}
        </div>

        {/* Right Column: Live Output Summary Cards */}
        <div className="lg:col-span-7 space-y-5">
          <div className={`p-6 rounded-2xl shadow-md border transition-all ${
            isProfit 
              ? 'bg-gradient-to-br from-emerald-950 via-teal-900 to-slate-900 text-white border-emerald-500/40' 
              : 'bg-gradient-to-br from-red-950 via-rose-900 to-slate-900 text-white border-red-500/40'
          }`}>
            <div className="flex justify-between items-start mb-2">
              <div>
                <span className="text-xs uppercase font-bold tracking-widest text-emerald-300/80 bg-emerald-900/40 px-2.5 py-1 rounded-full border border-emerald-500/20">
                  Real-time Net Result
                </span>
                <h3 className="text-sm font-semibold text-slate-200 mt-2">Calculated Net Profit</h3>
              </div>
              <div className={`p-3 rounded-xl ${isProfit ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'}`}>
                {isProfit ? <TrendingUp className="w-8 h-8" /> : <TrendingDown className="w-8 h-8" />}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 mt-2">
              <div>
                <div className={`text-4xl sm:text-5xl font-black tracking-tight ${isProfit ? 'text-emerald-400' : 'text-red-400'}`}>
                  {formatINR(results.netProfit)}
                </div>
                <div className="text-xs text-slate-300 mt-1 flex items-center space-x-1">
                  <span>Gross Bill ({formatINR(results.targetBill)})</span>
                  <span>-</span>
                  <span>Total Cost ({formatINR(results.totalExpense)})</span>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-xl border border-white/10 text-right">
                <div className="text-xs text-slate-300 font-medium">Profit Margin</div>
                <div className={`text-2xl font-black ${isProfit ? 'text-amber-300' : 'text-red-300'}`}>
                  {formatNumber(results.profitMargin, 1)}%
                </div>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                {isProfit ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-200 font-medium">Deal is Highly Profitable</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                    <span className="text-red-200 font-medium">Deal is Operating at a Loss! Reduce CRM or Scheme.</span>
                  </>
                )}
              </div>
              <div className="text-slate-300 font-mono text-[11px]">
                Eff. Cost: ₹{formatNumber(results.effectiveCostPerBox, 1)} / box
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 mb-1">
                <span className="text-xs font-semibold uppercase">Billed Qty</span>
                <PackageCheck className="w-4 h-4 text-teal-600" />
              </div>
              <div className="text-2xl font-black text-slate-800">
                {formatNumber(results.billedQty, 1)}
              </div>
              <span className="text-[11px] text-slate-500">Boxes ({inputs.targetBill} ÷ {inputs.ptr})</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 mb-1">
                <span className="text-xs font-semibold uppercase">Free Qty</span>
                <Gift className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-2xl font-black text-amber-600">
                {formatNumber(results.freeQty, 1)}
              </div>
              <span className="text-[11px] text-slate-500">Boxes ({inputs.schemePercent}% bonus)</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 mb-1">
                <span className="text-xs font-semibold uppercase">Total Stock Qty</span>
                <PackageCheck className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="text-2xl font-black text-indigo-900">
                {formatNumber(results.totalQty, 1)}
              </div>
              <span className="text-[11px] text-slate-500">Billed + Free Boxes</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 mb-1">
                <span className="text-xs font-semibold uppercase">Stock Cost</span>
                <Wallet className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-xl font-bold text-slate-800">
                {formatINR(results.totalPurchaseCost)}
              </div>
              <span className="text-[11px] text-slate-500">{formatNumber(results.totalQty, 0)} boxes × ₹{inputs.pts}</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
              <span>Financial Deal Breakdown</span>
              <span className="text-teal-700 font-semibold">{results.crmPercentOfBill.toFixed(1)}% CRM Impact</span>
            </h4>

            <div className="divide-y divide-slate-100 text-sm">
              <div className="py-2 flex justify-between">
                <span className="text-slate-600">Total Bill Amount (Gross Revenue)</span>
                <span className="font-bold text-slate-900">{formatINR(results.targetBill)}</span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-slate-600">Total Purchase Cost ({formatNumber(results.totalQty, 1)} boxes @ ₹{inputs.pts})</span>
                <span className="font-semibold text-slate-800">- {formatINR(results.totalPurchaseCost)}</span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-slate-600">Doctor CRM / Expense</span>
                <span className="font-semibold text-amber-700">- {formatINR(results.doctorCrm)}</span>
              </div>
              <div className="py-2.5 flex justify-between font-bold text-base bg-slate-50 px-3 rounded-lg mt-1">
                <span className="text-teal-900">Net Profit Remaining</span>
                <span className={isProfit ? 'text-emerald-700' : 'text-red-600'}>
                  {formatINR(results.netProfit)}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-teal-50/70 p-4 rounded-xl border border-teal-200/80">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2 text-teal-900 font-bold text-xs">
                <Info className="w-4 h-4 text-teal-600" />
                <span>Quick Scheme Comparison (20% vs 30% vs 40%)</span>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              {quickSchemes.map(sch => {
                const alt = calculateSingleDeal({ ...inputs, schemePercent: sch });
                const isCurrent = Number(inputs.schemePercent) === sch;
                return (
                  <div 
                    key={sch}
                    onClick={() => handleInputChange('schemePercent', sch)}
                    className={`p-2.5 rounded-lg cursor-pointer transition-all ${
                      isCurrent 
                        ? 'bg-teal-700 text-white font-bold shadow-sm ring-2 ring-teal-500' 
                        : 'bg-white text-slate-800 border border-teal-200 hover:border-teal-400'
                    }`}
                  >
                    <div className="text-[11px] opacity-80">{sch}% Free Scheme</div>
                    <div className="text-sm font-black my-0.5">
                      {formatINR(alt.netProfit)}
                    </div>
                    <div className={`text-[10px] ${isCurrent ? 'text-teal-100' : 'text-teal-700 font-semibold'}`}>
                      {alt.profitMargin.toFixed(1)}% Margin
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
