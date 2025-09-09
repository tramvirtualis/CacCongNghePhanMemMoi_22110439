import { CrownOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import ProductCard from "../components/ProductCard";


const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/products?page=${page}&limit=6`);
      const newProducts = res.data.DT.products;

      setProducts((prev) => [...prev, ...newProducts]);
      setPage(page + 1);

      if (products.length + newProducts.length >= res.data.DT.total) {
        setHasMore(false);
      }
    } catch (err) {
      console.error("❌ Lỗi khi fetch sản phẩm:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="container" style={{ padding: 24 }}>
      <h1 className="section-title">
        <CrownOutlined /> Bộ sưu tập sản phẩm
      </h1>

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
