import React from 'react';
import ProductList from '../components/product/ProductList';

const Products = () => {
    return (
        <div className="products-page">
            <div className="page-header">
                <h1>Danh sách sản phẩm</h1>
                <p>Khám phá các sản phẩm chất lượng cao với giá cả hợp lý</p>
            </div>
            
            <ProductList showFilters={true} />
        </div>
    );
};

export default Products;

