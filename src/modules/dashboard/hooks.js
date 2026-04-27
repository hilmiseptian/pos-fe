import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/modules/auth/context";
import { dashboardService } from "./service";

export const DASHBOARD_KEYS = {
    summary: ["dashboard", "summary"],
};

export function useDashboardSummary() {
    const { token } = useAuth();

    return useQuery({
        queryKey: DASHBOARD_KEYS.summary,
        queryFn:  () => dashboardService.getSummary(token),
        staleTime: 2 * 60 * 1000,
        enabled:  !!token,
    });
}