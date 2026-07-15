// Logic for Navigation Menu to show which has taken from my old/previous project "My Portfolio Project":
const menu = document.querySelector(".menu");
const overlay = document.querySelector(".overlay");

function toggleMenu() {
  menu.classList.toggle("active");
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


// Toast Notification Functiionality when user click addtocart buttton:
let addToCartBtns = document.querySelectorAll(".add-to-cart-button");
let toastNotification = document.querySelector(".toast-notification");
let crossButton = document.querySelector(".cross");

addToCartBtns.forEach((button) => {
  button.addEventListener("click", () => {
    toastNotification.style.display = "flex";
    setTimeout(() => {
      toastNotification.style.display = "none";
    }, 3000);
  });
});

crossButton.addEventListener("click", () => {
  toastNotification.style.display = "none";
});

// Announcement Slider logic:
document.addEventListener("DOMContentLoaded", () => {
  const track = document.querySelector(".slider-track");
  const slides = document.querySelectorAll(".slide");
  let currentIndex = 0;

  function nextSlide() {
    currentIndex = (currentIndex + 1) % slides.length;
    // Shift track upward by 40px multiplied by the current index
    track.style.transform = `translateY(-${currentIndex * 40}px)`;
  }

  // Change slide every 4000ms (4 seconds)
  setInterval(nextSlide, 4000);
});
