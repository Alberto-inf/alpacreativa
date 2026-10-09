// Cliente para Shopify Storefront API
const ShopifyAPI = {
  
  // Realizar petición GraphQL a Storefront API
  async query(queryString, variables = {}) {
    if (!isShopifyConfigured()) {
      console.warn("Shopify no está configurado. Usando modo demo.");
      return null;
    }

    const url = `https://${SHOPIFY_CONFIG.shopDomain}/api/${SHOPIFY_CONFIG.apiVersion}/graphql.json`;
    
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Storefront-Access-Token": SHOPIFY_CONFIG.storefrontToken
        },
        body: JSON.stringify({
          query: queryString,
          variables: variables
        })
      });

      if (!response.ok) {
        throw new Error(`Error en API: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.errors) {
        console.error("Errores de Shopify:", data.errors);
        throw new Error(data.errors[0].message);
      }

      return data.data;
    } catch (error) {
      console.error("Error en Shopify API:", error);
      throw error;
    }
  },

  // Obtener productos
  async getProducts(first = 10) {
    const query = `
      query GetProducts($first: Int!) {
        products(first: $first) {
          edges {
            node {
              id
              title
              description
              handle
              images(first: 1) {
                edges {
                  node {
                    url
                    altText
                  }
                }
              }
              variants(first: 10) {
                edges {
                  node {
                    id
                    title
                    price {
                      amount
                      currencyCode
                    }
                    availableForSale
                    selectedOptions {
                      name
                      value
                    }
                  }
                }
              }
            }
          }
        }
      }
    `;

    const data = await this.query(query, { first });
    return data ? data.products.edges.map(edge => edge.node) : [];
  },

  // Obtener producto por handle
  async getProductByHandle(handle) {
    const query = `
      query GetProduct($handle: String!) {
        productByHandle(handle: $handle) {
          id
          title
          description
          handle
          images(first: 5) {
            edges {
              node {
                url
                altText
              }
            }
          }
          variants(first: 20) {
            edges {
              node {
                id
                title
                price {
                  amount
                  currencyCode
                }
                availableForSale
                selectedOptions {
                  name
                  value
                }
              }
            }
          }
        }
      }
    `;

    const data = await this.query(query, { handle });
    return data ? data.productByHandle : null;
  },

  // Crear carrito
  async createCart() {
    const query = `
      mutation CartCreate {
        cartCreate {
          cart {
            id
            checkoutUrl
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const data = await this.query(query);
    return data ? data.cartCreate.cart : null;
  },

  // Añadir producto al carrito
  async addToCart(cartId, variantId, quantity = 1) {
    const query = `
      mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
        cartLinesAdd(cartId: $cartId, lines: $lines) {
          cart {
            id
            lines(first: 100) {
              edges {
                node {
                  id
                  quantity
                  merchandise {
                    ... on ProductVariant {
                      id
                      title
                      price {
                        amount
                        currencyCode
                      }
                      product {
                        title
                        images(first: 1) {
                          edges {
                            node {
                              url
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
            cost {
              totalAmount {
                amount
                currencyCode
              }
            }
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const data = await this.query(query, {
      cartId,
      lines: [{ merchandiseId: variantId, quantity }]
    });
    
    return data ? data.cartLinesAdd.cart : null;
  },

  // Actualizar cantidad en carrito
  async updateCartLine(cartId, lineId, quantity) {
    const query = `
      mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
        cartLinesUpdate(cartId: $cartId, lines: $lines) {
          cart {
            id
            lines(first: 100) {
              edges {
                node {
                  id
                  quantity
                  merchandise {
                    ... on ProductVariant {
                      id
                      title
                      price {
                        amount
                        currencyCode
                      }
                    }
                  }
                }
              }
            }
            cost {
              totalAmount {
                amount
                currencyCode
              }
            }
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const data = await this.query(query, {
      cartId,
      lines: [{ id: lineId, quantity }]
    });
    
    return data ? data.cartLinesUpdate.cart : null;
  },

  // Eliminar línea del carrito
  async removeFromCart(cartId, lineIds) {
    const query = `
      mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
        cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
          cart {
            id
            lines(first: 100) {
              edges {
                node {
                  id
                  quantity
                }
              }
            }
            cost {
              totalAmount {
                amount
                currencyCode
              }
            }
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const data = await this.query(query, { cartId, lineIds });
    return data ? data.cartLinesRemove.cart : null;
  }
};
