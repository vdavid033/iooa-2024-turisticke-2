<template>
  <div style="background-color: #229df9">
    <div class="q-pa-md row items-start q-gutter-md">
      <q-card v-for="post in posts" :key="post.id" class="my-card">
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
          <div>
            <div>
              <div v-for="pic in pics" :key="pic.id_atrakcije_s">
                <q-img v-if="pic.id_atrakcije_s === post.id_atrakcije" :src="pic.slika_s" />
              </div>
            </div>
            <input type="file" @change="onFileChange" />

            <q-btn @click="convertImage">Spremi sliku</q-btn>
            <q-separator></q-separator>
            <div v-if="base64Image">
              <img :src="base64Image" />
              <q-separator></q-separator>

              <div
                class="q-pa-sm"
                style="max-width: 700px; overflow-wrap: break-word"
              ></div>
            </div>
          </div>
          <div class="row justify-center q-pa-md">
            <div class="row justify-center q-pa-md">
              <q-btn
                label="Unesi"
                @click="submitForm(post.id_atrakcije)"
                color="blue"
                class="q-ml-sm"
              />
            </div>
          </div>
          <q-dialog v-model="showDialog">
            <q-card>
              <q-card-section> Slika je uspješno dodana! </q-card-section>
              <q-card-actions align="right">
                <q-btn
                  flat
                  label="Ok"
                  color="primary"
                  v-close-popup
                  @click="closeAndReload"
                />
              </q-card-actions>
            </q-card>
          </q-dialog>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>
<script>
// eslint-disable-next-line no-unused-vars
import { QDialog } from "quasar";
import { isProxy, toRaw } from 'vue';
import imageCompression from "browser-image-compression";
// eslint-disable-next-line no-unused-vars
import axios from "axios"; // Import axios
export default {
  data() {
    return {
      inputIdAtrakcije: "",
      inputSlika: null,
      slike: [],
    };
  },
  methods: {
    async onFileChange(e) {
      this.file = e.target.files[0];
      await this.convertImage();
    },
    async convertImage() {
      if (!this.file && !this.imageUrl) {
        return alert("Molimo odaberite sliku ili unesite URL slike.");
      }

      const options = {
        maxSizeMB: 1, // Maximum file size in MB
        maxWidthOrHeight: 1920, // Maximum width or height, whichever is smaller
        useWebWorker: true,
      };

      try {
        let compressedFile;

        if (this.imageUrl) {
          const response = await fetch(this.imageUrl);
          const blob = await response.blob();
          compressedFile = await imageCompression(blob, options);
        } else {
          compressedFile = await imageCompression(this.file, options);
        }

        const reader = new FileReader();
        reader.readAsDataURL(compressedFile);
        reader.onload = () => {
          this.base64Image = reader.result;
          this.base64Text = reader.result.replace(
            /^data:image\/[a-z]+;base64,/,
            ""
          );
          this.inputSlika = "data:image/jpg;base64," + this.base64Text;
        };
        reader.onerror = (error) => {
          console.error(error);
        };
        b;
      } catch (error) {
        console.error(error);
        return alert("Došlo je do pogreške prilikom kompresije slike.");
      }
    },
    closeAndReload() {
      this.showDialog = false;
      window.location.reload();
    },

    onFileSelected(event) {
      this.inputSlika = event.target.files[0];
    },
    onUpload() {
      axios.post;
    },
    resetForm() {
      (this.inputIdAtrakcije = ""), (this.inputSlika = "");
      this.$refs.slikaRef.resetValidation();
      this.$refs.IdAtrakcijeRef.resetValidation();
    },
    async submitForm(num) {
      const sampleData = {
        id_atrakcije_s: num,
        slika_s: this.inputSlika,
      };
      try {
        const response = await axios.post(
          "http://localhost:4200/dodavanje_slike",
          sampleData
        );
        console.log(response.data);
        this.showDialog = true;
        this.resetForm();
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>
<script setup>
import { ref, onMounted } from "vue";
import { api } from "boot/axios";

const posts = ref([]);
const pics = ref([]);

const getPosts = async () => {
  try {
    const response = await api.get("atrakcije");
    const response2 = await api.get("slike");
    console.log(response.data);
    console.log(response2.data);
    posts.value = response.data;
    pics.value = response2.data;
  } catch (error) {
    console.log(error);
  }
};

const deleteById = async (id) => {
  try {
    //const response = await api.delete('atrakcije/${id}');
    const response = await api.delete(
      `http://localhost:4200/obrisi_atrakcije/${id}`
    );
    console.log(response.data);
    // Perform any additional actions after successful deletion
  } catch (error) {
    console.log(error);
  }
  getPosts();
};

onMounted(() => {
  getPosts();
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
  background-color: #1e90ff;
  color: white;
}

.my-card {
  width: 100%;
  max-width: 300px;
}
</style>
