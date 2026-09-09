export type Category =
  | "Bloc opératoire"
  | "Diagnostic"
  | "Mobilier médical"
  | "Réanimation"
  | "Consommables"
  | "Stérilisation";

export const CATEGORIES: Category[] = [
  "Bloc opératoire",
  "Diagnostic",
  "Mobilier médical",
  "Réanimation",
  "Consommables",
  "Stérilisation",
];

export const CITIES = [
  "Casablanca",
  "Rabat",
  "Marrakech",
  "Fès",
  "Tanger",
  "Agadir",
  "Oujda",
  "Meknès",
];

export type Conformity = "Conforme" | "À vérifier" | "Non conforme";

export type TenderStatus =
  "Nouveau" | "En analyse" | "Conforme" | "Non conforme" | "Soumis" | "Gagné" | "Perdu";

export const STAGES = [
  "Identifié",
  "Analysé",
  "Matching produits",
  "Documents générés",
  "Soumis",
  "Résultat",
] as const;

export type Product = {
  id: string;
  name: string;
  category: Category;
  supplier: string;
  specs: string[];
  reference: string;
};

export type Requirement = {
  id: string;
  article: string;
  qty: number;
  specs: string;
  conformity: Conformity;
  productId: string;
  score: number;
};

export type DocType =
  | "Mémoire technique"
  | "Document descriptif technique"
  | "Bordereau des prix"
  | "Acte d'engagement";

export const DOC_TYPES: DocType[] = [
  "Mémoire technique",
  "Document descriptif technique",
  "Bordereau des prix",
  "Acte d'engagement",
];

export type GeneratedDoc = {
  id: string;
  tenderId: string;
  type: DocType;
  status: "Brouillon" | "Finalisé" | "Soumis";
  createdAt: string;
};

export type HistoryEntry = { at: string; label: string };

export type Tender = {
  id: string;
  ref: string;
  client: string;
  city: string;
  category: Category;
  budget: number;
  deadline: string;
  status: TenderStatus;
  stage: number; // 1..6
  requirements: Requirement[];
  summary: string[];
  history: HistoryEntry[];
  result?: "Gagné" | "Perdu" | undefined;
};

