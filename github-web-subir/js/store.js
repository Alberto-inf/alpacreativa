/* =========================================================
   ALPA Creativa — Capa de lectura del catálogo (tienda pública)
   - Lee los productos ACTIVOS de Supabase (los que ella crea
     en admin.html) y rellena el PRODUCTS global de js/data.js.
   - Sin claves o sin red -> catálogo vacío (decisión: NO se
     muestran las fichas antiguas; viven en LEGACY_PRODUCTS).
   ========================================================= */
const ALPA_STORE = (() => {
  let client = null;
  let loaded = false;

  function getClient() {
    if (client) return client;
    try {
      if (typeof isSupabaseConfigured === "function" && isSupabaseConfigured() &&
          window.supabase && typeof SUPABASE_CONFIG !== "undefined") {
        client = window.supabase.createClient(
          SUPABASE_CONFIG.supabaseUrl,
          SUPABASE_CONFIG.supabaseAnonKey
        );
      }
    } catch (_) {
      client = null;
    }
    return client;
  }

  function normalize(row) {
    const sizes = Array.isArray(row.sizes) && row.sizes.length
      ? row.sizes
      : (typeof PRODUCT_SIZES !== "undefined" ? PRODUCT_SIZES : []);
    let colors = Array.isArray(row.colors) && row.colors.length
      ? row.colors
      : (typeof PRODUCT_COLORS !== "undefined" ? PRODUCT_COLORS : []);
    colors = colors.map((c) => typeof c === "string"
      ? { name: c, hex: "#999999" }
      : { name: c.name, hex: c.hex || "#999999" });
    const first = row.image_url || "";
    const gallery = Array.isArray(row.image_urls) && row.image_urls.length
      ? row.image_urls.filter(Boolean)
      : (first ? [first] : []);
    return {
      id: String(row.id),
      name: row.name || "",
      price: Number(row.price) || 0,
      category: row.category || "",
      subcategory: row.subcategory || "",
      description: row.description || "",
      img: first || gallery[0] || "",
      images: gallery.length ? gallery : (first ? [first] : []),
      sizes,
      colors,
      active: !!row.active
    };
  }

  // Rellena PRODUCTS y devuelve nº de productos visibles.
  async function refresh() {
    if (typeof PRODUCTS === "undefined") return 0;
    PRODUCTS.length = 0;
    const sb = getClient();
    if (!sb) return 0; // sin backend -> vacío a propósito
    const { data, error } = await sb
      .from("products")
      .select("id,name,description,price,category,subcategory,sizes,colors,image_url,image_urls,active")
      .eq("active", true)
      .order("created_at", { ascending: false })
      .limit(1000);
    if (error) {
      console.warn("[store] Supabase:", error.message);
      return 0;
    }
    (data || []).forEach((r) => PRODUCTS.push(normalize(r)));
    loaded = true;
    return PRODUCTS.length;
  }

  // Puntitos de color para las tarjetas (máx 10 + contador).
  function colorDots(p, max = 10) {
    const colors = (p && Array.isArray(p.colors) ? p.colors : [])
      .map((c) => typeof c === "string" ? { name: c, hex: "#999999" } : c)
      .filter((c) => c && c.hex);
    if (!colors.length) return "";
    const shown = colors.slice(0, max);
    const rest = colors.length - shown.length;
    const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[c]));
    return `<div class="product-card__colors">` +
      shown.map((c) =>
        `<span class="product-card__dot" title="${esc(c.name || c.hex)}" style="background:${esc(c.hex)}"></span>`
      ).join("") +
      (rest > 0 ? `<span class="product-card__more">+${rest}</span>` : "") +
      `</div>`;
  }

  // Pastillitas de talla para las tarjetas.
  function sizePills(p) {
    const sizes = (p && Array.isArray(p.sizes) ? p.sizes : []).filter(Boolean);
    if (!sizes.length) return "";
    const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[c]));
    return `<div class="product-card__sizes">` +
      sizes.map((s) => `<span class="product-card__size">${esc(s)}</span>`).join("") +
      `</div>`;
  }

  return { refresh, colorDots, sizePills, get loaded() { return loaded; } };
})();
