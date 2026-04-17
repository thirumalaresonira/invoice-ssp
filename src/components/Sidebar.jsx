import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Boxes,
  Users,
  PlusCircle,
  Menu
} from "lucide-react";

const links = [
  { name: "Dashboard", path: "/", icon: LayoutDashboard },
  { name: "Invoice", path: "/invoice", icon: FileText },
  { name: "Inventory", path: "/inventory", icon: Boxes },
  { name: "Customers", path: "/customers", icon: Users },
  { name: "CreateInvoice", path: "/create-invoice", icon: PlusCircle },
];

const Sidebar = () => {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));

  // ✅ Collapsible state
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`${
        collapsed ? "w-20" : "w-64"
      } bg-white dark:bg-gray-900 shadow-soft h-screen p-4 sticky top-0 transition-all duration-300`}
    >
      {/* 🔘 Toggle Button */}
      <div className="flex justify-between items-center mb-6">
        {!collapsed && (
          <h2 className="text-xl font-semibold text-accent dark:text-white">
            Menu
          </h2>
        )}
        <button onClick={() => setCollapsed(!collapsed)}>
          <Menu className="text-gray-600 dark:text-gray-300" />
        </button>
      </div>

      {/* 👤 User Info */}
      {!collapsed && user && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          {user.username} ({user.role})
        </p>
      )}

      {/* 🔗 Links */}
      <ul className="space-y-3">
        {links.map(link => {
          if (link.name === "Inventory" && user?.role !== "admin") {
            return null;
          }

          const Icon = link.icon;
          const isActive = location.pathname === link.path;

          return (
            <li key={link.name}>
              <Link
                to={link.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-all relative
                  ${
                    isActive
                      ? "bg-pastelBlue text-white"
                      : "text-gray-700 dark:text-gray-300 hover:bg-pastelBlue hover:text-white"
                  }`}
              >
                {/* 🔥 Active Indicator */}
                {isActive && (
                  <span className="absolute left-0 top-0 h-full w-1 bg-blue-600 rounded-r"></span>
                )}

                <Icon size={20} />

                {!collapsed && <span>{link.name}</span>}
              </Link>
            </li>
          );
        })}
      </ul>

      {/* 🌙 Dark Mode Toggle */}
      <div className="absolute bottom-6 left-4 right-4">
        <button
          onClick={() => {
            document.documentElement.classList.toggle("dark");
          }}
          className="w-full bg-gray-200 dark:bg-gray-700 text-sm py-2 rounded-lg"
        >
          🌙 Toggle Theme
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;