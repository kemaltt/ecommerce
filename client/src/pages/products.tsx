import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Plus, Eye, Edit, Trash2, Package, Search } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import ProductForm from "@/components/forms/product-form";
import type { Product } from "@shared/schema";
import { useIntl } from "react-intl";

export default function Products() {
  const formatMessage = useIntl().formatMessage;
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const filteredProducts = products?.filter((product: Product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const createProductMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("POST", "/api/products", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      setIsFormOpen(false);
      setSelectedProduct(null);
      toast({
        title: formatMessage({ id: "TOAST.PRODUCT_CREATED.TITLE" }),
        description: formatMessage({ id: "TOAST.PRODUCT_CREATED.DESC" }),
        variant: "success"
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

  const updateProductMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      return apiRequest("PUT", `/api/products/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      setIsFormOpen(false);
      setSelectedProduct(null);
      toast({
        title: formatMessage({ id: "TOAST.PRODUCT_UPDATED.TITLE" }),
        description: formatMessage({ id: "TOAST.PRODUCT_UPDATED.DESC" }),
        variant: "success"
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

  const deleteProductMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("DELETE", `/api/products/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: formatMessage({ id: "TOAST.PRODUCT_DELETED.TITLE" }),
        description: formatMessage({ id: "TOAST.PRODUCT_DELETED.DESC" }),
        variant: "success"
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

  const handleFormSubmit = (data: any) => {
    if (selectedProduct) {
      updateProductMutation.mutate({ id: selectedProduct.id, data });
    } else {
      createProductMutation.mutate(data);
    }
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsFormOpen(true);
  };

  const handleView = (product: Product) => {
    setSelectedProduct(product);
    setIsDetailOpen(true);
  };

  const handleDelete = (product: Product) => {
    setSelectedProduct(product);
    setIsDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (selectedProduct) {
      deleteProductMutation.mutate(selectedProduct.id);
      setIsDeleteOpen(false);
      setSelectedProduct(null);
    }
  };

  const handleAddNew = () => {
    setSelectedProduct(null);
    setIsFormOpen(true);
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
      {/* Search and Add Product */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400 z-10" />
          <Input
            placeholder={formatMessage({ id: "PLACEHOLDER.SEARCH_PRODUCTS" })}
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
              {formatMessage({ id: "BUTTON.ADD_PRODUCT" })}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {selectedProduct ? formatMessage({ id: "DIALOG.EDIT_PRODUCT" }) : formatMessage({ id: "DIALOG.ADD_NEW_PRODUCT" })}
              </DialogTitle>
            </DialogHeader>
            <ProductForm
              product={selectedProduct || undefined}
              onSubmit={handleFormSubmit}
              onCancel={() => setIsFormOpen(false)}
              isLoading={createProductMutation.isPending || updateProductMutation.isPending}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            {formatMessage({ id: "PRODUCTS.PAGE_TITLE" })} ({filteredProducts?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
                <TableRow>
                <TableHead className="w-[80px]">{formatMessage({ id: "TABLE.IMAGE" })}</TableHead>
                <TableHead>{formatMessage({ id: "TABLE.PRODUCT" })}</TableHead>
                <TableHead>{formatMessage({ id: "TABLE.SKU" })}</TableHead>
                <TableHead>{formatMessage({ id: "TABLE.PRICE" })}</TableHead>
                <TableHead>{formatMessage({ id: "TABLE.STOCK" })}</TableHead>
                <TableHead>{formatMessage({ id: "TABLE.STATUS" })}</TableHead>
                <TableHead className="text-right">{formatMessage({ id: "TABLE.ACTIONS" })}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts && filteredProducts.length > 0 ? (
                filteredProducts.map((product: Product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div 
                        className="w-12 h-12 bg-gray-200 rounded cursor-pointer overflow-hidden"
                        onClick={() => handleView(product)}
                      >
                        {product.imageUrl ? (
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-full h-full object-cover hover:scale-105 transition-transform"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                            {formatMessage({ id: "NO_IMAGE" })}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{product.name}</div>
                        {product.description && (
                          <div className="text-sm text-gray-500 max-w-[200px] truncate">
                            {product.description}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="text-sm bg-muted px-2 py-1 rounded dark:bg-muted/30 dark:text-foreground">
                        {product.sku}
                      </code>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">€{product.price}</span>
                    </TableCell>
                    <TableCell>
                      <span className={`text-sm ${product.stock < 10 ? 'text-red-600 font-medium' : 'text-gray-600'}`}>
                        {product.stock}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={product.status === "active" ? "default" : "secondary"}>
                        {product.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleView(product)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleEdit(product)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(product)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    {formatMessage({ id: "NO_PRODUCTS.FOUND" })}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Product Detail Modal */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{formatMessage({ id: "PRODUCT.DETAILS.TITLE" })}</DialogTitle>
          </DialogHeader>

          {selectedProduct && (
            <div className="space-y-6">
              <div className="flex gap-6">
                <div className="w-48 h-48 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                  {selectedProduct.imageUrl ? (
                    <img
                      src={selectedProduct.imageUrl}
                      alt={selectedProduct.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      {formatMessage({ id: "NO_IMAGE_AVAILABLE" })}
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-4">
                  <div>
                    <h3 className="text-2xl font-bold">{selectedProduct.name}</h3>
                    <p className="text-gray-600 mt-1">SKU: {selectedProduct.sku}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">{formatMessage({ id: "LABEL.PRICE" })}</label>
                      <p className="text-xl font-bold">€{selectedProduct.price}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">{formatMessage({ id: "LABEL.STOCK" })}</label>
                      <p className={`text-xl font-bold ${selectedProduct.stock < 10 ? 'text-red-600' : 'text-green-600'}`}>
                        {selectedProduct.stock}
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">{formatMessage({ id: "LABEL.STATUS" })}</label>
                    <div className="mt-2">
                      <Badge variant={selectedProduct.status === "active" ? "default" : "secondary"}>
                        {selectedProduct.status === "active" ? formatMessage({ id: "STATUS.ACTIVE" }) : formatMessage({ id: "STATUS.INACTIVE" })}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              {selectedProduct.description && (
                <div>
                  <label className="text-sm font-medium text-gray-500">{formatMessage({ id: "LABEL.DESCRIPTION" })}</label>
                  <p className="mt-2 text-sm text-gray-700">{selectedProduct.description}</p>
                </div>
              )}

              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsDetailOpen(false)}>
                  {formatMessage({ id: "BUTTON.CLOSE" })}
                </Button>
                <Button onClick={() => {
                  setIsDetailOpen(false);
                  handleEdit(selectedProduct);
                }}>
                  {formatMessage({ id: "BUTTON.EDIT_PRODUCT" })}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{formatMessage({ id: "DIALOG.DELETE_PRODUCT_TITLE" })}</DialogTitle>
          </DialogHeader>
          <div className="py-6">
            <p className="text-muted-foreground">
              {formatMessage({ id: "DIALOG.DELETE_PRODUCT_CONFIRM" }, { name: selectedProduct?.name })}
            </p>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
              {formatMessage({ id: "BUTTON.CANCEL" })}
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              {formatMessage({ id: "BUTTON.DELETE_PRODUCT" })}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
