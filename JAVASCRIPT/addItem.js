//# Add to cart functionality:

// Getting elements from index.html and cart.html:
let addItemButtons = document.querySelectorAll(".add-to-cart-button");
let productImages = document.querySelectorAll(".main-product-image");
let productTitles = document.querySelectorAll(".product-title");
let productCategories = document.querySelectorAll(".product-category");
let prices = document.querySelectorAll(".current-price");

let cart = JSON.parse(localStorage.getItem("cart")) || [];
let count = cart.length;
let cartCounter = document.querySelector(".cart-counter");
let cartItemsContainer = document.querySelector(".cart-items");

if (cartCounter) {
  cartCounter.innerHTML = count;

  if (count > 0) {
    cartCounter.style.display = "block";
  } else {
    cartCounter.style.display = "none";
  }
}

// Add to Cart button logic:
addItemButtons.forEach((button, index) => {
  button.addEventListener("click", () => {
    button.innerHTML = "Added";
    addItemButtons[index].innerHTML = `${button.innerHTML}`;
    button.disabled = true;
    button.style.backgroundColor = "#1a233a7a";
    button.style.cursor = "default";
    count++;
    cartCounter.innerHTML = `${count}`;

    if (count > 0) {
      cartCounter.style.display = "block";
    }

    let product = {
      image: productImages[index]?.src,
      title: productTitles[index]?.textContent,
      category: productCategories[index]?.textContent,
      price: prices[index]?.textContent,
    };

    cart.push(product);
    localStorage.setItem("cart", JSON.stringify(cart));
  });
});

function loadCartItems() {
  let savedCart = JSON.parse(localStorage.getItem("cart")) || [];
  savedCart.forEach((item) => {
    createCartItem(item);
  });
}

// Creating cart-item UI using DOM Manipulation:
function createCartItem(item) {
  console.log("Item: ", item);

  // Creating Elements and adding class to them:
  let cartItem = document.createElement("div");
  cartItem.classList.add("cart-item");
  let productQuantityContainer = document.createElement("div");
  productQuantityContainer.classList.add("product-quantity-container");
  let productInfo = document.createElement("div");
  productInfo.classList.add("product-info");
  let imageContainer = document.createElement("div");
  imageContainer.classList.add("image-container");
  let image = document.createElement("img");
  let itemDetails = document.createElement("div");
  itemDetails.classList.add("item-details");
  let productDescription = document.createElement("p");
  productDescription.classList.add("product-description");
  let size = document.createElement("span");
  size.classList.add("size");
  let subDetail = document.createElement("div");
  subDetail.classList.add("sub-detail");
  let price = document.createElement("span");
  price.classList.add("price");
  let quantityControl = document.createElement("div");
  quantityControl.classList.add("quantity-control");
  let decreaseButton = document.createElement("button");
  decreaseButton.classList.add("btn", "decrease-btn");
  let quantity = document.createElement("span");
  quantity.classList.add("quantity");
  let increaseButton = document.createElement("button");
  increaseButton.classList.add("btn", "increase-btn");
  let subDetail_02 = document.createElement("div");
  subDetail_02.classList.add("sub-detail-02");
  let total = document.createElement("span");
  total.classList.add("total");
  let removeButton = document.createElement("button");
  removeButton.classList.add("remove-btn");

  let trashCan = document.createElement("i");
  trashCan.classList.add("fa-solid", "fa-trash-can");

  console.log(quantity.textContent);

  // Displaying data:
  decreaseButton.innerHTML = "-";
  quantity.textContent = 1;
  increaseButton.innerHTML = "+";

  image.src = item.image;

  productDescription.textContent = item.title;

  price.textContent = item.price;

  total.textContent = item.price;

  // Adding further Functionalities:

  // Category logic:
  if (item.category == "MENSWEAR") {
    size.textContent = "M";
  } else {
    size.textContent = "W";
  }

  // Appenchilding the element to eachother:
  cartItemsContainer.appendChild(cartItem);

  // ProductQuantityContainer Appendchild:
  cartItem.appendChild(productQuantityContainer);
  productQuantityContainer.appendChild(productInfo);
  productQuantityContainer.appendChild(subDetail);

  // ProductInfo Appendchild:
  productInfo.appendChild(imageContainer);
  imageContainer.appendChild(image);
  productInfo.appendChild(itemDetails);
  itemDetails.appendChild(productDescription);
  itemDetails.appendChild(size);
  itemDetails.appendChild(price);

  // SubDetail Appendchild:
  subDetail.appendChild(quantityControl);
  quantityControl.appendChild(decreaseButton);
  quantityControl.appendChild(quantity);
  quantityControl.appendChild(increaseButton);
  subDetail.appendChild(removeButton);
  removeButton.appendChild(trashCan);

  // SubDetail_02 Appendchild:
  cartItem.appendChild(subDetail_02);
  subDetail_02.appendChild(total);
}

