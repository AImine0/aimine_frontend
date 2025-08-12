// src/types/api.ts
export interface AiService {
  id: number;
  name: string;
  description: string;
  serviceUrl: string;
  category: string;
  mainFunction: string;
  feature1?: string;
  feature2?: string;
  link: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiStats {
  totalServices: number;
  totalCategories: number;
}