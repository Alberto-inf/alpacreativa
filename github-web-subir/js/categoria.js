const CATEGORY_META = {
  "ropa": { lead: "Camisetas, sudaderas, chaquetas y todo tipo de prendas personalizadas con tu diseño o bordado." },
  "laboral": { lead: "Uniformes, polos, camisas y ropa de trabajo con bordado corporativo. Calidad que se nota." },
  "linea-deportiva": { lead: "Chandals, equipaciones, mochilas y accesorios deportivos personalizados para equipos y clubs." },
  "hogar": { lead: "Toallas bordadas, albornoces, cojines y tazas personalizadas. Regalos únicos para tu hogar." },
  "complementos": { lead: "Bolsas, neceseres, llaveros, tazas y todo tipo de accesorios con tu diseño personalizado." },
  "colecciones": { lead: " Packs familiares, despedidas de soltero, colecciones temáticas y mucho más." },
  "fechas-especiales": { lead: "Navidad, San Valentín, Halloween y cualquier fecha especial con productos personalizados." },
  "bordados-personalizados": { lead: "Bordado artesanal a medida para cualquier prenda. Calidad profesional garantizada." },
  "outlet": { lead: "Últimas unidades a precios especiales. Aprovecha los descuentos en productos personalizados." },
  "novedades": { lead: "Descubre lo último en personalización textil. Nuevos productos y tendencias." },
  "ediciones-especiales": { lead: "Ediciones limitadas y colecciones exclusivas que no encontrarás en ningún otro sitio." }
};

const state = {
  currentCategory: null,
  currentSubcategory: "all",
  searchQuery: "",
  modalProduct: null,
  modalSize: "M",
  modalColor: null,
  modalText: "",
  modalQty: 1
};

document.addEventListener("DOMContentLoaded", async () => {
  if (typeof CATALOG_MODE !== 'undefined' && CATALOG_MODE) document.body.classList.add('catalog-mode');
  const params = new URLSearchParams(window.location.search);
  const slug = params.get("cat");

  if (!slug) {
    window.location.href = "index.html";
    return;
  }

  const cat = CATEGORIES.find(c => c.slug === slug);
  if (!cat) {
    window.location.href = "index.html";
    return;
  }

  ALPA_COMPONENTS.mount("topbarSlot", ALPA_COMPONENTS.renderTopbar());
  ALPA_COMPONENTS.mount("headerSlot", ALPA_COMPONENTS.renderHeader(true));
  ALPA_COMPONENTS.mount("footerSlot", ALPA_COMPONENTS.renderFooter());
  ALPA_COMPONENTS.mount("whatsappSlot", ALPA_COMPONENTS.renderWhatsApp());
  ALPA_COMPONENTS.mount("cartSlot", ALPA_COMPONENTS.renderCart());
  ALPA_COMPONENTS.mount("modalSlot", ALPA_COMPONENTS.renderModal());
  ALPA_COMPONENTS.mount("toastSlot", ALPA_COMPONENTS.renderToast());
  ALPA_COMPONENTS.mount("cookieSlot", ALPA_COMPONENTS.renderCookieBanner());
  ALPA_COMPONENTS.mount("scrollTopSlot", ALPA_COMPONENTS.renderScrollTop());
  ALPA_COMPONENTS.initNav();
  ALPA_COMPONENTS.initMenuToggle();
  ALPA_COMPONENTS.initSearchMobile();
  ALPA_COMPONENTS.initAccountFavorites();
  ALPA_COMPONENTS.initCookieBanner();
  ALPA_COMPONENTS.initScrollTop();

  state.currentCategory = cat;
  renderBreadcrumb(cat, null);
  renderHero(cat);
  renderSubcategoryFilter(cat);
  // Catálogo vivo desde Supabase (vacío hasta que ella cree productos)
  try {
    if (typeof ALPA_STORE !== "undefined") await ALPA_STORE.refresh();
  } catch (_) {}
  renderProducts();
  bindUI();
  bindModalEvents();
  if (typeof CATALOG_MODE === 'undefined' || !CATALOG_MODE) Cart.init();
  initAOS();
});

function initAOS() {
  if (typeof AOS !== "undefined") {
    AOS.init({ duration: 700, easing: "ease-out-cubic", once: true, offset: 60 });
  }
}

