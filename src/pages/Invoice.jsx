import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import InvoiceTable from "../components/InvoiceTable";
import InvoiceSummary from "../components/InvoiceSummary";
import InvoicePrint from "../components/InvoicePrint";
import { generatePDF } from "../utils/generateInvoicePDF";


const Invoice = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // ✅ Existing single invoice logic
  const invoice = location.state;

 useEffect(() => {
  if (invoice) {
    setTimeout(() => {
      previewPDF();
    }, 500); // ⏳ wait for render
  }
}, [invoice]);

  // ✅ State for all invoices
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("invoices")) || [];
    setInvoices(data);
  }, []);

  // ✅ Delete function
  const handleDelete = (index) => {
    const updated = invoices.filter((_, i) => i !== index);
    localStorage.setItem("invoices", JSON.stringify(updated));
    setInvoices(updated);
  };

  // ================= SINGLE INVOICE VIEW =================
  if (invoice) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-4 text-accent">
          {invoice.invoiceType === "GST" ? "TAX INVOICE" : "INVOICE"} #
          {invoice.invoiceNo}
        </h1>

        <div className="flex gap-3 mb-6">
          <button
            onClick={() => generatePDF(invoice)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Download PDF
          </button>

          <button
            onClick={() => window.print()}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            Print
          </button>
        </div>

        <div
          id="invoice"
          className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200"
        >
          <InvoiceTable items={invoice.items} />
          <InvoiceSummary items={invoice.items} />
          <InvoicePrint invoice={invoice} />
        </div>
      </div>
    );
  }

  // ================= ALL INVOICES LIST =================
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-accent">All Invoices</h1>

      {invoices.length === 0 ? (
        <p className="text-gray-500">No invoices found</p>
      ) : (
         <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-xl">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left font-semibold border-b">Invoice No</th>
                <th className="py-3 px-4 text-left font-semibold border-b">Customer</th>
                <th className="py-3 px-4 text-left font-semibold border-b">Date</th>
                <th className="py-3 px-4 text-right font-semibold border-b">Total (₹)</th>
                <th className="py-3 px-4 text-center font-semibold border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices
                .slice()
                .reverse()
                .map((inv, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition">
                    <td className="py-3 px-4 border-b">{inv.invoiceNo}</td>
                    <td className="py-3 px-4 border-b">{inv.customerName}</td>
                    <td className="py-3 px-4 border-b">{inv.date}</td>
                    <td className="py-3 px-4 border-b text-right">
                      {inv.total?.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 border-b text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() =>
                            navigate("/create-invoice", { state: inv })
                          }
                          className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => handleDelete(invoices.length - 1 - index)}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                        >
                          Delete
                        </button>

                        <button
                          onClick={() =>  navigate("/invoice-pdf", { state: inv })}
                          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                        >
                          PDF
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Invoice;