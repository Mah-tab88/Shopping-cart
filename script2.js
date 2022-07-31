import { productsData } from "./products.js";
const productsCenter = document.querySelector(".products-center");
const carts = document.querySelector(".carts");
const cartBtn = document.querySelector(".cart-btn");
const back = document.querySelector(".back");
const cartsConfirm = document.querySelector(".carts__confirm");
const cartItems = document.querySelector(".cart-items");
const cartsContainer = document.querySelector(".carts__container");
const cartTotalPrice = document.querySelector(".carts__total__price");
const cartsClear = document.querySelector(".carts__clear");

let cart = [];

class Products {
  getProducts() {
    return productsData;
  }
}
class Ui {
  showProducts(productsData) {
    //Show product in page
    let productSection = "";
    productsData.forEach((product) => {
      let btnStatus = cart.find((item) => item.id == product.id)
        ? "In Cart"
        : "Add To Cart";

      productSection += `
        <section class="product" data-id=${product.id}>
        <div class="image-container">
          <img class="product-img" src=${product.imageUrl} alt=${
        product.title
      } />
        </div>
        <div class="product-discription">
          <p class="product-title">${product.title}</p>
          <p class="product-price">$ ${product.price}</p>
        </div>
        <button class="add-to-cart ${
          btnStatus == "In Cart" ? "btn-change" : ""
        }" data-id="${product.id}">
        ${btnStatus}
        </button>
      </section>
        `;
    });
    productsCenter.innerHTML = productSection;

    // click on "add to cart" and add style on that
    const addToCartBtns = [...document.querySelectorAll(".add-to-cart")];
    addToCartBtns.forEach((btn) => {
      if (btn.innerText == "In Cart") {
        btn.style.background = "#d8b4fe";
        btn.style.color = "#a1a1aa";
      }
      btn.addEventListener("click", () => {
        if (btn.innerText != "In Cart") {
          btn.innerText = "In Cart";
          btn.style.background = "#d8b4fe";
          btn.style.color = "#a1a1aa";
          const btnId = btn.dataset.id;
          //add product to cart
          const addedProduct = Storage.getProduct(btnId);
          cart.push(addedProduct);
          Storage.saveCart(cart);

          //update total Price
          this.updatePrice();

          //update value of cart-items (number of purchase product)
          cartItems.innerText = Number(cartItems.innerText) + 1;

          // show purchase product in cartlist
          this.showProductsInCartList(btnId);
        }
      });
    });
  }
  showProductsInCartList(btnId) {
    const cartSelected = cart.find((p) => p.id == btnId);
    cartsContainer.innerHTML += `
          <div class="cart" data-id="${cartSelected.id}">
            <div class="cart__img">
              <img src=${cartSelected.imageUrl} />
            </div>
            <div class="cart__info">
              <p class="cart__title">${cartSelected.title}</p>
              <small class="cart__price">$ ${cartSelected.price}</small>
            </div>
            <div class="cart__detail">
              <span><i class="fa-solid fa-angle-up"></i></span>
              <p class="cart__numbers">${cartSelected.quantity}</p>
              <span><i class="fa-solid fa-angle-down"></i></span>
            </div>
            <span class="" ><i class="fa-solid fa-trash-can cart__trash" ></i></span>
          </div>`;
  }

