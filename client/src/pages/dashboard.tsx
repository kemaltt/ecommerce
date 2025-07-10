import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import StatsCard from "@/components/ui/stats-card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Euro, ShoppingCart, Package, Users, Eye, Edit } from "lucide-react";
import { Link } from "wouter";

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/stats"],
  });

  const { data: recentOrders, isLoading: ordersLoading } = useQuery({
    queryKey: ["/api/orders"],
    select: (data) => data?.slice(0, 5), // Get only the first 5 orders
  });

  const { data: marketplaces } = useQuery({
    queryKey: ["/api/marketplaces"],
    select: (data) => data?.filter((m: any) => m.isConnected),
  });

  if (statsLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-20 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Sales"
          value={`€${stats?.totalSales?.toLocaleString() || '0'}`}
          change="+12.5% from last month"
          icon={Euro}
          iconColor="bg-secondary/10 text-secondary"
        />
        <StatsCard
          title="Orders"
          value={stats?.totalOrders?.toLocaleString() || '0'}
          change="+8.3% from last month"
          icon={ShoppingCart}
          iconColor="bg-primary/10 text-primary"
        />
        <StatsCard
          title="Products"
          value={stats?.totalProducts?.toLocaleString() || '0'}
          change="+5 new this week"
          icon={Package}
          iconColor="bg-accent/10 text-accent"
        />
        <StatsCard
          title="Customers"
          value={stats?.totalCustomers?.toLocaleString() || '0'}
          change="+15.2% from last month"
          icon={Users}
          iconColor="bg-purple-100 text-purple-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Sales Overview</CardTitle>
              <Select defaultValue="7days">
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7days">Last 7 days</SelectItem>
                  <SelectItem value="30days">Last 30 days</SelectItem>
                  <SelectItem value="90days">Last 90 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stats?.salesByDay || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--primary))" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Connected Marketplaces */}
        <Card>
          <CardHeader>
            <CardTitle>Connected Marketplaces</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {marketplaces?.map((marketplace: any) => (
                <div key={marketplace.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      marketplace.type === 'amazon' ? 'bg-yellow-400' :
                      marketplace.type === 'ebay' ? 'bg-blue-600' :
                      marketplace.type === 'shopify' ? 'bg-green-600' :
                      'bg-purple-600'
                    }`}>
                      <span className="text-sm font-bold text-white">
                        {marketplace.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{marketplace.name}</p>
                      <p className="text-sm text-gray-500">
                        {stats?.ordersByMarketplace?.find((m: any) => m.marketplace === marketplace.name)?.orders || 0} orders today
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-secondary rounded-full"></div>
                    <span className="text-sm text-gray-500">Connected</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Orders</CardTitle>
            <Button variant="outline" asChild>
              <Link href="/orders">View All</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {ordersLoading ? (
            <div className="animate-pulse space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Marketplace</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders?.map((order: any) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.orderId}</TableCell>
                    <TableCell>{order.customer.name}</TableCell>
                    <TableCell>{order.marketplace.name}</TableCell>
                    <TableCell>€{order.totalAmount}</TableCell>
                    <TableCell>
                      <Badge variant={
                        order.status === 'delivered' ? 'default' :
                        order.status === 'shipped' ? 'secondary' :
                        'outline'
                      }>
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
