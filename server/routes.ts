import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProductSchema, insertCustomerSchema, insertMarketplaceSchema, insertOrderSchema, insertOrderItemSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Analytics
  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await storage.getSalesStats();
      res.json(stats);
    } catch {
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  // Products
  app.get("/api/products", async (req, res) => {
    try {
      const products = await storage.getProducts();
      res.json(products);
    } catch {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.getProduct(parseInt(req.params.id));
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch {
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  app.post("/api/products", async (req, res) => {
    try {
      const validatedData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(validatedData);
      res.status(201).json(product);
    } catch {
      res.status(400).json({ message: "Invalid product data" });
    }
  });

  app.put("/api/products/:id", async (req, res) => {
    try {
      const validatedData = insertProductSchema.partial().parse(req.body);
      const product = await storage.updateProduct(parseInt(req.params.id), validatedData);
      res.json(product);
    } catch {
      res.status(400).json({ message: "Failed to update product" });
    }
  });

  app.delete("/api/products/:id", async (req, res) => {
    try {
      const success = await storage.deleteProduct(parseInt(req.params.id));
      if (!success) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json({ message: "Product deleted successfully" });
    } catch {
      res.status(500).json({ message: "Failed to delete product" });
    }
  });

  // Customers
  app.get("/api/customers", async (req, res) => {
    try {
      const customers = await storage.getCustomers();
      res.json(customers);
    } catch {
      res.status(500).json({ message: "Failed to fetch customers" });
    }
  });

  app.get("/api/customers/:id", async (req, res) => {
    try {
      const customer = await storage.getCustomer(parseInt(req.params.id));
      if (!customer) {
        return res.status(404).json({ message: "Customer not found" });
      }
      res.json(customer);
    } catch {
      res.status(500).json({ message: "Failed to fetch customer" });
    }
  });

  app.post("/api/customers", async (req, res) => {
    try {
      const validatedData = insertCustomerSchema.parse(req.body);
      const customer = await storage.createCustomer(validatedData);
      res.status(201).json(customer);
    } catch {
      res.status(400).json({ message: "Invalid customer data" });
    }
  });

  app.put("/api/customers/:id", async (req, res) => {
    try {
      const validatedData = insertCustomerSchema.partial().parse(req.body);
      const customer = await storage.updateCustomer(parseInt(req.params.id), validatedData);
      res.json(customer);
    } catch {
      res.status(400).json({ message: "Failed to update customer" });
    }
  });

  app.delete("/api/customers/:id", async (req, res) => {
    try {
      const success = await storage.deleteCustomer(parseInt(req.params.id));
      if (!success) {
        return res.status(404).json({ message: "Customer not found" });
      }
      res.json({ message: "Customer deleted successfully" });
    } catch {
      res.status(500).json({ message: "Failed to delete customer" });
    }
  });

  // Orders
  app.get("/api/orders", async (req, res) => {
    try {
      const orders = await storage.getOrders();
      res.json(orders);
    } catch {
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  app.get("/api/orders/:id", async (req, res) => {
    try {
      const order = await storage.getOrder(parseInt(req.params.id));
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.json(order);
    } catch {
      res.status(500).json({ message: "Failed to fetch order" });
    }
  });

  app.post("/api/orders", async (req, res) => {
    try {
      
      const orderData = insertOrderSchema.parse(req.body);
      
      const itemsData = req.body.items?.map((item: unknown) => {
        return insertOrderItemSchema.parse(item);
      }) || [];
      
      const order = await storage.createOrder(orderData, itemsData);
      res.status(201).json(order);
    } catch (error) {
      console.error('Error creating order:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Validation error",
          errors: error.errors.map(err => ({
            path: err.path.join('.'),
            message: err.message
          }))
        });
      }
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      res.status(400).json({ message: "Invalid order data", error: errorMessage });
    }
  });

  app.put("/api/orders/:id", async (req, res) => {
    try {
      const order = await storage.updateOrder(parseInt(req.params.id), req.body);
      res.json(order);
    } catch {
      res.status(400).json({ message: "Failed to update order" });
    }
  });

  // Marketplaces
  app.get("/api/marketplaces", async (req, res) => {
    try {
      const marketplaces = await storage.getMarketplaces();
      res.json(marketplaces);
    } catch {
      res.status(500).json({ message: "Failed to fetch marketplaces" });
    }
  });

  app.get("/api/marketplaces/:id", async (req, res) => {
    try {
      const marketplace = await storage.getMarketplace(parseInt(req.params.id));
      if (!marketplace) {
        return res.status(404).json({ message: "Marketplace not found" });
      }
      res.json(marketplace);
    } catch {
      res.status(500).json({ message: "Failed to fetch marketplace" });
    }
  });

  app.post("/api/marketplaces", async (req, res) => {
    try {
      const validatedData = insertMarketplaceSchema.parse(req.body);
      const marketplace = await storage.createMarketplace(validatedData);
      res.status(201).json(marketplace);
    } catch {
      res.status(400).json({ message: "Invalid marketplace data" });
    }
  });

  app.put("/api/marketplaces/:id", async (req, res) => {
    try {
      const validatedData = insertMarketplaceSchema.partial().parse(req.body);
      const marketplace = await storage.updateMarketplace(parseInt(req.params.id), validatedData);
      res.json(marketplace);
    } catch {
      res.status(400).json({ message: "Failed to update marketplace" });
    }
  });

  app.delete("/api/marketplaces/:id", async (req, res) => {
    try {
      const success = await storage.deleteMarketplace(parseInt(req.params.id));
      if (!success) {
        return res.status(404).json({ message: "Marketplace not found" });
      }
      res.json({ message: "Marketplace deleted successfully" });
    } catch {
      res.status(500).json({ message: "Failed to delete marketplace" });
    }
  });

  // Stock Management
  app.post("/api/stock/update", async (req, res) => {
    try {
      const { sku, quantity } = req.body;
      
      if (!sku || typeof quantity !== 'number') {
        return res.status(400).json({ error: "SKU and quantity are required" });
      }

      await storage.updateStockBySku(sku, quantity);
      
      // Get updated product to get current stock
      const product = await storage.getProductBySku(sku);
      if (product) {
        await storage.syncStockToMarketplaces(sku, product.stock);
      }
      
      res.json({ message: "Stock updated successfully" });
    } catch {
      res.status(500).json({ error: "Failed to update stock" });
    }
  });

  // Analytics
  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await storage.getSalesStats();
      res.json(stats);
    } catch {
      res.status(500).json({ error: "Failed to fetch statistics" });
    }
  });

  // Connections
  app.delete("/api/connections/:id", async (req, res) => {
    try {
      const success = await storage.deleteMarketplace(parseInt(req.params.id));
      if (!success) {
        return res.status(404).json({ message: "Connection not found" });
      }
      res.json({ message: "Connection deleted successfully" });
    } catch {
      res.status(500).json({ message: "Failed to delete connection" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
