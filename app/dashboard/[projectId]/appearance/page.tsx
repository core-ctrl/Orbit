"use client";

import { useState, useEffect, use } from "react";
import { Check, Monitor, Moon, Sun, MonitorSmartphone, Eye } from "lucide-react";
import { useTheme } from "@/components/ui/theme-toggle";
import { WidgetFrame } from "@/components/widgets/WidgetFrame";

export default function AppearancePage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = use(params);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  // Customization states
  const [accentColor, setAccentColor] = useState("#7C3AED");
  const [density, setDensity] = useState("comfortable");
  
  // Wait for client to mount
  useEffect(() => {
    setMounted(true);
    // Load saved preferences if any (could be from localStorage or API)
    const savedAccent = localStorage.getItem('orbit-accent-color');
    if (savedAccent) setAccentColor(savedAccent);
    
    const savedDensity = localStorage.getItem('orbit-density');
    if (savedDensity) setDensity(savedDensity);
  }, []);

  const handleAccentChange = (color: string) => {
    setAccentColor(color);
    localStorage.setItem('orbit-accent-color', color);
    // In a real app, you'd apply this to a CSS variable on :root
    document.documentElement.style.setProperty('--accent', color);
  };
  
  const handleDensityChange = (d: string) => {
    setDensity(d);
    localStorage.setItem('orbit-density', d);
  };

  if (!mounted) return null;

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-semibold text-text-primary">Appearance</h1>
        <p className="text-text-secondary text-sm mt-1">Customize the look and feel of your Orbit dashboard.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          {/* Theme Selector */}
          <WidgetFrame title="Theme Preference">
            <div className="grid grid-cols-3 gap-3">
              <button 
                onClick={() => setTheme("light")}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border ${theme === 'light' ? 'border-accent bg-accent/5' : 'border-border hover:bg-hover'} transition-colors`}
              >
                <div className="w-10 h-10 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-yellow-500">
                  <Sun className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium">Light</span>
              </button>
              
              <button 
                onClick={() => setTheme("dark")}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border ${theme === 'dark' ? 'border-accent bg-accent/5' : 'border-border hover:bg-hover'} transition-colors`}
              >
                <div className="w-10 h-10 rounded-full bg-gray-900 border border-gray-700 shadow-sm flex items-center justify-center text-blue-400">
                  <Moon className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium">Dark</span>
              </button>
              
              <button 
                onClick={() => setTheme("system")}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border ${theme === 'system' ? 'border-accent bg-accent/5' : 'border-border hover:bg-hover'} transition-colors`}
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-800 border border-border shadow-sm flex items-center justify-center text-text-primary">
                  <MonitorSmartphone className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium">System</span>
              </button>
            </div>
          </WidgetFrame>
          
          {/* Accent Color */}
          <WidgetFrame title="Accent Color">
            <p className="text-sm text-text-secondary mb-4">Choose the primary color used for buttons, active states, and highlights.</p>
            <div className="flex flex-wrap gap-3">
              {[
                { name: 'Purple (Default)', hex: '#7C3AED' },
                { name: 'Blue', hex: '#3B82F6' },
                { name: 'Emerald', hex: '#10B981' },
                { name: 'Rose', hex: '#F43F5E' },
                { name: 'Amber', hex: '#F59E0B' },
                { name: 'Slate', hex: '#64748B' },
              ].map(color => (
                <button
                  key={color.hex}
                  onClick={() => handleAccentChange(color.hex)}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-transform hover:scale-110 shadow-sm ${accentColor === color.hex ? 'ring-2 ring-offset-2 ring-offset-bg-primary ring-text-primary' : ''}`}
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                >
                  {accentColor === color.hex && <Check className="w-5 h-5 text-white" />}
                </button>
              ))}
            </div>
          </WidgetFrame>
          
          {/* Layout Density */}
          <WidgetFrame title="Layout Density">
            <div className="space-y-3">
              <label className={`flex items-center gap-3 p-3 rounded-lg border ${density === 'compact' ? 'border-accent bg-accent/5' : 'border-border hover:bg-hover'} cursor-pointer transition-colors`}>
                <input type="radio" name="density" checked={density === 'compact'} onChange={() => handleDensityChange('compact')} className="text-accent" />
                <div>
                  <div className="font-medium text-sm">Compact</div>
                  <div className="text-xs text-text-muted">More data on screen, smaller padding.</div>
                </div>
              </label>
              
              <label className={`flex items-center gap-3 p-3 rounded-lg border ${density === 'comfortable' ? 'border-accent bg-accent/5' : 'border-border hover:bg-hover'} cursor-pointer transition-colors`}>
                <input type="radio" name="density" checked={density === 'comfortable'} onChange={() => handleDensityChange('comfortable')} className="text-accent" />
                <div>
                  <div className="font-medium text-sm">Comfortable</div>
                  <div className="text-xs text-text-muted">Default spacing, optimized for readability.</div>
                </div>
              </label>
              
              <label className={`flex items-center gap-3 p-3 rounded-lg border ${density === 'spacious' ? 'border-accent bg-accent/5' : 'border-border hover:bg-hover'} cursor-pointer transition-colors`}>
                <input type="radio" name="density" checked={density === 'spacious'} onChange={() => handleDensityChange('spacious')} className="text-accent" />
                <div>
                  <div className="font-medium text-sm">Spacious</div>
                  <div className="text-xs text-text-muted">Large padding, relaxed reading experience.</div>
                </div>
              </label>
            </div>
          </WidgetFrame>
        </div>
        
        <div className="space-y-6">
          <WidgetFrame title="Live Preview">
            <div className="border border-border rounded-lg overflow-hidden bg-bg-primary" style={{ padding: density === 'compact' ? '1rem' : density === 'spacious' ? '2rem' : '1.5rem' }}>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: accentColor }}>
                    O
                  </div>
                  <span className="font-semibold text-text-primary">Orbit App</span>
                </div>
                <button className="text-xs px-3 py-1.5 rounded-md text-white font-medium shadow-sm transition-opacity hover:opacity-90" style={{ backgroundColor: accentColor }}>
                  Action
                </button>
              </div>
              
              <div className="space-y-3">
                <div className="h-20 rounded-lg border border-border bg-card p-4 flex items-center justify-between shadow-sm">
                  <div className="space-y-2">
                    <div className="w-24 h-4 bg-secondary rounded animate-pulse"></div>
                    <div className="w-16 h-3 bg-secondary/50 rounded animate-pulse"></div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                    <Eye className="w-4 h-4 text-text-muted" />
                  </div>
                </div>
                
                <div className="h-20 rounded-lg border border-border bg-card p-4 flex items-center justify-between shadow-sm">
                  <div className="space-y-2">
                    <div className="w-32 h-4 bg-secondary rounded animate-pulse"></div>
                    <div className="w-20 h-3 bg-secondary/50 rounded animate-pulse"></div>
                  </div>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: `${accentColor}20`, color: accentColor }}>
                    <Check className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          </WidgetFrame>
        </div>
      </div>
    </div>
  );
}
