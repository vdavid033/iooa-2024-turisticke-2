const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "sve", component: () => import("pages/PrikazuSve.vue") },
      { path: "", component: () => import("pages/IndexPage.vue") },
      { path: "unos", component: () => import("pages/Unos_atrakcija.vue") },
      { path: "axo", component: () => import("pages/AxiosPageTest.vue") },
    ],
  },
 
  {
    path: "/auth",
    component: () => import("layouts/BlankLayout.vue"),
    children: [
      { path: "", component: () => import("pages/PrijavaNovo.vue") },
    ],
  },

  {
    path: "/registracijaputanja",
    component: () => import("layouts/BlankLayout.vue"),
    children: [
      { path: "", component: () => import("pages/LoginPage.vue") },
    ],
  },

  {
    path: "/one_atraction/:id", // Promijenjeno
    component: () => import("layouts/BlankLayout.vue"),
    children: [
      { name: "one_atraction", path: "", component: () => import("pages/AtrakcijePage.vue") },
    ],
  },
  {
    path: "/komentari/:id", // Promijenjeno
    component: () => import("layouts/BlankLayout.vue"),
    children: [
      { name: "komentari", path: "", component: () => import("pages/komentariPage.vue") },
    ],
  },

  {
    path: "/slika",
    component: () => import("layouts/BlankLayout.vue"),
    children: [
      { name: "slika", path: "", component: () => import("pages/dodaj_slika.vue") }, // Promijenjeno
    ],
  },

  /*
  {
    path: "/atr",
    component: () => import("layouts/BlankLayout.vue"),
    children: [
      { name: "atr", path: "", component: () => import("pages/AtrakcijePage.vue") },
    ],
  },
  */

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;