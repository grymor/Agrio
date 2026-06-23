import { products } from './data/products.js';
import { getCart, saveCart } from './cart.js';

const cartListEl = document.querySelector('.cart__list');
const totalEl = document.querySelector('.cart__total-value');

if (cartListEl) {
  function renderCart() {
    const cart = getCart();

    if (!cart.length) {
      cartListEl.innerHTML = '<p class="cart__empty">Ваш кошик порожній</p>';
      totalEl.textContent = '0.00';
      return;
    }

    let total = 0;

    cartListEl.innerHTML = cart.map(item => {
      const product = products.find(p => p.title === item.productName);
      if (!product) return '';

      const lineTotal = product.price * item.quantity;
      total += lineTotal;

      return `
        <div class="cart-item" data-product-name="${product.title}">
          <img class="cart-item__img" src="${product.image}" alt="${product.title}">
          <div class="cart-item__info">
            <p class="cart-item__title">${product.title}</p>
            <p class="cart-item__price">$${product.price.toFixed(2)}</p>
          </div>
          <div class="cart-item__qty">
            <button class="cart-item__qty-btn" data-action="decrease">−</button>
            <span class="cart-item__qty-value">${item.quantity}</span>
            <button class="cart-item__qty-btn" data-action="increase">+</button>
          </div>
          <p class="cart-item__line-total">$${lineTotal.toFixed(2)}</p>
          <button class="cart-item__remove" data-action="remove">×</button>
        </div>
      `;
    }).join('');

    totalEl.textContent = total.toFixed(2);
  }

  cartListEl.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;

    const itemEl = btn.closest('.cart-item');
    const productName = itemEl.dataset.productName;
    const cart = getCart();
    const item = cart.find(i => i.productName === productName);
    if (!item) return;

    const action = btn.dataset.action;

    if (action === 'increase') {
      item.quantity += 1;
    } else if (action === 'decrease') {
      item.quantity -= 1;
      if (item.quantity <= 0) {
        const index = cart.indexOf(item);
        cart.splice(index, 1);
      }
    } else if (action === 'remove') {
      const index = cart.indexOf(item);
      cart.splice(index, 1);
    }

    saveCart(cart);
    renderCart();
  });

  renderCart();
}