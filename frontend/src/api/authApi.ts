const API_BASE = "http://localhost:8080/api/v1";

interface ApiResponse<T> {
  success: boolean;
  code: string;
  message: string;
  data: T;
}

export interface AuthData {
  userId: number;
  nickname: string;
  profileImage: string;
  accessToken: string;
  refreshToken: string;
  isNewUser: boolean;
}

export interface UserInfo {
  userId: number;
  nickname: string;
  profileImage: string;
}

export const socialLogin = async (
  provider: string,
  accessToken: string
): Promise<ApiResponse<AuthData>> => {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ provider, accessToken }),
  });
  return res.json();
};

export const emailLogin = async (
  email: string,
  password: string
): Promise<ApiResponse<AuthData>> => {
  const res = await fetch(`${API_BASE}/auth/email-login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
};

export const signup = async (data: {
  name: string;
  email: string;
  password: string;
  agreeTerms: boolean;
  agreePrivacy: boolean;
  agreeAiData: boolean;
}): Promise<ApiResponse<AuthData>> => {
  const res = await fetch(`${API_BASE}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const getMe = async (
  token: string
): Promise<ApiResponse<UserInfo>> => {
  const res = await fetch(`${API_BASE}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
};

export const logout = async (token: string): Promise<ApiResponse<null>> => {
  const res = await fetch(`${API_BASE}/auth/logout`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
};
