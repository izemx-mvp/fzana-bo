# FZANA Control Center

# Prompt Lovable — Backoffice FZANA Systems

Copiez-collez tout le bloc ci-dessous dans Lovable pour générer le backoffice.

---

## PROMPT À COLLER DANS LOVABLE

Crée une application web **backoffice / tableau de bord interne** pour **FZANA Systems**, une entreprise marocaine spécialisée dans la distribution d'équipements médicaux qui répond à des appels d'offres publics (marchés publics). Ce backoffice est utilisé en interne par l'équipe commerciale pour piloter des agents IA qui automatisent la veille des appels d'offres, le matching produits/catalogue, et la génération de documents techniques.

Le design doit être somptueux, moderne, animé, du niveau d'un SaaS premium (type Linear, Vercel Dashboard, Notion). Aucune page ne doit avoir un bouton mort : chaque filtre, recherche, pagination, action "voir détail", "traiter", "aperçu", "télécharger" doit fonctionner réellement avec les données mockées (état local, pas besoin de vrai backend, mais tout doit se comporter comme si c'était réel : chargement, mise à jour d'état, feedback visuel).

### 1. Identité visuelle (à respecter à l'identique — même site vitrine que https://fzana.izemxlab.com)

Utilise EXACTEMENT ces tokens de design (copie-les tels quels dans le thème Tailwind / CSS `:root`) :

```css
:root {
  --background: oklch(100% 0 0);
  --foreground: oklch(26% .014 240);
  --card: oklch(100% 0 0);
  --card-foreground: oklch(26% .014 240);

  --primary: oklch(36% .072 249);         /* bleu marine/acier — couleur de marque principale */
  --primary-dark: oklch(29% .062 250);
  --primary-glow: oklch(48% .102 238);
  --primary-foreground: oklch(99% 0 0);

  --accent: oklch(63% .104 178);          /* teal/cyan médical — couleur d'accent */
  --accent-soft: oklch(95% .026 178);
  --accent-glow: oklch(78% .12 178);
  --accent-foreground: oklch(99% 0 0);

  --secondary: oklch(97.2% .003 220);
  --secondary-foreground: oklch(36% .072 249);

  --muted: oklch(97.2% .003 220);
  --muted-foreground: oklch(52% .014 245);

  --border: oklch(91% .006 240);
  --input: oklch(91% .006 240);
  --ring: oklch(63% .104 178);

  --destructive: oklch(57.7% .245 27.325);
  --charcoal: oklch(30% .008 240);
  --clinical-line: oklch(88% .025 210);   /* fine ligne décorative "médicale" utilisée sur le site vitrine */

  --radius: .5rem;
  --font-sans: "DM Sans", "Segoe UI", sans-serif;
  --font-display: "Space Grotesk", "Segoe UI", sans-serif;
}
```

Résumé lisible de la palette : fond blanc, texte gris-anthracite très foncé, couleur de marque principale = **bleu marine/acier profond**, couleur d'accent = **teal/cyan clinique**, dégradés subtils primary → accent sur les éléments hero et les CTA. Coins arrondis modérés (radius 0.5rem), lignes fines "clinical-line" en séparateurs discrets pour rappeler l'univers médical/hospitalier.

