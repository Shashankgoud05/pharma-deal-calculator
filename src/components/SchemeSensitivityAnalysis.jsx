import React, { useState } from 'react';
import { calculateSingleDeal, formatINR, formatNumber } from '../utils/pharmaMath';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid, 
  Legend, 
  ReferenceLine,
  Cell
} from 'recharts';
import { 
  ShieldCheck, 
  AlertOctagon, 
  TrendingUp, 
  BarChart2, 
  CheckCircle2, 
  Clock, 
  Zap,
  HelpCircle
} from 'lucide-react';

export default function SchemeSensitivityAnalysis({ inputs }) {
  const [creditPeriodDays, setCreditPeriodDays] = useState(45);
  const [costOfCapitalPercent, setCostOfCapitalPercent] = useState(1.5); // 1.5% per month interest/cost of credit

  // Evaluated schemes range: 10% to 50%
  const schemesToCompare = [10, 15, 20, 25, 30, 35, 40, 45, 50];

  const analysisData = schemesToCompare.map(scheme => {
    const res = calculateSingleDeal({ ...inputs, schemePercent: scheme });
    
    // Financing cost for 45-day credit cycle = (Total Purchase Cost + Doctor CRM) * (interest rate per month * credit days / 30)
    const financingCost = (res.totalExpense * (costOfCapitalPercent / 100) * (creditPeriodDays / 30));
    const netProfitAfterCreditCost = res.netProfit - financingCost;
    const adjustedMargin = inputs.targetBill > 0 ? (netProfitAfterCreditCost / inputs.targetBill) * 100 : 0;

    return {
      scheme,
      schemeLabel: `${scheme}% Scheme`,
      netProfit: Math.round(res.netProfit),
      margin: Number(res.profitMargin.toFixed(1)),
      freeQty: Math.round(res.freeQty),
      totalQty: Math.round(res.totalQty),
      purchaseCost: Math.round(res.totalPurchaseCost),
      totalExpense: Math.round(res.totalExpense),
      financingCost: Math.round(financingCost),
      netProfitAfterCredit: Math.round(netProfitAfterCreditCost),
      adjustedMargin: Number(adjustedMargin.toFixed(1)),
      isCurrent: Number(inputs.schemePercent) === scheme
    };
  });

  // Highlighted key benchmark schemes (20%, 30%, 40%) as requested
  const keyBenchmarks = [20, 30, 40].map(s => {
    return analysisData.find(d => d.scheme === s) || analysisData[0];
  });

  // Find safest scheme recommendation
  const safestScheme = analysisData.reduce((prev, curr) => {
    // safest is scheme with highest positive profit after credit cost while maintaining healthy margin
    return (curr.netProfitAfterCredit > prev.netProfitAfterCredit) ? curr : prev;
  }, analysisData[0]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-teal-950 p-6 rounded-2xl text-white shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 bg-amber-500/20 text-amber-300 text-xs px-3 py-1 rounded-full border border-amber-500/30 font-bold mb-2">
              <Zap className="w-3.5 h-3.5" />
              <span>What-If Risk & Margin Simulator</span>
            </div>
            <h2 className="text-2xl font-black">45-Day Credit Scheme Sensitivity Analysis</h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Compare profit drop-offs and capital holding costs across 20%, 30%, and 40% free schemes to protect distributor cashflow over credit payment cycles.
            </p>
          </div>

          {/* Credit Cycle Control Box */}
          <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/15 flex flex-wrap items-center gap-3">
            <div>
              <label className="block text-[10px] font-bold text-slate-300 uppercase">Credit Cycle</label>
              <select
                value={creditPeriodDays}
                onChange={(e) => setCreditPeriodDays(Number(e.target.value))}
                className="bg-slate-900 text-white font-bold text-xs px-2.5 py-1.5 rounded-lg border border-slate-700 focus:outline-none"
              >
                <option value={30}>30 Days Credit</option>
                <option value={45}>45 Days Credit (Standard)</option>
                <option value={60}>60 Days Credit</option>
                <option value={90}>90 Days Extended</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-300 uppercase">Capital Cost/Mo</label>
              <select
                value={costOfCapitalPercent}
                onChange={(e) => setCostOfCapitalPercent(Number(e.target.value))}
                className="bg-slate-900 text-white font-bold text-xs px-2.5 py-1.5 rounded-lg border border-slate-700 focus:outline-none"
              >
                <option value={0}>0% (Zero Interest)</option>
                <option value={1}>1% / Month</option>
                <option value={1.5}>1.5% / Month (Standard)</option>
                <option value={2}>2% / Month</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Benchmark 20% vs 30% vs 40% Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {keyBenchmarks.map((bm) => {
          const isSelected = Number(inputs.schemePercent) === bm.scheme;
          const isSafe = bm.netProfitAfterCredit > 0 && bm.adjustedMargin >= 15;
          return (
            <div 
              key={bm.scheme} 
              className={`p-5 rounded-2xl border transition-all ${
                isSelected 
                  ? 'bg-teal-900 text-white border-teal-500 shadow-md ring-2 ring-teal-500' 
                  : 'bg-white text-slate-900 border-slate-200 shadow-sm hover:border-teal-300'
              }`}
            >
              <div className="flex justify-between items-center mb-3">
                <span className={`text-xs font-black uppercase px-2.5 py-1 rounded-full ${
                  isSelected 
                    ? 'bg-amber-400 text-slate-950' 
                    : 'bg-teal-100 text-teal-800'
                }`}>
                  {bm.scheme}% Scheme {isSelected && '(Active)'}
                </span>
                <span className={`text-xs font-bold ${bm.netProfitAfterCredit >= 0 ? (isSelected ? 'text-emerald-300' : 'text-emerald-600') : 'text-red-500'}`}>
                  {bm.adjustedMargin}% Net Margin
                </span>
              </div>

              <div className="space-y-2">
                <div>
                  <div className="text-[11px] opacity-75">Nominal Net Profit</div>
                  <div className="text-2xl font-black">{formatINR(bm.netProfit)}</div>
                </div>

                <div className="pt-2 border-t border-slate-200/20 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] opacity-70 block">Free Bonus Qty</span>
                    <span className="font-bold">{bm.freeQty} Boxes</span>
                  </div>
                  <div>
                    <span className="text-[10px] opacity-70 block">Total Stock Cost</span>
                    <span className="font-bold">{formatINR(bm.purchaseCost)}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200/20 flex justify-between items-center text-xs">
                  <span className="text-[11px] opacity-80">After {creditPeriodDays}-Day Interest:</span>
                  <span className={`font-black ${bm.netProfitAfterCredit >= 0 ? (isSelected ? 'text-emerald-300' : 'text-emerald-700') : 'text-red-500'}`}>
                    {formatINR(bm.netProfitAfterCredit)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Visual Recharts Bar Graph */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-base font-bold text-slate-800 flex items-center space-x-2">
              <BarChart2 className="w-5 h-5 text-teal-600" />
              <span>Profit vs Scheme % Sensitivity Curve</span>
            </h3>
            <p className="text-xs text-slate-500">
              Visual representation of profit decline as free bonus quantity percentage increases.
            </p>
          </div>
          <div className="flex items-center space-x-3 text-xs font-semibold">
            <span className="flex items-center space-x-1">
              <span className="w-3 h-3 bg-teal-600 rounded"></span>
              <span>Net Profit (₹)</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-3 h-3 bg-amber-500 rounded"></span>
              <span>After Credit Cost (₹)</span>
            </span>
          </div>
        </div>

        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={analysisData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="schemeLabel" tick={{ fontSize: 11, fontWeight: 600 }} />
              <YAxis tickFormatter={(val) => `₹${(val/1000).toFixed(0)}k`} tick={{ fontSize: 11 }} />
              <Tooltip 
                formatter={(value, name) => [formatINR(value), name === 'netProfit' ? 'Nominal Profit' : 'After Credit Profit']}
                contentStyle={{ borderRadius: '12px', border: '1px solid #cbd5e1', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
              />
              <ReferenceLine y={0} stroke="#ef4444" strokeDasharray="3 3" />
              <Bar dataKey="netProfit" fill="#0d9488" radius={[6, 6, 0, 0]}>
                {analysisData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.isCurrent ? '#f59e0b' : '#0d9488'} />
                ))}
              </Bar>
              <Bar dataKey="netProfitAfterCredit" fill="#cbd5e1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Comprehensive Comparative Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Full Scheme Sensitivity Matrix (10% to 50%)
          </h4>
          <span className="text-xs text-teal-800 font-semibold">
            Based on PTR ₹{inputs.ptr} | Target Bill ₹{inputs.targetBill}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-900 text-slate-200 uppercase font-bold">
                <th className="p-3">Scheme %</th>
                <th className="p-3 text-right">Free Qty</th>
                <th className="p-3 text-right">Total Qty Needed</th>
                <th className="p-3 text-right">Total Stock Cost</th>
                <th className="p-3 text-right">Doctor CRM</th>
                <th className="p-3 text-right">Total Expense</th>
                <th className="p-3 text-right text-emerald-400">Net Profit (₹)</th>
                <th className="p-3 text-right">Margin %</th>
                <th className="p-3 text-right text-amber-300">After 45d Credit (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-medium text-slate-800">
              {analysisData.map((row) => {
                const isLoss = row.netProfit < 0;
                return (
                  <tr 
                    key={row.scheme}
                    className={`hover:bg-slate-50 transition-colors ${
                      row.isCurrent ? 'bg-amber-50/80 font-bold border-l-4 border-l-amber-500' : ''
                    }`}
                  >
                    <td className="p-3 font-bold flex items-center space-x-1.5">
                      <span>{row.scheme}% Scheme</span>
                      {row.isCurrent && (
                        <span className="text-[10px] bg-amber-500 text-white px-1.5 py-0.5 rounded font-black">ACTIVE</span>
                      )}
                    </td>
                    <td className="p-3 text-right text-amber-700 font-bold">{row.freeQty} boxes</td>
                    <td className="p-3 text-right">{row.totalQty} boxes</td>
                    <td className="p-3 text-right">{formatINR(row.purchaseCost)}</td>
                    <td className="p-3 text-right">{formatINR(inputs.doctorCrm)}</td>
                    <td className="p-3 text-right font-semibold">{formatINR(row.totalExpense)}</td>
                    <td className={`p-3 text-right font-black ${isLoss ? 'text-red-600 bg-red-50' : 'text-emerald-700 bg-emerald-50'}`}>
                      {formatINR(row.netProfit)}
                    </td>
                    <td className={`p-3 text-right font-bold ${isLoss ? 'text-red-600' : 'text-slate-900'}`}>
                      {row.margin}%
                    </td>
                    <td className={`p-3 text-right font-black ${row.netProfitAfterCredit < 0 ? 'text-red-600' : 'text-amber-800 bg-amber-50/40'}`}>
                      {formatINR(row.netProfitAfterCredit)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
