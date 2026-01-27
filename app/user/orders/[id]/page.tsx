import Link from "next/link";
import { getOrder } from "@/lib/actions/orders";
import { OrderReceipt } from "../order-receipt";

interface OrderDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    new?: string;
  }>;
}

export default async function OrderDetailsPage({ params, searchParams }: OrderDetailsPageProps) {
  const { id } = await params;
  const { new: isNewStr } = await searchParams;
  const result = await getOrder(id);

  if (!result.success || !result.data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
        <h1 className="text-2xl font-bold text-red-500 mb-2">Order Not Found</h1>
        <p className="text-muted-foreground mb-4">
          Could not retrieve order details. ID: {id} <br />
          Error: {result.error || "Unknown Error"}
        </p>
        <Link href="/user/orders" className="text-primary hover:underline">Return to Orders</Link>
      </div>
    );
  }

  const order = result.data;
  const isNew = isNewStr === "true";

  return (
    <main className="min-h-screen bg-background text-foreground py-10 px-4 md:px-8 print:p-0 print:bg-white">
      <OrderReceipt order={order} isNew={isNew} />
    </main>
  );
}
