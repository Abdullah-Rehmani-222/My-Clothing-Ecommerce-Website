import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import ProductCard from "./ProductCard";
import FilterPanel from "./FilterPanel";

const STORAGE_KEY = "sr_products";

function getStoredProducts() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

// ── Page key → display metadata map ─────────────────────────────────────────
const PAGE_META = {
  home: {
    label: "Home Products",
    icon: "fa-solid fa-house",
    emptyMsg: "No Home products have been added yet.",
  },

  // New Arrivals
  "new-arrivals": {
    label: "New Arrivals",
    icon: "fa-solid fa-fire",
    emptyMsg: "No New Arrival products have been added yet.",
  },
  "new-arrivals-men": {
    label: "New Arrivals — Men's",
    icon: "fa-solid fa-person",
    emptyMsg: "No Men's New Arrival products have been added yet.",
  },
  "new-arrivals-women": {
    label: "New Arrivals — Women's",
    icon: "fa-solid fa-person-dress",
    emptyMsg: "No Women's New Arrival products have been added yet.",
  },
  "new-arrivals-kids": {
    label: "New Arrivals — Kids'",
    icon: "fa-solid fa-child",
    emptyMsg: "No Kids' New Arrival products have been added yet.",
  },

  // Men
  men: {
    label: "Men's Wear",
    icon: "fa-solid fa-person",
    emptyMsg: "No Men's Wear products have been added yet.",
  },
  "men-stitched": {
    label: "Men's Stitched Wear",
    icon: "fa-solid fa-shirt",
    emptyMsg: "No Men's Stitched Wear products have been added yet.",
  },
  "men-unstitched": {
    label: "Men's Unstitched Wear",
    icon: "fa-solid fa-scissors",
    emptyMsg: "No Men's Unstitched Wear products have been added yet.",
  },

  // Women
  women: {
    label: "Women's Wear",
    icon: "fa-solid fa-person-dress",
    emptyMsg: "No Women's Wear products have been added yet.",
  },
  "women-stitched": {
    label: "Women's Stitched Wear",
    icon: "fa-solid fa-vest",
    emptyMsg: "No Women's Stitched Wear products have been added yet.",
  },
  "women-unstitched": {
    label: "Women's Unstitched Wear",
    icon: "fa-solid fa-scroll",
    emptyMsg: "No Women's Unstitched Wear products have been added yet.",
  },

  // Kids
  kids: {
    label: "Kids' Wear",
    icon: "fa-solid fa-child",
    emptyMsg: "No Kids' Wear products have been added yet.",
  },
  "kids-boy": {
    label: "Kids' Wear — Boys",
    icon: "fa-solid fa-child-reaching",
    emptyMsg: "No Boys' Wear products have been added yet.",
  },
  "kids-girl": {
    label: "Kids' Wear — Girls",
    icon: "fa-solid fa-child-dress",
    emptyMsg: "No Girls' Wear products have been added yet.",
  },

  // Collections
  collections: {
    label: "Collections",
    icon: "fa-solid fa-layer-group",
    emptyMsg: "No Collection products have been added yet.",
  },
  "collections-summer": {
    label: "Summer Collection",
    icon: "fa-solid fa-sun",
    emptyMsg: "No Summer Collection products have been added yet.",
  },
  "collections-winter": {
    label: "Winter Collection",
    icon: "fa-solid fa-snowflake",
    emptyMsg: "No Winter Collection products have been added yet.",
  },
};

