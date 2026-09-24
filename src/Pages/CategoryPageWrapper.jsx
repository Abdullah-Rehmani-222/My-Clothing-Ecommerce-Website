import React from "react";
import { useParams } from "react-router-dom";
import Navbar from "../componenets/Navbar.jsx";
import Sidebar from "../componenets/Sidebar.jsx";
import CategoryProductLayout from "../componenets/CategoryProductLayout.jsx";
import Footer from "../componenets/Footer.jsx";
import Toast from "../componenets/ToastNotification.jsx";

const CategoryPageWrapper = ({
  count,
  isCount,
  isMenuOpen,
  toggleMenu,
  toastOn,
  toastClose,
  isToast,
  toastMessage,
  addToCart,
}) => {
  const { category, subcategory } = useParams();

  // Construct pageKey dynamically from route parameters (e.g. "men-stitched" or "men")
  const cat = category ? category.toLowerCase().trim() : "men";
  const sub = subcategory ? subcategory.toLowerCase().trim() : "";
  const pageKey = sub ? `${cat}-${sub}` : cat;

  return (
    <>
      <Navbar toggleMenu={toggleMenu} count={count} isCount={isCount} />
      <Sidebar isOpen={isMenuOpen} toggleMenu={toggleMenu} />

      {/* Passing key={pageKey} forces a clean remount and state re-initialization on category change */}
      <CategoryProductLayout
        key={pageKey}
        pageKey={pageKey}
        toastOn={toastOn}
        addToCart={addToCart}
      />

      <Footer />
      <Toast
        isActive={isToast}
        close={toastClose}
        message={toastMessage || "Product added to cart!"}
      />
    </>
  );
};

export default CategoryPageWrapper;
