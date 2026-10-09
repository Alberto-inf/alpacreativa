const state = {
  currentCategory: "all",
  searchQuery: "",
  modalProduct: null,
  modalSize: "M",
  modalColor: null,
  modalText: "",
  modalQty: 1
};

document.addEventListener("DOMContentLoaded", async () => {
  if (typeof CATALOG_MODE !== 'undefined' && CATALOG_MODE) document.body.classList.add('catalog-mode');
  ALPA_COMPONENTS.mount("topbarSlot", ALPA_COMPONENTS.renderTopbar());
  ALPA_COMPONENTS.mount("headerSlot", ALPA_COMPONENTS.renderHeader(false));
  ALPA_COMPONENTS.mount("footerSlot", ALPA_COMPONENTS.renderFooter());
  ALPA_COMPONENTS.mount("whatsappSlot", ALPA_COMPONENTS.renderWhatsApp());
  ALPA_COMPONENTS.mount("cartSlot", ALPA_COMPONENTS.renderCart());
  ALPA_COMPONENTS.mount("modalSlot", ALPA_COMPONENTS.renderModal());
  ALPA_COMPONENTS.mount("toastSlot", ALPA_COMPONENTS.renderToast());
  ALPA_COMPONENTS.mount("cookieSlot", ALPA_COMPONENTS.renderCookieBanner());
  ALPA_COMPONENTS.mount("scrollTopSlot", ALPA_COMPONENTS.renderScrollTop());
  ALPA_COMPONENTS.mount("lightboxSlot", ALPA_COMPONENTS.renderLightbox());
  ALPA_COMPONENTS.initNav();
  ALPA_COMPONENTS.initMenuToggle();
  ALPA_COMPONENTS.initSearchMobile();
  ALPA_COMPONENTS.initAccountFavorites();
  ALPA_COMPONENTS.initCookieBanner();
  ALPA_COMPONENTS.initScrollTop();
  ALPA_COMPONENTS.initLightbox();

  // Catálogo vivo desde Supabase (vacío hasta que ella cree productos)
  try {
    if (typeof ALPA_STORE !== "undefined") await ALPA_STORE.refresh();
  } catch (_) {}

  renderCategoryFilter();
  renderCategories();
  renderProducts();
  renderGallery();
  renderTestimonials();
  bindUI();
  bindModalEvents();
  bindFaq();
  if (typeof CATALOG_MODE === 'undefined' || !CATALOG_MODE) Cart.init();
  initAOS();
});

function initAOS() {
  if (typeof AOS !== "undefined") {
    AOS.init({
      duration: 700,
      easing: "ease-out-cubic",
      once: true,
      offset: 60
    });
  }
}

/* NAVBAR — now handled by ALPA_COMPONENTS.initNav() */

/* CATEGORY FILTER */
function renderCategoryFilter() {
  const sel = document.getElementById("categoryFilter");
  CATEGORIES.forEach(c => {
    const opt = document.createElement("option");
    opt.value = c.slug;
    opt.textContent = c.name;
    sel.appendChild(opt);
  });
  sel.addEventListener("change", e => filterByCategory(e.target.value));
}

/* CATEGORIES GRID */
function renderCategories() {
  const grid = document.getElementById("categoriesGrid");
  const mainCats = CATEGORIES.filter(c => c.slug !== "novedades" && c.slug !== "ediciones-especiales");
  grid.innerHTML = mainCats.map(cat => {
    const count = PRODUCTS.filter(p => p.category === cat.slug).length;
    const subs = (cat.sub && cat.sub.length) ? `${cat.sub.length} subcategorías` : `${count} productos`;
    return `
      <div class="cat-card" data-cat="${cat.slug}" data-aos="fade-up">
        <div class="cat-card__icon">${(CATEGORY_ICONS[cat.slug] && CATEGORY_ICONS[cat.slug].small) || "📦"}</div>
        <div class="cat-card__name">${cat.name}</div>
        <div class="cat-card__count">${subs}</div>
      </div>`;
  }).join("");

  grid.querySelectorAll(".cat-card").forEach(card => {
    card.addEventListener("click", () => {
      window.location.href = `categoria.html?cat=${card.dataset.cat}`;
    });
  });
}

