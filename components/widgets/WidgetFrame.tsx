import { GripHorizontal, X } from "lucide-react";
import type { ReactNode } from "react";

import { Panel } from "@/components/shared/Panel";

export function WidgetFrame({
  title,
  children,
  onRemove
}: {
  title: string;
  children: ReactNode;
  onRemove?: () => void;
}): JSX.Element {
  return (
    <Panel className="overflow-hidden p-0">
      <header className="widget-drag-handle flex cursor-move items-center justify-between border-b border-line px-5 py-4">
        <h2 className="text-sm font-medium">{title}</h2>
        <div className="flex items-center gap-2 text-muted">
          {onRemove && (
            <button type="button" onClick={onRemove} className="hover:text-danger" aria-label={`Remove ${title}`}>
              <X className="h-4 w-4" />
            </button>
          )}
          <GripHorizontal className="h-4 w-4" />
        </div>
      </header>
      <div className="h-[calc(100%-57px)] p-5">{children}</div>
    </Panel>
  );
}
