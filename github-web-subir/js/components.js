const ALPA_COMPONENTS = {
  renderTopbar() {
    return `
    <div class="topbar">
      <div class="container topbar__inner">
        <span>Envío gratis a partir de 60€</span>
        <span class="topbar__sep">·</span>
        <span>Personalización con tu diseño</span>
        <span class="topbar__sep">·</span>
        <a href="tel:+34663929577" style="color:inherit;text-decoration:none;font-weight:600">📞 +34 663 929 577</a>
      </div>
    </div>`;
  },

  renderHeader(isCategoryPage) {
    const logoHref = isCategoryPage ? "index.html" : "#";
    const catalogCls = (typeof CATALOG_MODE !== 'undefined' && CATALOG_MODE) ? ' catalog-mode' : '';
    // modo catálogo: se oculta carrito y cuenta vía CSS .catalog-mode
    return `
    <header class="header${catalogCls}">
      <div class="container header__inner">
        <a href="${logoHref}" class="logo">
            <img src="img/logoalpa.jpeg" alt="ALPA Creativa" class="logo__mark" width="46" height="46" />
          <span class="logo__text">ALPA<small>CREATIVA</small></span>
        </a>
        <form class="search" role="search" onsubmit="return false">
          <span class="search__icon" aria-hidden="true"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg></span>
          <input type="search" id="searchInput" placeholder="Buscar productos, categorías..." aria-label="Buscar" />
        </form>
        <div class="header__actions">
          <button class="icon-btn search-toggle-mobile" id="searchToggleMobile" aria-label="Buscar"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg></button>
          <button class="icon-btn" id="accountBtn" aria-label="Cuenta"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></button>
          <button class="icon-btn" id="favoritesBtn" aria-label="Favoritos"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z"/></svg></button>
          <button class="icon-btn cart-btn" id="cartBtn" aria-label="Carrito"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg><span class="cart-badge" id="cartBadge">0</span></button>
          <button class="icon-btn menu-toggle" id="menuToggle" aria-label="Menú"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg></button>
        </div>
      </div>
      <nav class="navbar" id="navbar">
        <div class="container navbar__inner">
          <ul class="nav" id="navList"></ul>
        </div>
      </nav>
    </header>`;
  },

  // 8 botones visibles. Colecciones agrupa los 3 antiguos para limpiar navbar
  // Novedades | Línea Deportiva | Laboral | Ropa | Colecciones ▾ | Bordados | Complementos | Outlet
  // Colecciones ▾ = Colecciones + Ediciones Especiales + Fechas Especiales + Hogar
  renderNav() {
    const NAV = [
      { label: "Novedades", slug: "novedades" },
      { label: "Línea Deportiva", slug: "linea-deportiva" },
      { label: "Laboral", slug: "laboral" },
      { label: "Ropa", slug: "ropa" },
      {
        label: "Colecciones",
        slug: "colecciones",
        isDropdown: true,
        children: [
          { label: "Ver todo — Colecciones", slug: "colecciones", isMain: true },
          { label: "Ediciones Especiales", slug: "ediciones-especiales" },
          { label: "Fechas Especiales", slug: "fechas-especiales" },
          { label: "Hogar", slug: "hogar" }
        ]
      },
      { label: "Bordados Personalizados", slug: "bordados-personalizados" },
      { label: "Complementos", slug: "complementos" },
      { label: "Outlet", slug: "outlet" }
    ];

    const caret = `<svg class="nav__caret" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>`;

    return NAV.map(item => {
      const href = `categoria.html?cat=${item.slug}`;
      if (item.isDropdown) {
        const sub = item.children.map(c => {
          const chref = `categoria.html?cat=${c.slug}`;
          const cls = c.isMain ? ` class="nav__sub--main"` : "";
          return `<a href="${chref}"${cls} data-subcat="${c.slug}">${c.label}</a>`;
        }).join("");
        return `<li class="nav__item nav__item--has-sub" data-cat="${item.slug}" data-has-children="${item.children.map(c=>c.slug).join(',')}">
          <a href="${href}" class="nav__link">${item.label} ${caret}</a>
          <div class="nav__sub">${sub}</div>
        </li>`;
      }
      return `<li class="nav__item" data-cat="${item.slug}"><a href="${href}" class="nav__link">${item.label}</a></li>`;
    }).join("");
  },

  renderFooter() {
    return `
    <footer class="footer">
      <div class="container footer__grid">
        <div class="footer__brand">
          <div class="logo logo--footer">
            <img src="img/logoalpa.jpeg" alt="ALPA Creativa" class="logo__mark" width="46" height="46" />
            <span class="logo__text">ALPA<small>CREATIVA</small></span>
          </div>
          <p>Personalización textil y bordados de alta calidad. Natural, auténtica, atemporal.</p>
          <div class="footer__social">
            <a href="#" aria-label="Instagram" id="socialInstagram"><!-- TODO: añadir URL --><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg></a>
            <a href="#" aria-label="Facebook" id="socialFacebook"><!-- TODO: añadir URL --><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg></a>
            <a href="#" aria-label="TikTok" id="socialTikTok"><!-- TODO: añadir URL --><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.69a8.16 8.16 0 0 0 4.77 1.52V6.78a4.85 4.85 0 0 1-1.84-.09Z"/></svg></a>
          </div>
        </div>
        <div>
          <h4>Categorías</h4>
          <ul>
            <li><a href="categoria.html?cat=linea-deportiva">Línea Deportiva</a></li>
            <li><a href="categoria.html?cat=laboral">Laboral</a></li>
            <li><a href="categoria.html?cat=ropa">Ropa</a></li>
            <li><a href="categoria.html?cat=hogar">Hogar</a></li>
            <li><a href="categoria.html?cat=bordados-personalizados">Bordados</a></li>
          </ul>
        </div>
        <div>
          <h4>Ayuda</h4>
          <ul>
            <li><a href="index.html#proceso">Cómo comprar</a></li>
            <li><a href="#"><!-- TODO: añadir página de envíos -->Envíos</a></li>
            <li><a href="#"><!-- TODO: añadir página de devoluciones -->Devoluciones</a></li>
          </ul>
        </div>
        <div>
          <h4>Contacto</h4>
          <ul class="footer__contact">
            <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg> <a href="formulario.html" style="text-decoration:underline; text-underline-offset:3px">alpacreativa2@gmail.com</a></li>
            <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg> <a href="tel:+34663929577" style="text-decoration:underline;text-underline-offset:3px">+34 663 929 577</a></li>
            <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg> España · Península y Baleares</li>
          </ul>
        </div>
      </div>
      <div class="footer__bottom">
        <p>© 2026 ALPA Creativa · Todos los derechos reservados · <a href="#"><!-- TODO: añadir página -->Política de privacidad</a> · <a href="#"><!-- TODO: añadir página -->Aviso legal</a></p>
      </div>
    </footer>`;
  },

  renderWhatsApp() {
    return `
    <a href="https://wa.me/34663929577" class="fab-whatsapp" target="_blank" rel="noopener" aria-label="Contactar por WhatsApp">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
    </a>`;
  },

  renderCart() {
    return `
    <div class="cart-overlay" id="cartOverlay"></div>
    <aside class="cart-drawer" id="cartDrawer" aria-hidden="true">
      <div class="cart-drawer__head">
        <h3>Tu carrito</h3>
        <button class="icon-btn" id="cartClose" aria-label="Cerrar"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg></button>
      </div>
      <div class="cart-drawer__body" id="cartBody"></div>
      <div class="cart-drawer__foot" id="cartFoot">
        <div class="cart-total"><span>Total</span><strong id="cartTotal">0,00 €</strong></div>
        <button class="btn btn--primary btn--block" id="checkoutBtn">Finalizar compra</button>
        <button class="btn btn--ghost btn--block" id="clearCartBtn">Vaciar carrito</button>
      </div>
    </aside>`;
  },

  renderModal() {
    return `
    <div class="modal-overlay" id="productModal" aria-hidden="true">
      <div class="modal" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
        <button class="modal__close" id="modalClose" aria-label="Cerrar"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg></button>
        <div class="modal__grid">
          <div class="modal__media"><img id="modalImg" src="" alt="" width="600" height="600" /><span class="modal__tag" id="modalTag"></span><div class="modal__thumbs" id="modalThumbs"></div></div>
          <div class="modal__info">
            <span class="modal__cat" id="modalCat"></span>
            <h2 id="modalTitle"></h2>
            <p class="modal__desc" id="modalDesc"></p>
            <div class="modal__price"><strong id="modalPrice"></strong><span>IVA incluido</span></div>
            <div class="opt"><label>Talla</label><div class="opt__sizes" id="optSizes"></div></div>
            <div class="opt"><label>Color</label><div class="opt__colors" id="optColors"></div></div>
            <div class="opt">
              <label>Cantidad</label>
              <div class="modal__qty">
                <button type="button" class="modal__qty-btn" id="qtyDec" aria-label="Reducir cantidad">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/></svg>
                </button>
                <input type="number" id="modalQty" value="1" min="1" max="99" class="modal__qty-input" />
                <button type="button" class="modal__qty-btn" id="qtyInc" aria-label="Aumentar cantidad">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
                </button>
              </div>
            </div>
            <div class="opt"><label for="optText">Texto o número a bordar <small>(opcional)</small></label><input type="text" id="optText" maxlength="20" placeholder="Ej: Tu nombre, dorsal 10, etc." /></div>
            <div class="modal__cta">
              <button class="btn btn--primary btn--block" id="modalAdd"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg> Añadir al carrito</button>
              <p class="modal__hint">Revisamos tu diseño antes de producir. Te contactamos por WhatsApp.</p>
            </div>
          </div>
        </div>
      </div>
    </div>`;
  },

  renderToast() {
    return `<div class="toast" id="toast" role="status" aria-live="polite"></div>`;
  },

  paintModalGallery(product) {
    const imgs = (product && Array.isArray(product.images) && product.images.length)
      ? product.images.filter(Boolean)
      : (product && product.img ? [product.img] : []);
    const main = document.getElementById("modalImg");
    const thumbs = document.getElementById("modalThumbs");
    if (main && imgs.length) {
      main.src = imgs[0];
      main.alt = (product && product.name) || "";
    }
    if (!thumbs) return;
    if (imgs.length < 2) {
      thumbs.innerHTML = "";
      thumbs.style.display = "none";
      return;
    }
    thumbs.style.display = "";
    thumbs.innerHTML = imgs.map((u, i) =>
      `<button type="button" data-thumb="${i}" class="${i === 0 ? "modal__thumb--active" : ""}" aria-label="Ver foto ${i + 1}"><img src="${u}" alt="" loading="lazy" /></button>`
    ).join("");
    thumbs.querySelectorAll("[data-thumb]").forEach((b) =>
      b.addEventListener("click", (ev) => {
        ev.stopPropagation();
        const i = Number(b.dataset.thumb);
        if (main && imgs[i]) main.src = imgs[i];
        thumbs.querySelectorAll("[data-thumb]").forEach((x) =>
          x.classList.toggle("modal__thumb--active", x === b));
      })
    );
  },

  renderCookieBanner() {
    return `
    <div class="cookie-banner" id="cookieBanner" role="dialog" aria-label="Aviso de cookies">
      <div class="cookie-banner__inner">
        <div class="cookie-banner__text">
          <strong>Usamos cookies</strong>
          <p>Utilizamos cookies para mejorar tu experiencia y analizar el tráfico. Puedes aceptarlas o rechazarlas. <a href="#" id="cookieMoreInfo"><!-- TODO: añadir página -->Más información</a></p>
        </div>
        <div class="cookie-banner__actions">
          <button class="btn btn--primary" id="cookieAccept">Aceptar</button>
          <button class="btn btn--ghost" id="cookieReject">Rechazar</button>
        </div>
      </div>
    </div>`;
  },

  renderScrollTop() {
    return `
    <button class="scroll-top" id="scrollTop" aria-label="Volver arriba">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6"/></svg>
    </button>`;
  },

  renderLightbox() {
    return `
    <div class="lightbox" id="lightbox" aria-hidden="true">
      <span class="lightbox__counter" id="lightboxCounter"></span>
      <button class="lightbox__close" id="lightboxClose" aria-label="Cerrar">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
      </button>
      <button class="lightbox__nav lightbox__nav--prev" id="lightboxPrev" aria-label="Anterior">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
      </button>
      <img class="lightbox__img" id="lightboxImg" src="" alt="" />
      <button class="lightbox__nav lightbox__nav--next" id="lightboxNext" aria-label="Siguiente">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
      </button>
      <div class="lightbox__caption" id="lightboxCaption"></div>
    </div>`;
  },

  mount(targetId, html) {
    const el = document.getElementById(targetId);
    if (el) el.innerHTML = html;
  },

  initNav() {
    const navList = document.getElementById("navList");
    if (navList) {
      navList.innerHTML = this.renderNav();
      // Click en "Colecciones ▾" abre/cierra desplegable (hover también funciona) y no navega directo — usa "Ver todo — Colecciones"
      navList.querySelectorAll(".nav__item--has-sub > .nav__link").forEach(a => {
        a.addEventListener("click", (e) => {
          e.preventDefault();
          const li = a.closest(".nav__item");
          const isOpen = li.classList.contains("nav__item--open");
          navList.querySelectorAll(".nav__item--open").forEach(o => { if (o !== li) o.classList.remove("nav__item--open"); });
          li.classList.toggle("nav__item--open", !isOpen);
        });
      });
      // Marcar activo según ?cat= actual (ej. linea-deportiva → botón subrayado)
      const cat = new URLSearchParams(window.location.search).get("cat");
      if (cat) {
        navList.querySelectorAll(".nav__item").forEach(li => {
          const slug = li.dataset.cat;
          const children = (li.dataset.hasChildren || "").split(",").filter(Boolean);
          const isActive = slug === cat || children.includes(cat);
          li.classList.toggle("nav__item--active", isActive);
          if (isActive && children.includes(cat)) {
            const subLink = li.querySelector(`[data-subcat="${cat}"]`);
            if (subLink) subLink.style.cssText = "background:var(--accent-soft);color:var(--primary);font-weight:600";
          }
        });
      }
      // Cerrar al click fuera
      document.addEventListener("click", (e) => {
        if (!e.target.closest(".nav__item--has-sub")) {
          navList.querySelectorAll(".nav__item--open").forEach(o => o.classList.remove("nav__item--open"));
        }
      });
    }
  },

  initMenuToggle() {
    const btn = document.getElementById("menuToggle");
    const nav = document.getElementById("navbar");
    if (btn && nav) {
      btn.addEventListener("click", () => nav.classList.toggle("navbar--open"));
    }
  },

  initSearchMobile() {
    const btn = document.getElementById("searchToggleMobile");
    if (!btn) return;
    btn.addEventListener("click", () => {
      const header = document.querySelector(".header");
      if (!header) return;
      header.classList.toggle("header--search-open");
      if (header.classList.contains("header--search-open")) {
        const input = document.getElementById("searchInput");
        if (input) setTimeout(() => input.focus(), 150);
      }
    });
  },

  initAccountFavorites() {
    const accountBtn = document.getElementById("accountBtn");
    const favBtn = document.getElementById("favoritesBtn");
    if (accountBtn) {
      accountBtn.addEventListener("click", () => {
        showToast("Cuentas de usuario — Próximamente");
      });
    }
    if (favBtn) {
      favBtn.addEventListener("click", () => {
        showToast("Favoritos — Próximamente");
      });
    }
  },

  initCookieBanner() {
    if (localStorage.getItem("alpa_cookies") !== null) return;
    const banner = document.getElementById("cookieBanner");
    if (!banner) return;
    banner.classList.add("cookie-banner--show");
    document.getElementById("cookieAccept").addEventListener("click", () => {
      localStorage.setItem("alpa_cookies", "accepted");
      banner.classList.remove("cookie-banner--show");
    });
    document.getElementById("cookieReject").addEventListener("click", () => {
      localStorage.setItem("alpa_cookies", "rejected");
      banner.classList.remove("cookie-banner--show");
    });
  },

  initScrollTop() {
    const btn = document.getElementById("scrollTop");
    if (!btn) return;
    
    const toggleButton = () => {
      if (window.scrollY > 400) {
        btn.classList.add("scroll-top--visible");
      } else {
        btn.classList.remove("scroll-top--visible");
      }
    };

    window.addEventListener("scroll", toggleButton, { passive: true });
    
    btn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    toggleButton();
  },

  initLightbox() {
    const galleryGrid = document.getElementById("galleryGrid");
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightboxImg");
    const lightboxCaption = document.getElementById("lightboxCaption");
    const lightboxCounter = document.getElementById("lightboxCounter");
    
    if (!galleryGrid || !lightbox) return;

    let currentIndex = 0;
    let images = [];

    const updateImages = () => {
      const items = galleryGrid.querySelectorAll(".gallery__item");
      images = Array.from(items).map(item => {
        const img = item.querySelector("img");
        const label = item.querySelector(".gallery__label");
        return {
          src: img ? img.src.replace("w=600&h=600", "w=1200&h=1200") : "",
          alt: img ? img.alt : "",
          label: label ? label.textContent : ""
        };
      });
    };

    const openLightbox = (index) => {
      updateImages();
      currentIndex = index;
      updateLightbox();
      lightbox.classList.add("lightbox--open");
      lightbox.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    };

    const closeLightbox = () => {
      lightbox.classList.remove("lightbox--open");
      lightbox.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    };

    const updateLightbox = () => {
      const img = images[currentIndex];
      if (!img) return;
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightboxCaption.textContent = img.label;
      lightboxCounter.textContent = `${currentIndex + 1} / ${images.length}`;
    };

    const nextImage = () => {
      currentIndex = (currentIndex + 1) % images.length;
      updateLightbox();
    };

    const prevImage = () => {
      currentIndex = (currentIndex - 1 + images.length) % images.length;
      updateLightbox();
    };

    galleryGrid.addEventListener("click", (e) => {
      const item = e.target.closest(".gallery__item");
      if (!item) return;
      const items = Array.from(galleryGrid.querySelectorAll(".gallery__item"));
      const index = items.indexOf(item);
      if (index !== -1) openLightbox(index);
    });

    document.getElementById("lightboxClose").addEventListener("click", closeLightbox);
    document.getElementById("lightboxNext").addEventListener("click", nextImage);
    document.getElementById("lightboxPrev").addEventListener("click", prevImage);

    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener("keydown", (e) => {
      if (!lightbox.classList.contains("lightbox--open")) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
    });
  }
};
