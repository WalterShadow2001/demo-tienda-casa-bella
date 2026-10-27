"use client";

import * as React from "react";
import { Loader2, RefreshCw, ClipboardList, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatMXN, formatDate } from "@/lib/format";
import { toast } from "sonner";

interface Orden {
  id: string;
  clienteNombre: string;
  clienteEmail: string;
  clienteTelefono: string;
  direccion: string;
  ciudad: string;
  codigoPostal: string;
  items: string;
  subtotal: number;
  envio: number;
  total: number;
  estado: string;
  cupon: string | null;
  creadoEn: string;
}

const ESTADOS = ["pendiente", "pagado", "enviado", "entregado", "cancelado"];
const ESTADO_LABEL: Record<string, string> = {
  pendiente: "Pendiente",
  pagado: "Pagado",
  enviado: "Enviado",
  entregado: "Entregado",
  cancelado: "Cancelado",
};
const ESTADO_COLOR: Record<string, string> = {
  pendiente: "bg-amber-100 text-amber-800 border-amber-200",
  pagado: "bg-sky-100 text-sky-800 border-sky-200",
  enviado: "bg-purple-100 text-purple-800 border-purple-200",
  entregado: "bg-emerald-100 text-emerald-800 border-emerald-200",
  cancelado: "bg-red-100 text-red-800 border-red-200",
};

export function AdminOrdenes() {
  const [ordenes, setOrdenes] = React.useState<Orden[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [filter, setFilter] = React.useState<string>("todos");
  const [busqueda, setBusqueda] = React.useState("");

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/ordenes");
      if (!res.ok) throw new Error();
      const data = await res.json();
      setOrdenes(data);
    } catch {
      toast.error("Error al cargar órdenes");
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    load();
  }, []);

  async function cambiarEstado(id: string, estado: string) {
    try {
      const res = await fetch(`/api/ordenes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado }),
      });
      if (!res.ok) throw new Error();
      toast.success(`Estado actualizado a: ${ESTADO_LABEL[estado]}`);
      load();
    } catch {
      toast.error("Error al actualizar estado");
    }
  }

  const filtered = ordenes.filter((o) => {
    if (filter !== "todos" && o.estado !== filter) return false;
    if (busqueda) {
      const q = busqueda.toLowerCase();
      return (
        o.clienteNombre.toLowerCase().includes(q) ||
        o.clienteEmail.toLowerCase().includes(q) ||
        o.id.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-serif text-3xl font-semibold">Órdenes</h1>
          <p className="text-sm text-muted-foreground">
            {ordenes.length} órdenes registradas
          </p>
        </div>
        <Button variant="outline" onClick={load} disabled={loading}>
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          Refrescar
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Input
          placeholder="Buscar por cliente, email o ID..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="max-w-sm"
        />
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos los estados</SelectItem>
            {ESTADOS.map((e) => (
              <SelectItem key={e} value={e}>
                {ESTADO_LABEL[e]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="border border-border rounded-lg bg-card overflow-hidden">
        {loading ? (
          <div className="p-4 space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full" />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto scrollbar-casa">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Contacto</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Cupón</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((o) => (
                  <TableRow key={o.id}>
                    <TableCell className="font-mono text-xs">
                      #{o.id.slice(-6).toUpperCase()}
                    </TableCell>
                    <TableCell>
                      <p className="font-medium">{o.clienteNombre}</p>
                      <p className="text-xs text-muted-foreground">
                        {o.direccion}, {o.ciudad}, CP {o.codigoPostal}
                      </p>
                    </TableCell>
                    <TableCell>
                      <div className="text-xs space-y-0.5">
                        <p className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {o.clienteEmail}
                        </p>
                        <p className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {o.clienteTelefono}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold">
                      {formatMXN(o.total)}
                    </TableCell>
                    <TableCell>
                      {o.cupon ? (
                        <Badge variant="outline">{o.cupon}</Badge>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {formatDate(o.creadoEn)}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={o.estado}
                        onValueChange={(v) => cambiarEstado(o.id, v)}
                      >
                        <SelectTrigger className="h-8 w-32 border-0 focus:ring-0">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {ESTADOS.map((e) => (
                            <SelectItem key={e} value={e}>
                              {ESTADO_LABEL[e]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                      <ClipboardList className="h-8 w-8 mx-auto mb-2" />
                      No se encontraron órdenes
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Resumen de items en orden seleccionada - offcanvas? Show inline */}
      {!loading && filtered.length > 0 && (
        <details className="border border-border rounded-lg bg-card p-4">
          <summary className="cursor-pointer font-serif text-lg">
            Ver detalle de items (mostrando primera orden filtrada)
          </summary>
          <ItemsDetalle orden={filtered[0]} />
        </details>
      )}
    </div>
  );
}

function ItemsDetalle({ orden }: { orden: Orden }) {
  let items: Array<{ nombre: string; precio: number; cantidad: number; imagen?: string }> = [];
  try {
    items = JSON.parse(orden.items);
  } catch {
    items = [];
  }
  return (
    <div className="mt-4 space-y-2">
      {items.map((it, i) => (
        <div key={i} className="flex items-center gap-3 text-sm border-t border-border pt-2">
          <span className="h-8 w-8 rounded bg-muted flex items-center justify-center text-lg">
            {it.imagen || "🪑"}
          </span>
          <span className="flex-1">{it.nombre}</span>
          <span className="text-muted-foreground">
            {it.cantidad} × {formatMXN(it.precio)}
          </span>
          <span className="font-medium">{formatMXN(it.precio * it.cantidad)}</span>
        </div>
      ))}
      <div className="border-t border-border pt-2 mt-2 flex justify-between text-sm">
        <span className="text-muted-foreground">Subtotal</span>
        <span>{formatMXN(orden.subtotal)}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Envío</span>
        <span>
          {orden.envio === 0 ? "Gratis" : formatMXN(orden.envio)}
        </span>
      </div>
      <div className="flex justify-between font-semibold pt-1 border-t border-border">
        <span>Total</span>
        <span>{formatMXN(orden.total)}</span>
      </div>
    </div>
  );
}
