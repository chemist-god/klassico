"use server";

import { prisma } from "@/lib/db/prisma";

export async function getProducts() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: products };
  } catch (error) {
    console.error("Error fetching products:", error);
    return { success: false, error: "Failed to fetch products" };
  }
}

export async function getProduct(id: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
    });
    if (!product) {
      return { success: false, error: "Product not found" };
    }
    return { success: true, data: product };
  } catch (error) {
    console.error("Error fetching product:", error);
    return { success: false, error: "Failed to fetch product" };
  }
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
  try {
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
    return { success: true, data: product };
  } catch (error) {
    console.error("Error creating product:", error);
    return { success: false, error: "Failed to create product" };
  }
}

