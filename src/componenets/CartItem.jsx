import React, { useState } from "react";

const CartItem = ({ item, index, removeFromCart }) => {
  // ── Per-item quantity state ────────────────────────────────────────────
  const [qty, setQty] = useState(1);

  // Parse numeric price from strings like "$29.99"
  const numericPrice =
    parseFloat((item?.price || "$0.00").replace(/[^0-9.]/g, "")) || 0;

  const lineTotal = (numericPrice * qty).toFixed(2);

  const increase = () => setQty((q) => q + 1);
  const decrease = () => setQty((q) => (q > 1 ? q - 1 : 1));

  const handleRemove = () => {
    if (removeFromCart) removeFromCart(index);
  };

  return (
    <div className="cart-item">
      {/*
        Layout (all screens):
        ┌──────────────────────────────────────────┐
        │  [img]  title          │  $total          │
        │         category       │                  │
        │         $price         │                  │
        ├──────────────────────────────────────────┤
        │         [- qty +]  🗑  │                  │
        └──────────────────────────────────────────┘
      */}

      {/* ── ROW 1: product info + total ── */}
      <div className="ci-top-row">
        {/* Left: image + text details */}
        <div className="product-info">
          <div className="image-container">
            <img src={item?.image || ""} alt={item?.title || "product"} />
          </div>
          <div className="item-details">
            <p className="product-title">{item?.title || "Product"}</p>
            <span className="size">{item?.category || ""}</span>
            <span className="price">{item?.price || "$0.00"}</span>
          </div>
        </div>

        {/* Right: line total — always top-right */}
        <div className="sub-detail-02">
          <span className="total">${lineTotal}</span>
        </div>
      </div>

      {/* ── ROW 2: quantity stepper + remove (aligned under price) ── */}
      <div className="ci-bottom-row">
        {/* Spacer equal to image width so stepper aligns under the text */}
        <div className="ci-spacer" aria-hidden="true" />

        <div className="sub-detail">
          <div className="quantity-control">
            <button
              className="btn decrease-btn"
              onClick={decrease}
              aria-label="Decrease quantity"
            >
              -
            </button>
            <span className="quantity">{qty}</span>
            <button
              className="btn increase-btn"
              onClick={increase}
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>

          <button
            className="remove-btn"
            onClick={handleRemove}
            aria-label="Remove item"
          >
            <i className="fa-solid fa-trash-can"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
