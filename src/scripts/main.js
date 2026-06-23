import '../styles/main.scss';
import './posts.js';
import './products.js';
import './post.js';
import { updateCartCount, initCartButton } from './cart.js';
import './cart-page.js';
import './product-page.js';




const headerEl = document.querySelector(".header");
window.addEventListener("scroll", () => {
  if (window.scrollY > headerEl.offsetHeight) {
    headerEl.classList.add("scrolled");
  } else {
    headerEl.classList.remove("scrolled");
  }
});



const swiper = new Swiper(".feedback .swiper", {
  direction: "vertical",
  slidesPerView: 1,
  loop: true,
  spaceBetween: 30,
  navigation: {
    nextEl: ".slider-btn--next",
    prevEl: ".slider-btn--prev",
  },
});

new Swiper('.testimonials .swiper', {
  slidesPerView: 2,
  loop: true,
});

// ===== КОШИК =====
updateCartCount();
initCartButton();