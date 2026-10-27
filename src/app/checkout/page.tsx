"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { CreditCard, Banknote, Wallet, Loader2, ArrowLeft, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { useCart, calcularTotales } from "@/lib/cart-store";
import { formatMXN } from "@/lib/format";
import { toast } from "sonner";

const schema = z.object({
  clienteNombre: z.string().min(3, "Nombre requerido"),
  clienteEmail: z.string().email("Email inválido"),
  clienteTelefono: z.string().min(10, "Teléfono inválido"),
  direccion: z.string().min(5, "Dirección requerida"),
  ciudad: z.string().min(2, "Ciudad requerida"),
  codigoPostal: z.string().min(5, "CP inválido"),
  metodoPago: z.enum(["tarjeta", "transferencia", "efectivo"]),
});

type FormValues = z.infer<typeof schema>;

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCart((s) => s.items);
  const cupon = useCart((s) => s.cupon);
  const subtotal = useCart((s) => s.subtotal());
  const clear = useCart((s) => s.clear);
  const totals = calcularTotales(subtotal, cupon?.descuento ?? 0);
  const [submitting, setSubmitting] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { metodoPago: "tarjeta" },
  });

  const metodoPago = watch("metodoPago");

  if (items.length === 0) {
    return (
      <section className="container mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="font-serif text-3xl font-semibold mb-4">
          Tu carrito está vacío
        </h1>
        <p className="text-muted-foreground mb-6">
          Agrega productos antes de finalizar tu compra.
        </p>
        <Button asChild>
          <Link href="/productos">Ver productos</Link>
        </Button>
      </section>
    );
  }

  async function onSubmit(values: FormValues) {
    setSubmitting(true);
    try {
      const payload = {
        ...values,
        items,
        subtotal,
        envio: totals.envio,
        total: totals.total,
        cupon: cupon?.codigo ?? null,
        estado: "pendiente",
      };
      const res = await fetch("/api/ordenes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Error al crear orden");
      }
      const orden = await res.json();
      clear();
      toast.success("¡Orden creada con éxito!");
      router.push(`/orden/${orden.id}`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="container mx-auto max-w-7xl px-4 py-10">
      <Link
        href="/carrito"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4"
      >
        <ArrowLeft className="h-4 w-4" /> Volver al carrito
      </Link>
      <h1 className="font-serif text-4xl md:text-5xl font-semibold mb-8">
        Finalizar compra
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Datos de contacto */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="font-serif text-2xl">
                1. Datos de contacto
              </CardTitle>
            </CardHeader>
            <CardContent className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="clienteNombre">Nombre completo *</Label>
                <Input id="clienteNombre" {...register("clienteNombre")} placeholder="Tu nombre" />
                {errors.clienteNombre && (
                  <p className="text-xs text-destructive">{errors.clienteNombre.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="clienteEmail">Correo electrónico *</Label>
                <Input
                  id="clienteEmail"
                  type="email"
                  {...register("clienteEmail")}
                  placeholder="tu@correo.com"
                />
                {errors.clienteEmail && (
                  <p className="text-xs text-destructive">{errors.clienteEmail.message}</p>
                )}
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="clienteTelefono">Teléfono *</Label>
                <Input
                  id="clienteTelefono"
                  {...register("clienteTelefono")}
                  placeholder="639 123 4567"
                />
                {errors.clienteTelefono && (
                  <p className="text-xs text-destructive">{errors.clienteTelefono.message}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Dirección de envío */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="font-serif text-2xl">
                2. Dirección de envío
              </CardTitle>
            </CardHeader>
            <CardContent className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="direccion">Dirección completa *</Label>
                <Input
                  id="direccion"
                  {...register("direccion")}
                  placeholder="Calle, número, colonia"
                />
                {errors.direccion && (
                  <p className="text-xs text-destructive">{errors.direccion.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="ciudad">Ciudad *</Label>
                <Input
                  id="ciudad"
                  {...register("ciudad")}
                  placeholder="Delicias"
                />
                {errors.ciudad && (
                  <p className="text-xs text-destructive">{errors.ciudad.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="codigoPostal">Código postal *</Label>
                <Input
                  id="codigoPostal"
                  {...register("codigoPostal")}
                  placeholder="33000"
                />
                {errors.codigoPostal && (
                  <p className="text-xs text-destructive">{errors.codigoPostal.message}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Método de pago */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="font-serif text-2xl">
                3. Método de pago
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                defaultValue="tarjeta"
                value={metodoPago}
                onValueChange={(v) =>
                  register("metodoPago").onChange({ target: { name: "metodoPago", value: v } })
                }
                className="space-y-3"
              >
                {[
                  { value: "tarjeta", label: "Tarjeta de crédito/débito", icon: CreditCard, desc: "Procesamiento seguro" },
                  { value: "transferencia", label: "Transferencia bancaria", icon: Banknote, desc: "Confirmación en 24h" },
                  { value: "efectivo", label: "Efectivo contra entrega", icon: Wallet, desc: "Paga al recibir" },
                ].map((m) => (
                  <label
                    key={m.value}
                    htmlFor={`m-${m.value}`}
                    className="flex items-center gap-3 p-3 rounded-md border border-border hover:bg-muted/40 cursor-pointer transition-colors"
                  >
                    <RadioGroupItem value={m.value} id={`m-${m.value}`} />
                    <m.icon className="h-5 w-5 text-primary" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{m.label}</p>
                      <p className="text-xs text-muted-foreground">{m.desc}</p>
                    </div>
                  </label>
                ))}
              </RadioGroup>
              <p className="mt-4 text-xs text-muted-foreground flex items-center gap-1">
                <Lock className="h-3 w-3" /> Pago simulado para demo. No se
                procesa información real.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Resumen */}
        <div className="lg:col-span-1">
          <Card className="border-border bg-card sticky top-20">
            <CardHeader>
              <CardTitle className="font-serif text-2xl">Resumen del pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3 max-h-72 overflow-y-auto scrollbar-casa">
                {items.map((it) => (
                  <li key={it.productoId} className="flex gap-3 text-sm">
                    <span className="h-10 w-10 shrink-0 rounded-md bg-muted flex items-center justify-center text-xl">
                      {it.imagen}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium line-clamp-1">{it.nombre}</p>
                      <p className="text-xs text-muted-foreground">
                        {it.cantidad} × {formatMXN(it.precio)}
                      </p>
                    </div>
                    <span className="font-medium">
                      {formatMXN(it.precio * it.cantidad)}
                    </span>
                  </li>
                ))}
              </ul>
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
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="font-serif text-lg">Total</span>
                <span className="font-serif text-2xl font-semibold text-primary">
                  {formatMXN(totals.total)}
                </span>
              </div>
              <Button type="submit" size="lg" className="w-full" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Procesando...
                  </>
                ) : (
                  <>Confirmar pedido</>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </form>
    </section>
  );
}
