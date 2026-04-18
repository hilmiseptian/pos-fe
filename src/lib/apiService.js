/**
 * Every backend response follows:
 *   { data: [...], meta: {...} }   — paginated list
 *   { data: [...] }               — non-paginated list
 *   { data: {...} }               — single resource
 *   { data: {...}, message: "" }  — mutation
 *   { message: "" }               — deletion
 *
 * axios wraps this in response.data, so the envelope
 * lives at response.data and actual payload at response.data.data
 */

export function extractData(response) {
  return response.data.data;
}

export function extractList(response) {
  return response.data.data ?? [];
}

export function extractMeta(response) {
  return response.data.meta ?? null;
}

export function extractPaginated(response) {
  return {
    data: extractList(response),
    meta: extractMeta(response),
  };
}

export function extractMessage(response) {
  return response.data.message ?? '';
}