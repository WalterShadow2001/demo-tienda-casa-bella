"use client";

import * as React from "react";
import { Minus, Plus, ShoppingCart, Heart, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart-store";
import { toast } from "sonner";
import type { Producto } from "@/lib/types";

interface Props {
  producto: Pick<
    Producto,
    "id" | "nombre" | "precio" | "precioOferta" | "imagenes" | "stock"
  >;
}

export function ProductDetailActions({ producto }: Props) {
  const [qty, setQty] = React.useState(1);
  const [wishlist, setWishlist] = React.useState(false);
  const add = useCart((s) => s.add);
  const precioActual = producto.precioOferta ?? producto.precio;
  const sinStock = producto.stock <= 0;
  const img = producto.imagenes?.split(",")[0] || "🪑";

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium">Cantidad:</span>
        <div className="flex items-center rounded-md border border-border">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="inline-flex h-9 w-9 items-center justify-center hover:bg-muted transition-colors"
            aria-label="Disminuir cantidad"
            disabled={sinStock}
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-12 text-center text-sm font-medium">{qty}</span>
          <button
            onClick={() => setQty((q) => Math.min(producto.stock || 99, q + 1))}
            className="inline-flex h-9 w-9 items-center justify-center hover:bg-muted transition-colors"
            aria-label="Aumentar cantidad"
            disabled={sinStock}
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        {producto.stock > 0 && (
          <span className="text-sm text-muted-foreground">
            {producto.stock} disponibles
          </span>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          size="lg"
          className="flex-1"
          disabled={sinStock}
          onClick={() => {
            add({
              productoId: producto.id,
              nombre: producto.nombre,
              precio: precioActual,
              imagen: img,
            }, qty);
            toast.success(`${qty} × ${producto.nombre} agregado al carrito`);
          }}
        >
          <ShoppingCart className="h-4 w-4" />
          {sinStock ? "Producto agotado" : "Agregar al carrito"}
        </Button>
        <Button
          size="lg"
          variant="outline"
          onClick={() => {
            setWishlist((w) => !w);
            toast.success(
              wishlist ? "Removido de favoritos" : "Añadido a favoritos"
            );
          }}
          aria-label="Añadir a favoritos"
          className={wishlist ? "text-secondary border-secondary" : ""}
        >
          <Heart className={wishlist ? "h-4 w-4 fill-current" : "h-4 w-4"} />
        </Button>
        <Button
          size="lg"
          variant="outline"
          onClick={() => {
            if (typeof navigator !== "undefined" && navigator.share) {
              navigator.share({ title: producto.nombre }).catch(() => {});
            } else {
              navigator.clipboard?.writeText(window.location.href);
              toast.success("Enlace copiado");
            }
          }}
          aria-label="Compartir"
        >
          <Share2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
