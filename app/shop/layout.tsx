import "../globals.css";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { User } from "lucide-react";

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="w-full flex items-center justify-between px-8 py-4 bg-stone-950 shadow-lg">
        <div className="flex items-center gap-4">
          <a href="/user/dashboard" className="text-2xl font-bold tracking-tight text-primary">Kubera</a>
          <a href="/shop" className="ml-6 text-foreground hover:text-primary transition">Shop</a>
          <a href="/user/cart" className="ml-4 text-foreground hover:text-primary transition">View Cart</a>
          <a href="/user/orders" className="ml-4 text-foreground hover:text-primary transition">My Orders</a>
          <a href="/user/wallet" className="ml-4 text-foreground hover:text-primary transition">Wallet</a>
          <a href="/user/tickets" className="ml-4 text-foreground hover:text-primary transition">Support</a>
        </div>
        <div className="flex items-center gap-4">
          <span className="bg-primary/10 text-primary px-3 py-1 rounded-full font-semibold">$0.00</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="bg-stone-900 w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition">
                <User className="w-5 h-5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44 mt-2">
              <div className="px-3 py-2 text-xs text-muted-foreground">Signed in as<br /><span className="font-semibold text-foreground">Anthony Saah</span></div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <a href="/user/profile">Profile Settings</a>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a href="/">Logout</a>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>
      <div>{children}</div>
    </div>
  );
}
