import { ApiDocsPageSkeleton } from "@/components/dashboard/api-docs/api-docs-page-skeleton";

export default function Loading() {
  return (
    <main className="space-y-8 lg:space-y-10" aria-busy="true">
      <ApiDocsPageSkeleton />
    </main>
  );
}
