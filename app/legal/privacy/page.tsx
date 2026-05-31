import Link from "next/link";
import { Shield } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-bg-primary text-text-primary py-24 px-6 sm:px-12">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-text-secondary hover:text-accent transition mb-8 text-sm font-semibold">
          ← Back to Home
        </Link>
        
        <div className="flex items-center gap-4 mb-12">
          <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center text-accent">
            <Shield className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tight text-[#f4f4f1]">Privacy Policy</h1>
            <p className="text-text-muted mt-2 text-sm">Last updated: May 2026</p>
          </div>
        </div>

        <div className="space-y-12 text-text-secondary leading-relaxed text-sm">
          <section>
            <h2 className="text-xl font-bold text-text-primary mb-4">1. Information We Collect</h2>
            <p className="mb-4">
              At Orbit, we collect information that you provide directly to us when you register for an account, 
              configure your workspace, or communicate with our support team. This includes your name, email address, 
              and authentication credentials.
            </p>
            <p>
              When you install the Orbit SDK in your applications, we automatically collect telemetry data, 
              stack traces, environment variables (excluding secrets), and performance metrics to provide you with 
              our observability services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-text-primary mb-4">2. How We Use Your Information</h2>
            <p className="mb-4">We use the information we collect to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide, maintain, and improve our services.</li>
              <li>Analyze application crashes and generate AI-driven remediation patches.</li>
              <li>Send you technical notices, updates, and security alerts.</li>
              <li>Monitor metrics to detect anomalies in your application infrastructure.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-text-primary mb-4">3. Data Security & Storage</h2>
            <p className="mb-4">
              Orbit implements enterprise-grade security measures to protect your data. All telemetry and 
              stack trace data is encrypted in transit using TLS 1.3 and at rest using AES-256. 
              Our Self-Healing Engine operates strictly within the permissions you grant and does not 
              persist your source code beyond the generation of the Git patch.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-text-primary mb-4">4. Sharing of Information</h2>
            <p className="mb-4">
              We do not sell your personal information or application telemetry data. We may share data with 
              third-party vendors (such as cloud hosting providers and AI API providers like Anthropic) solely 
              for the purpose of operating the Orbit platform. All third parties are bound by strict confidentiality 
              agreements.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-text-primary mb-4">5. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy or our data practices, please contact our Data 
              Protection Officer at <strong>privacy@orbit.dev</strong>.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
