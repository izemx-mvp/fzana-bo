import { motion } from "framer-motion";
import { useEffect, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight, Inbox } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { Conformity, TenderStatus } from "@/lib/mock-data";

export const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.04, duration: 0.35, ease: "easeOut" } }),
} as const;

export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6 flex flex-wrap items-end justify-between gap-4"
    >
      <div>
        <h1 className="font-display text-2xl font-semibold text-foreground md:text-3xl">{title}</h1>
        {subtitle ? <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p> : null}
        <div className="clinical-rule mt-3 w-24" />
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </motion.div>
  );
}

export function formatMAD(n: number) {
  return `${n.toLocaleString("fr-MA")} MAD`;
}

export function daysLeft(deadline: string) {
  const diff = new Date(deadline).getTime() - new Date("2026-09-09").getTime();
  return Math.ceil(diff / 86400000);
}

export function StatusBadge({ status }: { status: TenderStatus }) {
  const map: Record<TenderStatus, string> = {
    Nouveau: "bg-secondary text-secondary-foreground border-border",
    "En analyse": "bg-accent-soft text-primary border-accent/30",
    Conforme: "bg-[color-mix(in_oklab,var(--success)_14%,white)] text-[var(--success)] border-[color-mix(in_oklab,var(--success)_30%,white)]",
    "Non conforme": "bg-[color-mix(in_oklab,var(--destructive)_10%,white)] text-destructive border-[color-mix(in_oklab,var(--destructive)_25%,white)]",
    Soumis: "bg-[color-mix(in_oklab,var(--primary)_10%,white)] text-primary border-[color-mix(in_oklab,var(--primary)_25%,white)]",
    Gagné: "bg-[color-mix(in_oklab,var(--success)_16%,white)] text-[var(--success)] border-[color-mix(in_oklab,var(--success)_32%,white)]",
    Perdu: "bg-muted text-muted-foreground border-border",
  };
  return (
    <span className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium", map[status])}>
      {status}
    </span>
  );
}

export function ConformityBadge({ value }: { value: Conformity }) {
  const map: Record<Conformity, string> = {
    Conforme: "text-[var(--success)] bg-[color-mix(in_oklab,var(--success)_12%,white)]",
    "À vérifier": "text-[var(--warning)] bg-[color-mix(in_oklab,var(--warning)_14%,white)]",
    "Non conforme": "text-destructive bg-[color-mix(in_oklab,var(--destructive)_10%,white)]",
  };
  const icon = value === "Conforme" ? "✅" : value === "À vérifier" ? "⚠️" : "❌";
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium", map[value])}>
      <span aria-hidden>{icon}</span>
      {value}
    </span>
  );
}

export function ScoreGauge({ value, className }: { value: number; className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-muted">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={cn(
            "h-full rounded-full",
            value >= 90 ? "bg-[var(--success)]" : value >= 75 ? "bg-accent" : "bg-[var(--warning)]",
          )}
        />
      </div>
      <span className="text-xs font-medium tabular-nums text-muted-foreground">{value}%</span>
    </div>
  );
}

export function DeadlineBadge({ deadline }: { deadline: string }) {
  const d = daysLeft(deadline);
  const tone =
    d < 3
      ? "text-destructive bg-[color-mix(in_oklab,var(--destructive)_10%,white)]"
      : d < 7
        ? "text-[var(--warning)] bg-[color-mix(in_oklab,var(--warning)_14%,white)]"
        : "text-[var(--success)] bg-[color-mix(in_oklab,var(--success)_12%,white)]";
  return (
    <span className={cn("rounded-md px-2 py-1 text-xs font-medium tabular-nums", tone)}>
      {new Date(deadline).toLocaleDateString("fr-FR")} · J{d >= 0 ? `-${d}` : `+${-d}`}
    </span>
  );
}

export function EmptyState({ title, hint }: { title: string; hint?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16 text-center"
    >
      <div className="mb-3 rounded-full bg-muted p-3">
        <Inbox className="h-5 w-5 text-muted-foreground" />
      </div>
      <p className="font-display text-sm font-semibold">{title}</p>
      {hint ? <p className="mt-1 text-sm text-muted-foreground">{hint}</p> : null}
    </motion.div>
  );
}

export function Pagination({
  page,
  pageSize,
  total,
  onPage,
  onPageSize,
}: {
  page: number;
  pageSize: number;
  total: number;
  onPage: (p: number) => void;
  onPageSize: (s: number) => void;
}) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const nums = Array.from({ length: pages }, (_, i) => i + 1).filter(
    (n) => n === 1 || n === pages || Math.abs(n - page) <= 1,
  );
  return (
    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>Lignes par page</span>
        <select
          value={pageSize}
          onChange={(e) => {
            onPageSize(Number(e.target.value));
            onPage(1);
          }}
          className="rounded-md border border-input bg-background px-2 py-1 text-sm"
        >
          {[10, 25, 50].map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <span className="hidden sm:inline">· {total} résultat(s)</span>
      </div>
      <div className="flex items-center gap-1">
        <Button variant="outline" size="icon" disabled={page <= 1} onClick={() => onPage(page - 1)}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        {nums.map((n, i) => (
          <span key={n} className="flex items-center">
            {i > 0 && n - (nums[i - 1] ?? 0) > 1 ? <span className="px-1 text-muted-foreground">…</span> : null}
            <Button
              variant={n === page ? "default" : "ghost"}
              size="sm"
              className="min-w-9"
              onClick={() => onPage(n)}
            >
              {n}
            </Button>
          </span>
        ))}
        <Button variant="outline" size="icon" disabled={page >= pages} onClick={() => onPage(page + 1)}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export function useCountUp(target: number, duration = 900) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      setValue(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return value;
}

export function downloadTextFile(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
