import { redirect } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  ClipboardList,
  LogOut,
  Leaf,
  Store,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { isAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!isAdmin()) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <header className="border-b border-border bg-card sticky top-0 z-40">
        <div className="container mx-auto max-w-7xl px-4 h-16 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-2">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Leaf className="h-4 w-4" />
            </span>
            <span className="font-serif text-xl">Casa Bella Admin</span>
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            <Button asChild variant="ghost" size="sm">
              <Link href="/admin">
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link href="/admin/productos">
                <Package className="h-4 w-4" />
                Productos
              </Link>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link href="/admin/ordenes">
                <ClipboardList className="h-4 w-4" />
                Órdenes
              </Link>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link href="/" target="_blank">
                <Store className="h-4 w-4" />
                Ver tienda
              </Link>
            </Button>
          </nav>
          <form action="/api/admin/logout" method="post">
            <Button asChild variant="outline" size="sm">
              <Link href="/api/admin/logout">
                <LogOut className="h-4 w-4" />
                Salir
              </Link>
            </Button>
          </form>
        </div>
      </header>
      <main className="flex-1 container mx-auto max-w-7xl px-4 py-6">
        {children}
      </main>
    </div>
  );
}
