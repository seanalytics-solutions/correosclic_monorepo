'use client'
import { Plantilla } from '../../components/plantilla'
import { BtnLink } from '../../components/primitivos'
import React, { useState } from 'react'
import TableDemo from './Componentes/tableroProductos'
import { Separator } from '@/components/ui/separator'
import { useProducts } from '@/hooks/useProduct'
import { Filtros } from '../../components/filtros'
import { ProductosProps } from '@/types' // ← CAMBIO: nuevo import

export default function Productos() {
    // ← CAMBIO: destructurar más propiedades del hook para manejar estados
    const { 
        products, 
        loading, 
        error, 
        isHydrated 
    } = useProducts()
    
    const [filteredProducts, setFilteredProducts] = useState<ProductosProps[]>([])
    
        React.useEffect(() => {
            const mappedProducts: ProductosProps[] = products.map(product => ({
                Color: product.Color,
                ProductCupons: product.ProductCupons,
                // variants: product.variants,
                ProductID: product.ProductID,
                productPrice: product.productPrice,
                ProductName: product.ProductName,
                ProductDescription: product.ProductDescription,
                ProductSlug: product.ProductSlug,
                ProductBrand: product.ProductBrand,
                ProductStatus: product.ProductStatus,
                ProductStock: product.ProductStock,
                productStockQuantity: product.productStockQuantity ?? product.ProductStock ?? 0,
                ProductColors: product.ProductColors ?? (product.Color ? [product.Color] : []),
                ProductWeight: product.ProductWeight ?? null,
                ProductDimensions: product.ProductDimensions ?? null,
                isActive: product.isActive ?? true,
                ProductCategory: (['Electrónica', 'Ropa', 'Hogar'].includes(product.ProductCategory as any)
                    ? product.ProductCategory
                    : 'Electrónica') as 'Electrónica' | 'Ropa' | 'Hogar',
                ProductSellerName: product.ProductSellerName,
                ProductSold: product.ProductSold,
                ProductImageUrl: product.ProductImageUrl,
            }))
            setFilteredProducts(mappedProducts)
        }, [products])

    const handleFilteredProducts = (filtered: ProductosProps[]) => {
        setFilteredProducts(filtered)
    }


    if (!isHydrated || (loading && products.length === 0)) {
        return (
            <Plantilla title='Productos'>
                <div className='-mt-8'>
                    <div className='flex place-content-end'>
                        <BtnLink link="Productos/Agregar">Crear producto</BtnLink>
                    </div>
                    <Separator className="my-2" />
                    <div className="text-center py-8">
                        <p className="text-gray-500">Cargando productos...</p>
                    </div>
                </div>
            </Plantilla>
        )
    }

    if (error) {
        return (
            <Plantilla title='Productos'>
                <div className='-mt-8'>
                    <div className='flex place-content-end'>
                        <BtnLink link="Productos/Agregar">Crear producto</BtnLink>
                    </div>
                    <Separator className="my-2" />
                    <div className="bg-red-50 border border-red-200 p-4 rounded mb-4">
                        <p className="text-red-700">Error: {error}</p>
                    </div>
                </div>
            </Plantilla>
        )
    }

    return (
        <Plantilla title='Productos'>
            <div className='-mt-8'>
                <div className='flex place-content-end'>
                    <BtnLink link="Productos/Agregar">Crear producto</BtnLink>
                </div>
                <Separator className="my-2" />
                <div>
                    <Filtros onFilteredProducts={handleFilteredProducts} />
                </div>
                <div className='mt-5'>
                    <TableDemo entradas={filteredProducts} />
                </div>
            </div>
        </Plantilla>
    )
}