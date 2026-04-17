export const getReports = () => {
  const invoices = JSON.parse(localStorage.getItem("invoices")) || [];

  let totalSales = 0;
  let productMap = {};

  invoices.forEach(inv => {
    totalSales += inv.total;

    inv.items.forEach(item => {
      productMap[item.name] =
        (productMap[item.name] || 0) + item.qty;
    });
  });

  return {
    totalSales,
    totalInvoices: invoices.length,
    topProducts: Object.entries(productMap).sort((a, b) => b[1] - a[1]),
  };
};