import { useState, useEffect } from "react";

const Inventory = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("inventory")) || [];
    setItems(data);
  }, []);

  const handleChange = (index, field, value) => {
    const updated = [...items];

    updated[index][field] =
      ["rate", "gst", "mrp", "ptr", "pts"].includes(field)
        ? Number(value)
        : value;

    setItems(updated);
    localStorage.setItem("inventory", JSON.stringify(updated));
  };

  const addItem = () => {
    const newItem = {
      id: Date.now(),
      name: "",
      rate: 0,
      gst: 0,
      hsn: "",
      qty:"",
      batch: "",
      expiry: "",
      mrp: "",

      // ✅ NEW FIELDS
      pack: "",
      ptr: 0,
      pts: 0
    };

    const updated = [...items, newItem];
    setItems(updated);
    localStorage.setItem("inventory", JSON.stringify(updated));
  };

  const deleteItem = (index) => {
    const updated = items.filter((_, i) => i !== index);
    setItems(updated);
    localStorage.setItem("inventory", JSON.stringify(updated));
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Inventory</h1>

      {/* Header */}
      <div className="grid grid-cols-12 gap-2 font-bold border-b pb-2 text-sm">
        <span>Name</span>
        <span>Rate</span>
        <span>GST%</span>
        <span>HSN</span>
        <span>Qty</span>
        <span>Batch</span>
        <span>Expiry</span>
        <span>MRP</span>


        {/* ✅ NEW */}
        <span>Pack</span>
        <span>PTR</span>
        <span>PTS</span>

        <span>Action</span>
      </div>

      {/* Rows */}
      {items.map((item, i) => (
        <div key={item.id} className="grid grid-cols-12 gap-2 mt-2 text-sm">

          <input className="border p-1"
            value={item.name}
            onChange={e => handleChange(i, "name", e.target.value)} />

          <input type="number" className="border p-1"
            value={item.rate}
            onChange={e => handleChange(i, "rate", e.target.value)} />

          <input type="number" className="border p-1"
            value={item.gst}
            onChange={e => handleChange(i, "gst", e.target.value)} />

          <input className="border p-1"
            value={item.hsn}
            onChange={e => handleChange(i, "hsn", e.target.value)} />

          <input className="border p-1"
            value={item.qty}
            onChange={e => handleChange(i, "qty", e.target.value)} />
          

          <input className="border p-1"
            value={item.batch}
            onChange={e => handleChange(i, "batch", e.target.value)} />

          <input type="date" className="border p-1"
            value={item.expiry}
            onChange={e => handleChange(i, "expiry", e.target.value)} />

          <input type="number" className="border p-1"
            value={item.mrp}
            onChange={e => handleChange(i, "mrp", e.target.value)} />

          {/* ✅ NEW FIELDS */}

          <input className="border p-1"
            value={item.pack}
            onChange={e => handleChange(i, "pack", e.target.value)} />

          <input type="number" className="border p-1"
            value={item.ptr}
            onChange={e => handleChange(i, "ptr", e.target.value)} />

          <input type="number" className="border p-1"
            value={item.pts}
            onChange={e => handleChange(i, "pts", e.target.value)} />

          <button
            onClick={() => deleteItem(i)}
            className="bg-red-500 text-white px-2"
          >
            Delete
          </button>
        </div>
      ))}

      <button
        onClick={addItem}
        className="mt-4 bg-green-600 text-white px-4 py-2"
      >
        + Add Medicine
      </button>
    </div>
  );
};

export default Inventory;