export const PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "Aspirateur chirurgical électrique AS-900",
    category: "Bloc opératoire",
    supplier: "MedTech Maghreb",
    reference: "FZ-AS900",
    specs: [
      "Débit 60 L/min",
      "Bocal 2 x 4 L autoclavable",
      "Niveau sonore < 55 dB",
      "Marquage CE / ISO 13485",
    ],
  },
  {
    id: "p2",
    name: "Table d'opération électrique TO-Elite",
    category: "Bloc opératoire",
    supplier: "Atlas Medical Supply",
    reference: "FZ-TOE1",
    specs: [
      "Charge max 250 kg",
      "Commande filaire + pédale",
      "Plateau radio-transparent",
      "Trendelenburg ±30°",
    ],
  },
  {
    id: "p3",
    name: "Éclairage chirurgical LED Lumia 5",
    category: "Bloc opératoire",
    supplier: "MedTech Maghreb",
    reference: "FZ-LUM5",
    specs: ["160 000 lux à 1 m", "IRC 96", "Température 3800–5000 K", "Bras double coupole"],
  },
  {
    id: "p4",
    name: "Moniteur multiparamétrique MP-12",
    category: "Diagnostic",
    supplier: "Sanitas Distribution",
    reference: "FZ-MP12",
    specs: [
      "ECG 12 dérivations",
      "SpO2, PNI, T°, CO2",
      'Écran tactile 12,1"',
      "Autonomie batterie 5 h",
    ],
  },
  {
    id: "p5",
    name: "Lit médicalisé électrique 4 sections",
    category: "Mobilier médical",
    supplier: "Atlas Medical Supply",
    reference: "FZ-LM4S",
    specs: [
      "Hauteur variable 40–80 cm",
      "Barrières rabattables ABS",
      "Freins centralisés",
      "Charge 220 kg",
    ],
  },
  {
    id: "p6",
    name: "Stérilisateur autoclave 90 L",
    category: "Stérilisation",
    supplier: "Cleanmed Industrie",
    reference: "FZ-AUT90",
    specs: ["Vide fractionné classe B", "Cycle 134 °C / 18 min", "Imprimante intégrée", "EN 13060"],
  },
  {
    id: "p7",
    name: "Respirateur de réanimation RV-Pro",
    category: "Réanimation",
    supplier: "Sanitas Distribution",
    reference: "FZ-RVPRO",
    specs: ["Modes VC, PC, VNI, AI", "Turbine autonome 4 h", 'Écran 15"', "Compensation de fuites"],
  },
  {
    id: "p8",
    name: "Échographe portable Echo-Vision 7",
    category: "Diagnostic",
    supplier: "Sanitas Distribution",
    reference: "FZ-EV7",
    specs: [
      "3 sondes (convexe, linéaire, cardiaque)",
      "Doppler couleur",
      'Écran 15,6" full HD',
      "DICOM 3.0",
    ],
  },
  {
    id: "p9",
    name: "Chariot d'urgence 6 tiroirs",
    category: "Mobilier médical",
    supplier: "Atlas Medical Supply",
    reference: "FZ-CU6",
    specs: [
      "Structure ABS anti-choc",
      "Serrure à code",
      "Support défibrillateur",
      "Roues Ø125 antistatiques",
    ],
  },
  {
    id: "p10",
    name: "Bistouri électrique 400 W",
    category: "Bloc opératoire",
    supplier: "MedTech Maghreb",
    reference: "FZ-BE400",
    specs: [
      "Mono/bipolaire",
      "Coagulation par spray",
      "Détection automatique de plaque",
      "Écran LCD",
    ],
  },
  {
    id: "p11",
    name: "Pousse-seringue électrique PS-Duo",
    category: "Réanimation",
    supplier: "Sanitas Distribution",
    reference: "FZ-PSDUO",
    specs: ["Débit 0,1–1500 ml/h", "Bolus programmable", "Batterie 8 h", "Empilable sur rack"],
  },
  {
    id: "p12",
    name: "Laveur-désinfecteur d'instruments LD-200",
    category: "Stérilisation",
    supplier: "Cleanmed Industrie",
    reference: "FZ-LD200",
    specs: [
      "Capacité 10 paniers DIN",
      "Thermo-désinfection A0 3000",
      "Double porte",
      "EN ISO 15883",
    ],
  },
  {
    id: "p13",
    name: "Kit de consommables bloc (usage unique)",
    category: "Consommables",
    supplier: "Cleanmed Industrie",
    reference: "FZ-KCB",
    specs: ["Champs stériles renforcés", "Casaques niveau 2", "Stérilisation EO", "Lot traçable"],
  },
  {
    id: "p14",
    name: "Défibrillateur biphasique DEF-Care",
    category: "Réanimation",
    supplier: "MedTech Maghreb",
    reference: "FZ-DEFC",
    specs: [
      "Énergie 1–360 J",
      "Mode DEA + manuel",
      "Stimulateur externe",
      "Palettes adulte/pédiatrique",
    ],
  },
];

export const SUPPLIERS = [
  {
    id: "s1",
    name: "MedTech Maghreb",
    city: "Casablanca",
    contact: "Youssef Berrada",
    email: "contact@medtech-maghreb.ma",
    phone: "+212 522 41 88 90",
    availability: "Disponible" as const,
    products: ["Bloc opératoire", "Réanimation"],
  },
  {
    id: "s2",
    name: "Atlas Medical Supply",
    city: "Rabat",
    contact: "Salma Bennani",
    email: "commercial@atlasmedical.ma",
    phone: "+212 537 22 14 05",
    availability: "Disponible" as const,
    products: ["Mobilier médical", "Bloc opératoire"],
  },
  {
    id: "s3",
    name: "Sanitas Distribution",
    city: "Marrakech",
    contact: "Hamid Ouazzani",
    email: "devis@sanitas-dist.ma",
    phone: "+212 524 30 77 12",
    availability: "Stock limité" as const,
    products: ["Diagnostic", "Réanimation"],
  },
  {
    id: "s4",
    name: "Cleanmed Industrie",
    city: "Tanger",
    contact: "Nadia Cherkaoui",
    email: "info@cleanmed.ma",
    phone: "+212 539 94 60 33",
    availability: "Disponible" as const,
    products: ["Stérilisation", "Consommables"],
  },
  {
    id: "s5",
    name: "Oriental Medical Trade",
    city: "Oujda",
    contact: "Rachid Alaoui",
    email: "rachid@omt.ma",
    phone: "+212 536 68 21 44",
    availability: "Rupture partielle" as const,
    products: ["Consommables", "Mobilier médical"],
  },
];

