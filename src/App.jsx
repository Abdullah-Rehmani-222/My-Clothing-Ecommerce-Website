import { Routes, Route, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import "./App.css";
import "./HomeCategories.css"

// ── Pages ──
import Home from "./Pages/Home.jsx";
import Cart from "./Pages/Cart.jsx";
import ProductDetail from "./Pages/ProductDetail.jsx";
import AdminPanel from "./Pages/AdminPanel.jsx";
import CategoryPageWrapper from "./Pages/CategoryPageWrapper.jsx";

// ─── Scroll to top helper on route change ────────────────────────────────
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

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
  const location = useLocation();
  const [cartItems, setCartItems] = useState(() => loadCart());

  useEffect(() => {
    saveCart(cartItems);
  }, [cartItems]);

  const count   = cartItems.length;
  const isCount = count > 0;

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

  const removeFromCart = (index) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index));
  };

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
      <ScrollToTop />
      <Routes location={location} key={location.pathname}>
        {/* ── Home ── */}
        <Route path="/" element={<Home {...commonProps} addToCart={addToCart} />} />

        {/* ── Cart ── */}
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

        {/* ── Product Detail ── */}
        <Route
          path="/product"
          element={
            <ProductDetail
              {...commonProps}
              NavName={""}
              addToCart={addToCart}
              setCount={() => {}}
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

        {/* ── Admin Panel ── */}
        <Route path="/admin" element={<AdminPanel />} />

        {/* ── Dynamic Category & Subcategory Route Template ── */}
        <Route
          path="/:category/:subcategory?"
          element={<CategoryPageWrapper {...commonProps} addToCart={addToCart} />}
        />
      </Routes>
    </>
  );
};

export default App;
