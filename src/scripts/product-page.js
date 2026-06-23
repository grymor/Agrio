import { products } from './data/products.js';
import { addToCart } from './cart.js';

const params = new URLSearchParams(window.location.search);
const id = Number(params.get('id'));
const product = products.find(p => p.id === id);

if (product) {
  document.querySelector('.product__image').src = product.image;
  document.querySelector('.product__image').alt = product.title;
  document.querySelector('.product__title').textContent = product.title;
  document.querySelector('.product__price').textContent = `$${product.price.toFixed(2)}`;
  document.querySelector('.product__reviews-count').textContent = `(${product.reviews.length} Customer Review${product.reviews.length !== 1 ? 's' : ''})`;
  document.querySelector('.product__description').textContent = product.description;

  // Description block (full paragraphs)
  const descBlock = document.querySelector('.product__description-block');
  descBlock.querySelectorAll('.product__description-text').forEach(el => el.remove());
  product.descriptionLong.forEach(paragraph => {
    const p = document.createElement('p');
    p.className = 'product__description-text';
    p.textContent = paragraph;
    descBlock.appendChild(p);
  });

  // Reviews title
  document.querySelector('.product__reviews-title').textContent =
    `${product.reviews.length} review${product.reviews.length !== 1 ? 's' : ''} for ${product.title}`;

  // Reviews list
  const reviewList = document.querySelector('.review-list');
  reviewList.innerHTML = product.reviews.map(review => `
    <div class="review-item">
      <img class="review-item__avatar" src="${review.avatar}" alt="${review.author}">
      <div>
        <p class="review-item__name">${review.author}</p>
        <p class="review-item__date">${review.date}</p>
        <p class="review-item__text">${review.text}</p>
      </div>
    </div>
  `).join('');

  // Add to cart (підключи свою функцію addToCart з cart.js)


document.querySelector('.product__add-to-cart')?.addEventListener('click', () => {
  if (!product) return;
  const qty = Number(document.querySelector('.quantity-control__input').value) || 1;
  for (let i = 0; i < qty; i++) {
    addToCart(product);
  }
});
}


document.querySelectorAll('.quantity-control').forEach(control => {
  const input = control.querySelector('.quantity-control__input');
  const btnUp = control.querySelector('.quantity-control__btn--up');
  const btnDown = control.querySelector('.quantity-control__btn--down');

  btnUp.addEventListener('click', () => {
    input.value = Number(input.value) + 1;
  });

  btnDown.addEventListener('click', () => {
    const newVal = Number(input.value) - 1;
    input.value = newVal > 1 ? newVal : 1;
  });

  input.addEventListener('change', () => {
    if (Number(input.value) < 1 || !input.value) {
      input.value = 1;
    }
  });
});