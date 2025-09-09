import { CrownOutlined } from "@ant-design/icons";
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import ProductCard from "../components/ProductCard";


const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [query, setQuery] = useState("");
  const [typing, setTyping] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [onlyPromo, setOnlyPromo] = useState(false);

  const LIMIT = 6;

  const fetchProducts = async (forcedPage) => {
    try {
      const currentPage = forcedPage ?? page;
      const q = query.trim();
      const res = await axios.get(`http://localhost:8080/products`, {
        params: {
          page: currentPage,
          limit: LIMIT,
          ...(q ? { q } : {}),
          ...(selectedCategory ? { category: selectedCategory } : {}),
          ...(priceMin !== "" ? { minPrice: priceMin } : {}),
          ...(priceMax !== "" ? { maxPrice: priceMax } : {}),
          ...(onlyPromo ? { onSale: true } : {}),
        },
      });
      const newProducts = res.data?.DT?.products || [];
      const total = res.data?.DT?.total || 0;

      setProducts((prev) => [...prev, ...newProducts]);
      setPage(() => currentPage + 1);

      const totalPages = Math.max(1, Math.ceil(total / LIMIT));
      setHasMore(currentPage < totalPages && newProducts.length > 0);
    } catch (err) {
      console.error("❌ Lỗi khi fetch sản phẩm:", err);
      setHasMore(false);
    }
  };

  useEffect(() => {
    fetchProducts(1);
    // eslint-disable-next-line
  }, []);

  // load categories once
  useEffect(() => {
    const loadCats = async () => {
      try {
        const res = await axios.get('http://localhost:8080/categories');
        setCategories(res?.data?.DT || []);
      } catch {}
    };
    loadCats();
  }, []);

  // debounce search
  useEffect(() => {
    setTyping(true);
    const t = setTimeout(() => {
      // reset list and page when query changes
      setProducts([]);
      setPage(1);
      setHasMore(true);
      setTyping(false);
      fetchProducts(1);
    }, 400);
    return () => clearTimeout(t);
    // eslint-disable-next-line
  }, [query]);

  // whenever filters change, reset and refetch
  useEffect(() => {
    setProducts([]);
    setPage(1);
    setHasMore(true);
    fetchProducts(1);
    // eslint-disable-next-line
  }, [selectedCategory, priceMin, priceMax, onlyPromo]);

  return (
    <div className="container" style={{ padding: 24 }}>
      <h1 className="section-title">
        <CrownOutlined /> Bộ sưu tập sản phẩm
      </h1>

      <div className="container" style={{ maxWidth: 1000, margin: '0 auto 16px' }}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Tìm kiếm sản phẩm..."
          className="search-input"
          style={{
            width: '100%',
            padding: '12px 14px',
            borderRadius: 12,
            border: '1px solid rgba(255,255,255,0.12)',
            background: 'rgba(255,255,255,0.06)',
            color: '#e8eaed',
            outline: 'none'
          }}
        />
        {typing && <div className="muted" style={{ marginTop: 6, fontSize: 12 }}>Đang gợi ý…</div>}

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
          <input type="number" inputMode="numeric" placeholder="Giá từ" value={priceMin}
            onChange={(e) => setPriceMin(e.target.value)}
            style={{ padding: '10px', borderRadius: 10, background: 'rgba(255,255,255,0.06)', color: '#e8eaed', border: '1px solid rgba(255,255,255,0.12)' }}
          />
          <input type="number" inputMode="numeric" placeholder="Đến" value={priceMax}
            onChange={(e) => setPriceMax(e.target.value)}
            style={{ padding: '10px', borderRadius: 10, background: 'rgba(255,255,255,0.06)', color: '#e8eaed', border: '1px solid rgba(255,255,255,0.12)' }}
          />
          <label style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <input type="checkbox" checked={onlyPromo} onChange={(e) => setOnlyPromo(e.target.checked)} />
            Chỉ hiển thị khuyến mãi
          </label>
        </div>
      </div>

      <InfiniteScroll
        dataLength={products.length}
        next={fetchProducts}
        hasMore={hasMore}
        loader={<h4 className="center muted">Đang tải dữ liệu…</h4>}
        endMessage={<p className="center muted">Bạn đã xem hết sản phẩm</p>}
      >
        <div className="grid" style={{ marginTop: 18 }}>
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
};

export default HomePage;
