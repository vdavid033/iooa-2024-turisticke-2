<template>
  <div style="background-color: #229df9; padding: 20px; border-radius: 10px;">
    <!-- Main content section -->
    <div v-for="post in posts" :key="post.id" class="row q-pa-md">
      <div q-card>
        <!-- Image section -->
        <q-img :src="post.slika" width="800px" height="600px" position="absolute" top="50%" left="50%"
          transform="translate(-50%, -50%)">
          <!-- Image overlay for editing options -->
          <div class="q-pa-md">
            <q-btn-dropdown color="black" label="Uredi sliku">
              <q-list>
                <!-- Form for saving image -->
                <q-item-section>
                  <q-form @click="spremiSliku(name, post.id_atrakcije)" class="q-gutter-md">
                    <q-input class="bg-light-blue-11" filled v-model="name" label="Zalijepi link nove slike" />
                    <div style="display: flex; justify-content: center; align-items: center;">
                      <q-btn class="" label="Spremi sliku" type="submit" color="primary" />
                    </div>
                  </q-form>
                </q-item-section>
                <!-- Button for deleting image -->
                <q-item clickable v-close-popup @click="obrisi_sliku(post.id_atrakcije)">
                  <q-item-section>
                    <q-item-label style="display: flex; justify-content: center; align-items: center;">OBRIŠI
                      SLIKU</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>
          </div>
          <!-- Image title -->
          <div class="absolute-bottom text-subtitle1 text-center">
            <div style="text-transform: uppercase; font-size: 50px">{{ post.naziv }}</div>
          </div>
        </q-img>
      </div>

      <!-- Details section -->
      <div class="q-pa-md">
        <div class="q-pa-md items-start q-gutter-xs" style="background-color: black; color: white;">
          <p style="font-size: 20px;">Opis:</p>
          <div class="post-text">{{ post.opis }}</div>
          <!-- Other details like address, rating, etc. -->
          <!-- Add your details here as per your requirement -->
        </div>
      </div>
    </div>

    <!-- Navigation buttons -->
    <q-card-section>
      <!-- Button to navigate back to the homepage -->
      <q-btn class="button" @click="$router.push('/')" label="Natrag na početnu" />
      <!-- Button to view comments -->
      <q-btn class="button" :to="'/komentari/' + trenutniID" label="Pogledaj komentare" />
    </q-card-section>

    <!-- Section for displaying comments -->
    <q-card-section>
      <div class="q-pa-md row items-start q-gutter-xs">
        <!-- Loop through comments and display them -->
        <div v-for="comment in komentari" :key="comment.ID_komentara" class="comment">
          <p style="font-size: 20px; color: white">{{ comment.Komentar }}</p>
        </div>
      </div>
      <!-- Comment section -->
      <CommentsSection v-if="prikazKomentara" :attractionId="trenutniID" />
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
</script>

<style scoped>
.row {
  display: flex;
  flex-wrap: wrap;
  margin-right: -15px;
  margin-left: -15px;
}
.q-pa-md {
  padding: 16px !important;
}
.q-gutter-xs {
  gap: 4px;
}
.q-gutter-md {
  gap: 16px;
}
.my-card {
  width: 100%;
  margin: 8px 0;
}
.button {
  margin-right: 8px;
}
</style>
