"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star, ShoppingCart, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/lib/cart-store";
import { formatMXN } from "@/lib/format";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export interface ProductCardProduct {
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

export function ProductCard({ product }: { product: ProductCardProduct }) {
  const add = useCart((s) => s.add);
  const precioActual = product.precioOferta ?? product.precio;
  const enOferta = product.precioOferta != null && product.precioOferta < product.precio;
  const sinStock = product.stock <= 0;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="h-full"
    >
      <Card className="overflow-hidden group h-full flex flex-col border-border bg-card hover:shadow-md transition-shadow">
        <Link
          href={`/producto/${product.id}`}
          className="relative block aspect-square bg-muted overflow-hidden"
          aria-label={`Ver ${product.nombre}`}
        >
          <div className="absolute inset-0 flex items-center justify-center text-7xl opacity-90 transition-transform duration-300 group-hover:scale-110">
            {product.imagen?.split(",")[0] || "🪑"}
          </div>
          {enOferta && (
            <Badge className="absolute top-3 left-3 bg-secondary text-secondary-foreground">
              Oferta
            </Badge>
          )}
          {sinStock && (
            <Badge className="absolute top-3 right-3 bg-muted text-muted-foreground">
              Agotado
            </Badge>
          )}
          {product.categoria && (
            <Badge
              variant="outline"
              className="absolute bottom-3 left-3 bg-background/80 backdrop-blur"
            >
              {product.categoria.nombre}
            </Badge>
          )}
        </Link>
        <CardContent className="p-4 flex flex-col flex-1">
          <div className="flex items-start gap-1">
            {product.rating > 0 && (
              <div className="flex items-center gap-0.5 text-xs text-accent">
                <Star className="h-3 w-3 fill-current" />
                <span>{product.rating.toFixed(1)}</span>
              </div>
            )}
          </div>
          <Link
            href={`/producto/${product.id}`}
            className="mt-1 font-serif text-lg leading-tight line-clamp-2 hover:text-primary transition-colors"
          >
            {product.nombre}
          </Link>
          <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
            {product.descripcion}
          </p>
          <div className="mt-auto pt-3 flex items-end justify-between gap-2">
            <div className="flex flex-col">
              {enOferta && (
                <span className="text-xs text-muted-foreground line-through">
                  {formatMXN(product.precio)}
                </span>
              )}
              <span
                className={cn(
                  "font-serif text-xl font-semibold",
                  enOferta ? "text-secondary" : "text-foreground"
                )}
              >
                {formatMXN(precioActual)}
              </span>
            </div>
            <div className="flex gap-1">
              <Button asChild size="icon" variant="outline" aria-label="Ver detalle">
                <Link href={`/producto/${product.id}`}>
                  <Eye className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="icon"
                disabled={sinStock}
                onClick={() => {
                  add({
                    productoId: product.id,
                    nombre: product.nombre,
                    precio: precioActual,
                    imagen: product.imagen?.split(",")[0] || "🪑",
                    categoria: product.categoria?.slug,
                  });
                  toast.success(`${product.nombre} agregado al carrito`);
                }}
                aria-label={`Agregar ${product.nombre} al carrito`}
              >
                <ShoppingCart className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function ProductCardSkeleton() {
  return (
    <Card className="overflow-hidden border-border bg-card">
      <div className="aspect-square bg-muted animate-pulse" />
      <CardContent className="p-4 space-y-2">
        <div className="h-3 w-20 bg-muted rounded animate-pulse" />
        <div className="h-5 w-full bg-muted rounded animate-pulse" />
        <div className="h-3 w-3/4 bg-muted rounded animate-pulse" />
        <div className="flex items-end justify-between pt-2">
          <div className="h-6 w-24 bg-muted rounded animate-pulse" />
          <div className="h-9 w-9 bg-muted rounded animate-pulse" />
        </div>
      </CardContent>
    </Card>
  );
}
