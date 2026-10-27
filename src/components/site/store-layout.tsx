"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  LayoutGrid,
  ShoppingCart,
  Search,
  Menu,
  X,
  Leaf,
  Instagram,
  Facebook,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { CartDrawer } from "@/components/site/cart-drawer";
import { useCart } from "@/lib/cart-store";
import { cn } from "@/lib/utils";
import { useRouter, usePathname } from "next/navigation";

const NAV = [
  { href: "/", label: "Inicio", icon: Home },
  { href: "/productos", label: "Tienda", icon: LayoutGrid },
  { href: "/categoria/sala", label: "Sala" },
  { href: "/categoria/cocina", label: "Cocina" },
  { href: "/categoria/dormitorio", label: "Dormitorio" },
  { href: "/categoria/decoracion", label: "Decoración" },
];

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 group" aria-label="Casa Bella inicio">
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm transition-transform group-hover:scale-105">
        <Leaf className="h-5 w-5" />
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-serif text-2xl font-semibold tracking-tight text-foreground">
          Casa Bella
        </span>
        <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
          Hogar &amp; Decoración
        </span>
      </span>
    </Link>
  );
}

function DesktopNav({ pathname }: { pathname: string }) {
  return (
    <nav className="hidden md:flex items-center gap-1">
      {NAV.map((item) => {
        const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "px-3 py-2 text-sm font-medium rounded-md transition-colors",
              active
                ? "text-primary bg-muted"
                : "text-foreground/70 hover:text-foreground hover:bg-muted"
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

function MobileNav({ pathname }: { pathname: string }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden" aria-label="Abrir menú">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[280px] sm:w-[320px]">
        <div className="flex items-center justify-between mb-6">
          <Logo />
          <SheetClose asChild>
            <Button variant="ghost" size="icon" aria-label="Cerrar">
              <X className="h-5 w-5" />
            </Button>
          </SheetClose>
        </div>
        <nav className="flex flex-col gap-1">
          {NAV.map((item) => {
            const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <SheetClose asChild key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "px-3 py-2.5 text-base font-medium rounded-md transition-colors",
                    active ? "text-primary bg-muted" : "text-foreground/80 hover:bg-muted"
                  )}
                >
                  {item.label}
                </Link>
              </SheetClose>
            );
          })}
          <SheetClose asChild>
            <Link
              href="/admin/login"
              className="mt-4 px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground rounded-md border border-border"
            >
              Acceso administrador
            </Link>
          </SheetClose>
        </nav>
      </SheetContent>
    </Sheet>
  );
}

function SearchBar() {
  const [open, setOpen] = React.useState(false);
  const [q, setQ] = React.useState("");
  const router = useRouter();
  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        aria-label="Buscar"
        onClick={() => setOpen(true)}
        className="text-foreground/80 hover:text-foreground"
      >
        <Search className="h-5 w-5" />
      </Button>
      <AnimatePresence>
        {open && (
          <motion.form
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="absolute right-0 top-full mt-2 z-50 w-[90vw] max-w-md"
            onSubmit={(e) => {
              e.preventDefault();
              if (q.trim()) {
                router.push(`/productos?busqueda=${encodeURIComponent(q.trim())}`);
                setOpen(false);
                setQ("");
              }
            }}
          >
            <div className="flex gap-2 bg-card border border-border rounded-lg p-2 shadow-lg">
              <Input
                autoFocus
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Buscar productos..."
                className="border-0 shadow-none focus-visible:ring-0"
                aria-label="Texto de búsqueda"
              />
              <Button type="submit" size="sm">
                Buscar
              </Button>
              <Button type="button" size="sm" variant="ghost" onClick={() => setOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </>
  );
}

function CartButton() {
  const count = useCart((s) => s.count());
  return (
    <CartDrawer>
      <Button variant="ghost" size="icon" aria-label="Carrito" className="relative">
        <ShoppingCart className="h-5 w-5" />
        {count > 0 && (
          <Badge className="absolute -top-1 -right-1 h-5 min-w-5 px-1 rounded-full bg-secondary text-secondary-foreground text-[10px] flex items-center justify-center">
            {count}
          </Badge>
        )}
      </Button>
    </CartDrawer>
  );
}

export function StoreLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");
  const isCheckout = pathname === "/checkout";

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      {!isCheckout && (
        <header className="sticky top-0 z-40 w-full border-b border-border bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto max-w-7xl px-4">
            <div className="flex h-16 items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <MobileNav pathname={pathname} />
                <Logo />
              </div>
              <DesktopNav pathname={pathname} />
              <div className="flex items-center gap-1 relative">
                <SearchBar />
                <CartButton />
                <Link
                  href="/admin/login"
                  className="hidden md:inline-block ml-2 text-xs text-muted-foreground hover:text-foreground"
                  aria-label="Acceso administrador"
                >
                  Admin
                </Link>
              </div>
            </div>
          </div>
        </header>
      )}
      <main className="flex-1 flex flex-col">{children}</main>
      <Footer />
    </>
  );
}

function Footer() {
  return (
    <footer className="mt-auto bg-primary text-primary-foreground">
      <div className="container mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                <Leaf className="h-4 w-4" />
              </span>
              <span className="font-serif text-xl font-semibold">Casa Bella</span>
            </div>
            <p className="text-sm text-primary-foreground/80 max-w-md">
              Muebles y decoración para tu hogar con elegancia mexicana. Diseños
              atemporales, artesanía de autor y materiales nobles. Envíos a todo
              México.
            </p>
            <div className="flex items-center gap-3 mt-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4" />
              </a>
            </div>
          </div>
          <div>
            <h3 className="font-serif text-lg mb-3">Navegación</h3>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li><Link href="/" className="hover:text-primary-foreground">Inicio</Link></li>
              <li><Link href="/productos" className="hover:text-primary-foreground">Tienda</Link></li>
              <li><Link href="/categoria/sala" className="hover:text-primary-foreground">Sala</Link></li>
              <li><Link href="/categoria/cocina" className="hover:text-primary-foreground">Cocina</Link></li>
              <li><Link href="/categoria/jardin" className="hover:text-primary-foreground">Jardín</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-serif text-lg mb-3">Contacto</h3>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                <span>Av. Industria 123, Delicias, Chihuahua</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>(639) 472 0099</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>hola@casabella.mx</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="divider-casa my-6 opacity-30" />
        <div className="flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-primary-foreground/70">
          <p>© {new Date().getFullYear()} Casa Bella. Hecho con cariño en México.</p>
          <p>Políticas de privacidad · Términos y condiciones</p>
        </div>
      </div>
    </footer>
  );
}
