import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Navbar from '../componenets/Navbar'
import Footer from '../componenets/Footer'
import Toast from '../componenets/ToastNotification'
import "../Product.css"
import mensImg1 from "../assets/mens-wear_image_01.png";
import mensImg2 from "../assets/mens-wear_image_02.png";
import womensImg1 from "../assets/women-wear_image_01.png";
import womensImg2 from "../assets/women-wear_image_02.png";

const defaultFallbackProducts = [
  {
    id: "1",
    title: "Classic White Formal Suit",
    category: "MENSWEAR",
    price: "$59.99",
    originalPrice: "$99.99",
    sku: "MN-001",
    barcode: "123456789",
    availability: "In Stock",
    descDesign: "Classic Formal",
    descColor: "White & Black",
    descFabric: "Premium Wool Blend",
    productDetail: "Crafted from premium wool blend fabric for a timeless formal look.",
    disclaimer: "Color may slightly vary due to photography lighting.",
    colors: "#ffffff,#000000,#808080",
    sizes: "S,M,L,XL,XXL",
    fabrics: "Wool Blend,Polyester",
    image: mensImg1,
    subImages: [mensImg1, mensImg1, mensImg1, mensImg1],
  },
  {
    id: "2",
    title: "Navy Blue Business Suit",
    category: "MENSWEAR",
    price: "$69.99",
    originalPrice: "$119.99",
    sku: "MN-002",
    barcode: "987654321",
    availability: "In Stock",
    descDesign: "Business Formal",
    descColor: "Navy Blue",
    descFabric: "Italian Linen",
    productDetail: "Italian linen weave that breathes well and retains shape throughout the day.",
    disclaimer: "Slight color variation possible.",
    colors: "#1a237e,#37474f,#000000",
    sizes: "M,L,XL",
    fabrics: "Italian Linen,Cotton",
    image: mensImg2,
    subImages: [mensImg2, mensImg2, mensImg2, mensImg2],
  },
  {
    id: "101",
    title: "Ivory Knitwear Dress",
    category: "WOMENSWEAR",
    price: "$49.99",
    originalPrice: "$89.99",
    sku: "WN-001",
    barcode: "111222333",
    availability: "In Stock",
    descDesign: "Knit Dress",
    descColor: "Ivory",
    descFabric: "Soft Knit",
    productDetail: "A cozy ivory knit dress perfect for cool evenings and casual outings.",
    disclaimer: "Model is wearing size S.",
    colors: "#fffff0,#f5f5dc,#d3d3d3",
    sizes: "XS,S,M,L",
    fabrics: "Soft Knit,Acrylic Blend",
    image: womensImg1,
    subImages: [womensImg1, womensImg1, womensImg1, womensImg1],
  },
  {
    id: "102",
    title: "Summer Floral Maxi Dress",
    category: "WOMENSWEAR",
    price: "$39.99",
    originalPrice: "$69.99",
    sku: "WN-002",
    barcode: "444555666",
    availability: "In Stock",
    descDesign: "Floral Maxi",
    descColor: "Multicolor",
    descFabric: "Chiffon",
    productDetail: "Light chiffon summer maxi dress with vibrant floral print — ideal for beach days.",
    disclaimer: "Colors may vary on screen.",
    colors: "#ff6b6b,#ffd93d,#6bcb77",
    sizes: "XS,S,M,L,XL",
    fabrics: "Chiffon,Silk Blend",
    image: womensImg2,
    subImages: [womensImg2, womensImg2, womensImg2, womensImg2],
  },
];

