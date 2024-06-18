<template>
  <div class="page-container">
    <div v-for="post in posts" :key="post.id" class="post-container">
      <div class="post-card">
        <div class="image-canvas">
          <q-img :src="post.slika" class="post-image">
            <!-- Overlay za uređivanje slike, vidljiv samo ako je korisnik autor posta -->
            <div class="image-overlay" v-if="post.user_id === loggedInUserId">
              <q-btn-dropdown color="black" label="Uredi sliku">
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
            <!-- Naslov slike -->
            <div class="image-title">
              <div class="uppercase-title">{{ post.naziv }}</div>
            </div>
          </q-img>
        </div>
      </div>
      <!-- Sekcija za detalje -->
      <div class="details-section">
        <div class="details-card">
          <p class="details-title">Opis:</p>
          <!-- Polje za uređivanje opisa, samo za autora posta -->
          <q-input v-model="post.opis" filled class="opis-input" type="textarea" autogrow placeholder="Update opis" :readonly="post.user_id !== loggedInUserId" />
          <q-btn v-if="post.user_id === loggedInUserId" class="primary-button" @click="updateOpis(post.id_atrakcije, post.opis)" label="Update Opis" />
        </div>
      </div>
    </div>
    <!-- Navigacijski gumbi -->
    <q-card-section class="navigation-buttons">
      <q-btn class="button primary-button" @click="$router.push('/')">Natrag na početnu</q-btn>
      <q-btn class="button primary-button" :to="'/komentari/' + trenutniID">Pogledaj komentare</q-btn>
    </q-card-section>
    <!-- Sekcija za komentare -->
    <q-card-section>
      <div v-if="prikazKomentara" class="q-pa-md row items-start q-gutter-xs">
        <div v-for="comment in komentari" :key="comment.ID_komentara" class="comment">
          <p class="comment-text">{{ comment.Komentar }}</p>
        </div>
        <CommentsSection v-if="prikazKomentara" :attractionId="trenutniID" />
      </div>
    </q-card-section>
    <!-- Sekcija za galeriju slika -->
    <q-card-section>
      <div class="gallery-container">
        <div v-if="slike.length === 0" class="empty-gallery">Nema dostupnih slika.</div>
        <div v-else class="gallery">
          <q-img
            v-for="slika in slike"
            :key="slika.ID_Slike"
            :src="slika.slike"
            class="gallery-image"
            @click="openImageModal(slika)"
          />
        </div>
      </div>
    </q-card-section>
    <!-- Dijalog za prikaz slike u većoj rezoluciji -->
    <q-dialog v-model="showImageDialog">
      <q-img :src="selectedImage" class="enlarged-image" />
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
const loggedInUserId = ref(null); // Pretpostavimo da imate način za dobivanje ID-a prijavljenog korisnika
const newImageUrl = ref("");
const slike = ref([]);

// Dohvati postove i komentare prilikom mount-a komponente
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

// Dohvati komentare za zadani ID atrakcije
const getComments = async (attractionId) => {
  try {
    const response = await api.get(`/comments/${attractionId}`);
    komentari.value = response.data;
  } catch (error) {
    console.error("Error fetching comments:", error);
  }
};

// Dohvati slike za zadani ID atrakcije
const getSlike = async () => {
  try {
    const response = await api.get(`/slike/${trenutniID}`);
    slike.value = response.data;
  } catch (error) {
    console.error("Error fetching images:", error);
  }
};

// Pozovi getPosts prilikom mount-a komponente
onMounted(() => {
  getPosts();
});

// Prebaci vidljivost komentara
const toggleKomentariVisibility = () => {
  prikazKomentara.value = !prikazKomentara.value;
};

// Spremi novu sliku
const spremiSliku = async (atrakcijaId) => {
  const post = posts.value.find(p => p.id_atrakcije === atrakcijaId);
  try {
    await api.put(`/update-slika/${atrakcijaId}`, { newImageUrl: newImageUrl.value });
    getPosts();
  } catch (error) {
    console.error("Error updating image:", error);
  }
};

// Obriši sliku
const obrisiSliku = async (atrakcijaId) => {
  try {
    await api.delete(`/delete-slika/${atrakcijaId}`);
    getPosts();
  } catch (error) {
    console.error("Error deleting image:", error);
  }
};

// Ažuriraj opis
const updateOpis = async (atrakcijaId, newOpis) => {
  try {
    await api.put(`/updateOpis/${atrakcijaId}`, { opis: newOpis });
    getPosts();
  } catch (error) {
    console.error("Error updating opis:", error);
  }
};

// Prikazivanje dijaloga za sliku u većoj rezoluciji
const showImageDialog = ref(false);
const selectedImage = ref("");

// Otvori modal za prikaz slike
const openImageModal = (slika) => {
  selectedImage.value = slika.slike;
  showImageDialog.value = true;
};

// Promatranje promjene vidljivosti dijaloga za sliku
watch(showImageDialog, (newValue) => {
  if (newValue) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
});
</script>

<style scoped>
.page-container {
  background-color: yellow;
  padding: 20px;
  border-radius: 10px;
}

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
  border: 10px solid #d3d3d3;
  padding: 5px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  background-color: white;
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

.opis-input {
  color: black;
  background-color: white;
  margin-top: 10px;
  margin-bottom: 10px;
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
  border-radius: 10px;
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
  border-radius: 10px;
}
</style>
