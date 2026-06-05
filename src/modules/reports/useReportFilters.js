import { useState } from "react";

export function useReportFilters() {
  const today = new Date().toISOString().split("T")[0];

  const initial = {
    date_from: today,
    date_to: today,
    branch_id: "",
    cashier_id: "",
    status: "",
  };

  const [filters, setFilters] = useState(initial);
  const [committed, setCommitted] = useState(null);

  function set(field, value) {
    setFilters((prev) => ({ ...prev, [field]: value }));
  }

  function apply() {
    const active = Object.fromEntries(
      Object.entries(filters).filter(([, v]) => v !== "")
    );
    setCommitted(active);
  }

  return { filters, committed, set, apply };
}