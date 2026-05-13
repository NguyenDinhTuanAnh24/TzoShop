import { SettingsPageSkeleton } from "@/components/dashboard/settings/settings-page-skeleton";

export default function Loading() {
  return (
    <main className="space-y-8 lg:space-y-10" aria-busy="true">
      <SettingsPageSkeleton />
    </main>
  );
}
