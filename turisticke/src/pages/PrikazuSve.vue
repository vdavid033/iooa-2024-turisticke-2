<template>
  <div style="background-color: yellow">
    <q-input
      v-model="searchTerm"
      outlined
      dense
      placeholder="Pretražite atrakcije po nazivu..."
      @keyup.enter="search"
      class="my-search-bar"
    />
    <div class="q-pa-md row items-start q-gutter-md my-card-container">
      <!-- Kartice atrakcija -->
      <q-card
        v-for="post in filteredPosts"
        :key="post.id"
        class="my-card"
      >
        <q-img :src="post.slika" class="my-card-img"/>

        <q-card-section>
          <q-btn
            fab
            color="primary"
            icon="place"
            class="absolute"
            style="top: 0; right: 12px; transform: translateY(-50%)"
            :to="'/one_atraction/' + post.id_atrakcije"
          />

          <q-btn
            fab
            color="red"
            icon="delete"
            class="absolute"
            style="top: 0px; left: 12px; transform: translateY(-50%)"
            @click="deleteById(post.id_atrakcije)"
          />

          <div class="myDiv" style="padding: 10px"></div>

          <div class="row no-wrap items-center">
            <div class="col text-h6 ellipsis">{{ post.naziv }}</div>
          </div>

          <q-rating
            v-model="post.prosjecna_ocjena"
            :max="5"
            :readonly="true"
            size="32px"
          />
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div class="text-subtitle1">{{ post.adresa }}</div>
          <div class="text-caption text-grey">
            {{ post.opis }}
          </div>
        </q-card-section>
      </q-card>
    </div>

    <template v-if="filteredPosts.length === 0">
      <div class="text-caption text-grey">Nije moguće pronaći traženi naslov</div>
    </template>
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { api } from "boot/axios";
import { jwtDecode } from "jwt-decode"; // Assume this library is already installed

export default {
  setup() {
    const posts = ref([]);
    const searchTerm = ref("");

    const getPosts = async () => {
      try {
        const response = await api.get("sveatrakcije");
        posts.value = response.data;
      } catch (error) {
        console.error(error);
      }
    };

    const deleteById = async (id_atrakcije) => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("Token not found. Please log in.");
          return;
        }

        // Decode the JWT token to get user details
        const decodedToken = jwtDecode(token);
        const id_korisnika = decodedToken.id;
        const uloga = decodedToken.uloga;

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            id_korisnika, // Pass the user ID to the backend
            uloga,
          },
        };

        const response = await api.delete(`http://localhost:4200/obrisi_atrakcije/${id_atrakcije}`, config);
        getPosts(); // Refresh the attraction list after deletion
      } catch (error) {
        console.error("Failed to delete post:", error);
      }
    };

    const search = () => {
      filteredPosts.value = posts.value.filter((post) =>
        post.naziv.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
        post.opis.toLowerCase().includes(searchTerm.value.toLowerCase())
      );
    };

    onMounted(getPosts);

    const filteredPosts = computed(() => {
      return posts.value.filter((post) =>
        post.naziv.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
        post.opis.toLowerCase().includes(searchTerm.value.toLowerCase())
      );
    });

    return { posts, searchTerm, search, filteredPosts, deleteById };
  },
};
</script>

<style>
.bg-blue {
  background-color: #1e90ff;
  color: white;
}

.my-card-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.my-card {
  flex: 1 1 calc(33.3333% - 16px); /* Three cards per row, with some margin */
  max-width: calc(33.3333% - 16px);
  margin-bottom: 16px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.my-card-img {
  height: 200px; /* Set a fixed height for images */
  object-fit: cover; /* Ensure the image covers the area without distorting */
}

.my-search-bar {
  margin-bottom: 10px;
  margin-left: 20px;
  background-color: #ffffff9d;
  width: 50%; /* Increased width */
  border-radius: 10px;
}

@media (max-width: 1200px) {
  .my-card {
    flex: 1 1 calc(50% - 16px); /* Two cards per row */
    max-width: calc(50% - 16px);
  }
}

@media (max-width: 768px) {
  .my-card {
    flex: 1 1 100%; /* One card per row */
    max-width: 100%;
  }
}
</style>
