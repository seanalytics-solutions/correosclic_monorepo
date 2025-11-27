'use client'
import { useProductsStore } from '../stores/useProductStore'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useHydration } from './useHydratyon'
import type { FrontendProduct } from '@/schemas/products'
import { productsApiService } from '@/services/productsApi'

export const useProducts = () => {
  const store = useProductsStore()
  const isHydrated = useHydration()
  const hasLoadedRef = useRef(false)

  const [products, setProducts] = useState<FrontendProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProductsByCategory = useCallback(async (category: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await productsApiService.getProductsByCategory(category);
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar productos');
      console.error('Error loading products by category:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ CORREGIDO: Evitar loop infinito
  useEffect(() => {
    // Solo cargar una vez al montar el componente
    if (!hasLoadedRef.current && store.products.length === 0 && !store.loading) {
      hasLoadedRef.current = true
      store.loadProducts()
    }
  }, []) // Sin dependencias - solo en mount

  const getProductsByCategory = useMemo(() => {
    return (category: string): FrontendProduct[] => {
      if (!category) return store.products
      
      return store.products.filter(product => 
        product.ProductCategory?.toLowerCase() === category.toLowerCase()
      )
    }
  }, [store.products])

  const getFeaturedProducts = useMemo(() => {
    return (limit?: number): FrontendProduct[] => {
      const featuredProducts = store.products.filter(product => 
        product.ProductStatus === true && product.ProductStock > 0
      )
      
      return limit ? featuredProducts.slice(0, limit) : featuredProducts
    }
  }, [store.products])

  const getAvailableCategories = useMemo(() => {
    return (): string[] => {
      const categories = store.products
        .map(product => product.ProductCategory)
        .filter((category, index, self) => 
          category && self.indexOf(category) === index
        )
      
      return categories as string[]
    }
  }, [store.products])

  const getProductCountByCategory = useMemo(() => {
    return (category: string): number => {
      return store.products.filter(product => 
        product.ProductCategory?.toLowerCase() === category.toLowerCase()
      ).length
    }
  }, [store.products])

  const searchProducts = useMemo(() => {
    return (query: string): FrontendProduct[] => {
      if (!query.trim()) return store.products
      
      const searchTerm = query.toLowerCase()
      return store.products.filter(product =>
        product.ProductName.toLowerCase().includes(searchTerm) ||
        product.ProductDescription.toLowerCase().includes(searchTerm) ||
        product.ProductCategory?.toLowerCase().includes(searchTerm)
      )
    }
  }, [store.products])

  const getProductsByPriceRange = useMemo(() => {
    return (minPrice: number, maxPrice: number): FrontendProduct[] => {
      return store.products.filter(product =>
        product.productPrice >= minPrice && product.productPrice <= maxPrice
      )
    }
  }, [store.products])

  const getAvailableProducts = useMemo(() => {
    return (): FrontendProduct[] => {
      return store.products.filter(product =>
        product.ProductStatus === true && product.ProductStock > 0
      )
    }
  }, [store.products])

  // ✅ Memoizar loadProducts para evitar re-renders
  const loadProducts = useCallback(() => {
    store.loadProducts()
  }, [store.loadProducts])

  return {
    // ===== STATE =====
    products: store.products,
    selectedProduct: store.selectedProduct,
    loading: store.loading,
    error: store.error,
    isHydrated,

    // ===== API ACTIONS =====
    loadProducts,
    loadProduct: store.loadProduct,
    addProduct: store.addProduct,
    updateProduct: store.updateProduct,
    deleteProduct: store.deleteProduct,

    // ===== LOCAL ACTIONS =====
    selectProduct: store.selectProduct,

    // ===== READ OPERATIONS (compatibilidad) =====
    getProducts: store.getProducts,
    getProduct: store.getProduct,
    hasSelectedProduct: store.hasSelectedProduct,

    // ===== FUNCIONES DE FILTRADO =====
    getProductsByCategory,
    loadProductsByCategory,
    getFeaturedProducts,
    getAvailableCategories,
    getProductCountByCategory,
    searchProducts,
    getProductsByPriceRange,
    getAvailableProducts,

    // ===== ERROR HANDLING =====
    clearError: store.clearError
  }
}

export const useFeaturedProducts = (limit: number = 8) => {
  const [featuredProducts, setFeaturedProducts] = useState<FrontendProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadFeaturedProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await productsApiService.getFeaturedProducts(limit);
        setFeaturedProducts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar productos destacados');
        console.error('Error loading featured products:', err);
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedProducts();
  }, [limit]);

  return { featuredProducts, loading, error };
};

export const useProductById = (id: string | number) => {
  const [product, setProduct] = useState<FrontendProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await productsApiService.getProductById(Number(id));
        setProduct(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar el producto');
        console.error('Error loading product:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) loadProduct();
  }, [id]);

  return { product, loading, error };
};