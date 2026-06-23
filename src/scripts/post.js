import { posts, categories, tags } from './data/posts.js';

const postImageEl = document.querySelector('.post__image');

if (postImageEl) {
  const params = new URLSearchParams(window.location.search);
  const id = Number(params.get('id'));
  const post = posts.find(p => p.id === id);

  if (post) {
    postImageEl.src = post.image;
    document.querySelector('.post-description').textContent = post.title;
    document.querySelector('.post_text').innerHTML = post.content;
    document.querySelector('.post-date').textContent = post.date;
    document.querySelector('.author').textContent = `by ${post.author}`;
    document.querySelector('.comments').textContent = `${post.comments} Comment`;

    document.querySelector('.post__tags').innerHTML = post.tags.map(tag => `
      <a href="#" class="post-tag">${tag}</a>
    `).join('');

    const prev = posts.find(p => p.id === id - 1);
    const next = posts.find(p => p.id === id + 1);
    document.querySelector('.post__navigation').innerHTML = `
      ${prev ? `<a href="?id=${prev.id}" class="post__navigation-item post__navigation-item--prev">${prev.title}</a>` : '<span class="post__navigation-item post__navigation-item--empty"></span>'}
      ${next ? `<a href="?id=${next.id}" class="post__navigation-item post__navigation-item--next">${next.title}</a>` : '<span class="post__navigation-item post__navigation-item--empty"></span>'}
    `;
  }
}

// Сайдбар
function renderLatestPosts() {
  const container = document.querySelector('.sidebar-posts');
  if (!container) return;
  container.innerHTML = posts.slice(0, 3).map(p => `
    <li class="sidebar-posts__item">
      <a href="${p.url}" class="sidebar-posts__link">
        <img src="${p.image}" alt="${p.title}">
        <div class="sidebar-posts__info">
          <span class="sidebar-posts__author">by ${p.author}</span>
          <p class="sidebar-posts__title">${p.title}</p>
        </div>
      </a>
    </li>
  `).join('');
}

function renderCategories() {
  const container = document.querySelector('.sidebar-categories');
  if (!container) return;
  container.innerHTML = categories.map(cat => `
    <li><a href="#" class="category-link" data-category="${cat}">${cat}</a></li>
  `).join('');
}

function renderTags() {
  const container = document.querySelector('.sidebar-tags');
  if (!container) return;
  container.innerHTML = tags.map(tag => `
    <a href="#" class="sidebar-tags__item" data-tag="${tag}">${tag}</a>
  `).join('');
}

renderLatestPosts();
renderCategories();
renderTags();