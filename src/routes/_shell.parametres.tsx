import { Link, createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/_shell/parametres")({
  head: () => ({
    meta: [
      { title: "Paramètres — FZANA Control" },
      {
        name: "description",
        content: "Profil utilisateur, notifications et préférences du backoffice FZANA Systems.",
      },
      { property: "og:title", content: "Paramètres — FZANA Control" },
      { property: "og:description", content: "Gérez votre profil et vos préférences de notification." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { criteria, criteriaSaved } = useApp();
  const [name, setName] = useState("Naoual Elhaoussi");
  const [email, setEmail] = useState("agent@fzana.ma");
  const [alerts, setAlerts] = useState(true);
  const [digest, setDigest] = useState(true);

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="Paramètres" subtitle="Profil, notifications et rappel de la configuration de veille." />

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="card-elevated p-5">
        <h2 className="font-display text-base font-semibold">Profil</h2>
        <div className="clinical-rule my-4" />
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="n">Nom complet</Label>
            <Input id="n" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="e">Email</Label>
            <Input id="e" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Société</Label>
            <Input value="FZANA Systems" readOnly />
          </div>
          <div className="space-y-2">
            <Label>Rôle</Label>
            <Input value="Direction commerciale" readOnly />
          </div>
        </div>
        <Button className="mt-4" onClick={() => toast.success("Profil mis à jour")}>
          Enregistrer le profil
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="card-elevated mt-4 p-5"
      >
        <h2 className="font-display text-base font-semibold">Notifications</h2>
        <div className="clinical-rule my-4" />
        <div className="space-y-4">
          <label className="flex items-center justify-between gap-4">
            <span className="text-sm">
              Alertes en temps réel des nouveaux appels d'offres
              <span className="block text-xs text-muted-foreground">Envoyées dès qu'un dossier correspond à vos critères.</span>
            </span>
            <Switch
              checked={alerts}
              onCheckedChange={(v) => {
                setAlerts(v);
                toast(v ? "Alertes activées" : "Alertes désactivées");
              }}
            />
          </label>
          <label className="flex items-center justify-between gap-4">
            <span className="text-sm">
              Récapitulatif quotidien par email
              <span className="block text-xs text-muted-foreground">Synthèse de l'activité des agents IA.</span>
            </span>
            <Switch
              checked={digest}
              onCheckedChange={(v) => {
                setDigest(v);
                toast(v ? "Récapitulatif activé" : "Récapitulatif désactivé");
              }}
            />
          </label>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card-elevated mt-4 p-5"
      >
        <h2 className="font-display text-base font-semibold">Configuration de veille</h2>
        <div className="clinical-rule my-4" />
        <dl className="grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-xs text-muted-foreground">Statut</dt>
            <dd className="font-medium">{criteriaSaved ? "Active ✅" : "Non validée"}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Fréquence</dt>
            <dd className="font-medium">{criteria.frequency}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Catégories suivies</dt>
            <dd className="font-medium">{criteria.categories.length}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Portails</dt>
            <dd className="font-medium">{criteria.portals.join(", ")}</dd>
          </div>
        </dl>
        <Button asChild variant="outline" className="mt-4">
          <Link to="/criteres">Modifier les critères</Link>
        </Button>
      </motion.div>
    </div>
  );
}
