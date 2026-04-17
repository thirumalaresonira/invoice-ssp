import React, { useEffect, useState } from "react";

const Customers = () => {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    // Fetch invoices from localStorage
    const invoices = JSON.parse(localStorage.getItem("invoices")) || [];

    // Extract unique customers from invoices
    const customerMap = new Map();

    invoices.forEach((invoice) => {
      const key = invoice.customerName;
      if (!customerMap.has(key)) {
        customerMap.set(key, {
          name: invoice.customerName,
          phone: invoice.phone || "-",
          address: invoice.address || "-",
          totalPrice: invoice.total || 0,
          totalInvoices: 1,
        });
      } else {
        const existing = customerMap.get(key);
        existing.totalPrice += invoice.total || 0;
        existing.totalInvoices += 1;
        customerMap.set(key, existing);
      }
    });

    setCustomers(Array.from(customerMap.values()));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-accent">Customers</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-black text-[12px]">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-black px-3 py-2 text-left">#</th>
              <th className="border border-black px-3 py-2 text-left">Customer Name</th>
              <th className="border border-black px-3 py-2 text-left">Phone</th>
              <th className="border border-black px-3 py-2 text-left">Address</th>
              <th className="border border-black px-3 py-2 text-right">Total Invoices</th>
              <th className="border border-black px-3 py-2 text-right">Total Amount</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="border border-black px-3 py-2">{index + 1}</td>
                <td className="border border-black px-3 py-2">{customer.name}</td>
                <td className="border border-black px-3 py-2">{customer.phone}</td>
                <td className="border border-black px-3 py-2">{customer.address}</td>
                <td className="border border-black px-3 py-2 text-right">{customer.totalInvoices}</td>
                <td className="border border-black px-3 py-2 text-right">₹{customer.totalPrice?.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Customers;