function renderBreadcrumb(cat, subcategory) {
  const list = document.getElementById("breadcrumbList");
  if (!list) return;

  let html = `
    <li class="breadcrumb__item">
      <a href="index.html" class="breadcrumb__link">Inicio</a>
    </li>
    <li class="breadcrumb__item">
      <a href="categoria.html?cat=${cat.slug}" class="breadcrumb__link">${cat.name}</a>
    </li>`;

  if (subcategory && subcategory !== "all") {
    html += `
    <li class="breadcrumb__item">
      <span class="breadcrumb__current">${subcategory}</span>
    </li>`;
  } else {
    html = `
    <li class="breadcrumb__item">
      <a href="index.html" class="breadcrumb__link">Inicio</a>
    </li>
    <li class="breadcrumb__item">
      <span class="breadcrumb__current">${cat.name}</span>
    </li>`;
  }

  list.innerHTML = html;

  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Inicio",
        "item": "https://alpacreativa.es/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": cat.name,
        "item": `https://alpacreativa.es/categoria.html?cat=${cat.slug}`
      }
    ]
  };

  if (subcategory && subcategory !== "all") {
    schema.itemListElement.push({
      "@type": "ListItem",
      "position": 3,
      "name": subcategory,
      "item": window.location.href
    });
  }

  const existingSchema = document.querySelector('script[type="application/ld+json"][data-breadcrumb]');
  if (existingSchema) existingSchema.remove();
  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.setAttribute("data-breadcrumb", "true");
  script.textContent = JSON.stringify(schema);
  document.head.appendChild(script);
}

/* NAVBAR — now handled by ALPA_COMPONENTS.initNav() */

function renderHero(cat) {
  const meta = CATEGORY_META[cat.slug] || { lead: "Encuentra exactamente lo que necesitas." };
  const icon = (CATEGORY_ICONS[cat.slug] && CATEGORY_ICONS[cat.slug].large) || CATEGORY_ICONS["ropa"].large;

  const canonicalUrl = `https://alpacreativa.es/categoria.html?cat=${cat.slug}`;
  document.getElementById("pageTitle").textContent = `${cat.name} · ALPA Creativa`;
  document.getElementById("pageDesc").content = meta.lead;
  document.getElementById("ogTitle").content = `${cat.name} · ALPA Creativa`;
  document.getElementById("ogDesc").content = meta.lead;
  const ogUrl = document.getElementById("ogUrl");
  if (ogUrl) ogUrl.content = canonicalUrl;
  const canonical = document.getElementById("canonicalUrl");
  if (canonical) canonical.href = canonicalUrl;

  document.getElementById("catEyebrow").textContent = cat.name;
  document.getElementById("catTitle").innerHTML = `${cat.name}, <em>hechos a medida</em>`;
  document.getElementById("catLead").textContent = meta.lead;
  document.getElementById("catIcon").innerHTML = icon;

  const subsWrap = document.getElementById("catSubs");
  if (cat.sub && cat.sub.length > 0) {
    subsWrap.innerHTML = cat.sub.map(s =>
      `<span class="cat-hero__sub" data-sub="${s}">${s}</span>`
    ).join("");
    subsWrap.querySelectorAll(".cat-hero__sub").forEach(el => {
      el.addEventListener("click", () => {
        state.currentSubcategory = el.dataset.sub;
        document.getElementById("subcategoryFilter").value = el.dataset.sub;
        renderProducts();
      });
    });
  } else {
    subsWrap.style.display = "none";
  }
}

function renderSubcategoryFilter(cat) {
  const sel = document.getElementById("subcategoryFilter");
  if (cat.sub && cat.sub.length > 0) {
    cat.sub.forEach(s => {
      const opt = document.createElement("option");
      opt.value = s;
      opt.textContent = s;
      sel.appendChild(opt);
    });
    sel.style.display = "";
  } else {
    sel.style.display = "none";
  }
  sel.addEventListener("change", e => {
    state.currentSubcategory = e.target.value;
    renderProducts();
  });
}

