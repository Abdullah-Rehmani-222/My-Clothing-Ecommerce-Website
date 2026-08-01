import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import "./App.css";
import Home from "./Pages/Home.jsx";
import Cart from "./Pages/Cart.jsx";
import ProductDetail from "./Pages/ProductDetail.jsx";
import AdminPanel from "./Pages/AdminPanel.jsx";

// ─── Session-storage helpers ───────────────────────────────────────────────
const SESSION_KEY = "sr_cart";

function loadCart() {
  try {
    return JSON.parse(sessionStorage.getItem(SESSION_KEY)) || [];
  } catch {
    return [];
  }
}

function saveCart(items) {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(items));
}
// ───────────────────────────────────────────────────────────────────────────

const App = () => {
  // ── Cart state (source of truth) ──────────────────────────────────────
  const [cartItems, setCartItems] = useState(() => loadCart());

  // Keep sessionStorage in sync whenever cartItems changes
  useEffect(() => {
    saveCart(cartItems);
  }, [cartItems]);

  // Derived count for Navbar badge
  const count   = cartItems.length;
  const isCount = count > 0;

  // Add a product to the cart
  const addToCart = (product) => {
    setCartItems((prev) => {
      const updated = [
        ...prev,
        {
          id:       product?.id           || Date.now(),
          title:    product?.title        || "StyleRush Item",
          price:    product?.price        || "$0.00",
          image:    product?.imageDataUrl || product?.image || "",
          category: product?.category     || "",
        },
      ];
      return updated;
    });
  };

  // Remove a cart item by its index
  const removeFromCart = (index) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index));
  };

  // ── Menu ─────────────────────────────────────────────────────────────
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }
    return () => document.body.classList.remove("no-scroll");
  }, [isMenuOpen]);

  // ── Toast ─────────────────────────────────────────────────────────────
  const [isToast, setIsToast]         = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const toastOn = (msg = "Product added to cart!") => {
    setToastMessage(msg);
    setIsToast(true);
  };

  const toastClose = () => setIsToast(false);

  useEffect(() => {
    if (isToast) {
      const timer = setTimeout(() => setIsToast(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isToast]);

  /* ─────────────────────────────────────────────────────────────────────
     Admin panel product schema (unchanged)
  ───────────────────────────────────────────────────────────────────── */
  const product = {
    id: "",
    title: "",
    category: "",
    page: "",
    price: "",
    originalPrice: "",
    sku: "",
    barcode: "",
    availability: "",
    stockCount: "",
    descDesign: "",
    descColor: "",
    descFabric: "",
    detailHeading: "",
    detailBody: "",
    sub1Heading: "",
    sub1Body: "",
    sub2Heading: "",
    sub2Body: "",
    disclaimer: "",
    colors: "",
    sizes: "",
    fabrics: "",
    instBadge: "",
    instAmount: "",
    imageDataUrl: "",
    createdAt: 0,
  };

  // Shared props bundle to avoid repeating props on every route
  const commonProps = {
    count,
    isCount,
    isMenuOpen,
    toggleMenu,
    toastOn,
    toastClose,
    isToast,
    toastMessage,
  };

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <Home
              {...commonProps}
              addToCart={addToCart}
            />
          }
        />
        <Route
          path="/cart"
          element={
            <Cart
              {...commonProps}
              cartItems={cartItems}
              removeFromCart={removeFromCart}
            />
          }
        />
        <Route
          path="/product"
          element={
            <ProductDetail
              {...commonProps}
              NavName={""}
              addToCart={addToCart}
              setCount={() => {}} // kept for compatibility; count is derived
            />
          }
        />
        <Route
          path="/product/:id"
          element={
            <ProductDetail
              {...commonProps}
              NavName={""}
              addToCart={addToCart}
              setCount={() => {}}
            />
          }
        />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </>
  );
};

export default App;
