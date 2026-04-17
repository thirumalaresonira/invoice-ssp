export const updateStock = (items) => {
  let inventory = JSON.parse(localStorage.getItem("inventory")) || [];

  const updated = inventory.map((product) => {
    const soldItem = items.find(i => i.name === product.name);

    if (soldItem) {
      return {
        ...product,
        stock: product.stock - soldItem.qty,
      };
    }

    return product;
  });

  localStorage.setItem("inventory", JSON.stringify(updated));
};