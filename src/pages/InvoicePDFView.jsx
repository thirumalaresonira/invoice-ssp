import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import InvoicePrint from "../components/InvoicePrint";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { generatePDF } from "../utils/generateInvoicePDF";

const InvoicePDFView = () => {
  const { state: invoice } = useLocation();
  const [pdfUrl, setPdfUrl] = useState(null);

  useEffect(() => {
    const createPreview = async () => {
      const element = document.getElementById("invoice-pdf");
      if (!element) return;

      await new Promise((res) => setTimeout(res, 300));

      const canvas = await html2canvas(element, {
        scale: 3,
        useCORS: true,
      });

      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "mm", "a4");

      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // ✅ Create preview URL
      const blob = pdf.output("blob");
      const url = URL.createObjectURL(blob);

      setPdfUrl(url);
    };

    if (invoice) {
      createPreview();
    }
  }, [invoice]);

  return (
    <div className="h-screen flex flex-col bg-gray-100">

      {/* ✅ ACTION BAR */}
      <div className="p-3 flex justify-end bg-white shadow print:hidden">
        <button
          onClick={() => generatePDF(invoice)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Download PDF
        </button>
      </div>

      {/* ✅ PDF PREVIEW */}
      {pdfUrl && (
        <iframe
          src={pdfUrl}
          title="Invoice PDF"
          className="flex-1 w-full"
        />
      )}

      {/* 🔽 Hidden render (for generating PDF) */}
      <div className="absolute -z-10 opacity-0">
        <InvoicePrint invoice={invoice} />
      </div>

    </div>
  );
};

export default InvoicePDFView;