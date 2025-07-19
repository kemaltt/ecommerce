import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import Dashboard from "@/pages/dashboard";
import Orders from "@/pages/orders";
import Products from "@/pages/products";
import Customers from "@/pages/customers";
import Marketplaces from "@/pages/marketplaces";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar />
      <main className="flex-1 ml-64 overflow-x-hidden">
        <Header />
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route path="/orders" component={Orders} />
          <Route path="/products" component={Products} />
          <Route path="/customers" component={Customers} />
          <Route path="/marketplaces" component={Marketplaces} />
          <Route component={NotFound} />
        </Switch>
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
