const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/PrikazuSve.vue") },
      { path: "index", component: () => import("pages/IndexPage.vue") },
      { path: "unos", component: () => import("pages/Unos_atrakcija.vue") },
      { path: "brisanje-korisnika", component: () => import("pages/brisanjePage.vue") }, // Dodana ruta za brisanje korisnika
      { path: "axo", component: () => import("pages/AxiosPageTest.vue") },
      { path: "gallery/:id", component: () => import("pages/GalleryPage.vue"), name: "gallery" }, // Ruta za galeriju slika
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
    path: "/one_atraction",
    component: () => import("layouts/BlankLayout.vue"),
    children: [
      { name: "one_atraction", path: ":id", component: () => import("pages/AtrakcijePage.vue") },
      { name: "comments", path: ":id/komentari", component: () => import("components/CommentsSection.vue") },
    ],
  },
  {
    path: "/komentari",
    component: () => import("layouts/BlankLayout.vue"),
    children: [
      { name: "komentari", path: ":id", component: () => import("src/pages/komentariPage.vue") },
    ],
  },

  {
    path: "/slika",
    component: () => import("layouts/BlankLayout.vue"),
    children: [
      { name: "slika", path: "", component: () => import("src/pages/dodaj_slika.vue") },
    ],
  },

  // Route for 404 Page Not Found
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
