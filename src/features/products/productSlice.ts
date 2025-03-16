import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store';

interface Product {
  _id: string;
  name: string;
  description?: string;
  type: 'product' | 'service';
  sku?: string;
  price: {
    amount: number;
    currency: string;
  };
  unit: string;
  taxRate: number;
  inventory: {
    quantity: number;
    lowStockAlert: number;
  };
  category?: string;
  tags?: string[];
  images: Array<{
    url: string;
    alt: string;
  }>;
  status: 'active' | 'inactive' | 'discontinued';
  customFields?: Array<{
    key: string;
    value: string;
  }>;
}

interface ProductsState {
  products: Product[];
  currentProduct: Product | null;
  isLoading: boolean;
  error: string | null;
  filters: {
    search?: string;
    type?: string;
    category?: string;
    status?: string;
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

const initialState: ProductsState = {
  products: [],
  currentProduct: null,
  isLoading: false,
  error: null,
  filters: {},
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
  },
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.products = action.payload;
    },
    setCurrentProduct: (state, action: PayloadAction<Product | null>) => {
      state.currentProduct = action.payload;
    },
    addProduct: (state, action: PayloadAction<Product>) => {
      state.products.unshift(action.payload);
    },
    updateProduct: (state, action: PayloadAction<Product>) => {
      const index = state.products.findIndex(
        (product) => product._id === action.payload._id
      );
      if (index !== -1) {
        state.products[index] = action.payload;
      }
      if (state.currentProduct?._id === action.payload._id) {
        state.currentProduct = action.payload;
      }
    },
    deleteProduct: (state, action: PayloadAction<string>) => {
      state.products = state.products.filter(
        (product) => product._id !== action.payload
      );
      if (state.currentProduct?._id === action.payload) {
        state.currentProduct = null;
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setFilters: (
      state,
      action: PayloadAction<{
        search?: string;
        type?: string;
        category?: string;
        status?: string;
      }>
    ) => {
      state.filters = action.payload;
    },
    setPagination: (
      state,
      action: PayloadAction<{
        page: number;
        limit: number;
        total: number;
      }>
    ) => {
      state.pagination = action.payload;
    },
    addProductImage: (
      state,
      action: PayloadAction<{
        productId: string;
        image: { url: string; alt: string };
      }>
    ) => {
      const product = state.products.find(
        (p) => p._id === action.payload.productId
      );
      if (product) {
        product.images.push(action.payload.image);
      }
      if (state.currentProduct?._id === action.payload.productId) {
        state.currentProduct.images.push(action.payload.image);
      }
    },
    removeProductImage: (
      state,
      action: PayloadAction<{
        productId: string;
        imageUrl: string;
      }>
    ) => {
      const product = state.products.find(
        (p) => p._id === action.payload.productId
      );
      if (product) {
        product.images = product.images.filter(
          (img) => img.url !== action.payload.imageUrl
        );
      }
      if (state.currentProduct?._id === action.payload.productId) {
        state.currentProduct.images = state.currentProduct.images.filter(
          (img) => img.url !== action.payload.imageUrl
        );
      }
    },
  },
});

export const {
  setProducts,
  setCurrentProduct,
  addProduct,
  updateProduct,
  deleteProduct,
  setLoading,
  setError,
  setFilters,
  setPagination,
  addProductImage,
  removeProductImage,
} = productSlice.actions;

export const selectProducts = (state: RootState) => state.products.products;
export const selectCurrentProduct = (state: RootState) =>
  state.products.currentProduct;
export const selectProductsLoading = (state: RootState) =>
  state.products.isLoading;
export const selectProductsError = (state: RootState) => state.products.error;
export const selectProductsFilters = (state: RootState) =>
  state.products.filters;
export const selectProductsPagination = (state: RootState) =>
  state.products.pagination;

export default productSlice.reducer; 