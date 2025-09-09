import React from "react";

const ProductCard = ({ product }) => {
  const imageUrl = product.image || (product.imageUrls && product.imageUrls[0]) || "https://via.placeholder.com/400x250?text=No+Image";

  const price = Number(product.price || 0);
  const salePrice = Number(product.salePrice || 0);
  const hasSale = salePrice > 0 && salePrice < price;

  return (
    <div className="product-card">
      <div className="product-card__image">
        <img
          src={imageUrl}
          alt={product.name}
          onError={(e) => { e.currentTarget.src = "https://via.placeholder.com/400x250?text=No+Image"; }}
        />
        {hasSale && <span className="product-card__badge">Sale</span>}
      </div>
      <div className="product-card__content">
        <h3 className="product-card__title" title={product.name}>{product.name}</h3>
        <div className="product-card__prices">
          {hasSale ? (
            <>
              <span className="product-card__price--sale">{salePrice.toLocaleString()} VND</span>
              <span className="product-card__price--original">{price.toLocaleString()} VND</span>
            </>
          ) : (
            <span className="product-card__price">{price.toLocaleString()} VND</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;


