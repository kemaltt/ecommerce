import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Search, Plus, Eye, Edit, Mail, Phone, MapPin, User } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { FormattedMessage, useIntl } from "react-intl";
import type { Customer } from "@shared/schema";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  address: z.string().optional(),
  marketplace: z.string().min(1, "Marketplace is required"),
});

export default function Customers() {
  const formatMessage = useIntl().formatMessage;
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: customers, isLoading } = useQuery<Customer[]>({
    queryKey: ["/api/customers"],
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
    },
  });

  const createCustomerMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("POST", "/api/customers", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/customers"] });
      setIsFormOpen(false);
      setSelectedCustomer(null);
      form.reset();
      toast({
        title: formatMessage({ id: "CUSTOMER.CREATED.TITLE" }),
        description: formatMessage({ id: "CUSTOMER.CREATED.DESC" }),
      });
    },
    onError: () => {
      toast({
        title: formatMessage({ id: "ERROR.TITLE" }),
        description: formatMessage({ id: "ERROR.CREATE_CUSTOMER" }),
        variant: "destructive",
      });
    },
  });

  const updateCustomerMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      return apiRequest("PUT", `/api/customers/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/customers"] });
      setIsFormOpen(false);
      setSelectedCustomer(null);
      form.reset();
      toast({
        title: formatMessage({ id: "CUSTOMER.UPDATED.TITLE" }),
        description: formatMessage({ id: "CUSTOMER.UPDATED.DESC" }),
      });
    },
    onError: () => {
      toast({
        title: formatMessage({ id: "ERROR.TITLE" }),
        description: formatMessage({ id: "ERROR.UPDATE_CUSTOMER" }),
        variant: "destructive",
      });
    },
  });

  const deleteConnectionMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("DELETE", `/api/connections/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/customers"] });
      toast({
        title: formatMessage({ id: "CONNECTION.DELETED.TITLE" }),
        description: formatMessage({ id: "CONNECTION.DELETED.DESC" }),
      });
    },
    onError: () => {
      toast({
        title: formatMessage({ id: "ERROR.TITLE" }),
        description: formatMessage({ id: "ERROR.CREATE_CUSTOMER" }),
        variant: "destructive",
      });
    },
  });

  const filteredCustomers = customers?.filter((customer: Customer) =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFormSubmit = (data: z.infer<typeof formSchema>) => {
    if (data.marketplace === "Amazon" || data.marketplace === "eBay") {
      window.location.href = `https://${data.marketplace.toLowerCase()}.com`; // Redirect to URL
    } else {
      if (selectedCustomer) {
        updateCustomerMutation.mutate({ id: selectedCustomer.id, data });
      } else {
        createCustomerMutation.mutate(data);
      }
    }
  };

  const handleEdit = (customer: Customer) => {
    setSelectedCustomer(customer);
    form.reset({
      name: customer.name,
      email: customer.email,
      phone: customer.phone || undefined,
      address: customer.address || undefined,
      marketplace: "", // Dieses Feld müsste in deinem Schema existieren
    });
    setIsFormOpen(true);
  };

  const handleAddNew = () => {
    setSelectedCustomer(null);
    form.reset();
    setIsFormOpen(true);
  };

  const handleDeleteConnection = (id: number) => {
    deleteConnectionMutation.mutate(id);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Search and Add Customer */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400 z-10" />
          <Input
            placeholder={formatMessage({ id: "PLACEHOLDER.SEARCH_CUSTOMERS" })}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onClear={() => setSearchTerm("")}
            className="pl-10 focus:ring-0 focus:ring-offset-0 focus:border-blue-500 focus:outline-none"
          />
        </div>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddNew}>
              <Plus className="h-4 w-4 mr-2" />
              {formatMessage({ id: "CUSTOMER.ADD" })}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {selectedCustomer ? (
                  <FormattedMessage id="CUSTOMER.EDIT" defaultMessage="Edit Customer" />
                ) : (
                  <FormattedMessage id="CUSTOMER.ADD_NEW.TITLE" defaultMessage="Add New Customer" />
                )}
              </DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{formatMessage({ id: "FORM.LABEL.NAME" })}</FormLabel>
                      <FormControl>
                        <Input placeholder={formatMessage({ id: "PLACEHOLDER.ENTER_NAME" })} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{formatMessage({ id: "FORM.LABEL.EMAIL" })}</FormLabel>
                      <FormControl>
                        <Input placeholder={formatMessage({ id: "PLACEHOLDER.ENTER_EMAIL" })} type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{formatMessage({ id: "FORM.LABEL.PHONE" })}</FormLabel>
                      <FormControl>
                        <Input placeholder={formatMessage({ id: "PLACEHOLDER.ENTER_PHONE" })} {...field} value={field.value || ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{formatMessage({ id: "FORM.LABEL.ADDRESS" })}</FormLabel>
                      <FormControl>
                        <Input placeholder={formatMessage({ id: "PLACEHOLDER.ENTER_ADDRESS" })} {...field} value={field.value || ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="marketplace"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{formatMessage({ id: "FORM.LABEL.MARKETPLACE" })}</FormLabel>
                      <FormControl>
                        <Input placeholder={formatMessage({ id: "PLACEHOLDER.ENTER_MARKETPLACE" })} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end space-x-4">
                  <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                    <FormattedMessage id="BUTTON.CANCEL" defaultMessage="Cancel" />
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={createCustomerMutation.isPending || updateCustomerMutation.isPending}
                  >
                    {createCustomerMutation.isPending || updateCustomerMutation.isPending 
                      ? formatMessage({ id: "SAVING" })
                      : selectedCustomer ? formatMessage({ id: "BUTTON.UPDATE" }) : formatMessage({ id: "BUTTON.CREATE" })
                    }
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Customers Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              {formatMessage({ id: "CUSTOMER.LIST.TITLE" })} ({filteredCustomers?.length || 0})
            </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                  <TableHead className="w-[50px]"></TableHead>
                  <TableHead>{formatMessage({ id: "TABLE.NAME" })}</TableHead>
                  <TableHead>{formatMessage({ id: "TABLE.EMAIL" })}</TableHead>
                  <TableHead>{formatMessage({ id: "TABLE.PHONE" })}</TableHead>
                  <TableHead>{formatMessage({ id: "TABLE.ADDRESS" })}</TableHead>
                  <TableHead>{formatMessage({ id: "TABLE.JOIN_DATE" })}</TableHead>
                  <TableHead className="text-right">{formatMessage({ id: "TABLE.ACTIONS" })}</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers && filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer: Customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-semibold">
                          {customer.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{customer.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">{customer.email}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {customer.phone ? (
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">{customer.phone}</span>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">{formatMessage({ id: "NO_PHONE" })}</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {customer.address ? (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="text-sm max-w-[200px] truncate">{customer.address}</span>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">{formatMessage({ id: "NO_ADDRESS" })}</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-600">
                        {customer.createdAt ? new Date(customer.createdAt).toLocaleDateString() : formatMessage({ id: "UNKNOWN" })}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleEdit(customer)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDeleteConnection(customer.id)}>
                          {formatMessage({ id: "BUTTON.DELETE" })}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    {formatMessage({ id: "NO_CUSTOMERS.FOUND" })}
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