/* PRODUCTS */
function renderProducts() {
  const grid = document.getElementById("productsGrid");
  const title = document.getElementById("productsTitle");

  let list = PRODUCTS.slice();
  if (state.currentCategory !== "all") {
    list = list.filter(p => p.category === state.currentCategory);
  }
  if (state.searchQuery) {
    const q = state.searchQuery.toLowerCase();
    list = list.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      (p.subcategory && p.subcategory.toLowerCase().includes(q)) ||
      p.category.toLowerCase().includes(q)
    );
  }

  if (state.currentCategory !== "all") {
    const cat = CATEGORIES.find(c => c.slug === state.currentCategory);
    title.textContent = cat ? cat.name : "Productos";
  } else if (state.searchQuery) {
    title.textContent = `Resultados para "${state.searchQuery}"`;
  } else {
    title.textContent = "Productos destacados";
  }

  if (list.length === 0) {
    const isEmptyCatalog = !state.searchQuery && state.currentCategory === "all";
    grid.innerHTML = isEmptyCatalog ? `
      <div style="grid-column: 1/-1; text-align:center; padding: 80px 20px; color: var(--muted);">
        <div style="font-size: 56px; margin-bottom: 16px;">🧵</div>
        <h3 style="font-family:'Playfair Display',serif; color:var(--ink); margin-bottom:8px;">Estamos preparando el catálogo</h3>
        <p>Muy pronto verás aquí todos nuestros productos. Escríbenos por WhatsApp y te ayudamos.</p>
      </div>` : `
      <div style="grid-column: 1/-1; text-align:center; padding: 80px 20px; color: var(--muted);">
        <div style="font-size: 56px; margin-bottom: 16px;">🔍</div>
        <h3 style="font-family:'Playfair Display',serif; color:var(--ink); margin-bottom:8px;">Sin resultados</h3>
        <p>Prueba con otra búsqueda o explora nuestras categorías.</p>
      </div>`;
    return;
  }

  const isCatalog = typeof CATALOG_MODE !== 'undefined' && CATALOG_MODE;
  grid.innerHTML = list.map((p, i) => {
    const priceHtml = isCatalog ? (p.price != null ? `<small>A partir de:</small> ${p.price.toFixed(2)} €` : `Consultar precio`) : `${p.price != null ? p.price.toFixed(2) : '--'} €`;
    return `
    <article class="product-card" data-id="${p.id}" data-aos="fade-up" data-aos-delay="${(i % 4) * 80}">
      <div class="product-card__img">
        ${p.subcategory ? '<span class="product-card__tag">' + p.subcategory + '</span>' : ''}
        <img src="${p.img}" alt="${p.name}" width="600" height="600" loading="lazy" onerror="this.src='https://placehold.co/400x400/5d768b/f8efe5?text=ALPA'"/>
      </div>
      <div class="product-card__body">
        <div class="product-card__cat">${getCategoryName(p.category)}</div>
        <h3 class="product-card__name">${p.name}</h3>
        <p class="product-card__desc">${p.description}</p>
        ${(typeof ALPA_STORE !== "undefined") ? ALPA_STORE.colorDots(p) : ""}
        ${(typeof ALPA_STORE !== "undefined") ? ALPA_STORE.sizePills(p) : ""}
        <div class="product-card__foot">
          <span class="product-card__price">${priceHtml}</span>
        </div>
      </div>
    </article>
  `}).join("");

  grid.querySelectorAll(".product-card").forEach(card => {
    card.addEventListener("click", () => {
      openProductModal(card.dataset.id);
    });
  });

  if (typeof AOS !== "undefined") AOS.refresh();
}

/* GALLERY */
function renderGallery() {
  const grid = document.getElementById("galleryGrid");
  if (!grid) return;
  grid.innerHTML = GALLERY.map((g, i) => `
    <div class="gallery__item" data-aos="zoom-in" data-aos-delay="${(i % 4) * 80}">
      <img src="${g.url}" alt="${g.label}" width="600" height="600" loading="lazy" onerror="this.src='https://placehold.co/600x600/cbb39b/fff?text=ALPA'"/>
      <span class="gallery__label">${g.label}</span>
    </div>
  `).join("");
  if (typeof AOS !== "undefined") AOS.refresh();
}

