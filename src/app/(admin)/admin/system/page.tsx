"use client";

import { useEffect, useState } from "react";
import { 
  Activity, 
  Database, 
  ShieldCheck, 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  Mail, 
  Globe, 
  Key, 
  RefreshCw, 
  Clock, 
  Layers, 
  Zap, 
  ArrowRight,
  Settings,
  Cpu,
  CreditCard
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ToastMessage } from "@/components/ui/toast-message";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

type SystemData = {
  config: {
    database: boolean;
    payos: boolean;
    resend: boolean;
    googleOAuth: boolean;
    encryptionSecret: boolean;
  };
  dbConnected: boolean;
  stats: {
    activeProviders: number;
    activeModels: number;
  };
  recentOrders: any[];
  recentUsage: any[];
};

export default function AdminSystemPage() {
  const [data, setData] = useState<SystemData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast, showToast, clearToast } = useToast();

  const fetchSystemStatus = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/admin/system");
      const result = await res.json();
      if (result.success) {
        setData(result.data);
      } else {
        showToast(result.message || "Lỗi khi tải trạng thái", "error");
      }
    } catch (error) {
      showToast("Lỗi hệ thống", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSystemStatus();
  }, []);

  const ConfigCard = ({ title, status, icon: Icon, description }: any) => (
    <div className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm flex items-start gap-4 transition-all hover:shadow-md">
      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${status ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
        <Icon className="h-6 w-6" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-sm font-black text-slate-900 truncate">{title}</h3>
          {status ? (
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          ) : (
            <XCircle className="h-4 w-4 text-rose-500" />
          )}
        </div>
        <p className="text-[11px] font-bold text-slate-400 mb-2">{description}</p>
        <span className={`inline-flex rounded-lg px-2 py-0.5 text-[9px] font-black uppercase tracking-widest ${status ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-600'}`}>
          {status ? 'Configured' : 'Missing'}
        </span>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm">
        <div className="flex items-center gap-6">
           <div className="flex h-16 w-16 items-center justify-center rounded-[24px] bg-slate-900 text-white shadow-xl shadow-slate-200 ring-4 ring-slate-50">
              <Activity className="h-8 w-8" />
           </div>
           <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Trạng thái hệ thống</h1>
              <p className="text-slate-500 font-bold mt-1">Kiểm tra cấu hình môi trường và sức khỏe của ứng dụng.</p>
           </div>
        </div>
        <button 
          onClick={fetchSystemStatus}
          disabled={isLoading}
          className="flex items-center gap-2 rounded-2xl bg-slate-900 px-6 py-3.5 text-sm font-black text-white hover:bg-black transition-all shadow-lg shadow-slate-200 active:scale-95 disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Làm mới
        </button>
      </div>

      {isLoading && !data ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1,2,3,4].map(i => (
            <div key={i} className="h-32 rounded-[32px] bg-slate-100 animate-pulse" />
          ))}
        </div>
      ) : data && (
        <>
          {/* Main Config Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            <ConfigCard 
              title="Database" 
              status={data.dbConnected} 
              icon={Database} 
              description="Kết nối cơ sở dữ liệu chính."
            />
            <ConfigCard 
              title="PayOS Gateway" 
              status={data.config.payos} 
              icon={CreditCard} 
              description="Thanh toán trực tuyến."
            />
            <ConfigCard 
              title="Resend Email" 
              status={data.config.resend} 
              icon={Mail} 
              description="Dịch vụ gửi thông báo."
            />
            <ConfigCard 
              title="Google Auth" 
              status={data.config.googleOAuth} 
              icon={Globe} 
              description="Đăng nhập mạng xã hội."
            />
            <ConfigCard 
              title="Key Encryption" 
              status={data.config.encryptionSecret} 
              icon={ShieldCheck} 
              description="Mã hóa API Key bảo mật."
            />
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-slate-900 rounded-[40px] p-8 text-white shadow-2xl flex items-center justify-between overflow-hidden relative group">
               <div className="relative z-10">
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Active Providers</p>
                  <p className="text-5xl font-black">{data.stats.activeProviders}</p>
                  <div className="mt-6 flex items-center gap-2 text-emerald-400 font-bold text-xs">
                     <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                     Sẵn sàng điều phối
                  </div>
               </div>
               <Cpu className="absolute -right-6 -bottom-6 h-32 w-32 text-white/5 rotate-12 transition-transform group-hover:scale-110 duration-500" />
            </div>

            <div className="bg-emerald-600 rounded-[40px] p-8 text-white shadow-2xl flex items-center justify-between overflow-hidden relative group">
               <div className="relative z-10">
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-emerald-100/60 mb-2">Active Models</p>
                  <p className="text-5xl font-black">{data.stats.activeModels}</p>
                  <div className="mt-6 flex items-center gap-2 text-white font-bold text-xs">
                     <CheckCircle2 className="h-4 w-4" />
                     Hỗ trợ Gateway
                  </div>
               </div>
               <Zap className="absolute -right-6 -bottom-6 h-32 w-32 text-white/10 -rotate-12 transition-transform group-hover:scale-110 duration-500" />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Orders (Webhook indicators) */}
            <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
               <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-900">
                        <CreditCard className="h-5 w-5" />
                     </div>
                     <div>
                        <h3 className="text-lg font-black text-slate-900 tracking-tight">Thanh toán gần đây</h3>
                        <p className="text-xs font-bold text-slate-400">Giao dịch đã xác nhận qua Webhook.</p>
                     </div>
                  </div>
               </div>
               <div className="flex-1 divide-y divide-slate-50">
                  {data.recentOrders.length === 0 ? (
                    <div className="p-12 text-center text-slate-400 font-bold italic">Chưa có giao dịch gần đây.</div>
                  ) : data.recentOrders.map((order) => (
                    <div key={order.id} className="p-6 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                          <CheckCircle2 className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-900">{order.user.name || 'User'}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{order.product.name}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-black text-slate-900">+{order.amountVnd.toLocaleString('vi-VN')}đ</p>
                        <p className="text-[10px] font-bold text-slate-400">
                          {format(new Date(order.updatedAt), "HH:mm dd/MM", { locale: vi })}
                        </p>
                      </div>
                    </div>
                  ))}
               </div>
            </div>

            {/* Recent API Usage */}
            <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
               <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-900">
                        <Layers className="h-5 w-5" />
                     </div>
                     <div>
                        <h3 className="text-lg font-black text-slate-900 tracking-tight">Sử dụng API gần nhất</h3>
                        <p className="text-xs font-bold text-slate-400">Lịch sử lượt gọi model thực tế qua Gateway.</p>
                     </div>
                  </div>
               </div>
               <div className="flex-1 divide-y divide-slate-50">
                  {data.recentUsage.length === 0 ? (
                    <div className="p-12 text-center text-slate-400 font-bold italic">Chưa có lượt sử dụng nào.</div>
                  ) : data.recentUsage.map((log) => (
                    <div key={log.id} className="p-6 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-slate-900 flex items-center justify-center text-white">
                          <Zap className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-900">{log.model}</p>
                          <p className="text-[10px] font-bold text-slate-400">{log.user.email}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`inline-flex rounded-lg px-2 py-0.5 text-[9px] font-black uppercase tracking-widest mb-1 ${log.status === 'SUCCESS' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                          {log.status}
                        </span>
                        <p className="text-[10px] font-bold text-slate-400">
                          {format(new Date(log.createdAt), "HH:mm:ss", { locale: vi })}
                        </p>
                      </div>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        </>
      )}

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
