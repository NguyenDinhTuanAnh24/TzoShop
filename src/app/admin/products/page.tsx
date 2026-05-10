"use client";

import { useEffect, useState } from "react";
import { 
  Package, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Tag, 
  Wallet,
  Calendar,
  Layers,
  Check,
  X
} from "lucide-react";
import { AppIcon } from "@/components/ui/icon";
import { formatVnd, formatCredits } from "@/lib/format";
import { useToast } from "@/hooks/use-toast";
import { ToastMessage } from "@/components/ui/toast-message";

type Product = {
  id: string;
  name: string;
  slug: string;
  apiFamily: string;
  tier: string;
  credits: string | bigint;
  durationDays: number;
  priceVnd: number;
  apiKeyLimit: number;
  isActive: boolean;
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast, showToast, clearToast } = useToast();

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/admin/products");
      const result = await res.json();
      if (result.success) setProducts(result.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg shadow-slate-200">
            <AppIcon icon={Package} className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Quản lý gói Credits</h1>
            <p className="text-sm text-slate-500 font-medium">Thiết lập các gói nạp credits cho từng dòng API.</p>
          </div>
        </div>

        <button className="flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-6 py-3 text-sm font-bold text-white hover:bg-black transition-all shadow-lg shadow-slate-200">
          <Plus className="h-4 w-4" /> Tạo gói mới
        </button>
      </div>

      {/* Grid Content */}
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {isLoading ? (
          <div className="col-span-full py-20 text-center"><div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" /></div>
        ) : products.length === 0 ? (
          <div className="col-span-full py-20 text-center text-slate-400 font-medium italic border border-dashed border-slate-200 rounded-3xl">Chưa có gói sản phẩm nào.</div>
        ) : (
          products.map((p) => (
            <div key={p.id} className="group relative overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-sm hover:shadow-md transition-all">
              {/* Status Ribbon */}
              <div className={`absolute top-0 right-0 px-6 py-1 text-[10px] font-black uppercase tracking-widest text-white transform translate-x-[25%] translate-y-[50%] rotate-45 ${p.isActive ? "bg-emerald-500" : "bg-slate-400"}`}>
                {p.isActive ? "Active" : "Disabled"}
              </div>

              <div className="mb-6 flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                  <AppIcon icon={Package} className="h-6 w-6" />
                </div>
                <div className="flex gap-1">
                  <button className="h-9 w-9 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:text-slate-900 hover:bg-white border border-slate-100 transition-all shadow-sm"><Edit3 className="h-4 w-4" /></button>
                  <button className="h-9 w-9 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:text-rose-600 hover:bg-white border border-slate-100 transition-all shadow-sm"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{p.apiFamily} · {p.tier}</p>
                <h3 className="text-xl font-black text-slate-900 leading-tight">{p.name}</h3>
              </div>

              <div className="mt-8 space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-bold text-slate-500 flex items-center gap-2"><Wallet className="h-4 w-4 text-slate-300" /> Credits</span>
                  <span className="font-black text-slate-900">{formatCredits(typeof p.credits === 'string' ? BigInt(p.credits) : p.credits)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-bold text-slate-500 flex items-center gap-2"><Calendar className="h-4 w-4 text-slate-300" /> Thời hạn</span>
                  <span className="font-black text-slate-900">{p.durationDays} ngày</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-bold text-slate-500 flex items-center gap-2"><Layers className="h-4 w-4 text-slate-300" /> API Key tối đa</span>
                  <span className="font-black text-slate-900">{p.apiKeyLimit} keys</span>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-50 flex items-end justify-between">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Giá bán</p>
                  <p className="text-2xl font-black text-emerald-600">{formatVnd(p.priceVnd)}</p>
                </div>
                <button className="flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-xs font-bold text-slate-900 hover:bg-slate-50 transition-colors">
                  Chi tiết <Tag className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {toast && (
        <ToastMessage
          message={toast.message}
          type={toast.type}
          onClose={clearToast}
        />
      )}
    </div>
  );
}
