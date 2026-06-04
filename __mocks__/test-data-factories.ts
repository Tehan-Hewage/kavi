import { faker } from "@faker-js/faker";

// ─── Product factory ────────────────────────────────────────
export function makeProduct(overrides = {}) {
  return {
    id:           faker.string.alphanumeric(8),
    name:         faker.commerce.productName(),
    price:        faker.number.int({ min: 500, max: 50000 }),
    image_url:    "https://www.kapruka.com/images/test-product.jpg",
    category:     faker.commerce.department(),
    rating:       faker.number.float({ min: 3.5, max: 5.0, fractionDigits: 1 }),
    review_count: faker.number.int({ min: 10, max: 500 }),
    description:  faker.commerce.productDescription(),
    in_stock:     true,   // real Kapruka MCP API field
    available:    true,   // legacy fallback kept for test compat
    ...overrides,
  };
}

// ─── Product list factory ───────────────────────────────────
export function makeProductList(count = 5) {
  return Array.from({ length: count }, () => makeProduct());
}

// ─── Delivery quote factory ─────────────────────────────────
export function makeDeliveryQuote(overrides = {}) {
  return {
    deliverable:       true,
    delivery_fee:      350,
    earliest_date:     new Date(Date.now() + 86400000).toISOString().split("T")[0],
    perishable_warning: null,
    ...overrides,
  };
}

// ─── Order factory ──────────────────────────────────────────
export function makeOrder(overrides = {}) {
  const orderId = `KP-${Date.now()}`;
  return {
    order_id:   orderId,
    pay_url:    `https://www.kapruka.com/pay/${orderId}`,
    total:      faker.number.int({ min: 1000, max: 20000 }),
    expires_at: new Date(Date.now() + 3600000).toISOString(),
    ...overrides,
  };
}

// ─── Order tracking factory ─────────────────────────────────
export function makeOrderTracking(overrides = {}) {
  return {
    order_id:  "KP-20260604-1234",
    status:    "out_for_delivery",
    recipient: "Nimal Perera",
    items: [
      { name: "Birthday Cake",   quantity: 1, price: 3500 },
      { name: "Samsung Galaxy",  quantity: 1, price: 89990 },
    ],
    timeline: [
      { event: "Order placed",   timestamp: new Date(Date.now() - 86400000 * 2).toISOString() },
      { event: "Confirmed",      timestamp: new Date(Date.now() - 86400000).toISOString() },
      { event: "Processing",     timestamp: new Date(Date.now() - 3600000).toISOString() },
      { event: "Out for delivery", timestamp: new Date().toISOString() },
    ],
    estimated_delivery: new Date(Date.now() + 7200000).toISOString(),
    ...overrides,
  };
}

// ─── Category factory ───────────────────────────────────────
export function makeCategories() {
  return [
    { id: "cat-1", name: "Cakes",        slug: "cakes",       product_count: 120 },
    { id: "cat-2", name: "Flowers",      slug: "flowers",     product_count: 89  },
    { id: "cat-3", name: "Electronics",  slug: "electronics", product_count: 450 },
    { id: "cat-4", name: "Chocolates",   slug: "chocolates",  product_count: 67  },
    { id: "cat-5", name: "Books",        slug: "books",       product_count: 230 },
  ];
}

// ─── Cart item factory ──────────────────────────────────────
export function makeCartItem(overrides = {}) {
  const product = makeProduct();
  return {
    product_id: product.id,
    name:       product.name,
    price:      product.price,
    image_url:  product.image_url,
    quantity:   1,
    ...overrides,
  };
}
