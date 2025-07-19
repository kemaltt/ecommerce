import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  Users, 
  Settings,
  Store,
  TrendingUp,
  Sparkles
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard, color: "text-blue-500" },
  { name: "Orders", href: "/orders", icon: ShoppingCart, color: "text-emerald-500" },
  { name: "Products", href: "/products", icon: Package, color: "text-purple-500" },
  { name: "Customers", href: "/customers", icon: Users, color: "text-orange-500" },
  { name: "Marketplaces", href: "/marketplaces", icon: Store, color: "text-pink-500" },
  { name: "Settings", href: "/settings", icon: Settings, color: "text-slate-500" },
];

export default function Sidebar() {
  const [location] = useLocation();

  return (
    <div className="flex h-screen w-64 flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden fixed inset-y-0 left-0 z-50">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-pink-600/10"></div>
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-br from-blue-500/20 to-transparent rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-500/20 to-transparent rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2"></div>

      <div className="flex flex-col flex-1 min-h-0 relative z-10">
        <div className="flex-1 flex flex-col pt-8 pb-4 overflow-y-auto">
          {/* Logo Section */}
          <div className="flex items-center flex-shrink-0 px-6 mb-10">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                  MarketHub
                </h1>
                <p className="text-xs text-slate-400 font-medium">Business Intelligence</p>
              </div>
            </div>
          </div>

          {/* Performance Badge */}
          <div className="mx-6 mb-8 p-4 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 backdrop-blur-sm rounded-xl border border-white/10">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Sales Growth</p>
                <p className="text-xs text-emerald-300">+12.5% this month</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 space-y-2">
            <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-4 px-3">
              Main Menu
            </p>
            {navigation.map((item) => {
              const isActive = location === item.href;
              return (
                <Link key={item.name} href={item.href}>
                  <a
                    className={cn(
                      "group flex items-center px-4 py-3.5 text-sm font-medium rounded-xl transition-all duration-300 relative overflow-hidden",
                      isActive
                        ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white shadow-lg backdrop-blur-sm border border-white/20"
                        : "text-slate-300 hover:text-white hover:bg-white/10 hover:backdrop-blur-sm"
                    )}
                  >
                    {isActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-xl blur-xl"></div>
                    )}
                    <div className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center mr-4 transition-all duration-300 relative z-10",
                      isActive 
                        ? "bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg" 
                        : "bg-slate-700/50 group-hover:bg-slate-600/50"
                    )}>
                      <item.icon
                        className={cn(
                          "h-5 w-5 transition-all duration-300",
                          isActive ? "text-white" : "text-slate-400 group-hover:text-white"
                        )}
                      />
                    </div>
                    <span className="relative z-10">{item.name}</span>
                    {isActive && (
                      <div className="absolute right-4 w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                    )}
                  </a>
                </Link>
              );
            })}
          </nav>

          {/* Bottom Section */}
          <div className="mt-8 px-6">
            <div className="p-4 bg-gradient-to-r from-slate-800/50 to-slate-700/50 backdrop-blur-sm rounded-xl border border-white/10">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-slate-600 to-slate-700 rounded-lg flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">JS</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">John Smith</p>
                  <p className="text-xs text-slate-400">Administrator</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}