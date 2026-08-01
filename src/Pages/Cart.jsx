import React, { useState } from "react";
import "../Cart.css";
import Navbar from "../componenets/Navbar.jsx";
import Sidebar from "../componenets/Sidebar.jsx";
import CartItem from "../componenets/CartItem.jsx";
import Footer from "../componenets/Footer.jsx";
import { Link } from "react-router-dom";
import Toast from "../componenets/ToastNotification.jsx";

const Cart = ({
  count,
  isCount,
  isMenuOpen,
  toggleMenu,
  toastOn,
  toastClose,
  isToast,
  toastMessage,
  cartItems,
  removeFromCart,
}) => {

  // ── Handle remove: fire toast, then remove from state ─────────────────
  const handleRemove = (index) => {
    removeFromCart(index);
    if (toastOn) toastOn("Product removed from cart!");
  };

  // ── Compute order summary from current cartItems ──────────────────────
  // NOTE: qty is owned by each CartItem's local state — for Order Summary
  // we use base price × 1 per entry; a more advanced version would lift qty.
  const subtotal = cartItems.reduce((sum, item) => {
    const p = parseFloat((item?.price || "$0").replace(/[^0-9.]/g, "")) || 0;
    return sum + p;
  }, 0);

  const isEmpty = cartItems.length === 0;

  return (
    <>
      <Navbar toggleMenu={toggleMenu} count={count} isCount={isCount} />
      <Sidebar isOpen={isMenuOpen} toggleMenu={toggleMenu} />

      {isEmpty ? (
        /* ── Empty cart UI ─────────────────────────────────────────── */
        <section id="empty-cart" className="empty-cart-section">
          <div className="empty-cart-container">
            <div className="cart-icon">
              <i className="fa-solid fa-cart-shopping"></i>
              <span className="eye-01"></span>
              <span className="eye-02"></span>
              <span className="mouth"></span>
            </div>

            <div className="empty-cart-message">
              <h2>Your cart is empty!</h2>
              <p>
                Have an account?{" "}
                <Link to="/" id="login-link">
                  Log in
                </Link>{" "}
                to check out faster.
              </p>
              <Link to="/" id="register-link">
                Continue Shopping
              </Link>
            </div>
          </div>
        </section>
      ) : (
        /* ── Cart with items ───────────────────────────────────────── */
        <div className="cart-page-container">
          <section id="cart" className="cart-section">
            <div className="cart-container">
              <h1>My Cart</h1>

              {/* Column headers */}
              <div className="items-detail">
                <p>Product</p>
                {/* <div className="sub-detail">
                  <p>Quantity</p>
                </div> */}
                <div className="sub-detail-02">
                  <p>Total</p>
                </div>
              </div>

              {/* Cart item list */}
              <div className="cart-items">
                {cartItems.length > 0 ? (
                  cartItems.map((item, index) => (
                    <CartItem
                      key={`${item.id}-${index}`}
                      item={item}
                      index={index}
                      removeFromCart={handleRemove}
                    />
                  ))
                ) : (
                  <p className="message">Items not added yet.</p>
                )}
              </div>
            </div>
          </section>

          {/* ── Order Summary sidebar ─────────────────────────────────── */}
          <section className="order-summary-container">
            <h3 className="order-summary-title">Order Summary</h3>
            <p className="order-summary-para">
              Your order is eligible for free delivery.
            </p>

            <div className="pricing-container">
              <div className="subtotal-container">
                <p>Subtotal</p>
                <span className="subtotal-amount">${subtotal.toFixed(2)}</span>
              </div>
              <div className="savings">
                <p>You Saved</p>
                <span className="savings-amount">$0.00</span>
              </div>
              <div className="shipping">
                <p>Shipping</p>
                <span className="shipping-amount">Free</span>
              </div>
            </div>

            <div className="total-container">
              <h3>Total</h3>
              <span className="total-amount">${subtotal.toFixed(2)}</span>
            </div>

            <button className="checkout-button">Proceed to Checkout</button>
          </section>
        </div>
      )}

      <Footer />
      <Toast
        isActive={isToast}
        close={toastClose}
        message={toastMessage || "Product removed from cart!"}
      />
    </>
  );
};

export default Cart;
