import { notFound } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { prisma } from "@/lib/db";
import { formatMXN } from "@/lib/format";
import { ProductDetailGallery } from "@/components/site/product-detail-gallery";
import { ProductDetailActions } from "@/components/site/product-detail-actions";
import { ProductCard } from "@/components/site/product-card";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

async function getProducto(id: string) {
  try {
    return await prisma.producto.findUnique({
      where: { id },
      include: { categoria: true },
    });
  } catch {
    return null;
  }
}

async function getRelacionados(categoriaId: string, excludeId: string) {
  try {
    return await prisma.producto.findMany({
      where: { categoriaId, id: { not: excludeId } },
      take: 4,
      include: { categoria: true },
    });
  } catch {
    return [];
  }
}

export default async function ProductoPage({ params }: Props) {
  const { id } = await params;
  const producto = await getProducto(id);
  if (!producto) notFound();

  const relacionados = await getRelacionados(producto.categoriaId, id);
  const imagenes = producto.imagenes
    ? producto.imagenes.split(",").map((s) => s.trim()).filter(Boolean)
    : ["🪑"];

  const especificaciones = producto.especificaciones
    ? (() => {
        try {
          return JSON.parse(producto.especificaciones) as Record<string, string>;
        } catch {
          return null;
        }
      })()
    : null;

  const enOferta = producto.precioOferta != null && producto.precioOferta < producto.precio;
  const precioActual = producto.precioOferta ?? producto.precio;

  return (
    <>
      <section className="border-b border-border bg-muted/30">
        <div className="container mx-auto max-w-7xl px-4 py-6">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/">Inicio</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/productos">Tienda</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              {producto.categoria && (
                <>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link href={`/categoria/${producto.categoria.slug}`}>
                        {producto.categoria.nombre}
                      </Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                </>
              )}
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{producto.nombre}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </section>

      <section className="container mx-auto max-w-7xl px-4 py-10">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Gallery */}
          <div className="space-y-4">
            <ProductDetailGallery imagenes={imagenes} nombre={producto.nombre} />
          </div>

          {/* Info */}
          <div className="space-y-5">
            <div>
              <div className="flex items-center gap-2 mb-2">
                {producto.categoria && (
                  <Badge variant="outline">
                    {producto.categoria.nombre}
                  </Badge>
                )}
                {enOferta && (
                  <Badge className="bg-secondary text-secondary-foreground">
                    En oferta
                  </Badge>
                )}
                {producto.stock <= 0 && (
                  <Badge variant="outline" className="text-muted-foreground">
                    Agotado
                  </Badge>
                )}
              </div>
              <h1 className="font-serif text-3xl md:text-4xl font-semibold leading-tight">
                {producto.nombre}
              </h1>
            </div>

            <div className="flex items-baseline gap-3">
              {enOferta && (
                <span className="text-lg text-muted-foreground line-through">
                  {formatMXN(producto.precio)}
                </span>
              )}
              <span className="font-serif text-4xl font-semibold text-primary">
                {formatMXN(precioActual)}
              </span>
              {enOferta && (
                <Badge className="bg-accent text-accent-foreground">
                  Ahorra {Math.round((1 - (producto.precioOferta ?? producto.precio) / producto.precio) * 100)}%
                </Badge>
              )}
            </div>

            <p className="text-foreground/80 leading-relaxed">
              {producto.descripcion}
            </p>

            <Separator />

            {/* Actions */}
            <ProductDetailActions producto={producto} />

            <Separator />

            {/* Especificaciones */}
            {especificaciones && (
              <div>
                <h2 className="font-serif text-xl mb-3">Especificaciones</h2>
                <ul className="grid grid-cols-2 gap-2 text-sm">
                  {Object.entries(especificaciones).map(([k, v]) => (
                    <li
                      key={k}
                      className="flex items-start gap-2 p-3 bg-muted/40 rounded-md"
                    >
                      <span className="font-medium text-primary">{k}:</span>
                      <span className="text-foreground/80">{v}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <Separator />

            {/* Beneficios */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
              <div className="flex items-center gap-2 text-foreground/80">
                <span className="text-xl">🚚</span> Envío a todo México
              </div>
              <div className="flex items-center gap-2 text-foreground/80">
                <span className="text-xl">🛡️</span> Garantía 12 meses
              </div>
              <div className="flex items-center gap-2 text-foreground/80">
                <span className="text-xl">↩️</span> Devolución 30 días
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reseñas */}
      <section className="bg-muted/40 border-y border-border">
        <div className="container mx-auto max-w-7xl px-4 py-12">
          <h2 className="font-serif text-3xl font-semibold mb-6">Reseñas</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { nombre: "Laura M.", rating: 5, texto: "Calidad excelente, llegó antes de lo esperado. Súper recomendado." },
              { nombre: "Roberto G.", rating: 4, texto: "El acabado es hermoso. Solo tardó un poco más el envío, pero valió la pena." },
              { nombre: "Daniela R.", rating: 5, texto: "Atención al cliente impecable y la pieza es aún más bonita en persona." },
            ].map((r, i) => (
              <div key={i} className="bg-card p-5 rounded-lg border border-border">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium">{r.nombre}</p>
                  <div className="flex items-center text-accent text-sm">
                    {"★".repeat(r.rating)}
                    <span className="text-muted-foreground">{"★".repeat(5 - r.rating)}</span>
                  </div>
                </div>
                <p className="text-sm text-foreground/80">{r.texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Relacionados */}
      {relacionados.length > 0 && (
        <section className="container mx-auto max-w-7xl px-4 py-12">
          <h2 className="font-serif text-3xl font-semibold mb-6">
            También te puede gustar
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relacionados.map((p) => (
              <ProductCard
                key={p.id}
                product={{
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
                }}
              />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