// Checking cart is empty or not if yes so add a message:
let savedCart = JSON.parse(localStorage.getItem("cart")) || [];
if (savedCart.length === 0) {
  cartItemsContainer.innerHTML = `<p class="message">Items not added yet.</p>`;
} else {
  cartItemsContainer.innerHTML = "";
}

loadCartItems();

// --- REMOVE BUTTON FUNCTIONALITY ---
let cartItems = document.querySelectorAll(".cart-item");
let removeButtons = document.querySelectorAll(".remove-btn");
let toastNotifications = document.querySelector(".toast-notification");
// cartItems = Array.from(cartItems);

removeButtons.forEach((button, index) => {
  button.addEventListener("click", () => {
    cartItems[index].remove();
    count--;
    cartCounter.innerHTML = `${count}`;

    if (count == 0) {
      cartCounter.style.display = "none";
    }

    toastNotifications.style.display = "flex";
    setTimeout(() => {
      toastNotifications.style.display = "none";
    }, 2000);

    // count = cart.length;
    // 1. Get the latest array from localStorage
    let currentCart = JSON.parse(localStorage.getItem("cart")) || [];

    // 2. Remove the specific item by its index position
    currentCart.pop();

    // 3. Save the updated array back to localStorage
    localStorage.setItem("cart", JSON.stringify(currentCart));

    // Show empty cart message when last item removed
    if (currentCart.length === 0) {
      cartItemsContainer.innerHTML = `<p class="message">Items not added yet.</p>`;
    }
  });
});

// Total value increase as quantity increases:
let totals = document.querySelectorAll(".total");
let pricess = document.querySelectorAll(".price");
let quantities = document.querySelectorAll(".quantity");
let increaseButtons = document.querySelectorAll(".increase-btn");
let decreaseButtons = document.querySelectorAll(".decrease-btn");

// Count increase decrease Logic:
increaseButtons.forEach((button, index) => {
  let count = 1;
  let price = pricess[index].textContent;
  let newprice = Number(price.replace("$", ""));

  button.addEventListener("click", () => {
    count++;
    quantities[index].textContent = `${count}`;
    if (Number(quantities[index].textContent) > 1) {
      totals[index].textContent = `$${newprice * count}`;
    } else {
      quantities[index].textContent = `${count}`;
    }
  });
});

decreaseButtons.forEach((button, index) => {
  let count = 1;
  let price = pricess[index].textContent;
  let newprice = Number(price.replace("$", ""));
  button.addEventListener("click", () => {
    if (count <= 0 || count == 1) {
      count;
    } else {
      count--;
    }
    quantities[index].textContent = `${count}`;
    if (
      Number(quantities[index].textContent) < 120 &&
      Number(quantities[index].textContent) > 0
    ) {
      totals[index].textContent = `$${newprice / count}`;
    } else {
      quantities[index].textContent = `${count}`;
    }
  });
});
