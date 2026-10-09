document.addEventListener("DOMContentLoaded", async () => {
  ALPA_COMPONENTS.mount("topbarSlot", ALPA_COMPONENTS.renderTopbar());
  ALPA_COMPONENTS.mount("headerSlot", ALPA_COMPONENTS.renderHeader(false));
  ALPA_COMPONENTS.mount("footerSlot", ALPA_COMPONENTS.renderFooter());
  ALPA_COMPONENTS.mount("whatsappSlot", ALPA_COMPONENTS.renderWhatsApp());
  ALPA_COMPONENTS.mount("cartSlot", ALPA_COMPONENTS.renderCart());
  ALPA_COMPONENTS.mount("toastSlot", ALPA_COMPONENTS.renderToast());
  ALPA_COMPONENTS.mount("cookieSlot", ALPA_COMPONENTS.renderCookieBanner());
  ALPA_COMPONENTS.mount("scrollTopSlot", ALPA_COMPONENTS.renderScrollTop());
  ALPA_COMPONENTS.initNav();
  ALPA_COMPONENTS.initMenuToggle();
  ALPA_COMPONENTS.initSearchMobile();
  ALPA_COMPONENTS.initAccountFavorites();
  ALPA_COMPONENTS.initCookieBanner();
  ALPA_COMPONENTS.initScrollTop();
  try { Cart.init(); } catch(e) {}
  if (typeof AOS !== "undefined") AOS.init({ duration: 700, easing: "ease-out-cubic", once: true, offset: 60 });

  if (!ShopifyAuth.isLoggedIn()) {
    window.location.href = "cuenta.html";
    return;
  }

  // Favoritos: resuelve contra el catálogo vivo
  try {
    if (typeof ALPA_STORE !== "undefined") await ALPA_STORE.refresh();
  } catch (_) {}

  const tabs = document.querySelectorAll(".profile-tab");
  const panels = document.querySelectorAll(".profile-panel");

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("profile-tab--active"));
      panels.forEach(p => p.classList.remove("profile-panel--active"));
      tab.classList.add("profile-tab--active");
      document.getElementById(tab.dataset.panel).classList.add("profile-panel--active");
    });
  });

  document.getElementById("logoutBtn").addEventListener("click", () => {
    ShopifyAuth.logout();
    showToast("Sesión cerrada");
    window.location.href = "cuenta.html";
  });

  loadProfile();
  loadOrders();
  loadFavorites();
});

async function loadProfile() {
  const info = ShopifyAuth.getCustomerInfo();
  const nameEl = document.getElementById("profileName");
  const infoEl = document.getElementById("profileInfo");

  if (!info) {
    if (isShopifyConfigured()) {
      try {
        const fresh = await ShopifyAuth.getCustomer();
        if (fresh) renderProfile(fresh);
        else window.location.href = "cuenta.html";
      } catch { window.location.href = "cuenta.html"; }
    } else {
      nameEl.textContent = "Usuario Demo";
      infoEl.innerHTML = `
        <div class="profile-info__item"><label>Nombre</label><span>Usuario Demo</span></div>
        <div class="profile-info__item"><label>Email</label><span>demo@ejemplo.com</span></div>
      `;
    }
    return;
  }

  renderProfile(info);
}

function renderProfile(customer) {
  document.getElementById("profileName").textContent = customer.firstName || "Usuario";
  document.getElementById("profileInfo").innerHTML = `
    <div class="profile-info__item">
      <label>Nombre</label>
      <span>${escapeHtml(customer.firstName || "")} ${escapeHtml(customer.lastName || "")}</span>
    </div>
    <div class="profile-info__item">
      <label>Email</label>
      <span>${escapeHtml(customer.email || "")}</span>
    </div>
    ${customer.phone ? `<div class="profile-info__item"><label>Teléfono</label><span>${escapeHtml(customer.phone)}</span></div>` : ""}
    ${customer.addresses && customer.addresses.edges.length > 0 ? `
      <div class="profile-info__item">
        <label>Dirección</label>
        <span>${escapeHtml(customer.addresses.edges[0].node.address1 || "")}, ${escapeHtml(customer.addresses.edges[0].node.city || "")}</span>
      </div>
    ` : ""}
  `;
}

function loadOrders() {
  const list = document.getElementById("ordersList");
  const info = ShopifyAuth.getCustomerInfo();

  if (!info || !info.orders || info.orders.edges.length === 0) {
    list.innerHTML = `
      <div class="empty-state">
        <div class="empty-state__icon">📦</div>
        <h3>Aún no tienes pedidos</h3>
        <p>Cuando hagas tu primer pedido, aparecerá aquí</p>
        <a href="index.html" class="btn btn--primary">Explorar productos</a>
      </div>`;
    return;
  }

  list.innerHTML = info.orders.edges.map(edge => {
    const order = edge.node;
    const statusClass = order.financialStatus === "paid" ? "paid" :
                        order.fulfillmentStatus === "fulfilled" ? "fulfilled" : "pending";
    const statusText = order.financialStatus === "paid" ? "Pagado" :
                       order.fulfillmentStatus === "fulfilled" ? "Enviado" : "Pendiente";
    const date = new Date(order.processedAt).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" });
    const items = order.lineItems ? order.lineItems.edges.slice(0, 3).map(e => {
      const img = e.node.variant && e.node.variant.image ? e.node.variant.image.url : "https://placehold.co/36x36/5d768b/fff?text=A";
      return `<div class="order-card__item"><img src="${img}" alt="" /><span>${e.node.quantity}x ${escapeHtml(e.node.title)}</span></div>`;
    }).join("") : "";

    return `
      <div class="order-card">
        <div class="order-card__head">
          <div>
            <div class="order-card__name">${escapeHtml(order.name)}</div>
            <div style="font-size:13px;color:var(--muted)">${date}</div>
          </div>
          <span class="order-card__status order-card__status--${statusClass}">${statusText}</span>
        </div>
        <div class="order-card__items">${items}</div>
        <div class="order-card__foot">
          <span>${order.totalPrice.amount} ${order.totalPrice.currencyCode}</span>
          <span class="order-card__total">${parseFloat(order.totalPrice.amount).toFixed(2)} €</span>
        </div>
      </div>`;
  }).join("");
}

function loadFavorites() {
  const list = document.getElementById("favoritesList");

  try {
    const favs = JSON.parse(localStorage.getItem("alpa_favorites") || "[]");
    
    if (favs.length === 0) {
      list.innerHTML = `
        <div class="empty-state">
          <div class="empty-state__icon">♥</div>
          <h3>Sin favoritos aún</h3>
          <p>Guarda productos que te gusten para verlos más tarde</p>
          <a href="index.html" class="btn btn--primary">Explorar productos</a>
        </div>`;
      return;
    }

    list.innerHTML = `<div class="fav-grid">${favs.map(favId => {
      const product = PRODUCTS.find(p => String(p.id) === String(favId));
      if (!product) return "";
      return `
        <article class="product-card" data-id="${product.id}">
          <div class="product-card__img">
            <img src="${product.img}" alt="${escapeHtml(product.name)}" width="600" height="600" loading="lazy" />
          </div>
          <div class="product-card__body">
            <h3 class="product-card__name">${escapeHtml(product.name)}</h3>
            <div class="product-card__foot">
              <span class="product-card__price">${product.price.toFixed(2)} €</span>
            </div>
          </div>
        </article>`;
    }).join("")}</div>`;
  } catch {
    list.innerHTML = `<div class="empty-state"><p>No hay favoritos guardados</p></div>`;
  }
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]));
}
