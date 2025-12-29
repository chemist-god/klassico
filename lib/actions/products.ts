"use server";

import { prisma } from "@/lib/db/prisma";
import { withErrorHandling } from "@/lib/utils/result";

export async function getProducts() {
  return withErrorHandling(async () => {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    });
    return products;
  }, "Failed to fetch products");
}

export async function getProduct(id: string) {
  return withErrorHandling(async () => {
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    return product;
  }, "Failed to fetch product");
}

export async function createProduct(data: {
  name: string;
  price: number;
  balance: number;
  status?: string;
  region: string;
  bank: string;
  type: string;
  description?: string;
}) {
  return withErrorHandling(async () => {
    const product = await prisma.product.create({
      data: {
        name: data.name,
        price: data.price,
        balance: data.balance,
        status: data.status || "Available",
        region: data.region,
        bank: data.bank,
        type: data.type,
        description: data.description,
      },
    });
    return product;
  }, "Failed to create product");
}