  changeNumberOfProduct() {
    carts.addEventListener("click", (e) => {
      //increase number of product
      if (e.target.classList.contains("fa-angle-up")) {
        const productId =
          e.target.parentElement.parentElement.parentElement.dataset.id;

        e.target.parentElement.nextElementSibling.innerText =
          Number(e.target.parentElement.nextElementSibling.innerText) + 1;

        //update quantity of product

        cart.find((p) => {
          if (p.id == productId) {
            p.quantity++;
          }
        });

        //update cart
        Storage.saveCart(cart);
        //update total price in cart list
        this.updatePrice();
        //update number of purches in sabad!
        cartItems.innerHTML = Number(cartItems.innerText) + 1;
      }

      //decrease number of product
      if (e.target.classList.contains("fa-angle-down")) {
        const productId =
          e.target.parentElement.parentElement.parentElement.dataset.id;
        if (
          Number(e.target.parentElement.previousElementSibling.innerText) > 1
        ) {
          e.target.parentElement.previousElementSibling.innerText =
            Number(e.target.parentElement.previousElementSibling.innerText) - 1;

          //update number of items in shopping cart
          cart.find((p) => {
            if (p.id == productId) {
              p.quantity--;
            }
          });
          //save cart in storage
          Storage.saveCart(cart);
          ////update number of purches in sabad!
          cartItems.innerHTML = Number(cartItems.innerText) - 1;
          //update total price in cart list
          this.updatePrice();
        } else {
          cart = cart.filter((p) => p.id != productId);
          //remove from showing in cartList
          e.target.parentElement.parentElement.parentElement.remove();
          Storage.saveCart(cart);
          //update total price in cart list
          this.updatePrice();
          ////update number of purches in sabad!
          let numberOf = 0;
          cart.forEach((p) => {
            numberOf = numberOf + p.quantity;
            console.log(numberOf);
          });
          cartItems.innerHTML = numberOf;
          //In cart change to add to cart
          this.showProducts(productsData);
        }
      }

      //remove product
      if (e.target.classList.contains("cart__trash")) {
        const btnIdTrash = e.target.parentElement.parentElement.dataset.id;
        //update number of purches in sabad!
        cartItems.innerHTML =
          Number(cartItems.innerText) -
          Number(e.target.parentElement.previousElementSibling.innerText);
        //delete product from cart
        cart = cart.filter((p) => p.id != btnIdTrash);
        //save cart
        Storage.saveCart(cart);
        //update price
        this.updatePrice();
        //remove from showing in CartList
        e.target.parentElement.parentElement.remove();

        //In cart change to add cart
        this.showProducts(productsData);
      }
    });
  }

  updatePrice() {
    let cost = 0;
    cart.forEach((item) => {
      cost = cost + item.price * item.quantity;
    });
    cartTotalPrice.innerText = "$ " + cost.toFixed(2);
  }

  refreshShow() {
    //get cart
    cart = Storage.getCart();

    //get number of purches in cart
    let totalQuantity = 0;
    cart.forEach((p) => {
      totalQuantity += p.quantity;
    });
    cartItems.innerHTML = totalQuantity;

    //show purchas in cartList
    cart.forEach((item) => {
      cartsContainer.innerHTML += `
      <div class="cart" data-id=${item.id}>
            <div class="cart__img">
              <img src=${item.imageUrl} />
            </div>
            <div class="cart__info">
              <p class="cart__title">${item.title}</p>
              <small class="cart__price">$ ${item.price}</small>
            </div>
            <div class="cart__detail">
              <span><i class="fa-solid fa-angle-up"></i></span>
              <p class="cart__numbers">${item.quantity}</p>
              <span><i class="fa-solid fa-angle-down"></i></span>
            </div>
            <span class="" ><i class="fa-solid fa-trash-can cart__trash"></i></span>
          </div>`;
    });

    // show total price
    let priceOfProducts = 0;
    cart.forEach((p) => {
      priceOfProducts = priceOfProducts + p.quantity * p.price;
    });
    cartTotalPrice.innerHTML = "$ " + priceOfProducts.toFixed(2);
  }
}

class Storage {
  static SavedProducts(products) {
    localStorage.setItem("products", JSON.stringify(products));
  }
  static getProduct(id) {
    const myProduct = JSON.parse(localStorage.getItem("products"));
    return myProduct.find((p) => p.id == id);
  }

  static saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  static getCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
  }
}

cartBtn.addEventListener("click", (e) => {
  carts.style.opacity = "1";
  carts.style.transform = "translateY(10vh)";
  back.style.display = "block";
});

carts.addEventListener("click", (e) => {
  if (e.target == cartsConfirm) {
    carts.style.opacity = "0";
    carts.style.transform = "translateY(-100vh)";
    back.style.display = "none";
  }

  if (e.target == cartsClear) {
    //update total price
    cartTotalPrice.innerHTML = 0;

    //update cart
    cart = [];
    Storage.saveCart(cart);

    //change text button to addCart
    const ui = new Ui();
    ui.showProducts(productsData);

    //update cartItems
    cartItems.innerHTML = 0;

    //delete showing product(s) in cartList
    cartsContainer.innerHTML = `<h2 class="product-title">Your Shopping Cart is empty</h2>`;
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const products = new Products();
  const productsData = products.getProducts();

  Storage.SavedProducts(productsData);
  const ui = new Ui();
  ui.refreshShow();
  ui.showProducts(productsData);
  ui.changeNumberOfProduct();
});
