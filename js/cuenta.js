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
  if (typeof AOS !== "undefined") AOS.init({ duration: 700, easing: "ease-out-cubic", once: true, offset: 60 });

  if (ShopifyAuth.isLoggedIn()) {
    window.location.href = "perfil.html";
    return;
  }

  const tabLogin = document.getElementById("tabLogin");
  const tabRegister = document.getElementById("tabRegister");
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");

  function switchTab(tab) {
    if (tab === "login") {
      tabLogin.classList.add("auth-tab--active");
      tabRegister.classList.remove("auth-tab--active");
      loginForm.classList.add("auth-form--active");
      registerForm.classList.remove("auth-form--active");
    } else {
      tabRegister.classList.add("auth-tab--active");
      tabLogin.classList.remove("auth-tab--active");
      registerForm.classList.add("auth-form--active");
      loginForm.classList.remove("auth-form--active");
    }
    clearErrors();
  }

  tabLogin.addEventListener("click", () => switchTab("login"));
  tabRegister.addEventListener("click", () => switchTab("register"));
  document.getElementById("switchToRegister").addEventListener("click", (e) => { e.preventDefault(); switchTab("register"); });
  document.getElementById("switchToLogin").addEventListener("click", (e) => { e.preventDefault(); switchTab("login"); });

  function clearErrors() {
    document.querySelectorAll(".auth-error").forEach(el => el.classList.remove("auth-error--show"));
    document.querySelectorAll(".input--error").forEach(el => el.classList.remove("input--error"));
  }

  function showError(id, msg) {
    const el = document.getElementById(id);
    if (msg) el.textContent = msg;
    el.classList.add("auth-error--show");
  }

  function showFieldError(inputId, errorId) {
    document.getElementById(inputId).classList.add("input--error");
    document.getElementById(errorId).classList.add("auth-error--show");
  }

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearErrors();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;
    let valid = true;

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showFieldError("loginEmail", "loginEmailError");
      valid = false;
    }
    if (!password) {
      showFieldError("loginPassword", "loginPasswordError");
      valid = false;
    }
    if (!valid) return;

    const btn = document.getElementById("loginSubmit");
    btn.disabled = true;
    btn.textContent = "Iniciando sesión...";

    try {
      if (!isShopifyConfigured()) {
        await new Promise(r => setTimeout(r, 1000));
        showToast("Shopify no está configurado. Usa datos de prueba.");
        localStorage.setItem("shopify_customer_token", "demo_token");
        localStorage.setItem("shopify_customer_expires", new Date(Date.now() + 86400000).toISOString());
        localStorage.setItem("shopify_customer_info", JSON.stringify({
          firstName: "Usuario", lastName: "Demo", email: email, orders: { edges: [] }
        }));
        window.location.href = "perfil.html";
        return;
      }

      await ShopifyAuth.login(email, password);
      await ShopifyAuth.getCustomer();
      showToast("Sesión iniciada correctamente");
      window.location.href = "perfil.html";
    } catch (err) {
      showError("loginGlobalError", "Email o contraseña incorrectos");
      btn.disabled = false;
      btn.textContent = "Iniciar sesión";
    }
  });

  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearErrors();

    const firstName = document.getElementById("regFirstName").value.trim();
    const lastName = document.getElementById("regLastName").value.trim();
    const email = document.getElementById("regEmail").value.trim();
    const password = document.getElementById("regPassword").value;
    const confirm = document.getElementById("regPasswordConfirm").value;
    let valid = true;

    if (!firstName) { showFieldError("regFirstName", "regFirstNameError"); valid = false; }
    if (!lastName) { showFieldError("regLastName", "regLastNameError"); valid = false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showFieldError("regEmail", "regEmailError"); valid = false; }
    if (password.length < 6) { showFieldError("regPassword", "regPasswordError"); valid = false; }
    if (password !== confirm) { showFieldError("regPasswordConfirm", "regPasswordConfirmError"); valid = false; }
    if (!valid) return;

    const btn = document.getElementById("registerSubmit");
    btn.disabled = true;
    btn.textContent = "Creando cuenta...";

    try {
      if (!isShopifyConfigured()) {
        await new Promise(r => setTimeout(r, 1000));
        localStorage.setItem("shopify_customer_token", "demo_token");
        localStorage.setItem("shopify_customer_expires", new Date(Date.now() + 86400000).toISOString());
        localStorage.setItem("shopify_customer_info", JSON.stringify({
          firstName, lastName, email, orders: { edges: [] }
        }));
        showToast("Cuenta creada correctamente");
        window.location.href = "perfil.html";
        return;
      }

      await ShopifyAuth.register(firstName, lastName, email, password);
      await ShopifyAuth.getCustomer();
      showToast("Cuenta creada correctamente");
      window.location.href = "perfil.html";
    } catch (err) {
      showError("registerGlobalError", err.message || "Error al crear la cuenta");
      btn.disabled = false;
      btn.textContent = "Crear cuenta";
    }
  });
});
