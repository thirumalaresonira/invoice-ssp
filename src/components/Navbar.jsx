import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const [query, setQuery] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  // ✅ SEARCH FUNCTION
  const handleSearch = (e) => {
    e.preventDefault();

    if (!query.trim()) return;

    const invoices = JSON.parse(localStorage.getItem("invoices")) || [];

    // ✅ Find matching invoice
    const result = invoices.find((inv) =>
      inv.invoiceNo?.toString().includes(query) ||
      inv.customerName?.toLowerCase().includes(query.toLowerCase()) ||
      inv.phone?.includes(query)
    );

    if (result) {
      // ✅ Go to invoice view page
      navigate("/invoice", { state: result });
    } else {
      alert("No matching invoice found");
    }

    setQuery("");
  };

  return (
    <nav className="bg-white shadow-soft p-4 flex justify-between items-center sticky top-0 z-50">
      
      <h1 className="text-2xl font-bold text-accent">Pharmacy ERP</h1>

      <div className="flex items-center gap-4">

        {/* 🔍 SEARCH FORM (STYLED) */}
<form onSubmit={handleSearch} className="relative">
  
  {/* Search Icon */}
  <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
    🔍
  </span>

  <input
    type="search"
    value={query}
    onChange={(e) => setQuery(e.target.value)}
    placeholder="Search invoice, customer..."
    
    className="
      pl-10 pr-4 py-2 w-64
      rounded-full
      bg-gray-50
      border border-gray-200
      text-sm text-gray-700
      
      shadow-sm
      transition-all duration-200
      
      focus:outline-none
      focus:ring-2 focus:ring-indigo-300
      focus:bg-white
      focus:shadow-md
      
      placeholder-gray-400
    "
  />
</form>

        {/* 👤 User Info */}
        {user && (
          <span className="text-sm text-gray-600">
  {user.username} 
  <span className="ml-1 text-xs bg-gray-200 px-2 py-0.5 rounded">
    {user.role.toUpperCase()}
  </span>
</span>
        )}

        {/* 🚪 Logout */}
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-accent text-white rounded hover:bg-indigo-700 transition"
        >
          Logout
        </button>

      </div>
    </nav>
  );
};

export default Navbar;