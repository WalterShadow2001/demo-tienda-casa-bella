"use client";

import * as React from "react";
import { Plus, Pencil, Trash2, Loader2, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { formatMXN } from "@/lib/format";
import { toast } from "sonner";

interface Producto {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  precioOferta: number | null;
  categoriaId: string;
  categoria?: { id: string; nombre: string; slug: string };
  imagenes: string;
  especificaciones: string | null;
  stock: number;
  rating: number;
  destacado: boolean;
}

interface Categoria {
  id: string;
  nombre: string;
  slug: string;
}

export function AdminProductos() {
  const [productos, setProductos] = React.useState<Producto[]>([]);
  const [categorias, setCategorias] = React.useState<Categoria[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Producto | null>(null);

  async function load() {
    setLoading(true);
    try {
      const [p, c] = await Promise.all([
        fetch("/api/productos").then((r) => r.json()),
        fetch("/api/categorias").then((r) => r.json()),
      ]);
      setProductos(p);
      setCategorias(c);
    } catch {
      toast.error("Error al cargar datos");
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    load();
  }, []);

  async function onDelete(id: string) {
    try {
      const res = await fetch(`/api/productos/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Producto eliminado");
      load();
    } catch {
      toast.error("Error al eliminar");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-serif text-3xl font-semibold">Productos</h1>
          <p className="text-sm text-muted-foreground">
            {productos.length} productos en el catálogo
          </p>
        </div>
        <Button
          onClick={() => {
            setEditing(null);
            setDialogOpen(true);
          }}
        >
          <Plus className="h-4 w-4" />
          Nuevo producto
        </Button>
      </div>

      <ProductoDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        producto={editing}
        categorias={categorias}
        onSaved={load}
      />

      <div className="border border-border rounded-lg bg-card overflow-hidden">
        {loading ? (
          <div className="p-4 space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto scrollbar-casa">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Producto</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead>Precio</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Destacado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {productos.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="h-9 w-9 rounded-md bg-muted flex items-center justify-center text-lg">
                          {p.imagenes?.split(",")[0] || "🪑"}
                        </span>
                        <div className="min-w-0">
                          <p className="font-medium line-clamp-1">{p.nombre}</p>
                          <p className="text-xs text-muted-foreground line-clamp-1 max-w-xs">
                            {p.descripcion}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{p.categoria?.nombre ?? "—"}</Badge>
                    </TableCell>
                    <TableCell>
                      {p.precioOferta != null ? (
                        <div className="flex flex-col">
                          <span className="text-xs line-through text-muted-foreground">
                            {formatMXN(p.precio)}
                          </span>
                          <span className="font-medium text-secondary">
                            {formatMXN(p.precioOferta)}
                          </span>
                        </div>
                      ) : (
                        <span className="font-medium">{formatMXN(p.precio)}</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span
                        className={
                          p.stock <= 0
                            ? "text-destructive font-medium"
                            : p.stock < 5
                            ? "text-amber-700 font-medium"
                            : ""
                        }
                      >
                        {p.stock}
                      </span>
                    </TableCell>
                    <TableCell>
                      {p.rating > 0 ? p.rating.toFixed(1) : "—"}
                    </TableCell>
                    <TableCell>
                      {p.destacado ? (
                        <Badge>Destacado</Badge>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setEditing(p);
                            setDialogOpen(true);
                          }}
                          aria-label="Editar"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" aria-label="Eliminar">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                ¿Eliminar producto?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta acción no se puede deshacer. El producto
                                "{p.nombre}" será eliminado permanentemente.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => onDelete(p.id)}
                                className="bg-destructive text-white hover:bg-destructive/90"
                              >
                                Eliminar
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {productos.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                      <Package className="h-8 w-8 mx-auto mb-2" />
                      No hay productos. Crea el primero.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}

function ProductoDialog({
  open,
  onOpenChange,
  producto,
  categorias,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  producto: Producto | null;
  categorias: Categoria[];
  onSaved: () => void;
}) {
  const isEdit = !!producto;
  const [saving, setSaving] = React.useState(false);
  const [form, setForm] = React.useState({
    nombre: "",
    descripcion: "",
    precio: "",
    precioOferta: "",
    categoriaId: "",
    imagenes: "",
    especificaciones: "",
    stock: "0",
    rating: "0",
    destacado: false,
  });

  React.useEffect(() => {
    if (producto) {
      setForm({
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        precio: String(producto.precio),
        precioOferta: producto.precioOferta ? String(producto.precioOferta) : "",
        categoriaId: producto.categoriaId,
        imagenes: producto.imagenes,
        especificaciones: producto.especificaciones ?? "",
        stock: String(producto.stock),
        rating: String(producto.rating),
        destacado: producto.destacado,
      });
    } else {
      setForm({
        nombre: "",
        descripcion: "",
        precio: "",
        precioOferta: "",
        categoriaId: categorias[0]?.id ?? "",
        imagenes: "🪑",
        especificaciones: "",
        stock: "10",
        rating: "0",
        destacado: false,
      });
    }
  }, [producto, categorias, open]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.nombre || !form.descripcion || !form.precio || !form.categoriaId || !form.imagenes) {
      toast.error("Completa todos los campos requeridos");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        nombre: form.nombre,
        descripcion: form.descripcion,
        precio: Number(form.precio),
        precioOferta: form.precioOferta ? Number(form.precioOferta) : null,
        categoriaId: form.categoriaId,
        imagenes: form.imagenes,
        especificaciones: form.especificaciones || null,
        stock: Number(form.stock),
        rating: Number(form.rating),
        destacado: form.destacado,
      };
      const res = isEdit
        ? await fetch(`/api/productos/${producto!.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          })
        : await fetch("/api/productos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Error");
      }
      toast.success(isEdit ? "Producto actualizado" : "Producto creado");
      onOpenChange(false);
      onSaved();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto scrollbar-casa">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl">
            {isEdit ? "Editar producto" : "Nuevo producto"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="nombre">Nombre *</Label>
              <Input
                id="nombre"
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="descripcion">Descripción *</Label>
              <Textarea
                id="descripcion"
                value={form.descripcion}
                onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="precio">Precio (MXN) *</Label>
              <Input
                id="precio"
                type="number"
                value={form.precio}
                onChange={(e) => setForm({ ...form, precio: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="precioOferta">Precio de oferta (opcional)</Label>
              <Input
                id="precioOferta"
                type="number"
                value={form.precioOferta}
                onChange={(e) => setForm({ ...form, precioOferta: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Categoría *</Label>
              <Select
                value={form.categoriaId}
                onValueChange={(v) => setForm({ ...form, categoriaId: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar..." />
                </SelectTrigger>
                <SelectContent>
                  {categorias.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="imagenes">Imagen (emoji) *</Label>
              <Input
                id="imagenes"
                value={form.imagenes}
                onChange={(e) => setForm({ ...form, imagenes: e.target.value })}
                placeholder="🪑"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stock">Stock</Label>
              <Input
                id="stock"
                type="number"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rating">Rating (0-5)</Label>
              <Input
                id="rating"
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={form.rating}
                onChange={(e) => setForm({ ...form, rating: e.target.value })}
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="especificaciones">Especificaciones (JSON)</Label>
              <Textarea
                id="especificaciones"
                value={form.especificaciones}
                onChange={(e) => setForm({ ...form, especificaciones: e.target.value })}
                placeholder='{"Medidas":"180x90cm","Material":"Madera"}'
                rows={2}
              />
            </div>
            <div className="flex items-center gap-3 sm:col-span-2">
              <Switch
                id="destacado"
                checked={form.destacado}
                onCheckedChange={(v) => setForm({ ...form, destacado: v })}
              />
              <Label htmlFor="destacado">Mostrar como destacado</Label>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancelar
              </Button>
            </DialogClose>
            <Button type="submit" disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : isEdit ? "Guardar" : "Crear"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
