import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Trash2, Plus, User, Package, ShoppingCart, Loader2 } from "lucide-react";
import type { Product, Customer, Marketplace } from "@shared/schema";

const orderFormSchema = z.object({
  customerId: z.number().min(1, "Customer is required"),
  marketplaceId: z.number().min(1, "Marketplace is required"),
  status: z.string().min(1, "Status is required"),
  items: z.array(z.object({
    productId: z.number().optional(),
    name: z.string().min(1, "Product name is required"),
    sku: z.string().min(1, "SKU is required"),
    price: z.string().min(1, "Price is required"),
    quantity: z.number().min(1, "Quantity must be at least 1"),
  })).min(1, "At least one item is required"),
});

const customerFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  address: z.string().optional(),
});

type OrderFormData = z.infer<typeof orderFormSchema>;
type CustomerFormData = z.infer<typeof customerFormSchema>;

interface OrderFormProps {
  order?: any;
  onSubmit: (data: OrderFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function OrderForm({ order, onSubmit, onCancel, isLoading }: OrderFormProps) {
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const form = useForm<OrderFormData>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      customerId: order?.customerId || 0,
      marketplaceId: order?.marketplaceId || 0,
      status: order?.status || "pending",
      items: order?.items?.map((item: any) => ({
        productId: item.product.id,
        name: item.product.name,
        sku: item.product.sku,
        price: item.price.toString(),
        quantity: item.quantity
      })) || [{ name: "", sku: "", price: "", quantity: 1 }],
    },
  });

  const customerForm = useForm<CustomerFormData>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
    },
  });

  const { data: products } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const { data: customers } = useQuery<Customer[]>({
    queryKey: ["/api/customers"],
  });

  const { data: marketplaces } = useQuery<Marketplace[]>({
    queryKey: ["/api/marketplaces"],
  });

  useEffect(() => {
    if (order?.customer) {
      setSelectedCustomer(order.customer);
    }
  }, [order]);

  const addItem = () => {
    const currentItems = form.getValues("items");
    form.setValue("items", [...currentItems, { name: "", sku: "", price: "", quantity: 1 }]);
  };

  const removeItem = (index: number) => {
    const currentItems = form.getValues("items");
    if (currentItems.length > 1) {
      form.setValue("items", currentItems.filter((_, i) => i !== index));
    }
  };

  const selectProduct = (index: number, product: Product) => {
    const currentItems = form.getValues("items");
    currentItems[index] = {
      productId: product.id,
      name: product.name,
      sku: product.sku,
      price: product.price,
      quantity: currentItems[index].quantity,
    };
    form.setValue("items", currentItems);
  };

  const handleCustomerSubmit = async (data: CustomerFormData) => {
    try {
      const response = await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      if (response.ok) {
        const newCustomer = await response.json();
        setSelectedCustomer(newCustomer);
        form.setValue("customerId", newCustomer.id);
        setIsCustomerModalOpen(false);
        customerForm.reset();
      }
    } catch (error) {
      console.error("Error creating customer:", error);
    }
  };

  const handleSubmit = (data: OrderFormData) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Customer Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Customer
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <div className="flex-1">
                <FormField
                  control={form.control}
                  name="customerId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select Customer</FormLabel>
                      <Select onValueChange={(value) => {
                        field.onChange(parseInt(value));
                        setSelectedCustomer(customers?.find(c => c.id === parseInt(value)) || null);
                      }}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Choose a customer" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {customers?.map((customer) => (
                            <SelectItem key={customer.id} value={customer.id.toString()}>
                              {customer.name} ({customer.email})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex items-end">
                <Dialog open={isCustomerModalOpen} onOpenChange={setIsCustomerModalOpen}>
                  <DialogTrigger asChild>
                    <Button type="button" variant="outline">
                      <Plus className="w-4 h-4 mr-2" />
                      New Customer
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Customer</DialogTitle>
                    </DialogHeader>
                    <Form {...customerForm}>
                      <form onSubmit={customerForm.handleSubmit(handleCustomerSubmit)} className="space-y-4">
                        <FormField
                          control={customerForm.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Name</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Customer name" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={customerForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input {...field} type="email" placeholder="customer@example.com" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={customerForm.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone (Optional)</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Phone number" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={customerForm.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Address (Optional)</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Customer address" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="flex justify-end gap-2">
                          <Button type="button" variant="outline" onClick={() => setIsCustomerModalOpen(false)}>
                            Cancel
                          </Button>
                          <Button type="submit">Add Customer</Button>
                        </div>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            {selectedCustomer && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="font-medium">{selectedCustomer.name}</p>
                <p className="text-sm text-gray-600">{selectedCustomer.email}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Marketplace Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              Marketplace & Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="marketplaceId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Marketplace</FormLabel>
                    <Select onValueChange={(value) => field.onChange(parseInt(value))}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose marketplace" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {marketplaces?.map((marketplace) => (
                          <SelectItem key={marketplace.id} value={marketplace.id.toString()}>
                            {marketplace.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Order Items */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              Order Items
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {form.watch("items").map((item, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Item {index + 1}</h4>
                  {form.watch("items").length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeItem(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Select from Products</Label>
                    <Select onValueChange={(value) => {
                      const product = products?.find(p => p.id === parseInt(value));
                      if (product) selectProduct(index, product);
                    }}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose product" />
                      </SelectTrigger>
                      <SelectContent>
                        {products?.map((product) => (
                          <SelectItem key={product.id} value={product.id.toString()}>
                            {product.name} - €{product.price}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Or enter manually</Label>
                    <p className="text-sm text-gray-500">Fill the fields below</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Product Name</Label>
                    <Input
                      value={item.name}
                      onChange={(e) => {
                        const currentItems = form.getValues("items");
                        currentItems[index].name = e.target.value;
                        form.setValue("items", currentItems);
                      }}
                      placeholder="Product name"
                    />
                  </div>
                  <div>
                    <Label>SKU</Label>
                    <Input
                      value={item.sku}
                      onChange={(e) => {
                        const currentItems = form.getValues("items");
                        currentItems[index].sku = e.target.value;
                        form.setValue("items", currentItems);
                      }}
                      placeholder="Product SKU"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Price (€)</Label>
                    <Input
                      value={item.price}
                      onChange={(e) => {
                        const currentItems = form.getValues("items");
                        currentItems[index].price = e.target.value;
                        form.setValue("items", currentItems);
                      }}
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <Label>Quantity</Label>
                    <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => {
                        const currentItems = form.getValues("items");
                        currentItems[index].quantity = parseInt(e.target.value) || 1;
                        form.setValue("items", currentItems);
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
            
            <Button type="button" variant="outline" onClick={addItem} className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Add Another Item
            </Button>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {order ? "Saving..." : "Creating..."}
              </>
            ) : (
              <>
                {order ? "Save Order" : "Create Order"}
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}