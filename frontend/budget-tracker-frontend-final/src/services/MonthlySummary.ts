import api from "@/api";
import { handleApiError } from "@/utils/handleApiError";
import getTokenHeader from "@/utils/getTokenHeader";

export const FetchMontlySummary = async () => {
  try {
    const res = await api.get("/summary", { headers: getTokenHeader() });
    return res.data;
  } catch (err) {
    handleApiError(err, "fetch monthly summary failed");
  }
};

export const FetchMontlySummaryById = async (id: number) => {
  try {
    const res = await api.get(`/summary/${id}`, { headers: getTokenHeader() });
    return res.data;
  } catch (err) {
    handleApiError(err, "fetch monthly summary failed");
  }
};

export const CreateMontlySummary = async (data: Record<string, unknown>) => {
  try {
    const res = await api.post(`/summary`, data, { headers: getTokenHeader() });
    return res.data;
  } catch (err) {
    handleApiError(err, "create monthly summary failed");
  }
};

export const UpdateMontlySummary = async (
  id: number,
  data: Record<string, unknown>
) => {
  try {
    const res = await api.put(`/summary/${id}`, data, {
      headers: getTokenHeader(),
    });
    return res.data;
  } catch (err) {
    handleApiError(err, "update monthly summary failed");
  }
};

export const deleteMonthlySummary = async (id: number) => {
  try {
    const res = await api.delete(`/summary/${id}`, {
      headers: getTokenHeader(),
    });
    return res.data;
  } catch (err) {
    handleApiError(err, "delete monthly summary failed");
  }
};

export const GenerateMonthlySummary = async () => {
  try {
    const res = await api.post(
      `/summary/generate`,
      {},
      {
        headers: getTokenHeader(),
      }
    );
    return res.data;
  } catch (err) {
    handleApiError(err, "generate monthly summary failed");
  }
};
