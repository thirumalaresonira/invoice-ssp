import html2canvas from "html2canvas";
import jsPDF from "jspdf";

// 🔹 COMMON FUNCTION (REUSED)
const createPDF = async () => {
  const element = document.getElementById("invoice-pdf");

  if (!element) return null;

  // ✅ APPLY TEMPORARY STYLES (ONLY FOR PDF)
  const table = element.querySelector("table");

  if (table) {
    table.style.tableLayout = "auto";
  }

  const rows = element.querySelectorAll("tr");

  rows.forEach((row) => {
    const cells = row.children;

    if (cells.length > 1) {
      // ✅ ITEM COLUMN
      if (cells[1]) {
        cells[1].style.whiteSpace = "normal";
        cells[1].style.wordBreak = "break-word";
        cells[1].style.width = "auto";
      }

      // ✅ OTHER COLUMNS
      for (let i = 0; i < cells.length; i++) {
        if (i !== 1) {
          cells[i].style.whiteSpace = "nowrap";
        }
      }
    }
  });

  // Fix width for A4
  element.style.width = "794px";

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

  // ✅ CLEANUP (VERY IMPORTANT)
  rows.forEach((row) => {
    Array.from(row.children).forEach((cell) => {
      cell.style.whiteSpace = "";
      cell.style.wordBreak = "";
      cell.style.width = "";
    });
  });

  if (table) {
    table.style.tableLayout = "";
  }

  element.style.width = "";

  return pdf;
};

// ✅ DOWNLOAD (your existing behavior)
export const generatePDF = async (invoice) => {
  // ⏳ WAIT for DOM
  await new Promise((resolve) => setTimeout(resolve, 300));
  const pdf = await createPDF();
  if (!pdf) return;

  pdf.save(`Invoice_${invoice?.invoiceNo || "file"}.pdf`);
};

// ✅ PREVIEW (NEW FUNCTION)
export const previewPDFOnly = async () => {
  const element = document.getElementById("invoice-pdf");

  if (!element) return;

  // ⏳ wait for render
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

  // ✅ PREVIEW ONLY (NO DOWNLOAD)
  const blob = pdf.output("blob");
  const url = URL.createObjectURL(blob);

  window.open(url, "_blank");
};