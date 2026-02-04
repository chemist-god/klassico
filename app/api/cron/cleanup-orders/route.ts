/**
 * Automatic Order Cleanup Cron Job
 * 
 * This endpoint is called by Vercel Cron to clean up old abandoned orders.
 * It runs daily at 2 AM UTC.
 * 
 * Logic:
 * 1. Find orders that are:
 *    - Status: "Pending"
 *    - Created more than 24 hours ago
 *    - Payment expired OR no payment initiated
 * 2. Cancel these orders and release products
 * 3. Log statistics
 * 
 * Authentication: Requires CRON_SECRET header for security
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { orderLimits } from '@/lib/config/business';

// Verify the request is from Vercel Cron or authorized source
function verifyAuthorization(request: NextRequest): boolean {
  // Check for Vercel's cron authorization header
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  // If CRON_SECRET is set, verify it
  if (cronSecret) {
    return authHeader === `Bearer ${cronSecret}`;
  }

  // In development or if no secret set, allow the request
  // (You should always set CRON_SECRET in production)
  return process.env.NODE_ENV === 'development';
}

export async function GET(request: NextRequest) {
  // Verify authorization
  if (!verifyAuthorization(request)) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const cleanupAfterHours = orderLimits.autoCleanupAfterHours;
    const cutoffDate = new Date();
    cutoffDate.setHours(cutoffDate.getHours() - cleanupAfterHours);

    console.log('[Cron] Starting order cleanup...', {
      cutoffDate: cutoffDate.toISOString(),
      cleanupAfterHours,
    });

    // Find old pending orders
    const oldPendingOrders = await prisma.order.findMany({
      where: {
        status: 'Pending',
        createdAt: {
          lt: cutoffDate,
        },
        // Also include orders where payment has expired
        OR: [
          { paymentExpiresAt: { lt: new Date() } },
          { paymentTrackId: null },
        ],
      },
      include: {
        items: {
          select: { productId: true },
        },
        transaction: true,
      },
    });

    console.log(`[Cron] Found ${oldPendingOrders.length} orders to clean up`);

    if (oldPendingOrders.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No orders to clean up',
        stats: {
          ordersProcessed: 0,
          productsReleased: 0,
        },
      });
    }

    let ordersProcessed = 0;
    let productsReleased = 0;
    const errors: string[] = [];

    // Process each order
    for (const order of oldPendingOrders) {
      try {
        await prisma.$transaction(async (tx) => {
          // Update order status to Cancelled
          await tx.order.update({
            where: { id: order.id },
            data: { status: 'Cancelled' },
          });

          // Update transaction status
          if (order.transaction) {
            await tx.transaction.update({
              where: { id: order.transaction.id },
              data: {
                status: 'failed',
                metadata: JSON.stringify({
                  status: 'auto_cancelled',
                  reason: `Order older than ${cleanupAfterHours} hours without payment`,
                  cleanedUpAt: new Date().toISOString(),
                }),
              },
            });
          }

          // Release products
          const productIds = order.items.map((item) => item.productId);
          if (productIds.length > 0) {
            const updateResult = await tx.product.updateMany({
              where: {
                id: { in: productIds },
                status: 'Pending',
              },
              data: {
                status: 'Available',
              },
            });
            productsReleased += updateResult.count;
          }
        });

        ordersProcessed++;
        console.log(`[Cron] Cleaned up order ${order.id}`);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        errors.push(`Order ${order.id}: ${errorMessage}`);
        console.error(`[Cron] Error cleaning up order ${order.id}:`, error);
      }
    }

    // Create notifications for cancelled orders (optional - for user awareness)
    try {
      const userIds = [...new Set(oldPendingOrders.map(o => o.userId))];
      for (const userId of userIds) {
        const userOrders = oldPendingOrders.filter(o => o.userId === userId);
        if (userOrders.length > 0) {
          await prisma.notification.create({
            data: {
              userId,
              title: 'Orders Auto-Cancelled',
              message: `${userOrders.length} unpaid order(s) have been automatically cancelled after ${cleanupAfterHours} hours.`,
              type: 'info',
            },
          });
        }
      }
    } catch (notificationError) {
      console.error('[Cron] Error creating notifications:', notificationError);
      // Don't fail the whole job for notification errors
    }

    const stats = {
      ordersProcessed,
      productsReleased,
      errors: errors.length > 0 ? errors : undefined,
    };

    console.log('[Cron] Cleanup completed', stats);

    return NextResponse.json({
      success: true,
      message: `Cleaned up ${ordersProcessed} orders`,
      stats,
    });
  } catch (error) {
    console.error('[Cron] Fatal error during cleanup:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// Also support POST for manual triggering via curl
export async function POST(request: NextRequest) {
  return GET(request);
}
