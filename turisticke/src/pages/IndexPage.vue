<template>
  <div>
    <br>
    <q-input
      v-model="searchTerm"
      outlined
      dense
      placeholder="Pretražite atrakcije po nazivu..."
      @keyup.enter="search"
      class="my-search-bar"
    />
    <div class="q-pa-md row items-start q-gutter-md">

      <template v-if="filteredPosts.length > 0">
        <q-card style="margin-left:3%;"
          v-for="post in filteredPosts"
          :key="post.id"
          class="my-card"
        >
          <q-img :src="post.slika" />

          <q-card-section>
            <q-btn
              fab
              color="primary"
              icon="place"
              class="absolute"
              style="top: 0; right: 12px; transform: translateY(-50%)"
              :to="'/one_atraction/' + post.id_atrakcije"
            />

            <q-btn
              fab
              color="red"
              icon="delete"
              class="absolute"
              style="top: 0px; left: 12px; transform: translateY(-50%)"
              @click="deleteById(post.id_atrakcije)"
            />

            <div class="myDiv" style="padding: 10px"></div>

            <div class="row no-wrap items-center">
              <div class="col text-h6 ellipsis">{{ post.naziv }}</div>
            </div>

            <q-rating
              v-model="post.prosjecna_ocjena"
              :max="5"
              :readonly="true"
              size="32px"
            />
          </q-card-section>

          <q-card-section class="q-pt-none">
            <div class="text-subtitle1">{{ post.adresa }}</div>
            <div class="text-caption text-grey">
              {{ post.opis }}
            </div>
          </q-card-section>

          <q-card-section>
            <!-- Remaining card content -->
          </q-card-section>
        </q-card>
      </template>

      <template v-else>
        <div class="text-caption text-grey">Nije moguće pronaći traženi naslov</div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { api } from 'boot/axios';
import { useRouter } from 'vue-router';

const posts = ref([]);
const searchTerm = ref('');
const router = useRouter();

const getPosts = async () => {
  try {
    const response = await api.get('atrakcije');
    console.log(response.data);
    posts.value = response.data;
  } catch (error) {
    console.log(error);
  }
};

const deleteById = async (id) => {
  try {
    const response = await api.delete(`http://localhost:4200/obrisi_atrakcije/${id}`);
    console.log(response.data);
  } catch (error) {
    console.log(error);
  }
  getPosts();
};

//Search filter for the title
const search = () => {
  filteredPosts.value = posts.value.filter(
    (post) => post.naziv.toLowerCase().includes(searchTerm.value.toLowerCase())
  );
};

onMounted(() => {
  getPosts();
});

const filteredPosts = computed(() => {
  return posts.value.filter(post => post.naziv.toLowerCase().includes(searchTerm.value.toLowerCase()));
});

const goToAtrakcijeDetalji = (id) => {
  router.push({
    name: "one_atraction",
    params: {
      id: id,
    },
  });
};
</script>

<style>
.bg-blue {
  background-color: #2d1eff85;
  color: white;
}

.my-card {
  width: 100%;
  max-width: 300px;
}

.my-search-bar {
  margin-bottom: 10px;
  margin-left: 20px;
  background-color: #ffffff9d;
  width: 40%;
  border-radius: 10px;
}
</style>
