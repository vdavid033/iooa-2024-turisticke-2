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
      <q-card v-for="post in filteredPosts" :key="post.id_atrakcije" class="my-card">
        <q-img :src="post.slika" class="my-card-img" />

        <q-card-section>
          <q-input v-model="post.opis" filled class="opis-input" type="textarea" autogrow placeholder="Update opis" />
          <q-btn class="primary-button" @click="updateOpis(post.id_atrakcije, post.opis)" label="Update Opis" />
        </q-card-section>

        <q-card-section>
          <q-input v-model="newImageUrl" filled class="opis-input" type="text" placeholder="Nova URL slike" />
          <q-btn class="primary-button" @click="spremiSliku(post.id_atrakcije)" label="Spremi sliku" />
          <q-btn class="negative-button" @click="deleteById(post.id_atrakcije)" label="Obriši atrakciju" />
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
    const newImageUrl = ref("");
    const showDescription = ref({}); // State to track visibility of descriptions

    const getPosts = async () => {
      const token = localStorage.getItem("token");
      if (!token) return console.error("Token not found. Please log in.");

      const decodedToken = jwtDecode(token);
      const id_korisnika = decodedToken.id;
      if (!id_korisnika) return console.error("User ID missing in the token.");

      try {
        const response = await api.get(`atrakcije?id_korisnika=${id_korisnika}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        posts.value = response.data;

        // Initialize showDescription for each post
        posts.value.forEach(post => {
          showDescription.value[post.id_atrakcije] = false;
        });

        // Fetch and update average ratings for each post
        for (let post of posts.value) {
          post.prosjecna_ocjena = await getAverageRating(post.id_atrakcije);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    const getAverageRating = async (id_atrakcije) => {
      try {
        const response = await api.get(`/atrakcijeProsjecneOcjene/${id_atrakcije}`);
        return response.data.prosjecna_ocjena;
      } catch (error) {
        console.error("Greška pri dohvaćanju prosječne ocjene:", error);
        return null;
      }
    };

    const deleteById = async (id_atrakcije) => {
      const token = localStorage.getItem("token");
      if (!token) return console.error("Token not found. Please log in.");

      const decodedToken = jwtDecode(token);
      const id_korisnika = decodedToken.id,
        uloga = decodedToken.uloga;

      try {
        await api.delete(`obrisi_atrakcije/${id_atrakcije}`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { id_korisnika, uloga },
        });
        getPosts();
      } catch (error) {
        console.error("Failed to delete post:", error);
      }
    };

    const search = () => {
      filteredPosts.value = posts.value.filter(
        (post) =>
          post.naziv.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
          post.opis.toLowerCase().includes(searchTerm.value.toLowerCase())
      );
    };

    const updateOpis = async (id_atrakcije, newOpis) => {
      try {
        await api.put(`/updateOpis/${id_atrakcije}`, { opis: newOpis });
        getPosts();
      } catch (error) {
        console.error("Error updating opis:", error);
      }
    };

    const spremiSliku = async (atrakcijaId) => {
      try {
        await api.put(`/update-slika/${atrakcijaId}`, { newImageUrl: newImageUrl.value });
        getPosts();
        newImageUrl.value = ""; // Clear input after saving
      } catch (error) {
        console.error("Error updating image:", error);
      }
    };

    onMounted(getPosts);

    const filteredPosts = computed(() => {
      return posts.value.filter(
        (post) =>
          post.naziv.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
          post.opis.toLowerCase().includes(searchTerm.value.toLowerCase())
      );
    });

    return { posts, searchTerm, newImageUrl, showDescription, search, filteredPosts, deleteById, updateOpis, spremiSliku };
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

.toggle-button {
  background-color: #4caf50;
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.toggle-button:hover {
  background-color: #45a049;
}

@media (max-width: 1200px) {
  .my-card {
    flex: 1 1 calc(50% - 16px); /* Dvije kartice po redu */
    max-width: calc(50% - 16px );
  }
}

@media (max-width: 768px) {
  .my-card {
    flex: 1 1 100%; /* Jedna kartica po redu */
    max-width: 100%;
  }
}

@media (max-width: 600px) {
  .my-search-bar {
    width: 100%; /* Full width on smaller screens */
    margin-left: 0; /* Remove left margin on smaller screens */
  }
}

.opis-input {
  margin-bottom: 10px;
  width: 100%;
}

.primary-button {
  margin-right: 10px;
}

.negative-button {
  margin-right: 10px;
}

.text-caption {
  max-height: 100px; /* Limit maximum height of opis text */
  overflow-y: auto; /* Add scrollbar when opis text overflows */
}

.q-card-section:not(:last-child) {
  margin-bottom: 10px; /* Add margin bottom to all card sections except the last one */
}
</style>

