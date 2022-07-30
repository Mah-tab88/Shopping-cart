// another way using javascript code
import { productsData } from "./products.js";

const carts = document.querySelector(".carts");
const cartBtn = document.querySelector(".cart-btn");
const back = document.querySelector(".back");

const cartsClear = document.querySelector(".carts__clear");
const cartsConfirm = document.querySelector(".carts__confirm");
const productsCenter = document.querySelector(".products-center");

const cartsTotalPrice = document.querySelector(".carts__total__price");
const cartItems = document.querySelector(".cart-items");
const cartsContainer = document.querySelector(".carts__container");

let cart = [];

class Products {
  getProducts() {
    return productsData;
  }
}
class UI {
  displayProducts(productsData) {
    let result = "";
    productsData.forEach((item) => {
      result += `<section class="product">
        <div class="image-container">
          <img class="product-img" src="${item.imageUrl}" alt="${item.title}" />
        </div>
        <div class="product-discription">
          <p class="product-title">${item.title}</p>
          <p class="product-price">$ ${item.price}</p>
        </div>
        <button class="add-to-cart" data-id =${item.id}>Add To Cart</button>
      </section>`;
    });
    productsCenter.innerHTML = result;
  }

  getAddToCartBtns() {
    const addToCartBtns = document.querySelectorAll(".add-to-cart");
    const buttons = [...addToCartBtns];
    buttons.forEach((btn) => {
      const id = btn.dataset.id;

      const isInCart = cart.find((p) => p.id === parseInt(id));

      if (isInCart) {
        btn.innerText = "In Cart";
        btn.disabled = true;
      }
      btn.addEventListener("click", (e) => {
        e.target.innerText = "In Cart";
        e.target.disabled = true;

        // get product from localstoeage
        const addedProduct = Storage.getProduct(id);

        // add to cart
        // cart=[...cart,{...addedProduct,quantity:1}]
        addedProduct.quantity = 1;
        cart = [...cart, addedProduct];

        // save cart in localstorage
        Storage.saveToCart(cart);

        // update cart value
        this.setCartValue(cart);

        // add to cart item
        this.ShowInCart(addedProduct);
        // console.log(Storage.getCart(cart));
      });
    });
  }

  setCartValue(cart) {
    let tempCartItems = 0;
    const totalPrice = cart.reduce((acc, curr) => {
      tempCartItems += curr.quantity;
      return acc + curr.quantity * curr.price;
    }, 0);
    cartsTotalPrice.innerText = totalPrice.toFixed(2);
    cartItems.innerText = tempCartItems;
  }

  ShowInCart(addedProduct) {
    const newcart = document.createElement("div");
    newcart.classList.add("cart");
    newcart.innerHTML = `<div class="cart__img">
        <img src="${addedProduct.imageUrl}" alt="app1" />
      </div>
      <div class="cart__info">
        <p class="cart__title">${addedProduct.title}</p>
        <small class="cart__price">$ ${addedProduct.price}</small>
      </div>
      <div class="cart__detail">
        <span><i class="fa-solid fa-angle-up" data-id=${addedProduct.id}></i></span>
        <p class="cart__numbers">${addedProduct.quantity}</p>
        <span><i class="fa-solid fa-angle-down" data-id=${addedProduct.id}></i></span>
      </div>
      <span><i class="fa-solid fa-trash-can" data-id=${addedProduct.id}></i></span>
    </div>`;
    cartsContainer.appendChild(newcart);
  }

  setupApp() {
    cart = Storage.getCart();
    this.setCartValue(cart);
    cart.forEach((item) => this.ShowInCart(item));
  }

