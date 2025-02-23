// mockData.js
export const mockData = {
    domains: [
      {
        name: "dominio1.com",
        totalBotRequests: 1234,
        ssrErrors: 12,
        avgRenderTime: 1.2,
        topPages: [
          { path: "/producto-1", visits: 200, title: "Producto 1" },
          { path: "/producto-2", visits: 180, title: "Producto 2" },
          // ... etc.
        ],
        seoData: [
          {
            path: "/producto-1",
            title: "Título SEO Producto 1",
            description: "Descripción meta del producto 1",
            keywords: ["producto", "venta", "tienda"],
          },
          // ... etc.
        ],
      },
      {
        name: "dominio2.org",
        totalBotRequests: 567,
        ssrErrors: 3,
        avgRenderTime: 0.9,
        topPages: [
          { path: "/", visits: 100, title: "Home" },
          // ...
        ],
        seoData: [
          {
            path: "/",
            title: "Home - dominio2.org",
            description: "Descripción SEO de la Home de dominio2",
            keywords: ["home", "landing", "info"],
          },
        ],
      }
      // Agrega más dominios si quieres
    ],
  };
  