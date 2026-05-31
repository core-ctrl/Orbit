import Link from "next/link";
import { FileText } from "lucide-react";

export default function TermsOfService() {
  return (
    <main className="min-h-screen bg-bg-primary text-text-primary py-24 px-6 sm:px-12">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-text-secondary hover:text-accent transition mb-8 text-sm font-semibold">
          ← Back to Home
        </Link>
        
        <div className="flex items-center gap-4 mb-12">
          <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center text-accent">
            <FileText className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tight text-[#f4f4f1]">Terms of Service</h1>
            <p className="text-text-muted mt-2 text-sm">Last updated: May 2026</p>
          </div>
        </div>

        <div className="space-y-12 text-text-secondary leading-relaxed text-sm">
          <section>
            <h2 className="text-xl font-bold text-text-primary mb-4">1. Acceptance of Terms</h2>
            <p className="mb-4">
              By accessing or using the Orbit platform ("Service"), you agree to be bound by these Terms of Service. 
              If you do not agree to all the terms and conditions, you may not access the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-text-primary mb-4">2. Description of Service</h2>
            <p className="mb-4">
              Orbit provides application monitoring, observability, and AI-driven automated remediation tools. 
              The Service includes the Orbit Dashboard, SDKs, APIs, and the AI Self-Healing Engine. We reserve 
              the right to modify or discontinue the Service with or without notice.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-text-primary mb-4">3. Account Responsibilities</h2>
            <p className="mb-4">
              You are responsible for maintaining the security of your account and API keys. You are fully 
              responsible for all activities that occur under the account and any other actions taken in connection 
              with it. You must immediately notify Orbit of any unauthorized uses of your account.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-text-primary mb-4">4. AI Self-Healing & API Access</h2>
            <p className="mb-4">
              By enabling the AI Self-Healing feature, you grant Orbit temporary permission to analyze stack 
              traces and propose Git patches via pull requests to your authorized repositories. Orbit does not 
              guarantee the accuracy, reliability, or safety of the generated code. You are solely responsible for 
              reviewing, testing, and merging any AI-generated pull requests into your codebase.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-text-primary mb-4">5. Limitation of Liability</h2>
            <p className="mb-4">
              In no event shall Orbit, its directors, employees, or agents, be liable for any indirect, incidental, 
              special, consequential or punitive damages, including without limitation, loss of profits, data, use, 
              goodwill, or other intangible losses, resulting from your access to or use of or inability to access 
              or use the Service.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
