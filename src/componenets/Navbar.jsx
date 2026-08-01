import React, { useState, useEffect } from "react";
import Logo from "../assets/my-logo_dark.png"
import { Link } from "react-router-dom";

const Navbar = ({ toggleMenu, count, isCount}) => {
  const slides = [
    "🚚 Free shipping on orders over $50!",
    "🎉 Use code FIRST10 for 10% off your first order!",
    "⏱️ Flash Sale! 20% off all summer items today only."
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [slides.length]);

  // This below line of code is written by me:
  const check = isCount ? 'active' : 'disactive';

  return (
    <>
      <div className="header-container">
        <div className="announcement-slider">
          <div className="slider-track" style={{ transform: `translateY(-${currentIndex * 40}px)` }}>
            {slides.map((slide, index) => (
              <div key={index} className="slide">
                {slide}
              </div>
            ))}
          </div>
        </div>

      <header>
        <nav>
          <div className="nav_01">
            <div className="logo">
              <img src={Logo} alt="" />
              <Link to="/">Style<span id="second_logo">Rush</span></Link>
            </div>
          </div>

          <div className="nav_02">
            <div className="search">
              <input
                type="text"
                id="search-bar"
                placeholder="Search for products..."
              />
              <button type="submit">
                <i className="fa-solid fa-magnifying-glass"></i>
              </button>
            </div>
          </div>

          <div className="nav_03">
            <div className="menu-bar menu-trigger" onClick={toggleMenu}>
              <i className="fa-solid fa-bars"></i>
            </div>

            <div className="cart">
              <Link to="/cart">
                <i className="fa-solid fa-cart-shopping"></i>
                <span className={`cart-counter ${check}`}>{count}</span>
              </Link>
            </div>

            <div className={`login ${check}`}>
              <Link to="/login">Login</Link>
            </div>

            <div className={`account ${check}`}>
              <Link to="/account">
                <i className="fa-solid fa-user"></i>
              </Link>
            </div>
          </div>
        </nav>
      </header>

      <div className="mobile-search-bar cart-search">
        <input
          type="text"
          id="search-bar"
          placeholder="Search for products..."
        />
        <button type="submit">
          <i className="fa-solid fa-magnifying-glass"></i>
        </button>
      </div>
    </div>   
    </>
  )
}

export default Navbar