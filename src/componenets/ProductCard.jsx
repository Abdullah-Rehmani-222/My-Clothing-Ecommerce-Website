import React, { useState } from "react";
import { Link } from "react-router-dom";

const ProductCard = ({ product, addToCart, toastOn }) => {
  const [added, setAdded] = useState(false);

  // ── Add to Cart handler ──────────────────────────────────────────────
  const handleCart = () => {
    if (added) return; // prevent double-adding
    setAdded(true);

    // Save product into cart via App-level state (also persists to sessionStorage)
    if (addToCart) addToCart(product);

    // Show toast
    if (toastOn) toastOn("Product added to cart!");
  };

  // ── Derived display values ───────────────────────────────────────────
  const cardImage =
    product?.imageDataUrl ||
    product?.image ||
    "../src/assets/mens-wear_image_01.png";

  const cardTitle    = product?.title         || "White & Black Formal Suit";
  const cardCategory = product?.category      || "WOMENSWEAR";
  const cardPrice    = product?.price         || "$39.99";
  const cardOriginal = product?.originalPrice || "$79.99";
  const productId    = product?.id            || "1";

  return (
    <div className="product-card">
      {/* Main Product Image — clicking opens ProductDetail with this product's data & ID in URL */}
      <Link
        to={`/product?id=${productId}`}
        state={{ product }}
        className="main-image-container"
      >
        <img
          src={cardImage}
          alt={cardTitle}
          className="main-product-image"
        />
      </Link>

      {/* Product Meta Details Section */}
      <div className="product-details">
        <p className="product-title">{cardTitle}</p>
        <span className="product-category">{cardCategory}</span>

        {/* Pricing Matrix */}
        <div className="price-container">
          <span className="current-price">{cardPrice}</span>
          <span className="original-price">{cardOriginal}</span>
        </div>
      </div>

      {/* Actions: Buy Now + Add to Cart */}
      <div className="button-container">
        <Link
          to={`/product?id=${productId}`}
          state={{ product }}
          className="buy-now-button"
        >
          <i className="fa-solid fa-bag-shopping"></i> Buy Now
        </Link>
        <button
          className={`add-to-cart-button${added ? " added" : ""}`}
          onClick={handleCart}
          disabled={added}
          style={added ? { backgroundColor: "#1a233a7a", cursor: "default" } : {}}
        >
          <i className="fa-solid fa-cart-shopping"></i>{" "}
          {added ? "Added" : "Add Cart"}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
