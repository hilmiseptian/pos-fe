import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/modules/auth/context";
import { reportService } from "./service";

export const REPORT_KEYS = {
    salesSummary: (f) => ["reports", "sales-summary", f],
    salesByItem: (f) => ["reports", "sales-by-item", f],
    paymentBreakdown: (f) => ["reports", "payment-breakdown", f],
    salesByBranch: (f) => ["reports", "sales-by-branch", f],
};

function useReportQuery(key, fetcher, filters) {
    const { token } = useAuth();
    const enabled = !!token && !!filters?.date_from && !!filters?.date_to;

    return useQuery({
        queryKey: key(filters),
        queryFn: () => fetcher(token, filters),
        enabled,
        staleTime: 5 * 60 * 1000,
    });
}

export function useSalesSummary(filters) {
    return useReportQuery(
        REPORT_KEYS.salesSummary,
        reportService.getSalesSummary.bind(reportService),
        filters
    );
}

export function useSalesByItem(filters) {
    return useReportQuery(
        REPORT_KEYS.salesByItem,
        reportService.getSalesByItem.bind(reportService),
        filters
    );
}

export function usePaymentBreakdown(filters) {
    return useReportQuery(
        REPORT_KEYS.paymentBreakdown,
        reportService.getPaymentBreakdown.bind(reportService),
        filters
    );
}

export function useSalesByBranch(filters) {
    return useReportQuery(
        REPORT_KEYS.salesByBranch,
        reportService.getSalesByBranch.bind(reportService),
        filters
    );
}