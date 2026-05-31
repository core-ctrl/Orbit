"use client";

import { Plus, RotateCcw, Save } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  Responsive,
  WidthProvider,
  type Layout,
  type Layouts
} from "react-grid-layout";

import { AlertWidget } from "@/components/widgets/AlertWidget";
import { ContainerListWidget } from "@/components/widgets/ContainerListWidget";
import { CpuWidget } from "@/components/widgets/CpuWidget";
import { DiskWidget } from "@/components/widgets/DiskWidget";
import { EndpointStatusWidget } from "@/components/widgets/EndpointStatusWidget";
import { ErrorRateWidget } from "@/components/widgets/ErrorRateWidget";
import { LogStreamWidget } from "@/components/widgets/LogStreamWidget";
import { NetworkWidget } from "@/components/widgets/NetworkWidget";
import { RamWidget } from "@/components/widgets/RamWidget";
import { ResponseTimeWidget } from "@/components/widgets/ResponseTimeWidget";
import { SslExpiryWidget } from "@/components/widgets/SslExpiryWidget";
import { UptimeWidget } from "@/components/widgets/UptimeWidget";

const ResponsiveGrid = WidthProvider(Responsive);
const STORAGE_KEY = "orbit.dashboard.layout";

type WidgetId =
  | "uptime"
  | "cpu"
  | "ram"
  | "disk"
  | "network"
  | "containers"
  | "endpoint-status"
  | "responses"
  | "errors"
  | "ssl"
  | "logs"
  | "alerts";

interface WidgetDefinition {
  id: WidgetId;
  label: string;
  component: (props: { onRemove: () => void }) => JSX.Element;
}

const definitions: WidgetDefinition[] = [
  { id: "uptime", label: "Uptime", component: UptimeWidget },
  { id: "cpu", label: "CPU", component: CpuWidget },
  { id: "ram", label: "Memory", component: RamWidget },
  { id: "disk", label: "Disk", component: DiskWidget },
  { id: "network", label: "Network", component: NetworkWidget },
  { id: "containers", label: "Containers", component: ContainerListWidget },
  { id: "endpoint-status", label: "Endpoint Status", component: EndpointStatusWidget },
  { id: "responses", label: "Response Times", component: ResponseTimeWidget },
  { id: "errors", label: "Error Rate", component: ErrorRateWidget },
  { id: "ssl", label: "SSL Expiry", component: SslExpiryWidget },
  { id: "logs", label: "Live Events", component: LogStreamWidget },
  { id: "alerts", label: "Alerts", component: AlertWidget }
];

const defaultLayout: Layout[] = [
  { i: "uptime", x: 0, y: 0, w: 3, h: 3 },
  { i: "cpu", x: 3, y: 0, w: 3, h: 3 },
  { i: "ram", x: 6, y: 0, w: 3, h: 3 },
  { i: "disk", x: 9, y: 0, w: 3, h: 3 },
  { i: "containers", x: 0, y: 3, w: 6, h: 4 },
  { i: "responses", x: 6, y: 3, w: 6, h: 4 },
  { i: "alerts", x: 0, y: 7, w: 4, h: 4 },
  { i: "ssl", x: 4, y: 7, w: 4, h: 4 },
  { i: "logs", x: 8, y: 7, w: 4, h: 4 }
];

function isLayoutArray(value: unknown): value is Layout[] {
  return (
    Array.isArray(value) &&
    value.every(
      (entry) =>
        typeof entry === "object" &&
        entry !== null &&
        "i" in entry &&
        typeof entry.i === "string" &&
        "x" in entry &&
        typeof entry.x === "number" &&
        "y" in entry &&
        typeof entry.y === "number"
    )
  );
}

export function WidgetGrid(): JSX.Element {
  const [layout, setLayout] = useState<Layout[]>(defaultLayout);
  const [pickerOpen, setPickerOpen] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) return;
    const parsed: unknown = JSON.parse(saved);
    if (isLayoutArray(parsed)) setLayout(parsed);
  }, []);

  const active = useMemo(() => new Set(layout.map((item) => item.i)), [layout]);
  const available = definitions.filter((definition) => !active.has(definition.id));

  const remove = (id: string): void => {
    setLayout((current) => current.filter((item) => item.i !== id));
  };
  const add = (id: WidgetId): void => {
    setLayout((current) => [...current, { i: id, x: 0, y: Infinity, w: 4, h: 4 }]);
    setPickerOpen(false);
  };
  const save = (): void => window.localStorage.setItem(STORAGE_KEY, JSON.stringify(layout));
  const reset = (): void => {
    setLayout(defaultLayout);
    window.localStorage.removeItem(STORAGE_KEY);
  };
  const onLayoutChange = (_current: Layout[], layouts: Layouts): void => {
    if (layouts.lg) setLayout(layouts.lg);
  };

  return (
    <>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm text-muted">Drag, resize, and pin the signals that matter most.</p>
        </div>
        <div className="relative flex gap-2">
          <button type="button" onClick={save} className="flex items-center gap-2 rounded-xl border border-line bg-panel px-3 py-2 text-sm text-muted hover:text-ink">
            <Save className="h-4 w-4" /> Save
          </button>
          <button type="button" onClick={reset} className="flex items-center gap-2 rounded-xl border border-line bg-panel px-3 py-2 text-sm text-muted hover:text-ink">
            <RotateCcw className="h-4 w-4" /> Reset
          </button>
          <button type="button" onClick={() => setPickerOpen((value) => !value)} className="flex items-center gap-2 rounded-xl bg-orbit px-3 py-2 text-sm font-medium text-canvas">
            <Plus className="h-4 w-4" /> Widget
          </button>
          {pickerOpen && (
            <div className="absolute right-0 top-12 z-20 w-52 rounded-xl border border-line bg-panel p-2 shadow-glow">
              {available.length ? available.map((widget) => (
                <button key={widget.id} type="button" onClick={() => add(widget.id)} className="block w-full rounded-lg px-3 py-2 text-left text-sm text-muted hover:bg-surface hover:text-ink">
                  {widget.label}
                </button>
              )) : <p className="p-3 text-sm text-muted">All widgets are active.</p>}
            </div>
          )}
        </div>
      </div>
      <ResponsiveGrid
        className="layout"
        layouts={{ lg: layout }}
        breakpoints={{ lg: 980, md: 720, sm: 480, xs: 0 }}
        cols={{ lg: 12, md: 8, sm: 4, xs: 1 }}
        rowHeight={74}
        draggableHandle=".widget-drag-handle"
        margin={[16, 16]}
        onLayoutChange={onLayoutChange}
      >
        {layout.map((item) => {
          const definition = definitions.find((widget) => widget.id === item.i);
          if (!definition) return null;
          const Component = definition.component;
          return (
            <div key={item.i}>
              <Component onRemove={() => remove(item.i)} />
            </div>
          );
        })}
      </ResponsiveGrid>
    </>
  );
}


