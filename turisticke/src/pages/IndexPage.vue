<template>
  <div class="q-pa-md row items-start q-gutter-md bg-yellow">
    <!-- Attraction cards -->
    <q-card v-for="post in posts" :key="post.id" class="my-card">
      <q-img :src="post.slika" />

      <q-card-section>
        <q-btn fab icon="place" class="absolute top-right" :to="'/one_atraction/' + post.id_atrakcije" />
        <q-btn fab icon="delete" color="red" class="absolute top-left" @click="deleteById(post.id_atrakcije)" />
        <div class="text-h6">{{ post.naziv }}</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <div class="text-subtitle1">{{ post.adresa }}</div>
        <div class="text-caption text-grey">{{ post.opis }}</div>
        <q-rating v-model="post.prosjecna_ocjena" :max="5" :readonly="true" size="32px" />
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { api } from "boot/axios";
import { jwtDecode } from "jwt-decode"; // Assume this library is already installed

export default {
  setup() {
    const posts = ref([]);

    const getPosts = async () => {
      const token = localStorage.getItem('token');
      if (!token) return console.error('Token not found. Please log in.');

      const decodedToken = jwtDecode(token);
      const id_korisnika = decodedToken.id;
      if (!id_korisnika) return console.error('User ID missing in the token.');

      try {
        const response = await api.get(`atrakcije?id_korisnika=${id_korisnika}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        posts.value = response.data;
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    const deleteById = async (id_atrakcije) => {
      const token = localStorage.getItem("token");
      if (!token) return console.error("Token not found. Please log in.");

      const decodedToken = jwtDecode(token);
      const id_korisnika = decodedToken.id, uloga = decodedToken.uloga;

      try {
        await api.delete(`obrisi_atrakcije/${id_atrakcije}`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { id_korisnika, uloga }
        });
        getPosts();
      } catch (error) {
        console.error("Failed to delete post:", error);
      }
    };

    onMounted(getPosts);
    return { posts, deleteById };
  },
};
</script>

<style>
.bg-yellow {
  background-color: yellow; /* Yellow background */
  color: black; /* Adjust text color for readability */
}

.my-card {
  width: 100%;
  max-width: 300px;
}

.top-right {
  top: 0; right: 12px;
  transform: translateY(-50%);
}

.top-left {
  top: 0; left: 12px;
  transform: translateY(-50%);
}
</style>
