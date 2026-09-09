import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Bot, Play, Terminal } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { AGENT_LOGS_MATCHING, AGENT_LOGS_VEILLE } from "@/lib/mock-data";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/_shell/agents")({
  head: () => ({
    meta: [
      { title: "Agents IA — FZANA Control" },
      {
        name: "description",
        content: "Pilotez l'Agent Veille & Analyse et l'Agent Matching Technique & Catalogue de FZANA Systems.",
      },
      { property: "og:title", content: "Agents IA — FZANA Control" },
      { property: "og:description", content: "Statut, exécutions et journaux en direct des agents IA." },
    ],
  }),
  component: AgentsPage,
});

function Ring({ value }: { value: number }) {
  const r = 34;
  const c = 2 * Math.PI * r;
  return (
    <svg viewBox="0 0 80 80" className="h-20 w-20 -rotate-90">
      <circle cx="40" cy="40" r={r} strokeWidth="7" className="fill-none stroke-muted" />
      <motion.circle
        cx="40"
        cy="40"
        r={r}
        strokeWidth="7"
        strokeLinecap="round"
        className="fill-none stroke-accent"
        initial={{ strokeDasharray: c, strokeDashoffset: c }}
        animate={{ strokeDashoffset: c - (c * value) / 100 }}
        transition={{ duration: 1.1, ease: "easeOut" }}
      />
    </svg>
  );
}

function AgentCard({
  agentId,
  logs,
  progress,
}: {
  agentId: string;
  logs: string[];
  progress: number;
}) {
  const { agents, toggleAgent, markAgentRun, pushNotification } = useApp();
  const agent = agents.find((a) => a.id === agentId)!;
  const [running, setRunning] = useState(false);
  const [lines, setLines] = useState<string[]>([]);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!running) return;
    let i = 0;
    const t = setInterval(() => {
      setLines((l) => [...l, logs[i] ?? ""]);
      i += 1;
      if (i >= logs.length) {
        clearInterval(t);
        setRunning(false);
        markAgentRun(agent.id, logs.length);
        pushNotification(`${agent.name} : exécution terminée`);
        toast.success("Exécution de l'agent terminée");
      }
    }, 550);
    return () => clearInterval(t);
  }, [running]);

  useEffect(() => {
    boxRef.current?.scrollTo({ top: boxRef.current.scrollHeight, behavior: "smooth" });
  }, [lines]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      className={`card-elevated relative overflow-hidden p-6 ${agent.active ? "glow-accent" : ""}`}
    >
      <div className="flex items-start gap-4">
        <div className="relative">
          <Ring value={progress} />
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-accent-soft">
              {agent.active && (
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent/30" />
              )}
              <Bot className="relative h-5 w-5 text-accent" />
            </span>
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <h2 className="font-display text-base font-semibold">{agent.name}</h2>
            <div className="flex shrink-0 items-center gap-2">
              <span className="text-xs text-muted-foreground">{agent.active ? "Actif" : "En pause"}</span>
              <Switch
                checked={agent.active}
                onCheckedChange={() => {
                  toggleAgent(agent.id);
                  toast(agent.active ? "Agent mis en pause" : "Agent activé");
                }}
              />
            </div>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{agent.description}</p>
          <div className="clinical-rule my-4" />
          <dl className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <dt className="text-xs text-muted-foreground">Dernière exécution</dt>
              <dd className="font-medium">{agent.lastRun}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Actions aujourd'hui</dt>
              <dd className="font-medium tabular-nums">{agent.actionsToday}</dd>
            </div>
          </dl>
          <Button
            className="mt-4"
            disabled={running || !agent.active}
            onClick={() => {
              setLines([]);
              setRunning(true);
            }}
          >
            <Play className="mr-2 h-4 w-4" /> {running ? "Exécution en cours…" : "Lancer maintenant"}
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {(running || lines.length > 0) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-5 overflow-hidden"
          >
            <div
              ref={boxRef}
              className="max-h-44 overflow-y-auto rounded-lg bg-charcoal p-4 font-mono text-xs leading-relaxed text-accent-glow"
            >
              <p className="mb-2 flex items-center gap-2 text-primary-foreground/60">
                <Terminal className="h-3.5 w-3.5" /> agent://{agent.id}
              </p>
              {lines.map((l, i) => (
                <motion.p key={`${l}-${i}`} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}>
                  {l}
                </motion.p>
              ))}
              {running && <span className="inline-block animate-pulse">▌</span>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function AgentsPage() {
  return (
    <div>
      <PageHeader
        title="Agents IA"
        subtitle="Automatisation de la veille des marchés publics et du matching technique du catalogue."
      />
      <div className="grid gap-6 xl:grid-cols-2">
        <AgentCard agentId="veille" logs={AGENT_LOGS_VEILLE} progress={82} />
        <AgentCard agentId="matching" logs={AGENT_LOGS_MATCHING} progress={91} />
      </div>
    </div>
  );
}
