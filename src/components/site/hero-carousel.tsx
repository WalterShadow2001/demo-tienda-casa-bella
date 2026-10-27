"use client";

import * as React from "react";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import { motion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const SLIDES = [
  {
    eyebrow: "Nueva colección",
    title: "El arte de habitar",
    subtitle: "con elegancia mexicana",
    description:
      "Muebles y decoración que transforman tu casa en un hogar. Piezas de autor y artesanía mexicana hecha para durar.",
    cta: { label: "Explorar tienda", href: "/productos" },
    cta2: { label: "Ver promociones", href: "/#promo" },
    badge: "Primavera 2025",
    bg: "from-[#4A5340]/85 via-[#5a6450]/70 to-[#4A5340]/85",
    emoji: "🛋️",
  },
  {
    eyebrow: "Edición limitada",
    title: "Sala de estar",
    subtitle: "diseñada para vivir",
    description:
      "Sofás, mesas y sillones de líneas limpias y materiales nobles. Diseñados para acompañarte por años.",
    cta: { label: "Ver sala", href: "/categoria/sala" },
    cta2: { label: "Comprar ahora", href: "/productos" },
    badge: "Hasta 20% off",
    bg: "from-[#C68866]/85 via-[#d09a7c]/70 to-[#C68866]/85",
    emoji: "🪑",
  },
  {
    eyebrow: "Hecho en México",
    title: "Talavera y barro",
    subtitle: "tradición viva",
    description:
      "Vajillas, floreros y ollas de barro artesanales de Puebla y Metepec. Cada pieza cuenta una historia.",
    cta: { label: "Ver cocina", href: "/categoria/cocina" },
    cta2: { label: "Ver decoración", href: "/categoria/decoracion" },
    badge: "Artesanal",
    bg: "from-[#B8964A]/85 via-[#c9a85e]/70 to-[#B8964A]/85",
    emoji: "🏺",
  },
  {
    eyebrow: "Para el descanso",
    title: "Dormitorios",
    subtitle: "que abrazan el alma",
    description:
      "Ropa de cama en algodón egipcio, lámparas de latón y cabeceras talladas a mano. Tu santuario personal.",
    cta: { label: "Ver dormitorio", href: "/categoria/dormitorio" },
    cta2: { label: "Ver baño", href: "/categoria/bano" },
    badge: "Confort premium",
    bg: "from-[#6B6359]/85 via-[#82776a]/70 to-[#6B6359]/85",
    emoji: "🛏️",
  },
];

export function HeroCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });
  const [selected, setSelected] = React.useState(0);

  React.useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    onSelect();
    const id = setInterval(() => emblaApi.scrollNext(), 6000);
    return () => {
      emblaApi.off("select", onSelect);
      clearInterval(id);
    };
  }, [emblaApi]);

  return (
    <section className="relative" aria-label="Galería de productos destacados">
      <div className="overflow-hidden">
        <div ref={emblaRef} className="flex">
          {SLIDES.map((s, i) => (
            <div key={i} className="min-w-full">
              <div className={`relative bg-gradient-to-br ${s.bg} text-primary-foreground`}>
                <div className="container mx-auto max-w-7xl px-4">
                  <div className="grid md:grid-cols-2 items-center min-h-[60vh] md:min-h-[70vh] py-16 gap-8">
                    <motion.div
                      initial={{ opacity: 0, x: -24 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.05 }}
                      className="text-center md:text-left"
                    >
                      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-foreground/15 backdrop-blur text-xs uppercase tracking-[0.25em]">
                        <Sparkles className="h-3 w-3" />
                        {s.eyebrow}
                      </span>
                      <h2 className="mt-4 font-serif text-4xl md:text-6xl font-semibold leading-[1.05]">
                        {s.title}
                        <span className="block text-primary-foreground/85 italic font-normal text-3xl md:text-4xl">
                          {s.subtitle}
                        </span>
                      </h2>
                      <p className="mt-4 max-w-md mx-auto md:mx-0 text-primary-foreground/85 text-base">
                        {s.description}
                      </p>
                      <div className="mt-8 flex flex-wrap items-center gap-3 justify-center md:justify-start">
                        <Button asChild size="lg" variant="secondary">
                          <Link href={s.cta.href}>
                            {s.cta.label}
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button asChild size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
                          <Link href={s.cta2.href}>{s.cta2.label}</Link>
                        </Button>
                      </div>
                      <div className="mt-6 inline-flex items-center gap-2 text-xs text-primary-foreground/70">
                        <span className="h-px w-8 bg-primary-foreground/30" />
                        {s.badge}
                      </div>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.6, delay: 0.15 }}
                      className="hidden md:flex items-center justify-center"
                    >
                      <div className="relative">
                        <div className="absolute -inset-6 bg-primary-foreground/10 rounded-full blur-3xl" />
                        <div className="relative text-[14rem] leading-none drop-shadow-2xl">
                          {s.emoji}
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <button
        onClick={() => emblaApi?.scrollPrev()}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary-foreground/15 backdrop-blur text-primary-foreground hover:bg-primary-foreground/25 transition-colors"
        aria-label="Anterior"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={() => emblaApi?.scrollNext()}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary-foreground/15 backdrop-blur text-primary-foreground hover:bg-primary-foreground/25 transition-colors"
        aria-label="Siguiente"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => emblaApi?.scrollTo(i)}
            aria-label={`Ir a slide ${i + 1}`}
            className={`h-2 rounded-full transition-all ${
              selected === i ? "bg-primary-foreground w-8" : "bg-primary-foreground/40 w-2"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
