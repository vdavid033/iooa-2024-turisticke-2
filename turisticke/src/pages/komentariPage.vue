<template>
  <div style="background-color: #229df9; padding: 20px; border-radius: 10px;">
    <h3>Unos komentara</h3>
    <h6>U polje ispod upišite svoj komentar o atrakciji</h6>
    <div class="q-pa-md row items-start q-gutter-md">
      <q-input class="textarea" outlined v-model="komentar" label="Unesi svoj komentar.." :dense="dense" />
    </div>
    <q-card-section>
      <q-btn label="Dodaj komentar" @click="dodajKomentar" class="add-comment-btn" />
    </q-card-section>

    <div v-if="komentari.length > 0">
      <h3>Komentari:</h3>
      <div v-for="(komentar, index) in komentari" :key="index" class="komentar-card">
        <p><strong>{{ komentar.Korisnik }}:</strong> {{ komentar.Komentar }}</p>
      </div>
    </div>

    <q-card-section>
      <q-btn color="#4CAF50" @click="$router.push('/')">Natrag na početnu</q-btn>
    </q-card-section>

    <p>{{ message }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import axios from 'axios';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const trenutniID = route.params.id;
const message = ref('');
const komentar = ref('');
const komentari = ref([]);
const dense = ref(true); // Definicija dense svojstva

// Dohvaćanje komentara za atrakciju iz baze podataka
const dohvatiKomentare = async () => {
  try {
    const response = await axios.get(`http://localhost:4200/prikazikomentari/${trenutniID}`);
    if (response && response.data) {
      console.log(response.data.data);
      komentari.value = response.data.data;
      console.log("Komentari:", response.data.data); // Ispis komentara u konzoli
    }
  } catch (error) {
    console.log(error);
  }
};

// Dodavanje komentara za atrakciju
const dodajKomentar = async () => {
  try {
    const response = await axios.post(`http://localhost:4200/dodajKomentar/${trenutniID}`, {
      Komentar: komentar.value,
      Korisnik: "Trenutni korisnik" // Zamijenite s stvarnim korisničkim imenom
    });
    console.log(response.data);

    message.value = 'Uspješno ste dodali komentar!';

    // Dohvati sve komentare za trenutni ID
    await dohvatiKomentare();

    // Ažuriraj prikaz komentara
    // (Ovo će osvežiti prikaz komentara nakon što se dodaju novi komentari)
    console.log("Novi komentari:", komentari.value);
  } catch (error) {
    console.log(error);
  }
};

onMounted(dohvatiKomentare); // Pozivanje funkcije za dohvat komentara pri inicijalizaciji komponente

// Prati promene u komentarima i reaguje na njih
watch(komentari, (newValue) => {
  console.log("Novi komentari:", newValue);
});

</script>

<style scoped>
.textarea {
  width: 98%;
  height: 120px;
  margin-left: 5px;
  margin-bottom: 10px;
  padding: 10px;
  background-color: #ffffff;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.add-comment-btn {
  background-color: #4CAF50;
  color: white;
  border-radius: 5px;
  margin-top: 10px;
}

.add-comment-btn:hover {
  background-color: #45a049;
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

.komentar-card {
  background-color: #ffffff;
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}
</style>
