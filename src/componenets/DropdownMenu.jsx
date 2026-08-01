import React from 'react'
import { Link } from 'react-router-dom'

const DropdownMenu = ({linkName, categoryA, categoryB, categoryC, trigger, isDropdown }) => {
  return (
    <>
    <div  className="dropdown-trigger">
            <div className="link-container" onClick={trigger}>
              <span> {linkName} </span>{" "}
              <i className={`fa-solid fa-angle-right arrow ${isDropdown ? "show" : ""}`}></i>
            </div>
            <div className={`dropdown-menu ${isDropdown ? "show" : ""}`}>
              {categoryA && <Link to="#">{categoryA}</Link>}
              {categoryB && <Link to="#">{categoryB}</Link>}
              {categoryC && <Link to="#">{categoryC}</Link>}
            </div>
          </div>
    </>
  )
}

export default DropdownMenu