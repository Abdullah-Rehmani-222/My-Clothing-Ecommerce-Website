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
          <Link to="/" className="dropdown-trigger">
            {" "}
            <span> Home </span>{" "}
          </Link>
          <DropdownTrigger linkName={"New Arrivals"} categoryA={"Men"} categoryB={"Women"} categoryC={"Kids"} trigger={() => toggleDropdown("New Arrivals")} isDropdown={activeDropdown === "New Arrivals"}/>
          <DropdownTrigger linkName={"Men"} categoryA={"Stitched"} categoryB={"Unstitched"} categoryC={"Eastern"} trigger={() => toggleDropdown("Men")} isDropdown={activeDropdown === "Men"}/>
          <DropdownTrigger linkName={"Women"} categoryA={"Stitched"} categoryB={"Unstitched"} categoryC={"Eastern"} trigger={() => toggleDropdown("Women")} isDropdown={activeDropdown === "Women"}/>
          <DropdownTrigger linkName={"Kids"} categoryA={"Boy"} categoryB={"Girl"} trigger={() => toggleDropdown("Kids")} isDropdown={activeDropdown === "Kids"}/>
          <DropdownTrigger linkName={"Collections"} categoryA={"Summer"} categoryB={"Winter"} trigger={() => toggleDropdown("Collections")} isDropdown={activeDropdown === "Collections"}/>
        </div>

        <div className="social-links-container">
          <Link to="/" className="link">
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
