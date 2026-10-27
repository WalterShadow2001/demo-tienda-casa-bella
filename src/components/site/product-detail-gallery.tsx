"use client";

import * as React from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, Expand } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  imagenes: string[];
  nombre: string;
}

export function ProductDetailGallery({ imagenes, nombre }: Props) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selected, setSelected] = React.useState(0);
  const [lightbox, setLightbox] = React.useState(false);

  React.useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    onSelect();
  }, [emblaApi]);

  const imgs = imagenes.length > 0 ? imagenes : ["🪑"];

  return (
    <div>
      <div className="overflow-hidden rounded-xl border border-border bg-muted relative">
        <div ref={emblaRef} className="flex">
          {imgs.map((img, i) => (
            <div key={i} className="min-w-full">
              <div className="relative aspect-square flex items-center justify-center bg-gradient-to-br from-muted/60 to-muted">
                <span className="text-[14rem] leading-none select-none">
                  {img}
                </span>
                <span className="absolute bottom-3 right-3 px-2 py-1 rounded-full bg-background/80 text-xs text-muted-foreground">
                  {i + 1} / {imagenes.length}
                </span>
              </div>
            </div>
          ))}
        </div>
        {imgs.length > 1 && (
          <>
            <button
              onClick={() => emblaApi?.scrollPrev()}
              className="absolute left-2 top-1/2 -translate-y-1/2 inline-flex h-9 w-9 items-center justify-center rounded-full bg-background/80 backdrop-blur hover:bg-background transition-colors"
              aria-label="Anterior"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => emblaApi?.scrollNext()}
              className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex h-9 w-9 items-center justify-center rounded-full bg-background/80 backdrop-blur hover:bg-background transition-colors"
              aria-label="Siguiente"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
        <button
          onClick={() => setLightbox(true)}
          className="absolute top-2 right-2 inline-flex h-9 w-9 items-center justify-center rounded-full bg-background/80 backdrop-blur hover:bg-background transition-colors"
          aria-label="Ampliar"
        >
          <Expand className="h-4 w-4" />
        </button>
      </div>

      {/* Thumbnails */}
      {imgs.length > 1 && (
        <div className="flex gap-2 mt-3">
          {imgs.map((img, i) => (
            <button
              key={i}
              onClick={() => emblaApi?.scrollTo(i)}
              className={cn(
                "h-16 w-16 rounded-md border-2 flex items-center justify-center bg-muted text-2xl transition-all",
                selected === i
                  ? "border-primary"
                  : "border-border hover:border-muted-foreground"
              )}
              aria-label={`Ver imagen ${i + 1}`}
            >
              {img}
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-background/95 backdrop-blur flex items-center justify-center p-4"
          onClick={() => setLightbox(false)}
          role="dialog"
          aria-modal="true"
          aria-label={`Imagen ampliada de ${nombre}`}
        >
          <button
            className="absolute top-4 right-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-card hover:bg-muted"
            aria-label="Cerrar"
          >
            <ChevronRight className="h-5 w-5 rotate-45" />
          </button>
          <div className="text-[20rem] leading-none">{imagenes[selected]}</div>
        </div>
      )}
    </div>
  );
}
