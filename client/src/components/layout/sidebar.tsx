import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  Users, 
  Store,
  Zap
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Orders", href: "/orders", icon: ShoppingCart },
  { name: "Products", href: "/products", icon: Package },
  { name: "Customers", href: "/customers", icon: Users },
  { name: "Schnittstelle", href: "/marketplaces", icon: Store },
];

export default function Sidebar() {
  const [location] = useLocation();

  return (
    <aside className="bg-gradient-to-r from-gray-800 to-gray-600 text-white h-screen w-64 flex flex-col fixed top-0 left-0 rounded-none">
      {/* Sidebar content */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary flex items-center justify-center">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold">SchnittstelleHub</h1>
        </div>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {/* Navigation items */}
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.href;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "nav-link flex items-center px-4 py-3 text-sm font-medium",
                isActive
                  ? "active bg-primary text-white"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
              )}
            >
              <Icon className="w-5 h-5 mr-3" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
