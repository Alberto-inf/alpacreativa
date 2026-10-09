// Sistema de autenticación de clientes con Shopify
const ShopifyAuth = {
  
  // Obtener token de acceso del cliente
  async login(email, password) {
    const query = `
      mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
        customerAccessTokenCreate(input: $input) {
          customerAccessToken {
            accessToken
            expiresAt
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const data = await ShopifyAPI.query(query, {
      input: { email, password }
    });

    if (!data) {
      throw new Error("Shopify no está configurado");
    }

    const result = data.customerAccessTokenCreate;
    
    if (result.userErrors && result.userErrors.length > 0) {
      throw new Error(result.userErrors[0].message);
    }

    const token = result.customerAccessToken;
    localStorage.setItem("shopify_customer_token", token.accessToken);
    localStorage.setItem("shopify_customer_expires", token.expiresAt);
    
    return token;
  },

  // Registrar nuevo cliente
  async register(firstName, lastName, email, password) {
    const query = `
      mutation customerCreate($input: CustomerCreateInput!) {
        customerCreate(input: $input) {
          customer {
            id
            firstName
            lastName
            email
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const data = await ShopifyAPI.query(query, {
      input: { firstName, lastName, email, password }
    });

    if (!data) {
      throw new Error("Shopify no está configurado");
    }

    const result = data.customerCreate;
    
    if (result.userErrors && result.userErrors.length > 0) {
      throw new Error(result.userErrors[0].message);
    }

    // Login automático después del registro
    return await this.login(email, password);
  },

  // Cerrar sesión
  logout() {
    localStorage.removeItem("shopify_customer_token");
    localStorage.removeItem("shopify_customer_expires");
    localStorage.removeItem("shopify_customer_info");
  },

  // Verificar si el usuario está logueado
  isLoggedIn() {
    const token = localStorage.getItem("shopify_customer_token");
    const expires = localStorage.getItem("shopify_customer_expires");
    
    if (!token || !expires) return false;
    
    // Verificar si el token ha expirado
    const expiresDate = new Date(expires);
    if (expiresDate < new Date()) {
      this.logout();
      return false;
    }
    
    return true;
  },

  // Obtener token actual
  getToken() {
    return localStorage.getItem("shopify_customer_token");
  },

  // Obtener información del cliente
  async getCustomer() {
    if (!this.isLoggedIn()) return null;

    const query = `
      query getCustomer($customerAccessToken: String!) {
        customer(customerAccessToken: $customerAccessToken) {
          id
          firstName
          lastName
          email
          phone
          addresses(first: 5) {
            edges {
              node {
                id
                address1
                address2
                city
                province
                country
                zip
              }
            }
          }
          orders(first: 10) {
            edges {
              node {
                id
                name
                processedAt
                financialStatus
                fulfillmentStatus
                totalPrice {
                  amount
                  currencyCode
                }
                lineItems(first: 10) {
                  edges {
                    node {
                      title
                      quantity
                      variant {
                        image {
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
      }
    `;

    const data = await ShopifyAPI.query(query, {
      customerAccessToken: this.getToken()
    });

    if (!data) return null;

    const customer = data.customer;
    localStorage.setItem("shopify_customer_info", JSON.stringify(customer));
    
    return customer;
  },

  // Obtener info del cliente desde cache
  getCustomerInfo() {
    const cached = localStorage.getItem("shopify_customer_info");
    return cached ? JSON.parse(cached) : null;
  },

  // Actualizar información del cliente
  async updateCustomer(updates) {
    if (!this.isLoggedIn()) throw new Error("No autenticado");

    const query = `
      mutation customerUpdate($customerAccessToken: String!, $customer: CustomerUpdateInput!) {
        customerUpdate(customerAccessToken: $customerAccessToken, customer: $customer) {
          customer {
            id
            firstName
            lastName
            email
            phone
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const data = await ShopifyAPI.query(query, {
      customerAccessToken: this.getToken(),
      customer: updates
    });

    if (!data) throw new Error("Shopify no está configurado");

    const result = data.customerUpdate;
    
    if (result.userErrors && result.userErrors.length > 0) {
      throw new Error(result.userErrors[0].message);
    }

    // Actualizar cache
    await this.getCustomer();
    
    return result.customer;
  }
};
