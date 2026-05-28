import { posts, categories, tags } from './data/posts.js';

const postsContainer = document.querySelector('.posts-list');
const paginationContainer = document.querySelector('.pagination');
const searchInput = document.querySelector('.search-input');

if (postsContainer) {
  const PER_PAGE = 3;
let currentPage = 1;
let filteredPosts = [...posts];
let debounceTimer;

function renderPosts() {
  const start = (currentPage - 1) * PER_PAGE;
  const pagePosts = filteredPosts.slice(start, start + PER_PAGE);

  if (!pagePosts.length) {
    postsContainer.innerHTML = '<p class="no-results">Нічого не знайдено</p>';
    paginationContainer.innerHTML = '';
    return;
  }

  postsContainer.innerHTML = pagePosts.map(post => `
    <article class="post-card">
      <a href="${post.url}" class="post-list_item">
        <img src="${post.image}" alt="blog post" />
        <span class="post-date">${post.date}</span>
      </a>
      <div class="post-text">
        <div class="news-meta">
          <p class="author">by ${post.author}</p>
          <p class="comments">${post.comments} Comment</p>
        </div>
        <h2 class="post-description">${post.title}</h2>
        <p class="post-text">${post.excerpt}</p>
      </div>
      <div class="btn-group">
        <a href="${post.url}" class="btn btn-post">Read More</a>
      </div>
    </article>
  `).join('');

  renderPagination();
}

function renderPagination() {
  const totalPages = Math.ceil(filteredPosts.length / PER_PAGE);

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
      renderPosts();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
}

// ===== САЙДБАР: Latest Posts =====
  function renderLatestPosts() {
    const container = document.querySelector('.sidebar-posts');
    const latest = posts.slice(0, 3);

    container.innerHTML = latest.map(post => `
      <li class="sidebar-posts__item">
        <a href="${post.url}" class="sidebar-posts__link">
          <img src="${post.image}" alt="${post.title}">
          <div class="sidebar-posts__info">
            <span class="sidebar-posts__author">by ${post.author}</span>
            <p class="sidebar-posts__title">${post.title}</p>
          </div>
        </a>
      </li>
    `).join('');
  }

  // ===== САЙДБАР: Categories =====
  function renderCategories() {
    const container = document.querySelector('.sidebar-categories');


    container.innerHTML = categories.map(cat => `
      <li>
        <a href="#" class="category-link" data-category="${cat}">${cat}</a>
      </li>
    `).join('');
  }

  // ===== САЙДБАР: Tags =====
  function renderTags() {
    const container = document.querySelector('.sidebar-tags');


    container.innerHTML = tags.map(tag => `
      <a href="#" class="sidebar-tags__item" data-tag="${tag}">${tag}</a>
    `).join('');
  }

  // ===== ФІЛЬТРАЦІЯ по категорії/тегу =====
  document.addEventListener('click', (e) => {
    const filter = e.target.dataset.category || e.target.dataset.tag;
    if (!filter) return;

    e.preventDefault();
    currentPage = 1;
    filteredPosts = posts.filter(post => post.tags.includes(filter));
    renderPosts();
  });

// Пошук
if (searchInput) {
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      currentPage = 1;
      filteredPosts = !query
        ? [...posts]
        : posts.filter(post =>
            post.title.toLowerCase().includes(query) ||
            post.excerpt.toLowerCase().includes(query) ||
            post.tags.some(tag => tag.toLowerCase().includes(query))
          );
      renderPosts();
    }, 300);
  });
}

renderPosts();
renderLatestPosts();
renderCategories();
renderTags();
}