export type Certificate = {
  id: string;
  product: string;
  category: Category;
  holder: string;
  number: string;
  expires: string;
  status: "Valide" | "En renouvellement" | "Expire bientôt" | "Expiré";
};

export const CERTIFICATES: Certificate[] = [
  {
    id: "c1",
    product: "Certificat d'enregistrement — gamme équipements FZANA",
    category: "Bloc opératoire",
    holder: "FZANA Systems (titulaire)",
    number: "DMP/2023/0871",
    expires: "2026-04-30",
    status: "En renouvellement",
  },
  {
    id: "c2",
    product: "Autorisation d'usage — certificat partenaire MedTech Maghreb",
    category: "Bloc opératoire",
    holder: "MedTech Maghreb (partenaire avec autorisation)",
    number: "DMP/2024/1420",
    expires: "2027-01-15",
    status: "Valide",
  },
  {
    id: "c3",
    product: "Moniteur multiparamétrique MP-12",
    category: "Diagnostic",
    holder: "Sanitas Distribution (partenaire avec autorisation)",
    number: "DMP/2024/0335",
    expires: "2026-10-02",
    status: "Expire bientôt",
  },
  {
    id: "c4",
    product: "Stérilisateur autoclave 90 L",
    category: "Stérilisation",
    holder: "Cleanmed Industrie (partenaire avec autorisation)",
    number: "DMP/2025/0142",
    expires: "2028-03-20",
    status: "Valide",
  },
  {
    id: "c5",
    product: "Lit médicalisé électrique 4 sections",
    category: "Mobilier médical",
    holder: "FZANA Systems (titulaire)",
    number: "DMP/2022/0644",
    expires: "2026-09-28",
    status: "Expire bientôt",
  },
  {
    id: "c6",
    product: "Kit de consommables bloc (usage unique)",
    category: "Consommables",
    holder: "Cleanmed Industrie (partenaire avec autorisation)",
    number: "DMP/2025/0790",
    expires: "2027-06-11",
    status: "Valide",
  },
];

const CLIENTS = [
  "CHU Ibn Rochd — Casablanca",
  "Hôpital Cheikh Zaid — Rabat",
  "Ministère de la Santé et de la Protection Sociale",
  "CHU Mohammed VI — Marrakech",
  "Clinique Al Madina — Fès",
  "Hôpital Militaire Moulay Ismaïl — Meknès",
  "Clinique Atlas — Agadir",
  "CHU Hassan II — Fès",
  "Hôpital Provincial — Tanger",
  "Clinique Badr — Casablanca",
];

type Seed = {
  ref: string;
  client: string;
  city: string;
  category: Category;
  budget: number;
  deadline: string;
  stage: number;
  result?: "Gagné" | "Perdu" | undefined;
  lines: Array<[string, number, string, Conformity, string, number]>;
};

