import { products, shopCategories} from './data/products.js';
import * as noUiSlider from 'nouislider';
import 'nouislider/dist/nouislider.css';

const productsContainer = document.querySelector('.shop-list');
const paginationContainer = document.querySelector('.pagination');
const searchInput = document.querySelector('.search-input');

if (productsContainer) {
  const PER_PAGE = 9;
let currentPage = 1;
let filteredProducts = [...products];
let debounceTimer;

function renderproducts() {
  const start = (currentPage - 1) * PER_PAGE;
  const pageproducts = filteredProducts.slice(start, start + PER_PAGE);

  if (!pageproducts.length) {
    productsContainer.innerHTML = '<p class="no-results">Нічого не знайдено</p>';
    paginationContainer.innerHTML = '';
    return;
  }

  productsContainer.innerHTML = pageproducts.map(product => `
    <article class="product-card">
    <a href="${product.url}" class="product-card__img-wrap">
      <img src="${product.image}" alt="${product.title}">
    </a>
    <div class="product-card__info">
    <div class="product-card__left">
      <a href="${product.url}" class="product-card__title">${product.title}</a>
      <p class="product-card__price">$${product.price.toFixed(2)}</p>
      </div>
        <button class="product-card__btn btn" data-id="${product.id}">Add to Cart</button>
    </div>
  </article>
  `).join('');

  renderPagination();
}

productsContainer.addEventListener('click', (e) => {
  const btn = e.target.closest('.product-card__btn');
  if (!btn) return;

  const id = Number(btn.dataset.id);
  const product = products.find(p => p.id === id);

  addToCart(product);
});

function renderPagination() {
  const totalPages = Math.ceil(filteredProducts.length / PER_PAGE);

  if (totalPages <= 1) {
    paginationContainer.innerHTML = '';
    return;
  }

  paginationContainer.innerHTML = `
    <button class="pagination__btn" data-page="${currentPage - 1}" ${currentPage === 1 ? 'disabled' : ''}>‹</button>
    ${Array.from({ length: totalPages }, (_, i) => i + 1).map(page => `
      <button class="pagination__btn ${page === currentPage ? 'active' : ''}" data-page="${page}">${page}</button>
    `).join('')}
    <button class="pagination__btn" data-page="${currentPage + 1}" ${currentPage === totalPages ? 'disabled' : ''}>›</button>
  `;

  paginationContainer.querySelectorAll('.pagination__btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const page = Number(btn.dataset.page);
      if (!page || btn.disabled) return;
      currentPage = page;
      renderproducts();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
}


  // ===== САЙДБАР: Categories =====
  function renderCategories() {
    const container = document.querySelector('.shop-sidebar-categories');
    container.innerHTML = shopCategories.map(cat => `
      <li>
        <a href="#" class="category-link" data-category="${cat}">${cat}</a>
        
      </li>
    `).join('');
  }


// Пошук
if (searchInput) {
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      currentPage = 1;
      filteredProducts = !query
        ? [...products]
        : products.filter(product =>
            product.title.toLowerCase().includes(query) ||
            product.category.toLowerCase().includes(query)
          );
      renderproducts();
    }, 300);
  });
}

// ===== ЦІНОВИЙ СЛАЙДЕР =====
const sliderEl = document.getElementById('priceSlider');

if (sliderEl) {
  const minPrice = Math.min(...products.map(p => p.price));
  const maxPrice = Math.max(...products.map(p => p.price));

  noUiSlider.create(sliderEl, {
    start: [minPrice, maxPrice],
    connect: true,
    range: { min: minPrice, max: maxPrice }
  });

  sliderEl.noUiSlider.on('update', (values) => {
    document.getElementById('priceMin').textContent = Math.round(values[0]);
    document.getElementById('priceMax').textContent = Math.round(values[1]);
  });

  document.querySelector('.btn-green').addEventListener('click', () => {
    const [min, max] = sliderEl.noUiSlider.get().map(Number);
    currentPage = 1;
    filteredProducts = products.filter(p => p.price >= min && p.price <= max);
    renderproducts();
  });
}

renderproducts();
renderCategories();

}