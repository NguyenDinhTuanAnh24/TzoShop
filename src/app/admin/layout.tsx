import AdminSidebar from "@/components/admin/admin-sidebar";
import { AdminMobileNav } from "@/components/admin/admin-mobile-nav";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#f8faf9]">
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 shrink-0 lg:block lg:fixed lg:inset-y-0">
        <AdminSidebar />
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col lg:pl-64">
        {/* Topbar Mobile */}
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-black/5 bg-white px-4 lg:hidden">
          <div className="font-black text-slate-900">Admin Panel</div>
          <AdminMobileNav />
        </header>

        <main className="flex-1 p-4 md:p-8 lg:p-10 max-w-[1600px]">
          {children}
        </main>
      </div>
    </div>
  );
}
