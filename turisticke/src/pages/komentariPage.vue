<template>
  <div class="comment-container">
    <div v-if="prosjekOcjena !== null" class="average-rating">
      <h3>Prosječna ocjena:</h3>
      <div class="star-rating">
        <span v-for="star in 5" :key="star" :class="{ 'filled': star <= prosjekOcjena }">&#9733;</span>
        <span>{{ prosjekOcjena.toFixed(1) }}</span>
      </div>
    </div>

    <div v-if="komentari.length > 0" class="comment-list">
      <h3>Komentari:</h3>
      <div v-for="(komentarObj, index) in komentari" :key="index" class="komentar-card">
        <p><strong>{{ komentarObj.Korisnik }}:</strong> {{ komentarObj.Komentar }}</p>
        <div class="star-rating">
          <span v-for="star in 5" :key="star" :class="{ 'filled': star <= komentarObj.Ocjena }">&#9733;</span>
        </div>
      </div>
    </div>

    <div class="comment-form">
      <h3>Unos komentara</h3>
      <h6>Upišite svoj komentar o atrakciji</h6>
      <div class="form-input">
        <q-input class="textarea" outlined v-model="komentar" label="Unesi svoj komentar.." :dense="dense" />
      </div>
      <div class="form-input">
        <div class="star-rating">
          <span v-for="star in 5" :key="star" @click="ocjena = star" :class="{ 'filled': star <= ocjena, 'yellow-star': star === ocjena }">&#9733;</span>
        </div>
      </div>
      <q-card-section class="form-input">
        <q-btn label="Dodaj komentar i ocjenu" @click="dodajKomentarIOcjenu" class="add-comment-btn" />
      </q-card-section>
    </div>

    <q-card-section>
      <q-btn color="#4CAF50" @click="$router.push('/')">Natrag na početnu</q-btn>
    </q-card-section>

    <q-snackbar v-model="showSnackbar" :timeout="3000" message="Uspješno ste dodali komentar i ocjenu!" />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import axios from 'axios';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const trenutniID = route.params.id;
const showSnackbar = ref(false);
const komentar = ref('');
const ocjena = ref(0);
const komentari = ref([]);
const prosjekOcjena = ref(null);
const dense = ref(true);

const dohvatiKomentare = async () => {
  try {
    const response = await axios.get(`http://localhost:4200/prikazikomentari/${trenutniID}`);
    if (response && response.data) {
      komentari.value = response.data.data.map((komentar) => ({
        ...komentar,
        Ocjena: komentar.ocjena || 0,
      }));
      izracunajProsjekOcjena(); // Poziv funkcije za izračun prosječne ocjene
    }
  } catch (error) {
    console.log(error);
  }
};

const dohvatiProsjekOcjena = async () => {
  try {
    const response = await axios.get(`http://localhost:4200/atrakcijeProsjecneOcjene/${trenutniID}`);
    if (response && response.data) {
      prosjekOcjena.value = response.data[0].prosjek;
    }
  } catch (error) {
    console.log(error);
  }
};
 
const izracunajProsjekOcjena = () => {
  if (komentari.value.length === 0) {
    prosjekOcjena.value = null;
    return;
  }

  const sum = komentari.value.reduce((acc, curr) => acc + curr.Ocjena, 0);
  prosjekOcjena.value = sum / komentari.value.length;
};

const dodajKomentarIOcjenu = async () => {
  try {
    const responseKomentar = await axios.post(`http://localhost:4200/dodajKomentar/${trenutniID}`, {
      Komentar: komentar.value,
      Korisnik: "Trenutni korisnik", // Zamijenite s stvarnim korisničkim imenom
      Ocjena: ocjena.value
    });

    showSnackbar.value = true; // Prikazivanje snackbar poruke

    await dohvatiKomentare();
    // Prosječna ocjena će se automatski izračunati nakon dohvaćanja komentara

  } catch (error) {
    console.log(error);
  }
};

onMounted(() => {
  dohvatiKomentare();
  dohvatiProsjekOcjena();
});

watch(komentari, (newValue) => {
  console.log("Novi komentari:", newValue);
});
</script>

<style scoped>
.star-rating {
  font-size: 24px;
}

.star-rating span {
  cursor: pointer;
}

.star-rating .filled {
  color: #fdd835;
}

.star-rating .yellow-star {
  color: yellow;
}

.comment-container {
  background-color: #f4f4f4;
  padding: 20px;
  border-radius: 10px;
}

.comment-form {
  background-color: #ffffff;
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 20px;
}

.form-input {
  margin-bottom: 15px;
}

.komentar-card {
  background-color: #ffffff;
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 15px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.average-rating {
  margin-top: 20px;
}

.add-comment-btn {
  background-color: #229df9;
  color: white;
  border-radius: 5px;
}

.add-comment-btn:hover {
  background-color: #1c7bd4;
}

button {
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  cursor: pointer;
}

button:hover {
  background-color: #ff9900;
}

.rating {
  font-weight: bold;
  color: #4CAF50;
}

/* Snackbar */
.q-snackbar {
  background-color: #4CAF50;
  color: white;
  border-radius: 5px;
}

.q-snackbar__message {
  font-weight: bold;
}

.q-snackbar__actions {
  justify-content: flex-end;
}
</style>
