"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, X, Plus, Minus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { useCart, calcularTotales, ENVIO_UMBRAL } from "@/lib/cart-store";
import { formatMXN as fmt } from "@/lib/format";
import { toast } from "sonner";

export function CartDrawer({ children }: { children?: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const items = useCart((s) => s.items);
  const updateQty = useCart((s) => s.updateQty);
  const remove = useCart((s) => s.remove);
  const cupon = useCart((s) => s.cupon);
  const subtotal = useCart((s) => s.subtotal());
  const totals = calcularTotales(subtotal, cupon?.descuento ?? 0);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="w-full sm:max-w-md p-0 flex flex-col">
        <SheetHeader className="px-5 pt-5 pb-3 border-b border-border">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2 font-serif text-xl">
              <ShoppingBag className="h-5 w-5" />
              Tu carrito
            </SheetTitle>
            <SheetClose asChild>
              <Button variant="ghost" size="icon" aria-label="Cerrar">
                <X className="h-4 w-4" />
              </Button>
            </SheetClose>
          </div>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8 text-center">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <ShoppingBag className="h-7 w-7 text-muted-foreground" />
            </div>
            <div>
              <p className="font-serif text-lg">Tu carrito está vacío</p>
              <p className="text-sm text-muted-foreground mt-1">
                Explora nuestra colección de muebles y decoración.
              </p>
            </div>
            <SheetClose asChild>
              <Button asChild>
                <Link href="/productos">Ver productos</Link>
              </Button>
            </SheetClose>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto scrollbar-casa px-5 py-4">
              <ul className="space-y-4">
                <AnimatePresence initial={false}>
                  {items.map((it) => (
                    <motion.li
                      key={it.productoId}
                      layout
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 40 }}
                      transition={{ duration: 0.18 }}
                      className="flex gap-3"
                    >
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-md bg-muted text-3xl">
                        {it.imagen}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-medium line-clamp-2">{it.nombre}</p>
                          <button
                            onClick={() => {
                              remove(it.productoId);
                              toast.success("Producto eliminado del carrito");
                            }}
                            className="text-muted-foreground hover:text-destructive transition-colors"
                            aria-label={`Eliminar ${it.nombre}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          {fmt(it.precio)}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center rounded-md border border-border">
                            <button
                              onClick={() => updateQty(it.productoId, it.cantidad - 1)}
                              className="inline-flex h-7 w-7 items-center justify-center hover:bg-muted transition-colors"
                              aria-label="Disminuir"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-8 text-center text-sm font-medium">
                              {it.cantidad}
                            </span>
                            <button
                              onClick={() => updateQty(it.productoId, it.cantidad + 1)}
                              className="inline-flex h-7 w-7 items-center justify-center hover:bg-muted transition-colors"
                              aria-label="Aumentar"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          <p className="text-sm font-semibold">
                            {fmt(it.precio * it.cantidad)}
                          </p>
                        </div>
                      </div>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            </div>

            <div className="border-t border-border px-5 py-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">{fmt(subtotal)}</span>
              </div>
              {cupon && (
                <div className="flex justify-between text-sm text-secondary">
                  <span>Descuento ({cupon.codigo})</span>
                  <span>-{fmt(totals.descuentoMonto)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Envío</span>
                <span className="font-medium">
                  {totals.envio === 0 ? "Gratis" : fmt(totals.envio)}
                </span>
              </div>
              {subtotal < ENVIO_UMBRAL && (
                <p className="text-xs text-muted-foreground">
                  Envío gratis desde {fmt(ENVIO_UMBRAL)}. Te faltan {fmt(ENVIO_UMBRAL - subtotal)}.
                </p>
              )}
              <Separator />
              <div className="flex justify-between items-center">
                <span className="font-serif text-lg">Total</span>
                <span className="font-serif text-xl font-semibold">
                  {fmt(totals.total)}
                </span>
              </div>
              <SheetClose asChild>
                <Button asChild className="w-full" size="lg">
                  <Link href="/carrito">Ver carrito</Link>
                </Button>
              </SheetClose>
              <SheetClose asChild>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/checkout">Finalizar compra</Link>
                </Button>
              </SheetClose>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
