import { getDashboardStats, getBankLogs } from "@/lib/actions/dashboard";
import { apiHandler } from "@/lib/utils/api-handler";
import { withErrorHandling } from "@/lib/utils/result";

export const GET = apiHandler(async () => {
  return await withErrorHandling(async () => {
    const [statsResult, bankLogsResult] = await Promise.all([
      getDashboardStats(),
      getBankLogs(),
    ]);

    if (!statsResult.success) {
      throw new Error(statsResult.error || "Failed to fetch dashboard stats");
    }

    if (!bankLogsResult.success) {
      throw new Error(bankLogsResult.error || "Failed to fetch bank logs");
    }

    return {
      stats: statsResult.data,
      bankLogs: bankLogsResult.data,
    };
  }, "Failed to fetch dashboard data");
});
