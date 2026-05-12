const API_BASE = "http://localhost:8080/api/v1";

interface ApiResponse<T> {
  success: boolean;
  code: string;
  message: string;
  data: T;
}

export interface MyPerfumeItem {
  myPerfumeId: number;
  perfumeName: string;
  summary: string;
  noteSummary: string;
  characterType: string;
  thumbnailColor: string;
  savedAt: string;
}

export interface MyPerfumeListResponse {
  items: MyPerfumeItem[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface CharacterStat {
  characterType: string;
  name: string;
  role: string;
  count: number;
}

export interface MyPageSummary {
  completedPerfumes: number;
  uniqueCharacters: number;
  chatCount: number;
  topCharacters: CharacterStat[];
  heatmap: Record<string, number>;
}

export const savePerfume = async (
  token: string,
  resultId: number,
  customName?: string
): Promise<ApiResponse<{ myPerfumeId: number; perfumeName: string; savedAt: string }>> => {
  const res = await fetch(`${API_BASE}/my-perfumes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ resultId, customName }),
  });
  return res.json();
};

export const getMyPerfumes = async (
  token: string,
  page = 0,
  size = 6
): Promise<ApiResponse<MyPerfumeListResponse>> => {
  const res = await fetch(`${API_BASE}/my-perfumes?page=${page}&size=${size}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
};

export const getMyPageSummary = async (
  token: string
): Promise<ApiResponse<MyPageSummary>> => {
  const res = await fetch(`${API_BASE}/my-perfumes/summary`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
};

export const updatePerfumeName = async (
  token: string,
  myPerfumeId: number,
  customName: string
): Promise<ApiResponse<null>> => {
  const res = await fetch(`${API_BASE}/my-perfumes/${myPerfumeId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ customName }),
  });
  return res.json();
};

export const deletePerfume = async (
  token: string,
  myPerfumeId: number
): Promise<ApiResponse<null>> => {
  const res = await fetch(`${API_BASE}/my-perfumes/${myPerfumeId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
};
