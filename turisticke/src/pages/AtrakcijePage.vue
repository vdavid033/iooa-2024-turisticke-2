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

    <!-- Gallery Section -->
    <q-card-section>
      <div class="gallery-container">
        <div v-if="slike.length === 0" class="empty-gallery">Nema dostupnih slika.</div>
        <div v-else class="gallery">
          <q-img
            v-for="slika in slike"
            :key="slika.ID_Slike"
            :src="slika.slike"
            class="gallery-image"
            style="border-radius: 10px; cursor: pointer;"
            @click="openImageModal(slika)"
          />
        </div>
      </div>
    </q-card-section>

    <!-- Image Dialog -->
    <q-dialog v-model="showImageDialog">
      <q-img :src="selectedImage" class="enlarged-image" style="border-radius: 10px;" />
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
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
const slike = ref([]);

const getPosts = async () => {
  try {
    const response = await api.get(`/natrakcije/${trenutniID}`);
    posts.value = response.data ? [response.data] : [];
    await getComments(trenutniID);
    await getSlike();
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

const getSlike = async () => {
  try {
    const response = await api.get(`/slike/${trenutniID}`);
    slike.value = response.data;
  } catch (error) {
    console.error("Error fetching images:", error);
  }
};

onMounted(() => {
  getPosts();
});

const toggleKomentariVisibility = () => {
  prikazKomentara.value = !prikazKomentara.value;
};






const showImageDialog = ref(false); // State to control visibility of the image dialog
const selectedImage = ref(""); // URL of the selected image to display in the dialog

const openImageModal = (slika) => {
  selectedImage.value = slika.slike; // Set the selected image URL
  showImageDialog.value = true; // Show the dialog
};

// Watch for dialog visibility change to handle body overflow
watch(showImageDialog, (newValue) => {
  if (newValue) {
    document.body.style.overflow = 'hidden'; // Disable body scroll
  } else {
    document.body.style.overflow = ''; // Enable body scroll
  }
});
</script>

<style scoped>
/* Your scoped styles here */
.gallery-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 20px;
}

.gallery-image {
  width: 150px;
  height: 150px;
  margin: 10px;
  cursor: pointer;
  object-fit: cover;
  border-radius: 10px; /* Rounded corners */
}

.empty-gallery {
  text-align: center;
  margin-top: 20px;
  color: gray;
}

.enlarged-image {
  max-width: 80vw;
  max-height: 80vh;
  object-fit: contain;
  border-radius: 10px; /* Rounded corners */
}
</style>
