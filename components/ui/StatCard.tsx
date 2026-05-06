import { cn } from "@/lib/utils/cn";
import { Icon } from "@/components/layout/Icon";
import { GlassPanel } from "./GlassPanel";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: string;
  badge?: string;
  tone?: "default" | "alert" | "success";
}

export function StatCard({ label, value, icon, badge, tone = "default" }: StatCardProps) {
  const isAlert = tone === "alert";
  const isSuccess = tone === "success";
  return (
    <GlassPanel
      className={cn(
        "p-6 flex flex-col justify-between min-h-[140px] relative overflow-hidden",
        isAlert && "border-error/30",
      )}
    >
      {isAlert && <div className="absolute top-0 right-0 w-24 h-24 bg-error/10 rounded-bl-full pointer-events-none" />}
      <div className="flex justify-between items-start mb-4 relative z-10">
        <span
          className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center",
            isAlert ? "bg-error/20 text-error" : isSuccess ? "bg-success/20 text-success" : "bg-primary/20 text-primary",
          )}
        >
          <Icon name={icon} />
        </span>
        {badge && (
          <span
            className={cn(
              "px-2.5 py-1 rounded-full font-label-caps text-[10px] border",
              isAlert
                ? "bg-error/20 text-error border-error/30"
                : "bg-success/15 text-success border-success/30",
            )}
          >
            {badge}
          </span>
        )}
      </div>
      <div className="relative z-10">
        <p className={cn("font-label-caps text-label-caps mb-1", isAlert ? "text-error" : "text-on-surface-variant")}>
          {label}
        </p>
        <p className="font-bold text-[40px] leading-none text-on-surface tracking-tight">{value}</p>
      </div>
    </GlassPanel>
  );
}
