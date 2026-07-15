let emptyCart = document.getElementById("empty-cart");
let carts = document.getElementById("cart");

let register = false;
if (!register) {
  emptyCart.remove();
} else {
  carts.remove();
}

// Logic for Navigation Menu to show which has taken from my old/previous project "My Portfolio Project":
const menu = document.querySelector(".menu");
const overlay = document.querySelector(".overlay");

function toggleMenu() {
  menu.classList.toggle("active");
  // console.log(menu);
  overlay.classList.toggle("active");
  
  document.body.classList.toggle("no-scroll");
}

// Logic for menu nav links' dropdown menu which is written by me:
let linkContainers = document.querySelectorAll(".link-container")
let dropdownMenus = document.querySelectorAll(".dropdown-menu")
let arrows = document.querySelectorAll(".arrow")

linkContainers.forEach((link, index) => {
  link.addEventListener('click', () => {
   dropdownMenus[index].classList.toggle("show")
    arrows[index].classList.toggle("show")
  })
})
