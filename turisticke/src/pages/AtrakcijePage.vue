<template>
  <div style="background-color: yellow; padding: 20px; border-radius: 10px;">
    <!-- Main content section -->
    <div v-for="post in posts" :key="post.id" class="post-container">
      <div class="post-card">
        <!-- Image section with canvas border -->
        <div class="image-canvas">
          <q-img :src="post.slika" class="post-image">
            <!-- Image overlay for editing options -->
            <div class="image-overlay">
              <q-btn-dropdown color="black" label="Uredi sliku">
                <q-list>
                  <!-- Form for saving image -->
                  <q-item-section>
                    <q-form @submit.prevent="spremiSliku(name, post.id_atrakcije)" class="q-gutter-md">
                      <q-input class="bg-light-blue-11" filled v-model="name" label="Zalijepi link nove slike" />
                      <div class="button-center">
                        <q-btn class="primary-button" label="Spremi sliku" type="submit" color="primary" />
                      </div>
                    </q-form>
                  </q-item-section>
                  <!-- Button for deleting image -->
                  <q-item clickable v-close-popup @click="obrisi_sliku(post.id_atrakcije)">
                    <q-item-section>
                      <q-item-label class="center-text">OBRIŠI SLIKU</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-btn-dropdown>
            </div>
            <!-- Image title -->
            <div class="image-title">
              <div class="uppercase-title">{{ post.naziv }}</div>
            </div>
          </q-img>
        </div>
      </div>

      <!-- Details section -->
      <div class="details-section">
        <div class="details-card">
          <p class="details-title">Opis:</p>
          <q-input v-model="post.opis" filled class="opis-input" placeholder="Update opis" />
          <q-btn class="primary-button" @click="updateOpis(post.id_atrakcije, post.opis)" label="Update Opis" />
          <!-- Other details like address, rating, etc. -->
          <!-- Add your details here as per your requirement -->
        </div>
      </div>
    </div>

    <!-- Navigation buttons -->
    <q-card-section class="navigation-buttons">
      <!-- Button to navigate back to the homepage -->
      <q-btn class="button primary-button" @click="$router.push('/')" label="Natrag na početnu" />
      <!-- Button to view comments -->
      <q-btn class="button primary-button" :to="'/komentari/' + trenutniID" label="Pogledaj komentare" @click="toggleKomentariVisibility" />
    </q-card-section>

    <!-- Section for displaying comments -->
    <q-card-section>
      <div v-if="prikazKomentara" class="q-pa-md row items-start q-gutter-xs">
        <!-- Loop through comments and display them -->
        <div v-for="comment in komentari" :key="comment.ID_komentara" class="comment">
          <p class="comment-text">{{ comment.Komentar }}</p>
        </div>
        <!-- Comment section component -->
        <CommentsSection v-if="prikazKomentara" :attractionId="trenutniID" />
      </div>
    </q-card-section>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { api } from "boot/axios";
import { useRoute } from "vue-router";
import CommentsSection from '../components/CommentsSection.vue';

const posts = ref([]);
const route = useRoute();
const trenutniID = route.params.id;
const prikazKomentara = ref(false); // Controls the visibility of comments
const komentari = ref([]);

// Fetches posts and comments on mount
const getPosts = async () => {
  try {
    const response = await api.get(`/natrakcije/${trenutniID}`);
    posts.value = response.data ? [response.data] : [];
    // Get comments for current attraction
    await getComments(trenutniID);
  } catch (error) {
    console.error("Error fetching attraction details:", error);
  }
};

// Fetch comments for the specified attraction ID
const getComments = async (attractionId) => {
  try {
    const response = await api.get(`/comments/${attractionId}`);
    komentari.value = response.data;
  } catch (error) {
    console.error("Error fetching comments:", error);
  }
};

// Call this function on component mount
onMounted(() => {
  getPosts();
});

const toggleKomentariVisibility = () => {
  prikazKomentara.value = !prikazKomentara.value;
};

const spremiSliku = async (newImageUrl, atrakcijaId) => {
  try {
    await api.put(`/update-slika/${atrakcijaId}`, { newImageUrl });
    getPosts(); // Refresh posts to show updated image
  } catch (error) {
    console.error("Error updating image:", error);
  }
};

const obrisi_sliku = async (atrakcijaId) => {
  try {
    await api.delete(`/delete-slika/${atrakcijaId}`);
    getPosts(); // Refresh posts to reflect the deletion
  } catch (error) {
    console.error("Error deleting image:", error);
  }
};

const updateOpis = async (atrakcijaId, newOpis) => {
  try {
    await api.put(`/updateOpis/${atrakcijaId}`, { opis: newOpis });
    getPosts(); // Refresh posts to show updated opis
  } catch (error) {
    console.error("Error updating opis:", error);
  }
};
</script>

<style scoped>
.post-container {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.post-card {
  width: 100%;
  max-width: 800px;
  margin: auto;
  position: relative;
}

.image-canvas {
  border: 10px solid #d3d3d3; /* Canvas-like border */
  padding: 5px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  background-color: white; /* Canvas color */
}

.post-image {
  width: 100%;
  height: auto;
  position: relative;
}

.image-overlay {
  position: absolute;
  top: 10px;
  right: 10px;
}

.image-title {
  position: absolute;
  bottom: 10px;
  left: 0;
  width: 100%;
  text-align: center;
  color: white;
  font-size: 50px;
  text-transform: uppercase;
}

.details-section {
  width: 100%;
  max-width: 800px;
  margin: auto;
  padding: 16px;
}

.details-card {
  background-color: black;
  color: white;
  padding: 16px;
  border-radius: 10px;
}

.details-title {
  font-size: 20px;
}

.navigation-buttons {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
}

.button {
  margin-right: 8px;
}

.primary-button {
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.primary-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
}

.comment {
  background-color: black;
  color: white;
  padding: 16px;
  margin-bottom: 10px;
  border-radius: 10px;
}

.comment-text {
  font-size: 20px;
}

.center-text {
  display: flex;
  justify-content: center;
  align-items: center;
}

.button-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

.uppercase-title {
  text-transform: uppercase;
  font-size: 50px;
}

/* Styling for the opis input field */
.opis-input {
  color: white;
  background-color: rgb(255, 255, 255);
}
</style>