/* TESTIMONIALS */
function renderTestimonials() {
  const grid = document.getElementById("testimonialsGrid");
  if (!grid) return;
  const stars = n => Array.from({length: n}, () => `<svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`).join("");
  grid.innerHTML = TESTIMONIALS.map((t, i) => `
    <div class="testimonial" data-aos="fade-up" data-aos-delay="${i * 100}">
      <span class="testimonial__quote">"</span>
      <div class="testimonial__stars">${stars(t.rating)}</div>
      <p class="testimonial__text">${t.text}</p>
      <div class="testimonial__person">
        <div class="testimonial__name">${t.name}</div>
      </div>
    </div>
  `).join("");
  if (typeof AOS !== "undefined") AOS.refresh();
}

function getCategoryName(slug) {
  const c = CATEGORIES.find(c => c.slug === slug);
  return c ? c.name : "";
}

function filterByCategory(slug) {
  state.currentCategory = slug;
  state.searchQuery = "";
  const search = document.getElementById("searchInput");
  if (search) search.value = "";
  const sel = document.getElementById("categoryFilter");
  if (sel) sel.value = slug;
  renderProducts();
  highlightActiveNav(slug);
}

function highlightActiveNav(slug) {
  document.querySelectorAll(".nav__item").forEach(li => {
    li.classList.toggle("nav__item--active", li.dataset.cat === slug);
  });
}

function scrollToProducts() {
  document.getElementById("productos").scrollIntoView({ behavior: "smooth", block: "start" });
}

/* UI BINDINGS */
function bindUI() {
  const searchInput = document.getElementById("searchInput");
  let t;
  searchInput.addEventListener("input", e => {
    clearTimeout(t);
    t = setTimeout(() => {
      state.searchQuery = e.target.value.trim();
      state.currentCategory = "all";
      highlightActiveNav("all");
      const sel = document.getElementById("categoryFilter");
      if (sel) sel.value = "all";
      renderProducts();
      if (state.searchQuery) {
        document.getElementById("productos").scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 200);
  });
  // toggle dropdown Colecciones ya gestionado en ALPA_COMPONENTS.initNav()
}

function closeMobileMenu() {
  document.getElementById("navbar").classList.remove("navbar--open");
  document.querySelectorAll(".nav__item--open").forEach(li => li.classList.remove("nav__item--open"));
}

/* PRODUCT MODAL */
function openProductModal(id) {
  const product = PRODUCTS.find(p => String(p.id) === String(id));
  if (!product) return;

  state.modalProduct = product;
  // Tallas/colores propios del producto (los que ella marcó); si no tiene, globales
  state.modalSizes = (product.sizes && product.sizes.length) ? product.sizes : PRODUCT_SIZES;
  state.modalColors = (product.colors && product.colors.length) ? product.colors : PRODUCT_COLORS;
  state.modalSize = state.modalSizes.includes("M") ? "M" : (state.modalSizes[0] || "M");
  state.modalColor = state.modalColors[0] || PRODUCT_COLORS[0];
  state.modalText = "";
  state.modalQty = 1;

  document.getElementById("modalImg").src = product.img;
  document.getElementById("modalImg").alt = product.name;
  document.getElementById("modalTitle").textContent = product.name;
  document.getElementById("modalCat").textContent = getCategoryName(product.category);
  document.getElementById("modalDesc").textContent = product.description;
  const isCatalogM = typeof CATALOG_MODE !== 'undefined' && CATALOG_MODE;
  const modalPriceEl = document.getElementById("modalPrice");
  if (isCatalogM) {
    modalPriceEl.innerHTML = product.price != null ? `<small>A partir de:</small> <strong>${product.price.toFixed(2)} €</strong><span>IVA incluido</span>` : `<strong>Consultar precio</strong><span>Pide presupuesto</span>`;
  } else {
    modalPriceEl.textContent = `${product.price.toFixed(2)} €`;
  }
  const tag = document.getElementById("modalTag");
  if (product.subcategory) {
    tag.textContent = product.subcategory;
    tag.style.display = "inline-block";
  } else {
    tag.style.display = "none";
  }

  renderModalOptions();
  updateModalPrice();

  document.getElementById("optText").value = "";
  document.getElementById("modalQty").value = 1;

  const overlay = document.getElementById("productModal");
  overlay.classList.add("modal-overlay--open");
  overlay.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeProductModal() {
  const overlay = document.getElementById("productModal");
  overlay.classList.remove("modal-overlay--open");
  overlay.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  state.modalProduct = null;
}

function renderModalOptions() {
  const sizes = state.modalSizes || PRODUCT_SIZES;
  const colors = state.modalColors || PRODUCT_COLORS;
  const sizesWrap = document.getElementById("optSizes");
  sizesWrap.innerHTML = sizes.map(s => `
    <button type="button" class="size-btn ${s === state.modalSize ? "size-btn--active" : ""}" data-size="${s}">${s}</button>
  `).join("");
  sizesWrap.querySelectorAll(".size-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      state.modalSize = btn.dataset.size;
      renderModalOptions();
    });
  });

  const colorsWrap = document.getElementById("optColors");
  colorsWrap.innerHTML = colors.map(c => `
    <button type="button" class="color-btn ${c.name === state.modalColor.name ? "color-btn--active" : ""}"
            style="--c: ${c.hex}" data-color="${c.name}" aria-label="${c.name}"></button>
  `).join("") + `<span class="color-label" id="colorLabel">${state.modalColor.name}</span>`;
  colorsWrap.querySelectorAll(".color-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      state.modalColor = colors.find(c => c.name === btn.dataset.color);
      renderModalOptions();
    });
  });
}

