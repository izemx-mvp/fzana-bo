import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import {
  Bell,
  Bot,
  Building2,
  ChevronsLeft,
  ChevronsRight,
  FileCheck2,
  FileText,
  LayoutDashboard,
  Menu,
  Search,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  Boxes,
  LogOut,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useApp } from "@/lib/store";
import { toast } from "sonner";

const LOGO = "https://fzana.izemxlab.com/assets/fzana-logo-DBUnkOwq.png";

const NAV = [
  { to: "/criteres", label: "Configuration des critères", icon: SlidersHorizontal },
  { to: "/dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { to: "/appels-offres", label: "Appels d'offres", icon: FileText },
  { to: "/matching", label: "Matching Catalogue", icon: Boxes },
  { to: "/documents", label: "Documents générés", icon: FileCheck2 },
  { to: "/fournisseurs", label: "Fournisseurs", icon: Building2 },
  { to: "/certificats", label: "Certificats & Conformité", icon: ShieldCheck },
  { to: "/agents", label: "Agents IA", icon: Bot },
  { to: "/parametres", label: "Paramètres", icon: Settings },
] as const;

export function AppShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const { notifications, logout, criteriaSaved, visibleTenders } = useApp();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const current = NAV.find((n) => pathname.startsWith(n.to));

  const results = query.trim()
    ? visibleTenders
        .filter(
          (t) =>
            t.ref.toLowerCase().includes(query.toLowerCase()) ||
            t.client.toLowerCase().includes(query.toLowerCase()),
        )
        .slice(0, 5)
    : [];

  const sidebar = (
    <div className="flex h-full flex-col bg-sidebar">
      <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-4">
        <img src={LOGO} alt="FZANA Systems" className="h-8 w-auto shrink-0" />
        {!collapsed && (
          <div className="min-w-0">
            <p className="truncate font-display text-sm font-semibold leading-tight">FZANA Control</p>
            <p className="truncate text-[11px] text-muted-foreground">Backoffice interne</p>
          </div>
        )}
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {NAV.map((item) => {
          const active = pathname.startsWith(item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all",
                active
                  ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground",
              )}
              title={collapsed ? item.label : undefined}
            >
              {active && (
                <motion.span
                  layoutId="nav-active"
                  className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-full bg-accent"
                />
              )}
              <item.icon className={cn("h-4 w-4 shrink-0", active && "text-accent")} />
              {!collapsed && <span className="truncate">{item.label}</span>}
              {!collapsed && item.to === "/criteres" && !criteriaSaved && (
                <span className="ml-auto h-2 w-2 shrink-0 animate-pulse rounded-full bg-[var(--warning)]" />
              )}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-sidebar-border p-3">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-muted-foreground"
          onClick={() => setCollapsed((c) => !c)}
        >
          {collapsed ? <ChevronsRight className="h-4 w-4" /> : <ChevronsLeft className="h-4 w-4" />}
          {!collapsed && <span className="ml-2">Réduire</span>}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen w-full bg-background">
      <motion.aside
        animate={{ width: collapsed ? 76 : 268 }}
        transition={{ type: "spring", stiffness: 260, damping: 30 }}
        className="sticky top-0 hidden h-screen shrink-0 border-r border-sidebar-border lg:block"
      >
        {sidebar}
      </motion.aside>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-charcoal/40 lg:hidden"
            onClick={() => setMobileOpen(false)}
          >
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", stiffness: 300, damping: 32 }}
              className="h-full w-[268px] border-r border-sidebar-border"
              onClick={(e) => e.stopPropagation()}
            >
              {sidebar}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/85 px-4 backdrop-blur-md md:px-6">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>
          <nav className="hidden items-center gap-2 text-sm text-muted-foreground md:flex">
            <Link to="/dashboard" className="hover:text-foreground">
              FZANA Control
            </Link>
            <span>/</span>
            <span className="font-medium text-foreground">{current?.label ?? "Tableau de bord"}</span>
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <div className="relative hidden sm:block">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Rechercher un dossier, un client…"
                    className="w-56 pl-9 lg:w-72"
                  />
                </div>
              </PopoverTrigger>
              {results.length > 0 && (
                <PopoverContent align="end" className="w-80 p-1">
                  {results.map((t) => (
                    <button
                      key={t.id}
                      className="flex w-full flex-col items-start rounded-md px-3 py-2 text-left hover:bg-secondary"
                      onClick={() => {
                        setQuery("");
                        navigate({ to: "/appels-offres/$id", params: { id: t.id } });
                      }}
                    >
                      <span className="text-sm font-medium">{t.ref}</span>
                      <span className="text-xs text-muted-foreground">{t.client}</span>
                    </button>
                  ))}
                </PopoverContent>
              )}
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute right-1.5 top-1.5 flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent" />
                  </span>
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-80 p-0">
                <p className="border-b border-border px-4 py-3 font-display text-sm font-semibold">
                  Notifications
                </p>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.map((n) => (
                    <div key={n.id} className="border-b border-border/60 px-4 py-3 last:border-0">
                      <p className="text-sm">{n.label}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{n.at}</p>
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-full py-1 pl-1 pr-3 transition-colors hover:bg-secondary">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full gradient-brand text-xs font-semibold text-primary-foreground">
                    NE
                  </span>
                  <span className="hidden text-left md:block">
                    <span className="block text-xs font-medium leading-tight">Mme Naoual Elhaoussi</span>
                    <span className="block text-[11px] leading-tight text-muted-foreground">FZANA Systems</span>
                  </span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate({ to: "/parametres" })}>
                  <User className="mr-2 h-4 w-4" /> Profil
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    logout();
                    toast.success("Déconnexion réussie");
                    navigate({ to: "/" });
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" /> Déconnexion
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="min-w-0 flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
