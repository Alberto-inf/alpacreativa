/* ============================================================
   ALPA Creativa — Migración única: sube el catálogo actual
   (js/data.js) a Supabase: fotos locales -> bucket "productos",
   filas -> tabla products.
   Uso (desde la carpeta del proyecto):
     npm install --prefix "%TEMP%\\alpa-mig" @supabase/supabase-js
     set SUPABASE_EMAIL=tu@email.com
     set SUPABASE_PASSWORD=tu-contraseña
     node supabase/migrate.js
   Es re-ejecutable: omite por nombre los ya migrados.
   ============================================================ */
const fs = require("fs");
const path = require("path");

const PROJECT_DIR = path.resolve(__dirname, "..");
const SUPABASE_URL = "https://fuhwkgcjqbkwkoswvigo.supabase.co";
const ANON_KEY = "sb_publishable_ysP-BeYB7x6Qy_HJyXc6oQ_2hz_qf8T";

async function main() {
  const email = process.env.SUPABASE_EMAIL;
  const password = process.env.SUPABASE_PASSWORD;
  if (!email || !password) {
    console.error("Falta SUPABASE_EMAIL o SUPABASE_PASSWORD.");
    process.exit(1);
  }
  const { createClient } = require(
    process.env.ALPA_MIG_MODULE || path.join(process.env.TEMP || "/tmp", "alpa-mig", "node_modules", "@supabase", "supabase-js")
  );
  const sb = createClient(SUPABASE_URL, ANON_KEY);

  const { error: loginErr } = await sb.auth.signInWithPassword({ email, password });
  if (loginErr) throw new Error("Login: " + loginErr.message);
  console.log("Login OK:", email);

  // Carga PRODUCTS / PRODUCT_SIZES / PRODUCT_COLORS desde js/data.js
  const src = fs.readFileSync(path.join(PROJECT_DIR, "js", "data.js"), "utf8");
  const { PRODUCTS, PRODUCT_SIZES, PRODUCT_COLORS } = new Function(
    `${src}; return { PRODUCTS, PRODUCT_SIZES, PRODUCT_COLORS };`
  )();
  console.log(`Productos en data.js: ${PRODUCTS.length}`);

  const { data: existing, error: listErr } = await sb.from("products").select("name");
  if (listErr) throw new Error("Listar: " + listErr.message);
  const done = new Set((existing || []).map((r) => r.name));
  console.log(`Ya en Supabase: ${done.size}`);

  let uploaded = 0, inserted = 0, skipped = 0;
  for (const p of PRODUCTS) {
    if (done.has(p.name)) { skipped++; continue; }

    let image_url = p.img || "";
    const localPath = (p.img || "").startsWith("img/")
      ? path.join(PROJECT_DIR, p.img.replace(/\//g, path.sep))
      : null;
    if (localPath && fs.existsSync(localPath)) {
      const buf = fs.readFileSync(localPath);
      const dest = "catalog/" + path.basename(localPath).replace(/[^a-zA-Z0-9_.-]/g, "_");
      const { error: upErr } = await sb.storage.from("productos").upload(dest, buf, {
        contentType: "image/png", upsert: true
      });
      if (upErr) throw new Error(`Subir ${dest}: ` + upErr.message);
      const { data } = sb.storage.from("productos").getPublicUrl(dest);
      image_url = data.publicUrl;
      uploaded++;
    }

    const { error: insErr } = await sb.from("products").insert({
      name: p.name,
      description: p.description || "",
      price: p.price ?? 0,
      category: p.category,
      subcategory: p.subcategory || "",
      sizes: PRODUCT_SIZES,
      colors: PRODUCT_COLORS.map((c) => ({ name: c.name, hex: c.hex })),
      image_url,
      active: true
    });
    if (insErr) throw new Error(`Insertar "${p.name}": ` + insErr.message);
    inserted++;
    console.log(`  + ${p.name}`);
  }
  console.log(`Hecho. Subidas: ${uploaded} fotos. Insertados: ${inserted}. Omitidos: ${skipped}.`);
  await sb.auth.signOut();
}

main().catch((e) => { console.error("ERROR:", e.message); process.exit(1); });
