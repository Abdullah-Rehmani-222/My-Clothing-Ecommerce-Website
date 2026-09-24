import { Link, useNavigate } from "react-router-dom";
import "../AdminPanel.css";
import { useState, useEffect, useRef } from "react";
import AdminPanelStatCard from "../componenets/AdminPanelStatCard.jsx";

const STORAGE_KEY = "sr_products";

/** Load all products from localStorage */
function loadProducts() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

/** Save products array to localStorage */
function saveProducts(products) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

/** Generate a unique product ID */
function genId() {
  return "prod-" + Date.now();
}

/** Category pill CSS class */
function pillClass(category) {
  const map = {
    MENSWEAR: "ap-pill--men",
    WOMENSWEAR: "ap-pill--women",
    KIDSWEAR: "ap-pill--kids",
    COLLECTION: "ap-pill--col",
    "NEW-ARRIVAL": "ap-pill--other",
  };
  return map[category] || "ap-pill--other";
}

const initialFormState = {
  title: "",
  category: "",
  subCategory: "",
  page: "",
  price: "",
  originalPrice: "",
  sku: "",
  barcode: "",
  availability: "In Stock",
  descDesign: "",
  descColor: "",
  descFabric: "",
  productDetail: "",
  disclaimer: "",
  colors: "",
  sizes: "",
  fabrics: "",
};

