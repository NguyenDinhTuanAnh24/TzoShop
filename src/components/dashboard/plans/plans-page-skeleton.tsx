import {
  FilterBarSkeleton,
  PageHeaderSkeleton,
  PlanGridSkeleton,
} from "@/components/skeletons/dashboard-skeletons";

export function PlansPageSkeleton() {
  return (
    <div className="space-y-8" aria-hidden="true">
      <PageHeaderSkeleton />
      <FilterBarSkeleton />
      <PlanGridSkeleton count={6} />
    </div>
  );
}
