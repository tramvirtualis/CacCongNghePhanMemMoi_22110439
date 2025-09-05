import React, { useState, useEffect, useCallback } from 'react';
import ProductCard from './ProductCard';
import LoadingSpinner from '../common/LoadingSpinner';
import './ProductList.css';

const ProductList = ({ 
    category = null, 
    searchTerm = null, 
    showFilters = true,
    itemsPerPage = 12 
}) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [error, setError] = useState(null);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(category || 'all');
    const [search, setSearch] = useState(searchTerm || '');

    // Fetch products
    const fetchProducts = useCallback(async (page = 1, reset = false) => {
        try {
            if (page === 1) {
                setLoading(true);
            } else {
                setLoadingMore(true);
            }
            setError(null);

            const params = new URLSearchParams({
                page: page.toString(),
                limit: itemsPerPage.toString()
            });

            if (selectedCategory && selectedCategory !== 'all') {
                params.append('category', selectedCategory);
            }

            if (search) {
                params.append('search', search);
            }

            const response = await fetch(`http://localhost:8080/v1/api/products?${params}`);
            const data = await response.json();

            if (data.EC === 0) {
                const newProducts = data.DT.products;
                
                if (reset) {
                    setProducts(newProducts);
                } else {
                    setProducts(prev => [...prev, ...newProducts]);
                }
                
                setHasMore(data.DT.pagination.hasNextPage);
                setCurrentPage(page);
            } else {
                setError(data.EM);
            }
        } catch (err) {
            setError('Lỗi khi tải sản phẩm');
            console.error('Error fetching products:', err);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, [selectedCategory, search, itemsPerPage]);

    // Fetch categories
    const fetchCategories = async () => {
        try {
            const response = await fetch('http://localhost:8080/v1/api/products/categories');
            const data = await response.json();
            
            if (data.EC === 0) {
                setCategories(data.DT);
            }
        } catch (err) {
            console.error('Error fetching categories:', err);
        }
    };

    // Load more products
    const loadMore = () => {
        if (!loadingMore && hasMore) {
            fetchProducts(currentPage + 1, false);
        }
    };

    // Handle category change
    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
        setCurrentPage(1);
        setProducts([]);
        fetchProducts(1, true);
    };

    // Handle search
    const handleSearch = (searchTerm) => {
        setSearch(searchTerm);
        setCurrentPage(1);
        setProducts([]);
        fetchProducts(1, true);
    };

    // Infinite scroll
    useEffect(() => {
        const handleScroll = () => {
            if (
                window.innerHeight + document.documentElement.scrollTop >=
                document.documentElement.offsetHeight - 1000
            ) {
                loadMore();
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [loadingMore, hasMore, currentPage]);

    // Initial load
    useEffect(() => {
        fetchProducts(1, true);
        fetchCategories();
    }, []);

    // Reset when category or search changes
    useEffect(() => {
        if (category !== selectedCategory || searchTerm !== search) {
            setSelectedCategory(category || 'all');
            setSearch(searchTerm || '');
            setCurrentPage(1);
            setProducts([]);
            fetchProducts(1, true);
        }
    }, [category, searchTerm]);

    if (loading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return (
            <div className="error-container">
                <h3>Lỗi khi tải sản phẩm</h3>
                <p>{error}</p>
                <button onClick={() => fetchProducts(1, true)} className="retry-btn">
                    Thử lại
                </button>
            </div>
        );
    }

    return (
        <div className="product-list-container">
            {showFilters && (
                <div className="product-filters">
                    <div className="search-bar">
                        <input
                            type="text"
                            placeholder="Tìm kiếm sản phẩm..."
                            value={search}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="search-input"
                        />
                    </div>
                    
                    <div className="category-filters">
                        <button
                            className={`category-btn ${selectedCategory === 'all' ? 'active' : ''}`}
                            onClick={() => handleCategoryChange('all')}
                        >
                            Tất cả
                        </button>
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                className={`category-btn ${selectedCategory === cat ? 'active' : ''}`}
                                onClick={() => handleCategoryChange(cat)}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <div className="product-grid">
                {products.length > 0 ? (
                    products.map((product) => (
                        <ProductCard key={product._id} product={product} />
                    ))
                ) : (
                    <div className="no-products">
                        <h3>Không tìm thấy sản phẩm nào</h3>
                        <p>Hãy thử tìm kiếm với từ khóa khác hoặc chọn danh mục khác</p>
                    </div>
                )}
            </div>

            {loadingMore && (
                <div className="loading-more">
                    <LoadingSpinner />
                    <p>Đang tải thêm sản phẩm...</p>
                </div>
            )}

            {!hasMore && products.length > 0 && (
                <div className="no-more-products">
                    <p>Đã hiển thị tất cả sản phẩm</p>
                </div>
            )}
        </div>
    );
};

export default ProductList;
