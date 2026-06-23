export function getCart() {
  return JSON.parse(localStorage.getItem('cart') || '[]');
}

export function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
}

export function addToCart(product) {
  if (!product) return;

  const cart = getCart();
  const existing = cart.find(item => item.productName === product.title);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ productName: product.title, quantity: 1 });
  }

  saveCart(cart);
}

export function updateCartCount() {
  const cart = getCart();
  const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
  const counter = document.querySelector('.header-actions_cart-count');
  if (counter) counter.textContent = totalQty;
}

export function initCartButton() {
  const cartBtn = document.querySelector('.header-actions_cart-btn');
  if (cartBtn) {
    cartBtn.addEventListener('click', () => {
      window.location.href = '/cart.html'; // заміни на реальний шлях
    });
  }
}