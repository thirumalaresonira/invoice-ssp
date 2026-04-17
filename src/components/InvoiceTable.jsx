import React from "react";

const InvoiceTable = ({ items }) => (
  <table className="min-w-full bg-white border border-gray-200">
    <thead>
      <tr>
        <th className="px-4 py-2 border">Item</th>
        <th className="px-4 py-2 border">Qty</th>
        <th className="px-4 py-2 border">Rate</th>
        <th className="px-4 py-2 border">Total</th>
      </tr>
    </thead>
    <tbody>
      {items.map((item, index) => (
        <tr key={index}>
          <td className="px-4 py-2 border">{item.name}</td>
          <td className="px-4 py-2 border">{item.qty}</td>
          <td className="px-4 py-2 border">{item.rate}</td>
          <td className="px-4 py-2 border">
            ₹{item.total?.toFixed(2)}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default InvoiceTable;