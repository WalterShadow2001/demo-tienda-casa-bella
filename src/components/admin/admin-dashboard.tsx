"use client";

import * as React from "react";
import Link from "next/link";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { motion } from "framer-motion";
import {
  TrendingUp,
  ShoppingCart,
  Package,
  Clock,
  ArrowRight,
  Trophy,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatMXN, formatDate } from "@/lib/format";

interface Stats {
  ventasTotales: number;
  ordenesHoy: number;
  productos: number;
  ordenesPendientes: number;
  topProductos: { nombre: string; cantidad: number; ingresos: number; imagen: string }[];
  dias: { fecha: string; total: number; label: string }[];
  ordenesRecientes: {
    id: string;
    clienteNombre: string;
    total: number;
    estado: string;
    creadoEn: string;
  }[];
}

const ESTADO_LABEL: Record<string, string> = {
  pendiente: "Pendiente",
  pagado: "Pagado",
  enviado: "Enviado",
  entregado: "Entregado",
  cancelado: "Cancelado",
};

const ESTADO_COLOR: Record<string, string> = {
  pendiente: "bg-amber-100 text-amber-800",
  pagado: "bg-blue-100 text-blue-800",
  enviado: "bg-purple-100 text-purple-800",
  entregado: "bg-green-100 text-green-800",
  cancelado: "bg-red-100 text-red-800",
};

export function AdminDashboard() {
  const [stats, setStats] = React.useState<Stats | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((data) => setStats(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading || !stats) {
    return <DashboardSkeleton />;
  }

  const cards = [
    {
      title: "Ventas totales",
      value: formatMXN(stats.ventasTotales),
      icon: TrendingUp,
      desc: "Histórico acumulado",
      color: "bg-primary/10 text-primary",
    },
    {
      title: "Órdenes hoy",
      value: String(stats.ordenesHoy),
      icon: ShoppingCart,
      desc: "Pedidos registrados hoy",
      color: "bg-secondary/10 text-secondary",
    },
    {
      title: "Productos",
      value: String(stats.productos),
      icon: Package,
      desc: "Catálogo total",
      color: "bg-accent/10 text-accent",
    },
    {
      title: "Órdenes pendientes",
      value: String(stats.ordenesPendientes),
      icon: Clock,
      desc: "Requieren atención",
      color: "bg-amber-100 text-amber-700",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-semibold">Panel de control</h1>
        <p className="text-sm text-muted-foreground">
          Resumen de actividad de tu tienda
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c, i) => (
          <motion.div
            key={c.title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
          >
            <Card className="border-border">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{c.title}</p>
                    <p className="font-serif text-2xl font-semibold mt-1">
                      {c.value}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {c.desc}
                    </p>
                  </div>
                  <span
                    className={`inline-flex h-10 w-10 items-center justify-center rounded-full ${c.color}`}
                  >
                    <c.icon className="h-5 w-5" />
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Chart */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="font-serif text-xl">
            Ventas de los últimos 7 días
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.dias} margin={{ left: 0, right: 12, top: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4A5340" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#4A5340" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E6DFD3" />
                <XAxis
                  dataKey="label"
                  tickLine={false}
                  axisLine={false}
                  stroke="#6B6359"
                  fontSize={12}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  stroke="#6B6359"
                  fontSize={12}
                  tickFormatter={(v) => `$${Number(v).toLocaleString()}`}
                />
                <Tooltip
                  formatter={(value: number) => [formatMXN(value), "Ventas"]}
                  contentStyle={{
                    backgroundColor: "#FBFAF8",
                    border: "1px solid #E6DFD3",
                    borderRadius: "0.5rem",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="total"
                  stroke="#4A5340"
                  strokeWidth={2}
                  fill="url(#grad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top productos */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="font-serif text-xl flex items-center gap-2">
              <Trophy className="h-5 w-5 text-accent" />
              Top 5 productos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {stats.topProductos.length === 0 ? (
                <li className="text-sm text-muted-foreground">
                  Sin datos suficientes
                </li>
              ) : (
                stats.topProductos.map((p, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/40"
                  >
                    <span className="text-xs font-mono w-5 text-muted-foreground">
                      #{i + 1}
                    </span>
                    <span className="h-9 w-9 rounded-md bg-muted flex items-center justify-center text-lg">
                      {p.imagen}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium line-clamp-1">{p.nombre}</p>
                      <p className="text-xs text-muted-foreground">
                        {p.cantidad} vendidos
                      </p>
                    </div>
                    <span className="text-sm font-semibold">
                      {formatMXN(p.ingresos)}
                    </span>
                  </li>
                ))
              )}
            </ul>
          </CardContent>
        </Card>

        {/* Órdenes recientes */}
        <Card className="border-border">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="font-serif text-xl">
              Órdenes recientes
            </CardTitle>
            <Button asChild variant="ghost" size="sm">
              <Link href="/admin/ordenes">
                Ver todas <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {stats.ordenesRecientes.length === 0 ? (
              <p className="text-sm text-muted-foreground">Sin órdenes aún</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Fecha</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stats.ordenesRecientes.map((o) => (
                    <TableRow key={o.id}>
                      <TableCell className="font-medium">
                        {o.clienteNombre}
                      </TableCell>
                      <TableCell>{formatMXN(o.total)}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-xs ${
                            ESTADO_COLOR[o.estado] ?? "bg-muted"
                          }`}
                        >
                          {ESTADO_LABEL[o.estado] || o.estado}
                        </span>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {formatDate(o.creadoEn)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-10 w-64" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28" />
        ))}
      </div>
      <Skeleton className="h-72 w-full" />
      <div className="grid lg:grid-cols-2 gap-6">
        <Skeleton className="h-64" />
        <Skeleton className="h-64" />
      </div>
    </div>
  );
}
