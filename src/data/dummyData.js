export const customers = [
  { id: 1, name: "John Doe", phone: "9876543210" },
  { id: 2, name: "Jane Smith", phone: "9876501234" },
];

export const inventory = [
  { id: 1, name: "Paracetamol", price: 50, quantity: 100 },
  { id: 2, name: "Ibuprofen", price: 80, quantity: 50 },
];

export const invoices = [
  {
    id: 101,
    customer: "John Doe",
    items: [
      { name: "Paracetamol", quantity: 2, price: 50 },
      { name: "Ibuprofen", quantity: 1, price: 80 },
    ],
    date: "2026-04-06",
  },
];