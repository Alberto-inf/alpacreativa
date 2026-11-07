/* =========================================================
   ALPA Creativa — Panel admin (admin.html)
   - Login con Supabase Auth (email autorizado en admin_emails).
   - Sin claves de Supabase -> MODO DEMO local (localStorage),
     para probar el formulario hoy mismo desde el ordenador.
   - Categorías CERRADAS: solo las de CATEGORIES (js/data.js).
   ========================================================= */
(() => {
  "use strict";

  const CLOUD = isSupabaseConfigured();
  const DEMO_KEY = "alpa_admin_products";
  const BUCKET = "productos";

  // Portada (hero): 4 fotos del inicio, independientes de los productos.
  const HERO_SLOTS = 4;
  const HERO_DEFAULT = [
    "img/imgnuevas/fcbd1b4e-2006-401c-935c-d4e9af1eefb4.JPG",
    "img/imgnuevas/fc746d6d-8390-4207-9755-6e5955724f1c.JPG",
    "img/imgnuevas/990bf987-5538-45df-8df6-d823427fae09.JPG",
    "img/imgnuevas/a66d353c-67b8-4f94-8d7b-e7f039782620.JPG"
  ];
  const HERO_DEMO_KEY = "alpa_admin_hero";

  // Galería del inicio: 12 fotos, independientes de los productos.
  const GALLERY_SLOTS = 12;
  const GALLERY_DEFAULT = [
    "img/imgnuevas/d9aa38fc-6ed4-47e0-afa0-39ca23615e3c.JPG",
    "img/imgnuevas/1edd1695-8fcd-4f89-b0d0-208f9383cb96.JPG",
    "img/imgnuevas/fbb6a138-8eb0-4084-b173-7b888913277b.JPG",
    "img/imgnuevas/ad48659b-bf66-4303-8ada-c4708c894ad1.JPG",
    "img/imgnuevas/7c5a6cf0-46f8-48f2-979d-2d99b08c2476.JPG",
    "img/imgnuevas/8a2e1f80-e0a3-4d6e-9bca-64f31eae8d36.JPG",
    "img/imgnuevas/339b5a42-0e55-4db2-9bfa-547533977785.JPG",
    "img/imgnuevas/f3624da4-dd1c-4f3b-b555-fdc1a393fa5c.JPG",
    "img/imgnuevas/4b5206f1-cfa5-4c71-a0df-5ee95eaaf002.JPG",
    "img/imgnuevas/1a12921b-b68a-4b6f-a856-e2ee5b682cc2.JPG",
    "img/imgnuevas/0a459398-88c9-4071-92f9-6d764d1e03b0.JPG",
    "img/imgnuevas/619687e1-ae8b-42b9-b18a-5cb99e39eee2.JPG"
  ];
  const GALLERY_DEMO_KEY = "alpa_admin_gallery";

  let sb = null;
  let session = null;
  let editingId = null;
  let currentPhotoURLs = ["", ""]; // foto1 (principal) + foto2 (segunda vista)
  let cache = []; // productos cargados
  let pickedColors = []; // colores libres del formulario [{name, hex}]
  let heroURLs = HERO_DEFAULT.slice();
  let heroNew = ["", "", "", ""];
  let heroLoaded = false;
  let galleryURLs = GALLERY_DEFAULT.slice();
  let galleryNew = new Array(GALLERY_SLOTS).fill("");
  let galleryLoaded = false;

  if (CLOUD && window.supabase) {
    sb = window.supabase.createClient(
      SUPABASE_CONFIG.supabaseUrl,
      SUPABASE_CONFIG.supabaseAnonKey
    );
  }

  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]));

  document.addEventListener("DOMContentLoaded", () => {
    mountChrome();
    paintMode();
    buildFixedLists();
    bindAuth();
    bindPanel();
    bindTabs();
    bindHero();
    bindGallery();
    restoreDemoSession();
  });

  function mountChrome() {
    try {
      if (!window.ALPA_COMPONENTS) return;
      ALPA_COMPONENTS.mount("topbarSlot", ALPA_COMPONENTS.renderTopbar());
      ALPA_COMPONENTS.mount("headerSlot", ALPA_COMPONENTS.renderHeader(false));
      ALPA_COMPONENTS.mount("footerSlot", ALPA_COMPONENTS.renderFooter());
      ALPA_COMPONENTS.mount("toastSlot", ALPA_COMPONENTS.renderToast());
      ALPA_COMPONENTS.initNav();
      ALPA_COMPONENTS.initMenuToggle();
      ALPA_COMPONENTS.initCookieBanner();
    } catch (_) {}
  }

  function paintMode() {
    const b = $("modeBadge");
    if (!b) return;
    if (CLOUD) {
      b.textContent = "Conectado a Supabase";
      b.className = "mode-badge cloud";
    } else {
      b.textContent = "Modo demo local — pega las claves para salir a la nube";
      b.className = "mode-badge demo";
    }
  }

  function toast(msg, ok = true) {
    try {
      if (window.ALPA_COMPONENTS && ALPA_COMPONENTS.toast) {
        ALPA_COMPONENTS.toast(msg, ok ? "success" : "error");
        return;
      }
    } catch (_) {}
    alert(msg);
  }

  /* ---------- Listas cerradas ---------- */
  function buildFixedLists() {
    const cats = (typeof CATEGORIES !== "undefined" ? CATEGORIES : []);
    const fCat = $("fCategory");
    const fSub = $("fSubcategory");
    const fCat2 = $("filterCat");
    fCat.innerHTML = cats.map((c) => `<option value="${esc(c.slug)}">${esc(c.name)}</option>`).join("");
    fCat2.innerHTML = `<option value="">Todas las categorías</option>` +
      cats.map((c) => `<option value="${esc(c.slug)}">${esc(c.name)}</option>`).join("");
    refreshSubcategories();

    const sizes = (typeof PRODUCT_SIZES !== "undefined" ? PRODUCT_SIZES : ["XS","S","M","L","XL","XXL","3XL","4XL","5XL"]);
    $("sizesBox").innerHTML = sizes.map((s) =>
      `<label class="check-pill"><input type="checkbox" value="${esc(s)}" /> ${esc(s)}</label>`
    ).join("");

    // Colores libres: sin lista fija, se añaden desde el selector (ver addPickedColor)
    pickedColors = [];
    paintPickedColors();
  }

  function refreshSubcategories(keep = "") {
    const cats = (typeof CATEGORIES !== "undefined" ? CATEGORIES : []);
    const slug = $("fCategory").value;
    const cat = cats.find((c) => c.slug === slug);
    const subs = (cat && cat.sub) || [];
    const box = $("fSubcategory");
    if (!subs.length) {
      box.innerHTML = `<option value="">— Sin subcategorías —</option>`;
      box.disabled = true;
      return;
    }
    box.disabled = false;
    box.innerHTML = subs.map((s) => `<option value="${esc(s)}">${esc(s)}</option>`).join("");
    if (keep && subs.includes(keep)) box.value = keep;
  }

  function catName(slug) {
    const cats = (typeof CATEGORIES !== "undefined" ? CATEGORIES : []);
    const c = cats.find((x) => x.slug === slug);
    return c ? c.name : slug;
  }

  /* ---------- Colores libres (paleta completa, sin límite) ---------- */
  function paintPickedColors() {
    const box = $("colorsBox");
    if (!pickedColors.length) {
      box.innerHTML = `<span style="font-size:13px;color:var(--muted)">Sin colores todavía. Elige en el selector, ponle nombre y pulsa “+ Añadir color”.</span>`;
      return;
    }
    box.innerHTML = pickedColors.map((c) =>
      `<span class="check-pill" style="cursor:default">` +
      `<span class="dot" style="background:${esc(c.hex)}"></span> ${esc(c.name)}` +
      ` <small style="color:var(--muted)">${esc(c.hex)}</small>` +
      ` <button type="button" data-delcolor="${esc(c.hex)}" aria-label="Quitar ${esc(c.name)}"` +
      ` style="border:none;background:none;cursor:pointer;font-size:15px;line-height:1;color:#c0392b;font-weight:700">×</button></span>`
    ).join("");
    box.querySelectorAll("[data-delcolor]").forEach((b) =>
      b.addEventListener("click", () => {
        pickedColors = pickedColors.filter((c) => c.hex.toLowerCase() !== b.dataset.delcolor.toLowerCase());
        paintPickedColors();
      })
    );
  }

  function addPickedColor() {
    const hex = ($("colorPicker").value || "").toLowerCase();
    let name = ($("colorName").value || "").trim();
    if (!/^#[0-9a-f]{6}$/.test(hex)) {
      toast("Elige un color del selector.", false);
      return;
    }
    if (!name) name = hex.toUpperCase();
    if (pickedColors.some((c) => c.hex.toLowerCase() === hex)) {
      toast("Ese color ya está añadido.", false);
      return;
    }
    pickedColors.push({ name, hex });
    $("colorName").value = "";
    paintPickedColors();
  }

  /* ---------- Auth ---------- */
  function bindAuth() {
    $("adminLoginForm").addEventListener("submit", onLogin);
  }

  async function onLogin(e) {
    e.preventDefault();
    const email = $("adminEmail").value.trim().toLowerCase();
    const pass = $("adminPass").value;
    $("loginError").textContent = "";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      $("loginError").textContent = "Introduce un email válido.";
      return;
    }
    if (!pass) {
      $("loginError").textContent = "Introduce tu contraseña.";
      return;
    }
    $("loginBtn").disabled = true;
    try {
      if (CLOUD) {
        const { data, error } = await sb.auth.signInWithPassword({ email, password: pass });
        if (error) throw error;
        session = data.session;
        const allowed = await isAdminEmail(email);
        if (!allowed) {
          await sb.auth.signOut();
          session = null;
          throw new Error("Este email no está autorizado en admin_emails. Añádelo con el SQL del PASO 5.");
        }
      } else {
        // DEMO: cualquier email + 6 caracteres vale, solo en este ordenador
        if (pass.length < 6) throw new Error("En demo la contraseña debe tener 6+ caracteres.");
        session = { demo: true, email };
        try { localStorage.setItem("alpa_admin_demo", email); } catch (_) {}
      }
      enterPanel();
      await reloadList();
    } catch (err) {
      $("loginError").textContent = err.message || "No se pudo entrar.";
    } finally {
      $("loginBtn").disabled = false;
    }
  }

  async function isAdminEmail(email) {
    const { data, error } = await sb
      .from("admin_emails")
      .select("email")
      .ilike("email", email)
      .limit(1);
    if (error) throw error;
    return data && data.length > 0;
  }

  function restoreDemoSession() {
    if (CLOUD) {
      sb.auth.getSession().then(async ({ data }) => {
        if (data.session) {
          const email = (data.session.user.email || "").toLowerCase();
          try {
            if (await isAdminEmail(email)) {
              session = data.session;
              enterPanel();
              await reloadList();
            }
          } catch (_) {}
        }
      });
      return;
    }
    try {
      const email = localStorage.getItem("alpa_admin_demo");
      if (email) {
        session = { demo: true, email };
        enterPanel();
        reloadList();
      }
    } catch (_) {}
  }

  function enterPanel() {
    $("loginCard").style.display = "none";
    $("panelSection").style.display = "";
    $("userLabel").textContent = session.demo
      ? `Demo local · ${session.email}`
      : `Nube · ${session.user.email}`;
  }

  /* ---------- Panel: lista + filtros ---------- */
  let listOpen = false; // plegada por defecto: el alta no exige scroll

  function setListOpen(open) {
    listOpen = open;
    $("listWrap").hidden = !open;
    $("toggleListBtn").setAttribute("aria-expanded", String(open));
    paintToggleLabel();
  }

  function paintToggleLabel() {
    const b = $("toggleListBtn");
    if (b) b.textContent = (listOpen ? "Ocultar productos (" : "Ver productos (") + cache.length + ")";
  }

  function bindPanel() {
    $("logoutBtn").addEventListener("click", onLogout);
    $("newBtn").addEventListener("click", () => openForm(null));
    $("toggleListBtn").addEventListener("click", () => setListOpen(!listOpen));
    $("cancelBtn").addEventListener("click", closeForm);
    $("fCategory").addEventListener("change", () => refreshSubcategories());
    $("searchInput").addEventListener("input", paintList);
    $("filterCat").addEventListener("change", paintList);
    $("productForm").addEventListener("submit", onSave);
    $("fPhoto1").addEventListener("change", () => onPhotoPreview("fPhoto1", "photoPreview1"));
    $("fPhoto2").addEventListener("change", () => onPhotoPreview("fPhoto2", "photoPreview2"));
    $("addColorBtn").addEventListener("click", addPickedColor);
    $("colorName").addEventListener("keydown", (e) => {
      if (e.key === "Enter") { e.preventDefault(); addPickedColor(); }
    });
  }

  /* ---------- Pestañas: Productos / Portada ---------- */
  function bindTabs() {
    document.querySelectorAll(".admin-tab").forEach((b) =>
      b.addEventListener("click", () => showPane(b.dataset.pane))
    );
  }

  function showPane(paneId) {
    document.querySelectorAll(".admin-tab").forEach((b) =>
      b.classList.toggle("admin-tab--active", b.dataset.pane === paneId)
    );
    ["productsPane", "heroPane", "galleryPane"].forEach((id) => {
      const el = $(id);
      if (el) el.style.display = id === paneId ? "" : "none";
    });
    if (paneId === "heroPane") loadHero();
    if (paneId === "galleryPane") loadGallery();
  }

  /* ---------- Portada (hero) ---------- */
  function bindHero() {
    for (let i = 0; i < HERO_SLOTS; i++) {
      const input = $("heroPhoto" + (i + 1));
      if (input) input.addEventListener("change", () => onHeroPhoto("heroPhoto" + (i + 1), i));
    }
    $("saveHeroBtn").addEventListener("click", saveHero);
    $("resetHeroBtn").addEventListener("click", resetHero);
  }

  async function loadHero() {
    if (heroLoaded) return;
    heroLoaded = true;
    heroURLs = HERO_DEFAULT.slice();
    $("heroError").textContent = "";
    if (CLOUD) {
      try {
        const { data, error } = await sb.from("hero_images").select("slot,image_url");
        if (error) throw error;
        (data || []).forEach((r) => {
          const i = Number(r.slot) - 1;
          if (i >= 0 && i < HERO_SLOTS && r.image_url) heroURLs[i] = r.image_url;
        });
      } catch (err) {
        heroLoaded = false;
        $("heroError").textContent = /hero_images/i.test(err.message || "")
          ? "Falta ejecutar supabase/inicio_imagenes.sql en Supabase para activar esta pestaña."
          : (err.message || "No se pudo cargar la portada.");
      }
    } else {
      try {
        const saved = JSON.parse(localStorage.getItem(HERO_DEMO_KEY) || "null");
        if (Array.isArray(saved)) saved.forEach((u, i) => { if (i < HERO_SLOTS && u) heroURLs[i] = u; });
      } catch (_) {}
    }
    paintHero();
  }

  function paintHero() {
    heroNew = ["", "", "", ""];
    for (let i = 0; i < HERO_SLOTS; i++) {
      paintPhotoPreview("heroPreview" + (i + 1), heroURLs[i]);
      const input = $("heroPhoto" + (i + 1));
      if (input) input.value = "";
    }
  }

  async function onHeroPhoto(inputId, idx) {
    const f = document.getElementById(inputId).files[0];
    if (!f) return;
    try {
      const url = await fileToCompressedDataURL(f);
      heroNew[idx] = url;
      paintPhotoPreview("heroPreview" + (idx + 1), url);
    } catch (_) {
      toast("No se pudo leer esa imagen.", false);
    }
  }

  async function saveHero() {
    const errEl = $("heroError");
    const btn = $("saveHeroBtn");
    errEl.textContent = "";
    btn.disabled = true;
    try {
      for (let i = 0; i < HERO_SLOTS; i++) {
        if (!heroNew[i]) continue;
        heroURLs[i] = CLOUD ? await uploadPhoto(heroNew[i], "hero/") : heroNew[i];
      }
      if (CLOUD) {
        const rows = heroURLs.map((url, i) => ({
          slot: i + 1,
          image_url: url || "",
          updated_at: new Date().toISOString()
        }));
        const { error } = await sb.from("hero_images").upsert(rows, { onConflict: "slot" });
        if (error) throw error;
      } else {
        try { localStorage.setItem(HERO_DEMO_KEY, JSON.stringify(heroURLs)); } catch (_) {}
      }
      paintHero();
      toast("Portada actualizada.");
    } catch (err) {
      errEl.textContent = /hero_images/i.test(err.message || "")
        ? "Falta ejecutar supabase/inicio_imagenes.sql en Supabase para activar esta pestaña."
        : (err.message || "No se pudo guardar la portada.");
    } finally {
      btn.disabled = false;
    }
  }

  function resetHero() {
    heroURLs = HERO_DEFAULT.slice();
    $("heroError").textContent = "";
    paintHero();
    toast("Portada restaurada. Pulsa «Guardar portada» para confirmar.");
  }

  /* ---------- Galería del inicio ---------- */
  function bindGallery() {
    buildGallerySlots();
    $("saveGalleryBtn").addEventListener("click", saveGallery);
    $("resetGalleryBtn").addEventListener("click", resetGallery);
  }

  function buildGallerySlots() {
    const box = $("galleryGrid");
    if (!box) return;
    box.innerHTML = Array.from({ length: GALLERY_SLOTS }, (_, i) => i + 1).map((n) => `
      <div class="hero-slot">
        <div class="photo-preview" id="galleryPreview${n}">Foto ${n}.</div>
        <div class="admin-field">
          <label for="galleryPhoto${n}">Foto ${n}</label>
          <input type="file" id="galleryPhoto${n}" accept="image/jpeg,image/png,image/webp" />
        </div>
      </div>`).join("");
    for (let i = 0; i < GALLERY_SLOTS; i++) {
      const input = $("galleryPhoto" + (i + 1));
      if (input) input.addEventListener("change", () => onGalleryPhoto("galleryPhoto" + (i + 1), i));
    }
  }

  async function loadGallery() {
    if (galleryLoaded) return;
    galleryLoaded = true;
    galleryURLs = GALLERY_DEFAULT.slice();
    $("galleryError").textContent = "";
    if (CLOUD) {
      try {
        const { data, error } = await sb.from("gallery_images").select("slot,image_url");
        if (error) throw error;
        (data || []).forEach((r) => {
          const i = Number(r.slot) - 1;
          if (i >= 0 && i < GALLERY_SLOTS && r.image_url) galleryURLs[i] = r.image_url;
        });
      } catch (err) {
        galleryLoaded = false;
        $("galleryError").textContent = /gallery_images/i.test(err.message || "")
          ? "Falta ejecutar supabase/inicio_imagenes.sql en Supabase para activar esta pestaña."
          : (err.message || "No se pudo cargar la galería.");
      }
    } else {
      try {
        const saved = JSON.parse(localStorage.getItem(GALLERY_DEMO_KEY) || "null");
        if (Array.isArray(saved)) saved.forEach((u, i) => { if (i < GALLERY_SLOTS && u) galleryURLs[i] = u; });
      } catch (_) {}
    }
    paintGallery();
  }

  function paintGallery() {
    galleryNew = new Array(GALLERY_SLOTS).fill("");
    for (let i = 0; i < GALLERY_SLOTS; i++) {
      paintPhotoPreview("galleryPreview" + (i + 1), galleryURLs[i]);
      const input = $("galleryPhoto" + (i + 1));
      if (input) input.value = "";
    }
  }

  async function onGalleryPhoto(inputId, idx) {
    const f = document.getElementById(inputId).files[0];
    if (!f) return;
    try {
      const url = await fileToCompressedDataURL(f);
      galleryNew[idx] = url;
      paintPhotoPreview("galleryPreview" + (idx + 1), url);
    } catch (_) {
      toast("No se pudo leer esa imagen.", false);
    }
  }

  async function saveGallery() {
    const errEl = $("galleryError");
    const btn = $("saveGalleryBtn");
    errEl.textContent = "";
    btn.disabled = true;
    try {
      for (let i = 0; i < GALLERY_SLOTS; i++) {
        if (!galleryNew[i]) continue;
        galleryURLs[i] = CLOUD ? await uploadPhoto(galleryNew[i], "galeria/") : galleryNew[i];
      }
      if (CLOUD) {
        const rows = galleryURLs.map((url, i) => ({
          slot: i + 1,
          image_url: url || "",
          updated_at: new Date().toISOString()
        }));
        const { error } = await sb.from("gallery_images").upsert(rows, { onConflict: "slot" });
        if (error) throw error;
      } else {
        try { localStorage.setItem(GALLERY_DEMO_KEY, JSON.stringify(galleryURLs)); } catch (_) {}
      }
      paintGallery();
      toast("Galería actualizada.");
    } catch (err) {
      errEl.textContent = /gallery_images/i.test(err.message || "")
        ? "Falta ejecutar supabase/inicio_imagenes.sql en Supabase para activar esta pestaña."
        : (err.message || "No se pudo guardar la galería.");
    } finally {
      btn.disabled = false;
    }
  }

  function resetGallery() {
    galleryURLs = GALLERY_DEFAULT.slice();
    $("galleryError").textContent = "";
    paintGallery();
    toast("Galería restaurada. Pulsa «Guardar galería» para confirmar.");
  }

  async function onLogout() {
    try {
      if (CLOUD) await sb.auth.signOut();
      else localStorage.removeItem("alpa_admin_demo");
    } catch (_) {}
    session = null;
    location.reload();
  }

  async function reloadList() {
    if (CLOUD) {
      const { data, error } = await sb
        .from("products")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(500);
      if (error) {
        toast("Error cargando: " + error.message, false);
        return;
      }
      cache = data || [];
    } else {
      try {
        cache = JSON.parse(localStorage.getItem(DEMO_KEY) || "[]");
      } catch (_) { cache = []; }
    }
    paintList();
  }

  function paintList() {
    const q = ($("searchInput").value || "").toLowerCase();
    const fc = $("filterCat").value;
    const rows = cache.filter((p) =>
      (!fc || p.category === fc) &&
      (!q || (p.name || "").toLowerCase().includes(q))
    );
    const box = $("productList");
    if (!rows.length) {
      box.innerHTML = `<p style="color:var(--muted);font-size:14px;margin:6px 0">Sin productos. Pulsa “+ Nuevo producto”.</p>`;
      paintToggleLabel();
      return;
    }
    box.innerHTML = rows.map((p) => `
      <div class="prow">
        <img src="${esc(p.image_url || (p.image_urls && p.image_urls[0]) || "")}" alt="" loading="lazy" onerror="this.style.opacity=.25" />
        <div>
          <span class="pname">${esc(p.name)}</span>
          ${p.active ? "" : `<span class="off">OCULTO</span>`}
          <div class="pmeta">${esc(catName(p.category))}${p.subcategory ? " · " + esc(p.subcategory) : ""} · ${Number(p.price).toFixed(2)} €</div>
        </div>
        <div class="acts">
          <button class="link-btn" data-act="edit" data-id="${esc(p.id)}">Editar</button>
          <button class="link-btn" data-act="dup" data-id="${esc(p.id)}">Duplicar</button>
          <button class="link-btn" data-act="toggle" data-id="${esc(p.id)}">${p.active ? "Ocultar" : "Mostrar"}</button>
          <button class="link-btn danger" data-act="del" data-id="${esc(p.id)}">Eliminar</button>
        </div>
      </div>`).join("");
    box.querySelectorAll("button[data-act]").forEach((b) =>
      b.addEventListener("click", () => rowAction(b.dataset.act, b.dataset.id))
    );
    paintToggleLabel();
  }

  async function rowAction(act, id) {
    const p = cache.find((x) => String(x.id) === String(id));
    if (!p) return;
    if (act === "edit") openForm(p);
    else if (act === "dup") openForm({ ...p, id: null, name: (p.name || "") + " (copia)" });
    else if (act === "toggle") {
      await persist({ ...p, active: !p.active }, true);
    } else if (act === "del") {
      if (!confirm(`Eliminar “${p.name}” para siempre. ¿Seguro? (para pausarlo sin borrar usa Ocultar)`)) return;
      await removeProduct(p);
    }
  }

  /* ---------- Formulario ---------- */
  function openForm(p) {
    editingId = p && p.id ? p.id : null;
    $("formTitle").textContent = editingId ? "Editar producto" : "Nuevo producto";
    $("formError").textContent = "";
    $("fName").value = p?.name || "";
    $("fPrice").value = p?.price ?? "";
    $("fDesc").value = p?.description || "";
    $("fActive").checked = p ? !!p.active : true;
    const urls = Array.isArray(p?.image_urls) && p.image_urls.length ? p.image_urls : (p?.image_url ? [p.image_url] : []);
    currentPhotoURLs = [urls[0] || "", urls[1] || ""];
    paintPhotoPreview("photoPreview1", currentPhotoURLs[0]);
    paintPhotoPreview("photoPreview2", currentPhotoURLs[1]);
    $("fPhoto1").value = "";
    $("fPhoto2").value = "";
    if (p?.category) $("fCategory").value = p.category;
    refreshSubcategories(p?.subcategory || "");
    if (p?.subcategory) $("fSubcategory").value = p.subcategory;
    const sizes = new Set(p?.sizes || []);
    $("sizesBox").querySelectorAll("input").forEach((i) => { i.checked = sizes.has(i.value); });
    pickedColors = (p?.colors || []).map((c) =>
      typeof c === "string" ? { name: c, hex: "#999999" } : { name: c.name || "", hex: c.hex || "#999999" }
    ).filter((c) => c.name);
    paintPickedColors();
    $("formCard").style.display = "";
    $("formCard").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function closeForm() {
    $("formCard").style.display = "none";
    editingId = null;
  }

  function paintPhotoPreview(elId, url) {
    document.getElementById(elId).innerHTML = url
      ? `<img src="${esc(url)}" alt="Vista previa" />`
      : `Sin foto.<br>Pulsa “Elegir”.`;
  }

  async function onPhotoPreview(inputId, previewId) {
    const f = document.getElementById(inputId).files[0];
    if (!f) return;
    try {
      const url = await fileToCompressedDataURL(f);
      paintPhotoPreview(previewId, url);
      document.getElementById(previewId).dataset.newPhoto = url;
    } catch (_) {
      toast("No se pudo leer esa imagen.", false);
    }
  }

  // Comprime a máx 1600px lado largo, JPEG 0.82 (las del ordenador suelen pesar MBs)
  function fileToCompressedDataURL(file) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        const MAX = 1600;
        const scale = Math.min(1, MAX / Math.max(img.width, img.height));
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);
        const c = document.createElement("canvas");
        c.width = w; c.height = h;
        c.getContext("2d").drawImage(img, 0, 0, w, h);
        URL.revokeObjectURL(url);
        resolve(c.toDataURL("image/jpeg", 0.82));
      };
      img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("bad image")); };
      img.src = url;
    });
  }

  function dataURLtoBlob(dataURL) {
    const [head, b64] = dataURL.split(",");
    const mime = (head.match(/data:(.*?);/) || [])[1] || "image/jpeg";
    const bin = atob(b64);
    const arr = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
    return new Blob([arr], { type: mime });
  }

  async function uploadPhoto(dataURL, folder = "") {
    // dataURL ya comprimido del preview
    const blob = dataURLtoBlob(dataURL);
    const safe = folder + Date.now() + "_" + Math.random().toString(36).slice(2, 8) + ".jpg";
    const { error } = await sb.storage.from(BUCKET).upload(safe, blob, {
      contentType: "image/jpeg", upsert: false
    });
    if (error) throw error;
    const { data } = sb.storage.from(BUCKET).getPublicUrl(safe);
    return data.publicUrl;
  }

  async function onSave(e) {
    e.preventDefault();
    $("formError").textContent = "";
    const name = $("fName").value.trim();
    const price = Number($("fPrice").value);
    const description = $("fDesc").value.trim();
    const category = $("fCategory").value;
    const subcategory = $("fSubcategory").disabled ? "" : $("fSubcategory").value;
    const sizes = [...$("sizesBox").querySelectorAll("input:checked")].map((i) => i.value);
    const colors = pickedColors.map((c) => ({ name: c.name, hex: c.hex }));
    const newPhoto1 = $("photoPreview1").dataset.newPhoto || "";
    const newPhoto2 = $("photoPreview2").dataset.newPhoto || "";
    delete $("photoPreview1").dataset.newPhoto;
    delete $("photoPreview2").dataset.newPhoto;

    // Validación pensada para no-técnicos
    if (name.length < 2) return void ($("formError").textContent = "Ponle un nombre (mínimo 2 letras).");
    if (!isFinite(price) || price < 0) return void ($("formError").textContent = "Pon un precio válido (0 o más).");
    if (!description) return void ($("formError").textContent = "Añade una descripción corta.");
    const validCats = (typeof CATEGORIES !== "undefined" ? CATEGORIES : []).map((c) => c.slug);
    if (!validCats.includes(category)) return void ($("formError").textContent = "Elige una categoría de la lista.");
    let url1 = currentPhotoURLs[0] || "";
    let url2 = currentPhotoURLs[1] || "";
    const fresh = [["photoPreview1", newPhoto1, 0], ["photoPreview2", newPhoto2, 1]];
    for (const [, dataURL, idx] of fresh) {
      if (!dataURL) continue;
      if (CLOUD) {
        $("saveBtn").disabled = true;
        try {
          const up = await uploadPhoto(dataURL);
          if (idx === 0) url1 = up; else url2 = up;
        } catch (err) {
          $("saveBtn").disabled = false;
          $("formError").textContent = "No se pudo subir la foto " + (idx + 1) + ": " + (err.message || "");
          return;
        } finally { $("saveBtn").disabled = false; }
      } else {
        if (idx === 0) url1 = dataURL; else url2 = dataURL; // demo local
      }
    }
    if (!url1 || !url2) return void ($("formError").textContent = "Faltan fotos: añade la foto 1 y la foto 2.");
    currentPhotoURLs = [url1, url2];

    const record = {
      name, price, description, category, subcategory,
      sizes, colors, image_url: url1, image_urls: [url1, url2],
      active: $("fActive").checked
    };
    $("saveBtn").disabled = true;
    try {
      if (editingId) await persist({ ...record, id: editingId }, true);
      else await persist(record, false);
      const wasEditing = !!editingId;
      if (wasEditing) {
        closeForm();
        toast("Producto actualizado.");
      } else {
        openForm(null); // formulario limpio para el siguiente, sin scroll largo
        toast("Producto creado: sigue con el siguiente.");
      }
      await reloadList();
    } catch (err) {
      $("formError").textContent = err.message || "No se pudo guardar.";
    } finally {
      $("saveBtn").disabled = false;
    }
  }

  async function persist(record, isUpdate) {
    if (CLOUD) {
      const withoutGallery = ({ image_urls, ...rest }) => rest;
      const errIsMissingColumn = (e) => e && /image_urls/i.test(e.message || "");
      if (isUpdate) {
        let { error } = await sb.from("products").update(record).eq("id", record.id);
        if (error && errIsMissingColumn(error)) {
          // La migración SQL aún no se aplicó: guarda al menos la foto 1
          ({ error } = await sb.from("products").update(withoutGallery(record)).eq("id", record.id));
          if (!error) toast("Guardado con 1 foto: ejecuta migration_multi_image.sql en Supabase para activar 2 fotos.", false);
        }
        if (error) throw error;
      } else {
        let { error } = await sb.from("products").insert(record);
        if (error && errIsMissingColumn(error)) {
          ({ error } = await sb.from("products").insert(withoutGallery(record)));
          if (!error) toast("Guardado con 1 foto: ejecuta migration_multi_image.sql en Supabase para activar 2 fotos.", false);
        }
        if (error) throw error;
      }
      return;
    }
    // DEMO local
    let arr = [];
    try { arr = JSON.parse(localStorage.getItem(DEMO_KEY) || "[]"); } catch (_) {}
    if (isUpdate) {
      arr = arr.map((p) => String(p.id) === String(record.id) ? record : p);
    } else {
      record.id = "demo-" + Date.now();
      record.created_at = new Date().toISOString();
      arr.unshift(record);
    }
    try { localStorage.setItem(DEMO_KEY, JSON.stringify(arr)); } catch (_) {}
    cache = arr;
    paintList();
  }

  async function removeProduct(p) {
    if (CLOUD) {
      const { error } = await sb.from("products").delete().eq("id", p.id);
      if (error) { toast("No se pudo eliminar: " + error.message, false); return; }
      toast("Producto eliminado.");
      await reloadList();
      return;
    }
    let arr = [];
    try { arr = JSON.parse(localStorage.getItem(DEMO_KEY) || "[]"); } catch (_) {}
    arr = arr.filter((x) => String(x.id) !== String(p.id));
    try { localStorage.setItem(DEMO_KEY, JSON.stringify(arr)); } catch (_) {}
    cache = arr;
    paintList();
    toast("Producto eliminado (demo).");
  }
})();

