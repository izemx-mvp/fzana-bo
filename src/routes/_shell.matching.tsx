import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { Eye, RefreshCw, Search } from "lucide-react";
import { toast } from "sonner";
import {
  ConformityBadge,
  EmptyState,
  PageHeader,
  Pagination,
  ScoreGauge,
} from "@/components/common";
import { ProductModal } from "@/components/product-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CATEGORIES, productById, type Conformity, type Product } from "@/lib/mock-data";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/_shell/matching")({
  head: () => ({
    meta: [
      { title: "Matching Catalogue — FZANA Control" },
      {
        name: "description",
        content: "Correspondances produit ↔ exigence sur l'ensemble des appels d'offres suivis.",
      },
      { property: "og:title", content: "Matching Catalogue — FZANA Control" },
      { property: "og:description", content: "Scores de conformité produit par ligne de cahier des charges." },
    ],
  }),
  component: MatchingPage,
});

function MatchingPage() {
  const { visibleTenders } = useApp();
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const [conf, setConf] = useState("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [product, setProduct] = useState<Product | null>(null);
  const [running, setRunning] = useState(false);

  const rows = useMemo(
    () =>
      visibleTenders.flatMap((t) =>
        t.requirements.map((r) => ({ tender: t, req: r, product: productById(r.productId) })),
      ),
    [visibleTenders],
  );

  const filtered = rows.filter(({ tender, req, product: p }) => {
    const text = `${tender.ref} ${req.article} ${p.name} ${p.supplier}`.toLowerCase();
    if (q && !text.includes(q.toLowerCase())) return false;
    if (cat !== "all" && p.category !== cat) return false;
    if (conf !== "all" && req.conformity !== (conf as Conformity)) return false;
    return true;
  });

  const items = filtered.slice((page - 1) * pageSize, page * pageSize);

  const relaunch = () => {
    setRunning(true);
    setTimeout(() => {
      setRunning(false);
      toast.success(`Matching relancé — ${rows.length} lignes réanalysées`);
    }, 1800);
  };

  return (
    <div>
      <PageHeader
        title="Matching Catalogue"
        subtitle="Vue transverse des correspondances entre exigences des cahiers des charges et catalogue FZANA."
        actions={
          <Button onClick={relaunch} disabled={running}>
            <RefreshCw className={`mr-2 h-4 w-4 ${running ? "animate-spin" : ""}`} /> Relancer le matching
          </Button>
        }
      />

      {running && (
        <div className="card-elevated mb-4 p-5">
          <p className="mb-3 font-display text-sm font-semibold">Agent Matching au travail…</p>
          <Progress value={66} className="h-2" />
          <div className="mt-4 space-y-2">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      )}

      <div className="card-elevated mb-4 grid gap-3 p-4 md:grid-cols-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setPage(1);
            }}
            placeholder="Rechercher un produit, une exigence…"
            className="pl-9"
          />
        </div>
        <Select value={cat} onValueChange={(v) => { setCat(v); setPage(1); }}>
          <SelectTrigger>
            <SelectValue placeholder="Catégorie" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les catégories</SelectItem>
            {CATEGORIES.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={conf} onValueChange={(v) => { setConf(v); setPage(1); }}>
          <SelectTrigger>
            <SelectValue placeholder="Conformité" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les conformités</SelectItem>
            {["Conforme", "À vérifier", "Non conforme"].map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="Aucun résultat pour cette recherche" hint="Essayez une autre catégorie ou un autre mot-clé." />
      ) : (
        <div className="card-elevated overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-sm">
              <thead className="border-b border-border bg-secondary/60 text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 text-left">Appel d'offres</th>
                  <th className="px-4 py-3 text-left">Exigence</th>
                  <th className="px-4 py-3 text-left">Produit proposé</th>
                  <th className="px-4 py-3 text-left">Catégorie</th>
                  <th className="px-4 py-3 text-left">Score</th>
                  <th className="px-4 py-3 text-left">Conformité</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {items.map(({ tender, req, product: p }, i) => (
                  <motion.tr
                    key={req.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="cursor-pointer border-b border-border/60 last:border-0 hover:bg-secondary/50"
                    onClick={() => navigate({ to: "/appels-offres/$id", params: { id: tender.id } })}
                  >
                    <td className="px-4 py-3 font-medium">{tender.ref}</td>
                    <td className="px-4 py-3">{req.article}</td>
                    <td className="px-4 py-3 text-muted-foreground">{p.name}</td>
                    <td className="px-4 py-3">{p.category}</td>
                    <td className="px-4 py-3">
                      <ScoreGauge value={req.score} />
                    </td>
                    <td className="px-4 py-3">
                      <ConformityBadge value={req.conformity} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          setProduct(p);
                        }}
                      >
                        <Eye className="mr-1.5 h-3.5 w-3.5" /> Aperçu
                      </Button>
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

      <ProductModal product={product} onOpenChange={(o) => !o && setProduct(null)} />
    </div>
  );
}
