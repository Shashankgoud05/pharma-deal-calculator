import React, { useState } from 'react';
import { calculateSingleDeal, formatINR, formatNumber } from '../utils/pharmaMath';
import { 
  Plus, 
  Trash2, 
  Download, 
  Printer, 
  FileSpreadsheet, 
  RotateCcw
} from 'lucide-react';
import * as XLSX from 'xlsx';

export default function BatchTableGrid({ rows, setRows }) {
  const [customOverrides, setCustomOverrides] = useState({});

  const handleRowChange = (id, field, value) => {
    setRows(prev => prev.map(row => {
      if (row.id === id) {
        return { ...row, [field]: value };
      }
      return row;
    }));
  };

  const handleCustomOverride = (id, field, value) => {
    const key = `${id}_${field}`;
    if (value === '' || value === undefined) {
      setCustomOverrides(prev => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    } else {
      setCustomOverrides(prev => ({
        ...prev,
        [key]: parseFloat(value) || 0
      }));
    }
  };

  const clearOverride = (id, field) => {
    const key = `${id}_${field}`;
    setCustomOverrides(prev => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const handleAddRow = () => {
    const newId = Date.now().toString();
    setRows(prev => [
      ...prev,
      {
        id: newId,
        name: `New Product ${prev.length + 1}`,
        ptr: 500,
        targetBill: 25000,
        schemePercent: 20,
        pts: 80,
        doctorCrm: 5000
      }
    ]);
  };

  const handleDeleteRow = (id) => {
    if (rows.length <= 1) {
      alert('Keep at least one product row in the table.');
      return;
    }
    setRows(prev => prev.filter(row => row.id !== id));
  };

  const handleResetData = () => {
    setCustomOverrides({});
  };

  const calculatedRows = rows.map(row => {
    const defaultCalc = calculateSingleDeal(row);
    
    const billedQty = customOverrides[`${row.id}_billedQty`] !== undefined 
      ? customOverrides[`${row.id}_billedQty`] 
      : defaultCalc.billedQty;

    const freeQty = customOverrides[`${row.id}_freeQty`] !== undefined 
      ? customOverrides[`${row.id}_freeQty`] 
      : defaultCalc.freeQty;

    const totalQty = customOverrides[`${row.id}_totalQty`] !== undefined 
      ? customOverrides[`${row.id}_totalQty`] 
      : (billedQty + freeQty);

    const totalPurchaseCost = customOverrides[`${row.id}_totalPurchaseCost`] !== undefined 
      ? customOverrides[`${row.id}_totalPurchaseCost`] 
      : defaultCalc.totalPurchaseCost;

    const totalExpense = totalPurchaseCost + (parseFloat(row.doctorCrm) || 0);

    const netProfit = customOverrides[`${row.id}_netProfit`] !== undefined 
      ? customOverrides[`${row.id}_netProfit`] 
      : ((parseFloat(row.targetBill) || 0) - totalExpense);

    const profitMargin = (parseFloat(row.targetBill) || 0) > 0 
      ? (netProfit / (parseFloat(row.targetBill) || 0)) * 100 
      : 0;

    return {
      ...row,
      calc: {
        ...defaultCalc,
        billedQty,
        freeQty,
        totalQty,
        totalPurchaseCost,
        totalExpense,
        netProfit,
        profitMargin
      }
    };
  });

  const totals = calculatedRows.reduce((acc, curr) => {
    acc.targetBill += parseFloat(curr.targetBill) || 0;
    acc.billedQty += curr.calc.billedQty;
    acc.freeQty += curr.calc.freeQty;
    acc.totalQty += curr.calc.totalQty;
    acc.totalPurchaseCost += curr.calc.totalPurchaseCost;
    acc.doctorCrm += parseFloat(curr.doctorCrm) || 0;
    acc.totalExpense += curr.calc.totalExpense;
    acc.netProfit += curr.calc.netProfit;
    return acc;
  }, {
    targetBill: 0,
    billedQty: 0,
    freeQty: 0,
    totalQty: 0,
    totalPurchaseCost: 0,
    doctorCrm: 0,
    totalExpense: 0,
    netProfit: 0
  });

  const overallMargin = totals.targetBill > 0 ? (totals.netProfit / totals.targetBill) * 100 : 0;

  const exportToExcel = () => {
    const exportData = calculatedRows.map((r, index) => ({
      'S.No': index + 1,
      'Product Name': r.name,
      'PTR (₹)': r.ptr,
      'Target Bill (₹)': r.targetBill,
      'Billed Qty (Boxes)': Number(r.calc.billedQty.toFixed(1)),
      'Scheme (%)': `${r.schemePercent}%`,
      'Free Qty (Boxes)': Number(r.calc.freeQty.toFixed(1)),
      'Total Qty (Boxes)': Number(r.calc.totalQty.toFixed(1)),
      'Net Rate (₹)': r.pts,
      'Total Purchase Cost (₹)': r.calc.totalPurchaseCost,
      'Doctor CRM (₹)': r.doctorCrm,
      'Total Expense (₹)': r.calc.totalExpense,
      'Net Profit (₹)': r.calc.netProfit,
      'Profit Margin (%)': `${r.calc.profitMargin.toFixed(1)}%`
    }));

    exportData.push({
      'S.No': 'TOTAL',
      'Product Name': 'BATCH TOTALS',
      'PTR (₹)': '-',
      'Target Bill (₹)': totals.targetBill,
      'Billed Qty (Boxes)': Number(totals.billedQty.toFixed(1)),
      'Scheme (%)': '-',
      'Free Qty (Boxes)': Number(totals.freeQty.toFixed(1)),
      'Total Qty (Boxes)': Number(totals.totalQty.toFixed(1)),
      'Net Rate (₹)': '-',
      'Total Purchase Cost (₹)': totals.totalPurchaseCost,
      'Doctor CRM (₹)': totals.doctorCrm,
      'Total Expense (₹)': totals.totalExpense,
      'Net Profit (₹)': totals.netProfit,
      'Profit Margin (%)': `${overallMargin.toFixed(1)}%`
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Pharma Deal Summary');
    XLSX.writeFile(workbook, `Pharma_Deal_Profit_Batch_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-bold text-slate-800 flex items-center space-x-2">
              <FileSpreadsheet className="w-6 h-6 text-teal-600" />
              <span>Multi-Product Batch Deal Table</span>
            </h2>
            <span className="bg-amber-100 text-amber-800 text-[10px] font-black px-2 py-0.5 rounded border border-amber-300">
              LINKED TO SIMULATOR
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Linked Spreadsheet Grid. Quick Simulator deals automatically appear here!
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleAddRow}
            className="flex items-center space-x-1.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs px-3.5 py-2.5 rounded-xl shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product Row</span>
          </button>

          <button
            onClick={exportToExcel}
            className="flex items-center space-x-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs px-3.5 py-2.5 rounded-xl shadow-sm transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Export Excel</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs px-3.5 py-2.5 rounded-xl shadow-sm transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Print Receipt</span>
          </button>

          <button
            onClick={handleResetData}
            className="p-2.5 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all"
            title="Reset edits"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Batch Summary Highlight Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase">Total Batch Revenue</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{formatINR(totals.targetBill)}</div>
          <span className="text-[11px] text-slate-500">{rows.length} Active Deals</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase">Total Stock Cost</span>
          <div className="text-2xl font-black text-blue-900 mt-1">{formatINR(totals.totalPurchaseCost)}</div>
          <span className="text-[11px] text-slate-500">{formatNumber(totals.totalQty, 0)} Total Boxes</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase">Total Doctor CRM</span>
          <div className="text-2xl font-black text-amber-700 mt-1">{formatINR(totals.doctorCrm)}</div>
          <span className="text-[11px] text-slate-500">Expenses & Perks</span>
        </div>

        <div className={`p-4 rounded-xl border shadow-sm ${
          totals.netProfit >= 0 ? 'bg-emerald-900 text-white border-emerald-800' : 'bg-red-900 text-white border-red-800'
        }`}>
          <span className="text-xs font-semibold uppercase text-emerald-200">Total Net Profit</span>
          <div className="text-2xl font-black text-emerald-300 mt-1">{formatINR(totals.netProfit)}</div>
          <span className="text-[11px] text-emerald-200">{overallMargin.toFixed(1)}% Batch Margin</span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-900 text-slate-200 uppercase font-bold text-[11px] tracking-wider border-b border-slate-800">
                <th className="p-3 text-center w-10">#</th>
                <th className="p-3 min-w-[170px]">Product Name</th>
                <th className="p-3 text-right min-w-[95px]">PTR (₹)</th>
                <th className="p-3 text-right min-w-[110px]">Target Bill (₹)</th>
                <th className="p-3 text-right bg-slate-800 text-amber-300 min-w-[95px]">Billed Qty</th>
                <th className="p-3 text-right min-w-[95px]">Scheme (%)</th>
                <th className="p-3 text-right bg-slate-800 text-amber-300 min-w-[95px]">Free Qty</th>
                <th className="p-3 text-right bg-slate-800 text-amber-300 min-w-[95px]">Total Qty</th>
                <th className="p-3 text-right min-w-[100px] text-emerald-300 font-black">NET RATE (₹)</th>
                <th className="p-3 text-right bg-slate-800 text-amber-300 min-w-[115px]">Purchase Cost</th>
                <th className="p-3 text-right min-w-[105px]">Doctor CRM (₹)</th>
                <th className="p-3 text-right bg-teal-950 text-emerald-300 font-black min-w-[125px]">Net Profit (₹)</th>
                <th className="p-3 text-center w-10 no-print">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-medium text-slate-800">
              {calculatedRows.map((row, idx) => {
                const isRowProfit = row.calc.netProfit >= 0;

                const isBilledOverride = customOverrides[`${row.id}_billedQty`] !== undefined;
                const isFreeOverride = customOverrides[`${row.id}_freeQty`] !== undefined;
                const isTotalQtyOverride = customOverrides[`${row.id}_totalQty`] !== undefined;
                const isCostOverride = customOverrides[`${row.id}_totalPurchaseCost`] !== undefined;
                const isProfitOverride = customOverrides[`${row.id}_netProfit`] !== undefined;

                return (
                  <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3 text-center font-bold text-slate-400">
                      {idx + 1}
                    </td>

                    <td className="p-1.5">
                      <input
                        type="text"
                        value={row.name}
                        onChange={(e) => handleRowChange(row.id, 'name', e.target.value)}
                        className="w-full px-2 py-1.5 text-xs font-semibold text-slate-900 bg-white border border-slate-200 focus:border-teal-500 rounded transition-all"
                      />
                    </td>

                    <td className="p-1.5">
                      <input
                        type="number"
                        value={row.ptr}
                        onChange={(e) => handleRowChange(row.id, 'ptr', e.target.value)}
                        className="w-full text-right px-2 py-1.5 text-xs font-bold text-slate-900 bg-slate-50 focus:bg-white border border-slate-200 focus:border-teal-500 rounded transition-all"
                      />
                    </td>

                    <td className="p-1.5">
                      <input
                        type="number"
                        value={row.targetBill}
                        onChange={(e) => handleRowChange(row.id, 'targetBill', e.target.value)}
                        className="w-full text-right px-2 py-1.5 text-xs font-bold text-slate-900 bg-slate-50 focus:bg-white border border-slate-200 focus:border-teal-500 rounded transition-all"
                      />
                    </td>

                    <td className="p-1.5 bg-slate-50">
                      <div className="relative">
                        <input
                          type="number"
                          step="0.1"
                          value={row.calc.billedQty}
                          onChange={(e) => handleCustomOverride(row.id, 'billedQty', e.target.value)}
                          className={`w-full text-right px-2 py-1.5 text-xs font-bold rounded border transition-all ${
                            isBilledOverride 
                              ? 'bg-amber-100 text-amber-900 border-amber-400' 
                              : 'bg-white text-slate-800 border-slate-200 focus:border-teal-500'
                          }`}
                        />
                        {isBilledOverride && (
                          <button
                            onClick={() => clearOverride(row.id, 'billedQty')}
                            className="absolute -top-1.5 -right-1 text-[8px] bg-amber-500 text-white rounded-full w-3.5 h-3.5 flex items-center justify-center font-bold"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    </td>

                    <td className="p-1.5">
                      <div className="relative">
                        <input
                          type="number"
                          value={row.schemePercent}
                          onChange={(e) => handleRowChange(row.id, 'schemePercent', e.target.value)}
                          className="w-full text-right pr-4 py-1.5 pl-2 text-xs font-bold text-amber-800 bg-amber-50/60 border border-amber-200 focus:border-amber-500 rounded transition-all"
                        />
                        <span className="absolute right-1 top-2 text-[10px] font-bold text-amber-600">%</span>
                      </div>
                    </td>

                    <td className="p-1.5 bg-amber-50/30">
                      <div className="relative">
                        <input
                          type="number"
                          step="0.1"
                          value={row.calc.freeQty}
                          onChange={(e) => handleCustomOverride(row.id, 'freeQty', e.target.value)}
                          className={`w-full text-right px-2 py-1.5 text-xs font-bold rounded border transition-all ${
                            isFreeOverride 
                              ? 'bg-amber-100 text-amber-950 border-amber-400' 
                              : 'bg-white text-amber-900 border-amber-200 focus:border-amber-500'
                          }`}
                        />
                        {isFreeOverride && (
                          <button
                            onClick={() => clearOverride(row.id, 'freeQty')}
                            className="absolute -top-1.5 -right-1 text-[8px] bg-amber-500 text-white rounded-full w-3.5 h-3.5 flex items-center justify-center font-bold"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    </td>

                    <td className="p-1.5 bg-slate-50">
                      <div className="relative">
                        <input
                          type="number"
                          step="0.1"
                          value={row.calc.totalQty}
                          onChange={(e) => handleCustomOverride(row.id, 'totalQty', e.target.value)}
                          className={`w-full text-right px-2 py-1.5 text-xs font-bold rounded border transition-all ${
                            isTotalQtyOverride 
                              ? 'bg-indigo-100 text-indigo-950 border-indigo-400' 
                              : 'bg-white text-indigo-900 border-slate-200 focus:border-indigo-500'
                          }`}
                        />
                        {isTotalQtyOverride && (
                          <button
                            onClick={() => clearOverride(row.id, 'totalQty')}
                            className="absolute -top-1.5 -right-1 text-[8px] bg-indigo-500 text-white rounded-full w-3.5 h-3.5 flex items-center justify-center font-bold"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    </td>

                    <td className="p-1.5">
                      <input
                        type="number"
                        value={row.pts}
                        onChange={(e) => handleRowChange(row.id, 'pts', e.target.value)}
                        className="w-full text-right px-2 py-1.5 text-xs font-bold text-teal-900 bg-teal-50/50 focus:bg-white border border-teal-300 focus:border-teal-600 rounded transition-all"
                      />
                    </td>

                    <td className="p-1.5 bg-slate-50">
                      <div className="relative">
                        <input
                          type="number"
                          value={row.calc.totalPurchaseCost}
                          onChange={(e) => handleCustomOverride(row.id, 'totalPurchaseCost', e.target.value)}
                          className={`w-full text-right px-2 py-1.5 text-xs font-bold rounded border transition-all ${
                            isCostOverride 
                              ? 'bg-blue-100 text-blue-950 border-blue-400' 
                              : 'bg-white text-slate-900 border-slate-200 focus:border-teal-500'
                          }`}
                        />
                        {isCostOverride && (
                          <button
                            onClick={() => clearOverride(row.id, 'totalPurchaseCost')}
                            className="absolute -top-1.5 -right-1 text-[8px] bg-blue-500 text-white rounded-full w-3.5 h-3.5 flex items-center justify-center font-bold"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    </td>

                    <td className="p-1.5">
                      <input
                        type="number"
                        value={row.doctorCrm}
                        onChange={(e) => handleRowChange(row.id, 'doctorCrm', e.target.value)}
                        className="w-full text-right px-2 py-1.5 text-xs font-bold text-slate-900 bg-slate-50 focus:bg-white border border-slate-200 focus:border-teal-500 rounded transition-all"
                      />
                    </td>

                    <td className="p-1.5 bg-emerald-50/50">
                      <div className="relative">
                        <input
                          type="number"
                          value={row.calc.netProfit}
                          onChange={(e) => handleCustomOverride(row.id, 'netProfit', e.target.value)}
                          className={`w-full text-right px-2 py-1.5 text-xs font-black rounded border transition-all ${
                            isProfitOverride
                              ? 'bg-amber-100 text-amber-950 border-amber-400'
                              : isRowProfit 
                                ? 'bg-white text-emerald-700 border-emerald-300 focus:border-emerald-500' 
                                : 'bg-white text-red-600 border-red-300 focus:border-red-500'
                          }`}
                        />
                        {isProfitOverride && (
                          <button
                            onClick={() => clearOverride(row.id, 'netProfit')}
                            className="absolute -top-1.5 -right-1 text-[8px] bg-amber-500 text-white rounded-full w-3.5 h-3.5 flex items-center justify-center font-bold"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    </td>

                    <td className="p-2 text-center no-print">
                      <button
                        onClick={() => handleDeleteRow(row.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-all"
                        title="Delete row"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>

            {/* Bottom Total Row */}
            <tfoot>
              <tr className="bg-slate-900 text-white font-bold text-xs uppercase border-t-2 border-slate-700">
                <td className="p-3 text-center" colSpan={3}>
                  SUMMARY BATCH TOTALS ({rows.length} PRODUCTS)
                </td>
                <td className="p-3 text-right text-teal-300 font-black">
                  {formatINR(totals.targetBill)}
                </td>
                <td className="p-3 text-right bg-slate-800 text-amber-300 font-black">
                  {formatNumber(totals.billedQty, 1)}
                </td>
                <td className="p-3 text-right text-amber-300">
                  AVG
                </td>
                <td className="p-3 text-right bg-slate-800 text-amber-300 font-black">
                  {formatNumber(totals.freeQty, 1)}
                </td>
                <td className="p-3 text-right bg-slate-800 text-indigo-300 font-black">
                  {formatNumber(totals.totalQty, 1)}
                </td>
                <td className="p-3 text-right text-teal-300 font-bold">
                  -
                </td>
                <td className="p-3 text-right bg-slate-800 text-slate-200 font-black">
                  {formatINR(totals.totalPurchaseCost)}
                </td>
                <td className="p-3 text-right text-amber-300 font-black">
                  {formatINR(totals.doctorCrm)}
                </td>
                <td className={`p-3 text-right text-sm font-black ${
                  totals.netProfit >= 0 ? 'bg-emerald-950 text-emerald-400' : 'bg-red-950 text-red-400'
                }`}>
                  {formatINR(totals.netProfit)}
                  <div className="text-[10px] font-normal opacity-90">({overallMargin.toFixed(1)}% Overall)</div>
                </td>
                <td className="p-3 no-print"></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
