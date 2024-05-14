<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          <div class="text-h6"><b>Turističke atrakcije</b></div>
        </q-toolbar-title>
        <q-toolbar-title>
          <div class="text-h6"><b> </b>{{ userRole }}</div>
        </q-toolbar-title>

        <!-- Display Logout button only if user is logged in -->
        <q-btn v-if="isUserLoggedIn" flat icon="logout" label="ODJAVA" @click="clearLocalStorage" />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header> Izbornik </q-item-label>
        <EssentialLink v-for="link in essentialLinks" :key="link.title" v-bind="link" />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";
import EssentialLink from "components/EssentialLink.vue";
import { jwtDecode } from 'jwt-decode'; // Import jwt-decode library

const linksList = [
  {
    title: "Prijava",
    icon: "login",
    link: "auth",
    target: "_self",
  },
  {
    title: "Sve atrakcije",
    caption: "popis svih atrakcija",
    icon: "favorite",
    link: "/",
    target: "_self",
  },
  {
    title: "Moje atrakcije",
    caption: "popis mojih atrakcija",
    icon: "favorite",
    link: "/index",
    target: "_self",
  },
  {
    title: "Unos atrakcija",
    caption: "unos novih atrakcija",
    icon: "swap_horizontal_circle",
    link: "unos",
    target: "_self",
  }
];

export default defineComponent({
  name: "MainLayout",
  components: {
    EssentialLink,
  },

  setup() {
    const leftDrawerOpen = ref(false);
    const userRole = ref(""); // Ref to store user role
    const isUserLoggedIn = ref(false); // Ref to track user login status

    function clearLocalStorage() {
      localStorage.clear();
      window.location.reload();
      console.log("Local storage is cleared."); // Optional: Log message to console
    }

    function getUserRole() {
      const token = localStorage.getItem('token');
      if (token) {
        isUserLoggedIn.value = true; // Set user login status to true
        try {
          const decoded = jwtDecode(token);
          userRole.value = decoded.uloga; // Set user role
        } catch (error) {
          console.error('Error decoding token:', error);
          userRole.value = "Niste prijavljeni"; // If there's an error decoding token
        }
      } else {
        userRole.value = "Niste prijavljeni"; // If token doesn't exist
      }
    }

    // Refresh user role on component initialization
    onMounted(getUserRole);

    return {
      essentialLinks: linksList,
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
      clearLocalStorage,
      userRole, // Available in the template
      isUserLoggedIn // Available in the template
    };
  },
});
</script>
