import { notFound } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { prisma } from "@/lib/db";
import { ProductsGrid } from "@/components/site/products-grid";
import { getProductsForCatalog, getCategoriasForFilter } from "@/app/productos/data";
import { FiltersSidebar } from "@/components/site/filters-sidebar";
import { Info } from "lucide-react";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

async function getCategoriaBySlug(slug: string) {
  try {
    return await prisma.categoria.findUnique({ where: { slug } });
  } catch {
    return null;
  }
}

export default async function CategoriaPage({ params }: Props) {
  const { slug } = await params;
  const categoria = await getCategoriaBySlug(slug);
  if (!categoria) notFound();

  const [productos, categorias] = await Promise.all([
    getProductsForCatalog({ categoria: slug }),
    getCategoriasForFilter(),
  ]);

  return (
    <>
      <section className="border-b border-border bg-muted/30">
        <div className="container mx-auto max-w-7xl px-4 py-8">
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
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{categoria.nombre}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="mt-4 flex items-end justify-between flex-wrap gap-3">
            <div>
              <h1 className="font-serif text-4xl md:text-5xl font-semibold">
                {categoria.nombre}
              </h1>
              <p className="mt-2 text-muted-foreground">
                {productos.length} {productos.length === 1 ? "pieza" : "piezas"} en esta colección
              </p>
            </div>
            <Button asChild variant="outline">
              <Link href="/productos">
                Ver toda la tienda
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="container mx-auto max-w-7xl px-4 py-10 flex gap-8">
        <FiltersSidebar
          categorias={categorias}
          categoriaActiva={slug}
          precioMax={7000}
          initialValues={{ categoria: slug }}
        />
        <div className="flex-1 min-w-0">
          {productos.length === 0 ? (
            <Alert className="bg-card">
              <Info className="h-4 w-4" />
              <AlertDescription>
                No hay productos disponibles en esta categoría en este momento.
              </AlertDescription>
            </Alert>
          ) : (
            <ProductsGrid productos={productos} />
          )}
        </div>
      </section>
    </>
  );
}
