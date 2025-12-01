import api from "@/api";
import { LoginData } from "@/interfaces/IAuth";
import { RegisterData } from "@/interfaces/IAuth";
import { handleApiError } from "@/utils/handleApiError";

export const login = async (userDataLogin: LoginData) => {
  try {
    const response = await api.post("/auth/login", userDataLogin);
    return response.data;
  } catch (err) {
    handleApiError(err, "Login failed");
  }
};
export const register = async (userDataRegist: RegisterData) => {
  try {
    const response = await api.post("/auth/register", userDataRegist);
    return response.data;
  } catch (err) {
    handleApiError(err, "Register failed");
  }
};
export const profile = async (token: string) => {
  try {
    const response = await api.get("/auth/profile", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (err) {
    handleApiError(err, "get profile  failed");
  }
};

export const logout = () => {
  localStorage.removeItem("token");
};
