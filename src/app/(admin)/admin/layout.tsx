import AdminSidebar from "@/components/admin/admin-sidebar";
import { AdminMobileNav } from "@/components/admin/admin-mobile-nav";
import AdminTopbar from "@/components/admin/admin-topbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Desktop Sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-[280px] lg:block">
        <AdminSidebar />
      </aside>

      {/* Main Container */}
      <div className="flex flex-1 flex-col lg:pl-[280px]">
        {/* Topbar Desktop */}
        <div className="hidden lg:block sticky top-0 z-30">
          <AdminTopbar />
        </div>

        {/* Topbar Mobile */}
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 lg:hidden">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600">
              <span className="text-sm font-black text-white">TZ</span>
            </div>
            <span className="font-black text-slate-900 tracking-tight">Admin</span>
          </div>
          <AdminMobileNav />
        </header>

        {/* Content Area */}
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <div className="mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
