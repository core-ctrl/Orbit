import { cn } from "@/lib/utils";

interface StatusDotProps {
  status: "up" | "down" | "slow";
  pulse?: boolean;
}

export function StatusDot({ status, pulse = false }: StatusDotProps) {
  return (
    <div className="relative flex items-center justify-center">
      <div
        className={cn(
          "w-2 h-2 rounded-full",
          {
            "bg-success": status === "up",
            "bg-danger": status === "down",
            "bg-warning": status === "slow",
          }
        )}
      />
      {pulse && (
        <div
          className={cn(
            "absolute w-4 h-4 rounded-full animate-ping opacity-75",
            {
              "bg-success": status === "up",
              "bg-danger": status === "down",
              "bg-warning": status === "slow",
            }
          )}
        />
      )}
    </div>
  );
}
