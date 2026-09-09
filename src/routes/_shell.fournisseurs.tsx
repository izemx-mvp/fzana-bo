import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { Mail, Phone, Search, Send } from "lucide-react";
import { toast } from "sonner";
import { EmptyState, PageHeader, Pagination } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CATEGORIES, SUPPLIERS } from "@/lib/mock-data";

export const Route = createFileRoute("/_shell/fournisseurs")({
  head: () => ({
    meta: [
      { title: "Fournisseurs — FZANA Control" },
      {
        name: "description",
        content: "Réseau de fournisseurs partenaires FZANA : disponibilité, gammes et contacts.",
      },
      { property: "og:title", content: "Fournisseurs — FZANA Control" },
      { property: "og:description", content: "Gérez et contactez les partenaires équipements médicaux." },
    ],
  }),
  component: SuppliersPage,
});

type Supplier = (typeof SUPPLIERS)[number];

function SuppliersPage() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [contact, setContact] = useState<Supplier | null>(null);
  const [message, setMessage] = useState("");

  const filtered = SUPPLIERS.filter((s) => {
    const text = `${s.name} ${s.city} ${s.contact} ${s.products.join(" ")}`.toLowerCase();
    if (q && !text.includes(q.toLowerCase())) return false;
    if (cat !== "all" && !s.products.includes(cat)) return false;
    return true;
  });
  const items = filtered.slice((page - 1) * pageSize, page * pageSize);

  const tone = (a: string) =>
    a === "Disponible"
      ? "bg-[color-mix(in_oklab,var(--success)_12%,white)] text-[var(--success)]"
      : a === "Stock limité"
        ? "bg-[color-mix(in_oklab,var(--warning)_14%,white)] text-[var(--warning)]"
        : "bg-[color-mix(in_oklab,var(--destructive)_10%,white)] text-destructive";

  return (
    <div>
      <PageHeader title="Fournisseurs" subtitle="Partenaires mobilisables pour répondre aux cahiers des charges." />

      <div className="card-elevated mb-4 grid gap-3 p-4 md:grid-cols-2">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setPage(1);
            }}
            placeholder="Rechercher un fournisseur…"
            className="pl-9"
          />
        </div>
        <Select value={cat} onValueChange={(v) => { setCat(v); setPage(1); }}>
          <SelectTrigger>
            <SelectValue placeholder="Gamme" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les gammes</SelectItem>
            {CATEGORIES.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="Aucun fournisseur trouvé" hint="Modifiez votre recherche ou la gamme sélectionnée." />
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {items.map((s, i) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -3 }}
                className="card-elevated p-5"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl gradient-brand font-display text-sm font-semibold text-primary-foreground">
                    {s.name
                      .split(" ")
                      .slice(0, 2)
                      .map((w) => w[0])
                      .join("")}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-display font-semibold">{s.name}</p>
                    <p className="text-xs text-muted-foreground">{s.city}</p>
                  </div>
                  <span className={`ml-auto rounded-full px-2.5 py-1 text-xs font-medium ${tone(s.availability)}`}>
                    {s.availability}
                  </span>
                </div>
                <div className="clinical-rule my-4" />
                <div className="flex flex-wrap gap-1.5">
                  {s.products.map((p) => (
                    <span key={p} className="rounded-full bg-accent-soft px-2.5 py-0.5 text-xs text-primary">
                      {p}
                    </span>
                  ))}
                </div>
                <div className="mt-4 space-y-1.5 text-sm text-muted-foreground">
                  <p className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5" /> {s.email}
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5" /> {s.phone}
                  </p>
                </div>
                <Button className="mt-4 w-full" variant="outline" onClick={() => setContact(s)}>
                  Contacter
                </Button>
              </motion.div>
            ))}
          </div>
          <Pagination
            page={page}
            pageSize={pageSize}
            total={filtered.length}
            onPage={setPage}
            onPageSize={setPageSize}
          />
        </>
      )}

      <Dialog open={!!contact} onOpenChange={(o) => !o && setContact(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-display">Contacter {contact?.name}</DialogTitle>
            <DialogDescription>
              {contact?.contact} · {contact?.email}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="objet">Objet</Label>
              <Input id="objet" defaultValue="Demande de disponibilité et de cotation" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="msg">Message</Label>
              <Textarea
                id="msg"
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Bonjour, dans le cadre d'un appel d'offres en cours…"
              />
            </div>
            <Button
              className="w-full"
              onClick={() => {
                toast.success(`Message envoyé à ${contact?.name}`);
                setContact(null);
                setMessage("");
              }}
            >
              <Send className="mr-2 h-4 w-4" /> Envoyer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
