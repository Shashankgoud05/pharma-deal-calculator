// Standard PTR/PTS & Margin Formulas (Pharma standards in India)

export const calculatePtrPts = ({ mrp, gstPercent, schemePercent, discountPercent, stockistMarginPercent, retailMarginPercent }) => {
  const safeMrp = parseFloat(mrp) || 0;
  const safeGst = parseFloat(gstPercent) || 0;
  const safeScheme = parseFloat(schemePercent) || 0;
  const safeDiscount = parseFloat(discountPercent) || 0;
  const safeStockistMargin = parseFloat(stockistMarginPercent) || 0;
  const safeRetailMargin = parseFloat(retailMarginPercent) || 0;

  // 1. Without GST calculation
  // Base Price without GST = MRP / (1 + GST%)
  const baseMrp = safeMrp / (1 + safeGst / 100);

  // PTR (Price To Retailer) without GST = Base MRP * (1 - Retail Margin %)
  const ptrWithoutGst = baseMrp * (1 - safeRetailMargin / 100);

  // PTS (Price To Stockist) without GST = PTR without GST * (1 - Stockist Margin %)
  const ptsWithoutGst = ptrWithoutGst * (1 - safeStockistMargin / 100);

  // Net Rate (PTR) without GST (after applying scheme % or cash discount if applicable)
  // Standard Net Rate = PTR * (1 - Scheme% / 100)
  const netRateWithoutGst = ptrWithoutGst * (1 - safeScheme / 100);

  // CD / Discount PTR without GST = PTR * (1 - Discount% / 100)
  const cdDiscountPtrWithoutGst = ptrWithoutGst * (1 - safeDiscount / 100);

  // 2. Including GST calculation
  // PTR including GST = PTR without GST * (1 + GST%)
  const ptrWithGst = ptrWithoutGst * (1 + safeGst / 100);

  // PTS including GST = PTS without GST * (1 + GST%)
  const ptsWithGst = ptsWithoutGst * (1 + safeGst / 100);

  // Net Rate (PTR) including GST
  const netRateWithGst = netRateWithoutGst * (1 + safeGst / 100);

  // CD / Discount PTR including GST
  const cdDiscountPtrWithGst = cdDiscountPtrWithoutGst * (1 + safeGst / 100);

  return {
    mrp: safeMrp,
    gstPercent: safeGst,
    schemePercent: safeScheme,
    discountPercent: safeDiscount,
    stockistMarginPercent: safeStockistMargin,
    retailMarginPercent: safeRetailMargin,
    // Without GST
    ptsWithoutGst,
    ptrWithoutGst,
    netRateWithoutGst,
    cdDiscountPtrWithoutGst,
    // Including GST
    ptsWithGst,
    ptrWithGst,
    netRateWithGst,
    cdDiscountPtrWithGst
  };
};

export const calculateSpecialRate = ({ mrp, pts, ptr, gstPercent }) => {
  const safeMrp = parseFloat(mrp) || 0;
  const safePts = parseFloat(pts) || 0;
  const safePtr = parseFloat(ptr) || 0;
  const safeGst = parseFloat(gstPercent) || 0;

  const retailMarginVal = safeMrp > 0 ? ((safeMrp - safePtr) / safeMrp) * 100 : 0;
  const stockistMarginVal = safePtr > 0 ? ((safePtr - safePts) / safePtr) * 100 : 0;

  return {
    mrp: safeMrp,
    pts: safePts,
    ptr: safePtr,
    gstPercent: safeGst,
    calculatedRetailMargin: Math.max(0, retailMarginVal),
    calculatedStockistMargin: Math.max(0, stockistMarginVal)
  };
};
