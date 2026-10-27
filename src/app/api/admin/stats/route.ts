import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isAdmin } from "@/lib/auth";

export async function GET() {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // Totales
    const [ordenes, productos, ordenesPendientes, ventasAgg] = await Promise.all([
      prisma.orden.findMany({ select: { total: true, creadoEn: true, estado: true } }),
      prisma.producto.count(),
      prisma.orden.count({ where: { estado: "pendiente" } }),
      prisma.orden.aggregate({ _sum: { total: true } }),
    ]);

    const ventasTotales = ventasAgg._sum.total ?? 0;

    // Órdenes hoy
    const now = new Date();
    const inicioHoy = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const ordenesHoy = ordenes.filter(
      (o) => new Date(o.creadoEn) >= inicioHoy
    ).length;

    // Top 5 productos por ventas (por aparición en items)
    const productosCount = new Map<
      string,
      { nombre: string; cantidad: number; ingresos: number; imagen: string }
    >();
    for (const o of ordenes) {
      try {
        const items = JSON.parse(o.items) as Array<{
          nombre: string;
          precio: number;
          cantidad: number;
          imagen?: string;
        }>;
        for (const it of items) {
          const existing = productosCount.get(it.nombre) ?? {
            nombre: it.nombre,
            cantidad: 0,
            ingresos: 0,
            imagen: it.imagen || "🪑",
          };
          existing.cantidad += it.cantidad;
          existing.ingresos += it.precio * it.cantidad;
          productosCount.set(it.nombre, existing);
        }
      } catch {
        // ignore parse errors
      }
    }
    const topProductos = Array.from(productosCount.values())
      .sort((a, b) => b.ingresos - a.ingresos)
      .slice(0, 5);

    // Ventas últimos 7 días
    const dias: { fecha: string; total: number; label: string }[] = [];
    const diasSemana = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setHours(0, 0, 0, 0);
      d.setDate(d.getDate() - i);
      const next = new Date(d);
      next.setDate(d.getDate() + 1);
      const totalDia = ordenes
        .filter((o) => {
          const f = new Date(o.creadoEn);
          return f >= d && f < next && o.estado !== "cancelado";
        })
        .reduce((acc, o) => acc + o.total, 0);
      dias.push({
        fecha: d.toISOString(),
        total: totalDia,
        label: diasSemana[d.getDay()],
      });
    }

    // Órdenes recientes
    const ordenesRecientes = await prisma.orden.findMany({
      orderBy: { creadoEn: "desc" },
      take: 6,
    });

    return NextResponse.json({
      ventasTotales,
      ordenesHoy,
      productos,
      ordenesPendientes,
      topProductos,
      dias,
      ordenesRecientes,
    });
  } catch (e) {
    console.error("[GET /api/admin/stats]", e);
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}
