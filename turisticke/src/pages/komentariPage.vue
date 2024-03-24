<template>
  <div style="background-color: #229df9;">

  <h3>Unos komentara</h3>
  <h6>U polje ispod upišite svoj komentar o atrakciji</h6>
  <div class="q-pa-md row items-start q-gutter-md">
      <q-input class="textarea" outlined v-model="komentar" label="Unesi svoj komentar.. " :dense="dense" />
  </div>
    <q-card-section>
            <q-btn label="Dodaj komentar" @click="dodajKomentar(komentar, trenutniID)" />
        </q-card-section>


  <q-card-section>
      <q-btn color="#4CAF50" @click="$router.push('/')" label="Natrag na početnu" />
    </q-card-section>

    <p>{{ message }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { api } from 'boot/axios'

import { useRoute, useRouter } from 'vue-router';

const posts = ref([])
const route = useRoute()
const router = useRouter()
const trenutniID = route.params.id
const message = ref('');

//Dodavanje komentara za atrakciju

const dodajKomentar = async (komentar, trenutniID) => {
  try {
    console.log('Komentar: ', komentar);
    console.log("ID: ", trenutniID);

    const response = await api.post(`http://localhost:4200/dodajKomentar/${trenutniID}`, {
      Komentar: komentar
    });
    console.log(response.data);

    message.value = 'Uspješno ste dodali komentar!'; 
  } catch (error) {
    console.log(error);
    
  }
};
</script>


<style scoped>
.textarea {
  width: 98%;
  height: 120px;
  margin-left: 5px;
  margin-bottom: 10px;
  padding-top: 25px;
  background-color: rgb(155, 197, 194);

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
</style>
