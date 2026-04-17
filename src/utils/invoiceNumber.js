export const getNextInvoiceNumber = () => {
  let last = localStorage.getItem("invoiceNumber") || 0;
  let next = parseInt(last) + 1;

  localStorage.setItem("invoiceNumber", next);

  return `INV-${String(next).padStart(4, "0")}`;
};