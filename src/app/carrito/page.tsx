"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Plus, Minus, Trash2, ArrowRight, Tag, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { useCart, calcularTotales, ENVIO_UMBRAL, ENVIO_COSTO } from "@/lib/cart-store";
import { formatMXN } from "@/lib/format";
import { toast } from "sonner";

export default function CarritoPage() {
  const items = useCart((s) => s.items);
  const updateQty = useCart((s) => s.updateQty);
  const remove = useCart((s) => s.remove);
  const cupon = useCart((s) => s.cupon);
  const setCupon = useCart((s) => s.setCupon);
  const subtotal = useCart((s) => s.subtotal());

  const [cuponInput, setCuponInput] = React.useState(cupon?.codigo ?? "");
  const [validando, setValidando] = React.useState(false);

  const totals = calcularTotales(subtotal, cupon?.descuento ?? 0);

  async function aplicarCupon() {
    if (!cuponInput.trim()) {
      toast.error("Ingresa un código");
      return;
    }
    setValidando(true);
    try {
      const res = await fetch("/api/cupones/validar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ codigo: cuponInput.trim().toUpperCase(), subtotal }),
      });
      const data = await res.json();
      if (data.valido) {
        setCupon({ codigo: data.codigo, descuento: data.descuento });
        toast.success(`Cupón aplicado: ${data.descuento}% de descuento`);
      } else {
        setCupon(null);
        toast.error(data.error || "Cupón no válido");
      }
    } catch {
      toast.error("No se pudo validar el cupón");
    } finally {
      setValidando(false);
    }
  }

  if (items.length === 0) {
    return (
      <section className="container mx-auto max-w-3xl px-4 py-20 flex flex-col items-center text-center">
        <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-muted mb-6">
          <ShoppingBag className="h-9 w-9 text-muted-foreground" />
        </div>
        <h1 className="font-serif text-3xl font-semibold">Tu carrito está vacío</h1>
        <p className="mt-2 text-muted-foreground max-w-md">
          Aún no has agregado piezas a tu carrito. Explora nuestra colección y
          encuentra el objeto perfecto para tu hogar.
        </p>
        <Button asChild size="lg" className="mt-6">
          <Link href="/productos">
            Explorar tienda
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </section>
    );
  }

  return (
    <section className="container mx-auto max-w-7xl px-4 py-10">
      <h1 className="font-serif text-4xl md:text-5xl font-semibold mb-8">
        Tu carrito
      </h1>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-3">
          <AnimatePresence initial={false}>
            {items.map((it) => (
              <motion.div
                key={it.productoId}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: 40 }}
                transition={{ duration: 0.18 }}
              >
                <Card className="border-border bg-card">
                  <CardContent className="p-4 flex gap-4">
                    <Link
                      href={`/producto/${it.productoId}`}
                      className="h-24 w-24 shrink-0 rounded-md bg-muted flex items-center justify-center text-5xl hover:opacity-80 transition-opacity"
                    >
                      {it.imagen}
                    </Link>
                    <div className="flex-1 min-w-0 flex flex-col">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <Link
                            href={`/producto/${it.productoId}`}
                            className="font-serif text-lg hover:text-primary transition-colors"
                          >
                            {it.nombre}
                          </Link>
                          <p className="text-sm text-muted-foreground">
                            {formatMXN(it.precio)}
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            remove(it.productoId);
                            toast.success("Producto eliminado");
                          }}
                          className="text-muted-foreground hover:text-destructive transition-colors"
                          aria-label="Eliminar"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="flex items-end justify-between mt-auto pt-2">
                        <div className="flex items-center rounded-md border border-border">
                          <button
                            onClick={() => updateQty(it.productoId, it.cantidad - 1)}
                            className="inline-flex h-8 w-8 items-center justify-center hover:bg-muted transition-colors"
                            aria-label="Disminuir"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-10 text-center text-sm font-medium">
                            {it.cantidad}
                          </span>
                          <button
                            onClick={() => updateQty(it.productoId, it.cantidad + 1)}
                            className="inline-flex h-8 w-8 items-center justify-center hover:bg-muted transition-colors"
                            aria-label="Aumentar"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <p className="font-serif text-lg font-semibold">
                          {formatMXN(it.precio * it.cantidad)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Resumen */}
        <div className="lg:col-span-1">
          <Card className="border-border bg-card sticky top-20">
            <CardContent className="p-6 space-y-4">
              <h2 className="font-serif text-2xl font-semibold">Resumen</h2>

              {/* Cupón */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Tag className="h-4 w-4" /> Código de descuento
                </label>
                {cupon ? (
                  <div className="flex items-center justify-between p-2 rounded-md bg-secondary/10 border border-secondary/30">
                    <div>
                      <p className="text-sm font-medium text-secondary">{cupon.codigo}</p>
                      <p className="text-xs text-muted-foreground">{cupon.descuento}% de descuento</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setCupon(null);
                        setCuponInput("");
                        toast.success("Cupón removido");
                      }}
                      aria-label="Remover cupón"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Input
                      value={cuponInput}
                      onChange={(e) => setCuponInput(e.target.value)}
                      placeholder="Ej: BIENVENIDA10"
                      onKeyDown={(e) => e.key === "Enter" && aplicarCupon()}
                      aria-label="Código de cupón"
                    />
                    <Button onClick={aplicarCupon} disabled={validando}>
                      {validando ? <Loader2 className="h-4 w-4 animate-spin" /> : "Aplicar"}
                    </Button>
                  </div>
                )}
                <p className="text-[11px] text-muted-foreground">
                  Prueba: BIENVENIDA10, VERANO15 o CASA20 (mín. $2,000)
                </p>
              </div>

              <Separator />

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">{formatMXN(subtotal)}</span>
                </div>
                {cupon && (
                  <div className="flex justify-between text-secondary">
                    <span>Descuento ({cupon.codigo})</span>
                    <span>-{formatMXN(totals.descuentoMonto)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Envío</span>
                  <span className="font-medium">
                    {totals.envio === 0 ? "Gratis" : formatMXN(totals.envio)}
                  </span>
                </div>
                {subtotal < ENVIO_UMBRAL && (
                  <p className="text-xs text-muted-foreground">
                    Agrega {formatMXN(ENVIO_UMBRAL - subtotal)} más y obtén envío gratis.
                  </p>
                )}
              </div>

              <Separator />

              <div className="flex justify-between items-center">
                <span className="font-serif text-lg">Total</span>
                <span className="font-serif text-2xl font-semibold text-primary">
                  {formatMXN(totals.total)}
                </span>
              </div>

              <Button asChild className="w-full" size="lg">
                <Link href="/checkout">
                  Finalizar compra
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/productos">Seguir comprando</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
