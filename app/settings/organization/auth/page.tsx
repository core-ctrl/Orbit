import { PageSkeleton } from "@/components/ui/loading-skeleton";

export default function PlaceholderPage() {
  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-text-primary mb-2">Authentication Settings</h1>
        <p className="text-sm text-text-secondary">This section is currently under construction for the Phase 3 MVP.</p>
      </div>
      
      <div className="p-12 border border-border rounded-xl bg-card flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 mb-4 rounded-full bg-secondary/50 flex items-center justify-center border border-border">
          <span className="text-2xl">🚧</span>
        </div>
        <h3 className="text-lg font-medium text-text-primary mb-2">Coming Soon</h3>
        <p className="text-sm text-text-muted max-w-md">
          Advanced authentication settings configurations will be available in the upcoming enterprise release. 
          Orbit is currently focused on the core self-healing and observability engines.
        </p>
      </div>
    </div>
  );
}
