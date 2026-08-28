// Utility functions for Pharma calculations

export const calculateSingleDeal = ({ ptr, targetBill, schemePercent, pts, doctorCrm }) => {
  const safePtr = parseFloat(ptr) || 0;
  const safeTargetBill = parseFloat(targetBill) || 0;
  const safeSchemePercent = parseFloat(schemePercent) || 0;
  const safePts = parseFloat(pts) || 0;
  const safeDoctorCrm = parseFloat(doctorCrm) || 0;

  // Billed Quantity = Total Bill ÷ PTR
  const billedQty = safePtr > 0 ? safeTargetBill / safePtr : 0;
  
  // Free Quantity (Boxes) = Billed Quantity × (Free Quantity % ÷ 100)
  const freeQty = billedQty * (safeSchemePercent / 100);
  
  // Total Quantity Needed = Billed Quantity + Free Quantity
  const totalQty = billedQty + freeQty;
  
  // Total Quantity Purchase Cost = Total Quantity Needed × PTS Price
  const totalPurchaseCost = totalQty * safePts;
  
  // Total Expense = Purchase Cost + Doctor CRM
  const totalExpense = totalPurchaseCost + safeDoctorCrm;
  
  // Net Profit Amount = Total Bill - Total Expense
  const netProfit = safeTargetBill - totalExpense;
  
  // Profit Margin (%) = (Net Profit ÷ Total Bill) × 100
  const profitMargin = safeTargetBill > 0 ? (netProfit / safeTargetBill) * 100 : 0;

  // Additional helper metrics
  const effectiveCostPerBox = totalQty > 0 ? totalExpense / totalQty : 0;
  const grossBillWithoutCRM = safeTargetBill - totalPurchaseCost;
  const crmPercentOfBill = safeTargetBill > 0 ? (safeDoctorCrm / safeTargetBill) * 100 : 0;

  return {
    ptr: safePtr,
    targetBill: safeTargetBill,
    schemePercent: safeSchemePercent,
    pts: safePts,
    doctorCrm: safeDoctorCrm,
    billedQty,
    freeQty,
    totalQty,
    totalPurchaseCost,
    totalExpense,
    netProfit,
    profitMargin,
    effectiveCostPerBox,
    grossBillWithoutCRM,
    crmPercentOfBill
  };
};

export const formatINR = (val) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(val || 0);
};

export const formatNumber = (val, decimals = 1) => {
  if (isNaN(val) || val === null || val === undefined) return '0';
  return Number(val).toLocaleString('en-IN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals
  });
};
