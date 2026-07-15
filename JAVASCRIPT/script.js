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

// Product Card's small images if clicked so big image shown as which image has been clicked:
document.querySelectorAll(".thumb-box").forEach((thumb) => {
  thumb.addEventListener("click", function () {
    // 1. Clear highlight out of all buttons
    document
      .querySelectorAll(".thumb-box")
      .forEach((b) => b.classList.remove("active"));

    // 2. Set highlight onto the active item
    this.classList.add("active");

    // 3. Swap main display photo destination source parameters
    const newSrc = this.querySelector("img").src;
    document.querySelector(".main-product-image").src = newSrc;
  });
});

// This heart button logic is written by me.
let heartButtons = document.querySelectorAll(".wishlist-btn");
heartButtons.forEach((heartButton) => {
  heartButton.addEventListener("click", () => {
    if (heartButton.innerHTML == `<i class="fa-solid fa-heart"></i>`) {
      heartButton.innerHTML = `<i class="fa-regular fa-heart"></i>`;
    } else {
      heartButton.innerHTML = `<i class="fa-solid fa-heart"></i>`;
    }
  });
});

// ColorPicker klogic is written by me.
let colorpicker = document.querySelectorAll(".color");
let allIds = Array.from(colorpicker).map((colour) => colour.id);
// console.log(allIds);
// console.log(colorpicker);
colorpicker.forEach((colour) => {
  colour.addEventListener("click", () => {
    // if (allIds.includes(colour.id) && colour.classList.contains("selected-color")) {
    // }
    colour.classList.toggle("selected-color");
  });
});

// View More and Show Less logic which is written by me.
let viewMoreBtns = document.querySelectorAll(".viewmore-btn");
let showLessBtns = document.querySelectorAll(".showless-btn");
let viewMensProducts = document.querySelectorAll(".view-mens-product");
let viewWomensProducts = document.querySelectorAll(".view-womens-product");

viewMoreBtns.forEach((viewMoreBtn, index) => {
  viewMoreBtn.addEventListener("click", () => {
    viewMoreBtn.style.display = "none";
    if (showLessBtns[index]) {
      showLessBtns[index].style.display = "block";
    }

    if (viewMoreBtns[index].id === "btn-01") {
      viewMensProducts.forEach((product) => {
        product.style.display = "block";
      });
    } else if (viewMoreBtns[index].id === "btn-03") {
      viewWomensProducts.forEach((product) => {
        product.style.display = "block";
      });
    }
  });
});

showLessBtns.forEach((showLessBtn, index) => {
  showLessBtn.addEventListener("click", () => {
    showLessBtn.style.display = "none";
    if (viewMoreBtns[index]) {
      viewMoreBtns[index].style.display = "block";
    }
    console.log(showLessBtns[index]);

    if (showLessBtns[index].id === "btn-02") {
      viewMensProducts.forEach((product) => {
        product.style.display = "none";
      });
    } else if (showLessBtns[index].id === "btn-04") {
      viewWomensProducts.forEach((product) => {
        product.style.display = "none";
      });
    }
  });
});

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
