import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Boxes } from "lucide-react";
import { margin, type Product } from "@/lib/mock-data";

export function ProductModal({
  product,
  onOpenChange,
}: {
  product: Product | null;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={!!product} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        {product && (
          <>
            <DialogHeader>
              <DialogTitle className="font-display">{product.name}</DialogTitle>
              <DialogDescription>
                Référence {product.reference} · {product.category}
              </DialogDescription>
            </DialogHeader>
            <div className="flex h-40 items-center justify-center rounded-xl gradient-brand">
              <Boxes className="h-14 w-14 text-primary-foreground/80" />
            </div>
            <dl className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-xs text-muted-foreground">Catégorie</dt>
                <dd className="font-medium">{product.category}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Fournisseur</dt>
                <dd className="font-medium">{product.supplier}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Prix d'achat (HT)</dt>
                <dd className="font-medium tabular-nums">
                  {product.purchasePrice.toLocaleString("fr-MA")} MAD
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Prix de vente (HT)</dt>
                <dd className="font-medium tabular-nums">
                  {product.salePrice.toLocaleString("fr-MA")} MAD
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Marge</dt>
                <dd className="font-medium tabular-nums">{margin(product)} %</dd>
              </div>
            </dl>
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Fiche technique
              </p>
              <ul className="space-y-1.5">
                {product.specs.map((s) => (
                  <li key={s} className="flex items-start gap-2 text-sm">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
