import React from "react";
import { toWords } from "number-to-words";


// At the top of InvoicePrint.jsx
const formatDate = (date) => {
  if (!date) return "-";
  const d = new Date(date);
  if (isNaN(d)) return date; // fallback if date is invalid
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
};

const InvoicePrint = ({ invoice }) => {
  const total = invoice.total || 0;

  const amountInWords =
    toWords(Math.round(total)).charAt(0).toUpperCase() +
    toWords(Math.round(total)).slice(1);

  // ✅ GST SUMMARY LOGIC (FIXED SLABS)
  const GST_SLABS = [0, 5, 12, 18, 28];
/*const gstSummary = invoice?.gstSummary || {};*/


/*const hospitalState = invoice.hospitalState || "Telangana";*/
/*const customerState = invoice.customerState || "Telangana";*/
/*const customerState =
  invoice.customerState || invoice.address || "Telangana";

const isInterState =
  hospitalState.toLowerCase() !== customerState.toLowerCase();*/
  const extractState = (address) => {
  if (!address) return "telangana"; // ✅ fallback
  try {
    return address.split(",").pop().trim().toLowerCase();
  } catch {
    return "telangana";
  }
};

const hospitalState = (invoice.hospitalState || "Telangana").toLowerCase();

const customerState = invoice.customerState
  ? invoice.customerState.toLowerCase()
  : extractState(invoice.address);

const isInterState = hospitalState !== customerState;

const gstSummary = {};

(invoice.items || []).forEach((item) => {
  const gst = Number(item?.gst) || 0;

  const base =
    Number(item?.amount) ||
    Number(item?.qty || 0) * Number(item?.rate || item?.pts || 0);

const gstAmount = (base * gst) / 100;

  if (!gstSummary[gst]) {
    gstSummary[gst] = {
       taxable: 0,
  cgst: 0,
  sgst: 0,
  igst: 0
    };
  }

  gstSummary[gst].taxable += base;

  if (isInterState) {
    gstSummary[gst].igst += gstAmount;
  } else {
    gstSummary[gst].cgst += gstAmount / 2;
    gstSummary[gst].sgst += gstAmount / 2;
  }
});

  
    const totalTaxable = Object.values(gstSummary).reduce(
  (sum, item) => sum + (item.taxable || 0),
  0
);

const totalCGST = Object.values(gstSummary).reduce(
  (sum, item) => sum + (item.cgst || 0),
  0
);

const totalSGST = Object.values(gstSummary).reduce(
  (sum, item) => sum + (item.sgst || 0),
  0
);

const totalIGST = Object.values(gstSummary).reduce(
  (sum, item) => sum + (item.igst || 0),
  0
);


  // ✅ NEW: FIXED ROW COUNT
  const MIN_ROWS = 12;
  const emptyRows = MIN_ROWS - invoice.items.length;

  return (
    <div
      id="invoice-pdf"
      className="p-2 bg-white text-black w-[210mm] h-[290mm] overflow-hidden text-[10px] font-sans"
    >
      <div className="border border-black">
        {/* ================= HEADER ================= */}
        <table className="w-full text-xs border-collapse">
          <tbody>
            <tr>
              <td className="p-2 w-1/3 align-top border-r border-black">
                <div className="flex gap-2 items-start">
                  <img
                    src="/logo.jpeg.jpeg"
                    alt="logo"
                    className="w-12 h-12 object-contain flex-shrink-0"
                  />
                  <div className="min-w-0,text-[10px] leading-tight">
                    <p className="font-bold break-words leading-tight">
                      SSP Pharmacy (Swetha Saiphani Clinics)
                    </p>
                    <p>6-6-666/1SHUTTER NO 1, GROUND FLOOR,OPPOSITE ADA
VAVILALA RAM REDDY COLONY, CHOPPADANDI
ROAD,</p>
                    <p>KARIMNAGAR</p>
                    <p>8978058580</p>
                    <p>DL No::TG/KNR/2026-146482</p>
                    <p>Gst No: 36AFVFS2812J1ZH</p>
                  </div>
                </div>
              </td>

              <td className="w-1/3 border-r border-black">
                <table className="w-full text-xs border-collapse">
                  <tbody>
                    <tr>
                      <td
                        colSpan="2"
                        className="text-center font-bold text-sm py-1 border-b border-black"
                      >
                        GST INVOICE
                      </td>
                    </tr>

                    <tr>
                      <td className="p-1 font-semibold">Invoice No</td>
                      <td className="p-1">: {invoice.invoiceNo}</td>
                    </tr>

                    <tr>
                      <td className="p-1 font-semibold">Date</td>
                      <td className="p-1">: {formatDate(invoice.date)}</td>
                    </tr>

                    <tr>
                      <td className="p-1 font-semibold">Mode</td>
                      <td className="p-1">: {invoice.paymentMode}</td>
                    </tr>

                    <tr>
                      <td className="p-1 font-semibold">Place</td>
                      <td className="p-1">: Telangana</td>
                    </tr>
                  </tbody>
                </table>
              </td>

              <td className="w-1/3 align-top">
                <p>
                  <span className="font-semibold">To:</span>{" "}
                  {invoice.customerName || "-"}
                </p>
                {/* ✅ ADD THIS */}
  <p className="break-words">
    <span className="font-semibold">Address:</span>{" "}
    {invoice.address || "-"}
  </p>
                <p>
                  <span className="font-semibold">Phone:</span>{" "}
                  {invoice.phone || "-"}
                </p>
                <p>
                  <span className="font-semibold">Gst No:</span> -
                </p>
              </td>
            </tr>
          </tbody>
        

        </table>

        

        {/* ================= TABLE ================= */}
        <table className="w-full border-collapse text-[10px] table-fixed border-t border-black mt-[2px]">
          
          <thead>
            <tr>
              {[
                "S.No",
                "Item",
                "Pack",
                "HSNCode",
                "Rate",
                "Batch",
                "Expiry",
                "Qty",
                "Free",
                "MRP",
                "PTR",
                "PTS",
              ].map((h, i) => (
                <th
                  key={i}
                  className="border-l border-r border-b border-black p-1"
                >
                  {h}
                </th>
              ))}

              {invoice.invoiceType === "GST" && (
                <>
                  <th className="border-l border-r border-b border-black p-1">
                    CGST%
                  </th>
                  <th className="border-l border-r border-b border-black p-1">
                    SGST%
                  </th>
                </>
              )}

              <th className="border-l border-r border-b border-black p-1">Amount</th>
            </tr>
          </thead>

          <tbody>
            {/* ✅ ACTUAL ITEMS */}
            {invoice.items.map((item, i) => (
              <tr key={i}>
                <td className="border-l border-r border-black text-center">{i + 1}</td>

                {/* ✅ ITEM NAME WITH WRAP */}
                <td className="border-l border-r border-black py-1 px-2 break-words whitespace-normal">
                  {item.name}
                </td>

                <td className="border-l border-r border-black text-center">{item.pack || "-"}</td>
                <td className="border-l border-r border-black">{item.hsn || "-"}</td>
                <td className="border-l border-r border-black text-left">
  ₹{item.rate?.toFixed(2) || "0.00"}
</td>
                <td className="border-l border-r border-black">{item.batch || "-"}</td>
                <td className="border-l border-r border-black">{item.expiry || "-"}</td>
                <td className="border-l border-r border-black text-center">{item.qty}</td>
                <td className="border-l border-r border-black text-center">{item.free || 0}</td>
                <td className="border-l border-r border-black">{item.mrp || "-"}</td>
                <td className="border-l border-r border-black">{item.ptr || "-"}</td>
                <td className="border-l border-r border-black">{item.pts || "-"}</td>

                {invoice.invoiceType === "GST" && (
                  <>
                    <td className="border-l border-r border-black text-center">
                      {item.cgst || item.gst / 2}%
                    </td>
                    <td className="border-l border-r border-black text-center">
                      {item.sgst || item.gst / 2}%
                    </td>
                  </>
                )}

                <td className="border-l border-r border-black">
                  ₹{item.total?.toFixed(2) || "0.00"}
                </td>
              </tr>
            ))}

            {/* ✅ EMPTY ROWS */}
            {Array.from({ length: emptyRows > 0 ? emptyRows : 0 }).map((_, i) => (
              <tr key={`empty-${i}`}>
                {Array(invoice.invoiceType === "GST" ? 15 : 13)
                  .fill("")
                  .map((_, idx) => (
                    <td key={idx} className="border-l border-r border-black h-[16px]">
                      &nbsp;
                    </td>
                  ))}
              </tr>
            ))}
          </tbody>
        </table>

        {/* ================= GST SUMMARY ================= */}
        {invoice.invoiceType === "GST" && (
          <table className="w-full border-collapse text-[10px] border-t border-black mb-[2px]">
            <thead>
              <tr>
                {["GST%", "Taxable", "CGST", "SGST", "IGST"].map((h, i) => (
                  <th
                    key={i}
                    className="border-l border-r border-b border-black p-1 text-center"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
  {GST_SLABS.map((gst, i) => {
    const data = gstSummary[gst] || {
       taxable: 0,
  cgst: 0,
  sgst: 0,
  igst: 0
    };
  
     

    return (
      <tr key={i}>
        <td className="border-l border-r border-black text-center">
          {gst}%
        </td>

        <td className="border-l border-r border-black text-center">
          ₹{Number(data.taxable || 0).toFixed(2)}
        </td>

        <td className="border-l border-r border-black text-center">
          ₹{isInterState ? "0.00" : Number(data.cgst || 0).toFixed(2)}
        </td>

        <td className="border-l border-r border-black text-center">
          ₹{isInterState ? "0.00" : Number(data.sgst || 0).toFixed(2)}
        </td>

        <td className="border-l border-r border-black text-center">
          ₹{isInterState ? Number(data.igst || 0).toFixed(2) : "0.00"}
        </td>
      </tr>

    );
  })}
   {/* ✅ PASTE TOTAL ROW EXACTLY HERE */}
  <tr className="border-t-2 border-black font-bold">
    <td className="border-l border-r border-black text-center">
      Total
    </td>

    <td className="border-l border-r border-black text-center">
      ₹{totalTaxable.toFixed(2)}
    </td>

    <td className="border-l border-r border-black text-center">
      ₹{totalCGST.toFixed(2)}
    </td>

    <td className="border-l border-r border-black text-center">
      ₹{totalSGST.toFixed(2)}
    </td>

    <td className="border-l border-r border-black text-center">
      ₹{totalIGST.toFixed(2)}
    </td>
  </tr>
  
</tbody>
          </table>
        )}

        

        {/* ================= FOOTER ================= */}
        <div className="border-t border-black mt-0">
          <div className="grid grid-cols-4 border-b border-black">
            <div className="p-2 border-r border-black">
              <p><b>Amount in Words:</b></p>
              <p>{amountInWords} Rupees Only</p>
            </div>

            <div className="p-2 border-r border-black">
              <p><b>Bank Details:: HDFC BANK</b></p>
              <p>A/C No: 50200118838392</p>
              <p>IFSC: HDFC0000632</p>
              <p>ALWAL BRANCH ,HYDERABAD.</p>
            </div>

            <div className="p-2 border-r border-black text-center">
              <p>For : SSP Pharmacy (Swetha Saiphani Clinics )</p>
              <div className="h-16"></div>
              <p><b>Sign & Stamp </b></p>
            </div>

            <div className="p-2 text-right font-bold">
              <p>Net Amount</p>
              <p>₹{invoice.total?.toFixed(2)}</p>
            </div>
          </div>

          <div className="border-t border-black p-2 text-[9px]">
            <p><b>Terms & Conditions:</b></p>
            <p>Goods Once Sold Cannot Taken Back . The goods supplied in this invoice do not contravene
Section 18 of drugs & Cometics act 1940.Subject to HYDERABAD Jurisdiction.E.&O.E</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicePrint;