export const calculateGST = (items, customerState, companyState) => {
  let subtotal = 0;
  let totalGST = 0;
  let igstTotal = 0;

  // ✅ STANDARD GST SLABS USED IN REAL HOSPITALS
  const GST_SLABS = [0, 5, 12, 18];

  // ✅ INITIALIZE GST SUMMARY (ALL SLABS MUST EXIST EVEN IF UNUSED)
  const gstSummary = {};
  GST_SLABS.forEach(rate => {
    gstSummary[rate] = {
      taxable: 0,
      gst: 0,
      cgst: 0,
      sgst: 0,
      igst: 0
    };
  });

  // ✅ AUTO DETECT IGST (REAL-WORLD FIX)
  const isIGSTInvoice = customerState && companyState
    ? customerState !== companyState
    : false;

  // ✅ Create new array instead of mutating original
  const updatedItems = items.map(item => {
    const qty = Number(item.qty) || 0;
    const rate = Number(item.rate) || 0;
    const gst = Number(item.gst) || 0;

    const base = qty * rate;
    const gstAmount = (base * gst) / 100;

    subtotal += base;
    totalGST += gstAmount;

    const isIGST = isIGSTInvoice;

    if (isIGST) {
      igstTotal += gstAmount;
    }

    // ✅ ADD TO GST SLAB SUMMARY
    if (gstSummary[gst] !== undefined) {
      gstSummary[gst].taxable += base;
      gstSummary[gst].gst += gstAmount;

      if (isIGST) {
        gstSummary[gst].igst += gstAmount;
      } else {
        gstSummary[gst].cgst += gstAmount / 2;
        gstSummary[gst].sgst += gstAmount / 2;
      }
    }

    return {
      ...item,
      amount: Number(base.toFixed(2)),
      gstAmount: Number(gstAmount.toFixed(2)),
      total: Number((base + gstAmount).toFixed(2))
    };
  });

  // ✅ FINALIZE GST SUMMARY
  Object.keys(gstSummary).forEach(rate => {
    const slab = gstSummary[rate];

    slab.taxable = Number(slab.taxable.toFixed(2));
    slab.gst = Number(slab.gst.toFixed(2));
    slab.cgst = Number(slab.cgst.toFixed(2));
    slab.sgst = Number(slab.sgst.toFixed(2));
    slab.igst = Number(slab.igst.toFixed(2));
  });

  return {
    items: updatedItems,

    subtotal: Number(subtotal.toFixed(2)),

    // ✅ CGST + SGST ONLY WHEN SAME STATE
    cgstTotal: isIGSTInvoice
      ? 0
      : Number(((totalGST) / 2).toFixed(2)),

    sgstTotal: isIGSTInvoice
      ? 0
      : Number(((totalGST) / 2).toFixed(2)),

    // ✅ IGST ONLY WHEN DIFFERENT STATE
    igstTotal: Number(igstTotal.toFixed(2)),

    // ✅ FINAL TOTAL (REAL GST INVOICE RULE)
    total: Number((subtotal + totalGST).toFixed(2)),

    gstSummary
  };
};