- **Logo** (à utiliser dans la sidebar et l'écran de login) : `https://fzana.izemxlab.com/assets/fzana-logo-DBUnkOwq.png`
- **Favicon** (à utiliser tel quel pour l'onglet du navigateur) : `https://fzana.izemxlab.com/favicon.png`
- **Polices** : titres/display en "Space Grotesk", corps de texte en "DM Sans" (fallback Segoe UI, sans-serif). Charge ces deux polices via Google Fonts.
- **Ton visuel** : clinique, précis, digne de confiance, professionnel — pas ludique/coloré. Animations fluides (framer-motion) : fade-in + slide léger au chargement des listes, transitions douces entre états, micro-interactions au survol des boutons/cartes, skeleton loaders pendant les "traitements IA" simulés, barres de progression animées pour les agents IA en action.

### 2. Écran de connexion (login)

- Design plein écran, moitié gauche : formulaire de connexion sur fond blanc avec logo FZANA Systems en haut. Moitié droite (desktop uniquement) : panneau avec dégradé animé primary → accent, avec le nom de l'app en grand ("FZANA Control" ou "FZANA Backoffice") et une illustration/motif abstrait animé (formes géométriques flottantes lentes, subtil).
- Champs email + mot de passe, **pré-remplis automatiquement** avec des identifiants de démonstration visibles à l'écran :
  - Email : `agent@fzana.ma`
  - Mot de passe : `Demo@2026`
  - Ajoute un petit encart "Accès démonstration" sous le formulaire qui rappelle ces identifiants, plus un bouton "Connexion instantanée (démo)" qui remplit et soumet le formulaire en un clic.
- Après connexion (aucune vraie auth requise, juste une transition), redirection animée vers le Dashboard.

### 3. Structure générale de l'app

Sidebar fixe à gauche (collapsible), avec logo FZANA en haut, puis ces sections avec icônes :

1. **Configuration des critères** (à compléter en premier — prérequis avant toute veille)
2. **Tableau de bord**
3. **Appels d'offres** (le cœur de l'app)
4. **Matching Catalogue**
5. **Documents générés**
6. **Fournisseurs**
7. **Certificats & Conformité**
8. **Agents IA**
9. **Paramètres**

Il n'y a **pas** de page "Catalogue Produits" séparée dans cette application — ne génère aucune page de gestion/catalogue produits autonome. Les informations produit nécessaires (nom, catégorie, specs, image) n'apparaissent qu'en contexte, à l'intérieur de l'onglet "Matching produits" d'un appel d'offres ou de la page "Matching Catalogue", via des modals d'aperçu — jamais comme une section de navigation à part entière.

En haut de chaque page : barre supérieure avec breadcrumb, barre de recherche globale, icône de notifications (avec badge animé), avatar utilisateur (Mme Naoual Elhaoussi, FZANA Systems) avec menu déroulant (Profil / Déconnexion).

### 4. Page "Configuration des critères" (obligatoire, à compléter avant toute recherche)

Cette page est le point de départ logique de l'application : c'est ici que l'utilisatrice définit ses propres critères internes, qui servent de premier filtre à l'Agent de Veille — **avant même** le filtrage sectoriel et la recherche sur le portail. Tant que cette configuration n'est pas validée, la veille automatique ne doit pas pouvoir être lancée.

- Formulaire structuré en sections, chacune avec un état "complété/incomplet" visible :
  - **Catégories suivies** : cases à cocher (Bloc opératoire, Diagnostic, Mobilier médical, Réanimation, Consommables, Stérilisation).
  - **Zone géographique** : villes/régions du Maroc à surveiller (sélection multiple avec tags).
  - **Budget cible** : montant minimum et maximum à considérer (champ en MAD).
  - **Mots-clés à inclure / à exclure** : deux champs de tags dynamiques, ajout/suppression en direct.
  - **Certificat détenu** : sélection du statut réel de la cliente — "Certificat FZANA (en cours de renouvellement)" ou "Certificat d'un partenaire avec autorisation" — avec un bouton d'upload factice du justificatif (barre de progression simulée).
  - **Portails surveillés** : marchespublics.gov.ma coché par défaut (checkbox, liste extensible).
  - **Fréquence de la veille automatique** : sélecteur (Toutes les heures / Quotidienne / Manuelle).
- Bouton principal "Enregistrer la configuration" : une fois cliqué, affiche un état "Configuration active ✅" en haut de page et débloque la veille partout ailleurs dans l'app.
- **Tant que la configuration n'est pas validée** : afficher un bandeau d'avertissement orange sur le Tableau de bord et sur la page Appels d'offres ("Configurez vos critères de veille avant de lancer une recherche"), avec le bouton "Lancer la veille" désactivé et un lien direct vers cette page.
- Une fois validée, les critères doivent réellement influencer les données affichées ensuite (ex. décocher une catégorie retire les appels d'offres mockés de cette catégorie des résultats de la page Appels d'offres), pour que la configuration ait un effet visible et pas juste décoratif.

### 5. Page "Tableau de bord"

- 4 à 6 cartes KPI animées (compteur qui s'incrémente au chargement) : "Appels d'offres actifs", "Budget total suivi (MAD)", "Taux de conformité produits", "Dossiers soumis ce mois", "Certificats à renouveler".
- Graphique (courbe ou barres) de l'activité des 30 derniers jours (appels d'offres identifiés vs soumis).
- Liste "Activité récente des agents IA" : flux d'événements type "Agent Veille a identifié 3 nouveaux appels d'offres — il y a 12 min", "Agent Matching a terminé l'analyse du dossier CHU-2026-0142 — il y a 1h", avec icônes d'agent animées (pulse).
- Widget "Échéances à venir" : liste des appels d'offres avec date limite proche, triée par urgence, avec badges de couleur (rouge <3 jours, orange <7 jours, vert au-delà).

### 6. Page "Appels d'offres" (liste principale)

- Barre d'outils : champ de recherche (filtre en temps réel sur nom client / numéro / mots-clés), filtres déroulants fonctionnels par **Statut** (Nouveau, En analyse, Conforme, Non conforme, Soumis, Gagné, Perdu), **Secteur**, **Budget** (min/max), **Date limite** (plage de dates), bouton "Réinitialiser les filtres".
- Tableau ou grille de cartes (au choix, avec un toggle vue liste/grille) affichant pour chaque appel d'offres : numéro de référence, client, budget estimé, date limite, statut (badge coloré), nombre d'articles/lignes du cahier des charges, mini-jauge de conformité produit (%).
- **Pagination fonctionnelle** en bas (ex. 10/25/50 par page, avec numéros de page cliquables + précédent/suivant), le tri des colonnes doit aussi fonctionner (clic sur un en-tête de colonne = tri asc/desc avec icône flèche).
- Génère au moins **18-20 appels d'offres mockés réalistes**, secteur santé/hôpitaux marocains (CHU Ibn Rochd, Hôpital Cheikh Zaid, Ministère de la Santé, cliniques privées, etc.), avec des articles types réels : aspirateur chirurgical électrique, table d'opération électrique, éclairage chirurgical LED, moniteur multiparamétrique, lit médicalisé, stérilisateur autoclave, etc.
- Bouton "Voir le détail" sur chaque ligne/carte → navigue vers la page de détail (section 7).
- Bouton "Lancer l'analyse IA" sur les appels d'offres au statut "Nouveau" → déclenche une animation de traitement (barre de progression + étapes affichées : "Téléchargement du dossier… Extraction des exigences… Génération de la fiche…") puis passe le statut à "En analyse" puis "Conforme"/"Non conforme" avec un toast de confirmation.

### 7. Page détail d'un appel d'offres

- En-tête avec numéro, client, statut, budget, date limite, bouton retour.
- **Stepper de progression** en haut de page (composant horizontal type "étapes de commande"), avec 6 étapes : **1) Identifié → 2) Analysé (fiche générée) → 3) Matching produits → 4) Documents générés → 5) Soumis → 6) Résultat (Gagné/Perdu)**. L'étape en cours est mise en évidence en couleur accent avec une animation pulse, les étapes complétées affichent un check vert animé, les étapes futures restent grisées. Un bouton "Passer à l'étape suivante" fait réellement avancer le dossier (met à jour son statut, débloque l'onglet et les actions correspondant à l'étape suivante), avec une transition animée à chaque changement. **Chaque appel d'offre mocké doit pouvoir être suivi de bout en bout à travers ces 6 étapes** — ne génère pas de dossiers figés sur un seul statut ; répartis les 18-20 appels d'offres mockés à différents stades du parcours pour que l'app démontre le cycle complet dès le premier chargement.
- Onglets : **Fiche de synthèse** / **Exigences techniques** / **Matching produits** / **Documents** / **Historique**. Les onglets "Matching produits" et "Documents" restent verrouillés (grisés, avec tooltip explicatif) tant que l'étape correspondante du stepper n'est pas atteinte — cohérence stricte entre le stepper et le contenu accessible.
- **Fiche de synthèse** (générée par l'agent IA) : budget, client, numéro, exigences résumées, nombre d'articles, résumé en 3-4 points générés façon "IA a analysé ce dossier et identifié...".
- **Exigences techniques** : tableau ligne par ligne du cahier des charges (article demandé, quantité, spécifications), avec statut de conformité par ligne (✅ Conforme / ⚠️ À vérifier / ❌ Non conforme).
- **Matching produits** : pour chaque ligne d'exigence, le(s) produit(s) correspondant proposé(s), avec score de conformité et un bouton **"Aperçu"** qui ouvre un modal avec les specs du produit (image, catégorie, fournisseur, fiche technique) — tout se fait en modal directement depuis cet onglet, il n'y a pas de page catalogue séparée à visiter.
- **Documents** : dès que le dossier atteint l'étape "Documents générés", **l'ensemble complet des documents nécessaires à ce dossier précis doit apparaître automatiquement** dans la liste — la génération n'est jamais optionnelle ni partielle, chaque appel d'offre produit systématiquement :
  1. Mémoire technique (réponse ligne par ligne au cahier des charges)
  2. Document descriptif technique
  3. Bordereau des prix
  4. Acte d'engagement
  Affiche une animation de génération au moment où cette étape est franchie (barre de progression avec les 4 noms de documents qui apparaissent un par un, façon checklist qui se coche). Chaque document généré a ensuite deux boutons fonctionnels : **"Aperçu"** (ouvre un modal de prévisualisation avec un rendu simulé mais soigné du contenu, mise en page façon document officiel — en-tête FZANA, sections, tableau des lignes du cahier des charges pour le mémoire technique) et **"Télécharger"** (déclenche un vrai téléchargement de fichier généré côté client, ex. blob PDF/texte).
- **Historique** : journal chronologique horodaté de chaque étape franchie pour ce dossier (ex. "12/09 09:14 — Dossier identifié par l'Agent Veille", "12/09 10:02 — Fiche de synthèse générée", "13/09 08:30 — 4 documents générés", etc.).
- Bouton "Marquer comme soumis" (disponible à l'étape 5) qui change le statut avec animation de confirmation (check animé), puis permet de renseigner le résultat final (Gagné/Perdu) à l'étape 6.

### 8. Page "Matching Catalogue"

- Vue transverse tous appels d'offres confondus : tableau des correspondances produit ↔ exigence, avec recherche, filtre par catégorie de produit (Bloc opératoire, Diagnostic, Mobilier médical, Réanimation, Consommables, Stérilisation — mêmes catégories que le site vitrine), filtre par statut de conformité, pagination fonctionnelle.
- Bouton "Aperçu" sur chaque ligne ouvre le même modal produit qu'à la section 7 (pas de page catalogue séparée).
- Bouton "Relancer le matching" avec animation de traitement.

### 9. Page "Documents générés"

- Vue transverse : liste de **tous** les documents générés automatiquement pour **tous** les appels d'offres ayant atteint l'étape "Documents générés" (les 4 documents par dossier décrits en section 7), avec recherche, filtre par type de document, par appel d'offre d'origine et par statut (Brouillon / Finalisé / Soumis), pagination fonctionnelle.
- Boutons **Aperçu** et **Télécharger** fonctionnels sur chaque ligne (mêmes mécaniques qu'en section 7) — cliquer sur une ligne renvoie aussi vers l'onglet "Documents" de l'appel d'offres correspondant.

### 10. Page "Fournisseurs"

- Liste des fournisseurs partenaires avec logo/initiales, produits fournis, statut de disponibilité, coordonnées de contact, recherche + filtres, pagination.
- Bouton "Contacter" (ouvre un modal avec formulaire, simule l'envoi avec toast de succès).

### 11. Page "Certificats & Conformité"

- Suivi des certificats d'enregistrement de matériel médical : liste avec produit/catégorie concernée, titulaire du certificat (FZANA ou partenaire avec autorisation), date d'expiration, statut (Valide / En renouvellement / Expiré bientôt) avec badges colorés et alertes visuelles animées pour les renouvellements proches.
- Reflète explicitement le cas réel de la cliente : son propre certificat est en cours de renouvellement, et elle utilise actuellement le certificat d'un partenaire avec autorisation — inclure cette ligne précise dans les données mockées.

### 12. Page "Agents IA"

- Cartes pour chaque agent : **Agent Veille & Analyse des Appels d'Offres** et **Agent Matching Technique & Catalogue**, chacune avec statut (Actif/En pause), toggle on/off fonctionnel, dernière exécution, nombre d'actions effectuées aujourd'hui, bouton "Lancer maintenant" qui déclenche une animation de traitement en direct (logs qui défilent en style terminal/console, façon "agent au travail").
- Design "wow" ici en particulier : anneaux de progression animés, pulsations lumineuses type IA, effet glow avec la couleur accent teal.

### 13. Exigences techniques transverses

- Stack : React + Tailwind + shadcn/ui + framer-motion, entièrement responsive (mobile → sidebar en drawer).
- Toutes les données sont mockées en state local (tableaux JS réalistes et cohérents entre les pages — un même appel d'offres doit avoir les mêmes infos partout où il apparaît).
- Chaque action (filtrer, rechercher, paginer, trier, voir détail, lancer une analyse, télécharger, ajouter, contacter) doit produire un changement d'état réel et visible, jamais un bouton qui ne fait rien.
- Toasts de confirmation cohérents sur chaque action importante.
- États vides bien dessinés (ex. "Aucun résultat pour cette recherche") et états de chargement (skeletons) sur les actions simulées d'IA.
- Mode clair uniquement, cohérent avec le site vitrine.

---

*Prompt préparé à partir du design réel extrait de https://fzana.izemxlab.com/ (logo, favicon, variables de couleur, polices) pour garantir une continuité visuelle parfaite entre le site vitrine et le backoffice.*

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/6f0ac929-e286-4567-bbba-20ebb1b376ba).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
