import { api } from './axios';

export interface ProductShortResponseDTO {
  code: string;
  name: string;
  author: string;
  price: number;
  imageUrl: string;
  status: 'AVAILABLE' | 'OUT_OF_STOCK' | 'DISCONTINUED';
}

export interface PageResultProductShortResponseDTO {
  data: ProductShortResponseDTO[];
  totalElements: number;
  pageNumber: number;
  totalPages: number;
  isFirst: boolean;
  isLast: boolean;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface ProductDetailedResponseDTO extends ProductShortResponseDTO {
  isbn: string;
  description: string;
  genre: string;
  publisher: string;
  publicationYear: number;
  stockQuantity: number;
  available: boolean;
}

export const catalogApi = {
  getAllProducts: async (page: number = 1) => {
    const response = await api.get<PageResultProductShortResponseDTO>('/catalog', {
      params: { page },
    });
    return response.data;
  },
  searchProducts: async (params: {
    query?: string;
    genre?: string;
    author?: string;
    name?: string;
    isbn?: string;
    minPrice?: number;
    maxPrice?: number;
    page?: number;
  }) => {
    const response = await api.get<PageResultProductShortResponseDTO>('/catalog/search', {
      params,
    });
    return response.data;
  },
  getProductByCode: async (code: string) => {
    const response = await api.get<ProductDetailedResponseDTO>(`/catalog/${code}`);
    return response.data;
  },
};
