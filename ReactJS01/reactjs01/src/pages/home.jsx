import { CrownOutlined } from "@ant-design/icons";
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import Fuse from 'fuse.js';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const pageRef = useRef(1);
  const loadingRef = useRef(false);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [allProducts, setAllProducts] = useState([]);

  // filters/search
  const [query, setQuery] = useState("");
  const [typing, setTyping] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [onlyPromo, setOnlyPromo] = useState(false);
  const [useClientSideFilter, setUseClientSideFilter] = useState(false);

  const LIMIT = 5;
  const MIN_REQUEST_INTERVAL = 250;

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  // Cấu hình fuzzy search
  const fuseOptions = {
    keys: ['name', 'description', 'category.name'],
    threshold: 0.4,
    includeScore: true,
    minMatchCharLength: 2
  };

  // Fetch sản phẩm từ API
  const fetchProducts = async (pageToFetch = pageRef.current, isFilterChange = false) => {
    if (loadingRef.current) return;

    loadingRef.current = true;
    setLoading(true);

    try {
      // Nếu có query dài và đang filter, sử dụng client-side filtering
      const shouldUseClientFilter = query.length >= 3 && (selectedCategory || priceMin || priceMax || onlyPromo);
      
      let params = {
        page: shouldUseClientFilter ? 1 : pageToFetch,
        limit: shouldUseClientFilter ? 1000 : LIMIT,
      };

      // Chỉ thêm các tham số filter nếu không sử dụng client-side filtering
      if (!shouldUseClientFilter) {
        if (query) params.q = query;
        if (selectedCategory) params.category = selectedCategory;
        if (priceMin !== "") params.minPrice = priceMin;
        if (priceMax !== "") params.maxPrice = priceMax;
        if (onlyPromo) params.onSale = true;
      } else {
        // Nếu sử dụng client-side filtering, chỉ tìm kiếm theo text
        if (query) params.q = query;
      }

      const res = await axios.get("http://localhost:8080/products", { params });
      let newProducts = res.data?.DT?.products || [];
      const total = res.data?.DT?.total ?? 0;

      // Áp dụng client-side filtering nếu cần
      if (shouldUseClientFilter) {
        let filtered = newProducts;
        
        // Lọc theo danh mục
        if (selectedCategory) {
          filtered = filtered.filter(product => 
            product.category && product.category.slug === selectedCategory
          );
        }

        // Lọc theo giá
        if (priceMin !== "") {
          const min = Number(priceMin);
          filtered = filtered.filter(product => product.price >= min);
        }
        
        if (priceMax !== "") {
          const max = Number(priceMax);
          filtered = filtered.filter(product => product.price <= max);
        }

        // Lọc khuyến mãi
        if (onlyPromo) {
          filtered = filtered.filter(product => product.onSale);
        }

        // Áp dụng fuzzy search
        if (query.length >= 2) {
          const fuse = new Fuse(filtered, fuseOptions);
          const fuseResults = fuse.search(query);
          filtered = fuseResults.map(result => result.item);
        }

        newProducts = filtered;
        setAllProducts(newProducts); // Lưu toàn bộ sản phẩm đã lọc
        setProducts(isFilterChange ? newProducts.slice(0, LIMIT) : [...products, ...newProducts.slice((pageToFetch - 1) * LIMIT, pageToFetch * LIMIT)]);
        setHasMore(newProducts.length > pageToFetch * LIMIT);
      } else {
        // Server-side filtering
        setProducts(prev => isFilterChange ? newProducts : [...prev, ...newProducts]);
        const loadedCount = (pageToFetch - 1) * LIMIT + newProducts.length;
        setHasMore(loadedCount < total);
      }

      pageRef.current = pageToFetch + 1;
      setPage(pageToFetch + 1);
      setUseClientSideFilter(shouldUseClientFilter);

    } catch (err) {
      console.error("FetchProducts lỗi:", err);
      setHasMore(false);
    } finally {
      await sleep(MIN_REQUEST_INTERVAL);
      loadingRef.current = false;
      setLoading(false);
    }
  };

  // Load thêm sản phẩm (cho client-side filtering)
  const loadMoreClientSide = () => {
    if (loadingRef.current || !hasMore) return;
    
    const nextPage = page;
    const newProducts = allProducts.slice(nextPage * LIMIT, (nextPage + 1) * LIMIT);
    
    setProducts(prev => [...prev, ...newProducts]);
    setPage(nextPage + 1);
    setHasMore(allProducts.length > (nextPage + 1) * LIMIT);
  };

  // handler scroll
  const onScrollHandler = () => {
    if (loadingRef.current || !hasMore) return;

    const scrollPos = window.innerHeight + window.scrollY;
    const threshold = document.documentElement.scrollHeight - 240;

    if (scrollPos >= threshold) {
      if (useClientSideFilter) {
        loadMoreClientSide();
      } else {
        fetchProducts(pageRef.current);
      }
    }
  };

  // Khi filters/search thay đổi
  useEffect(() => {
    fetchProducts(1, true);
  }, [selectedCategory, priceMin, priceMax, onlyPromo]);

  // scroll listener
  useEffect(() => {
    window.addEventListener("scroll", onScrollHandler, { passive: true });
    window.addEventListener("resize", onScrollHandler);
    return () => {
      window.removeEventListener("scroll", onScrollHandler);
      window.removeEventListener("resize", onScrollHandler);
    };
  }, [hasMore, useClientSideFilter]);

  // load categories
  useEffect(() => {
    const loadCats = async () => {
      try {
        const res = await axios.get("http://localhost:8080/categories");
        setCategories(res?.data?.DT || []);
      } catch (e) {
        console.error(e);
      }
    };
    loadCats();
  }, []);

  // debounce search
  useEffect(() => {
    setTyping(true);
    const t = setTimeout(() => {
      fetchProducts(1, true);
      setTyping(false);
    }, 400);
    return () => clearTimeout(t);
  }, [query]);

  // Hàm reset bộ lọc
  const handleResetFilters = () => {
    setQuery("");
    setSelectedCategory("");
    setPriceMin("");
    setPriceMax("");
    setOnlyPromo(false);
  };

  return (
    <div className="container" style={{ padding: 24 }}>
      <h1 className="section-title">
        <CrownOutlined /> Bộ sưu tập sản phẩm
      </h1>

      {/* Search & Filters */}
      <div style={{ maxWidth: 1000, margin: "0 auto 16px" }}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Tìm kiếm sản phẩm..."
          style={{
            width: "100%",
            padding: "12px 14px",
            borderRadius: 12,
            border: "1px solid rgba(255,255,255,0.12)",
            background: "rgba(255,255,255,0.06)",
            color: "#e8eaed",
            outline: "none",
          }}
        />
        {typing && <div style={{ marginTop: 6, fontSize: 12, color: '#aaa' }}>Đang tìm kiếm…</div>}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 12, marginTop: 12 }}>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{ padding: '10px', borderRadius: 10, background: 'rgba(255,255,255,0.06)', color: '#e8eaed', border: '1px solid rgba(255,255,255,0.12)' }}
          >
            <option value="">Tất cả danh mục</option>
            {categories.map(c => (
              <option key={c._id} value={c.slug}>{c.name}</option>
            ))}
          </select>
          <input 
            type="number" 
            inputMode="numeric" 
            placeholder="Giá từ" 
            value={priceMin}
            onChange={(e) => setPriceMin(e.target.value)}
            style={{ padding: '10px', borderRadius: 10, background: 'rgba(255,255,255,0.06)', color: '#e8eaed', border: '1px solid rgba(255,255,255,0.12)' }}
          />
          <input 
            type="number" 
            inputMode="numeric" 
            placeholder="Đến" 
            value={priceMax}
            onChange={(e) => setPriceMax(e.target.value)}
            style={{ padding: '10px', borderRadius: 10, background: 'rgba(255,255,255,0.06)', color: '#e8eaed', border: '1px solid rgba(255,255,255,0.12)' }}
          />
          <label style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#e8eaed' }}>
            <input 
              type="checkbox" 
              checked={onlyPromo} 
              onChange={(e) => setOnlyPromo(e.target.checked)} 
            />
            Chỉ hiển thị khuyến mãi
          </label>
        </div>
        
        {/* Nút reset bộ lọc */}
        <div style={{ marginTop: 12, textAlign: 'right' }}>
          <button 
            onClick={handleResetFilters}
            style={{
              padding: '8px 16px',
              borderRadius: 8,
              border: '1px solid rgba(255,255,255,0.2)',
              background: 'rgba(255,255,255,0.1)',
              color: '#e8eaed',
              cursor: 'pointer'
            }}
          >
            Reset bộ lọc
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid" style={{ marginTop: 18 }}>
        {products.map((p) => (
          <ProductCard key={p._id} product={p} />
        ))}
      </div>

      {loading && <div style={{ textAlign: "center", marginTop: 12 }}>Đang tải…</div>}
      {!hasMore && products.length > 0 && <div style={{ textAlign: "center", marginTop: 12 }}>Bạn đã xem hết sản phẩm</div>}
      {!loading && products.length === 0 && <div style={{ textAlign: "center", marginTop: 24, color: '#aaa' }}>Không tìm thấy sản phẩm nào phù hợp</div>}
    </div>
  );
};

export default HomePage;