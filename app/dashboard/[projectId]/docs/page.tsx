export default function DocsPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-text-primary">Documentation</h1>
        <p className="text-text-secondary text-sm mt-1">Everything you need to integrate Orbit into your stack.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <a href="#" className="p-6 bg-card border border-border rounded-xl hover:bg-hover transition-colors block">
          <h3 className="text-lg font-medium text-text-primary mb-2">Next.js Quickstart</h3>
          <p className="text-sm text-text-secondary">Install the @orbit/nextjs SDK and start tracking React errors in minutes.</p>
        </a>
        <a href="#" className="p-6 bg-card border border-border rounded-xl hover:bg-hover transition-colors block">
          <h3 className="text-lg font-medium text-text-primary mb-2">Python & Django</h3>
          <p className="text-sm text-text-secondary">Track unhandled exceptions and performance metrics across your Python backend.</p>
        </a>
        <a href="#" className="p-6 bg-card border border-border rounded-xl hover:bg-hover transition-colors block">
          <h3 className="text-lg font-medium text-text-primary mb-2">Infrastructure Agent</h3>
          <p className="text-sm text-text-secondary">Deploy the Orbit daemon to monitor CPU, memory, and disk usage automatically.</p>
        </a>
        <a href="#" className="p-6 bg-card border border-border rounded-xl hover:bg-hover transition-colors block">
          <h3 className="text-lg font-medium text-text-primary mb-2">API Reference</h3>
          <p className="text-sm text-text-secondary">Send custom events, manage alerts, and fetch metrics via our REST API.</p>
        </a>
      </div>
    </div>
  );
}
