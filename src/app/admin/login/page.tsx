"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Loader2, Leaf, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Error");
        return;
      }
      toast.success("Bienvenido");
      router.push("/admin");
      router.refresh();
    } catch {
      toast.error("Error de red");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-background p-4">
      <Card className="w-full max-w-md border-border bg-card">
        <CardHeader className="text-center">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground mx-auto mb-2">
            <Leaf className="h-7 w-7" />
          </div>
          <CardTitle className="font-serif text-3xl">Casa Bella Admin</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Acceso al panel de administración
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-10"
                  autoFocus
                />
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Ingresar"
              )}
            </Button>
            <Button asChild variant="link" className="w-full">
              <Link href="/">
                <ArrowLeft className="h-4 w-4" /> Volver a la tienda
              </Link>
            </Button>
          </form>
          <p className="mt-4 text-xs text-muted-foreground text-center">
            Demo: contraseña <code className="font-mono">admin123</code>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
