import React from "react";
import { getReports } from "../utils/reportUtils";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const invoices = JSON.parse(localStorage.getItem("invoices")) || [];
  const inventory = JSON.parse(localStorage.getItem("inventory")) || [];

  const report = getReports();

  // ✅ Stats with navigation
  const stats = [
    {
      name: "Total Inventory Items",
      value: inventory.length,
      color: "bg-green-200",
      route: "/inventory",
    },
    {
      name: "Total Invoices",
      value: report.totalInvoices,
      color: "bg-blue-200",
      route: "/invoice",
    },
    {
      name: "Total Sales",
      value: `₹${report.totalSales}`,
      color: "bg-pink-200",
      route: "/sales-stats",
    },
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          Dashboard
        </h1>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((stat) => (
            <div
              key={stat.name}
              onClick={() => navigate(stat.route)}
              className={`p-6 rounded-xl shadow-md cursor-pointer transform hover:scale-105 transition ${stat.color}`}
            >
              <h2 className="text-xl font-semibold">{stat.name}</h2>
              <p className="text-3xl font-bold mt-2">{stat.value}</p>
            </div>
          ))}
        </div>

       
        {/* Recent Invoices */}
        <div className="mt-8 p-6 bg-white rounded-xl shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Recent Invoices
          </h2>

          <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="px-4 py-2">Invoice ID</th>
                <th className="px-4 py-2">Customer</th>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Items</th>
              </tr>
            </thead>

            <tbody>
              {invoices.length > 0 ? (
                invoices
                  .slice(-5)
                  .reverse()
                  .map((inv, i) => (
                    <tr
                      key={i}
                      className="text-gray-700 hover:bg-gray-50 transition"
                    >
                      <td className="px-4 py-2">{inv.invoiceNo}</td>
                      <td className="px-4 py-2">{inv.customerName}</td>
                      <td className="px-4 py-2">{inv.date}</td>
                      <td className="px-4 py-2">
                        {inv.items?.length || 0}
                      </td>
                    </tr>
                  ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="text-center py-4 text-gray-500"
                  >
                    No invoices found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;