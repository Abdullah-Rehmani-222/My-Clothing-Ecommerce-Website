import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ProductCard from "./ProductCard";

const STORAGE_KEY = "sr_products";

function getStoredProducts() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

// ── Category Sections Metadata (Vertical Order as per Wireframe) ─────────────
const SECTIONS = [
  {
    id: "men",
    title: "Menswear",
    icon: "fa-solid fa-person",
    link: "/men",
  },
  {
    id: "women",
    title: "Womenswear",
    icon: "fa-solid fa-person-dress",
    link: "/women",
  },
  {
    id: "kids",
    title: "Kids' Wear",
    icon: "fa-solid fa-child",
    link: "/kids",
  },
  {
    id: "new-arrivals",
    title: "New Arrivals",
    icon: "fa-solid fa-fire",
    link: "/new-arrivals",
  },
  {
    id: "collections",
    title: "Collections",
    icon: "fa-solid fa-layer-group",
    link: "/collections",
  },
];

// Max products displayed per section on the Home page
const HOME_MAX_PER_SECTION = 4;

// ── Strict category-aware filter for Home page sections ───────────────────────
// A product belongs to a section ONLY when BOTH the page field AND the
// category field agree — preventing cross-category leakage.
function filterProductsForSection(productsList, sectionId) {
  return productsList.filter((p) => {
    const page = p.page ? String(p.page).toLowerCase() : "";
    const cat  = p.category ? String(p.category).toUpperCase() : "";

    if (sectionId === "men") {
      // Must have a men page OR MENSWEAR category — NOT the other category
      if (cat === "WOMENSWEAR" || cat === "KIDSWEAR") return false;
      return page.startsWith("men") || cat === "MENSWEAR";
    }

    if (sectionId === "women") {
      // Must have a women page OR WOMENSWEAR category — NOT the other category
      if (cat === "MENSWEAR" || cat === "KIDSWEAR") return false;
      return page.startsWith("women") || cat === "WOMENSWEAR";
    }

    if (sectionId === "kids") {
      if (cat === "MENSWEAR" || cat === "WOMENSWEAR") return false;
      return page.startsWith("kids") || cat === "KIDSWEAR";
    }

    if (sectionId === "new-arrivals") {
      const badge = p.instBadge ? String(p.instBadge).toLowerCase() : "";
      if (page.startsWith("new-arrivals") || cat.includes("ARRIVALS") || cat.includes("NEW")) return true;
      if (badge.includes("new") || badge.includes("arrival")) return true;
      return false;
    }

    if (sectionId === "collections") {
      return page.startsWith("collections") || cat === "COLLECTION" || cat === "COLLECTIONS";
    }

    return false;
  });
}

// ── ProductLayout (Categorized Home Page Layout) ──────────────────────────────
const ProductLayout = ({ toastOn, addToCart }) => {
  const [allProducts, setAllProducts] = useState(() => getStoredProducts());

  useEffect(() => {
    const handleUpdate = () => {
      setAllProducts(getStoredProducts());
    };

    window.addEventListener("storage", handleUpdate);
    window.addEventListener("focus", handleUpdate);
    return () => {
      window.removeEventListener("storage", handleUpdate);
      window.removeEventListener("focus", handleUpdate);
    };
  }, []);

  return (
    <section className="home-categories-wrap">
      {SECTIONS.map((sec) => {
        // All products that match this section (used for the count badge)
        const allSectionProducts = filterProductsForSection(allProducts, sec.id);
        // Slice to max 4 for the home page preview
        const previewProducts = allSectionProducts.slice(0, HOME_MAX_PER_SECTION);

        return (
          <div key={sec.id} className="home-cat-section">
            {/* Section Header: Title on Left | "View all" on Right */}
            <div className="home-cat-header">
              <div className="home-cat-title-wrap">
                <i className={`${sec.icon} home-cat-icon`}></i>
                <h2 className="home-cat-title">{sec.title}</h2>
                <span className="home-cat-count-badge">
                  {allSectionProducts.length}{" "}
                  {allSectionProducts.length === 1 ? "Item" : "Items"}
                </span>
              </div>
              <Link to={sec.link} className="home-cat-view-all">
                View all <i className="fa-solid fa-arrow-right"></i>
              </Link>
            </div>

            {/* Section Product Cards Grid */}
            {allProducts.length === 0 || allSectionProducts.length === 0 ? (
              <div className="home-cat-empty">
                <i className={`${sec.icon} home-cat-empty__icon`}></i>
                <p className="home-cat-empty__title">No Products Available</p>
                <p className="home-cat-empty__sub">
                  Products added via the Admin Panel will appear here.
                </p>
              </div>
            ) : (
              <div className="products-grid cat-products-grid">
                {previewProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    toastOn={toastOn}
                    addToCart={addToCart}
                  />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </section>
  );
};

export default ProductLayout;