  cartLogic() {
    cartsContainer.addEventListener("click", (e) => {
      let BtnId = e.target.dataset.id;
      if (e.target.classList.contains("fa-angle-up")) {
        e.target.parentElement.nextElementSibling.innerText++;
        this.updatecartsUp(BtnId);
        // console.log(e.target.dataset.id);
      } else if (e.target.classList.contains("fa-angle-down")) {
        if (e.target.parentElement.previousElementSibling.innerText > 0)
          e.target.parentElement.previousElementSibling.innerText--;
        this.updatecartsDown(BtnId, e);
      } else if (e.target.classList.contains("fa-trash-can")) {
        e.target.parentElement.parentElement.remove();
        this.updatecartTrash(BtnId);
      }
    });
  }

  updatecartsUp(BtnId) {
    cart = Storage.getCart();
    cart.forEach((item) => {
      if (item.id == BtnId) {
        item.quantity++;
        cartsTotalPrice.innerText = (
          parseFloat(cartsTotalPrice.innerText) + item.price
        ).toFixed(2);
        Storage.saveToCart(cart);
        cartItems.innerText++;
      }
    });
  }
  updatecartsDown(BtnId, e) {
    cart = Storage.getCart();
    cart.forEach((item) => {
      if (item.id == BtnId) {
        item.quantity--;
        if (item.quantity == 0) {
          const addToCartBtns = document.querySelectorAll(".add-to-cart");
          const buttons = [...addToCartBtns];
          const itemNone = buttons.find((button) => button.dataset.id == BtnId);
          itemNone.innerHTML = "Add To Cart";
          itemNone.disabled = false;
          e.target.parentElement.parentElement.parentElement.remove();
        }
        cartsTotalPrice.innerText = (
          parseFloat(cartsTotalPrice.innerText) - item.price
        ).toFixed(2);

        if (parseFloat(cartsTotalPrice.innerText) <= 0)
          cartsTotalPrice.innerText = "0";
        cart = cart.filter((item) => item.quantity != 0);
        Storage.saveToCart(cart);
        cartItems.innerText--;
      }
    });
  }

  updatecartTrash(BtnId) {
    const addToCartBtns = document.querySelectorAll(".add-to-cart");
    const buttons = [...addToCartBtns];
    const btnAdd = buttons.find((btn) => btn.dataset.id == BtnId);
    btnAdd.innerText = "Add To Cart";
    btnAdd.disabled = false;
    const numItem = cart.find((e) => e.id == BtnId);
    console.log(numItem);
    cartsTotalPrice.innerText -= numItem.quantity * numItem.price;
    cartItems.innerText -= numItem.quantity;
    cart = cart.filter((item) => item.id !== parseInt(BtnId));
    Storage.saveToCart(cart);
  }
}

class Storage {
  static saveProducts(products) {
    localStorage.setItem("products", JSON.stringify(products));
  }

  static getProduct(id) {
    const _products = JSON.parse(localStorage.getItem("products"));
    return _products.find((p) => p.id === parseInt(id));
  }

  static saveToCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }
  static getCart() {
    return localStorage.getItem("cart")
      ? JSON.parse(localStorage.getItem("cart"))
      : [];
  }
}

cartBtn.addEventListener("click", () => {
  carts.style.opacity = "1";
  carts.style.transform = "translateY(10vh)";
  back.style.display = "block";
});

cartsConfirm.addEventListener("click", () => {
  carts.style.opacity = "0";
  carts.style.transform = "translateY(-100vh)";
  back.style.display = "none";
});

cartsClear.addEventListener("click", () => {
  cart = [];
  Storage.saveToCart(cart);
  cartsContainer.innerHTML = "";
  cartItems.innerText = "0";
  cartsTotalPrice.innerText = "0";
  const addToCartBtns = document.querySelectorAll(".add-to-cart");
  const buttons = [...addToCartBtns];
  buttons.forEach((btn) => {
    btn.innerText = "Add To Cart";
    btn.disabled = false;
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const ui = new UI();
  ui.setupApp();
  const products = new Products();
  const productsData = products.getProducts();
  ui.displayProducts(productsData);
  Storage.saveProducts(productsData);
  ui.getAddToCartBtns();
  ui.cartLogic();
});
