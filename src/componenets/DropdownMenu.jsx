import React from "react";
import { Link, useNavigate } from "react-router-dom";

function getRoute(categoryName) {
  if (!categoryName) return "";
  return categoryName.toLowerCase().trim();
}

const DropdownMenu = ({
  icon,
  linkName,
  linkPath,
  categoryA,
  categoryAIcon,
  categoryB,
  categoryBIcon,
  categoryC,
  categoryCIcon,
  trigger,
  isDropdown,
  toggleMenu,
}) => {
  const navigate = useNavigate();

  const handleNav = (e, subCat) => {
    e.preventDefault();
    const route = `/${linkPath}/${getRoute(subCat)}`;
    if (toggleMenu) toggleMenu();
    navigate(route);
  };

  return (
    <div className="dropdown-trigger">
      {/* Main Link Container (Icon + Label on Left | Angle Arrow on Right) */}
      <div className="link-container" onClick={trigger}>
        <span className="link-title-wrap">
          {icon && <i className={`${icon} sidebar-cat-icon`}></i>}
          <span>{linkName}</span>
        </span>
        <i className={`fa-solid fa-angle-right arrow ${isDropdown ? "show" : ""}`}></i>
      </div>

      {/* Subcategory Links inside Dropdown */}
      <div className={`dropdown-menu ${isDropdown ? "show" : ""}`}>
        {categoryA && (
          <Link
            to={`/${linkPath}/${getRoute(categoryA)}`}
            onClick={(e) => handleNav(e, categoryA)}
          >
            <span className="subcat-link-content">
              {categoryAIcon && <i className={`${categoryAIcon} subcat-icon`}></i>}
              <span>{categoryA}</span>
            </span>
          </Link>
        )}
        {categoryB && (
          <Link
            to={`/${linkPath}/${getRoute(categoryB)}`}
            onClick={(e) => handleNav(e, categoryB)}
          >
            <span className="subcat-link-content">
              {categoryBIcon && <i className={`${categoryBIcon} subcat-icon`}></i>}
              <span>{categoryB}</span>
            </span>
          </Link>
        )}
        {categoryC && (
          <Link
            to={`/${linkPath}/${getRoute(categoryC)}`}
            onClick={(e) => handleNav(e, categoryC)}
          >
            <span className="subcat-link-content">
              {categoryCIcon && <i className={`${categoryCIcon} subcat-icon`}></i>}
              <span>{categoryC}</span>
            </span>
          </Link>
        )}
      </div>
    </div>
  );
};

export default DropdownMenu;