function bindModalEvents() {
  document.getElementById("modalClose").addEventListener("click", closeProductModal);
  document.getElementById("productModal").addEventListener("click", e => {
    if (e.target.id === "productModal") closeProductModal();
  });
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") {
      closeProductModal();
      Cart.close();
    }
  });

  document.getElementById("optText").addEventListener("input", e => {
    state.modalText = e.target.value;
  });

  const qtyInput = document.getElementById("modalQty");
  document.getElementById("qtyDec").addEventListener("click", () => {
    const current = parseInt(qtyInput.value, 10) || 1;
    const newVal = Math.max(1, current - 1);
    qtyInput.value = newVal;
    state.modalQty = newVal;
    updateModalPrice();
  });
  document.getElementById("qtyInc").addEventListener("click", () => {
    const current = parseInt(qtyInput.value, 10) || 1;
    const newVal = Math.min(99, current + 1);
    qtyInput.value = newVal;
    state.modalQty = newVal;
    updateModalPrice();
  });
  qtyInput.addEventListener("change", e => {
    let val = parseInt(e.target.value, 10);
    if (isNaN(val) || val < 1) val = 1;
    if (val > 99) val = 99;
    e.target.value = val;
    state.modalQty = val;
    updateModalPrice();
  });

  const modalAddBtn = document.getElementById("modalAdd");
  if (typeof CATALOG_MODE !== 'undefined' && CATALOG_MODE) {
    modalAddBtn.innerHTML = `Consultar por WhatsApp`;
    modalAddBtn.addEventListener("click", () => {
      if (!state.modalProduct) return;
      const msg = encodeURIComponent(`Hola ALPA, me interesa: ${state.modalProduct.name} - Talla ${state.modalSize} - Color ${state.modalColor.name} - Cantidad ${state.modalQty}`);
      window.open(`https://wa.me/34663929577?text=${msg}`, '_blank');
    });
  } else {
    document.getElementById("modalAdd").addEventListener("click", () => {
      if (!state.modalProduct) return;
      Cart.add({
        ...state.modalProduct,
        qty: state.modalQty,
        options: {
          size: state.modalSize,
          color: state.modalColor.name,
          text: state.modalText.trim() || null
        }
      });
      closeProductModal();
    });
  }
}

/* FAQ ACCORDION */
function bindFaq() {
  document.querySelectorAll(".faq__q").forEach(btn => {
    btn.addEventListener("click", () => {
      const item = btn.closest(".faq__item");
      const isOpen = item.classList.contains("faq__item--open");
      document.querySelectorAll(".faq__item--open").forEach(i => i.classList.remove("faq__item--open"));
      if (!isOpen) item.classList.add("faq__item--open");
      btn.setAttribute("aria-expanded", !isOpen);
    });
  });
}

function updateModalPrice() {
  if (!state.modalProduct) return;
  const price = state.modalProduct.price;
  const qty = state.modalQty;
  const total = price * qty;
  document.getElementById("modalPrice").innerHTML = qty > 1
    ? `<strong>${total.toFixed(2)} €</strong><span>(${price.toFixed(2)} € x ${qty})</span>`
    : `<strong>${price.toFixed(2)} €</strong><span>IVA incluido</span>`;
}
