import { api, authHeaders } from "@/shared/lib/axios";

export const subCategoryLists = async (token, { page = 1 } = {}) => {
  return await api.get(`/subcategories`, {
    headers: authHeaders(token),
    params: { page },
  });
};

export const subCategoryDetail = async (token, { id }) => {
  return await api.get(`/subcategories/${id}`, {
    headers: authHeaders(token),
  });
};

export const subCategoryCreate = async (token, payload) => {
  return await api.post(
    `/subcategories`,
    payload,
    {
      headers: authHeaders(token),
    }
  );
};

export const subCategoryUpdate = async (token, id, formData) => {
  return await api.put(
    `/subcategories/${id}`,
    formData,
    {
      headers: authHeaders(token),
    }
  );
};

export const subCategoryDelete = async (token, { id }) => {
  return await api.delete(`/subcategories/${id}`, {
    headers: authHeaders(token),
  });
};
