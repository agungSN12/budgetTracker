import api from "@/api";
import { handleApiError } from "@/utils/handleApiError";
import getTokenHeader from "@/utils/getTokenHeader";

export const fetchAllCategories = async () => {
  try {
    const res = await api.get("/category", { headers: getTokenHeader() });
    return res.data;
  } catch (error) {
    handleApiError(error, "fetch Category Failed");
  }
};

export const fetchCategoriesById = async (id: number) => {
  try {
    const res = await api.get(`/category/${id}`, { headers: getTokenHeader() });
    return res.data;
  } catch (error) {
    handleApiError(error, "fetch Category Failed");
  }
};

export const CreateCategories = async (data: {
  name: string;
  description?: string;
}) => {
  try {
    const res = await api.post(`/category`, data, {
      headers: getTokenHeader(),
    });
    return res.data;
  } catch (error) {
    handleApiError(error, "create Category Failed");
  }
};

export const UpdateCategories = async (
  id: number,
  data: {
    name: string;
    description?: string;
  }
) => {
  try {
    const res = await api.put(`/category/${id}`, data, {
      headers: getTokenHeader(),
    });
    return res.data;
  } catch (error) {
    handleApiError(error, "update Category Failed");
  }
};

export const deleteCategories = async (id: number) => {
  try {
    const res = await api.delete(`/category/${id}`, {
      headers: getTokenHeader(),
    });
    return res.data;
  } catch (error) {
    handleApiError(error, "fetch Category Failed");
  }
};