const seeds: Seed[] = [
  {
    ref: "CHU-2026-0142",
    client: CLIENTS[0]!,
    city: "Casablanca",
    category: "Bloc opératoire",
    budget: 2450000,
    deadline: "2026-09-24",
    stage: 3,
    lines: [
      [
        "Aspirateur chirurgical électrique",
        12,
        "Débit ≥ 50 L/min, bocaux autoclavables",
        "Conforme",
        "p1",
        96,
      ],
      [
        "Table d'opération électrique",
        4,
        "Charge ≥ 200 kg, plateau radio-transparent",
        "Conforme",
        "p2",
        92,
      ],
      ["Éclairage chirurgical LED", 4, "≥ 140 000 lux, IRC ≥ 95", "À vérifier", "p3", 81],
    ],
  },
  {
    ref: "MS-2026-0311",
    client: CLIENTS[2]!,
    city: "Rabat",
    category: "Réanimation",
    budget: 5120000,
    deadline: "2026-09-13",
    stage: 4,
    lines: [
      ["Respirateur de réanimation", 18, "Modes VC/PC/VNI, autonomie ≥ 3 h", "Conforme", "p7", 94],
      ["Pousse-seringue électrique", 60, "Débit 0,1–1200 ml/h, bolus", "Conforme", "p11", 98],
      ["Défibrillateur biphasique", 10, "Mode DEA + manuel, 360 J", "Conforme", "p14", 90],
    ],
  },
  {
    ref: "HCZ-2026-0087",
    client: CLIENTS[1]!,
    city: "Rabat",
    category: "Diagnostic",
    budget: 1870000,
    deadline: "2026-09-11",
    stage: 5,
    lines: [
      ["Moniteur multiparamétrique", 24, "ECG 12D, SpO2, PNI, capnographie", "Conforme", "p4", 95],
      ["Échographe portable", 3, "Doppler couleur, 3 sondes, DICOM", "À vérifier", "p8", 78],
    ],
  },
  {
    ref: "CHU6-2026-0055",
    client: CLIENTS[3]!,
    city: "Marrakech",
    category: "Mobilier médical",
    budget: 980000,
    deadline: "2026-10-06",
    stage: 2,
    lines: [
      [
        "Lit médicalisé électrique",
        80,
        "4 sections, hauteur variable, barrières",
        "Conforme",
        "p5",
        97,
      ],
      ["Chariot d'urgence", 15, "6 tiroirs, serrure à code", "Conforme", "p9", 93],
    ],
  },
  {
    ref: "CAM-2026-0019",
    client: CLIENTS[4]!,
    city: "Fès",
    category: "Stérilisation",
    budget: 1340000,
    deadline: "2026-09-30",
    stage: 1,
    lines: [
      [
        "Stérilisateur autoclave 90 L",
        3,
        "Classe B, cycle 134 °C, EN 13060",
        "À vérifier",
        "p6",
        88,
      ],
      [
        "Laveur-désinfecteur d'instruments",
        2,
        "10 paniers DIN, double porte",
        "Conforme",
        "p12",
        91,
      ],
    ],
  },
  {
    ref: "HMMI-2026-0203",
    client: CLIENTS[5]!,
    city: "Meknès",
    category: "Bloc opératoire",
    budget: 3260000,
    deadline: "2026-11-02",
    stage: 6,
    result: "Gagné",
    lines: [
      [
        "Bistouri électrique 400 W",
        8,
        "Mono/bipolaire, détection de plaque",
        "Conforme",
        "p10",
        96,
      ],
      ["Table d'opération électrique", 6, "Trendelenburg ±25°", "Conforme", "p2", 89],
    ],
  },
  {
    ref: "CLA-2026-0074",
    client: CLIENTS[6]!,
    city: "Agadir",
    category: "Diagnostic",
    budget: 720000,
    deadline: "2026-09-18",
    stage: 3,
    lines: [
      ["Échographe portable", 2, "Sonde cardiaque incluse", "Conforme", "p8", 92],
      ["Moniteur multiparamétrique", 10, 'Écran ≥ 12"', "Conforme", "p4", 94],
    ],
  },
  {
    ref: "CHU2-2026-0128",
    client: CLIENTS[7]!,
    city: "Fès",
    category: "Réanimation",
    budget: 4410000,
    deadline: "2026-09-09",
    stage: 4,
    lines: [
      ["Respirateur de réanimation", 12, "Compensation de fuites, VNI", "Conforme", "p7", 93],
      [
        "Moniteur multiparamétrique",
        30,
        "Centrale de surveillance compatible",
        "À vérifier",
        "p4",
        84,
      ],
      ["Chariot d'urgence", 12, "Support défibrillateur", "Conforme", "p9", 90],
    ],
  },
  {
    ref: "HPT-2026-0046",
    client: CLIENTS[8]!,
    city: "Tanger",
    category: "Consommables",
    budget: 460000,
    deadline: "2026-09-26",
    stage: 2,
    lines: [
      [
        "Kit de consommables bloc",
        1200,
        "Champs stériles renforcés, lot traçable",
        "Conforme",
        "p13",
        99,
      ],
    ],
  },
  {
    ref: "CBD-2026-0092",
    client: CLIENTS[9]!,
    city: "Casablanca",
    category: "Mobilier médical",
    budget: 615000,
    deadline: "2026-10-14",
    stage: 1,
    lines: [
      ["Lit médicalisé électrique", 40, "Charge ≥ 200 kg", "Conforme", "p5", 95],
      ["Chariot d'urgence", 6, "Roues antistatiques", "À vérifier", "p9", 79],
    ],
  },
  {
    ref: "MS-2026-0344",
    client: CLIENTS[2]!,
    city: "Rabat",
    category: "Stérilisation",
    budget: 2890000,
    deadline: "2026-10-21",
    stage: 5,
    lines: [
      ["Stérilisateur autoclave 90 L", 9, "Imprimante intégrée, traçabilité", "Conforme", "p6", 96],
      ["Laveur-désinfecteur d'instruments", 6, "A0 3000", "Conforme", "p12", 92],
    ],
  },
  {
    ref: "CHU-2026-0166",
    client: CLIENTS[0]!,
    city: "Casablanca",
    category: "Réanimation",
    budget: 1975000,
    deadline: "2026-09-08",
    stage: 6,
    result: "Perdu",
    lines: [
      ["Défibrillateur biphasique", 14, "Stimulateur externe", "Non conforme", "p14", 62],
      ["Pousse-seringue électrique", 45, "Empilable sur rack", "Conforme", "p11", 91],
    ],
  },
  {
    ref: "CLA-2026-0101",
    client: CLIENTS[6]!,
    city: "Agadir",
    category: "Bloc opératoire",
    budget: 1120000,
    deadline: "2026-10-02",
    stage: 3,
    lines: [
      ["Éclairage chirurgical LED", 3, "Double coupole, 4500 K", "Conforme", "p3", 94],
      ["Aspirateur chirurgical électrique", 6, "< 60 dB", "Conforme", "p1", 97],
    ],
  },
  {
    ref: "HCZ-2026-0114",
    client: CLIENTS[1]!,
    city: "Rabat",
    category: "Mobilier médical",
    budget: 845000,
    deadline: "2026-11-12",
    stage: 2,
    lines: [["Lit médicalisé électrique", 55, "Freins centralisés", "Conforme", "p5", 96]],
  },
  {
    ref: "CHU6-2026-0078",
    client: CLIENTS[3]!,
    city: "Marrakech",
    category: "Diagnostic",
    budget: 3050000,
    deadline: "2026-09-29",
    stage: 4,
    lines: [
      ["Échographe portable", 6, "DICOM 3.0, archivage PACS", "Conforme", "p8", 90],
      ["Moniteur multiparamétrique", 40, "Batterie ≥ 4 h", "Conforme", "p4", 93],
    ],
  },
  {
    ref: "HMMI-2026-0221",
    client: CLIENTS[5]!,
    city: "Meknès",
    category: "Consommables",
    budget: 380000,
    deadline: "2026-09-15",
    stage: 5,
    lines: [["Kit de consommables bloc", 900, "Stérilisation EO", "Conforme", "p13", 98]],
  },
  {
    ref: "CAM-2026-0033",
    client: CLIENTS[4]!,
    city: "Fès",
    category: "Bloc opératoire",
    budget: 1660000,
    deadline: "2026-10-09",
    stage: 1,
    lines: [
      ["Bistouri électrique 400 W", 5, "Coagulation spray", "Conforme", "p10", 92],
      ["Table d'opération électrique", 2, "Commande pédale", "À vérifier", "p2", 83],
    ],
  },
  {
    ref: "HPT-2026-0058",
    client: CLIENTS[8]!,
    city: "Tanger",
    category: "Stérilisation",
    budget: 1290000,
    deadline: "2026-10-27",
    stage: 3,
    lines: [["Laveur-désinfecteur d'instruments", 4, "EN ISO 15883", "Conforme", "p12", 95]],
  },
  {
    ref: "MS-2026-0377",
    client: CLIENTS[2]!,
    city: "Oujda",
    category: "Mobilier médical",
    budget: 1450000,
    deadline: "2026-09-12",
    stage: 4,
    lines: [
      ["Lit médicalisé électrique", 120, "Barrières ABS rabattables", "Conforme", "p5", 97],
      ["Chariot d'urgence", 20, "Serrure à code", "Conforme", "p9", 94],
    ],
  },
  {
    ref: "CBD-2026-0107",
    client: CLIENTS[9]!,
    city: "Casablanca",
    category: "Diagnostic",
    budget: 690000,
    deadline: "2026-11-20",
    stage: 1,
    lines: [["Moniteur multiparamétrique", 8, "Capnographie incluse", "Conforme", "p4", 91]],
  },
];

