export const calculateGST = (items, customerState, companyState) => {
  let subtotal = 0;
  let igstTotal = 0;

  // ✅ GST slabs (for invoice display only)
  const GST_SLABS = [0, 5, 12, 18];

  // ✅ All GST (for calculation)
  const allGSTSummary = {};

  // ✅ Slab GST (for invoice print)
  const slabGSTSummary = {};
  GST_SLABS.forEach(rate => {
    slabGSTSummary[rate] = {
      taxable: 0,
      gst: 0,
      cgst: 0,
      sgst: 0,
      igst: 0
    };
  });

  // ✅ State check
  const isIGSTInvoice =
    customerState?.toLowerCase().trim() !==
    companyState?.toLowerCase().trim();

  const updatedItems = items.map(item => {
    const qty = Number(item.qty) || 0;
    const rate = Number(item.rate) || 0;
    const gst = Number(item.gst) || 0;
    /*const pack = Number(item.pack) || 1;*/

    // ✅ PACK LOGIC (IMPORTANT)
    /*const unitRate = rate / pack;*/
    /*const base = qty * unitRate;*/
     const base = qty * rate;

    const gstAmount = (base * gst) / 100;

    subtotal += base;

    const cgst = isIGSTInvoice ? 0 : gstAmount / 2;
    const sgst = isIGSTInvoice ? 0 : gstAmount / 2;
    const igst = isIGSTInvoice ? gstAmount : 0;

    if (isIGSTInvoice) {
      igstTotal += gstAmount;
    }

    // ===============================
    // ✅ 1. STORE ALL GST (FOR TOTAL)
    // ===============================
    if (!allGSTSummary[gst]) {
      allGSTSummary[gst] = {
        taxable: 0,
        gst: 0,
        cgst: 0,
        sgst: 0,
        igst: 0
      };
    }

    allGSTSummary[gst].taxable += base;
    allGSTSummary[gst].gst += gstAmount;

    if (isIGSTInvoice) {
      allGSTSummary[gst].igst += gstAmount;
    } else {
      allGSTSummary[gst].cgst += cgst;
      allGSTSummary[gst].sgst += sgst;
    }

    // ==================================
    // ✅ 2. STORE ONLY SLAB GST (DISPLAY)
    // ==================================
    if (GST_SLABS.includes(gst)) {
      slabGSTSummary[gst].taxable += base;
      slabGSTSummary[gst].gst += gstAmount;

      if (isIGSTInvoice) {
        slabGSTSummary[gst].igst += gstAmount;
      } else {
        slabGSTSummary[gst].cgst += cgst;
        slabGSTSummary[gst].sgst += sgst;
      }
    }

    return {
      ...item,
      amount: Number(base.toFixed(2)),
      gstAmount: Number(gstAmount.toFixed(2)),
      cgst: Number(cgst.toFixed(2)),
      sgst: Number(sgst.toFixed(2)),
      igst: Number(igst.toFixed(2)),
      total: Number((base + gstAmount).toFixed(2))
    };
  });

  // ===============================
  // ✅ FINAL GST TOTAL (ALL GST)
  // ===============================
  const totalGST = Object.values(allGSTSummary).reduce(
    (sum, s) => sum + s.gst,
    0
  );

  // ===============================
  // ✅ ROUNDING
  // ===============================
  Object.keys(slabGSTSummary).forEach(rate => {
    slabGSTSummary[rate].taxable = Number(slabGSTSummary[rate].taxable.toFixed(2));
    slabGSTSummary[rate].gst = Number(slabGSTSummary[rate].gst.toFixed(2));
    slabGSTSummary[rate].cgst = Number(slabGSTSummary[rate].cgst.toFixed(2));
    slabGSTSummary[rate].sgst = Number(slabGSTSummary[rate].sgst.toFixed(2));
    slabGSTSummary[rate].igst = Number(slabGSTSummary[rate].igst.toFixed(2));
  });

  return {
    items: updatedItems,

    subtotal: Number(subtotal.toFixed(2)),

    cgstTotal: isIGSTInvoice ? 0 : Number((totalGST / 2).toFixed(2)),
    sgstTotal: isIGSTInvoice ? 0 : Number((totalGST / 2).toFixed(2)),

    igstTotal: Number(igstTotal.toFixed(2)),

    total: Number((subtotal + totalGST).toFixed(2)),

    gstSummary: slabGSTSummary,   // ✅ ONLY slabs shown in invoice
    allGSTSummary                 // ✅ optional (debug / future use)
  };
};