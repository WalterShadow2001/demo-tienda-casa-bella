"use client";

import { motion } from "framer-motion";
import { ProductCard, ProductCardSkeleton, type ProductCardProduct } from "@/components/site/product-card";

export function ProductsGrid({
  productos,
  loading,
}: {
  productos: ProductCardProduct[];
  loading?: boolean;
}) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }
  return (
    <motion.div
      layout
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {productos.map((p, i) => (
        <motion.div
          key={p.id}
          layout
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: i * 0.04 }}
        >
          <ProductCard product={p} />
        </motion.div>
      ))}
    </motion.div>
  );
}
