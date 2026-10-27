"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface CartItem {
  productoId: string;
  nombre: string;
  precio: number; // current effective price (precioOferta || precio)
  cantidad: number;
  imagen: string;
  categoria?: string;
}

interface CartState {
  items: CartItem[];
  cupon: { codigo: string; descuento: number } | null;
  add: (item: Omit<CartItem, "cantidad">, cantidad?: number) => void;
  remove: (productoId: string) => void;
  updateQty: (productoId: string, cantidad: number) => void;
  clear: () => void;
  setCupon: (cupon: { codigo: string; descuento: number } | null) => void;
  subtotal: () => number;
  count: () => number;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      cupon: null,
      add: (item, cantidad = 1) =>
        set((state) => {
          const existing = state.items.find(
            (i) => i.productoId === item.productoId
          );
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productoId === item.productoId
                  ? { ...i, cantidad: i.cantidad + cantidad }
                  : i
              ),
            };
          }
          return { items: [...state.items, { ...item, cantidad }] };
        }),
      remove: (productoId) =>
        set((state) => ({
          items: state.items.filter((i) => i.productoId !== productoId),
        })),
      updateQty: (productoId, cantidad) =>
        set((state) => ({
          items:
            cantidad <= 0
              ? state.items.filter((i) => i.productoId !== productoId)
              : state.items.map((i) =>
                  i.productoId === productoId ? { ...i, cantidad } : i
                ),
        })),
      clear: () => set({ items: [], cupon: null }),
      setCupon: (cupon) => set({ cupon }),
      subtotal: () =>
        get().items.reduce((acc, i) => acc + i.precio * i.cantidad, 0),
      count: () => get().items.reduce((acc, i) => acc + i.cantidad, 0),
    }),
    {
      name: "casa-bella-cart",
      storage: createJSONStorage(() => localStorage),
      skipHydration: false,
    }
  )
);

export const ENVIO_UMBRAL = 1500;
export const ENVIO_COSTO = 99;

export function calcularTotales(subtotal: number, descuentoPct: number) {
  const descuentoMonto = (subtotal * descuentoPct) / 100;
  const conDescuento = subtotal - descuentoMonto;
  const envio = conDescuento >= ENVIO_UMBRAL || conDescuento === 0 ? 0 : ENVIO_COSTO;
  const total = conDescuento + envio;
  return { descuentoMonto, conDescuento, envio, total };
}