function statusForStage(
  stage: number,
  lines: Seed["lines"],
  result?: "Gagné" | "Perdu",
): TenderStatus {
  if (stage >= 6) return result ?? "Gagné";
  if (stage === 5) return "Soumis";
  if (stage >= 3) return lines.some((l) => l[3] === "Non conforme") ? "Non conforme" : "Conforme";
  if (stage === 2) return "En analyse";
  return "Nouveau";
}

const D = (day: number, hour: string) => `0${day}/09/2026 ${hour}`.slice(-16);

export const TENDERS: Tender[] = seeds.map((s, i) => {
  const requirements: Requirement[] = s.lines.map((l, j) => ({
    id: `${s.ref}-L${j + 1}`,
    article: l[0],
    qty: l[1],
    specs: l[2],
    conformity: l[3],
    productId: l[4],
    score: l[5],
  }));
  const history: HistoryEntry[] = [
    {
      at: D(2 + (i % 6), "09:14"),
      label: "Dossier identifié par l'Agent Veille sur marchespublics.gov.ma",
    },
  ];
  if (s.stage >= 2)
    history.push({
      at: D(2 + (i % 6), "10:02"),
      label: "Fiche de synthèse générée par l'Agent Veille & Analyse",
    });
  if (s.stage >= 3)
    history.push({
      at: D(3 + (i % 5), "11:35"),
      label: `Matching technique terminé — ${requirements.length} ligne(s) analysée(s)`,
    });
  if (s.stage >= 4)
    history.push({ at: D(4 + (i % 4), "08:30"), label: "4 documents générés automatiquement" });
  if (s.stage >= 5)
    history.push({
      at: D(5 + (i % 3), "16:10"),
      label: "Dossier soumis sur le portail des marchés publics",
    });
  if (s.stage >= 6)
    history.push({ at: D(6 + (i % 2), "12:45"), label: `Résultat enregistré : ${s.result}` });

  const avg = Math.round(requirements.reduce((a, r) => a + r.score, 0) / requirements.length);
  return {
    id: s.ref,
    ref: s.ref,
    client: s.client,
    city: s.city,
    category: s.category,
    budget: s.budget,
    deadline: s.deadline,
    stage: s.stage,
    status: statusForStage(s.stage, s.lines, s.result),
    result: s.result,
    requirements,
    history,
    summary: [
      `L'IA a analysé ${requirements.length} ligne(s) du cahier des charges pour un budget estimé de ${s.budget.toLocaleString("fr-MA")} MAD.`,
      `Catégorie dominante : ${s.category}. Lieu d'exécution : ${s.city}.`,
      `Taux de conformité produit global estimé à ${avg}% sur la base du catalogue FZANA et des fournisseurs partenaires.`,
      `Certificat d'enregistrement mobilisable : partenaire avec autorisation (certificat FZANA en cours de renouvellement).`,
    ],
  } satisfies Tender;
});

