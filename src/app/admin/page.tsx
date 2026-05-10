"use client";

import { useEffect, useState } from "react";
import { 
  Users, 
  DollarSign, 
  Clock, 
  Activity, 
  Wallet, 
  MessageCircle,
  TrendingUp,
  ArrowUpRight
} from "lucide-react";
import { AppIcon } from "@/components/ui/icon";
import { formatVnd } from "@/lib/format";

type AdminStats = {
  users: number;
  revenue: number;
  pendingOrders: number;
  totalUsage: number;
  creditsSold: string;
  openTickets: number;
};

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then(res => res.json())
      .then(result => {
        if (result.success) {
          setStats(result.data);
        }
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
      </div>
    );
  }

  const cards = [
    { label: "Tổng người dùng", value: stats?.users || 0, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Tổng doanh thu", value: formatVnd(stats?.revenue || 0), icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Đơn chờ xử lý", value: stats?.pendingOrders || 0, icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Tổng yêu cầu AI", value: stats?.totalUsage || 0, icon: Activity, color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "Credits đã bán", value: stats?.creditsSold || 0, icon: Wallet, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Yêu cầu hỗ trợ", value: stats?.openTickets || 0, icon: MessageCircle, color: "text-rose-600", bg: "bg-rose-50" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Thống kê hệ thống</h1>
        <p className="text-slate-500 mt-1">Tổng quan tình hình kinh doanh và vận hành của TzoShop.</p>
      </div>

      {/* Grid Stats */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <div key={card.label} className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
            <div className="flex items-center justify-between">
              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${card.bg} ${card.color}`}>
                <AppIcon icon={card.icon} className="h-6 w-6" />
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-50 text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                <ArrowUpRight className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-5">
              <p className="text-sm font-bold text-slate-500">{card.label}</p>
              <h3 className="text-3xl font-black text-slate-900 mt-1">{card.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity (Placeholder for now) */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-black text-slate-900">Biểu đồ tăng trưởng</h2>
            <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg text-xs font-bold">
              <TrendingUp className="h-3 w-3" />
              +12.5%
            </div>
          </div>
          <div className="h-[240px] flex items-center justify-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-400 text-sm italic">
            Biểu đồ sẽ hiển thị tại đây khi có đủ dữ liệu lịch sử.
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-8">
          <h2 className="text-xl font-black text-slate-900 mb-6">Cảnh báo hệ thống</h2>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="h-2 w-2 mt-2 shrink-0 rounded-full bg-amber-500" />
                <div>
                  <p className="text-sm font-bold text-slate-900">Provider Key (Claude) sắp hết hạn</p>
                  <p className="text-xs text-slate-500 mt-1">Vui lòng kiểm tra và cập nhật key mới để tránh gián đoạn.</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
