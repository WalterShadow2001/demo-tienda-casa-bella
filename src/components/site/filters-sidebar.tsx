"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { SlidersHorizontal, X, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export interface FiltersSidebarCategoria {
  id: string;
  nombre: string;
  slug: string;
  _count?: { productos: number };
}

interface InitialValues {
  categoria?: string;
  busqueda?: string;
  sort?: string;
  precioMin?: number;
  precioMax?: number;
  rating?: number;
}

interface Props {
  categorias: FiltersSidebarCategoria[];
  categoriaActiva?: string;
  precioMax: number;
  initialValues?: InitialValues;
}

export function FiltersSidebar({
  categorias,
  categoriaActiva,
  precioMax,
  initialValues = {},
}: Props) {
  const router = useRouter();
  const [precio, setPrecio] = React.useState<number[]>([
    initialValues.precioMin ?? 0,
    initialValues.precioMax ?? precioMax,
  ]);
  const [busqueda, setBusqueda] = React.useState(initialValues.busqueda ?? "");
  const sort = initialValues.sort ?? "recientes";
  const ratingValue = initialValues.rating;
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const current = new URLSearchParams();
  if (initialValues.categoria) current.set("categoria", initialValues.categoria);
  if (initialValues.busqueda) current.set("busqueda", initialValues.busqueda);
  if (initialValues.sort && initialValues.sort !== "recientes")
    current.set("sort", initialValues.sort);
  if (initialValues.precioMin) current.set("precioMin", String(initialValues.precioMin));
  if (initialValues.precioMax && initialValues.precioMax < precioMax)
    current.set("precioMax", String(initialValues.precioMax));
  if (initialValues.rating) current.set("rating", String(initialValues.rating));

  const applyFilters = React.useCallback(
    (overrides: Record<string, string | number | undefined> = {}) => {
      const next = new URLSearchParams(current.toString());
      Object.entries(overrides).forEach(([k, v]) => {
        if (v === undefined || v === "" || (typeof v === "number" && v === 0))
          next.delete(k);
        else next.set(k, String(v));
      });
      router.push(`/productos?${next.toString()}`);
      setMobileOpen(false);
    },
    [current, router]
  );

  const setCategoria = (slug: string | undefined) =>
    applyFilters({ categoria: slug });
  const setSort = (v: string) => applyFilters({ sort: v === "recientes" ? undefined : v });

  const Content = (
    <div className="space-y-6">
      <div>
        <h3 className="font-serif text-lg mb-3">Categorías</h3>
        <ul className="space-y-1">
          <li>
            <button
              onClick={() => setCategoria(undefined)}
              className={cn(
                "w-full text-left px-3 py-2 text-sm rounded-md transition-colors",
                !categoriaActiva
                  ? "bg-muted text-primary font-medium"
                  : "text-foreground/70 hover:bg-muted"
              )}
            >
              Todas las categorías
            </button>
          </li>
          {categorias.map((c) => (
            <li key={c.id}>
              <button
                onClick={() => setCategoria(c.slug)}
                className={cn(
                  "w-full text-left px-3 py-2 text-sm rounded-md transition-colors flex items-center justify-between",
                  categoriaActiva === c.slug
                    ? "bg-muted text-primary font-medium"
                    : "text-foreground/70 hover:bg-muted"
                )}
              >
                <span>{c.nombre}</span>
                {c._count?.productos != null && (
                  <Badge variant="outline" className="text-[10px]">
                    {c._count.productos}
                  </Badge>
                )}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <Separator />

      <div>
        <h3 className="font-serif text-lg mb-3">Buscar</h3>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            applyFilters({ busqueda: busqueda || undefined });
          }}
          className="flex gap-2"
        >
          <Input
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar productos..."
            aria-label="Buscar productos"
          />
          <Button type="submit" size="icon">
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
        </form>
      </div>

      <Separator />

      <div>
        <h3 className="font-serif text-lg mb-3">Rango de precio</h3>
        <Slider
          min={0}
          max={precioMax}
          step={100}
          value={precio}
          onValueChange={setPrecio}
          onValueCommit={(v) =>
            applyFilters({
              precioMin: v[0] > 0 ? v[0] : undefined,
              precioMax: v[1] < precioMax ? v[1] : undefined,
            })
          }
          className="py-2"
          aria-label="Rango de precio"
        />
        <div className="flex items-center justify-between text-sm text-muted-foreground mt-2">
          <span>${precio[0].toLocaleString("es-MX")}</span>
          <span>${precio[1].toLocaleString("es-MX")} MXN</span>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="font-serif text-lg mb-3">Ordenar por</h3>
        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger className="w-full" aria-label="Ordenar">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recientes">Más recientes</SelectItem>
            <SelectItem value="precio_asc">Precio: menor a mayor</SelectItem>
            <SelectItem value="precio_desc">Precio: mayor a menor</SelectItem>
            <SelectItem value="rating">Mejor valorados</SelectItem>
            <SelectItem value="nombre">Nombre A-Z</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Separator />

      <div>
        <h3 className="font-serif text-lg mb-3 flex items-center gap-2">
          <Star className="h-4 w-4 text-accent" /> Valoración
        </h3>
        <div className="flex flex-col gap-1">
          {[4.5, 4, 3].map((r) => (
            <button
              key={r}
              onClick={() =>
                applyFilters({
                  rating: r === ratingValue ? undefined : r,
                  sort: !sort || sort === "recientes" ? "rating" : sort,
                })
              }
              className={cn(
                "px-3 py-2 text-sm rounded-md text-left transition-colors",
                ratingValue === r
                  ? "bg-muted text-primary font-medium"
                  : "text-foreground/70 hover:bg-muted"
              )}
            >
              <span className="inline-flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-3 w-3",
                      i <= Math.floor(r)
                        ? "fill-accent text-accent"
                        : "text-muted-foreground"
                    )}
                  />
                ))}
                {r === 4.5 ? "4.5+ estrellas" : r === 4 ? "4+ estrellas" : "3+ estrellas"}
              </span>
            </button>
          ))}
        </div>
      </div>

      <Separator />

      <Button
        variant="outline"
        className="w-full"
        onClick={() => router.push("/productos")}
      >
        <X className="h-4 w-4" />
        Limpiar filtros
      </Button>
    </div>
  );

  return (
    <>
      <aside className="hidden md:block w-64 shrink-0">
        <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto scrollbar-casa pr-1">
          {Content}
        </div>
      </aside>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" className="md:hidden w-full">
            <SlidersHorizontal className="h-4 w-4" />
            Filtros
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[300px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="font-serif text-xl">Filtros</SheetTitle>
          </SheetHeader>
          <div className="mt-4">{Content}</div>
        </SheetContent>
      </Sheet>
    </>
  );
}
