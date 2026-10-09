const CART_KEY = "alpa_cart";

const Cart = {
  items: [],

  init() {
    this.load();
    this.bindUI();
    this.render();
  },

  load() {
    try {
      const raw = localStorage.getItem(CART_KEY);
      this.items = raw ? JSON.parse(raw) : [];
    } catch {
      this.items = [];
    }
  },

  save() {
    localStorage.setItem(CART_KEY, JSON.stringify(this.items));
  },

  getVariantKey(product) {
    const opt = product.options || {};
    return `${product.id}__${opt.size || ""}__${opt.color || ""}__${opt.text || ""}`;
  },

  add(product) {
    const addQty = product.qty || 1;
    const key = this.getVariantKey(product);
    const existing = this.items.find(i => this.getVariantKey(i) === key);
    if (existing) {
      existing.qty += addQty;
    } else {
      this.items.push({
        id: product.id,
        name: product.name,
        price: product.price,
        img: product.img,
        qty: addQty,
        options: product.options || {}
      });
    }
    this.save();
    this.render();
    const qtyText = addQty > 1 ? ` (${addQty} uds.)` : "";
    showToast(`"${product.name}"${qtyText} añadido al carrito`);
  },

  remove(key) {
    this.items = this.items.filter(i => this.getVariantKey(i) !== key);
    this.save();
    this.render();
  },

  updateQty(key, delta) {
    const item = this.items.find(i => this.getVariantKey(i) === key);
    if (!item) return;
    item.qty = Math.max(1, item.qty + delta);
    this.save();
    this.render();
  },

  clear() {
    this.items = [];
    this.save();
    this.render();
  },

  count() {
    return this.items.reduce((s, i) => s + i.qty, 0);
  },

  total() {
    return this.items.reduce((s, i) => s + i.price * i.qty, 0);
  },

  bindUI() {
    document.getElementById("cartBtn").addEventListener("click", this.open);
    document.getElementById("cartClose").addEventListener("click", this.close);
    document.getElementById("cartOverlay").addEventListener("click", this.close);
    document.getElementById("clearCartBtn").addEventListener("click", () => {
      if (this.items.length === 0) return;
      if (confirm("¿Vaciar el carrito?")) this.clear();
    });
    document.getElementById("checkoutBtn").addEventListener("click", () => this.checkout());
  },

  open() {
    document.getElementById("cartDrawer").classList.add("cart-drawer--open");
    document.getElementById("cartOverlay").classList.add("cart-overlay--active");
    document.getElementById("cartDrawer").setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  },

  close() {
    document.getElementById("cartDrawer").classList.remove("cart-drawer--open");
    document.getElementById("cartOverlay").classList.remove("cart-overlay--active");
    document.getElementById("cartDrawer").setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  },

  checkout() {
    if (this.items.length === 0) return;
    const lines = this.items.map(i => {
      const opt = i.options || {};
      const opts = [opt.size, opt.color, opt.text ? `«${opt.text}»` : null].filter(Boolean).join("/");
      return `${i.qty}x ${i.name}${opts ? ` (${opts})` : ""} ${(i.price * i.qty).toFixed(2)}€`;
    }).join(" | ");
    const total = this.total().toFixed(2);
    const msg = `Hola ALPA, quiero hacer un pedido: ${lines} — Total: ${total}€`;
    const url = `https://wa.me/34663929577?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
  },

  render() {
    document.getElementById("cartBadge").textContent = this.count();
    const body = document.getElementById("cartBody");

    if (this.items.length === 0) {
      body.innerHTML = `
        <div class="cart-empty">
          <div class="cart-empty__icon">
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
          </div>
          <p>Tu carrito está vacío</p>
        </div>`;
    } else {
      body.innerHTML = this.items.map(i => {
        const key = this.getVariantKey(i);
        const opt = i.options || {};
        const chips = [];
        if (opt.size) chips.push(`<span class="cart-item__opt-chip">Talla ${opt.size}</span>`);
        if (opt.color) chips.push(`<span class="cart-item__opt-chip">${opt.color}</span>`);
        if (opt.text) chips.push(`<span class="cart-item__opt-chip">«${escapeHtml(opt.text)}»</span>`);
        return `
          <div class="cart-item">
            <img class="cart-item__img" src="${i.img}" alt="${i.name}" />
            <div>
              <div class="cart-item__name">${i.name}</div>
              ${chips.length ? `<div class="cart-item__opts">${chips.join("")}</div>` : ''}
              <div class="cart-item__price">${i.price.toFixed(2)} €</div>
              <div class="cart-item__qty">
                <button class="qty-btn" data-action="dec" data-key="${encodeURIComponent(key)}">−</button>
                <span>${i.qty}</span>
                <button class="qty-btn" data-action="inc" data-key="${encodeURIComponent(key)}">+</button>
              </div>
            </div>
            <button class="cart-item__remove" data-action="remove" data-key="${encodeURIComponent(key)}" aria-label="Eliminar">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            </button>
          </div>
        `;
      }).join("");

      body.querySelectorAll("[data-action]").forEach(btn => {
        const key = decodeURIComponent(btn.dataset.key);
        const action = btn.dataset.action;
        btn.addEventListener("click", () => {
          if (action === "inc") Cart.updateQty(key, 1);
          else if (action === "dec") Cart.updateQty(key, -1);
          else if (action === "remove") Cart.remove(key);
        });
      });
    }

    document.getElementById("cartTotal").textContent = `${this.total().toFixed(2)} €`;
  }
};

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]));
}

function showToast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("toast--show");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => t.classList.remove("toast--show"), 2400);
}
