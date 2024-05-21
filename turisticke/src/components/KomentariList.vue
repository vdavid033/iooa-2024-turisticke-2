<template>
  <div>
    <h2>Komentari</h2>
    <div v-for="komentar in komentari" :key="komentar.id">
      <p>{{ komentar.tekst }}</p>
      <p>{{ komentar.autor }}</p>
      <p>{{ komentar.datum }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { api } from 'boot/axios';

const komentari = ref([]);
const trenutniID = $route.params.id;

const getKomentari = async () => {
  try {
    const response = await api.get(`http://localhost:4200/prikazikomentari/${trenutniID}`);
    komentari.value = response.data.data;
  } catch (error) {
    console.error("Error fetching comments:", error);
  }
};

onMounted(() => {
  getKomentari();
});
</script>
