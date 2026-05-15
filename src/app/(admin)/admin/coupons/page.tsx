"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { Plus, Search, TicketPercent } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { ToastMessage } from "@/components/ui/toast-message";
import { useConfirm } from "@/hooks/use-confirm";
import { ConfirmDialog } from "@/components/ui/confirm-toast";
import { Modal } from "@/components/ui/modal";
import { Skeleton } from "@/components/ui/skeleton";
import { CosmicButton } from "@/components/ui/cosmic-button";
import { TextFadeInUp } from "@/components/animations/text-fade-in-up";

type Coupon = {
  id: string;
  code: string;
  name: string;
  description: string | null;
  discountPercent: number;
  minOrderAmount: number;
  maxDiscountVnd: number | null;
  startsAt: string | null;
  endsAt: string | null;
  isActive: boolean;
  scope: "GLOBAL" | "ASSIGNED";
  usageLimitTotal: number | null;
  usageLimitPerUser: number;
  _count: {
    assignments: number;
    redemptions: number;
  };
};

type SimpleUser = {
  id: string;
  email: string;
  name: string | null;
};

type StatusFilter = "ALL" | "ACTIVE" | "PAUSED" | "EXPIRING" | "EXPIRED";
type TypeFilter = "ALL" | "PERCENT";
type ScopeFilter = "ALL" | "GLOBAL" | "ASSIGNED";
type SortFilter = "NEWEST" | "EXPIRING_SOON" | "MOST_USED" | "HIGH_VALUE";
type AudienceType = "ALL_USERS" | "SPECIFIC_USERS" | "USER_GROUP";
type UserGroup = "NEW_USERS" | "PURCHASED_USERS" | "NEVER_PURCHASED" | "ACTIVE_PLAN" | "LOW_CREDITS";

function formatVnd(val: number) {
  return `${new Intl.NumberFormat("vi-VN").format(val)}đ`;
}

function getStatus(coupon: Coupon) {
  const now = new Date();
  const endsAt = coupon.endsAt ? new Date(coupon.endsAt) : null;
  const daysToEnd = endsAt ? (endsAt.getTime() - now.getTime()) / (24 * 60 * 60 * 1000) : null;

  if (!coupon.isActive) return { label: "Tạm dừng", className: "border-slate-200 bg-slate-100 text-slate-600" };
  if (endsAt && endsAt < now) return { label: "Hết hạn", className: "border-rose-100 bg-rose-50 text-rose-700" };
  if (coupon.usageLimitTotal !== null && coupon._count.redemptions >= coupon.usageLimitTotal) {
    return { label: "Đã dùng hết lượt", className: "border-violet-100 bg-violet-50 text-violet-700" };
  }
  if (daysToEnd !== null && daysToEnd <= 7) return { label: "Sắp hết hạn", className: "border-amber-100 bg-amber-50 text-amber-700" };
  return { label: "Đang hoạt động", className: "border-emerald-100 bg-emerald-50 text-emerald-700" };
}