function renderProducts() {
  const grid = document.getElementById("productsGrid");
  const title = document.getElementById("productsTitle");
  const count = document.getElementById("productCount");

  let list = PRODUCTS.filter(p => p.category === state.currentCategory.slug);

  if (state.currentSubcategory !== "all") {
    list = list.filter(p => p.subcategory === state.currentSubcategory);
    title.textContent = state.currentSubcategory;
    renderBreadcrumb(state.currentCategory, state.currentSubcategory);
  } else {
    title.textContent = state.currentCategory.name;
    renderBreadcrumb(state.currentCategory, null);
  }

  if (state.searchQuery) {
    const q = state.searchQuery.toLowerCase();
    list = list.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      (p.subcategory && p.subcategory.toLowerCase().includes(q))
    );
  }

  count.textContent = `${list.length} producto${list.length !== 1 ? "s" : ""}`;

  if (list.length === 0) {
    const isEmptyCat = !state.searchQuery && state.currentSubcategory === "all";
    grid.innerHTML = isEmptyCat ? `
      <div style="grid-column:1/-1;text-align:center;padding:80px 20px;color:var(--muted);">
        <div style="font-size:56px;margin-bottom:16px;">🧵</div>
        <h3 style="font-family:'Playfair Display',serif;color:var(--ink);margin-bottom:8px;">Estamos preparando esta categoría</h3>
        <p>Muy pronto verás aquí los productos. Escríbenos por WhatsApp y te ayudamos.</p>
      </div>` : `
      <div style="grid-column:1/-1;text-align:center;padding:80px 20px;color:var(--muted);">
        <div style="font-size:56px;margin-bottom:16px;">🔍</div>
        <h3 style="font-family:'Playfair Display',serif;color:var(--ink);margin-bottom:8px;">Sin resultados</h3>
        <p>Prueba con otra búsqueda o subcategoría.</p>
      </div>`;
    return;
  }

  const isCatalog = typeof CATALOG_MODE !== 'undefined' && CATALOG_MODE;
  grid.innerHTML = list.map((p, i) => {
    const priceHtml = isCatalog
      ? (p.price != null ? `<small>A partir de:</small> ${p.price.toFixed(2)} €` : `Consultar precio`)
      : `${p.price != null ? p.price.toFixed(2) : '--'} €`;
    return `
    <article class="product-card" data-id="${p.id}" data-aos="fade-up" data-aos-delay="${(i % 4) * 80}">
      <div class="product-card__img">
        ${p.subcategory ? '<span class="product-card__tag">' + p.subcategory + '</span>' : ''}
        ${(p.images && p.images.length > 1) ? `<span class="product-card__count">📷 ${p.images.length}</span>` : ''}
        <img src="${p.img}" alt="${p.name}" width="600" height="600" loading="lazy" onerror="this.src='https://placehold.co/400x400/5d768b/f8efe5?text=ALPA'" />
      </div>
      <div class="product-card__body">
        <div class="product-card__cat">${state.currentCategory.name}</div>
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

function getCategoryName(slug) {
  const c = CATEGORIES.find(c => c.slug === slug);
  return c ? c.name : "";
}

function bindUI() {
  const searchInput = document.getElementById("searchInput");
  let t;
  searchInput.addEventListener("input", e => {
    clearTimeout(t);
    t = setTimeout(() => {
      state.searchQuery = e.target.value.trim();
      renderProducts();
      if (state.searchQuery) {
        document.getElementById("productos").scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 200);
  });
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

  if (window.ALPA_COMPONENTS && ALPA_COMPONENTS.paintModalGallery) ALPA_COMPONENTS.paintModalGallery(product);
  else {
    document.getElementById("modalImg").src = product.img;
    document.getElementById("modalImg").alt = product.name;
  }
  document.getElementById("modalTitle").textContent = product.name;
  document.getElementById("modalCat").textContent = getCategoryName(product.category);
  document.getElementById("modalDesc").textContent = product.description;
  const isCatalogM = typeof CATALOG_MODE !== 'undefined' && CATALOG_MODE;
  const modalPriceEl = document.getElementById("modalPrice");
  if (isCatalogM) {
    modalPriceEl.innerHTML = product.price != null ? `<small>A partir de:</small> <strong>${product.price.toFixed(2)} €</strong><span>IVA incluido</span>` : `<strong>Consultar precio</strong><span>Pide presupuesto sin compromiso</span>`;
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
    if (e.key === "Escape") { closeProductModal(); Cart.close(); }
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
    modalAddBtn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg> Consultar por WhatsApp`;
    modalAddBtn.addEventListener("click", () => {
      if (!state.modalProduct) return;
      const msg = encodeURIComponent(`Hola ALPA Creativa, me interesa: ${state.modalProduct.name} - Talla ${state.modalSize} - Color ${state.modalColor.name} - Cantidad ${state.modalQty}${state.modalText ? ' - Texto: '+state.modalText : ''}. ¿Me podéis dar precio y disponibilidad?`);
      window.open(`https://wa.me/34663929577?text=${msg}`, '_blank');
    });
  } else {
    modalAddBtn.addEventListener("click", () => {
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

function updateModalPrice() {
  if (!state.modalProduct) return;
  const price = state.modalProduct.price;
  const qty = state.modalQty;
  const total = price * qty;
  document.getElementById("modalPrice").innerHTML = qty > 1
    ? `<strong>${total.toFixed(2)} €</strong><span>(${price.toFixed(2)} € x ${qty})</span>`
    : `<strong>${price.toFixed(2)} €</strong><span>IVA incluido</span>`;
}
