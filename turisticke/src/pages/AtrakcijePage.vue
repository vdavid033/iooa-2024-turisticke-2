<template>
  <div style="background-color: #229df9">
    <div v-for="post in posts" :key="post.id" class="row q-pa-md">

      <div q-card>

        <q-img :src=post.slika width="800px" height="600px" position="absolute" top="50%" left="50%"
          transform="translate(-50%, -50%)">
          <div class="q-pa-md">
            <q-btn-dropdown color="black" label="Uredi sliku">
              <q-list>

                  <q-item-section>
                    <q-form @click="spremiSliku(name, post.id_atrakcije)" class="q-gutter-md">
              <q-input class="bg-light-blue-11" filled v-model="name" label="Zalijepi link nove slike" />
              <div style="display: flex; justify-content: center; align-items: center;">
                <q-btn class="" label="Spremi sliku" type="submit" color="primary" />
              </div>
            </q-form>
                  </q-item-section>


                <q-item clickable v-close-popup @click="obrisi_sliku(post.id_atrakcije)">
                  <q-item-section>
                    <q-item-label style="display: flex; justify-content: center; align-items: center;">OBRIŠI SLIKU</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>
          </div>
          <div class="absolute-bottom text-subtitle1 text-center">
            <div style="text-transform:uppercase; font-size:50px">{{ post.naziv }}</div>
          </div>
        </q-img>
      </div>


      <div class="q-pa-md">
        <div class="q-pa-md items-start q-gutter-xs" style="background-color: black; color: white;">
          <p style="font-size: 20px;">Opis:</p>
          <div class="post-text">{{ post.opis }}</div>
          <q-separator color="white" />
          <p style="font-size: 20px;">Adresa:</p>
          <h7>{{ post.adresa }}</h7>
          <q-separator color="white" />
          <p style="font-size: 20px;">Ocjena:</p>
          <q-rating @click="dodajOcjenu(post.id_atrakcije, post.prosjecna_ocjena)" v-model=post.prosjecna_ocjena :max="5"
            :readonly="true" size="32px" />

            <q-btn round color="black" icon="delete" style="right: -12px" @click="deleteOcjena(post.id_atrakcije)" />


          <div class="q-pa-md">
            <q-btn-dropdown color="primary" label="Promijeni ocjenu">
              <q-list>
                <q-item clickable v-close-popup @click="dodajOcjenu(1, post.id_atrakcije)">
                  <q-item-section>
                    <q-item-label>1</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item clickable v-close-popup @click="dodajOcjenu(2, post.id_atrakcije)">
                  <q-item-section>
                    <q-item-label>2</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item clickable v-close-popup @click="dodajOcjenu(3, post.id_atrakcije)">
                  <q-item-section>
                    <q-item-label>3</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item clickable v-close-popup @click="dodajOcjenu(4, post.id_atrakcije)">
                  <q-item-section>
                    <q-item-label>4</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item clickable v-close-popup @click="dodajOcjenu(5, post.id_atrakcije)">
                  <q-item-section>
                    <q-item-label>5</q-item-label>
                  </q-item-section>
                </q-item>

              </q-list>
            </q-btn-dropdown>

          </div>

          <q-separator color="white" />

          <div class="" style="max-width: 400px"></div>

          <p style="font-size: 20px;">Geografska dužina:</p>
          <p style="font-size: 15px;">{{ post.geografska_sirina }}</p>
          <q-separator color="white" />
          <p style="font-size: 20px;">Geografska širina:</p>
          <p style="font-size: 15px;">{{ post.geografska_duzina }}</p>
        </div>
      </div>
    </div>



    <q-card-section>
      <q-btn class="button" @click="$router.push('/')" label="Natrag na početnu" />
    </q-card-section>
    <q-card-section>
            <q-btn class="button"  :to="'/komentari/' + trenutniID" label="Dodaj komentar" />

        </q-card-section>

    <q-separator />

    <div class="q-pa-md row items-start q-gutter-xs">
      <p style="font-size: 25px; color: white">Komentari:</p>

    </div>
    <div class="q-pa-md row items-start q-gutter-xs">
    <p style="font-size: 20px; color: white">Ovdje možete pogledati komentare o atrakciji</p>
    </div>
    <!-- {{ comments }} -->
    <div class="q-pa-md row items-start q-gutter-md">
      <q-card v-for="item in comments" :key="item" class="my-card" flat bordered>
        <q-item>
          <q-item-section avatar>
            <q-avatar>
              <img src="https://cdn.quasar.dev/img/boy-avatar.png">
            </q-avatar>
          </q-item-section>
          <q-item-section>
            {{item.vk_id_korisnika}}
          </q-item-section>
        </q-item>
        <q-separator />
        <q-card-section horizontal>
          <q-card-section>
            {{item.Komentar}}
          </q-card-section>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>



<script setup>

import { ref, onMounted } from "vue"
import { api } from 'boot/axios'
import { useRoute, useRouter } from 'vue-router';

const posts = ref([])
const comments = ref([])
const route = useRoute()
const router = useRouter()

const trenutniID = route.params.id
const getPosts = async () => {
  try {
    const response = await api.get(`/atrakcije/${trenutniID}`)
    posts.value = response.data
    const komentari = await api.get(`/komentari/${trenutniID}`)
    comments.value = komentari.data.data
    console.log(komentari.data);
    console.log("ID je: ", trenutniID)
    console.log("Podatak iz baze po ID: ", posts.value)

  } catch (error) {
    console.log(error)
  }
}


//Dodavanje slike

const spremiSliku = async (link, id) => {
  console.log("OnSubmit: ", link, id)

  try {

    const response = await api.put(`http://localhost:4200/dodajSliku/${id}`, {
      slika: link
    });
    console.log(response.data);


  }
  catch (error) {
    console.log(error);
  }
  getPosts();



}

//Dodavanje ocjene za atrakciju

const dodajOcjenu = async (ocjena, id) => {
  try {
    console.log('Kliknuli ste na: ', ocjena, " ocjenu")
    console.log("ID: ", id)

    const response = await api.put(`http://localhost:4200/dodajOcjenu/${id}`, {
      prosjecna_ocjena: ocjena
    });
    console.log(response.data);


  }
  catch (error) {
    console.log(error);
  }
  getPosts();
}



const obrisi_sliku = async (id) => {
  try {
    //const response = await api.delete('atrakcije/${id}');
    const response = await api.delete(`http://localhost:4200/obrisi_sliku_atrakcije/${id}`);
    console.log("LOG1: ", response.data);
    // Perform any additional actions after successful deletion
  } catch (error) {
    console.log("LOG2: ", error);
  }
  getPosts();
}

const deleteOcjena = async (id) => {
  try {
    //const response = await api.delete('atrakcije/${id}');
    const response = await api.delete(`http://localhost:4200/obrisi_ocjenu_atrakcije/${id}`);
    console.log(response.data);
    // Perform any additional actions after successful deletion
  } catch (error) {
    console.log(error);
  }
  getPosts();
}


onMounted(() => {
  getPosts()
})


</script>




<style scoped></style>


<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 800px

</style>

<style>
.post-text {
  max-width: 620px;
  word-wrap: break-word;
}

.button{
  background-color: black;
  color:white;
}
.button:hover{
  background-color:white;
  color:black;
}

</style>
