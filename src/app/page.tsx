import Link from "next/link";
import { Leaf, Truck, ShieldCheck, Sparkles, ArrowRight, Tag } from "lucide-react";
import { HeroCarousel } from "@/components/site/hero-carousel";
import { ProductCard } from "@/components/site/product-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/db";
import { formatMXN } from "@/lib/format";

export const dynamic = "force-dynamic";

const CATEGORIA_INFO: Record<string, { emoji: string; desc: string }> = {
  sala: { emoji: "🛋️", desc: "Sofás y mesas" },
  cocina: { emoji: "🍳", desc: "Vajilla y utensilios" },
  dormitorio: { emoji: "🛏️", desc: "Ropa de cama y lámparas" },
  bano: { emoji: "🛁", desc: "Toallas y organizadores" },
  decoracion: { emoji: "🖼️", desc: "Cuadros y floreros" },
  jardin: { emoji: "🪴", desc: "Macetas y exteriores" },
};

async function getProductos() {
  try {
    return await prisma.producto.findMany({
      where: { destacado: true },
      include: { categoria: true },
      take: 6,
      orderBy: { rating: "desc" },
    });
  } catch {
    return [];
  }
}

async function getCategorias() {
  try {
    return await prisma.categoria.findMany({
      include: { _count: { select: { productos: true } } },
      orderBy: { nombre: "asc" },
    });
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const [productos, categorias] = await Promise.all([getProductos(), getCategorias()]);

  return (
    <>
      <HeroCarousel />

      {/* Beneficios */}
      <section className="border-b border-border bg-card">
        <div className="container mx-auto max-w-7xl px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Truck, title: "Envío a todo México", desc: "Gratis desde $1,500 MXN" },
              { icon: ShieldCheck, title: "Compra protegida", desc: "Garantía en cada pieza" },
              { icon: Leaf, title: "Materiales nobles", desc: "Madera, cerámica, lino" },
              { icon: Sparkles, title: "Artesanal mexicano", desc: "Hecho con cariño" },
            ].map((b, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-muted text-primary">
                  <b.icon className="h-5 w-5" />
                </span>
                <div className="text-sm">
                  <p className="font-medium">{b.title}</p>
                  <p className="text-xs text-muted-foreground">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categorías */}
      <section className="container mx-auto max-w-7xl px-4 py-16">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <p className="text-xs uppercase tracking-[0.3em] text-accent mb-2">
            Colecciones
          </p>
          <h2 className="font-serif text-4xl md:text-5xl font-semibold">
            Explora por categoría
          </h2>
          <p className="mt-3 text-muted-foreground">
            Desde la sala hasta el jardín, encuentra piezas para cada rincón de tu hogar.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categorias.map((c) => {
            const info = CATEGORIA_INFO[c.slug] ?? { emoji: "🪑", desc: c.nombre };
            return (
              <Link key={c.id} href={`/categoria/${c.slug}`} className="group">
                <Card className="overflow-hidden h-full border-border hover:shadow-md transition-shadow bg-card">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <span className="text-4xl mb-2 transition-transform group-hover:scale-110">
                      {info.emoji}
                    </span>
                    <p className="font-serif text-lg">{c.nombre}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {info.desc}
                    </p>
                    <Badge variant="outline" className="mt-2 text-[10px]">
                      {c._count.productos} productos
                    </Badge>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Destacados */}
      <section className="bg-muted/40 border-y border-border">
        <div className="container mx-auto max-w-7xl px-4 py-16">
          <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-accent mb-2">
                Selección Casa Bella
              </p>
              <h2 className="font-serif text-4xl font-semibold">
                Piezas destacadas
              </h2>
            </div>
            <Button asChild variant="outline">
              <Link href="/productos">
                Ver todo
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          {productos.length === 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-square bg-muted rounded-md animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {productos.map((p) => (
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
                    categoria: { nombre: p.categoria?.nombre ?? "", slug: p.categoria?.slug ?? "" },
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Promo Banner */}
      <section id="promo" className="container mx-auto max-w-7xl px-4 py-16">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary to-[#5a6450] text-primary-foreground p-8 md:p-14">
          <div className="absolute -right-10 -top-10 text-[12rem] leading-none opacity-10 select-none">
            🎁
          </div>
          <div className="relative max-w-2xl">
            <p className="text-xs uppercase tracking-[0.3em] text-primary-foreground/80 mb-2">
              Oferta de bienvenida
            </p>
            <h2 className="font-serif text-3xl md:text-4xl font-semibold">
              10% en tu primera compra
            </h2>
            <p className="mt-3 text-primary-foreground/85 max-w-lg">
              Estrena hogar con estilo. Usa el cupón{" "}
              <code className="px-2 py-1 bg-primary-foreground/15 rounded font-mono text-primary-foreground">
                BIENVENIDA10
              </code>{" "}
              al finalizar tu compra. Válido en toda la tienda.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild size="lg" variant="secondary">
                <Link href="/productos">
                  <Tag className="h-4 w-4" />
                  Comprar ahora
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
                <Link href="/carrito">Ir al carrito</Link>
              </Button>
            </div>
            <p className="mt-4 text-xs text-primary-foreground/60">
              Envío gratis desde {formatMXN(1500)}. No acumulable con otras promociones.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="container mx-auto max-w-7xl px-4 pb-20">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { titulo: "Asesoría de diseño", desc: "Te ayudamos a crear espacios que cuenten historias.", emoji: "🎨" },
            { titulo: "Muebles a medida", desc: "Soluciones personalizadas en madera y textil.", emoji: "🪚" },
            { titulo: "Eventos y empresas", desc: "Mobiliario y decoración para tu espacio de trabajo.", emoji: "🏢" },
          ].map((c, i) => (
            <Card key={i} className="bg-card border-border hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <span className="text-3xl block mb-3">{c.emoji}</span>
                <h3 className="font-serif text-xl font-semibold">{c.titulo}</h3>
                <p className="text-sm text-muted-foreground mt-2">{c.desc}</p>
                <Button asChild variant="link" className="mt-3 px-0 text-primary">
                  <Link href="/productos">
                    Conocer más
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </>
  );
}
