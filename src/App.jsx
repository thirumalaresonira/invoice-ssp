import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import { AuthContext } from "./context/AuthContext";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

import Dashboard from "./pages/Dashboard";
import Invoice from "./pages/Invoice";
import Inventory from "./pages/Inventory";
import Customers from "./pages/Customers";
import CreateInvoice from "./pages/CreateInvoice";
import Login from "./pages/Login";

import InvoicePDFView from "./pages/InvoicePDFView";

import SalesStats from "./pages/SalesStats";

const App = () => {

  // ✅ USE CONTEXT (NOT localStorage)
  const { user } = useContext(AuthContext);

  return (
    <Router>
      <div className="flex">

        {user && <Sidebar />}

        <div className="flex-1">
          {user && <Navbar />}

          <Routes>

            <Route
              path="/"
              element={user ? <Dashboard /> : <Navigate to="/login" />}
            />

            <Route
              path="/invoice"
              element={user ? <Invoice /> : <Navigate to="/login" />}
            />

            <Route
              path="/inventory"
              element={
                user
                  ? user.role === "admin"
                    ? <Inventory />
                    : <Navigate to="/" />
                  : <Navigate to="/login" />
              }
            />

            <Route
              path="/customers"
              element={user ? <Customers /> : <Navigate to="/login" />}
            />

            <Route
              path="/create-invoice"
              element={user ? <CreateInvoice /> : <Navigate to="/login" />}
            />

            <Route
              path="/login"
              element={!user ? <Login /> : <Navigate to="/" />}
            />

            <Route path="/invoice-pdf" element={<InvoicePDFView />} />

            <Route path="/sales-stats" element={<SalesStats />} />

          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;