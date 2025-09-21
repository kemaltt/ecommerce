import { users, customers, products, marketplaces, orders, orderItems, type User, type InsertUser, type Customer, type InsertCustomer, type Product, type InsertProduct, type Marketplace, type InsertMarketplace, type InsertOrder, type InsertOrderItem, type OrderWithDetails } from "@shared/schema";
import { db } from "./db";
import { eq, desc, sql } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Customers
  getCustomers(): Promise<Customer[]>;
  getCustomer(id: number): Promise<Customer | undefined>;
  getCustomerByEmail(email: string): Promise<Customer | undefined>;
  createCustomer(customer: InsertCustomer): Promise<Customer>;
  updateCustomer(id: number, customer: Partial<InsertCustomer>): Promise<Customer>;
  deleteCustomer(id: number): Promise<boolean>;

  // Products
  getProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  getProductBySku(sku: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product>;
  deleteProduct(id: number): Promise<boolean>;

  // Marketplaces
  getMarketplaces(): Promise<Marketplace[]>;
  getMarketplace(id: number): Promise<Marketplace | undefined>;
  createMarketplace(marketplace: InsertMarketplace): Promise<Marketplace>;
  updateMarketplace(id: number, marketplace: Partial<InsertMarketplace>): Promise<Marketplace>;
  deleteMarketplace(id: number): Promise<boolean>;

  // Orders
  getOrders(): Promise<OrderWithDetails[]>;
  getOrder(id: number): Promise<OrderWithDetails | undefined>;
  getOrdersByCustomer(customerId: number): Promise<OrderWithDetails[]>;
  getOrdersByMarketplace(marketplaceId: number): Promise<OrderWithDetails[]>;
  createOrder(order: InsertOrder, items: InsertOrderItem[]): Promise<OrderWithDetails>;
  updateOrder(id: number, order: Partial<InsertOrder>): Promise<OrderWithDetails>;

  // Analytics
  getSalesStats(): Promise<{
    totalSales: number;
    totalOrders: number;
    totalCustomers: number;
    totalProducts: number;
    salesByDay: { day: string; sales: number }[];
    ordersByMarketplace: { marketplace: string; orders: number }[];
  }>;

  // Stock Management
  updateStockBySku(sku: string, quantity: number): Promise<void>;
  syncStockToMarketplaces(sku: string, newStock: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getCustomers(): Promise<Customer[]> {
    return await db.select().from(customers).orderBy(desc(customers.createdAt));
  }

  async getCustomer(id: number): Promise<Customer | undefined> {
    const [customer] = await db.select().from(customers).where(eq(customers.id, id));
    return customer || undefined;
  }

  async getCustomerByEmail(email: string): Promise<Customer | undefined> {
    const [customer] = await db.select().from(customers).where(eq(customers.email, email));
    return customer || undefined;
  }

  async createCustomer(insertCustomer: InsertCustomer): Promise<Customer> {
    const [customer] = await db
      .insert(customers)
      .values(insertCustomer)
      .returning();
    return customer;
  }

  async updateCustomer(id: number, updates: Partial<InsertCustomer>): Promise<Customer> {
    const [customer] = await db
      .update(customers)
      .set(updates)
      .where(eq(customers.id, id))
      .returning();
    return customer;
  }

  async deleteCustomer(id: number): Promise<boolean> {
    try {
      const result = await db
        .delete(customers)
        .where(eq(customers.id, id))
        .returning();
      return result.length > 0;
    } catch {
      return false;
    }
  }

  async getProducts(): Promise<Product[]> {
    return await db.select().from(products).orderBy(desc(products.createdAt));
  }

  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product || undefined;
  }

  async getProductBySku(sku: string): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.sku, sku));
    return product || undefined;
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const [product] = await db
      .insert(products)
      .values(insertProduct)
      .returning();
    return product;
  }

  async updateProduct(id: number, updates: Partial<InsertProduct>): Promise<Product> {
    const [product] = await db
      .update(products)
      .set(updates)
      .where(eq(products.id, id))
      .returning();
    return product;
  }

  async deleteProduct(id: number): Promise<boolean> {
    const result = await db.delete(products).where(eq(products.id, id));
    return result.rowCount > 0;
  }

  async getMarketplaces(): Promise<Marketplace[]> {
    return await db.select().from(marketplaces).orderBy(desc(marketplaces.createdAt));
  }

  async getMarketplace(id: number): Promise<Marketplace | undefined> {
    const [marketplace] = await db.select().from(marketplaces).where(eq(marketplaces.id, id));
    return marketplace || undefined;
  }

  async createMarketplace(insertMarketplace: InsertMarketplace): Promise<Marketplace> {
    const [marketplace] = await db
      .insert(marketplaces)
      .values(insertMarketplace)
      .returning();
    return marketplace;
  }

  async updateMarketplace(id: number, updates: Partial<InsertMarketplace>): Promise<Marketplace> {
    const [marketplace] = await db
      .update(marketplaces)
      .set(updates)
      .where(eq(marketplaces.id, id))
      .returning();
    return marketplace;
  }

  async deleteMarketplace(id: number): Promise<boolean> {
    const result = await db.delete(marketplaces).where(eq(marketplaces.id, id));
    return result.rowCount > 0;
  }

  async getOrders(): Promise<OrderWithDetails[]> {
    const ordersWithDetails = await db.query.orders.findMany({
      with: {
        customer: true,
        marketplace: true,
        items: {
          with: {
            product: true
          }
        }
      },
      orderBy: desc(orders.createdAt)
    });
    
    return ordersWithDetails as OrderWithDetails[];
  }

  async getOrder(id: number): Promise<OrderWithDetails | undefined> {
    const orderWithDetails = await db.query.orders.findFirst({
      where: eq(orders.id, id),
      with: {
        customer: true,
        marketplace: true,
        items: {
          with: {
            product: true
          }
        }
      }
    });
    
    return orderWithDetails as OrderWithDetails | undefined;
  }

  async getOrdersByCustomer(customerId: number): Promise<OrderWithDetails[]> {
    const ordersWithDetails = await db.query.orders.findMany({
      where: eq(orders.customerId, customerId),
      with: {
        customer: true,
        marketplace: true,
        items: {
          with: {
            product: true
          }
        }
      },
      orderBy: desc(orders.createdAt)
    });
    
    return ordersWithDetails as OrderWithDetails[];
  }

  async getOrdersByMarketplace(marketplaceId: number): Promise<OrderWithDetails[]> {
    const ordersWithDetails = await db.query.orders.findMany({
      where: eq(orders.marketplaceId, marketplaceId),
      with: {
        customer: true,
        marketplace: true,
        items: {
          with: {
            product: true
          }
        }
      },
      orderBy: desc(orders.createdAt)
    });
    
    return ordersWithDetails as OrderWithDetails[];
  }

  async createOrder(insertOrder: InsertOrder, items: InsertOrderItem[]): Promise<OrderWithDetails> {
    // Get current year
    const currentYear = new Date().getFullYear();
    
    // Get the latest order for this year
    const latestOrder = await db.query.orders.findFirst({
      where: sql`order_id LIKE ${`${currentYear}%`}`,
      orderBy: desc(orders.orderId),
    });
    // Generate new order number
    let orderNumber = 1;
    if (latestOrder) {
      const lastNumber = parseInt(latestOrder.orderId.split('-')[1]);
      orderNumber = lastNumber + 1;
    }
    
    // Create order ID in format YYYY-#####
    const orderId = `${currentYear}-${orderNumber.toString().padStart(5, '0')}`;
    // Create order
    const [order] = await db
      .insert(orders)
      .values({
        ...insertOrder,
        orderId,
        totalAmount: items.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0).toString()
      })
      .returning();

    // Create order items
    const orderItemsToInsert = items.map(item => ({
      ...item,
      orderId: order.id
    }));

    await db.insert(orderItems).values(orderItemsToInsert);

    // Update stock for each item if productId exists
    for (const item of items) {
      if (item.productId) {
        const product = await this.getProduct(item.productId);
        if (product) {
          const newStock = Math.max(0, product.stock - item.quantity);
          await this.updateProduct(item.productId, { stock: newStock });
          
          // Sync stock to connected marketplaces
          await this.syncStockToMarketplaces(product.sku, newStock);
        }
      }
    }

    // Return complete order with details
    return this.getOrder(order.id) as Promise<OrderWithDetails>;
  }

  async updateOrder(id: number, updates: Partial<InsertOrder>): Promise<OrderWithDetails> {
    await db
      .update(orders)
      .set(updates)
      .where(eq(orders.id, id));
    
    return this.getOrder(id) as Promise<OrderWithDetails>;
  }

  async getSalesStats(): Promise<{
    totalSales: number;
    totalOrders: number;
    totalCustomers: number;
    totalProducts: number;
    salesByDay: { day: string; sales: number }[];
    ordersByMarketplace: { marketplace: string; orders: number }[];
  }> {
    const [ordersData, customersData, productsData] = await Promise.all([
      db.select().from(orders),
      db.select().from(customers),
      db.select().from(products)
    ]);

    const totalSales = ordersData.reduce((sum, order) => sum + parseFloat(order.totalAmount), 0);
    const totalOrders = ordersData.length;
    const totalCustomers = customersData.length;
    const totalProducts = productsData.length;

    // Sales by day (last 7 days)
    const salesByDay = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayStr = date.toISOString().split('T')[0];
      
      const dayOrders = ordersData.filter(order => 
        order.createdAt && order.createdAt.toISOString().split('T')[0] === dayStr
      );
      const daySales = dayOrders.reduce((sum, order) => sum + parseFloat(order.totalAmount), 0);
      
      salesByDay.push({
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        sales: daySales
      });
    }

    // Orders by marketplace
    const marketplacesData = await db.select().from(marketplaces);
    const ordersByMarketplace = await Promise.all(
      marketplacesData.map(async (marketplace) => {
        const marketplaceOrders = ordersData.filter(order => order.marketplaceId === marketplace.id);
        return {
          marketplace: marketplace.name,
          orders: marketplaceOrders.length
        };
      })
    );

    return {
      totalSales,
      totalOrders,
      totalCustomers,
      totalProducts,
      salesByDay,
      ordersByMarketplace
    };
  }

  async updateStockBySku(sku: string, quantity: number): Promise<void> {
    await db
      .update(products)
      .set({ stock: quantity })
      .where(eq(products.sku, sku));
  }

  async syncStockToMarketplaces(_sku: string, _newStock: number): Promise<void> {
    const connectedMarketplaces = await db.select()
      .from(marketplaces)
      .where(eq(marketplaces.isConnected, true));

    for (const marketplace of connectedMarketplaces) {
      if (marketplace.stockTracking && marketplace.autoUpdateStock) {
        // Syncing stock for SKU to marketplace
        // Here you would integrate with actual marketplace APIs
        // await marketplaceAPI.updateStock(marketplace, sku, newStock);
      }
    }
  }
}

export const storage = new DatabaseStorage();