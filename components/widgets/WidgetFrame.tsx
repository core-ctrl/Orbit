import { GripHorizontal, X, Settings2, Info } from "lucide-react";
import type { ReactNode } from "react";

export function WidgetFrame({
  title,
  description,
  children,
  onRemove,
  onConfig
}: {
  title: string;
  description?: string;
  children: ReactNode;
  onRemove?: () => void;
  onConfig?: () => void;
}): JSX.Element {
  return (
    <div className="glass-card overflow-hidden p-0 h-full flex flex-col">
      <header className="widget-drag-handle flex cursor-move items-center justify-between border-b border-border px-5 py-4 bg-secondary/30">
        <div>
          <h2 className="text-sm font-semibold text-text-primary flex items-center gap-1.5">
            {title}
            {description && (
              <div className="group relative">
                <Info className="w-3.5 h-3.5 text-text-muted cursor-help" />
                <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-48 p-2 bg-card border border-border rounded-lg text-xs text-text-secondary opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all shadow-glass z-50 pointer-events-none">
                  {description}
                </div>
              </div>
            )}
          </h2>
        </div>
        <div className="flex items-center gap-3 text-text-muted">
          {onConfig && (
            <button type="button" onClick={(e) => { e.stopPropagation(); onConfig(); }} className="hover:text-accent transition-colors" aria-label={`Configure ${title}`}>
              <Settings2 className="h-4 w-4" />
            </button>
          )}
          {onRemove && (
            <button type="button" onClick={(e) => { e.stopPropagation(); onRemove(); }} className="hover:text-danger transition-colors" aria-label={`Remove ${title}`}>
              <X className="h-4 w-4" />
            </button>
          )}
          <GripHorizontal className="h-4 w-4" />
        </div>
      </header>
      <div className="flex-1 p-5 overflow-auto">{children}</div>
    </div>
  );
}


