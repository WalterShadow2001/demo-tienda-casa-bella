import { notFound } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Package, Truck, MapPin, Mail, Phone, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/db";
import { formatMXN, formatDate, addBusinessDays } from "@/lib/format";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

async function getOrden(id: string) {
  try {
    return await prisma.orden.findUnique({ where: { id } });
  } catch {
    return null;
  }
}

const ESTADO_LABEL: Record<string, string> = {
  pendiente: "Pendiente",
  pagado: "Pagado",
  enviado: "Enviado",
  entregado: "Entregado",
  cancelado: "Cancelado",
};

export default async function OrdenPage({ params }: Props) {
  const { id } = await params;
  const orden = await getOrden(id);
  if (!orden) notFound();

  let items: Array<{
    productoId?: string;
    nombre: string;
    precio: number;
    cantidad: number;
    imagen?: string;
  }> = [];
  try {
    items = JSON.parse(orden.items);
  } catch {
    items = [];
  }

  const fechaEntrega = addBusinessDays(new Date(orden.creadoEn), 5);

  return (
    <section className="container mx-auto max-w-3xl px-4 py-12">
      <div className="text-center mb-8">
        <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-secondary/10 text-secondary mb-4">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <h1 className="font-serif text-4xl font-semibold">
          ¡Gracias por tu compra!
        </h1>
        <p className="mt-2 text-muted-foreground">
          Tu pedido ha sido registrado. Te enviamos los detalles a tu correo.
        </p>
        <p className="mt-4 inline-block px-4 py-2 rounded-md bg-muted font-mono text-sm">
          Pedido #{orden.id.slice(-8).toUpperCase()}
        </p>
      </div>

      <Card className="border-border bg-card mb-6">
        <CardContent className="p-6 space-y-6">
          {/* Estado y entrega */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                <Package className="h-5 w-5 text-primary" />
              </span>
              <div>
                <p className="text-xs text-muted-foreground">Estado</p>
                <Badge className="mt-0.5">
                  {ESTADO_LABEL[orden.estado] || orden.estado}
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                <Truck className="h-5 w-5 text-primary" />
              </span>
              <div>
                <p className="text-xs text-muted-foreground">Entrega estimada</p>
                <p className="font-medium">{formatDate(fechaEntrega)}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Productos */}
          <div>
            <h2 className="font-serif text-xl mb-3">Productos</h2>
            <ul className="space-y-3">
              {items.map((it, i) => (
                <li key={i} className="flex gap-3 text-sm">
                  <span className="h-12 w-12 shrink-0 rounded-md bg-muted flex items-center justify-center text-2xl">
                    {it.imagen || "🪑"}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium">{it.nombre}</p>
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
          </div>

          <Separator />

          {/* Totales */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium">{formatMXN(orden.subtotal)}</span>
            </div>
            {orden.cupon && (
              <div className="flex justify-between text-secondary">
                <span>Descuento ({orden.cupon})</span>
                <span className="font-medium">
                  -{formatMXN(orden.subtotal - (orden.total - orden.envio))}
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Envío</span>
              <span className="font-medium">
                {orden.envio === 0 ? "Gratis" : formatMXN(orden.envio)}
              </span>
            </div>
            <Separator />
            <div className="flex justify-between items-center pt-1">
              <span className="font-serif text-lg">Total</span>
              <span className="font-serif text-2xl font-semibold text-primary">
                {formatMXN(orden.total)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Datos del cliente */}
      <Card className="border-border bg-card mb-6">
        <CardContent className="p-6">
          <h2 className="font-serif text-xl mb-4">Datos de entrega</h2>
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <div className="flex items-start gap-3">
              <Mail className="h-4 w-4 mt-0.5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Correo</p>
                <p className="font-medium">{orden.clienteEmail}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="h-4 w-4 mt-0.5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Teléfono</p>
                <p className="font-medium">{orden.clienteTelefono}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 sm:col-span-2">
              <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Dirección</p>
                <p className="font-medium">
                  {orden.direccion}, {orden.ciudad}, CP {orden.codigoPostal}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button asChild size="lg">
          <Link href="/productos">
            Seguir comprando
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/">Volver al inicio</Link>
        </Button>
      </div>
    </section>
  );
}
