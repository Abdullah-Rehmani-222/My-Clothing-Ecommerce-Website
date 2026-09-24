import React, { useState, useEffect, useRef } from "react";

// ── FilterPanel ────────────────────────────────────────────────────────────
// Modern horizontal filter bar (desktop) + bottom drawer (mobile).
// Props:
//   products      – the full unfiltered products array for this page
//   onFilter      – callback(filteredProducts) called whenever filter state changes
//   categoryLabel – string shown in the heading, e.g. "Men's Wear"
// ──────────────────────────────────────────────────────────────────────────

const SORT_OPTIONS = [
  { value: "newest",    label: "Newest First" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc",label: "Price: High to Low" },
  { value: "az",        label: "Name: A – Z" },
  { value: "za",        label: "Name: Z – A" },
];

const AVAIL_OPTIONS = [
  { value: "all",      label: "All" },
  { value: "instock",  label: "In Stock" },
  { value: "outstock", label: "Out of Stock" },
];

// Parse a price string like "$39.99" or "Rs 1,200" → float
function parsePrice(str) {
  if (!str) return 0;
  const num = parseFloat(String(str).replace(/[^0-9.]/g, ""));
  return isNaN(num) ? 0 : num;
}

const FilterPanel = ({ products = [], onFilter, categoryLabel = "Products" }) => {
  const [sortBy, setSortBy]       = useState("newest");
  const [availability, setAvail]  = useState("all");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [sortDropOpen, setSortDropOpen] = useState(false);
  const sortRef = useRef(null);

  // ── Close sort dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (sortRef.current && !sortRef.current.contains(e.target)) {
        setSortDropOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ── Body scroll lock when drawer is open
  useEffect(() => {
    if (drawerOpen) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }
    return () => document.body.classList.remove("no-scroll");
  }, [drawerOpen]);

    // ── Compute & emit filtered+sorted products whenever state changes
  useEffect(() => {
    let result = [...products];

    // Availability
    if (availability === "instock") {
      result = result.filter(
        (p) => !p.availability || p.availability.toLowerCase() !== "out of stock"
      );
    } else if (availability === "outstock") {
      result = result.filter(
        (p) => p.availability && p.availability.toLowerCase() === "out of stock"
      );
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          return parsePrice(a.price) - parsePrice(b.price);
        case "price-desc":
          return parsePrice(b.price) - parsePrice(a.price);
        case "az":
          return (a.title || "").localeCompare(b.title || "");
        case "za":
          return (b.title || "").localeCompare(a.title || "");
        case "newest":
        default:
          return (b.createdAt || 0) - (a.createdAt || 0);
      }
    });

    if (onFilter) onFilter(result);
    
    // 🌟 FIXED DEPENDENCIES BELOW:
    // We stringify the product list IDs or check length to prevent reference-based infinite looping.
  }, [JSON.stringify(products.map(p => p.id)), sortBy, availability]); 


  // ── Derived state for active chips
  const activeChips = [];
  if (sortBy !== "newest") {
    const label = SORT_OPTIONS.find((o) => o.value === sortBy)?.label;
    activeChips.push({ key: "sort", label: `Sort: ${label}`, clear: () => setSortBy("newest") });
  }
  if (availability !== "all") {
    const label = AVAIL_OPTIONS.find((o) => o.value === availability)?.label;
    activeChips.push({ key: "avail", label: label, clear: () => setAvail("all") });
  }

  const hasActiveFilters = activeChips.length > 0;

  const clearAll = () => {
    setSortBy("newest");
    setAvail("all");
  };

  const currentSortLabel = SORT_OPTIONS.find((o) => o.value === sortBy)?.label;

  // ── RENDER
  return (
    <>
      {/* ════════════════════════════════════════════
          DESKTOP  — Horizontal sticky filter bar
      ════════════════════════════════════════════ */}
      <div className="fp-bar">
        {/* Left: result count */}
        <div className="fp-bar__count">
          <i className="fa-solid fa-layer-group"></i>
          <span>
            <strong>{products.length}</strong>{" "}
            {products.length === 1 ? "Product" : "Products"}
          </span>
        </div>

        {/* Centre: active chips */}
        {hasActiveFilters && (
          <div className="fp-bar__chips">
            {activeChips.map((chip) => (
              <button
                key={chip.key}
                className="fp-chip"
                onClick={chip.clear}
                aria-label={`Remove filter: ${chip.label}`}
              >
                {chip.label}
                <i className="fa-solid fa-xmark fp-chip__x"></i>
              </button>
            ))}
            <button className="fp-chip fp-chip--clear-all" onClick={clearAll}>
              Clear All
            </button>
          </div>
        )}

        {/* Right: controls */}
        <div className="fp-bar__controls">
          {/* Availability pills */}
          <div className="fp-avail-pills" role="group" aria-label="Filter by availability">
            {AVAIL_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                className={`fp-avail-pill${availability === opt.value ? " active" : ""}`}
                onClick={() => setAvail(opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Sort dropdown */}
          <div className="fp-sort" ref={sortRef}>
            <button
              className="fp-sort__trigger"
              onClick={() => setSortDropOpen((p) => !p)}
              aria-expanded={sortDropOpen}
              aria-haspopup="listbox"
            >
              <i className="fa-solid fa-arrow-up-wide-short"></i>
              <span>{currentSortLabel}</span>
              <i className={`fa-solid fa-chevron-down fp-sort__caret${sortDropOpen ? " open" : ""}`}></i>
            </button>
            {sortDropOpen && (
              <ul className="fp-sort__menu" role="listbox">
                {SORT_OPTIONS.map((opt) => (
                  <li
                    key={opt.value}
                    role="option"
                    aria-selected={sortBy === opt.value}
                    className={`fp-sort__item${sortBy === opt.value ? " selected" : ""}`}
                    onClick={() => {
                      setSortBy(opt.value);
                      setSortDropOpen(false);
                    }}
                  >
                    {sortBy === opt.value && <i className="fa-solid fa-check fp-sort__check"></i>}
                    {opt.label}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════
          MOBILE — Sticky "Filter & Sort" FAB button
      ════════════════════════════════════════════ */}
      <button
        className={`fp-mobile-fab${hasActiveFilters ? " has-filters" : ""}`}
        onClick={() => setDrawerOpen(true)}
        aria-label="Open filters"
      >
        <i className="fa-solid fa-sliders"></i>
        Filter &amp; Sort
        {hasActiveFilters && (
          <span className="fp-fab__badge">{activeChips.length}</span>
        )}
      </button>

      {/* ════════════════════════════════════════════
          MOBILE — Bottom Drawer
      ════════════════════════════════════════════ */}
      {drawerOpen && (
        <div
          className="fp-drawer-overlay"
          onClick={() => setDrawerOpen(false)}
          aria-hidden="true"
        />
      )}
      <div className={`fp-drawer${drawerOpen ? " open" : ""}`} role="dialog" aria-modal="true" aria-label="Filter options">
        <div className="fp-drawer__handle" onClick={() => setDrawerOpen(false)} />

        <div className="fp-drawer__header">
          <h3>Filter &amp; Sort</h3>
          <button
            className="fp-drawer__close"
            onClick={() => setDrawerOpen(false)}
            aria-label="Close filters"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div className="fp-drawer__body">
          {/* Sort section */}
          <div className="fp-drawer__section">
            <h4 className="fp-drawer__section-title">Sort By</h4>
            <div className="fp-drawer__option-grid">
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  className={`fp-drawer__option${sortBy === opt.value ? " active" : ""}`}
                  onClick={() => setSortBy(opt.value)}
                >
                  {sortBy === opt.value && <i className="fa-solid fa-check"></i>}
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Availability section */}
          <div className="fp-drawer__section">
            <h4 className="fp-drawer__section-title">Availability</h4>
            <div className="fp-drawer__option-grid">
              {AVAIL_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  className={`fp-drawer__option${availability === opt.value ? " active" : ""}`}
                  onClick={() => setAvail(opt.value)}
                >
                  {availability === opt.value && <i className="fa-solid fa-check"></i>}
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="fp-drawer__footer">
          {hasActiveFilters && (
            <button className="fp-drawer__clear" onClick={clearAll}>
              Clear All
            </button>
          )}
          <button className="fp-drawer__apply" onClick={() => setDrawerOpen(false)}>
            View {products.length} {products.length === 1 ? "Product" : "Products"}
          </button>
        </div>
      </div>
    </>
  );
};

export default FilterPanel;
