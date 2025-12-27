import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { ShoppingCart } from "lucide-react";

const mockProducts = [
  { id: 1, name: "Chase Bank Checking Account", price: 110, balance: 10979, status: "Available" },
  { id: 2, name: "Chase Bank Checking Account", price: 300, balance: 29996, status: "Available" },
  { id: 3, name: "Chase Bank Checking Account", price: 215, balance: 21471, status: "Available" },
];

export default function ShopPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground">
      <div className="w-full max-w-4xl p-8">
        <h1 className="text-4xl font-bold mb-4">Shop</h1>
        <div className="mb-6 flex gap-4">
          <Input className="w-64" placeholder="Search products..." />
          <select className="bg-card rounded px-4 py-2 text-foreground">
            <option>All Regions</option>
          </select>
          <select className="bg-card rounded px-4 py-2 text-foreground">
            <option>All Banks</option>
          </select>
          <select className="bg-card rounded px-4 py-2 text-foreground">
            <option>All Prices</option>
          </select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mockProducts.map(product => (
            <Card key={product.id} className="p-6 flex flex-col gap-2">
              <CardHeader>
                <CardTitle className="text-lg">{product.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <span className="text-primary font-bold text-xl">${product.balance.toLocaleString()}</span>
                <span className="text-muted-foreground block">Price: <span className="text-foreground font-semibold">${product.price}</span></span>
                <span className="text-xs text-primary block">{product.status}</span>
                <Button className="mt-2 bg-primary hover:bg-primary/90 text-white flex items-center gap-2 px-4 py-2 rounded-full shadow transition-transform duration-150 active:scale-95">
                  <ShoppingCart className="w-4 h-4" />
                  Add to Cart
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}
