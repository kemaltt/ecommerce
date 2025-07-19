
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Eye, Edit, Search, Plus, ShoppingCart, Package, Calendar, User, Euro, Filter } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import OrderForm from "@/components/forms/order-form";

export default function Orders() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [marketplaceFilter, setMarketplaceFilter] = useState("all");
  const [isOrderFormOpen, setIsOrderFormOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: orders, isLoading } = useQuery<any[]>({
    queryKey: ["/api/orders"],
  });

  const { data: marketplaces } = useQuery<any[]>({
    queryKey: ["/api/marketplaces"],
  });

  const updateOrderMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      return apiRequest("PUT", `/api/orders/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      setIsOrderFormOpen(false);
      setSelectedOrder(null);
      toast({
        title: "Order updated",
        description: "Order has been updated successfully.",
        variant: "success"
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update order status.",
        variant: "destructive"
      });
    },
  });

  const createOrderMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("POST", "/api/orders", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      queryClient.invalidateQueries({ queryKey: ["/api/customers"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      setIsOrderFormOpen(false);
      toast({
        title: "Order created",
        description: "Order has been created successfully.",
        variant: "success"
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create order.",
        variant: "destructive"
      });
    },
  });

  const handleCreateOrder = (data: any) => {
    const items = data.items.map((item: any) => ({
      productId: item.productId,
      price: parseFloat(item.price),
      quantity: item.quantity,
    }));
    const totalAmount = items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
    const fixedData = {
      ...data,
      items,
      totalAmount,
      currency: 'EUR',
    };

    if (selectedOrder) {
      updateOrderMutation.mutate({ id: selectedOrder.id, data: fixedData });
    } else {
      createOrderMutation.mutate(fixedData);
    }
  };

  const handleEdit = (order: any) => {
    setSelectedOrder(order);
    setIsOrderFormOpen(true);
  };

  const filteredOrders = orders?.filter((order: any) => {
    const matchesSearch = order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    const matchesMarketplace = marketplaceFilter === "all" || order.marketplace.name === marketplaceFilter;
    
    return matchesSearch && matchesStatus && matchesMarketplace;
  });

  const handleStatusChange = (orderId: number, newStatus: string) => {
    updateOrderMutation.mutate({ id: orderId, data: { status: newStatus } });
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-emerald-200';
      case 'shipped':
        return 'bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200';
      case 'pending':
        return 'bg-amber-100 text-amber-700 hover:bg-amber-100 border-amber-200';
      case 'cancelled':
        return 'bg-red-100 text-red-700 hover:bg-red-100 border-red-200';
      default:
        return 'bg-slate-100 text-slate-700 hover:bg-slate-100 border-slate-200';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-8 p-8">
        {/* Header Skeleton */}
        <div className="animate-pulse">
          <div className="h-10 w-64 bg-gradient-to-r from-slate-200 to-slate-300 rounded-xl mb-4"></div>
          <div className="h-6 w-96 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg"></div>
        </div>
        
        {/* Filters Skeleton */}
        <div className="flex gap-4">
          <div className="h-12 flex-1 bg-gradient-to-r from-slate-200 to-slate-300 rounded-xl"></div>
          <div className="h-12 w-48 bg-gradient-to-r from-slate-200 to-slate-300 rounded-xl"></div>
          <div className="h-12 w-48 bg-gradient-to-r from-slate-200 to-slate-300 rounded-xl"></div>
          <div className="h-12 w-40 bg-gradient-to-r from-slate-200 to-slate-300 rounded-xl"></div>
        </div>

        {/* Table Skeleton */}
        <Card className="border-0 shadow-xl">
          <CardContent className="p-8">
            <div className="animate-pulse space-y-6">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-20 bg-gradient-to-r from-slate-200 to-slate-300 rounded-xl"></div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Enhanced Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center space-x-3 px-6 py-3 bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm border border-white/20 rounded-2xl">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
              <ShoppingCart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Order Management
              </h1>
              <p className="text-slate-600 text-sm">
                Manage and track all your orders across marketplaces
              </p>
            </div>
          </div>
        </div>

        {/* Enhanced Filters and Create Order Button */}
        <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <div className="flex flex-1 gap-4 w-full lg:w-auto">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                  <Input
                    placeholder="Search orders or customers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 h-12 bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Filter className="w-5 h-5 text-slate-400" />
                  <Select value={marketplaceFilter} onValueChange={setMarketplaceFilter}>
                    <SelectTrigger className="w-[220px] h-12 bg-white border-slate-200 rounded-xl">
                      <SelectValue placeholder="All Marketplaces" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Marketplaces</SelectItem>
                      {marketplaces?.map((marketplace: any) => (
                        <SelectItem key={marketplace.id} value={marketplace.name || 'unknown'}>
                          {marketplace.name || 'Unknown Marketplace'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[200px] h-12 bg-white border-slate-200 rounded-xl">
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Dialog open={isOrderFormOpen} onOpenChange={setIsOrderFormOpen}>
                <DialogTrigger asChild>
                  <Button className="h-12 px-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg rounded-xl">
                    <Plus className="w-5 h-5 mr-2" />
                    Create New Order
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{selectedOrder ? "Edit Order" : "Create New Order"}</DialogTitle>
                  </DialogHeader>
                  <OrderForm
                    order={selectedOrder}
                    onSubmit={handleCreateOrder}
                    onCancel={() => {
                      setIsOrderFormOpen(false);
                      setSelectedOrder(null);
                    }}
                    isLoading={createOrderMutation.isPending}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Orders Table */}
        <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-sm overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50/50 border-b border-slate-200/50">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                <Package className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold text-slate-800">Recent Orders</CardTitle>
                <p className="text-slate-600 text-sm">Track and manage all your orders</p>
              </div>
              <div className="ml-auto">
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  {filteredOrders?.length || 0} orders
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/80 hover:bg-slate-50">
                    <TableHead className="font-semibold text-slate-700 px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <Package className="w-4 h-4" />
                        <span>Order Details</span>
                      </div>
                    </TableHead>
                    <TableHead className="font-semibold text-slate-700 px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4" />
                        <span>Customer</span>
                      </div>
                    </TableHead>
                    <TableHead className="font-semibold text-slate-700 px-6 py-4">Products</TableHead>
                    <TableHead className="font-semibold text-slate-700 px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <Euro className="w-4 h-4" />
                        <span>Amount</span>
                      </div>
                    </TableHead>
                    <TableHead className="font-semibold text-slate-700 px-6 py-4">Status</TableHead>
                    <TableHead className="font-semibold text-slate-700 px-6 py-4 text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders?.map((order: any, index: number) => (
                    <TableRow 
                      key={order.id} 
                      className="hover:bg-blue-50/30 transition-all duration-200 border-b border-slate-100"
                    >
                      <TableCell className="px-6 py-6">
                        <div className="space-y-2">
                          <div className="font-semibold text-blue-700">{order.orderId}</div>
                          <div className="flex items-center space-x-3 text-sm">
                            <Badge variant="outline" className="bg-slate-100 text-slate-700 border-slate-200">
                              {order.marketplace.name}
                            </Badge>
                            <div className="flex items-center text-slate-500">
                              <Calendar className="w-3 h-3 mr-1" />
                              {new Date(order.orderDate).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-6">
                        <div className="space-y-1">
                          <div className="font-medium text-slate-800">{order.customer.name}</div>
                          <div className="text-sm text-slate-500">{order.customer.email}</div>
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-6">
                        <div className="space-y-2">
                          {order.items.map((item: any, itemIndex: number) => (
                            <div key={itemIndex} className="text-sm">
                              <div className="font-medium text-slate-700">{item.product.name}</div>
                              <div className="flex items-center space-x-2 text-xs text-slate-500">
                                <span>Qty: {item.quantity}</span>
                                <span>•</span>
                                <span>SKU: {item.product.sku}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-6">
                        <div className="font-bold text-lg text-emerald-600">€{order.totalAmount}</div>
                      </TableCell>
                      <TableCell className="px-6 py-6">
                        <Select
                          value={order.status}
                          onValueChange={(value) => handleStatusChange(order.id, value)}
                        >
                          <SelectTrigger className="w-36 h-10 rounded-lg border-slate-200">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="shipped">Shipped</SelectItem>
                            <SelectItem value="delivered">Delivered</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="px-6 py-6">
                        <div className="flex justify-center space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 rounded-lg"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => handleEdit(order)}
                            className="hover:bg-slate-50 hover:text-slate-600 hover:border-slate-200 rounded-lg"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Empty State */}
        {filteredOrders?.length === 0 && (
          <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-sm">
            <CardContent className="p-16 text-center">
              <div className="space-y-6">
                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                  <ShoppingCart className="w-12 h-12 text-slate-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-700 mb-2">No orders found</h3>
                  <p className="text-slate-500">Try adjusting your filters or create a new order to get started.</p>
                </div>
                <Button 
                  onClick={() => setIsOrderFormOpen(true)}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Order
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
