import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isAdmin } from "@/lib/auth";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const producto = await prisma.producto.findUnique({
      where: { id },
      include: { categoria: true },
    });
    if (!producto) {
      return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });
    }
    return NextResponse.json(producto);
  } catch (e) {
    console.error("[GET /api/productos/[id]]", e);
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    const { id } = await params;
    const body = await req.json();
    const data: Record<string, unknown> = {};
    if (body.nombre !== undefined) data.nombre = body.nombre;
    if (body.descripcion !== undefined) data.descripcion = body.descripcion;
    if (body.precio !== undefined) data.precio = Number(body.precio);
    if (body.precioOferta !== undefined)
      data.precioOferta = body.precioOferta ? Number(body.precioOferta) : null;
    if (body.categoriaId !== undefined) data.categoriaId = body.categoriaId;
    if (body.imagenes !== undefined) data.imagenes = body.imagenes;
    if (body.especificaciones !== undefined) {
      data.especificaciones = body.especificaciones
        ? typeof body.especificaciones === "string"
          ? body.especificaciones
          : JSON.stringify(body.especificaciones)
        : null;
    }
    if (body.stock !== undefined) data.stock = Number(body.stock);
    if (body.rating !== undefined) data.rating = Number(body.rating);
    if (body.destacado !== undefined) data.destacado = Boolean(body.destacado);

    const updated = await prisma.producto.update({
      where: { id },
      data,
      include: { categoria: true },
    });
    return NextResponse.json(updated);
  } catch (e) {
    console.error("[PUT /api/productos/[id]]", e);
    return NextResponse.json({ error: "Error al actualizar" }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    const { id } = await params;
    await prisma.producto.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[DELETE /api/productos/[id]]", e);
    return NextResponse.json({ error: "Error al eliminar" }, { status: 500 });
  }
}
