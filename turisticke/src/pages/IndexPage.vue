<template>
  <div class="bg-yellow">
    <q-input
      v-model="searchTerm"
      outlined
      dense
      placeholder="Pretražite atrakcije po nazivu..."
      @keyup.enter="search"
      class="my-search-bar"
    />
    <div class="q-pa-md row items-start q-gutter-md my-card-container">
      <!-- Attraction cards -->
      <q-card
        v-for="post in filteredPosts"
        :key="post.id_atrakcije"
        class="my-card"
      >
        <q-img :src="post.slika" class="my-card-img"/>

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

      <template v-if="filteredPosts.length === 0">
        <div class="text-caption text-grey">Nije moguće pronaći traženi naslov</div>
      </template>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { api } from "boot/axios";
import { jwtDecode } from "jwt-decode";

export default {
  setup() {
    const posts = ref([]);
    const searchTerm = ref("");

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

        // Fetch and update average ratings for each post
        for (let post of posts.value) {
          post.prosjecna_ocjena = await getAverageRating(post.id_atrakcije);
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    const getAverageRating = async (id_atrakcije) => {
      try {
        const response = await api.get(`/atrakcijeProsjecneOcjene/${id_atrakcije}`);
        return response.data.prosjecna_ocjena;
      } catch (error) {
        console.error('Greška pri dohvaćanju prosječne ocjene:', error);
        return null;
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
.bg-yellow {
  background-color: yellow;
  color: black;
}

.my-card-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.my-card {
  flex: 1 1 calc(33.3333% - 16px); /* Tri kartice po redu, s malim razmakom */
  max-width: calc(33.3333% - 16px);
  margin-bottom: 16px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.my-card-img {
  height: 200px; /* Fiksna visina slike */
  object-fit: cover; /* Osigurava da slika pokriva područje bez iskrivljivanja */
}

.my-search-bar {
  margin-bottom: 10px;
  margin-left: 20px;
  background-color: #ffffff9d;
  width: 50%; /* Povećana širina */
  border-radius: 10px;
}

@media (max-width: 1200px) {
  .my-card {
    flex: 1 1 calc(50% - 16px); /* Dvije kartice po redu */
    max-width: calc(50% - 16px);
  }
}

@media (max-width: 768px) {
  .my-card {
    flex: 1 1 100%; /* Jedna kartica po redu */
    max-width: 100%;
  }
}
</style>