function CouponsSkeleton() {
  return (
    <div className="space-y-6" aria-hidden="true">
      <section className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-[0_24px_80px_-28px_rgba(79,70,229,0.25)] sm:p-8">
        <Skeleton className="h-5 w-32 rounded-full" />
        <Skeleton className="mt-4 h-10 w-56 rounded-xl" />
        <Skeleton className="mt-3 h-5 w-[620px] max-w-full rounded-full" />
      </section>
      <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <Skeleton className="h-10 w-10 rounded-2xl" />
            <Skeleton className="mt-5 h-4 w-24 rounded-full" />
            <Skeleton className="mt-3 h-8 w-24 rounded-xl" />
          </div>
        ))}
      </section>
      <section className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
        <Skeleton className="h-11 w-full rounded-xl" />
      </section>
    </div>
  );
}

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("ALL");
  const [scopeFilter, setScopeFilter] = useState<ScopeFilter>("ALL");
  const [sortBy, setSortBy] = useState<SortFilter>("NEWEST");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    description: "",
    discountPercent: "10",
    minOrderAmount: "0",
    maxDiscountVnd: "0",
    startsAt: "",
    endsAt: "",
    isActive: true,
    scope: "GLOBAL" as "GLOBAL" | "ASSIGNED",
    audienceType: "ALL_USERS" as AudienceType,
    userGroup: "" as UserGroup | "",
    usageLimitTotal: "0",
    usageLimitPerUser: "1",
    userIds: [] as string[],
  });
  const [userSearch, setUserSearch] = useState("");
  const [foundUsers, setFoundUsers] = useState<SimpleUser[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<SimpleUser[]>([]);
  const [isSearchingUsers, setIsSearchingUsers] = useState(false);

  const { toast, showToast, clearToast } = useToast(3000);
  const { confirmState, isConfirming, askConfirm, closeConfirm, handleConfirm } = useConfirm();

  const fetchCoupons = useCallback(async () => {
    try {
      setIsLoading(true);
      setLoadError(null);
      const res = await fetch("/api/admin/coupons", { cache: "no-store" });
      const result = await res.json();
      if (!res.ok || !result.success) throw new Error();
      setCoupons(result.data || []);
    } catch {
      setLoadError("Vui lòng thử lại sau ít phút.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => void fetchCoupons(), 0);
    return () => window.clearTimeout(timer);
  }, [fetchCoupons]);

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.code.trim()) errors.code = "Mã giảm giá là bắt buộc";
    if (!formData.name.trim()) errors.name = "Tên chương trình là bắt buộc";
    if (Number(formData.discountPercent) < 0) errors.discountPercent = "Giá trị giảm phải lớn hơn hoặc bằng 0";
    if (formData.startsAt && formData.endsAt && new Date(formData.endsAt) < new Date(formData.startsAt)) {
      errors.endsAt = "Ngày hết hạn phải sau ngày bắt đầu";
    }
    if (Number(formData.usageLimitPerUser) < 1) errors.usageLimitPerUser = "Số lượt dùng không hợp lệ";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleOpenModal = (coupon?: Coupon) => {
    setFormErrors({});
    if (coupon) {
      setEditingId(coupon.id);
      setFormData({
        code: coupon.code,
        name: coupon.name,
        description: coupon.description || "",
        discountPercent: coupon.discountPercent.toString(),
        minOrderAmount: coupon.minOrderAmount.toString(),
        maxDiscountVnd: (coupon.maxDiscountVnd || 0).toString(),
        startsAt: coupon.startsAt ? format(new Date(coupon.startsAt), "yyyy-MM-dd") : "",
        endsAt: coupon.endsAt ? format(new Date(coupon.endsAt), "yyyy-MM-dd") : "",
        isActive: coupon.isActive,
        scope: coupon.scope,
        audienceType: coupon.scope === "ASSIGNED" ? "SPECIFIC_USERS" : "ALL_USERS",
        userGroup: "",
        usageLimitTotal: (coupon.usageLimitTotal || 0).toString(),
        usageLimitPerUser: coupon.usageLimitPerUser.toString(),
        userIds: [],
      });
    } else {
      setEditingId(null);
      setFormData({
        code: "",
        name: "",
        description: "",
        discountPercent: "10",
        minOrderAmount: "0",
        maxDiscountVnd: "0",
        startsAt: "",
        endsAt: "",
        isActive: true,
        scope: "GLOBAL",
        audienceType: "ALL_USERS",
        userGroup: "",
        usageLimitTotal: "0",
        usageLimitPerUser: "1",
        userIds: [],
      });
    }
    setUserSearch("");
    setFoundUsers([]);
    setSelectedUsers([]);
    setIsModalOpen(true);
  };

  const handleSearchUsers = async () => {
    if (!userSearch || userSearch.length < 2) return;
    try {
      setIsSearchingUsers(true);
      const res = await fetch(`/api/admin/users?search=${userSearch}&limit=10`);
      const result = await res.json();
      if (result.success) {
        setFoundUsers((result.data || []).filter((u: SimpleUser) => !formData.userIds.includes(u.id)));
      }
    } finally {
      setIsSearchingUsers(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (formData.audienceType === "SPECIFIC_USERS" && selectedUsers.length === 0) {
      showToast("Vui lòng chọn ít nhất một người dùng.", "error");
      return;
    }
    if (formData.audienceType === "USER_GROUP") {
      showToast("Tính năng nhóm người dùng sẽ được cấu hình sau.", "info");
      return;
    }

    try {
      setIsSubmitting(true);
      const url = editingId ? `/api/admin/coupons/${editingId}` : "/api/admin/coupons";
      const method = editingId ? "PATCH" : "POST";
      const payload = {
        code: formData.code.trim(),
        name: formData.name.trim(),
        description: formData.description.trim() || null,
        discountPercent: Number(formData.discountPercent || 0),
        minOrderAmount: Number(formData.minOrderAmount || 0),
        maxDiscountVnd: Number(formData.maxDiscountVnd) || null,
        startsAt: formData.startsAt ? new Date(formData.startsAt).toISOString() : null,
        endsAt: formData.endsAt ? new Date(formData.endsAt).toISOString() : null,
        isActive: formData.isActive,
        scope: formData.audienceType === "SPECIFIC_USERS" ? "ASSIGNED" : "GLOBAL",
        usageLimitTotal: Number(formData.usageLimitTotal) || null,
        usageLimitPerUser: Number(formData.usageLimitPerUser || 1),
        userIds: formData.audienceType === "SPECIFIC_USERS" ? selectedUsers.map((u) => u.id) : undefined,
      };
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const result = await res.json();
      if (res.ok && result.success) {
        showToast(editingId ? "Đã lưu mã giảm giá" : "Đã tạo mã giảm giá", "success");
        setIsModalOpen(false);
        void fetchCoupons();
      } else {
        showToast(result?.error?.message || "Không thể lưu mã giảm giá", "error");
      }
    } catch {
      showToast("Không thể lưu mã giảm giá", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleActive = (coupon: Coupon) => {
    const willActivate = !coupon.isActive;
    askConfirm({
      title: willActivate ? "Kích hoạt mã giảm giá?" : "Tạm dừng mã giảm giá?",
      description: willActivate
        ? "Mã này sẽ có thể được người dùng áp dụng nếu còn trong thời hạn và đủ điều kiện."
        : "Người dùng sẽ không thể áp dụng mã này cho đơn hàng mới cho đến khi được kích hoạt lại.",
      confirmLabel: willActivate ? "Kích hoạt" : "Tạm dừng mã",
      type: willActivate ? "primary" : "warning",
      onConfirm: async () => {
        const res = await fetch(`/api/admin/coupons/${coupon.id}/toggle`, { method: "PATCH" });
        if (res.ok) {
          showToast(willActivate ? "Đã kích hoạt mã giảm giá" : "Đã tạm dừng mã giảm giá", "success");
          void fetchCoupons();
        } else showToast("Không thể lưu mã giảm giá", "error");
      },
    });
  };

  const filteredCoupons = useMemo(() => {
    const now = new Date();
    const list = coupons
      .filter((c) => {
        const kw = search.trim().toLowerCase();
        if (!kw) return true;
        return (
          c.code.toLowerCase().includes(kw) ||
          c.name.toLowerCase().includes(kw) ||
          (c.description || "").toLowerCase().includes(kw)
        );
      })
      .filter((c) => (scopeFilter === "ALL" ? true : c.scope === scopeFilter))
      .filter(() => {
        if (typeFilter === "ALL") return true;
        return typeFilter === "PERCENT";
      })
      .filter((c) => {
        const status = getStatus(c).label;
        if (statusFilter === "ALL") return true;
        if (statusFilter === "ACTIVE") return status === "Đang hoạt động";
        if (statusFilter === "PAUSED") return status === "Tạm dừng";
        if (statusFilter === "EXPIRING") return status === "Sắp hết hạn";
        return status === "Hết hạn";
      });

    if (sortBy === "EXPIRING_SOON") {
      return [...list].sort((a, b) => (new Date(a.endsAt || "2999-12-31").getTime() - new Date(b.endsAt || "2999-12-31").getTime()));
    }
    if (sortBy === "MOST_USED") return [...list].sort((a, b) => b._count.redemptions - a._count.redemptions);
    if (sortBy === "HIGH_VALUE") return [...list].sort((a, b) => b.discountPercent - a.discountPercent);
    return [...list].sort((a, b) => +new Date(b.startsAt || now) - +new Date(a.startsAt || now));
  }, [coupons, search, scopeFilter, typeFilter, statusFilter, sortBy]);

  const summary = useMemo(() => {
    const total = coupons.length;
    const active = coupons.filter((c) => getStatus(c).label === "Đang hoạt động").length;
    const used = coupons.reduce((acc, c) => acc + c._count.redemptions, 0);
    const expiring = coupons.filter((c) => getStatus(c).label === "Sắp hết hạn").length;
    return { total, active, used, expiring };
  }, [coupons]);

  if (isLoading && !coupons.length) return <CouponsSkeleton />;

  if (loadError && !coupons.length) {
    return (
      <section className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
        <h2 className="text-2xl font-extrabold text-slate-950">Không thể tải danh sách mã giảm giá</h2>
        <p className="mt-2 text-sm text-slate-600">{loadError}</p>
        <button type="button" onClick={() => void fetchCoupons()} className="mt-6 inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700">Thử lại</button>
      </section>
    );
  }

  return (
    <div className="space-y-6 overflow-hidden rounded-3xl bg-gradient-to-br from-slate-50 via-white to-indigo-50/40 p-1">
      <TextFadeInUp as="section" className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-[0_24px_80px_-28px_rgba(79,70,229,0.25)] sm:p-8">
        <div className="pointer-events-none absolute right-0 top-0 h-44 w-44 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-1/3 h-32 w-32 rounded-full bg-violet-500/10 blur-3xl" />
        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <span className="inline-flex rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-indigo-700">Quản trị ưu đãi</span>
            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">Mã giảm giá</h1>
            <p className="mt-2 max-w-2xl text-base leading-7 text-slate-600">Tạo và quản lý mã ưu đãi, điều kiện áp dụng, thời hạn và hiệu quả sử dụng trong TzoShop.</p>
          </div>
          <div className="flex flex-wrap gap-3 lg:justify-end">
            <CosmicButton onClick={() => handleOpenModal()}><Plus className="h-4 w-4" />Thêm mã giảm giá</CosmicButton>
          </div>
        </div>
      </TextFadeInUp>

      <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Tổng mã giảm giá", value: summary.total, desc: "Tổng chương trình ưu đãi", cls: "bg-indigo-50 text-indigo-700" },
          { label: "Đang hoạt động", value: summary.active, desc: "Mã có thể áp dụng", cls: "bg-emerald-50 text-emerald-700" },
          { label: "Đã sử dụng", value: summary.used, desc: "Tổng lượt áp mã", cls: "bg-violet-50 text-violet-700" },
          { label: "Sắp hết hạn", value: summary.expiring, desc: "Cần kiểm tra sớm", cls: "bg-amber-50 text-amber-700" },
        ].map((card, i) => (
          <TextFadeInUp key={card.label} delay={Math.min(i * 0.05, 0.25)} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-indigo-200">
            <div className={cn("flex h-11 w-11 items-center justify-center rounded-2xl", card.cls)}><TicketPercent className="h-5 w-5" /></div>
            <p className="mt-5 text-xs font-bold uppercase tracking-wide text-slate-500">{card.label}</p>
            <p className="mt-3 text-2xl font-extrabold text-slate-950">{card.value.toLocaleString("vi-VN")}</p>
            <p className="mt-2 text-sm text-slate-600">{card.desc}</p>
          </TextFadeInUp>
        ))}
      </section>

      <TextFadeInUp as="section" delay={0.05} className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-5">
          <div className="relative lg:col-span-2"><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Tìm theo mã, tên chương trình hoặc mô tả..." className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-950 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20" /></div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as StatusFilter)} className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-950"><option value="ALL">Tất cả</option><option value="ACTIVE">Đang hoạt động</option><option value="PAUSED">Tạm dừng</option><option value="EXPIRING">Sắp hết hạn</option><option value="EXPIRED">Hết hạn</option></select>
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as TypeFilter)} className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-950"><option value="ALL">Tất cả loại giảm</option><option value="PERCENT">Phần trăm</option></select>
          <div className="grid grid-cols-2 gap-3"><select value={scopeFilter} onChange={(e) => setScopeFilter(e.target.value as ScopeFilter)} className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-950"><option value="ALL">Tất cả</option><option value="GLOBAL">Toàn bộ gói</option><option value="ASSIGNED">Theo gói cụ thể</option></select><select value={sortBy} onChange={(e) => setSortBy(e.target.value as SortFilter)} className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-950"><option value="NEWEST">Mới nhất</option><option value="EXPIRING_SOON">Sắp hết hạn</option><option value="MOST_USED">Lượt dùng nhiều</option><option value="HIGH_VALUE">Giá trị giảm cao</option></select></div>
        </div>
      </TextFadeInUp>

      {filteredCoupons.length === 0 ? (
        <section className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600"><TicketPercent className="h-7 w-7" /></div>
          <h2 className="text-2xl font-extrabold text-slate-950">Chưa có mã giảm giá</h2>
          <p className="mt-2 text-sm text-slate-600">Tạo mã ưu đãi đầu tiên để hỗ trợ chương trình khuyến mãi hoặc chăm sóc khách hàng.</p>
          <div className="mt-6 flex justify-center"><CosmicButton onClick={() => handleOpenModal()}><Plus className="h-4 w-4" />Thêm mã giảm giá</CosmicButton></div>
        </section>
      ) : (
        <section className="grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3">
          {filteredCoupons.map((coupon, i) => {
            const status = getStatus(coupon);
            const max = coupon.usageLimitTotal;
            const used = coupon._count.redemptions;
            const usagePercent = max && max > 0 ? Math.min(100, Math.round((used / max) * 100)) : 0;
            const barClass = max && used >= max ? "from-slate-500 to-slate-600" : usagePercent >= 80 ? "from-amber-500 to-orange-500" : "from-indigo-600 to-violet-600";
            return (
              <TextFadeInUp key={coupon.id} delay={Math.min(i * 0.04, 0.25)} as="article" className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:border-indigo-200 hover:shadow-[0_18px_45px_-22px_rgba(79,70,229,0.30)]">
                <div className="flex items-start justify-between gap-3">
                  <p className="break-all text-xl font-extrabold text-slate-950">{coupon.code}</p>
                  <span className={cn("inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold", status.className)}>{status.label}</span>
                </div>
                <p className="mt-2 text-sm font-semibold text-slate-900">{coupon.name}</p>
                {coupon.description ? <p className="mt-1 line-clamp-2 text-sm text-slate-600">{coupon.description}</p> : null}

                <div className="mt-4">
                  <p className="text-3xl font-extrabold text-slate-950">{coupon.discountPercent}%</p>
                  <p className="text-xs text-slate-500">Giảm theo phần trăm</p>
                </div>

                <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50/70 p-4 text-sm text-slate-700">
                  <p><span className="font-semibold text-slate-900">Điều kiện áp dụng:</span> Tối thiểu {formatVnd(coupon.minOrderAmount)}</p>
                  <p className="mt-1"><span className="font-semibold text-slate-900">Giảm tối đa:</span> {coupon.maxDiscountVnd == null ? "Không giới hạn" : formatVnd(coupon.maxDiscountVnd)}</p>
                  <p className="mt-1"><span className="font-semibold text-slate-900">Phạm vi áp dụng:</span> {coupon.scope === "GLOBAL" ? "Toàn bộ gói" : "Theo gói cụ thể"}</p>
                </div>

                <div className="mt-4 text-sm text-slate-700">
                  <p>Bắt đầu: <span className="font-semibold text-slate-900">{coupon.startsAt ? format(new Date(coupon.startsAt), "dd/MM/yyyy") : "Không giới hạn"}</span></p>
                  <p className="mt-1">Hết hạn: <span className="font-semibold text-slate-900">{coupon.endsAt ? format(new Date(coupon.endsAt), "dd/MM/yyyy") : "Không giới hạn"}</span></p>
                </div>

                <div className="mt-4">
                  {max ? (
                    <>
                      <p className="text-sm text-slate-700">Đã dùng {used}/{max} lượt</p>
                      <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-slate-100">
                        <div className={cn("h-full rounded-full bg-gradient-to-r transition-all duration-300", barClass)} style={{ width: `${usagePercent}%` }} />
                      </div>
                    </>
                  ) : (
                    <span className="inline-flex rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">Không giới hạn lượt</span>
                  )}
                </div>

                <div className="mt-5 grid grid-cols-[1fr_auto] gap-3">
                  <button type="button" onClick={() => handleOpenModal(coupon)} className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700">Sửa</button>
                  <button type="button" onClick={() => handleToggleActive(coupon)} className={cn("inline-flex h-11 items-center justify-center rounded-xl border px-4 text-sm font-semibold transition", coupon.isActive ? "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100" : "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100")}>{coupon.isActive ? "Tạm dừng" : "Kích hoạt"}</button>
                </div>
              </TextFadeInUp>
            );
          })}
        </section>
      )}

      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? "Cập nhật mã giảm giá" : "Thêm mã giảm giá"}
        description="Thiết lập điều kiện áp dụng, phạm vi, thời hạn và giới hạn sử dụng."
        maxWidthClassName="max-w-4xl"
        footer={
          <>
            <button type="button" onClick={() => setIsModalOpen(false)} className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">Hủy</button>
            <button type="submit" form="coupon-form" disabled={isSubmitting} className="inline-flex h-11 items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 text-sm font-semibold text-white transition active:scale-[0.98] disabled:opacity-60">{isSubmitting ? "Đang lưu..." : "Lưu mã giảm giá"}</button>
          </>
        }
      >
        <form id="coupon-form" onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field label="Mã giảm giá" error={formErrors.code}><input value={formData.code} onChange={(e) => setFormData((f) => ({ ...f, code: e.target.value.toUpperCase() }))} className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-950" /></Field>
            <Field label="Tên chương trình" error={formErrors.name}><input value={formData.name} onChange={(e) => setFormData((f) => ({ ...f, name: e.target.value }))} className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-950" /></Field>
            <Field label="Mô tả" className="md:col-span-2"><textarea value={formData.description} onChange={(e) => setFormData((f) => ({ ...f, description: e.target.value }))} className="min-h-28 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950" /></Field>
            <Field label="Loại giảm"><select value="PERCENT" disabled className="h-12 w-full rounded-xl border border-slate-200 bg-slate-100 px-4 text-sm text-slate-500"><option>Phần trăm</option></select></Field>
            <Field label="Giá trị giảm (%)" error={formErrors.discountPercent}><input type="number" min={0} max={100} value={formData.discountPercent} onChange={(e) => setFormData((f) => ({ ...f, discountPercent: e.target.value }))} className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-950" /></Field>
            <Field label="Giảm tối đa"><input type="number" min={0} value={formData.maxDiscountVnd} onChange={(e) => setFormData((f) => ({ ...f, maxDiscountVnd: e.target.value }))} className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-950" /></Field>
            <Field label="Đơn tối thiểu"><input type="number" min={0} value={formData.minOrderAmount} onChange={(e) => setFormData((f) => ({ ...f, minOrderAmount: e.target.value }))} className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-950" /></Field>
            <Field label="Ngày bắt đầu"><input type="date" value={formData.startsAt} onChange={(e) => setFormData((f) => ({ ...f, startsAt: e.target.value }))} className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-950" /></Field>
            <Field label="Ngày hết hạn" error={formErrors.endsAt}><input type="date" value={formData.endsAt} onChange={(e) => setFormData((f) => ({ ...f, endsAt: e.target.value }))} className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-950" /></Field>
            <Field label="Tổng lượt dùng tối đa"><input type="number" min={0} value={formData.usageLimitTotal} onChange={(e) => setFormData((f) => ({ ...f, usageLimitTotal: e.target.value }))} className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-950" /></Field>
            <Field label="Lượt dùng mỗi user" error={formErrors.usageLimitPerUser}><input type="number" min={1} value={formData.usageLimitPerUser} onChange={(e) => setFormData((f) => ({ ...f, usageLimitPerUser: e.target.value }))} className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-950" /></Field>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Đối tượng áp dụng</p>
            <div className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-3">
              <button type="button" onClick={() => { setFormData((f) => ({ ...f, audienceType: "ALL_USERS", scope: "GLOBAL", userIds: [] })); setSelectedUsers([]); }} className={cn("rounded-xl border border-slate-200 bg-white px-4 py-3 text-left text-sm font-semibold", formData.audienceType === "ALL_USERS" ? "border-indigo-200 bg-indigo-50 text-indigo-700" : "text-slate-700 hover:border-indigo-200 hover:bg-indigo-50/50")}><p>Tất cả người dùng</p><p className="mt-1 text-xs font-normal">Mọi tài khoản đều có thể sử dụng mã nếu đủ điều kiện.</p></button>
              <button type="button" onClick={() => setFormData((f) => ({ ...f, audienceType: "SPECIFIC_USERS", scope: "ASSIGNED" }))} className={cn("rounded-xl border border-slate-200 bg-white px-4 py-3 text-left text-sm font-semibold", formData.audienceType === "SPECIFIC_USERS" ? "border-indigo-200 bg-indigo-50 text-indigo-700" : "text-slate-700 hover:border-indigo-200 hover:bg-indigo-50/50")}><p>Người dùng cụ thể</p><p className="mt-1 text-xs font-normal">Chỉ các tài khoản được chọn mới có thể sử dụng mã.</p></button>
              <button type="button" onClick={() => setFormData((f) => ({ ...f, audienceType: "USER_GROUP", scope: "GLOBAL", userIds: [] }))} className={cn("rounded-xl border border-slate-200 bg-white px-4 py-3 text-left text-sm font-semibold", formData.audienceType === "USER_GROUP" ? "border-indigo-200 bg-indigo-50 text-indigo-700" : "text-slate-700 hover:border-indigo-200 hover:bg-indigo-50/50")}><p>Nhóm người dùng</p><p className="mt-1 text-xs font-normal">Áp dụng cho nhóm khách hàng theo điều kiện như người dùng mới, khách đã mua hàng hoặc admin chọn.</p></button>
            </div>

            {formData.audienceType === "SPECIFIC_USERS" ? (
              <div className="mt-4 space-y-3">
                <div className="flex gap-2">
                  <input value={userSearch} onChange={(e) => setUserSearch(e.target.value)} placeholder="Tìm theo tên hoặc email người dùng..." className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-950" />
                  <button type="button" onClick={handleSearchUsers} className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-indigo-50" disabled={isSearchingUsers}>{isSearchingUsers ? "Đang tìm..." : "Tìm"}</button>
                </div>
                {foundUsers.length ? (
                  <div className="space-y-2">
                    {foundUsers.map((u) => (
                      <div key={u.id} className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/70 p-2">
                        <span className="text-sm text-slate-700">{u.email}</span>
                        <button type="button" onClick={() => { setFormData((f) => ({ ...f, userIds: [...f.userIds, u.id] })); setSelectedUsers((prev) => prev.some((x) => x.id === u.id) ? prev : [...prev, u]); }} className="rounded-lg border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-indigo-50">Thêm</button>
                      </div>
                    ))}
                  </div>
                ) : null}
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Người dùng đã chọn</p>
                <div className="flex flex-wrap gap-2">
                  {selectedUsers.map((user) => (
                    <button key={user.id} type="button" onClick={() => { setSelectedUsers((prev) => prev.filter((x) => x.id !== user.id)); setFormData((f) => ({ ...f, userIds: f.userIds.filter((x) => x !== user.id) })); }} className="max-w-full rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                      <span className="block max-w-[220px] truncate">{user.name || user.email}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
            {formData.audienceType === "USER_GROUP" ? (
              <div className="mt-4 space-y-3">
                <select
                  value={formData.userGroup}
                  onChange={(e) => setFormData((f) => ({ ...f, userGroup: e.target.value as UserGroup }))}
                  disabled
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-100 px-4 text-sm text-slate-500"
                >
                  <option value="">Chọn nhóm người dùng</option>
                  <option value="NEW_USERS">Người dùng mới</option>
                  <option value="PURCHASED_USERS">Người dùng đã từng mua hàng</option>
                  <option value="NEVER_PURCHASED">Người dùng chưa từng mua hàng</option>
                  <option value="ACTIVE_PLAN">Người dùng có gói đang hoạt động</option>
                  <option value="LOW_CREDITS">Người dùng sắp hết credits</option>
                </select>
                <p className="text-sm text-slate-600">Tính năng nhóm người dùng sẽ được cấu hình sau.</p>
              </div>
            ) : null}
          </div>
        </form>
      </Modal>

      {toast ? <ToastMessage message={toast.message} type={toast.type} onClose={clearToast} /> : null}
      {confirmState ? <ConfirmDialog open={Boolean(confirmState)} title={confirmState.title} description={confirmState.description} confirmLabel={confirmState.confirmLabel} cancelLabel={confirmState.cancelLabel} type={confirmState.type} isLoading={isConfirming} onConfirm={handleConfirm} onCancel={closeConfirm} /> : null}
    </div>
  );
}

function Field({ label, error, className, children }: { label: string; error?: string; className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("space-y-2", className)}>
      <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</label>
      {children}
      {error ? <p className="text-sm text-rose-600">{error}</p> : null}
    </div>
  );
}
