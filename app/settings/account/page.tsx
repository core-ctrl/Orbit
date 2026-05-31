"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";

export default function AccountSettingsPage() {
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.me()
      .then(user => {
        setUserName(user.name);
        setUserEmail(user.email);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8 border-b border-[var(--glass-border)] pb-4">
        <h1 className="text-2xl font-semibold text-[var(--text-primary)]">Account Details</h1>
        <p className="text-[var(--text-secondary)] text-sm mt-1">Manage your personal account information and preferences.</p>
      </div>

      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="text-lg font-medium text-text-primary mb-4">Personal Information</h2>
        
        {loading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-10 bg-secondary rounded w-full max-w-sm"></div>
            <div className="h-10 bg-secondary rounded w-full max-w-sm"></div>
          </div>
        ) : (
          <form className="space-y-4 max-w-sm">
            <div>
              <label className="block text-sm text-text-secondary mb-1">Full Name</label>
              <input 
                type="text" 
                value={userName} 
                onChange={(e) => setUserName(e.target.value)}
                className="w-full bg-secondary border border-border rounded-lg px-4 py-2 text-text-primary outline-none focus:border-accent" 
                required
              />
            </div>
            <div>
              <label className="block text-sm text-text-secondary mb-1">Email Address</label>
              <input 
                type="email" 
                value={userEmail} 
                readOnly
                className="w-full bg-secondary/50 border border-border rounded-lg px-4 py-2 text-text-muted outline-none cursor-not-allowed" 
              />
              <p className="text-xs text-text-muted mt-1">Contact support to change your email address.</p>
            </div>
            
            <div className="pt-4">
              <button type="button" className="bg-text-primary text-bg-primary px-4 py-2 rounded-lg text-sm font-medium hover:bg-white transition-colors">
                Save Changes
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
