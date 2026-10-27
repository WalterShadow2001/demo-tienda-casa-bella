import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { codigo, subtotal } = await req.json();
    if (!codigo) {
      return NextResponse.json(
        { valido: false, descuento: 0, error: "Código requerido" },
        { status: 400 }
      );
    }
    const cupon = await prisma.cupon.findUnique({
      where: { codigo: String(codigo).toUpperCase() },
    });
    if (!cupon || !cupon.activo) {
      return NextResponse.json({
        valido: false,
        descuento: 0,
        error: "Cupón no válido o inactivo",
      });
    }
    // Special: CASA20 requires subtotal >= 2000
    if (cupon.codigo === "CASA20" && subtotal != null && subtotal < 2000) {
      return NextResponse.json({
        valido: false,
        descuento: 0,
        error: "Este cupón requiere una compra mínima de $2,000 MXN",
      });
    }
    return NextResponse.json({
      valido: true,
      codigo: cupon.codigo,
      descuento: cupon.descuento,
    });
  } catch (e) {
    console.error("[POST /api/cupones/validar]", e);
    return NextResponse.json(
      { valido: false, descuento: 0, error: "Error" },
      { status: 500 }
    );
  }
}
