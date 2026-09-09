import { Link, createFileRoute, useParams } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  Download,
  Eye,
  FileText,
  Lock,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import {
  ConformityBadge,
  DeadlineBadge,
  PageHeader,
  ScoreGauge,
  StatusBadge,
  downloadTextFile,
  formatMAD,
} from "@/components/common";
import { ProductModal } from "@/components/product-modal";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  DOC_TYPES,
  STAGES,
  conformityRate,
  productById,
  type DocType,
  type Product,
  type Tender,
} from "@/lib/mock-data";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/_shell/appels-offres/$id")({
  head: () => ({
    meta: [
      { title: "Détail de l'appel d'offres — FZANA Control" },
      {
        name: "description",
        content: "Fiche de synthèse, exigences techniques, matching produits et documents générés du dossier.",
      },
      { property: "og:title", content: "Détail de l'appel d'offres — FZANA Control" },
      { property: "og:description", content: "Suivi complet du dossier, de l'identification au résultat." },
    ],
  }),
  component: TenderDetail,
});

const TABS = ["Fiche de synthèse", "Exigences techniques", "Matching produits", "Documents", "Historique"] as const;
type Tab = (typeof TABS)[number];

const tabMinStage: Record<Tab, number> = {
  "Fiche de synthèse": 1,
  "Exigences techniques": 1,
  "Matching produits": 3,
  Documents: 4,
  Historique: 1,
};

export function docContent(t: Tender, type: DocType) {
  const head = [
    "FZANA SYSTEMS — Distribution d'équipements médicaux",
    "===================================================",
    `Document : ${type}`,
    `Appel d'offres : ${t.ref}`,
    `Client : ${t.client}`,
    `Budget estimé : ${formatMAD(t.budget)}`,
    `Date limite : ${new Date(t.deadline).toLocaleDateString("fr-FR")}`,
    "",
  ];
  if (type === "Mémoire technique") {
    head.push("RÉPONSE LIGNE PAR LIGNE AU CAHIER DES CHARGES", "");
    t.requirements.forEach((r, i) => {
      const p = productById(r.productId);
      head.push(
        `${i + 1}. ${r.article} (qté ${r.qty})`,
        `   Exigence : ${r.specs}`,
        `   Solution proposée : ${p.name} — réf. ${p.reference} (${p.supplier})`,
        `   Conformité : ${r.conformity} — score ${r.score}%`,
        "",
      );
    });
  } else if (type === "Bordereau des prix") {
    head.push("BORDEREAU DES PRIX UNITAIRES", "");
    t.requirements.forEach((r, i) => {
      const unit = Math.round(t.budget / (t.requirements.length * r.qty));
      head.push(`${i + 1}. ${r.article} — qté ${r.qty} × ${unit.toLocaleString("fr-MA")} MAD`);
    });
    head.push("", `TOTAL ESTIMÉ : ${formatMAD(t.budget)}`);
  } else if (type === "Acte d'engagement") {
    head.push(
      "Le soussigné, agissant au nom et pour le compte de FZANA SYSTEMS,",
      "s'engage à exécuter les prestations objet du présent marché conformément",
      "aux clauses du cahier des charges et aux prix du bordereau joint.",
      "",
      "Certificat d'enregistrement mobilisé : partenaire avec autorisation.",
      "",
      "Fait à Casablanca, signature : Mme Naoual Elhaoussi",
    );
  } else {
    head.push("DESCRIPTIF TECHNIQUE DÉTAILLÉ", "");
    t.requirements.forEach((r) => {
      const p = productById(r.productId);
      head.push(`• ${p.name} (${p.category})`, ...p.specs.map((s) => `   - ${s}`), "");
    });
  }
  return head.join("\n");
}

