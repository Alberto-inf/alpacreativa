// Configuración de Shopify Storefront API
// REEMPLAZA ESTOS VALORES cuando tengas tu cuenta de Shopify

const SHOPIFY_CONFIG = {
  // URL de tu tienda Shopify
  shopDomain: "tu-tienda.myshopify.com",
  
  // Token de acceso a Storefront API
  // Obtener en: Shopify Admin > Settings > Apps > Develop apps > Create app
  storefrontToken: "tu-storefront-access-token-aqui",
  
  // Versión de la API
  apiVersion: "2024-01"
};

// Verificar que la configuración esté completa
const isShopifyConfigured = () => {
  return (
    SHOPIFY_CONFIG.shopDomain !== "tu-tienda.myshopify.com" &&
    SHOPIFY_CONFIG.storefrontToken !== "tu-storefront-access-token-aqui"
  );
};

console.log("Shopify configurado:", isShopifyConfigured());
