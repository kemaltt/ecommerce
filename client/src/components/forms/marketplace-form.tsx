import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { insertMarketplaceSchema } from "@shared/schema";
import type { Marketplace } from "@shared/schema";

const formSchema = insertMarketplaceSchema;

interface MarketplaceFormProps {
  marketplace?: Marketplace;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function MarketplaceForm({ marketplace, onSubmit, onCancel, isLoading }: MarketplaceFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: marketplace?.name || "",
      type: marketplace?.type || "",
      isConnected: marketplace?.isConnected || false,
      apiKey: marketplace?.apiKey || "",
      apiSecret: marketplace?.apiSecret || "",
      storeUrl: marketplace?.storeUrl || "",
      stockTracking: marketplace?.stockTracking ?? true,
      autoUpdateStock: marketplace?.autoUpdateStock ?? true,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Marketplace Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter marketplace name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select marketplace type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="amazon">Amazon</SelectItem>
                    <SelectItem value="ebay">eBay</SelectItem>
                    <SelectItem value="shopify">Shopify</SelectItem>
                    <SelectItem value="woocommerce">WooCommerce</SelectItem>
                    <SelectItem value="kaufland">Kaufland</SelectItem>
                    <SelectItem value="shopware6">Shopware6</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="apiKey"
            render={({ field }) => (
              <FormItem>
                <FormLabel>API Key</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter API key" 
                    type="password" 
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="apiSecret"
            render={({ field }) => (
              <FormItem>
                <FormLabel>API Secret</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter API secret" 
                    type="password" 
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="storeUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Store URL</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter store URL" 
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Stock Management Settings</h3>
          
          <FormField
            control={form.control}
            name="stockTracking"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between">
                <div>
                  <FormLabel>Enable Stock Tracking</FormLabel>
                  <p className="text-sm text-muted-foreground">
                    Monitor and update stock levels for this marketplace
                  </p>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value ?? false}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="autoUpdateStock"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between">
                <div>
                  <FormLabel>Auto Update Stock</FormLabel>
                  <p className="text-sm text-muted-foreground">
                    Automatically sync stock changes to this marketplace
                  </p>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value ?? false}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : marketplace ? "Update Marketplace" : "Connect Marketplace"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
