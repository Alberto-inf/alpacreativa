document.addEventListener("DOMContentLoaded", () => {
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
  if (typeof AOS !== "undefined") AOS.init({ duration:700, easing:"ease-out-cubic", once:true, offset:60 });

  const form = document.getElementById("contactForm");
  const success = document.getElementById("formSuccess");

  // Pre-rellenar si viene de ?producto= o ?cat=
  const params = new URLSearchParams(window.location.search);
  const prod = params.get("producto");
  const cat = params.get("cat");
  const asunto = document.getElementById("asunto");
  const mensaje = document.getElementById("mensaje");
  if (prod && mensaje) mensaje.value = `Hola, me interesa: ${prod}\n\n`;
  if (cat && asunto) asunto.value = "Consulta de producto";

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let valid = true;
    const nombre = document.getElementById("nombre");
    const email = document.getElementById("email");
    const msg = document.getElementById("mensaje");

    // reset errors
    ["f-nombre","f-email","f-mensaje"].forEach(id => document.getElementById(id).classList.remove("field--error"));

    if (!nombre.value.trim()) { document.getElementById("f-nombre").classList.add("field--error"); valid=false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) { document.getElementById("f-email").classList.add("field--error"); valid=false; }
    if (!msg.value.trim() || msg.value.trim().length < 8) { document.getElementById("f-mensaje").classList.add("field--error"); valid=false; }

    if (!valid) return;

    const data = {
      nombre: nombre.value.trim(),
      email: email.value.trim(),
      telefono: document.getElementById("telefono").value.trim(),
      asunto: asunto.value,
      mensaje: msg.value.trim()
    };

    // Simulación envío — guarda en localStorage y muestra éxito
    // Para backend real, aquí harías fetch a tu API / Formspree / EmailJS
    const key = "alpa_mensajes";
    try {
      const arr = JSON.parse(localStorage.getItem(key) || "[]");
      arr.push({ ...data, fecha: new Date().toISOString() });
      localStorage.setItem(key, JSON.stringify(arr));
    } catch {}

    const body = `Nombre: ${data.nombre}\nEmail: ${data.email}\nTel: ${data.telefono || "-"}\nAsunto: ${data.asunto}\n\nMensaje:\n${data.mensaje}`;
    const mailto = `mailto:alpacreativa2@gmail.com?subject=${encodeURIComponent("[ALPA] " + data.asunto + " - " + data.nombre)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;

    form.style.display = "none";
    success.classList.add("form-success--show");
    success.scrollIntoView({ behavior:"smooth", block:"center" });

    const toast = document.getElementById("toast");
    if (toast) { toast.textContent = "Mensaje enviado correctamente"; toast.classList.add("toast--show"); setTimeout(()=>toast.classList.remove("toast--show"),2600); }
  });
});