// Helper: Filter products strictly & accurately for a given page key
function filterProductsForPage(allProducts, pageKey) {
  return allProducts.filter((p) => {
    const page = p.page ? String(p.page).toLowerCase() : "";
    const category = p.category ? String(p.category).toUpperCase() : "";
    const title = p.title ? String(p.title).toLowerCase() : "";
    const descFabric = p.descFabric ? String(p.descFabric).toLowerCase() : "";
    const descDesign = p.descDesign ? String(p.descDesign).toLowerCase() : "";

    // Home Page
    // if (pageKey === "home") {
    //   return page === "home" || page === "all" || page === "";
    // }

    // Direct page match
    if (page === pageKey) return true;

    // 1. Men Stitched
    if (pageKey === "men-stitched") {
      if (page === "men-stitched" || page === "stitched") return true;
      if (page === "men" || category === "MENSWEAR") {
        return !title.includes("unstitched") && !descFabric.includes("unstitched") && !descDesign.includes("unstitched");
      }
      return false;
    }

    // 2. Men Unstitched
    if (pageKey === "men-unstitched") {
      if (page === "men-unstitched" || page === "unstitched") return true;
      if (page === "men" || category === "MENSWEAR") {
        return title.includes("unstitched") || descFabric.includes("unstitched") || descDesign.includes("unstitched");
      }
      return false;
    }

    // 3. Women Stitched
    if (pageKey === "women-stitched") {
      if (page === "women-stitched" || page === "stitched") return true;
      if (page === "women" || category === "WOMENSWEAR") {
        return !title.includes("unstitched") && !descFabric.includes("unstitched") && !descDesign.includes("unstitched");
      }
      return false;
    }

    // 4. Women Unstitched
    if (pageKey === "women-unstitched") {
      if (page === "women-unstitched" || page === "unstitched") return true;
      if (page === "women" || category === "WOMENSWEAR") {
        return title.includes("unstitched") || descFabric.includes("unstitched") || descDesign.includes("unstitched");
      }
      return false;
    }

    // 5. Kids Boy
    if (pageKey === "kids-boy") {
      if (page === "kids-boy" || page === "boy") return true;
      if (page === "kids" || category === "KIDSWEAR") {
        return !title.includes("girl") && !descDesign.includes("girl");
      }
      return false;
    }

    // 6. Kids Girl
    if (pageKey === "kids-girl") {
      if (page === "kids-girl" || page === "girl") return true;
      if (page === "kids" || category === "KIDSWEAR") {
        return title.includes("girl") || descDesign.includes("girl");
      }
      return false;
    }

    // 7. Collections Summer
    if (pageKey === "collections-summer") {
      if (page === "collections-summer" || page === "summer") return true;
      if (page === "collections" || category === "COLLECTION") {
        return !title.includes("winter") && !descDesign.includes("winter") && !descFabric.includes("winter");
      }
      return false;
    }

    // 8. Collections Winter
    if (pageKey === "collections-winter") {
      if (page === "collections-winter" || page === "winter") return true;
      if (page === "collections" || category === "COLLECTION") {
        return title.includes("winter") || descDesign.includes("winter") || descFabric.includes("winter");
      }
      return false;
    }

    // 9. New Arrivals Subcategories
    if (pageKey === "new-arrivals-men") {
      return page === "new-arrivals-men" || page === "men" || category === "MENSWEAR";
    }
    if (pageKey === "new-arrivals-women") {
      return page === "new-arrivals-women" || page === "women" || category === "WOMENSWEAR";
    }
    if (pageKey === "new-arrivals-kids") {
      return page === "new-arrivals-kids" || page === "kids" || category === "KIDSWEAR";
    }

    // Fallback general categories
    if (pageKey === "men") return page.startsWith("men") || category === "MENSWEAR";
    if (pageKey === "women") return page.startsWith("women") || category === "WOMENSWEAR";
    if (pageKey === "kids") return page.startsWith("kids") || category === "KIDSWEAR";
    if (pageKey === "collections") return page.startsWith("collections") || category === "COLLECTION";

    return false;
  });
}

// ── CategoryProductLayout ─────────────────────────────────────────────────
const CategoryProductLayout = ({ pageKey = "men", hideHeader = false, toastOn, addToCart }) => {
  const location = useLocation();
  const [allProducts, setAllProducts] = useState(() => getStoredProducts());

  // Compute page products synchronously
  const pageProducts = filterProductsForPage(allProducts, pageKey);

  // Initialize filtered products synchronously with pageProducts
  const [filteredProducts, setFilteredProducts] = useState(pageProducts);

  const meta = PAGE_META[pageKey] || {
    label: "Products",
    icon: "fa-solid fa-tag",
    emptyMsg: "No products available.",
  };

  // Re-sync all products & filtered products immediately on route/location change
  useEffect(() => {
    const freshStored = getStoredProducts();
    setAllProducts(freshStored);
    const freshPageProds = filterProductsForPage(freshStored, pageKey);
    setFilteredProducts(freshPageProds);

    const handleUpdate = () => {
      const updatedStored = getStoredProducts();
      setAllProducts(updatedStored);
      setFilteredProducts(filterProductsForPage(updatedStored, pageKey));
    };

    window.addEventListener("storage", handleUpdate);
    window.addEventListener("focus", handleUpdate);
    return () => {
      window.removeEventListener("storage", handleUpdate);
      window.removeEventListener("focus", handleUpdate);
    };
  }, [location.pathname, pageKey]);

  return (
    <section className={`cat-page-section${hideHeader ? " cat-page-section--no-header" : ""}`}>
      {/* Optional Page Header */}
      {!hideHeader && (
        <div className="cat-page-header">
          <div className="cat-page-header__inner">
            <i className={meta.icon}></i>
            <h1>{meta.label}</h1>
          </div>
          <p className="cat-page-header__sub">
            Discover our exclusive range of {meta.label.toLowerCase()}
          </p>
        </div>
      )}

      {/* Filter Bar */}
      <div className="cat-page-filter-wrap">
        <FilterPanel
          key={`${pageKey}-${location.pathname}`}
          products={pageProducts}
          onFilter={setFilteredProducts}
          categoryLabel={meta.label}
        />
      </div>

      {/* Product Grid Container */}
      <div className="cat-page-grid-wrap">
        {pageProducts.length === 0 ? (
          <div className="cat-page-empty">
            <i className={meta.icon}></i>
            <h2>No Products Yet</h2>
            <p>{meta.emptyMsg}</p>
            <p className="cat-page-empty__hint">
              Add products via the{" "}
              <a href="/admin" className="cat-page-empty__link">
                Admin Panel
              </a>{" "}
              and set the page to &ldquo;{meta.label}&rdquo;.
            </p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="cat-page-empty">
            <i className="fa-solid fa-filter-circle-xmark"></i>
            <h2>No Matches</h2>
            <p>No products match your current filters.</p>
            <p className="cat-page-empty__hint">Try adjusting or clearing the filters above.</p>
          </div>
        ) : (
          <div className="products-grid cat-products-grid">
            {filteredProducts.map((product) => (
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
    </section>
  );
};

export default CategoryProductLayout;
