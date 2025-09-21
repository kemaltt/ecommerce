import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  Users, 
  Store,
  Menu 
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard, color: "text-blue-500" },
  { name: "Orders", href: "/orders", icon: ShoppingCart, color: "text-emerald-500" },
  { name: "Products", href: "/products", icon: Package, color: "text-purple-500" },
  { name: "Customers", href: "/customers", icon: Users, color: "text-orange-500" },
  { name: "Markets", href: "/marketplaces", icon: Store, color: "text-pink-500" },
];

export default function MobileNavigation() {
  const [location] = useLocation();

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-background border-t dark:border-slate-800 backdrop-blur-md supports-[backdrop-filter]:bg-background/80">
      <div className="container px-0 mx-auto">
        <nav className="flex items-center justify-between px-1">
          {navigation.map((item) => {
            const isActive = location === item.href;
            return (
              <Link key={item.name} href={item.href}>
                <a
                  className={cn(
                    "flex flex-col items-center justify-center py-3 min-w-[4.25rem]",
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <div className={cn(
                    "w-10 h-10 flex items-center justify-center rounded-full mb-1",
                    isActive 
                      ? "bg-primary/10" 
                      : "bg-transparent"
                  )}>
                    <item.icon
                      className={cn(
                        "h-5 w-5",
                        isActive ? item.color : "text-current"
                      )}
                    />
                  </div>
                  <span className="text-xs font-medium truncate">{item.name}</span>
                </a>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}