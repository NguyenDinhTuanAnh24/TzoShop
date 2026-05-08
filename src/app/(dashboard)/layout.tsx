import DashboardSidebar from "@/components/dashboard/dashboard-sidebar";
import DashboardTopbar from "@/components/dashboard/dashboard-topbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f7faf8]">
      <div className="flex min-h-screen">
        {/* Sidebar desktop cố định theo màn hình */}
        <aside className="sticky top-0 hidden h-dvh w-[280px] shrink-0 border-r border-black/5 bg-white lg:block">
          <DashboardSidebar />
        </aside>

        {/* Nội dung chính */}
        <div className="flex min-w-0 flex-1 flex-col">
          <DashboardTopbar />

          <main className="flex-1 px-4 py-5 lg:px-8 lg:py-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
