import React, { useEffect, useState } from "react";

const SalesStats = () => {
  const [stats, setStats] = useState({
    total: 0,
    today: 0,
    monthly: 0,
    invoices: 0,
    cgst: 0,
    sgst: 0,
    topItems: [],
  });

  useEffect(() => {
    // ✅ Fetch all invoices from localStorage
    const data = JSON.parse(localStorage.getItem("invoices")) || [];

    let total = 0;
    let today = 0;
    let monthly = 0;
    let cgst = 0;
    let sgst = 0;

    const now = new Date();
    const todayDate = now.toISOString().split("T")[0]; // YYYY-MM-DD
    const month = now.getMonth();
    const year = now.getFullYear();

    const itemMap = {}; // for top selling items

    data.forEach((inv) => {
      const invTotal = Number(inv.total) || 0;
      total += invTotal;

      // ✅ Today sales
      if (inv.date) {
        const invDateObj = new Date(inv.date);
        if (!isNaN(invDateObj)) {
          const invDateStr = invDateObj.toISOString().split("T")[0];
          if (invDateStr === todayDate) today += invTotal;

          // ✅ Monthly sales
          if (invDateObj.getMonth() === month && invDateObj.getFullYear() === year) {
            monthly += invTotal;
          }
        }
      }

      // ✅ GST and Top Items
      (inv.items || []).forEach((item) => {
        const qty = Number(item.qty) || 0;
        const price = Number(item.pts) || Number(item.rate) || Number(item.mrp) || 0;
        const base = qty * price;
        const gst = Number(item.gst) || 0;

        cgst += (base * gst) / 200;
        sgst += (base * gst) / 200;

        // Top selling items
        const name = (item.name || "Unknown").trim();
        if (!itemMap[name]) itemMap[name] = 0;
        itemMap[name] += qty;
      });
    });

    // ✅ Get top 5 selling items
    const topItems = Object.entries(itemMap)
      .map(([name, qty]) => ({ name, qty }))
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 5);

    setStats({
      total,
      today,
      monthly,
      invoices: data.length,
      cgst,
      sgst,
      topItems,
    });
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-6">

      <h1 className="text-2xl font-bold text-gray-700">
        📊 Sales Analytics
      </h1>

      {/* ✅ SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

        <Card title="Total Sales" value={`₹${stats.total.toFixed(2)}`} color="bg-blue-100 text-blue-700" />

        <Card title="Today Sales" value={`₹${stats.today.toFixed(2)}`} color="bg-green-100 text-green-700" />

        <Card title="Monthly Sales" value={`₹${stats.monthly.toFixed(2)}`} color="bg-purple-100 text-purple-700" />

        <Card title="Invoices" value={stats.invoices} color="bg-yellow-100 text-yellow-700" />

      </div>

      {/* ✅ GST SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <Card title="Total CGST" value={`₹${stats.cgst.toFixed(2)}`} color="bg-pink-100 text-pink-700" />

        <Card title="Total SGST" value={`₹${stats.sgst.toFixed(2)}`} color="bg-indigo-100 text-indigo-700" />

      </div>

      {/* ✅ TOP ITEMS */}
      <div className="bg-white p-5 rounded-xl shadow-sm border">

        <h2 className="font-semibold text-gray-700 mb-4">
          💊 Top Selling Items
        </h2>

        {stats.topItems.length === 0 ? (
          <p className="text-gray-400">No data available</p>
        ) : (
          <ul className="space-y-3">
            {stats.topItems.map((item, i) => (
              <li
                key={i}
                className="flex justify-between items-center bg-gray-50 px-4 py-2 rounded-lg hover:bg-gray-100 transition"
              >
                <span className="font-medium text-gray-700">
                  {item.name}
                </span>
                <span className="text-sm font-semibold text-gray-600">
                  {item.qty} units
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

    </div>
  );
};

// ✅ BEAUTIFUL CARD COMPONENT
const Card = ({ title, value, color }) => (
  <div className={`p-4 rounded-xl shadow-sm ${color}`}>
    <p className="text-sm opacity-80">{title}</p>
    <h2 className="text-xl font-bold mt-1">{value}</h2>
  </div>
);

export default SalesStats;