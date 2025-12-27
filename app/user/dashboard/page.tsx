import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart } from "lucide-react";

const bankLogs = [
  {
    id: 1,
    product: "Chase Bank Checking Account",
    type: "Personal Checking",
    bank: "Chase Bank",
    balance: 10979,
    price: 110,
    region: "US United States",
    status: "Available",
    description: "Chase Bank checking account with debit card, online banking access. RDP Login included.",
  },
  {
    id: 2,
    product: "Chase Bank Checking Account",
    type: "Personal Checking",
    bank: "Chase Bank",
    balance: 29996,
    price: 300,
    region: "US United States",
    status: "Available",
    description: "Chase Bank checking account with debit card, online banking access. RDP Login included.",
  },
  {
    id: 3,
    product: "Chase Bank Checking Account",
    type: "Personal Checking",
    bank: "Chase Bank",
    balance: 21471,
    price: 215,
    region: "US United States",
    status: "Available",
    description: "Chase Bank checking account with debit card, online banking access. RDP Login included.",
  },
];

export default function DashboardPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground">
      <div className="w-full max-w-6xl p-8">
        <h1 className="text-4xl font-bold mb-2">Welcome, User!</h1>
        <p className="text-muted-foreground mb-8">Happy Shopping</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Card className="bg-linear-to-br from-stone-950 to-stone-900 border-none flex items-center justify-center">
            <CardHeader className="w-full flex items-center justify-center p-6">
              <div className="flex flex-col items-center justify-center w-full">
                <span className="text-base font-medium text-muted-foreground">Available funds</span>
                <span className="text-3xl font-bold text-primary">$0.00</span>
              </div>
            </CardHeader>
          </Card>
          <Card className="bg-linear-to-br from-stone-950 to-stone-900 border-none flex items-center justify-center">
            <CardHeader className="w-full flex items-center justify-center p-6">
              <div className="flex flex-col items-center justify-center w-full">
                <span className="text-base font-medium text-muted-foreground">Total completed</span>
                <span className="text-3xl font-bold">0</span>
              </div>
            </CardHeader>
          </Card>
          <Card className="bg-linear-to-br from-stone-950 to-stone-900 border-none flex items-center justify-center">
            <CardHeader className="w-full flex items-center justify-center p-6">
              <div className="flex flex-col items-center justify-center w-full">
                <span className="text-base font-medium text-muted-foreground">Awaiting processing</span>
                <span className="text-3xl font-bold">0</span>
              </div>
            </CardHeader>
          </Card>
        </div>
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Available Bank Logs</h2>
          <div className="overflow-x-auto rounded-xl shadow bg-card">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-stone-950">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Product</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Description</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Bank</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Balance</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Price</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Region</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Status</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {bankLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-stone-900/60 transition">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="rounded-full px-2 py-1 text-xs font-semibold bg-primary/10 text-primary">CH</Badge>
                        <div>
                          <div className="font-semibold text-sm">{log.product}</div>
                          <div className="text-xs text-muted-foreground">{log.type}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 max-w-xs text-sm text-muted-foreground">{log.description}</td>
                    <td className="px-4 py-3 text-sm">{log.bank}</td>
                    <td className="px-4 py-3 text-primary font-bold">${log.balance.toLocaleString()}</td>
                    <td className="px-4 py-3 text-foreground font-semibold">${log.price}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{log.region}</td>
                    <td className="px-4 py-3">
                      <Badge variant="secondary" className="text-xs font-semibold px-2 py-1 bg-green-700/20 text-green-400">{log.status}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Button
                        size="sm"
                        className="bg-primary hover:bg-primary/90 text-white flex items-center gap-2 px-4 py-2 rounded-full shadow transition-transform duration-150 active:scale-95"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        Add to Cart
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
