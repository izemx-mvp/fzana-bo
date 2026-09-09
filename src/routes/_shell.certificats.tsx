import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { AlertTriangle, Search, ShieldCheck } from "lucide-react";
import { EmptyState, PageHeader, Pagination } from "@/components/common";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CERTIFICATES } from "@/lib/mock-data";

export const Route = createFileRoute("/_shell/certificats")({
  head: () => ({
    meta: [
      { title: "Certificats & Conformité — FZANA Control" },
      {
        name: "description",
        content: "Suivi des certificats d'enregistrement de matériel médical et des échéances de renouvellement.",
      },
      { property: "og:title", content: "Certificats & Conformité — FZANA Control" },
      { property: "og:description", content: "Titulaires, validité et alertes de renouvellement des certificats." },
    ],
  }),
  component: CertificatesPage,
});

const tone: Record<string, string> = {
  Valide: "bg-[color-mix(in_oklab,var(--success)_12%,white)] text-[var(--success)]",
  "En renouvellement": "bg-accent-soft text-primary",
  "Expire bientôt": "bg-[color-mix(in_oklab,var(--warning)_14%,white)] text-[var(--warning)]",
  Expiré: "bg-[color-mix(in_oklab,var(--destructive)_10%,white)] text-destructive",
};

function CertificatesPage() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const filtered = CERTIFICATES.filter((c) => {
    const text = `${c.product} ${c.holder} ${c.number} ${c.category}`.toLowerCase();
    if (q && !text.includes(q.toLowerCase())) return false;
    if (status !== "all" && c.status !== status) return false;
    return true;
  });
  const items = filtered.slice((page - 1) * pageSize, page * pageSize);
  const alerts = CERTIFICATES.filter((c) => c.status !== "Valide").length;

  return (
    <div>
      <PageHeader
        title="Certificats & Conformité"
        subtitle="Certificats d'enregistrement de matériel médical mobilisables pour les soumissions."
      />

      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 flex items-center gap-3 rounded-lg border border-[color-mix(in_oklab,var(--warning)_35%,white)] bg-[color-mix(in_oklab,var(--warning)_12%,white)] px-4 py-3"
      >
        <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--warning)_20%,white)]">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--warning)]/25" />
          <AlertTriangle className="relative h-4 w-4 text-[var(--warning)]" />
        </span>
        <p className="text-sm">
          <strong>{alerts} certificat(s)</strong> nécessitent votre attention. Le certificat FZANA est en cours de
          renouvellement : les soumissions s'appuient actuellement sur un certificat partenaire avec autorisation.
        </p>
      </motion.div>

      <div className="card-elevated mb-4 grid gap-3 p-4 md:grid-cols-2">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setPage(1);
            }}
            placeholder="Rechercher un certificat, un titulaire…"
            className="pl-9"
          />
        </div>
        <Select value={status} onValueChange={(v) => { setStatus(v); setPage(1); }}>
          <SelectTrigger>
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            {["Valide", "En renouvellement", "Expire bientôt", "Expiré"].map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="Aucun certificat trouvé" hint="Essayez un autre mot-clé ou un autre statut." />
      ) : (
        <div className="card-elevated overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-sm">
              <thead className="border-b border-border bg-secondary/60 text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 text-left">Produit / gamme</th>
                  <th className="px-4 py-3 text-left">Catégorie</th>
                  <th className="px-4 py-3 text-left">Titulaire</th>
                  <th className="px-4 py-3 text-left">N°</th>
                  <th className="px-4 py-3 text-left">Expiration</th>
                  <th className="px-4 py-3 text-left">Statut</th>
                </tr>
              </thead>
              <tbody>
                {items.map((c, i) => (
                  <motion.tr
                    key={c.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="border-b border-border/60 last:border-0 hover:bg-secondary/50"
                  >
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-2 font-medium">
                        <ShieldCheck className="h-4 w-4 text-accent" /> {c.product}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{c.category}</td>
                    <td className="px-4 py-3">{c.holder}</td>
                    <td className="px-4 py-3 tabular-nums text-muted-foreground">{c.number}</td>
                    <td className="px-4 py-3 tabular-nums">{new Date(c.expires).toLocaleDateString("fr-FR")}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${tone[c.status]}`}>
                        {c.status}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 pb-4">
            <Pagination
              page={page}
              pageSize={pageSize}
              total={filtered.length}
              onPage={setPage}
              onPageSize={setPageSize}
            />
          </div>
        </div>
      )}
    </div>
  );
}
