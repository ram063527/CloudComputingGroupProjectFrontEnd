import { api } from './axios';

export interface CartItemResponseDTO {
  id: number;
  productCode: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  subTotal: number;
}

export interface CartResponseDTO {
  id: number;
  userId: string;
  status: 'ACTIVE' | 'CHECKED_OUT' | 'ABANDONED';
  items: CartItemResponseDTO[];
  totalPrice: number;
  totalItems: number;
}

export const cartApi = {
  getCart: async () => {
    const response = await api.get<CartResponseDTO>('/cart');
    return response.data;
  },
  addItemToCart: async (productCode: string, quantity: number) => {
    const response = await api.post<CartResponseDTO>('/cart/items', {
      productCode,
      quantity,
    });
    return response.data;
  },
  updateCartItemQuantity: async (itemId: number, quantity: number) => {
    const response = await api.put<CartResponseDTO>(`/cart/items/${itemId}`, {
      quantity,
    });
    return response.data;
  },
  deleteCartItem: async (itemId: number) => {
    await api.delete(`/cart/items/${itemId}`);
  },
  clearCart: async () => {
    await api.delete('/cart');
  },
};
