import React from "react";

const InvoiceSummary = ({ items }) => {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return (
    <div className="mt-4 p-4 bg-white shadow rounded">
      
      
    </div>
  );
};

export default InvoiceSummary;