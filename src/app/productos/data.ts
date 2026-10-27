import { prisma } from "@/lib/db";

export interface CatalogProduct {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  precioOferta: number | null;
  imagenes: string;
  rating: number;
  stock: number;
  categoria?: { nombre: string; slug: string } | null;
}

interface GetOptions {
  categoria?: string;
  busqueda?: string;
  sort?: string;
  precioMin?: number;
  precioMax?: number;
  rating?: number;
}

export async function getProductsForCatalog(opts: GetOptions): Promise<CatalogProduct[]> {
  const where: Record<string, unknown> = {};
  if (opts.categoria) where.categoria = { slug: opts.categoria };
  if (opts.busqueda) {
    where.OR = [
      { nombre: { contains: opts.busqueda } },
      { descripcion: { contains: opts.busqueda } },
    ];
  }
  if (opts.precioMin || opts.precioMax) {
    const range: Record<string, number> = {};
    if (opts.precioMin) range.gte = opts.precioMin;
    if (opts.precioMax) range.lte = opts.precioMax;
    where.precio = range;
  }
  if (opts.rating) where.rating = { gte: opts.rating };

  let orderBy: Record<string, "asc" | "desc"> = { creadoEn: "desc" };
  switch (opts.sort) {
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
  }

  try {
    const productos = await prisma.producto.findMany({
      where,
      orderBy,
      include: { categoria: true },
    });
    return productos.map((p) => ({
      id: p.id,
      nombre: p.nombre,
      descripcion: p.descripcion,
      precio: p.precio,
      precioOferta: p.precioOferta,
      imagenes: p.imagenes,
      rating: p.rating,
      stock: p.stock,
      categoria: p.categoria
        ? { nombre: p.categoria.nombre, slug: p.categoria.slug }
        : null,
    }));
  } catch (e) {
    console.error("getProductsForCatalog", e);
    return [];
  }
}

export async function getCategoriasForFilter() {
  try {
    return await prisma.categoria.findMany({
      include: { _count: { select: { productos: true } } },
      orderBy: { nombre: "asc" },
    });
  } catch {
    return [];
  }
}
