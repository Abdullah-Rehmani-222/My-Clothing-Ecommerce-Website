import React, { useState } from "react";
import { Link } from "react-router-dom";
import DropdownTrigger from "./DropdownMenu.jsx";

const Sidebar = ({ isOpen, toggleMenu }) => {
  const [activeDropdown, setActiveDropdown] = useState(null);

  const toggleDropdown = (name) => {
    setActiveDropdown((prev) => (prev === name ? null : name));
  };

  return (
    <>
      <div className={`overlay ${isOpen ? "active" : ""}`} onClick={toggleMenu}></div>

      <div className={`menu ${isOpen ? "active" : ""}`}>
        <div className="menu-logo-container">
          <span className="menu-logo">Menu</span>
          <button className="close-icon" onClick={toggleMenu}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div className="menu-nav">
          {/* Home Nav Link */}
          <Link to="/" className="dropdown-trigger" onClick={toggleMenu}>
            <div className="link-container">
              <span className="link-title-wrap">
                <i className="fa-solid fa-house sidebar-cat-icon"></i>
                <span>Home</span>
              </span>
            </div>
          </Link>

          {/* New Arrivals */}
          <DropdownTrigger
            icon="fa-solid fa-fire"
            linkName={"New Arrivals"}
            linkPath={"new-arrivals"}
            categoryA={"Men"}
            categoryAIcon={"fa-solid fa-person"}
            categoryB={"Women"}
            categoryBIcon={"fa-solid fa-person-dress"}
            categoryC={"Kids"}
            categoryCIcon={"fa-solid fa-child"}
            trigger={() => toggleDropdown("New Arrivals")}
            isDropdown={activeDropdown === "New Arrivals"}
            toggleMenu={toggleMenu}
          />

          {/* Men */}
          <DropdownTrigger
            icon="fa-solid fa-person"
            linkName={"Men"}
            linkPath={"men"}
            categoryA={"Stitched"}
            categoryAIcon={"fa-solid fa-shirt"}
            categoryB={"Unstitched"}
            categoryBIcon={"fa-solid fa-scissors"}
            trigger={() => toggleDropdown("Men")}
            isDropdown={activeDropdown === "Men"}
            toggleMenu={toggleMenu}
          />

          {/* Women */}
          <DropdownTrigger
            icon="fa-solid fa-person-dress"
            linkName={"Women"}
            linkPath={"women"}
            categoryA={"Stitched"}
            categoryAIcon={"fa-solid fa-vest"}
            categoryB={"Unstitched"}
            categoryBIcon={"fa-solid fa-scroll"}
            trigger={() => toggleDropdown("Women")}
            isDropdown={activeDropdown === "Women"}
            toggleMenu={toggleMenu}
          />

          {/* Kids */}
          <DropdownTrigger
            icon="fa-solid fa-child"
            linkName={"Kids"}
            linkPath={"kids"}
            categoryA={"Boy"}
            categoryAIcon={"fa-solid fa-child-reaching"}
            categoryB={"Girl"}
            categoryBIcon={"fa-solid fa-child-dress"}
            trigger={() => toggleDropdown("Kids")}
            isDropdown={activeDropdown === "Kids"}
            toggleMenu={toggleMenu}
          />

          {/* Collections */}
          <DropdownTrigger
            icon="fa-solid fa-layer-group"
            linkName={"Collections"}
            linkPath={"collections"}
            categoryA={"Summer"}
            categoryAIcon={"fa-solid fa-sun"}
            categoryB={"Winter"}
            categoryBIcon={"fa-solid fa-snowflake"}
            trigger={() => toggleDropdown("Collections")}
            isDropdown={activeDropdown === "Collections"}
            toggleMenu={toggleMenu}
          />
        </div>

        <div className="social-links-container">
          <Link to="/" className="link" onClick={toggleMenu}>
            <i className="fa-solid fa-circle-user"></i> <span>Sign In</span>
          </Link>
          <Link to="" className="link">
            <i className="fa-brands fa-facebook"></i> <span>Facebook</span>
          </Link>
          <Link to="" className="link">
            <i className="fa-solid fa-phone"></i> <span>Contact Us</span>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
