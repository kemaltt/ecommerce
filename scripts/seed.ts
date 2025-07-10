import { db } from "../server/db";
import { customers, products, marketplaces, orders, orderItems } from "../shared/schema";

async function seed() {
  console.log("Seeding database...");

  // Clear existing data
  await db.delete(orderItems);
  await db.delete(orders);
  await db.delete(products);
  await db.delete(customers);
  await db.delete(marketplaces);

  // Create default marketplaces
  const defaultMarketplaces = [
    { name: "Local Store", type: "local", isConnected: true },
    { name: "Amazon", type: "amazon", isConnected: true },
    { name: "eBay", type: "ebay", isConnected: true },
    { name: "Shopify", type: "shopify", isConnected: true },
    { name: "WooCommerce", type: "woocommerce", isConnected: false },
    { name: "Kaufland", type: "kaufland", isConnected: false },
    { name: "Shopware6", type: "shopware6", isConnected: false },
  ];

  const insertedMarketplaces = await db.insert(marketplaces).values(defaultMarketplaces.map(mp => ({
    ...mp,
    apiKey: null,
    apiSecret: null,
    storeUrl: null,
    lastSync: mp.isConnected ? new Date() : null,
    stockTracking: true,
    autoUpdateStock: true,
  }))).returning();

  // Create sample products
  const sampleProducts = [
    {
      name: "Wireless Headphones",
      description: "High-quality wireless headphones with noise cancellation",
      sku: "WH-2023-001",
      price: "89.99",
      stock: 45,
      imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
      status: "active",
    },
    {
      name: "Smart Watch",
      description: "Feature-rich smartwatch with health monitoring",
      sku: "SW-2023-002",
      price: "199.99",
      stock: 23,
      imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
      status: "active",
    },
    {
      name: "Portable Speaker",
      description: "Waterproof portable Bluetooth speaker",
      sku: "PS-2023-003",
      price: "59.99",
      stock: 78,
      imageUrl: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop",
      status: "active",
    },
  ];

  const insertedProducts = await db.insert(products).values(sampleProducts).returning();

  // Create sample customers
  const sampleCustomers = [
    {
      name: "John Smith",
      email: "john@example.com",
      phone: "+1234567890",
      address: "123 Main St, Berlin, Germany",
    },
    {
      name: "Sarah Johnson",
      email: "sarah@example.com",
      phone: "+1234567891",
      address: "456 Oak Ave, Munich, Germany",
    },
    {
      name: "Michael Davis",
      email: "michael@example.com",
      phone: "+1234567892",
      address: "789 Pine Rd, Hamburg, Germany",
    },
    {
      name: "Emma Wilson",
      email: "emma.wilson@example.com",
      phone: "+49123456789",
      address: "Unter den Linden 45, Berlin, Germany",
    },
    {
      name: "David Brown",
      email: "david.brown@example.com",
      phone: "+49987654321",
      address: "Marienplatz 12, Munich, Germany",
    },
    {
      name: "Lisa Martinez",
      email: "lisa.martinez@example.com",
      phone: "+49555123456",
      address: "Königsallee 67, Düsseldorf, Germany",
    },
    {
      name: "Tom Anderson",
      email: "tom.anderson@example.com",
      phone: "+49777888999",
      address: "Reeperbahn 23, Hamburg, Germany",
    },
    {
      name: "Anna Schmidt",
      email: "anna.schmidt@example.com",
      phone: "+49333444555",
      address: "Potsdamer Platz 8, Berlin, Germany",
    },
  ];

  const insertedCustomers = await db.insert(customers).values(sampleCustomers).returning();

  // Create sample orders with varied dates and statuses
  const now = new Date();
  const sampleOrders = [
    {
      orderId: "AMZ-12345",
      customerId: insertedCustomers[0].id,
      marketplaceId: insertedMarketplaces[0].id, // Amazon
      status: "shipped",
      totalAmount: "89.99",
      currency: "EUR",
      orderDate: new Date(now.getTime() - 24 * 60 * 60 * 1000), // 1 day ago
    },
    {
      orderId: "EBY-67890",
      customerId: insertedCustomers[1].id,
      marketplaceId: insertedMarketplaces[1].id, // eBay
      status: "pending",
      totalAmount: "199.99",
      currency: "EUR",
      orderDate: new Date(now.getTime() - 12 * 60 * 60 * 1000), // 12 hours ago
    },
    {
      orderId: "SHF-11223",
      customerId: insertedCustomers[2].id,
      marketplaceId: insertedMarketplaces[2].id, // Shopify
      status: "delivered",
      totalAmount: "119.98",
      currency: "EUR",
      orderDate: new Date(now.getTime() - 48 * 60 * 60 * 1000), // 2 days ago
    },
    {
      orderId: "AMZ-54321",
      customerId: insertedCustomers[3].id,
      marketplaceId: insertedMarketplaces[0].id, // Amazon
      status: "delivered",
      totalAmount: "259.97",
      currency: "EUR",
      orderDate: new Date(now.getTime() - 72 * 60 * 60 * 1000), // 3 days ago
    },
    {
      orderId: "EBY-98765",
      customerId: insertedCustomers[4].id,
      marketplaceId: insertedMarketplaces[1].id, // eBay
      status: "shipped",
      totalAmount: "59.99",
      currency: "EUR",
      orderDate: new Date(now.getTime() - 6 * 60 * 60 * 1000), // 6 hours ago
    },
    {
      orderId: "SHF-33445",
      customerId: insertedCustomers[5].id,
      marketplaceId: insertedMarketplaces[2].id, // Shopify
      status: "pending",
      totalAmount: "149.99",
      currency: "EUR",
      orderDate: new Date(now.getTime() - 3 * 60 * 60 * 1000), // 3 hours ago
    },
    {
      orderId: "AMZ-77889",
      customerId: insertedCustomers[6].id,
      marketplaceId: insertedMarketplaces[0].id, // Amazon
      status: "cancelled",
      totalAmount: "89.99",
      currency: "EUR",
      orderDate: new Date(now.getTime() - 96 * 60 * 60 * 1000), // 4 days ago
    },
    {
      orderId: "EBY-11234",
      customerId: insertedCustomers[7].id,
      marketplaceId: insertedMarketplaces[1].id, // eBay
      status: "delivered",
      totalAmount: "119.98",
      currency: "EUR",
      orderDate: new Date(now.getTime() - 120 * 60 * 60 * 1000), // 5 days ago
    },
    {
      orderId: "SHF-99887",
      customerId: insertedCustomers[0].id,
      marketplaceId: insertedMarketplaces[2].id, // Shopify
      status: "shipped",
      totalAmount: "199.99",
      currency: "EUR",
      orderDate: new Date(now.getTime() - 18 * 60 * 60 * 1000), // 18 hours ago
    },
    {
      orderId: "AMZ-44556",
      customerId: insertedCustomers[2].id,
      marketplaceId: insertedMarketplaces[0].id, // Amazon
      status: "pending",
      totalAmount: "179.97",
      currency: "EUR",
      orderDate: new Date(now.getTime() - 2 * 60 * 60 * 1000), // 2 hours ago
    },
  ];

  const insertedOrders = await db.insert(orders).values(sampleOrders).returning();

  // Create order items with varied quantities and combinations
  const sampleOrderItems = [
    // Order 1: AMZ-12345 - Single Wireless Headphones
    { orderId: insertedOrders[0].id, productId: insertedProducts[0].id, quantity: 1, price: "89.99" },
    
    // Order 2: EBY-67890 - Single Smart Watch
    { orderId: insertedOrders[1].id, productId: insertedProducts[1].id, quantity: 1, price: "199.99" },
    
    // Order 3: SHF-11223 - 2 Portable Speakers
    { orderId: insertedOrders[2].id, productId: insertedProducts[2].id, quantity: 2, price: "59.99" },
    
    // Order 4: AMZ-54321 - Smart Watch + Wireless Headphones
    { orderId: insertedOrders[3].id, productId: insertedProducts[1].id, quantity: 1, price: "199.99" },
    { orderId: insertedOrders[3].id, productId: insertedProducts[0].id, quantity: 1, price: "59.98" },
    
    // Order 5: EBY-98765 - Single Portable Speaker
    { orderId: insertedOrders[4].id, productId: insertedProducts[2].id, quantity: 1, price: "59.99" },
    
    // Order 6: SHF-33445 - Single Smart Watch (discounted)
    { orderId: insertedOrders[5].id, productId: insertedProducts[1].id, quantity: 1, price: "149.99" },
    
    // Order 7: AMZ-77889 - Single Wireless Headphones (cancelled)
    { orderId: insertedOrders[6].id, productId: insertedProducts[0].id, quantity: 1, price: "89.99" },
    
    // Order 8: EBY-11234 - 2 Portable Speakers
    { orderId: insertedOrders[7].id, productId: insertedProducts[2].id, quantity: 2, price: "59.99" },
    
    // Order 9: SHF-99887 - Single Smart Watch
    { orderId: insertedOrders[8].id, productId: insertedProducts[1].id, quantity: 1, price: "199.99" },
    
    // Order 10: AMZ-44556 - 3 Portable Speakers (bulk order)
    { orderId: insertedOrders[9].id, productId: insertedProducts[2].id, quantity: 3, price: "59.99" },
  ];

  await db.insert(orderItems).values(sampleOrderItems);

  console.log("Database seeded successfully!");
  console.log(`Created ${insertedMarketplaces.length} marketplaces`);
  console.log(`Created ${insertedProducts.length} products`);
  console.log(`Created ${insertedCustomers.length} customers`);
  console.log(`Created ${insertedOrders.length} orders`);
  console.log(`Created ${sampleOrderItems.length} order items`);
  console.log("Sample data includes:");
  console.log("- Customers from various German cities");
  console.log("- Orders spread across last 5 days");
  console.log("- Mixed order statuses (pending, shipped, delivered, cancelled)");
  console.log("- Various product combinations and quantities");
}

seed().catch(console.error);