function TenderDetail() {
  const { id } = useParams({ from: "/_shell/appels-offres/$id" });
  const { getTender, advanceStage, setResult, docs, pushNotification } = useApp();
  const t = getTender(id);
  const [tab, setTab] = useState<Tab>("Fiche de synthèse");
  const [product, setProduct] = useState<Product | null>(null);
  const [previewDoc, setPreviewDoc] = useState<DocType | null>(null);
  const [generating, setGenerating] = useState<number | null>(null);
  const [advancing, setAdvancing] = useState(false);

  useEffect(() => {
    if (generating === null) return;
    if (generating >= DOC_TYPES.length) {
      const to = setTimeout(() => setGenerating(null), 700);
      return () => clearTimeout(to);
    }
    const to = setTimeout(() => setGenerating((g) => (g ?? 0) + 1), 700);
    return () => clearTimeout(to);
  }, [generating]);

  if (!t) {
    return (
      <div>
        <PageHeader title="Dossier introuvable" />
        <Button asChild variant="outline">
          <Link to="/appels-offres">Retour à la liste</Link>
        </Button>
      </div>
    );
  }

  const tenderDocs = docs.filter((d) => d.tenderId === t.id);

  const next = () => {
    if (t.stage >= 6) return;
    setAdvancing(true);
    setTimeout(() => {
      const target = t.stage + 1;
      advanceStage(t.id);
      setAdvancing(false);
      if (target === 4) {
        setGenerating(0);
        setTab("Documents");
        pushNotification(`4 documents générés pour ${t.ref}`);
      }
      toast.success(`Dossier passé à l'étape « ${STAGES[target - 1]} »`);
    }, 800);
  };

  return (
    <div>
      <Button asChild variant="ghost" size="sm" className="mb-3 -ml-2">
        <Link to="/appels-offres">
          <ArrowLeft className="mr-2 h-4 w-4" /> Retour aux appels d'offres
        </Link>
      </Button>

      <PageHeader
        title={t.ref}
        subtitle={`${t.client} · ${t.city} · ${t.category}`}
        actions={
          <>
            <StatusBadge status={t.status} />
            <DeadlineBadge deadline={t.deadline} />
            <span className="rounded-md bg-secondary px-2.5 py-1 text-sm font-medium tabular-nums">
              {formatMAD(t.budget)}
            </span>
          </>
        }
      />

      {/* Stepper */}
      <div className="card-elevated mb-6 p-5">
        <div className="flex flex-wrap items-center gap-y-4">
          {STAGES.map((s, i) => {
            const n = i + 1;
            const done = t.stage > n;
            const current = t.stage === n;
            return (
              <div key={s} className="flex flex-1 items-center gap-3 min-w-[150px]">
                <div className="relative">
                  {current && (
                    <span className="absolute inset-0 animate-ping rounded-full bg-accent/40" aria-hidden />
                  )}
                  <span
                    className={`relative flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold transition-colors ${
                      done
                        ? "bg-[var(--success)] text-white"
                        : current
                          ? "bg-accent text-accent-foreground"
                          : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {done ? <Check className="h-4 w-4" /> : n}
                  </span>
                </div>
                <div className="min-w-0">
                  <p
                    className={`truncate text-sm ${current ? "font-semibold text-foreground" : done ? "text-foreground" : "text-muted-foreground"}`}
                  >
                    {s}
                  </p>
                  {n === 6 && t.result ? (
                    <p className="text-xs text-muted-foreground">{t.result}</p>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
        <div className="clinical-rule my-4" />
        <div className="flex flex-wrap items-center gap-3">
          <Progress value={(t.stage / 6) * 100} className="h-2 flex-1 min-w-40" />
          {t.stage === 5 ? (
            <>
              <Button onClick={() => setResult(t.id, "Gagné")}>
                <CheckCircle2 className="mr-2 h-4 w-4" /> Marché gagné
              </Button>
              <Button variant="outline" onClick={() => setResult(t.id, "Perdu")}>
                Marché perdu
              </Button>
            </>
          ) : t.stage === 4 ? (
            <Button
              disabled={advancing}
              onClick={() => {
                next();
                toast.success("Dossier marqué comme soumis");
              }}
            >
              <CheckCircle2 className="mr-2 h-4 w-4" /> Marquer comme soumis
            </Button>
          ) : (
            <Button disabled={t.stage >= 6 || advancing} onClick={next}>
              <Sparkles className="mr-2 h-4 w-4" />
              {t.stage >= 6 ? "Dossier clôturé" : "Passer à l'étape suivante"}
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <TooltipProvider>
        <div className="mb-4 flex flex-wrap gap-1 border-b border-border">
          {TABS.map((label) => {
            const locked = t.stage < tabMinStage[label];
            const active = tab === label;
            const btn = (
              <button
                key={label}
                disabled={locked}
                onClick={() => setTab(label)}
                className={`relative flex items-center gap-1.5 px-4 py-2.5 text-sm transition-colors ${
                  locked
                    ? "cursor-not-allowed text-muted-foreground/50"
                    : active
                      ? "font-medium text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {locked && <Lock className="h-3.5 w-3.5" />}
                {label}
                {active && (
                  <motion.span layoutId="tab-underline" className="absolute inset-x-2 -bottom-px h-0.5 rounded bg-accent" />
                )}
              </button>
            );
            return locked ? (
              <Tooltip key={label}>
                <TooltipTrigger asChild>
                  <span>{btn}</span>
                </TooltipTrigger>
                <TooltipContent>
                  Disponible à partir de l'étape « {STAGES[tabMinStage[label] - 1]} »
                </TooltipContent>
              </Tooltip>
            ) : (
              btn
            );
          })}
        </div>
      </TooltipProvider>

      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.22 }}
        >
          {tab === "Fiche de synthèse" && (
            <div className="grid gap-4 lg:grid-cols-3">
              <div className="card-elevated p-5 lg:col-span-2">
                <h2 className="font-display text-base font-semibold">Synthèse générée par l'IA</h2>
                <div className="clinical-rule my-4" />
                {advancing ? (
                  <div className="space-y-3">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                ) : (
                  <ul className="space-y-3">
                    {t.summary.map((s) => (
                      <li key={s} className="flex gap-3 text-sm">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                        {s}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="card-elevated p-5">
                <h2 className="font-display text-base font-semibold">Indicateurs</h2>
                <div className="clinical-rule my-4" />
                <dl className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Articles demandés</dt>
                    <dd className="font-medium">{t.requirements.length}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Budget</dt>
                    <dd className="font-medium tabular-nums">{formatMAD(t.budget)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Ville</dt>
                    <dd className="font-medium">{t.city}</dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="text-muted-foreground">Conformité globale</dt>
                    <dd>
                      <ScoreGauge value={conformityRate(t)} />
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          )}

          {tab === "Exigences techniques" && (
            <div className="card-elevated overflow-x-auto">
              <table className="w-full min-w-[720px] text-sm">
                <thead className="border-b border-border bg-secondary/60 text-xs uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 text-left">Article demandé</th>
                    <th className="px-4 py-3 text-left">Quantité</th>
                    <th className="px-4 py-3 text-left">Spécifications</th>
                    <th className="px-4 py-3 text-left">Conformité</th>
                  </tr>
                </thead>
                <tbody>
                  {t.requirements.map((r) => (
                    <tr key={r.id} className="border-b border-border/60 last:border-0">
                      <td className="px-4 py-3 font-medium">{r.article}</td>
                      <td className="px-4 py-3 tabular-nums">{r.qty}</td>
                      <td className="px-4 py-3 text-muted-foreground">{r.specs}</td>
                      <td className="px-4 py-3">
                        <ConformityBadge value={r.conformity} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tab === "Matching produits" && (
            <div className="space-y-3">
              {t.requirements.map((r, i) => {
                const p = productById(r.productId);
                return (
                  <motion.div
                    key={r.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="card-elevated flex flex-wrap items-center gap-4 p-4"
                  >
                    <div className="min-w-52 flex-1">
                      <p className="text-xs text-muted-foreground">Exigence</p>
                      <p className="font-medium">{r.article}</p>
                      <p className="text-sm text-muted-foreground">{r.specs}</p>
                    </div>
                    <div className="min-w-52 flex-1">
                      <p className="text-xs text-muted-foreground">Produit proposé</p>
                      <p className="font-medium">{p.name}</p>
                      <p className="text-sm text-muted-foreground">{p.supplier}</p>
                    </div>
                    <ScoreGauge value={r.score} />
                    <ConformityBadge value={r.conformity} />
                    <Button size="sm" variant="outline" onClick={() => setProduct(p)}>
                      <Eye className="mr-1.5 h-3.5 w-3.5" /> Aperçu
                    </Button>
                  </motion.div>
                );
              })}
            </div>
          )}

          {tab === "Documents" && (
            <div>
              {generating !== null && (
                <div className="card-elevated mb-4 p-5">
                  <p className="font-display text-sm font-semibold">Génération documentaire en cours…</p>
                  <Progress value={(generating / DOC_TYPES.length) * 100} className="my-3 h-2" />
                  <ul className="space-y-2">
                    {DOC_TYPES.map((d, i) => (
                      <li key={d} className="flex items-center gap-2 text-sm">
                        {i < generating ? (
                          <CheckCircle2 className="h-4 w-4 text-[var(--success)]" />
                        ) : (
                          <span className="h-4 w-4 rounded-full border border-border" />
                        )}
                        <span className={i < generating ? "" : "text-muted-foreground"}>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="grid gap-3 md:grid-cols-2">
                {tenderDocs.map((d, i) => (
                  <motion.div
                    key={d.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="card-elevated flex items-center gap-4 p-4"
                  >
                    <span className="rounded-lg bg-accent-soft p-2.5">
                      <FileText className="h-5 w-5 text-accent" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{d.type}</p>
                      <p className="text-xs text-muted-foreground">
                        {d.status} · généré le {d.createdAt}
                      </p>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => setPreviewDoc(d.type)}>
                      <Eye className="mr-1.5 h-3.5 w-3.5" /> Aperçu
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => {
                        downloadTextFile(`${t.ref}-${d.type}.txt`, docContent(t, d.type));
                        toast.success(`${d.type} téléchargé`);
                      }}
                    >
                      <Download className="h-3.5 w-3.5" />
                    </Button>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {tab === "Historique" && (
            <div className="card-elevated p-5">
              <ol className="relative space-y-5 border-l border-clinical-line pl-6">
                {t.history.map((h, i) => (
                  <motion.li
                    key={`${h.at}-${i}`}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <span className="absolute -left-[7px] mt-1.5 h-3 w-3 rounded-full border-2 border-background bg-accent" />
                    <p className="text-sm font-medium">{h.label}</p>
                    <p className="text-xs text-muted-foreground">{h.at}</p>
                  </motion.li>
                ))}
              </ol>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <ProductModal product={product} onOpenChange={(o) => !o && setProduct(null)} />

      <Dialog open={!!previewDoc} onOpenChange={(o) => !o && setPreviewDoc(null)}>
        <DialogContent className="max-h-[85vh] max-w-3xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display">{previewDoc}</DialogTitle>
          </DialogHeader>
          {previewDoc && <DocPreview tender={t} type={previewDoc} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export function DocPreview({ tender, type }: { tender: Tender; type: DocType }) {
  return (
    <div className="rounded-lg border border-border bg-card p-8 font-sans text-sm shadow-sm">
      <div className="flex items-start justify-between border-b border-clinical-line pb-4">
        <div>
          <p className="font-display text-lg font-semibold text-primary">FZANA SYSTEMS</p>
          <p className="text-xs text-muted-foreground">Distribution d'équipements médicaux — Casablanca, Maroc</p>
        </div>
        <div className="text-right text-xs text-muted-foreground">
          <p>{type}</p>
          <p>{tender.ref}</p>
        </div>
      </div>

      <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
        <div>
          <dt className="text-xs text-muted-foreground">Maître d'ouvrage</dt>
          <dd className="font-medium">{tender.client}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Budget estimé</dt>
          <dd className="font-medium tabular-nums">{formatMAD(tender.budget)}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Date limite</dt>
          <dd className="font-medium">{new Date(tender.deadline).toLocaleDateString("fr-FR")}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Lieu d'exécution</dt>
          <dd className="font-medium">{tender.city}</dd>
        </div>
      </dl>

      <h3 className="mt-6 font-display text-sm font-semibold uppercase tracking-wide">
        {type === "Bordereau des prix"
          ? "Bordereau des prix unitaires"
          : type === "Acte d'engagement"
            ? "Engagement du soumissionnaire"
            : "Réponse au cahier des charges"}
      </h3>
      <div className="clinical-rule my-3" />

      {type === "Acte d'engagement" ? (
        <div className="space-y-3 leading-relaxed">
          <p>
            Le soussigné, agissant au nom et pour le compte de <strong>FZANA SYSTEMS</strong>, s'engage à
            exécuter les prestations objet du marché <strong>{tender.ref}</strong> conformément aux clauses du
            cahier des charges et aux prix portés au bordereau joint.
          </p>
          <p>Certificat d'enregistrement mobilisé : partenaire avec autorisation.</p>
          <p className="pt-6">Fait à Casablanca, le {new Date().toLocaleDateString("fr-FR")}</p>
          <p className="font-medium">Mme Naoual Elhaoussi — Direction commerciale</p>
        </div>
      ) : (
        <table className="w-full text-left text-xs">
          <thead className="border-b border-border text-muted-foreground">
            <tr>
              <th className="py-2">Désignation</th>
              <th className="py-2">Qté</th>
              <th className="py-2">Solution FZANA</th>
              <th className="py-2">{type === "Bordereau des prix" ? "Montant (MAD)" : "Conformité"}</th>
            </tr>
          </thead>
          <tbody>
            {tender.requirements.map((r) => {
              const p = productById(r.productId);
              const unit = Math.round(tender.budget / tender.requirements.length);
              return (
                <tr key={r.id} className="border-b border-border/60">
                  <td className="py-2 pr-3">{r.article}</td>
                  <td className="py-2 pr-3 tabular-nums">{r.qty}</td>
                  <td className="py-2 pr-3">
                    {p.name} <span className="text-muted-foreground">({p.reference})</span>
                  </td>
                  <td className="py-2 tabular-nums">
                    {type === "Bordereau des prix" ? unit.toLocaleString("fr-MA") : `${r.conformity} · ${r.score}%`}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      <p className="mt-6 border-t border-clinical-line pt-3 text-[11px] text-muted-foreground">
        Document généré automatiquement par FZANA Control — Agent Matching Technique & Catalogue.
      </p>
    </div>
  );
}
