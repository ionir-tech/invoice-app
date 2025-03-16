import api from './api';

interface ProductPrice {
  amount: number;
  currency: string;
}

interface ProductInventory {
  quantity: number;
  lowStockAlert: number;
}

interface CreateProductData {
  name: string;
  description?: string;
  type: 'product' | 'service';
  sku?: string;
  price: ProductPrice;
  unit: string;
  taxRate: number;
  inventory: ProductInventory;
  category?: string;
  tags?: string[];
  status: 'active' | 'inactive' | 'discontinued';
  customFields?: Array<{
    key: string;
    value: string;
  }>;
}

interface UpdateProductData extends Partial<CreateProductData> {
  id: string;
}

interface ProductFilters {
  search?: string;
  type?: 'product' | 'service';
  category?: string;
  status?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
}

interface PaginationOptions {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export const productService = {
  async createProduct(data: CreateProductData) {
    const response = await api.post('/products', data);
    return response.data;
  },

  async getProducts(filters: ProductFilters, pagination: PaginationOptions) {
    const params = {
      ...(filters.search && { search: filters.search }),
      ...(filters.type && { type: filters.type }),
      ...(filters.category && { category: filters.category }),
      ...(filters.status && { status: filters.status }),
      ...(filters.minPrice && { minPrice: filters.minPrice.toString() }),
      ...(filters.maxPrice && { maxPrice: filters.maxPrice.toString() }),
      ...(filters.inStock !== undefined && { inStock: filters.inStock.toString() }),
      page: pagination.page.toString(),
      limit: pagination.limit.toString(),
      ...(pagination.sortBy && { sortBy: pagination.sortBy }),
      ...(pagination.sortOrder && { sortOrder: pagination.sortOrder }),
    };
    const queryString = new URLSearchParams(params).toString();
    const response = await api.get(`/products?${queryString}`);
    return response.data;
  },

  async getProductById(id: string) {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  async updateProduct(data: UpdateProductData) {
    const response = await api.put(`/products/${data.id}`, data);
    return response.data;
  },

  async deleteProduct(id: string) {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },

  async uploadProductImage(id: string, file: File) {
    const formData = new FormData();
    formData.append('image', file);
    const response = await api.post(`/products/${id}/images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async deleteProductImage(productId: string, imageUrl: string) {
    const response = await api.delete(
      `/products/${productId}/images`,
      { data: { imageUrl } }
    );
    return response.data;
  },

  async updateInventory(id: string, quantity: number) {
    const response = await api.put(`/products/${id}/inventory`, { quantity });
    return response.data;
  },

  async getProductStatistics(filters?: {
    startDate?: Date;
    endDate?: Date;
    category?: string;
  }) {
    const params = {
      ...(filters?.startDate && { startDate: filters.startDate.toISOString() }),
      ...(filters?.endDate && { endDate: filters.endDate.toISOString() }),
      ...(filters?.category && { category: filters.category }),
    };
    const queryString = new URLSearchParams(params).toString();
    const response = await api.get(`/products/statistics?${queryString}`);
    return response.data;
  },

  async importProducts(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/products/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async exportProducts(filters: ProductFilters) {
    const params = {
      ...(filters.search && { search: filters.search }),
      ...(filters.type && { type: filters.type }),
      ...(filters.category && { category: filters.category }),
      ...(filters.status && { status: filters.status }),
      ...(filters.minPrice && { minPrice: filters.minPrice.toString() }),
      ...(filters.maxPrice && { maxPrice: filters.maxPrice.toString() }),
      ...(filters.inStock !== undefined && { inStock: filters.inStock.toString() }),
    };
    const queryString = new URLSearchParams(params).toString();
    const response = await api.get(`/products/export?${queryString}`, {
      responseType: 'blob',
    });
    return response.data;
  },
}; 