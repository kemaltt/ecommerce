import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Eye, Edit, Search, Plus, ShoppingCart } from "lucide-react";
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
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="p-8">
      

      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="shipped">Shipped</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
        <Select value={marketplaceFilter} onValueChange={setMarketplaceFilter}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Filter by marketplace" />
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
        <Dialog open={isOrderFormOpen} onOpenChange={setIsOrderFormOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Order
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

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Orders
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Marketplace</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders?.map((order: any) => (
                <TableRow key={order.id}>
                  <TableCell className="font-mono">{order.orderId}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{order.customer.name}</div>
                      <div className="text-sm text-gray-500">{order.customer.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{order.marketplace.name}</Badge>
                  </TableCell>
                  <TableCell>
                    {order.items.map((item: any, index: number) => (
                      <div key={index} className="text-sm">
                        {item.product.name} (x{item.quantity})
                      </div>
                    ))}
                  </TableCell>
                  <TableCell className="font-medium">€{order.totalAmount}</TableCell>
                  <TableCell>
                    <Select
                      value={order.status}
                      onValueChange={(value) => handleStatusChange(order.id, value)}
                    >
                      <SelectTrigger className="w-32">
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
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleEdit(order)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}