<template>
  <div style="background-color: yellow; padding: 20px; border-radius: 10px;">
    <div v-for="post in posts" :key="post.id" class="post-container">
      <div class="post-card">
        <div class="image-canvas">
          <q-img :src="post.slika" class="post-image">
            <div class="image-overlay">
              <q-btn-dropdown v-if="post.user_id === loggedInUserId" color="black" label="Uredi sliku">
                <q-list>
                  <q-item-section>
                    <q-form @submit.prevent="spremiSliku(post.id_atrakcije)" class="q-gutter-md">
                      <q-input class="bg-light-blue-11" filled v-model="newImageUrl" label="Zalijepi link nove slike" />
                      <div class="button-center">
                        <q-btn class="primary-button" label="Spremi sliku" type="submit" color="primary" />
                      </div>
                    </q-form>
                  </q-item-section>
                  <q-item clickable v-close-popup @click="obrisiSliku(post.id_atrakcije)">
                    <q-item-section>
                      <q-item-label class="center-text">OBRIŠI SLIKU</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-btn-dropdown>
            </div>
            <div class="image-title">
              <div class="uppercase-title">{{ post.naziv }}</div>
            </div>
          </q-img>
        </div>
      </div>
      <div class="details-section">
        <div class="details-card">
          <p class="details-title">Opis:</p>
          <q-input v-model="post.opis" filled class="opis-input" type="textarea" autogrow placeholder="Update opis" :readonly="post.user_id !== loggedInUserId" />
          <q-btn v-if="post.user_id === loggedInUserId" class="primary-button" @click="updateOpis(post.id_atrakcije, post.opis)" label="Update Opis" />
        </div>
      </div>
    </div>
    <q-card-section class="navigation-buttons">
      <q-btn class="button primary-button" @click="$router.push('/')">Natrag na početnu</q-btn>
      <q-btn class="button primary-button" :to="'/komentari/' + trenutniID">Pogledaj komentare</q-btn>
    </q-card-section>
    <q-card-section>
      <div v-if="prikazKomentara" class="q-pa-md row items-start q-gutter-xs">
        <div v-for="comment in komentari" :key="comment.ID_komentara" class="comment">
          <p class="comment-text">{{ comment.Komentar }}</p>
        </div>
        <CommentsSection v-if="prikazKomentara" :attractionId="trenutniID" />
      </div>
    </q-card-section>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { api } from "boot/axios";
import CommentsSection from '../components/CommentsSection.vue';

const posts = ref([]);
const route = useRoute();
const trenutniID = route.params.id;
const prikazKomentara = ref(false);
const komentari = ref([]);
const loggedInUserId = ref(null); // Assume you have a way to get the logged-in user's ID
const newImageUrl = ref("");

const getPosts = async () => {
  try {
    const response = await api.get(`/natrakcije/${trenutniID}`);
    posts.value = response.data ? [response.data] : [];
    await getComments(trenutniID);
  } catch (error) {
    console.error("Error fetching attraction details:", error);
  }
};

const getComments = async (attractionId) => {
  try {
    const response = await api.get(`/comments/${attractionId}`);
    komentari.value = response.data;
  } catch (error) {
    console.error("Error fetching comments:", error);
  }
};

onMounted(() => {
  getPosts();
});

const toggleKomentariVisibility = () => {
  prikazKomentara.value = !prikazKomentara.value;
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

const obrisiSliku = async (atrakcijaId) => {
  try {
    await api.delete(`/delete-slika/${atrakcijaId}`);
    getPosts();
  } catch (error) {
    console.error("Error deleting image:", error);
  }
};

const updateOpis = async (atrakcijaId, newOpis) => {
  try {
    await api.put(`/updateOpis/${atrakcijaId}`, { opis: newOpis });
    getPosts();
  } catch (error) {
    console.error("Error updating opis:", error);
  }
};
</script>

<style scoped>
/* Your scoped styles here */
</style>
