export function formatPrice(price) {
  if (price === 0 || price === "0.00") return "Free";
  return `₹${parseFloat(price).toLocaleString("en-IN")}`;
}
