import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface OrderWithItems {
  id: string;
  total_amount: number;
  status: string;
  created_at: string;
  user_id: string;
}

interface ReportData {
  totalRevenue: number;
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  revenueByMonth: { month: string; revenue: number }[];
  ordersByStatus: { status: string; count: number }[];
  recentOrders: OrderWithItems[];
}

export const useReports = () => {
  return useQuery({
    queryKey: ["reports"],
    queryFn: async (): Promise<ReportData> => {
      // Fetch all orders
      const { data: orders, error: ordersError } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (ordersError) throw ordersError;

      const ordersData = orders || [];

      // Calculate metrics
      const totalRevenue = ordersData.reduce((sum, order) => sum + Number(order.total_amount), 0);
      const totalOrders = ordersData.length;
      const pendingOrders = ordersData.filter(o => o.status === "pending").length;
      const completedOrders = ordersData.filter(o => o.status === "completed").length;

      // Revenue by month (last 6 months)
      const monthlyRevenue: Record<string, number> = {};
      const now = new Date();
      for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const key = date.toLocaleString("default", { month: "short", year: "numeric" });
        monthlyRevenue[key] = 0;
      }

      ordersData.forEach(order => {
        const date = new Date(order.created_at);
        const key = date.toLocaleString("default", { month: "short", year: "numeric" });
        if (monthlyRevenue[key] !== undefined) {
          monthlyRevenue[key] += Number(order.total_amount);
        }
      });

      const revenueByMonth = Object.entries(monthlyRevenue).map(([month, revenue]) => ({
        month,
        revenue,
      }));

      // Orders by status
      const statusCounts: Record<string, number> = {};
      ordersData.forEach(order => {
        statusCounts[order.status] = (statusCounts[order.status] || 0) + 1;
      });

      const ordersByStatus = Object.entries(statusCounts).map(([status, count]) => ({
        status,
        count,
      }));

      return {
        totalRevenue,
        totalOrders,
        pendingOrders,
        completedOrders,
        revenueByMonth,
        ordersByStatus,
        recentOrders: ordersData.slice(0, 10),
      };
    },
  });
};
