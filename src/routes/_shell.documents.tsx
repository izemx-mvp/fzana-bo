import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { Download, Eye, FileText, Search } from "lucide-react";
import { toast } from "sonner";
import { EmptyState, PageHeader, Pagination, downloadTextFile } from "@/components/common";
import { DocPreview, docContent } from "./_shell.appels-offres.$id";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DOC_TYPES, type DocType, type Tender } from "@/lib/mock-data";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/_shell/documents")({
  head: () => ({
    meta: [
      { title: "Documents générés — FZANA Control" },
      {
        name: "description",
        content: "Tous les mémoires techniques, bordereaux et actes d'engagement générés par les agents IA.",
      },
      { property: "og:title", content: "Documents générés — FZANA Control" },
      { property: "og:description", content: "Aperçu et téléchargement des documents de réponse aux marchés." },
    ],
  }),
  component: DocumentsPage,
});

function DocumentsPage() {
  const { docs, visibleTenders } = useApp();
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [type, setType] = useState("all");
  const [tenderFilter, setTenderFilter] = useState("all");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [preview, setPreview] = useState<{ tender: Tender; type: DocType } | null>(null);

  const byId = new Map(visibleTenders.map((t) => [t.id, t]));
  const filtered = docs
    .filter((d) => byId.has(d.tenderId))
    .filter((d) => {
      const t = byId.get(d.tenderId)!;
      const text = `${d.type} ${t.ref} ${t.client}`.toLowerCase();
      if (q && !text.includes(q.toLowerCase())) return false;
      if (type !== "all" && d.type !== type) return false;
      if (tenderFilter !== "all" && d.tenderId !== tenderFilter) return false;
      if (status !== "all" && d.status !== status) return false;
      return true;
    });

  const items = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div>
      <PageHeader
        title="Documents générés"
        subtitle="Ensemble des pièces produites automatiquement pour chaque dossier ayant atteint l'étape « Documents générés »."
      />

      <div className="card-elevated mb-4 grid gap-3 p-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setPage(1);
            }}
            placeholder="Rechercher un document…"
            className="pl-9"
          />
        </div>
        <Select value={type} onValueChange={(v) => { setType(v); setPage(1); }}>
          <SelectTrigger>
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les types</SelectItem>
            {DOC_TYPES.map((d) => (
              <SelectItem key={d} value={d}>
                {d}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={tenderFilter} onValueChange={(v) => { setTenderFilter(v); setPage(1); }}>
          <SelectTrigger>
            <SelectValue placeholder="Appel d'offres" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les dossiers</SelectItem>
            {visibleTenders
              .filter((t) => t.stage >= 4)
              .map((t) => (
                <SelectItem key={t.id} value={t.id}>
                  {t.ref}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={(v) => { setStatus(v); setPage(1); }}>
          <SelectTrigger>
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            {["Brouillon", "Finalisé", "Soumis"].map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="Aucun document pour cette recherche"
          hint="Les documents apparaissent dès qu'un dossier atteint l'étape « Documents générés »."
        />
      ) : (
        <div className="card-elevated overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-sm">
              <thead className="border-b border-border bg-secondary/60 text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 text-left">Document</th>
                  <th className="px-4 py-3 text-left">Appel d'offres</th>
                  <th className="px-4 py-3 text-left">Client</th>
                  <th className="px-4 py-3 text-left">Statut</th>
                  <th className="px-4 py-3 text-left">Généré le</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {items.map((d, i) => {
                  const t = byId.get(d.tenderId)!;
                  return (
                    <motion.tr
                      key={d.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="cursor-pointer border-b border-border/60 last:border-0 hover:bg-secondary/50"
                      onClick={() => navigate({ to: "/appels-offres/$id", params: { id: t.id } })}
                    >
                      <td className="px-4 py-3">
                        <span className="flex items-center gap-2 font-medium">
                          <FileText className="h-4 w-4 text-accent" /> {d.type}
                        </span>
                      </td>
                      <td className="px-4 py-3">{t.ref}</td>
                      <td className="px-4 py-3 text-muted-foreground">{t.client}</td>
                      <td className="px-4 py-3">
                        <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium">
                          {d.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{d.createdAt}</td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              setPreview({ tender: t, type: d.type });
                            }}
                          >
                            <Eye className="mr-1.5 h-3.5 w-3.5" /> Aperçu
                          </Button>
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              downloadTextFile(`${t.ref}-${d.type}.txt`, docContent(t, d.type));
                              toast.success(`${d.type} téléchargé`);
                            }}
                          >
                            <Download className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
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

      <Dialog open={!!preview} onOpenChange={(o) => !o && setPreview(null)}>
        <DialogContent className="max-h-[85vh] max-w-3xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display">{preview?.type}</DialogTitle>
          </DialogHeader>
          {preview && <DocPreview tender={preview.tender} type={preview.type} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
