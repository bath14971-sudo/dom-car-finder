import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Package, Loader2, Printer } from "lucide-react";
import { useCars, type Car } from "@/hooks/useCars";

interface Order { id: string; status: string; total_amount: number; created_at: string; shipping_address: string | null; phone: string | null; }
interface OrderItem { id: string; car_id: string; price: number; }

const getStatusLabel = (status: string) => {
  switch (status) {
    case "pending": return "រង់ចាំ";
    case "confirmed": return "បានបញ្ជាក់";
    case "completed": return "បានបញ្ចប់";
    case "cancelled": return "បានលុបចោល";
    default: return status;
  }
};

const Orders = () => {
  const { user } = useAuth();
  const { data: carsData = [] } = useCars();
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderItems, setOrderItems] = useState<Record<string, OrderItem[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchOrders = async () => {
      const { data: ordersData, error } = await supabase.from("orders").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
      if (error) { console.error("Error fetching orders:", error); setLoading(false); return; }
      setOrders(ordersData || []);
      const itemsMap: Record<string, OrderItem[]> = {};
      for (const order of ordersData || []) {
        const { data: items } = await supabase.from("order_items").select("*").eq("order_id", order.id);
        itemsMap[order.id] = items || [];
      }
      setOrderItems(itemsMap);
      setLoading(false);
    };
    fetchOrders();
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-background"><Header />
        <main className="pt-24 pb-16"><div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold mb-4">សូមចូលគណនីដើម្បីមើលការបញ្ជាទិញ</h1>
          <Link to="/auth"><Button>ចូល</Button></Link>
        </div></main><Footer />
      </div>
    );
  }

  const getStatusVariant = (status: string) => {
    switch (status) { case "pending": return "secondary"; case "confirmed": case "completed": return "default"; case "cancelled": return "destructive"; default: return "secondary"; }
  };

  const handlePrint = (order: Order) => {
    const items = orderItems[order.id] || [];
    const rows = items.map((item) => {
      const car = carsData.find((c) => c.id === item.car_id);
      return `
        <tr>
          <td>${car?.name ?? "-"}</td>
          <td>${car?.code ?? "-"}</td>
          <td style="text-align:right">$${Number(item.price).toLocaleString()}</td>
        </tr>`;
    }).join("");

    const html = `<!doctype html><html><head><meta charset="utf-8"/>
<title>វិក្កយបត្រ #${order.id.slice(0, 8)}</title>
<link href="https://fonts.googleapis.com/css2?family=Battambang:wght@400;700&family=Bokor&display=swap" rel="stylesheet">
<style>
  *{box-sizing:border-box}
  body{font-family:'Battambang',sans-serif;color:#111;padding:32px;max-width:760px;margin:0 auto}
  h1{font-family:'Bokor',sans-serif;font-size:28px;margin:0 0 4px}
  .muted{color:#666;font-size:13px}
  .row{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:24px;border-bottom:2px solid #111;padding-bottom:12px}
  table{width:100%;border-collapse:collapse;margin-top:16px}
  th,td{padding:10px 8px;border-bottom:1px solid #ddd;text-align:left;font-size:14px}
  th{background:#f4f4f4}
  .total{display:flex;justify-content:space-between;margin-top:16px;padding-top:12px;border-top:2px solid #111;font-weight:700;font-size:18px}
  .info{margin-top:8px;font-size:13px;line-height:1.6}
  .footer{margin-top:32px;text-align:center;font-size:12px;color:#666}
  @media print{body{padding:0}}
</style></head><body>
  <div class="row">
    <div>
      <h1>DOM Car Finder</h1>
      <div class="muted">វិក្កយបត្របញ្ជាទិញ / Order Receipt</div>
    </div>
    <div style="text-align:right">
      <div><strong>#${order.id.slice(0, 8)}</strong></div>
      <div class="muted">${new Date(order.created_at).toLocaleDateString("km-KH", { year: "numeric", month: "long", day: "numeric" })}</div>
      <div class="muted">ស្ថានភាព: ${getStatusLabel(order.status)}</div>
    </div>
  </div>
  <div class="info">
    <div><strong>ទូរស័ព្ទ:</strong> ${order.phone ?? "-"}</div>
    <div><strong>អាសយដ្ឋាន:</strong> ${order.shipping_address ?? "-"}</div>
  </div>
  <table>
    <thead><tr><th>ឡាន</th><th>កូដ</th><th style="text-align:right">តម្លៃ</th></tr></thead>
    <tbody>${rows}</tbody>
  </table>
  <div class="total"><span>សរុប</span><span>$${Number(order.total_amount).toLocaleString()}</span></div>
  <div class="footer">សូមអរគុណចំពោះការទុកចិត្ត!</div>
  <script>window.onload=()=>{setTimeout(()=>{window.print();},400);};</script>
</body></html>`;

    const w = window.open("", "_blank", "width=820,height=900");
    if (!w) return;
    w.document.open();
    w.document.write(html);
    w.document.close();
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8">
            <ArrowLeft className="h-4 w-4" />ត្រឡប់ទៅទិញទំនិញ
          </Link>
          <h1 className="text-3xl font-bold mb-8">ការបញ្ជាទិញរបស់ខ្ញុំ</h1>

          {loading ? (
            <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
          ) : orders.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-xl font-medium mb-2">មិនទាន់មានការបញ្ជាទិញ</h2>
                <p className="text-muted-foreground mb-4">ចាប់ផ្តើមទិញទំនិញដើម្បីមើលការបញ្ជាទិញរបស់អ្នកនៅទីនេះ</p>
                <Link to="/"><Button>មើលឡាន</Button></Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <Card key={order.id}>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">ការបញ្ជាទិញ #{order.id.slice(0, 8)}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.created_at).toLocaleDateString("km-KH", { year: "numeric", month: "long", day: "numeric" })}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={getStatusVariant(order.status)}>{getStatusLabel(order.status)}</Badge>
                      <Button variant="outline" size="sm" onClick={() => handlePrint(order)}>
                        <Printer className="h-4 w-4 mr-2" />បោះពុម្ព
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {orderItems[order.id]?.map((item) => {
                        const car = carsData.find((c) => c.id === item.car_id);
                        return (
                          <div key={item.id} className="flex gap-4 border-b border-border pb-4 last:border-0 last:pb-0">
                            {car && (<>
                              <img src={car.image} alt={car.name} className="w-20 h-14 object-cover rounded-lg" />
                              <div className="flex-1"><h4 className="font-medium">{car.name}</h4><p className="text-sm text-muted-foreground">{car.code}</p></div>
                            </>)}
                            <p className="font-bold text-primary">${Number(item.price).toLocaleString()}</p>
                          </div>
                        );
                      })}
                    </div>
                    <div className="flex justify-between items-center pt-4 mt-4 border-t border-border">
                      <span className="font-medium">សរុប</span>
                      <span className="text-xl font-bold text-primary">${Number(order.total_amount).toLocaleString()}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Orders;
