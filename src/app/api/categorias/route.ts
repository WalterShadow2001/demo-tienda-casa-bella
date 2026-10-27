import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isAdmin } from "@/lib/auth";
import { slugify } from "@/lib/format";

export async function GET() {
  try {
    const categorias = await prisma.categoria.findMany({
      include: { _count: { select: { productos: true } } },
      orderBy: { nombre: "asc" },
    });
    return NextResponse.json(categorias);
  } catch (e) {
    console.error("[GET /api/categorias]", e);
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    if (!isAdmin()) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    const body = await req.json();
    const { nombre, slug } = body;
    if (!nombre) {
      return NextResponse.json({ error: "Nombre requerido" }, { status: 400 });
    }
    const created = await prisma.categoria.create({
      data: { nombre, slug: slug || slugify(nombre) },
    });
    return NextResponse.json(created, { status: 201 });
  } catch (e) {
    console.error("[POST /api/categorias]", e);
    return NextResponse.json({ error: "Error al crear categoría" }, { status: 500 });
  }
}
