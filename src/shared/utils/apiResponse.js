export function extractList(res) {
  const payload = res?.data?.data;
  if (!payload) return [];
  if (Array.isArray(payload.data)) return payload.data;
  if (Array.isArray(payload)) return payload;
  return [];
}

export function extractMeta(res) {
  const payload = res?.data?.data;
  if (!payload || !Array.isArray(payload.data)) return null;
  return {
    currentPage: payload.current_page ?? 1,
    lastPage:    payload.last_page    ?? 1,
    total:       payload.total        ?? 0,
  };
}