const AdminPanel = () => {
  const navigate = useNavigate();

  // ── 1. Products & Navigation State ──────────────────────────────────────
  const [productsList, setProductsList] = useState(() => loadProducts());
  const [activeSection, setActiveSection] = useState("dashboard"); // 'dashboard' | 'upload' | 'products'
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Sync state changes with localStorage
  useEffect(() => {
    saveProducts(productsList);
  }, [productsList]);

  // ── 2. Form & Image Upload State ───────────────────────────────────────
  const [formData, setFormData] = useState(initialFormState);

  // Main image
  const [currentImageDataUrl, setCurrentImageDataUrl] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  // Sub-images (4 slots)
  const [subImages, setSubImages] = useState(["", "", "", ""]);
  const subRef0 = useRef(null);
  const subRef1 = useRef(null);
  const subRef2 = useRef(null);
  const subRef3 = useRef(null);
  const subFileInputRefs = [subRef0, subRef1, subRef2, subRef3];

  const [formMsg, setFormMsg] = useState({ text: "", isError: false });

  // Toast State
  const [toast, setToast] = useState({ show: false, message: "", isError: false });

  const showToast = (message, isError = false) => {
    setToast({ show: true, message, isError });
    setTimeout(() => {
      setToast({ show: false, message: "", isError: false });
    }, 3200);
  };

  // ── 3. Filters & Modal State ───────────────────────────────────────────
  const [filterPage, setFilterPage] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, productId: null });

  // Handle sidebar navigation
  const handleSectionSwitch = (sectionId) => {
    setActiveSection(sectionId);
    setIsSidebarOpen(false);
  };

  // Handle form field changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // When category changes, reset subCategory
    if (name === "category") {
      setFormData((prev) => ({ ...prev, [name]: value, subCategory: "" }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle Main Image File selection & FileReader
  const handleImageFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    if (file.size > 5 * 1024 * 1024) {
      showToast("Image exceeds 5 MB limit.", true);
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      setCurrentImageDataUrl(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  // Handle Sub-Image File selection
  const handleSubImageFile = (file, index) => {
    if (!file || !file.type.startsWith("image/")) return;
    if (file.size > 5 * 1024 * 1024) {
      showToast("Sub-image exceeds 5 MB limit.", true);
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      setSubImages((prev) => {
        const updated = [...prev];
        updated[index] = e.target.result;
        return updated;
      });
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageFile(e.dataTransfer.files[0]);
    }
  };

  const resetImageDropZone = () => {
    setCurrentImageDataUrl("");
    setSubImages(["", "", "", ""]);
    if (fileInputRef.current) fileInputRef.current.value = "";
    subFileInputRefs.forEach((ref) => {
      if (ref.current) ref.current.value = "";
    });
  };

  const handleFormReset = () => {
    setFormData(initialFormState);
    resetImageDropZone();
    setFormMsg({ text: "", isError: false });
  };

  // Handle Upload Form Submit
  const handleFormSubmit = (e) => {
    e.preventDefault();

    const { title, category, page, price } = formData;

    // Basic validation
    if (!title.trim() || !category || !page || !price.trim()) {
      setFormMsg({ text: "Please fill in all required fields (*).", isError: true });
      return;
    }

    // Build final sub-images array: fill empty slots with main image
    const resolvedSubImages = subImages.map((si) => si || currentImageDataUrl);

    const newProduct = {
      id: genId(),
      ...formData,
      title: title.trim(),
      price: price.trim(),
      originalPrice: formData.originalPrice.trim(),
      sku: formData.sku.trim(),
      barcode: formData.barcode.trim(),
      descDesign: formData.descDesign.trim(),
      descColor: formData.descColor.trim(),
      descFabric: formData.descFabric.trim(),
      productDetail: formData.productDetail.trim(),
      disclaimer: formData.disclaimer.trim(),
      colors: formData.colors.trim(),
      sizes: formData.sizes.trim(),
      fabrics: formData.fabrics.trim(),
      imageDataUrl: currentImageDataUrl,
      subImages: resolvedSubImages,
      createdAt: Date.now(),
    };

    const updatedList = [newProduct, ...productsList];
    setProductsList(updatedList);

    setFormMsg({ text: "✅ Product uploaded successfully!", isError: false });
    showToast("Product uploaded successfully!");
    handleFormReset();

    setTimeout(() => {
      setFormMsg({ text: "", isError: false });
    }, 4000);
  };

  // Delete modal actions
  const openDeleteModal = (id) => {
    setDeleteModal({ isOpen: true, productId: id });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, productId: null });
  };

  const confirmDelete = () => {
    if (!deleteModal.productId) return;
    const updatedList = productsList.filter((p) => p.id !== deleteModal.productId);
    setProductsList(updatedList);
    closeDeleteModal();
    showToast("Product deleted.");
  };

  // Open product detail page with product ID in URL
  const openProductPage = (productId) => {
    navigate(`/product?id=${productId}`);
  };

  // Compute Stats dynamically
  const statTotal = productsList.length;
  const statMen = productsList.filter((p) => p.category === "MENSWEAR").length;
  const statWomen = productsList.filter((p) => p.category === "WOMENSWEAR").length;
  const statCollections = productsList.filter((p) => p.category === "COLLECTION").length;

  // Filter products for All Products grid
  const filteredProducts = productsList.filter((p) => {
    const matchPage = filterPage === "all" || p.page === filterPage;
    const matchCat = filterCategory === "all" || p.category === filterCategory;
    return matchPage && matchCat;
  });

  // Sub-category options based on selected category
  const getSubCategoryOptions = () => {
    if (formData.category === "MENSWEAR" || formData.category === "WOMENSWEAR") {
      return ["Stitched", "Unstitched", "Eastern"];
    }
    if (formData.category === "KIDSWEAR") {
      return ["Boy", "Girl"];
    }
    if (formData.category === "COLLECTION") {
      return ["Summer", "Winter"];
    }
    return [];
  };

  const subCategoryOptions = getSubCategoryOptions();
  const showSubCategory = subCategoryOptions.length > 0;

  return (
    <div className="ap-wrapper">
      {/* ══════════════════════════════════════════
         HEADER
      ══════════════════════════════════════════ */}
      <div className="ap-header-container">
        <header className="ap-header">
          <nav className="ap-nav">
            {/* Left: logo */}
            <div className="nav_01">
              <div className="logo">
                <img
                  src="../src/assets/my-logo_dark.png"
                  alt="StyleRush logo"
                />
                <Link to="/">
                  Style<span id="second_logo">Rush</span>
                </Link>
              </div>
            </div>

            {/* Centre: page title badge */}
            <div className="ap-nav__title">
              <i className="fa-solid fa-screwdriver-wrench"></i>
              <span>Admin Panel</span>
            </div>

            {/* Right: account and Sidebar toggle (mobile) icon */}
            <div className="ap-nav__right">
              <button
                className="ap-sidebar-toggle"
                id="ap-sidebar-toggle"
                aria-label="Toggle sidebar"
                onClick={() => setIsSidebarOpen((prev) => !prev)}
              >
                <i className="fa-solid fa-bars"></i>
              </button>

              <div className="accounts">
                <Link to="#" id="ap-account-btn" aria-label="Account">
                  <i className="fa-solid fa-user"></i>
                </Link>
              </div>
            </div>
          </nav>
        </header>
      </div>

      {/* ══════════════════════════════════════════
         MAIN LAYOUT  (sidebar + content)
      ══════════════════════════════════════════ */}
      <div className="ap-layout">
        {/* ── Sidebar ────────────────────────── */}
        <aside className={`ap-sidebar ${isSidebarOpen ? "open" : ""}`} id="ap-sidebar">
          <div className="ap-sidebar__inner">
            <h3 className="ap-sidebar__heading">Navigation</h3>
            <nav className="ap-sidebar__nav">
              <button
                className={`ap-sidebar__link ${activeSection === "dashboard" ? "active" : ""}`}
                onClick={() => handleSectionSwitch("dashboard")}
              >
                <i className="fa-solid fa-gauge-high"></i> Dashboard
              </button>
              <button
                className={`ap-sidebar__link ${activeSection === "upload" ? "active" : ""}`}
                onClick={() => handleSectionSwitch("upload")}
              >
                <i className="fa-solid fa-cloud-arrow-up"></i> Upload Product
              </button>
              <button
                className={`ap-sidebar__link ${activeSection === "products" ? "active" : ""}`}
                onClick={() => handleSectionSwitch("products")}
              >
                <i className="fa-solid fa-box-open"></i>
                <span style={{ flex: 1, textAlign: "left" }}>All Products</span>
                {productsList.length > 0 && (
                  <span className="ap-sidebar__counter">{productsList.length}</span>
                )}
              </button>
              <div className="ap-sidebar__total-counter-container"><span className="ap-sidebar__total-counter">{statTotal}</span></div>
            </nav>

            <h3 className="ap-sidebar__heading ap-sidebar__heading--sub">
              Store Pages
            </h3>
            <nav className="ap-sidebar__nav">
              <Link className="ap-sidebar__link" to="/">
                <i className="fa-solid fa-house"></i> Home
              </Link>
              <Link className="ap-sidebar__link" to="/new-arrivals">
                <i className="fa-solid fa-fire"></i> New Arrivals
              </Link>
              <Link className="ap-sidebar__link" to="/men">
                <i className="fa-solid fa-person"></i> Men's Wear
              </Link>
              <Link className="ap-sidebar__link" to="/women">
                <i className="fa-solid fa-person-dress"></i> Women's Wear
              </Link>
              <Link className="ap-sidebar__link" to="/kids">
                <i className="fa-solid fa-child"></i> Kids
              </Link>
              <Link className="ap-sidebar__link" to="/collections">
                <i className="fa-solid fa-star"></i> Collections
              </Link>
            </nav>
          </div>
        </aside>

        {/* ── Main content ────────────────────── */}
        <main className="ap-main" id="ap-main">
          {/* ── SECTION: Dashboard ── */}
          {activeSection === "dashboard" && (
            <section className="ap-section active" id="sec-dashboard">
              <div className="ap-section__header">
                <h2>
                  <i className="fa-solid fa-gauge-high"></i> Dashboard
                </h2>
              </div>

              {/* Stat cards */}
              <div className="ap-stats-grid">
                <AdminPanelStatCard
                  icon="fa-solid fa-box-open"
                  background="#e3f0ff"
                  color="#2563eb"
                  label="Total Products"
                  value={statTotal}
                  id="stat-total"
                />
                <AdminPanelStatCard
                  icon="fa-solid fa-person"
                  background="#eaffea"
                  color="#16a34a"
                  label="Men's Wear"
                  value={statMen}
                  id="stat-men"
                />
                <AdminPanelStatCard
                  icon="fa-solid fa-person-dress"
                  background="#fff0f6"
                  color="#db2777"
                  label="Women's Wear"
                  value={statWomen}
                  id="stat-women"
                />
                <AdminPanelStatCard
                  icon="fa-solid fa-star"
                  background="#fffbe6"
                  color="#d97706"
                  label="Collections"
                  value={statCollections}
                  id="stat-collections"
                />
              </div>

              {/* Recent products table */}
              <div className="ap-card ap-card--table">
                <div className="ap-card__head">
                  <h3>Recently Added Products</h3>
                </div>
                <div className="ap-table-wrap">
                  <table className="ap-table" id="recent-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Image</th>
                        <th>Title</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Page</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody id="recent-table-body">
                      {productsList.length === 0 ? (
                        <tr className="ap-table__empty">
                          <td colSpan="7">No products uploaded yet.</td>
                        </tr>
                      ) : (
                        productsList.slice(0, 10).map((p) => (
                          <tr key={p.id}>
                            <td>
                              <span className="ap-id-badge">{p.id}</span>
                            </td>
                            <td>
                              {p.imageDataUrl ? (
                                <img
                                  className="ap-table__thumb"
                                  src={p.imageDataUrl}
                                  alt={p.title}
                                />
                              ) : (
                                <div className="ap-table__thumb-placeholder">
                                  <i className="fa-solid fa-image"></i>
                                </div>
                              )}
                            </td>
                            <td>{p.title}</td>
                            <td>
                              <span className={`ap-pill ${pillClass(p.category)}`}>
                                {p.category}
                              </span>
                            </td>
                            <td>{p.price}</td>
                            <td>
                              {p.page ? p.page.charAt(0).toUpperCase() + p.page.slice(1) : "-"}
                            </td>
                            <td>
                              <button
                                className="ap-tbl-btn ap-tbl-btn--view"
                                title="View in product page"
                                onClick={() => openProductPage(p.id)}
                              >
                                <i className="fa-solid fa-eye"></i>
                              </button>
                              <button
                                className="ap-tbl-btn ap-tbl-btn--del"
                                title="Delete"
                                onClick={() => openDeleteModal(p.id)}
                              >
                                <i className="fa-solid fa-trash-can"></i>
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}

          {/* ── SECTION: Upload Product ── */}
          {activeSection === "upload" && (
            <section className="ap-section active" id="sec-upload">
              <div className="ap-section__header">
                <h2>
                  <i className="fa-solid fa-cloud-arrow-up"></i> Upload Product
                </h2>
              </div>

              <div className="ap-card ap-card--form">
                <form id="upload-form" onSubmit={handleFormSubmit} noValidate>

                  {/* ── Product Media ── */}
                  <div className="ap-form-group ap-form-group--full">
                    <label className="ap-label">
                      Product Image
                      <small> — Main image auto-fills sub-images if sub-images not uploaded</small>
                    </label>

                    {/* Main drop zone */}
                    <div
                      className={`ap-image-drop ${isDragOver ? "dragover" : ""}`}
                      id="ap-image-drop"
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                    >
                      <input
                        type="file"
                        id="prod-image"
                        name="prod-image"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={(e) => handleImageFile(e.target.files[0])}
                      />
                      {!currentImageDataUrl ? (
                        <div className="ap-image-drop__placeholder" id="image-placeholder">
                          <i className="fa-solid fa-image"></i>
                          <p>Main Image — Click or drag &amp; drop</p>
                          <span>PNG, JPG, WEBP — max 5 MB</span>
                        </div>
                      ) : (
                        <img
                          className="ap-image-drop__preview visible"
                          id="image-preview"
                          src={currentImageDataUrl}
                          alt="Preview"
                        />
                      )}
                    </div>

                    {/* Sub-images row */}
                    <div className="ap-sub-images">
                      {subImages.map((si, idx) => (
                        <div key={idx} className="ap-sub-image-slot">
                          <input
                            type="file"
                            id={`prod-sub-image-${idx}`}
                            accept="image/*"
                            ref={subFileInputRefs[idx]}
                            style={{ display: "none" }}
                            onChange={(e) => handleSubImageFile(e.target.files[0], idx)}
                          />
                          <div
                            className="ap-sub-image-slot__drop"
                            onClick={() => subFileInputRefs[idx].current && subFileInputRefs[idx].current.click()}
                            title={`Click to upload Sub-image ${idx + 1}`}
                          >
                            {si ? (
                              <img src={si} alt={`Sub ${idx + 1}`} />
                            ) : currentImageDataUrl ? (
                              <img
                                src={currentImageDataUrl}
                                alt={`Sub ${idx + 1} (from main)`}
                                style={{ opacity: 0.45 }}
                              />
                            ) : (
                              <>
                                <i className="fa-solid fa-plus"></i>
                                <span>Sub {idx + 1}</span>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Title */}
                  <div className="ap-form-group">
                    <label className="ap-label" htmlFor="prod-title">
                      Product Title <span className="req">*</span>
                    </label>
                    <input
                      className="ap-input"
                      type="text"
                      id="prod-title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="e.g. Premium Blended Wear Stitched Suit"
                      required
                    />
                  </div>

                  {/* Category */}
                  <div className="ap-form-group">
                    <label className="ap-label" htmlFor="prod-category">
                      Category <span className="req">*</span>
                    </label>
                    <select
                      className="ap-input ap-select"
                      id="prod-category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="" disabled>Select category</option>
                      <option value="MENSWEAR">MENSWEAR</option>
                      <option value="WOMENSWEAR">WOMENSWEAR</option>
                      <option value="KIDSWEAR">KIDSWEAR</option>
                      <option value="NEW-ARRIVAL">NEW-ARRIVAL</option>
                      <option value="COLLECTION">COLLECTION</option>
                    </select>
                  </div>

                  {/* Sub-Category — conditional on category */}
                  {showSubCategory && (
                    <div className="ap-form-group">
                      <label className="ap-label" htmlFor="prod-sub-category">
                        {formData.category === "MENSWEAR" || formData.category === "WOMENSWEAR"
                          ? "Style Type"
                          : formData.category === "KIDSWEAR"
                          ? "Gender"
                          : "Season"}
                      </label>
                      <select
                        className="ap-input ap-select"
                        id="prod-sub-category"
                        name="subCategory"
                        value={formData.subCategory}
                        onChange={handleInputChange}
                      >
                        <option value="">Select option</option>
                        {subCategoryOptions.map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Show on Page */}
                  <div className="ap-form-group">
                    <label className="ap-label" htmlFor="prod-page">
                      Show on Page <span className="req">*</span>
                    </label>
                    <select
                      className="ap-input ap-select"
                      id="prod-page"
                      name="page"
                      value={formData.page}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="" disabled>Select page</option>
                      <option value="home">Home</option>
                      <option value="men">Men's Wear</option>
                      <option value="women">Women's Wear</option>
                      <option value="kids">Kids</option>
                      <option value="new-arrival">New Arrival</option>
                      <option value="collections">Collections</option>
                    </select>
                  </div>

                  {/* Prices */}
                  <div className="ap-form-group">
                    <label className="ap-label" htmlFor="prod-price">
                      Current Price <span className="req">*</span>
                    </label>
                    <input
                      className="ap-input"
                      type="text"
                      id="prod-price"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="e.g. $39.99"
                      required
                    />
                  </div>

                  <div className="ap-form-group">
                    <label className="ap-label" htmlFor="prod-original">
                      Original Price
                    </label>
                    <input
                      className="ap-input"
                      type="text"
                      id="prod-original"
                      name="originalPrice"
                      value={formData.originalPrice}
                      onChange={handleInputChange}
                      placeholder="e.g. $79.99"
                    />
                  </div>

                  {/* SKU & Barcode */}
                  <div className="ap-form-group">
                    <label className="ap-label" htmlFor="prod-sku">SKU</label>
                    <input
                      className="ap-input"
                      type="text"
                      id="prod-sku"
                      name="sku"
                      value={formData.sku}
                      onChange={handleInputChange}
                      placeholder="e.g. 155740"
                    />
                  </div>

                  <div className="ap-form-group">
                    <label className="ap-label" htmlFor="prod-barcode">Barcode</label>
                    <input
                      className="ap-input"
                      type="text"
                      id="prod-barcode"
                      name="barcode"
                      value={formData.barcode}
                      onChange={handleInputChange}
                      placeholder="e.g. MSBS-191"
                    />
                  </div>

                  {/* Availability */}
                  <div className="ap-form-group">
                    <label className="ap-label" htmlFor="prod-availability">Availability</label>
                    <select
                      className="ap-input ap-select"
                      id="prod-availability"
                      name="availability"
                      value={formData.availability}
                      onChange={handleInputChange}
                    >
                      <option value="In Stock">In Stock</option>
                      <option value="Out of Stock">Out of Stock</option>
                    </select>
                  </div>

                  {/* Description fields */}
                  <div className="ap-form-group ap-form-group--full">
                    <label className="ap-label" htmlFor="prod-desc-design">
                      Description — Design
                    </label>
                    <input
                      className="ap-input"
                      type="text"
                      id="prod-desc-design"
                      name="descDesign"
                      value={formData.descDesign}
                      onChange={handleInputChange}
                      placeholder="e.g. MS-163 (P28-26431-P02A 2Pcs) S+T"
                    />
                  </div>

                  <div className="ap-form-group">
                    <label className="ap-label" htmlFor="prod-desc-color">
                      Description — Color
                    </label>
                    <input
                      className="ap-input"
                      type="text"
                      id="prod-desc-color"
                      name="descColor"
                      value={formData.descColor}
                      onChange={handleInputChange}
                      placeholder="e.g. Charcoal Grey"
                    />
                  </div>

                  <div className="ap-form-group">
                    <label className="ap-label" htmlFor="prod-desc-fabric">
                      Description — Fabric
                    </label>
                    <input
                      className="ap-input"
                      type="text"
                      id="prod-desc-fabric"
                      name="descFabric"
                      value={formData.descFabric}
                      onChange={handleInputChange}
                      placeholder="e.g. Super Soft Blended (Wash N Wear)"
                    />
                  </div>

                  {/* Product Detail — single textarea, max 100 chars */}
                  <div className="ap-form-group ap-form-group--full">
                    <label className="ap-label" htmlFor="prod-product-detail">
                      Product Detail <small>(max 100 characters)</small>
                    </label>
                    <textarea
                      className="ap-input ap-textarea"
                      id="prod-product-detail"
                      name="productDetail"
                      rows="3"
                      maxLength={100}
                      value={formData.productDetail}
                      onChange={handleInputChange}
                      placeholder="Brief product detail (max 100 characters)..."
                    ></textarea>
                    <span className="ap-char-count">
                      {formData.productDetail.length}/100
                    </span>
                  </div>

                  {/* Disclaimer */}
                  <div className="ap-form-group ap-form-group--full">
                    <label className="ap-label" htmlFor="prod-disclaimer">Disclaimer</label>
                    <input
                      className="ap-input"
                      type="text"
                      id="prod-disclaimer"
                      name="disclaimer"
                      value={formData.disclaimer}
                      onChange={handleInputChange}
                      placeholder="e.g. The colors shown in the picture will be slightly different in real."
                    />
                  </div>

                  {/* Color swatches */}
                  <div className="ap-form-group ap-form-group--full">
                    <label className="ap-label" htmlFor="prod-colors">
                      Color Swatches
                      <small>(comma-separated hex codes, e.g. #6b7280, #111111)</small>
                    </label>
                    <input
                      className="ap-input"
                      type="text"
                      id="prod-colors"
                      name="colors"
                      value={formData.colors}
                      onChange={handleInputChange}
                      placeholder="#6b7280, #111111"
                    />
                  </div>

                  {/* Sizes */}
                  <div className="ap-form-group ap-form-group--full">
                    <label className="ap-label" htmlFor="prod-sizes">
                      Sizes <small>(comma-separated, e.g. S, M, L, XL)</small>
                    </label>
                    <input
                      className="ap-input"
                      type="text"
                      id="prod-sizes"
                      name="sizes"
                      value={formData.sizes}
                      onChange={handleInputChange}
                      placeholder="S, M, L, XL"
                    />
                  </div>

                  {/* Fabrics */}
                  <div className="ap-form-group ap-form-group--full">
                    <label className="ap-label" htmlFor="prod-fabrics">
                      Fabrics <small>(comma-separated, e.g. Wash N Wear, Lawn)</small>
                    </label>
                    <input
                      className="ap-input"
                      type="text"
                      id="prod-fabrics"
                      name="fabrics"
                      value={formData.fabrics}
                      onChange={handleInputChange}
                      placeholder="Wash N Wear"
                    />
                  </div>

                  {/* Submit buttons */}
                  <div className="ap-form-actions">
                    <button
                      className="ap-btn ap-btn--secondary"
                      type="button"
                      id="reset-form-btn"
                      onClick={handleFormReset}
                    >
                      <i className="fa-solid fa-rotate-left"></i> Reset
                    </button>
                    <button
                      className="ap-btn ap-btn--primary"
                      type="submit"
                      id="upload-btn"
                    >
                      <i className="fa-solid fa-cloud-arrow-up"></i> Upload Product
                    </button>
                  </div>

                  {/* Validation message */}
                  {formMsg.text && (
                    <p className={`ap-form-msg ${formMsg.isError ? "error" : "success"}`} id="form-msg">
                      {formMsg.text}
                    </p>
                  )}
                </form>
              </div>
            </section>
          )}

          {/* ── SECTION: All Products ── */}
          {activeSection === "products" && (
            <section className="ap-section active" id="sec-products">
              <div className="ap-section__header">
                <h2>
                  <i className="fa-solid fa-box-open"></i> All Products
                </h2>
                {/* Filter bar */}
                <div className="ap-filter-bar">
                  <select
                    className="ap-input ap-select ap-filter-bar__select"
                    id="filter-page"
                    value={filterPage}
                    onChange={(e) => setFilterPage(e.target.value)}
                  >
                    <option value="all">All Pages</option>
                    <option value="home">Home</option>
                    <option value="men">Men's Wear</option>
                    <option value="women">Women's Wear</option>
                    <option value="kids">Kids</option>
                    <option value="new-arrival">New Arrival</option>
                    <option value="collections">Collections</option>
                  </select>
                  <select
                    className="ap-input ap-select ap-filter-bar__select"
                    id="filter-category"
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                  >
                    <option value="all">All Categories</option>
                    <option value="MENSWEAR">MENSWEAR</option>
                    <option value="WOMENSWEAR">WOMENSWEAR</option>
                    <option value="KIDSWEAR">KIDSWEAR</option>
                    <option value="NEW-ARRIVAL">NEW-ARRIVAL</option>
                    <option value="COLLECTION">COLLECTION</option>
                  </select>
                </div>
              </div>

              {/* Products grid preview */}
              <div className="ap-products-grid" id="ap-products-grid">
                {filteredProducts.length === 0 ? (
                  <p className="ap-empty-msg" id="ap-empty-msg" style={{ display: "block" }}>
                    No products uploaded yet.
                  </p>
                ) : (
                  filteredProducts.map((p) => (
                    <div
                      className="ap-prod-card"
                      key={p.id}
                      id={p.id}
                      onClick={() => openProductPage(p.id)}
                    >
                      <div className="ap-prod-card__img-wrap">
                        <span className="ap-prod-card__id-badge">{p.id}</span>
                        {p.imageDataUrl ? (
                          <img src={p.imageDataUrl} alt={p.title} />
                        ) : (
                          <div className="ap-prod-card__no-img">
                            <i className="fa-solid fa-image"></i>
                          </div>
                        )}
                      </div>

                      <div className="ap-prod-card__body">
                        <p className="ap-prod-card__title" title={p.title}>
                          {p.title}
                        </p>
                        <div className="ap-prod-card__meta">
                          <span className="ap-prod-card__price">{p.price}</span>
                          <span className="ap-prod-card__page">
                            {p.page ? p.page.charAt(0).toUpperCase() + p.page.slice(1) : ""}
                          </span>
                        </div>
                        <span className={`ap-pill ${pillClass(p.category)}`}>
                          {p.category}
                        </span>
                      </div>

                      <div className="ap-prod-card__actions">
                        <button
                          className="ap-prod-card__btn ap-prod-card__btn--view"
                          onClick={(e) => {
                            e.stopPropagation();
                            openProductPage(p.id);
                          }}
                        >
                          <i className="fa-solid fa-eye"></i> View
                        </button>
                        <button
                          className="ap-prod-card__btn ap-prod-card__btn--del"
                          onClick={(e) => {
                            e.stopPropagation();
                            openDeleteModal(p.id);
                          }}
                        >
                          <i className="fa-solid fa-trash-can"></i> Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          )}
        </main>
      </div>

      {/* Toast notification */}
      <div
        className={`ap-toast ${toast.show ? "show" : ""}`}
        id="ap-toast"
        style={{ background: toast.isError ? "#dc2626" : "#111111" }}
      >
        <i className="fa-solid fa-circle-check"></i>
        <span id="ap-toast-msg">{toast.message}</span>
      </div>

      {/* Delete confirm modal */}
      {deleteModal.isOpen && (
        <div
          className="ap-modal-overlay open"
          id="ap-modal-overlay"
          onClick={(e) => {
            if (e.target.id === "ap-modal-overlay") closeDeleteModal();
          }}
        >
          <div className="ap-modal">
            <h3>
              <i className="fa-solid fa-triangle-exclamation"></i> Delete Product
            </h3>
            <p>
              Are you sure you want to delete this product? This action cannot be
              undone.
            </p>
            <div className="ap-modal__actions">
              <button
                className="ap-btn ap-btn--secondary"
                id="modal-cancel"
                onClick={closeDeleteModal}
              >
                Cancel
              </button>
              <button
                className="ap-btn ap-btn--danger"
                id="modal-confirm"
                onClick={confirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
