import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Settings, Unlink, Store } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import MarketplaceForm from "@/components/forms/marketplace-form";
import type { Marketplace } from "@shared/schema";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const marketplaceIcons = {
  amazon: { bg: "bg-yellow-400", text: "A" },
  ebay: { bg: "bg-blue-600", text: "E" },
  shopify: { bg: "bg-green-600", text: "S" },
  woocommerce: { bg: "bg-purple-600", text: "W" },
  kaufland: { bg: "bg-red-600", text: "K" },
  shopware6: { bg: "bg-blue-800", text: "S6" },
};

export default function Marketplaces() {
  const [selectedMarketplace, setSelectedMarketplace] = useState<Marketplace | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [filterType, setFilterType] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: marketplaces, isLoading } = useQuery<Marketplace[]>({
    queryKey: ["/api/marketplaces"],
  });

  const createMarketplaceMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("POST", "/api/marketplaces", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/marketplaces"] });
      setIsFormOpen(false);
      setSelectedMarketplace(null);
      toast({
        title: "Schnittstelle connected",
        description: "Schnittstelle has been connected successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to connect marketplace.",
        variant: "destructive",
      });
    },
  });

  const updateMarketplaceMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      return apiRequest("PUT", `/api/marketplaces/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/marketplaces"] });
      setIsFormOpen(false);
      setSelectedMarketplace(null);
      toast({
        title: "Schnittstelle updated",
        description: "Schnittstelle has been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update marketplace.",
        variant: "destructive",
      });
    },
  });

  const deleteMarketplaceMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("DELETE", `/api/marketplaces/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/marketplaces"] });
      toast({
        title: "Schnittstelle disconnected",
        description: "Schnittstelle has been disconnected successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to disconnect marketplace.",
        variant: "destructive",
      });
    },
  });

  const handleFormSubmit = (data: any) => {
    if (selectedMarketplace) {
      updateMarketplaceMutation.mutate({ id: selectedMarketplace.id, data });
    } else {
      createMarketplaceMutation.mutate(data);
    }
  };

  const handleConfigure = (marketplace: Marketplace) => {
    setSelectedMarketplace(marketplace);
    setIsFormOpen(true);
  };

  const handleDisconnect = (id: number) => {
    if (confirm("Are you sure you want to disconnect this marketplace?")) {
      deleteMarketplaceMutation.mutate(id);
    }
  };

  const handleAddNew = () => {
    setSelectedMarketplace(null);
    setIsFormOpen(true);
  };

  const filteredMarketplaces = marketplaces?.filter((marketplace) => {
        const matchesType = filterType && filterType !== "all" ? marketplace.type === filterType : true;
        const matchesStatus = filterStatus && filterStatus !== "all"
          ? filterStatus === "connected"
            ? marketplace.isConnected
            : !marketplace.isConnected
          : true;
        return matchesType && matchesStatus;
      });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="h-12 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Filter Options and Add Button in one row */}
      <div className="mb-6 flex flex-col sm:flex-row items-center gap-4">
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className={`w-full sm:w-[200px] ${filterType ? 'border-blue-500' : 'border-gray-300'} focus:ring-0 focus:ring-offset-0 focus:border-blue-500 focus:outline-none`}>
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle Schnittstelle</SelectItem>
            <SelectItem value="amazon">Amazon</SelectItem>
            <SelectItem value="ebay">eBay</SelectItem>
            <SelectItem value="shopify">Shopify</SelectItem>
            <SelectItem value="woocommerce">WooCommerce</SelectItem>
            <SelectItem value="kaufland">Kaufland</SelectItem>
            <SelectItem value="shopware6">Shopware6</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className={`w-full sm:w-[200px] ${filterStatus ? 'border-blue-500' : 'border-gray-300'} focus:ring-0 focus:ring-offset-0 focus:border-blue-500 focus:outline-none`}>
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="connected">Connected</SelectItem>
            <SelectItem value="not-connected">Not Connected</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex-1"></div>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddNew}>
              <Plus className="h-4 w-4 mr-2" />
              Add Schnittstelle
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {selectedMarketplace ? "Configure Schnittstelle" : "Connect New Schnittstelle"}
              </DialogTitle>
            </DialogHeader>
            <MarketplaceForm
              marketplace={selectedMarketplace || undefined}
              onSubmit={handleFormSubmit}
              onCancel={() => setIsFormOpen(false)}
              isLoading={createMarketplaceMutation.isPending || updateMarketplaceMutation.isPending}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Marketplaces Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="w-5 h-5" />
            Schnittstelle ({filteredMarketplaces?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Icon</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Features</TableHead>
                <TableHead>Last Sync</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMarketplaces && filteredMarketplaces.length > 0 ? (
                filteredMarketplaces.map((marketplace: Marketplace) => {
                  const icon = marketplaceIcons[marketplace.type as keyof typeof marketplaceIcons] || 
                              { bg: "bg-gray-600", text: marketplace.name.charAt(0) };
                  
                  return (
                    <TableRow key={marketplace.id}>
                      <TableCell>
                        <div className={`w-10 h-10 flex items-center justify-center ${icon.bg}`}>
                          <span className="text-md font-bold text-white">{icon.text}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{marketplace.name}</div>
                      </TableCell>
                      <TableCell>
                        <span className="capitalize">{marketplace.type}</span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={marketplace.isConnected ? "default" : "secondary"}>
                          {marketplace.isConnected ? "Connected" : "Not Connected"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {marketplace.isConnected && (
                          <div className="flex gap-2">
                            <Badge variant={marketplace.stockTracking ? "default" : "secondary"} className="text-xs">
                              {marketplace.stockTracking ? "Stock Tracking ON" : "Stock Tracking OFF"}
                            </Badge>
                            <Badge variant={marketplace.autoUpdateStock ? "default" : "secondary"} className="text-xs">
                              {marketplace.autoUpdateStock ? "Auto Update ON" : "Auto Update OFF"}
                            </Badge>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-500">
                          {marketplace.isConnected 
                            ? (marketplace.lastSync ? new Date(marketplace.lastSync).toLocaleDateString() : 'Never')
                            : "Not connected"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleConfigure(marketplace)}
                          >
                            <Settings className="w-4 h-4 mr-1" />
                            Configure
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleDisconnect(marketplace.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Unlink className="w-4 h-4 mr-1" />
                            Disconnect
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    No Schnittstelle found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
