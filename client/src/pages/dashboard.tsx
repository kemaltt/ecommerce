import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { Euro, ShoppingCart, Package, Users, Eye, TrendingUp, ArrowUpRight, MoreHorizontal } from "lucide-react";
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="animate-pulse border-0 shadow-lg bg-white/70 backdrop-blur">
                <CardContent className="p-6">
                  <div className="h-24 bg-gradient-to-r from-slate-200 to-slate-300 rounded-xl"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8 p-6">
        {/* Header Section */}
        <div className="flex flex-col space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-slate-600 text-lg">Welcome back! Here's what's happening with your business today.</p>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-0 shadow-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-100 text-sm font-medium">Total Sales</p>
                  <p className="text-3xl font-bold">€{stats?.totalSales?.toLocaleString() || '0'}</p>
                  <div className="flex items-center mt-2 text-emerald-100">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    <span className="text-sm">+12.5% from last month</span>
                  </div>
                </div>
                <div className="bg-white/20 p-3 rounded-xl">
                  <Euro className="w-8 h-8" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Orders</p>
                  <p className="text-3xl font-bold">{stats?.totalOrders?.toLocaleString() || '0'}</p>
                  <div className="flex items-center mt-2 text-blue-100">
                    <ArrowUpRight className="w-4 h-4 mr-1" />
                    <span className="text-sm">+8.3% from last month</span>
                  </div>
                </div>
                <div className="bg-white/20 p-3 rounded-xl">
                  <ShoppingCart className="w-8 h-8" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl bg-gradient-to-br from-purple-500 to-purple-600 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Products</p>
                  <p className="text-3xl font-bold">{stats?.totalProducts?.toLocaleString() || '0'}</p>
                  <div className="flex items-center mt-2 text-purple-100">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    <span className="text-sm">+5 new this week</span>
                  </div>
                </div>
                <div className="bg-white/20 p-3 rounded-xl">
                  <Package className="w-8 h-8" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl bg-gradient-to-br from-orange-500 to-orange-600 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">Customers</p>
                  <p className="text-3xl font-bold">{stats?.totalCustomers?.toLocaleString() || '0'}</p>
                  <div className="flex items-center mt-2 text-orange-100">
                    <ArrowUpRight className="w-4 h-4 mr-1" />
                    <span className="text-sm">+15.2% from last month</span>
                  </div>
                </div>
                <div className="bg-white/20 p-3 rounded-xl">
                  <Users className="w-8 h-8" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Enhanced Sales Chart */}
          <Card className="xl:col-span-2 border-0 shadow-xl bg-white/70 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-bold text-slate-800">Sales Overview</CardTitle>
                  <p className="text-slate-600 mt-1">Track your revenue growth over time</p>
                </div>
                <Select defaultValue="7days">
                  <SelectTrigger className="w-[140px] border-slate-200">
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
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={stats?.salesByDay || []}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="day" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: 'none', 
                      borderRadius: '12px', 
                      boxShadow: '0 10px 40px rgba(0,0,0,0.1)' 
                    }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="sales" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={3}
                    fill="url(#colorSales)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Enhanced Connected Marketplaces */}
          <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-slate-800">Connected Marketplaces</CardTitle>
              <p className="text-slate-600">Your active integrations</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {marketplaces?.map((marketplace: any) => (
                  <div key={marketplace.id} className="group p-4 bg-gradient-to-r from-white to-slate-50 rounded-xl border border-slate-100 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 ${
                          marketplace.type === 'amazon' ? 'bg-gradient-to-br from-yellow-400 to-yellow-500' :
                          marketplace.type === 'ebay' ? 'bg-gradient-to-br from-blue-500 to-blue-600' :
                          marketplace.type === 'shopify' ? 'bg-gradient-to-br from-green-500 to-green-600' :
                          'bg-gradient-to-br from-purple-500 to-purple-600'
                        }`}>
                          <span className="text-sm font-bold text-white">
                            {marketplace.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">{marketplace.name}</p>
                          <p className="text-sm text-slate-500">
                            {stats?.ordersByMarketplace?.find((m: any) => m.marketplace === marketplace.name)?.orders || 0} orders today
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-sm text-slate-600 font-medium">Live</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Recent Orders */}
        <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold text-slate-800">Recent Orders</CardTitle>
                <p className="text-slate-600 mt-1">Latest transactions from your stores</p>
              </div>
              <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg" asChild>
                <Link href="/orders">
                  View All Orders
                  <ArrowUpRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {ordersLoading ? (
              <div className="animate-pulse space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-20 bg-gradient-to-r from-slate-200 to-slate-300 rounded-xl"></div>
                ))}
              </div>
            ) : (
              <div className="overflow-hidden rounded-xl border border-slate-200">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50/80">
                      <TableHead className="font-semibold text-slate-700">Order ID</TableHead>
                      <TableHead className="font-semibold text-slate-700">Customer</TableHead>
                      <TableHead className="font-semibold text-slate-700">Marketplace</TableHead>
                      <TableHead className="font-semibold text-slate-700">Amount</TableHead>
                      <TableHead className="font-semibold text-slate-700">Status</TableHead>
                      <TableHead className="font-semibold text-slate-700">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentOrders?.map((order: any) => (
                      <TableRow key={order.id} className="hover:bg-slate-50/50 transition-colors">
                        <TableCell className="font-mono font-medium text-blue-600">{order.orderId}</TableCell>
                        <TableCell className="font-medium">{order.customer.name}</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                            {order.marketplace.name}
                          </span>
                        </TableCell>
                        <TableCell className="font-semibold text-green-600">€{order.totalAmount}</TableCell>
                        <TableCell>
                          <Badge 
                            className={`${
                              order.status === 'delivered' ? 'bg-green-100 text-green-700 hover:bg-green-100' :
                              order.status === 'shipped' ? 'bg-blue-100 text-blue-700 hover:bg-blue-100' :
                              order.status === 'pending' ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100' :
                              'bg-red-100 text-red-700 hover:bg-red-100'
                            } border-0`}
                          >
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline" className="hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline" className="hover:bg-slate-50 hover:text-slate-600">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}