const ProductDetail = ({ count, isCount, toggleMenu, NavName, toastOn, toastClose, isToast, addToCart }) => {
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const queryId = searchParams.get("id")

  // Resolve product state from location state or query parameter lookup
  const [product, setProduct] = useState(() => {
    if (location.state?.product) return location.state.product;
    if (queryId) {
      const stored = (() => {
        try { return JSON.parse(localStorage.getItem("sr_products")) || []; } catch { return []; }
      })();
      const all = [...stored, ...defaultFallbackProducts];
      return all.find((p) => String(p.id) === String(queryId)) || null;
    }
    return null;
  });

  useEffect(() => {
    if (location.state?.product) {
      setProduct(location.state.product);
    } else if (queryId) {
      const stored = (() => {
        try { return JSON.parse(localStorage.getItem("sr_products")) || []; } catch { return []; }
      })();
      const all = [...stored, ...defaultFallbackProducts];
      const found = all.find((p) => String(p.id) === String(queryId));
      if (found) setProduct(found);
    }
  }, [location.state, location.search, queryId]);

  // ── Build image list from product data ──
  // Prefer subImages (new schema), then legacy images, then fallback to main image
  const rawImages = product?.subImages?.length
    ? product.subImages
    : product?.images?.length
    ? product.images
    : [
        product?.imageDataUrl || product?.image || '',
        product?.imageDataUrl || product?.image || '',
        product?.imageDataUrl || product?.image || '',
        product?.imageDataUrl || product?.image || '',
      ]

  const finalImages = rawImages.filter(Boolean).length > 0
    ? rawImages.filter(Boolean)
    : ['../src/assets/mens-wear_image_01.png']

  // ── Build selectable options from product data ──
  const colorList = product?.colors
    ? product.colors.split(',').map((c) => c.trim()).filter(Boolean)
    : ['#e63946']

  const sizeList = product?.sizes
    ? product.sizes.split(',').map((s) => s.trim()).filter(Boolean)
    : ['S', 'M', 'L', 'XL']

  const fabricList = product?.fabrics
    ? product.fabrics.split(',').map((f) => f.trim()).filter(Boolean)
    : ['Cotton']

  // ─────────────────────────────────────────────────────────────
  //  STATE
  // ─────────────────────────────────────────────────────────────

  // Gallery state
  const [currentImg, setCurrentImg] = useState(0)

  // Selections
  const [selectedColor, setSelectedColor] = useState(colorList[0] || '')
  const [selectedSize, setSelectedSize]   = useState(sizeList[0]  || '')
  const [selectedFabric, setSelectedFabric] = useState(fabricList[0] || '')

  // Quantity
  const [quantity, setQuantity] = useState(1)

  // Wishlist toggle
  const [wished, setWished] = useState(false)

  // Reset state whenever the product changes (new card clicked)
  useEffect(() => {
    setCurrentImg(0)
    setSelectedColor(colorList[0] || '')
    setSelectedSize(sizeList[0]   || '')
    setSelectedFabric(fabricList[0] || '')
    setQuantity(1)
    setWished(false)
  }, [product?.id])

  // ─────────────────────────────────────────────────────────────
  //  HANDLERS
  // ─────────────────────────────────────────────────────────────

  // ── Gallery ──────────────────────────────────────────────────
  const showImage = (index) => {
    const total = finalImages.length
    setCurrentImg((index + total) % total)
  }

  // ── Quantity stepper ─────────────────────────────────────────
  const decreaseQty = () => setQuantity((q) => (q > 1 ? q - 1 : 1))
  const increaseQty = () => setQuantity((q) => q + 1)

  // ── Wishlist ─────────────────────────────────────────────────
  const toggleWishlist = () => setWished((w) => !w)

  // ── Form submit (Add to Cart) ────────────────────────────────
  const handleSubmit = (e) => {
    e.preventDefault()

    // Show toast notification
    if (toastOn) toastOn('Product added to cart!')

    // Add to cart via App-level state
    if (addToCart) {
      addToCart({
        id:       product?.id    || Date.now(),
        title:    product?.title || 'StyleRush Item',
        price:    product?.price || '$0.00',
        image:    finalImages[currentImg] || '',
        category: product?.category || '',
        color:    selectedColor,
        size:     selectedSize,
        fabric:   selectedFabric,
        quantity: quantity,
      })
    }
  }

  // ─────────────────────────────────────────────────────────────
  //  RENDER
  // ─────────────────────────────────────────────────────────────
  return (
    <>
      <Navbar toggleMenu={toggleMenu} count={count} isCount={isCount} />

      {/* Product detail section */}
      <div id="pd-root">
        {/* ── 1. BREADCRUMB ── */}
        <nav className="pd-breadcrumb" aria-label="breadcrumb">
          <Link to={`/${NavName}`} className="pd-breadcrumb__link">{NavName || 'Home'}</Link>
          <i className="fa-solid fa-chevron-right pd-breadcrumb__sep"></i>
          <Link to="/" className="pd-breadcrumb__link">Product</Link>
          <i className="fa-solid fa-chevron-right pd-breadcrumb__sep"></i>
          <div className="pd-breadcrumb__nav-arrows">
            <button type="button" className="pd-bc-arrow" id="pd-bc-prev" aria-label="Previous product">
              <i className="fa-solid fa-chevron-left"></i>
            </button>
            <button type="button" className="pd-bc-arrow" id="pd-bc-grid" aria-label="Grid view">
              <i className="fa-solid fa-grid-2"></i>
            </button>
            <button type="button" className="pd-bc-arrow" id="pd-bc-next" aria-label="Next product">
              <i className="fa-solid fa-chevron-right"></i>
            </button>
          </div>
        </nav>

        {/* ── 2. MAIN SECTION ── */}
        <section className="pd-section">
          {/* ── 2a. GALLERY ── */}
          <div className="pd-gallery">
            {/* Thumbnail strip */}
            <div className="pd-thumbnails" id="pd-thumbnails">
              {finalImages.map((src, i) => (
                <div
                  key={i}
                  className={`pd-thumb${currentImg === i ? ' active' : ''}`}
                  data-index={i}
                  onClick={() => showImage(i)}
                  style={{ cursor: 'pointer' }}
                >
                  <img src={src} alt={`Thumbnail ${i + 1}`} />
                </div>
              ))}
            </div>

            {/* Main viewer */}
            <div className="pd-main-viewer">
              <button
                type="button"
                className="pd-gallery-arrow pd-gallery-arrow--prev"
                id="pd-img-prev"
                aria-label="Previous image"
                onClick={() => showImage(currentImg - 1)}
              >
                <i className="fa-solid fa-chevron-left"></i>
              </button>

              <div className="pd-main-image-wrap">
                <img
                  className="pd-main-image"
                  id="pd-main-image"
                  src={finalImages[currentImg]}
                  alt={product?.title || 'Product Image'}
                />
              </div>

              <button
                type="button"
                className="pd-gallery-arrow pd-gallery-arrow--next"
                id="pd-img-next"
                aria-label="Next image"
                onClick={() => showImage(currentImg + 1)}
              >
                <i className="fa-solid fa-chevron-right"></i>
              </button>
            </div>
          </div>

          {/* ── 2b. INFO PANEL FORM ── */}
          <form className="pd-info" id="pd-product-form" onSubmit={handleSubmit}>
            {/* Title & Price */}
            <h1 className="pd-title" id="pd-title">
              {product?.title || 'Product Title'}
            </h1>
            <div className="pd-price" id="pd-price">
              {product?.price || '$0.00'}
            </div>

            <hr className="pd-divider" />

            {/* Meta rows (SKU / Barcode / Availability) */}
            <div className="pd-meta">
              <div className="pd-meta__row">
                <span className="pd-meta__label">SKU:</span>
                <span className="pd-meta__value" id="pd-sku">{product?.sku || '-'}</span>
              </div>
              <div className="pd-meta__row">
                <span className="pd-meta__label">Barcode:</span>
                <span className="pd-meta__value" id="pd-barcode">{product?.barcode || '-'}</span>
              </div>
              <div className="pd-meta__row">
                <span className="pd-meta__label">Availability :</span>
                <span className="pd-meta__value" id="pd-availability">{product?.availability || '-'}</span>
              </div>
            </div>

            <hr className="pd-divider" />

            {/* Description block */}
            <div className="pd-description">
              <p className="pd-description__heading">DESCRIPTION:</p>
              <p className="pd-description__row">
                <strong>Design:</strong> <span id="pd-desc-design">{product?.descDesign || '-'}</span>
              </p>
              <p className="pd-description__row">
                <strong>Color:</strong> <span id="pd-desc-color">{product?.descColor || '-'}</span>
              </p>
              <p className="pd-description__row">
                <strong>Fabric:</strong> <span id="pd-desc-fabric">{product?.descFabric || '-'}</span>
              </p>
            </div>

            {/* Product detail */}
            {(product?.productDetail || product?.detailBody) && (
              <div className="pd-product-detail">
                <h3 className="pd-product-detail__heading" id="pd-detail-heading">
                  Product Details
                </h3>
                <p className="pd-product-detail__body" id="pd-detail-body">
                  {product?.productDetail || product?.detailBody || ''}
                </p>
                {product?.disclaimer && (
                  <p className="pd-disclaimer" id="pd-disclaimer">
                    {product.disclaimer}
                  </p>
                )}
              </div>
            )}

            <hr className="pd-divider" />

            {/* ── Color selector ── */}
            <div className="pd-selector">
              <p className="pd-selector__label">
                COLOR: <span className="pd-selector__selected" id="pd-selected-color">{selectedColor}</span>
              </p>
              <input type="hidden" name="color" id="pd-input-color" value={selectedColor} readOnly />
              <div className="pd-color-swatches" id="pd-color-swatches">
                {colorList.map((hex, i) => (
                  <button
                    key={i}
                    type="button"
                    className={`pd-swatch${selectedColor === hex ? ' active' : ''}`}
                    data-color={hex}
                    aria-label={hex}
                    style={{ background: hex }}
                    onClick={() => setSelectedColor(hex)}
                  />
                ))}
              </div>
            </div>

            {/* ── Size selector ── */}
            <div className="pd-selector">
              <p className="pd-selector__label">
                SIZE: <span className="pd-selector__selected" id="pd-selected-size">{selectedSize}</span>
              </p>
              <input type="hidden" name="size" id="pd-input-size" value={selectedSize} readOnly />
              <div className="pd-size-options" id="pd-size-options">
                {sizeList.map((size, i) => (
                  <button
                    key={i}
                    type="button"
                    className={`pd-size-btn${selectedSize === size ? ' active' : ''}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* ── Fabric selector ── */}
            <div className="pd-selector">
              <p className="pd-selector__label">
                FABRIC: <span className="pd-selector__selected" id="pd-selected-fabric">{selectedFabric}</span>
              </p>
              <input type="hidden" name="fabric" id="pd-input-fabric" value={selectedFabric} readOnly />
              <div className="pd-fabric-options" id="pd-fabric-options">
                {fabricList.map((fabric, i) => (
                  <button
                    key={i}
                    type="button"
                    className={`pd-fabric-btn${selectedFabric === fabric ? ' active' : ''}`}
                    onClick={() => setSelectedFabric(fabric)}
                  >
                    {fabric}
                  </button>
                ))}
              </div>
            </div>

            <hr className="pd-divider" />

            {/* ── Actions row (quantity + add-to-cart + wishlist) ── */}
            <div className="pd-actions">
              {/* Quantity Stepper */}
              <div className="pd-qty">
                <button
                  type="button"
                  className="pd-qty__btn"
                  id="pd-qty-minus"
                  aria-label="Decrease quantity"
                  onClick={decreaseQty}
                >
                  <i className="fa-solid fa-minus"></i>
                </button>
                <span className="pd-qty__value" id="pd-qty-value">{quantity}</span>
                <input type="hidden" name="quantity" id="pd-input-quantity" value={quantity} readOnly />
                <button
                  type="button"
                  className="pd-qty__btn"
                  id="pd-qty-plus"
                  aria-label="Increase quantity"
                  onClick={increaseQty}
                >
                  <i className="fa-solid fa-plus"></i>
                </button>
              </div>

              {/* Submit Buttons */}
              <button type="submit" className="pd-buy-now" id="pd-buy-now">Buy Now</button>
              <button type="submit" className="pd-add-to-cart" id="pd-add-to-cart">Add Cart</button>

              {/* Wishlist Button */}
              <button
                type="button"
                className="pd-wishlist"
                id="pd-wishlist"
                aria-label="Add to wishlist"
                onClick={toggleWishlist}
                style={{ color: wished ? '#e63946' : '' }}
              >
                <i className={wished ? 'fa-solid fa-heart' : 'fa-regular fa-heart'}></i>
              </button>
            </div>

            {/* Share icons */}
            <div className="pd-share">
              <a className="pd-share__icon" href="#" aria-label="Share on Facebook">
                <i className="fa-brands fa-facebook-f"></i>
              </a>
              <a className="pd-share__icon" href="#" aria-label="Share on X">
                <i className="fa-brands fa-x-twitter"></i>
              </a>
              <a className="pd-share__icon" href="#" aria-label="Share on WhatsApp">
                <i className="fa-brands fa-whatsapp"></i>
              </a>
            </div>
          </form>
        </section>
      </div>

      <Footer />

      {/* Toast Notification */}
      <Toast isActive={isToast} close={toastClose} message="Product added to cart!" />
    </>
  )
}

export default ProductDetail