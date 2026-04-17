import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { calculateGST } from "../utils/gstCalculator";
import { getNextInvoiceNumber } from "../utils/invoiceNumber";
import { updateStock } from "../utils/inventoryManager";

const CreateInvoice = () => {
  const navigate = useNavigate();

  const [invoiceType, setInvoiceType] = useState("GST");
  const [gstType, setGstType] = useState("INTRA"); // ✅ ADDED
  const [paymentMode, setPaymentMode] = useState("Cash");

  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    address: "",
    state: "", // ✅ ADD
  });

  const [selectedRow, setSelectedRow] = useState(null); // ✅ NEW

  const [items, setItems] = useState([
    {
      name: "",
      qty: 1,
      rate: 0,
      gst: 0,
      hsn: "",
      batch: "",
      expiry: "",
      mrp: "",
      pack: "",
      free: 0,
      ptr: 0,
      pts: 0,
      cgst: 0,
      sgst: 0,
      igst: 0, // ✅ ADDED
      total: 0
    }
  ]);

  const [inventory, setInventory] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("inventory")) || [];
    setInventory(data);
  }, []);

  const handleChange = (index, field, value) => {
    const updated = [...items];

    if (["qty", "rate", "gst", "free", "ptr", "pts"].includes(field)) {
      updated[index][field] = Number(value);
    } else {
      updated[index][field] = value;
    }

    if (field === "name") {
      const product = inventory.find(p => p.name === value);
      if (product) {
        updated[index].rate = product.rate || 0;
        updated[index].gst = product.gst || 0;
        updated[index].hsn = product.hsn || "";
        updated[index].batch = product.batch || "";
        updated[index].expiry = product.expiry || "";
        updated[index].mrp = product.mrp || "";
        updated[index].pack = product.pack || "";
        updated[index].ptr = product.ptr || 0;
        updated[index].pts = product.pts || 0;
      }
    }

    const base = updated[index].qty * (updated[index].pts || updated[index].rate || 0);

     if (invoiceType === "GST") {
      if (gstType === "INTRA") {
        const cgst = (base * updated[index].gst) / 200;
        const sgst = (base * updated[index].gst) / 200;

        updated[index].cgst = cgst;
        updated[index].sgst = sgst;
        updated[index].igst = 0;

        updated[index].total = base + cgst + sgst;
      } else {
        const igst = (base * updated[index].gst) / 100;

        updated[index].igst = igst;
        updated[index].cgst = 0;
        updated[index].sgst = 0;

        updated[index].total = base + igst;
      }
    } else {
      updated[index].cgst = 0;
      updated[index].sgst = 0;
      updated[index].igst = 0;
      updated[index].total = base;
    }

    setItems(updated);
  };


  const addItem = () => {
    setItems([
      ...items,
      {
        name: "",
        qty: 1,
        rate: 0,
        gst: 0,
        hsn: "",
        batch: "",
        expiry: "",
        mrp: "",
        pack: "",
        free: 0,
        ptr: 0,
        pts: 0,
        cgst: 0,
        sgst: 0,
         igst: 0, // ✅ ADDED
        total: 0
      }
    ]);
  };

  // ✅ DELETE SELECTED ROW
  const deleteSelected = () => {
    if (selectedRow === null) return;

    const updated = items.filter((_, i) => i !== selectedRow);

    setItems(updated.length ? updated : [
      {
        name: "",
        qty: 1,
        rate: 0,
        gst: 0,
        hsn: "",
        batch: "",
        expiry: "",
        mrp: "",
        pack: "",
        free: 0,
        ptr: 0,
        pts: 0,
        cgst: 0,
        sgst: 0,
         igst: 0, // ✅ ADDED
        total: 0
      }
    ]);

    setSelectedRow(null);
  };

  const totals =
    invoiceType === "GST"
      ? calculateGST(items)
      : {
          items: items.map(i => ({
            ...i,
            total: i.qty * i.rate
          })),
          subtotal: items.reduce((a, b) => a + (b.qty * b.rate || 0), 0),
          cgstTotal: 0,
          sgstTotal: 0,
          igstTotal: 0, // ✅ ADDED
          total: items.reduce((a, b) => a + (b.qty * b.rate || 0), 0)
        };

  const handleGenerate = () => {
    const calculated =
      invoiceType === "GST"
        ? calculateGST(items)
        : totals;

    const invoice = {
      invoiceType,
      invoiceNo: getNextInvoiceNumber(),
      date: new Date().toLocaleDateString(),
      customerName: customer.name,
      phone: customer.phone,
      address: customer.address,
      paymentMode,
      items: calculated.items || [],
    subtotal: calculated.subtotal,
    total: calculated.total,
    cgstTotal: calculated.cgstTotal,
    sgstTotal: calculated.sgstTotal,
    igstTotal: calculated.igstTotal, // ✅ ADDED
    gstSummary: calculated.gstSummary   // ✅ ✅ ADD THIS LINE ONLY
    };

    const old = JSON.parse(localStorage.getItem("invoices")) || [];
    localStorage.setItem("invoices", JSON.stringify([...old, invoice]));

    updateStock(calculated.items || []);

    navigate("/invoice", { state: invoice });
  };

  return (
    <div className="p-6 max-w-full">
      <h1 className="text-xl font-bold mb-4">Create Invoice</h1>

      {/* Top Controls */}
      <div className="mb-4 flex gap-4 items-center">
        <div>
          <label className="font-bold mr-3">Invoice Type:</label>
          <select className="border px-3 py-1 rounded"
            value={invoiceType}
            onChange={(e) => setInvoiceType(e.target.value)}>
            <option value="GST">GST Invoice</option>
            <option value="NON_GST">Non-GST Invoice</option>
          </select>
        </div>

         {/* ✅ ADDED GST TYPE */}
        <div>
          <label className="font-bold mr-3">GST Type:</label>
          <select className="border px-3 py-1 rounded"
            value={gstType}
            onChange={(e) => setGstType(e.target.value)}>
            <option value="INTRA">Intra State</option>
            <option value="INTER">Inter State</option>
          </select>
        </div>

        <div>
          <label className="font-bold mr-3">Payment:</label>
          <select className="border px-3 py-1 rounded"
            value={paymentMode}
            onChange={(e) => setPaymentMode(e.target.value)}>
            <option value="Cash">Cash</option>
            <option value="Credit">Credit</option>
          </select>
        </div>
      </div>

      {/* Customer */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <input className="border px-3 py-2 rounded" placeholder="Name"
          onChange={e => setCustomer({ ...customer, name: e.target.value })} />
        <input className="border px-3 py-2 rounded" placeholder="Phone"
          onChange={e => setCustomer({ ...customer, phone: e.target.value })} />
        <input className="border px-3 py-2 rounded" placeholder="Address"
          onChange={e => setCustomer({ ...customer, address: e.target.value })} />
      </div>

      {/* TABLE */}
      <div className="overflow-auto bg-white rounded shadow">
        <table className="min-w-full text-xs border">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Item</th>
              <th className="border p-2">Pack</th>
              <th className="border p-2">Qty</th>
              <th className="border p-2">Free</th>
              <th className="border p-2">Rate</th>
              <th className="border p-2">GST%</th>
              <th className="border p-2">HSN</th>
              <th className="border p-2">Batch</th>
              <th className="border p-2">Exp</th>
              <th className="border p-2">MRP</th>
              <th className="border p-2">PTR</th>
              <th className="border p-2">PTS</th>
              <th className="border p-2">CGST</th>
              <th className="border p-2">SGST</th>
              <th className="border p-2">Total</th>
            </tr>
          </thead>

          <tbody>
            {items.map((item, i) => (
              <tr
                key={i}
                onClick={() => setSelectedRow(i)}
                className={`cursor-pointer ${
                  selectedRow === i ? "bg-blue-100" : "hover:bg-gray-50"
                }`}
              >
                <td className="border p-1">
                  <select className="w-full"
                    onChange={e => handleChange(i, "name", e.target.value)}>
                    <option>Select</option>
                    {inventory.map(p => (
                      <option key={p.id}>{p.name}</option>
                    ))}
                  </select>
                </td>

                <td className="border p-1">
                  <input className="w-full"
                    value={item.pack}
                    onChange={e => handleChange(i, "pack", e.target.value)} />
                </td>

                <td className="border p-1">
                  <input type="number" className="w-full"
                    value={item.qty}
                    onChange={e => handleChange(i, "qty", e.target.value)} />
                </td>

                <td className="border p-1">
                  <input type="number" className="w-full"
                    value={item.free}
                    onChange={e => handleChange(i, "free", e.target.value)} />
                </td>

                <td className="border p-1">
                  <input type="number" className="w-full"
                    value={item.rate}
                    onChange={e => handleChange(i, "rate", e.target.value)} />
                </td>

                <td className="border p-1">
                  <input type="number" className="w-full"
                    value={item.gst}
                    onChange={e => handleChange(i, "gst", e.target.value)} />
                </td>

                <td className="border p-1">
                  <input className="w-full"
                    value={item.hsn}
                    onChange={e => handleChange(i, "hsn", e.target.value)} />
                </td>

                <td className="border p-1">
                  <input className="w-full"
                    value={item.batch}
                    onChange={e => handleChange(i, "batch", e.target.value)} />
                </td>

                <td className="border p-1">
                  <input
    type="date"
    className="w-full"
    value={item.expiry}
    onChange={e => handleChange(i, "expiry", e.target.value)}
  />
                </td>

                <td className="border p-1">
                  <input className="w-full"
                    value={item.mrp}
                    onChange={e => handleChange(i, "mrp", e.target.value)} />
                </td>

                <td className="border p-1">
                  <input className="w-full"
                    value={item.ptr}
                    onChange={e => handleChange(i, "ptr", e.target.value)} />
                </td>

                <td className="border p-1">
                  <input className="w-full"
                    value={item.pts}
                    onChange={e => handleChange(i, "pts", e.target.value)} />
                </td>

                <td className="border p-1 text-center">
                  {item.cgst?.toFixed(2)}
                </td>

                <td className="border p-1 text-center">
                  {item.sgst?.toFixed(2)}
                </td>

                <td className="border p-1 font-bold text-right">
                  ₹{item.total?.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex gap-3 mt-3">
        <button
          onClick={addItem}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          + Add Item
        </button>

        <button
          onClick={deleteSelected}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          🗑️ Delete
        </button>
      </div>

      {/* Totals */}
      <div className="mt-6 border-t pt-4 text-right">
        <p>Subtotal: ₹{totals?.subtotal?.toFixed(2)}</p>

         {invoiceType === "GST" && gstType === "INTRA" && (
          <>
            <p>CGST: ₹{totals?.cgstTotal?.toFixed(2)}</p>
            <p>SGST: ₹{totals?.sgstTotal?.toFixed(2)}</p>
          </>
        )}

        {invoiceType === "GST" && gstType === "INTER" && (
          <p>IGST: ₹{totals?.igstTotal?.toFixed(2)}</p>
        )}

        <p className="font-bold text-lg">
          Grand Total: ₹{totals?.total?.toFixed(2)}
        </p>
      </div>

      <button
        onClick={handleGenerate}
        className="mt-6 bg-green-600 text-white px-5 py-2 rounded"
      >
        Generate Invoice
      </button>
    </div>
  );
};

export default CreateInvoice;