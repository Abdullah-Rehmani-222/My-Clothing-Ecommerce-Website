import React, { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import { Link } from "react-router-dom";

const STORAGE_KEY = "sr_products";

function getStoredProducts() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

const ProductLayout = ({ toastOn, addToCart }) => {
  const [customProducts, setCustomProducts] = useState(() => getStoredProducts());

  useEffect(() => {
    const handleStorageChange = () => {
      setCustomProducts(getStoredProducts());
    };

    // Listen for localStorage changes across windows/tabs and focus
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("focus", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("focus", handleStorageChange);
    };
  }, []);

  // Filter products created in Admin Panel by category/page
  const mensProducts = customProducts.filter((p) => {
    const cat = p.category ? String(p.category).toUpperCase() : "";
    const page = p.page ? String(p.page).toLowerCase() : "";
    return (cat === "MENSWEAR" || page === "men") && (page === "home" || page === "men" || page === "all" || !page);
  });

  const womensProducts = customProducts.filter((p) => {
    const cat = p.category ? String(p.category).toUpperCase() : "";
    const page = p.page ? String(p.page).toLowerCase() : "";
    return (cat === "WOMENSWEAR" || page === "women") && (page === "home" || page === "women" || page === "all" || !page);
  });

  const kidsProducts = customProducts.filter((p) => {
    const cat = p.category ? String(p.category).toUpperCase() : "";
    const page = p.page ? String(p.page).toLowerCase() : "";
    return (cat === "KIDSWEAR" || page === "kids") && (page === "home" || page === "kids" || page === "all" || !page);
  });

  const collectionProducts = customProducts.filter((p) => {
    const cat = p.category ? String(p.category).toUpperCase() : "";
    const page = p.page ? String(p.page).toLowerCase() : "";
    return (cat === "COLLECTION" || page === "collections") && (page === "home" || page === "collections" || page === "all" || !page);
  });

  return (
    <>
      <section className="section-03">
        {/* ── Men's Wear ── */}
        <div className="mens-wear">
          <div className="category-heading">
            <h2>Men's Wear</h2>
            <Link to="#" className="view-all-btn">
              View all
            </Link>
          </div>
          <div className="products-grid men-products-grid">
            {mensProducts.length > 0 ? (
              mensProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  toastOn={toastOn}
                  addToCart={addToCart}
                />
              ))
            ) : (
              <p className="no-products-msg" style={{ gridColumn: "1 / -1", color: "#6b7280", padding: "20px 0", fontSize: "0.95rem" }}>
                No Men's Wear products created yet.
              </p>
            )}
          </div>
        </div>

        {/* ── Women's Wear ── */}
        <div className="womens-wear">
          <div className="category-heading">
            <h2>Women's Wear</h2>
            <Link to="#" className="view-all-btn">
              View all
            </Link>
          </div>
          <div className="products-grid womens-products-grid">
            {womensProducts.length > 0 ? (
              womensProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  toastOn={toastOn}
                  addToCart={addToCart}
                />
              ))
            ) : (
              <p className="no-products-msg" style={{ gridColumn: "1 / -1", color: "#6b7280", padding: "20px 0", fontSize: "0.95rem" }}>
                No Women's Wear products created yet.
              </p>
            )}
          </div>
        </div>

        {/* ── Kids Wear (if created in Admin Panel) ── */}
        {kidsProducts.length > 0 && (
          <div className="kids-wear" style={{ marginTop: "40px" }}>
            <div className="category-heading">
              <h2>Kids' Wear</h2>
              <Link to="#" className="view-all-btn">
                View all
              </Link>
            </div>
            <div className="products-grid kids-products-grid">
              {kidsProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  toastOn={toastOn}
                  addToCart={addToCart}
                />
              ))}
            </div>
          </div>
        )}

        {/* ── Collections (if created in Admin Panel) ── */}
        {collectionProducts.length > 0 && (
          <div className="collections-wear" style={{ marginTop: "40px" }}>
            <div className="category-heading">
              <h2>Collections</h2>
              <Link to="#" className="view-all-btn">
                View all
              </Link>
            </div>
            <div className="products-grid collection-products-grid">
              {collectionProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  toastOn={toastOn}
                  addToCart={addToCart}
                />
              ))}
            </div>
          </div>
        )}
      </section>
    </>
  );
};

export default ProductLayout;
