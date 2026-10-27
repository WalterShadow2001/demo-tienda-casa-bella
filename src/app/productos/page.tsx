import Link from "next/link";
import { getProductsForCatalog, getCategoriasForFilter } from "./data";
import { ProductsGrid } from "@/components/site/products-grid";
import { FiltersSidebar } from "@/components/site/filters-sidebar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ProductosPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const categoria = typeof params.categoria === "string" ? params.categoria : undefined;
  const busqueda = typeof params.busqueda === "string" ? params.busqueda : undefined;
  const sort = typeof params.sort === "string" ? params.sort : "recientes";
  const precioMin = params.precioMin ? Number(params.precioMin) : 0;
  const precioMaxParam = params.precioMax ? Number(params.precioMax) : 7000;
  const rating = params.rating ? Number(params.rating) : undefined;

  const [productos, categorias] = await Promise.all([
    getProductsForCatalog({
      categoria,
      busqueda,
      sort,
      precioMin,
      precioMax: precioMaxParam,
      rating,
    }),
    getCategoriasForFilter(),
  ]);

  const catActiva = categorias.find((c) => c.slug === categoria);

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
                <BreadcrumbPage>Tienda</BreadcrumbPage>
              </BreadcrumbItem>
              {catActiva && (
                <>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>{catActiva.nombre}</BreadcrumbPage>
                  </BreadcrumbItem>
                </>
              )}
            </BreadcrumbList>
          </Breadcrumb>
          <div className="mt-4 flex items-end justify-between flex-wrap gap-3">
            <div>
              <h1 className="font-serif text-4xl md:text-5xl font-semibold">
                {catActiva ? catActiva.nombre : "Todos los productos"}
              </h1>
              <p className="mt-2 text-muted-foreground">
                {busqueda
                  ? `Resultados para "${busqueda}"`
                  : catActiva
                  ? "Explora nuestra colección por categoría"
                  : "Descubre piezas únicas para tu hogar"}
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              {productos.length} {productos.length === 1 ? "producto" : "productos"}
            </p>
          </div>
        </div>
      </section>

      <section className="container mx-auto max-w-7xl px-4 py-10 flex gap-8">
        <FiltersSidebar
          categorias={categorias}
          categoriaActiva={categoria}
          precioMax={7000}
          initialValues={{
            categoria,
            busqueda,
            sort,
            precioMin,
            precioMax: precioMaxParam,
            rating,
          }}
        />
        <div className="flex-1 min-w-0">
          {productos.length === 0 ? (
            <Alert className="bg-card">
              <Info className="h-4 w-4" />
              <AlertDescription>
                No encontramos productos con los filtros seleccionados.{" "}
                <Link href="/productos" className="underline">
                  Limpiar filtros
                </Link>
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