export function conformityRate(t: Tender) {
  return Math.round(t.requirements.reduce((a, r) => a + r.score, 0) / t.requirements.length);
}

export const productById = (id: string) => PRODUCTS.find((p) => p.id === id)!;

export const AGENT_LOGS_VEILLE = [
  "→ Connexion au portail marchespublics.gov.ma…",
  "✓ Session établie (TLS 1.3)",
  "→ Application des critères internes : catégories, zone, budget",
  "→ Filtrage sectoriel : santé / équipements médicaux",
  "✓ 47 avis parcourus, 6 correspondances retenues",
  "→ Téléchargement des cahiers des charges (PDF)…",
  "→ Extraction OCR des exigences techniques…",
  "✓ 14 lignes d'exigences extraites",
  "→ Génération des fiches de synthèse…",
  "✓ Terminé — 3 nouveaux dossiers ajoutés",
];

export const AGENT_LOGS_MATCHING = [
  "→ Chargement du catalogue produits FZANA (14 références)",
  "→ Normalisation des spécifications techniques…",
  "→ Calcul des scores de similarité (specs, catégorie, quantité)",
  "✓ 12 lignes appariées avec score ≥ 90%",
  "⚠ 3 lignes à vérifier manuellement (score 78–88%)",
  "→ Vérification des certificats d'enregistrement…",
  "✓ Certificat partenaire valide utilisé",
  "→ Consolidation du tableau de conformité…",
  "✓ Matching terminé",
];
