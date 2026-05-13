import { ApiKeysPageSkeleton } from "@/components/dashboard/api-keys/api-keys-page-skeleton";

export default function Loading() {
  return (
    <main className="space-y-8" aria-busy="true">
      <ApiKeysPageSkeleton />
    </main>
  );
}

