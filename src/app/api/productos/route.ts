import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isAdmin } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const categoria = searchParams.get("categoria") || undefined;
    const busqueda = searchParams.get("busqueda") || undefined;
    const precioMin = Number(searchParams.get("precioMin") || 0);
    const precioMaxRaw = searchParams.get("precioMax");
    const precioMax = precioMaxRaw ? Number(precioMaxRaw) : undefined;
    const sort = searchParams.get("sort") || "recientes";
    const rating = searchParams.get("rating")
      ? Number(searchParams.get("rating"))
      : undefined;
    const destacado = searchParams.get("destacado") === "true";

    const where: Record<string, unknown> = {};
    if (categoria) where.categoria = { slug: categoria };
    if (busqueda) {
      where.OR = [
        { nombre: { contains: busqueda } },
        { descripcion: { contains: busqueda } },
      ];
    }
    if (precioMin || precioMax) {
      const range: Record<string, number> = {};
      if (precioMin) range.gte = precioMin;
      if (precioMax) range.lte = precioMax;
      where.precio = range;
    }
    if (rating) where.rating = { gte: rating };
    if (destacado) where.destacado = true;

    let orderBy: Record<string, "asc" | "desc"> | undefined = undefined;
    switch (sort) {
      case "precio_asc":
        orderBy = { precio: "asc" };
        break;
      case "precio_desc":
        orderBy = { precio: "desc" };
        break;
      case "rating":
        orderBy = { rating: "desc" };
        break;
      case "nombre":
        orderBy = { nombre: "asc" };
        break;
      case "recientes":
      default:
        orderBy = { creadoEn: "desc" };
    }

    const productos = await prisma.producto.findMany({
      where,
      orderBy,
      include: { categoria: true },
    });
    return NextResponse.json(productos);
  } catch (e) {
    console.error("[GET /api/productos]", e);
    return NextResponse.json(
      { error: "Error al obtener productos" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    const body = await req.json();
    const { nombre, descripcion, precio, precioOferta, categoriaId, imagenes, especificaciones, stock, rating, destacado } = body;

    if (!nombre || !descripcion || precio == null || !categoriaId || !imagenes) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios" },
        { status: 400 }
      );
    }

    const producto = await prisma.producto.create({
      data: {
        nombre,
        descripcion,
        precio: Number(precio),
        precioOferta: precioOferta ? Number(precioOferta) : null,
        categoriaId,
        imagenes,
        especificaciones: especificaciones
          ? typeof especificaciones === "string"
            ? especificaciones
            : JSON.stringify(especificaciones)
          : null,
        stock: Number(stock ?? 0),
        rating: Number(rating ?? 0),
        destacado: Boolean(destacado ?? false),
      },
      include: { categoria: true },
    });
    return NextResponse.json(producto, { status: 201 });
  } catch (e) {
    console.error("[POST /api/productos]", e);
    return NextResponse.json(
      { error: "Error al crear producto" },
      { status: 500 }
    );
  }
}
