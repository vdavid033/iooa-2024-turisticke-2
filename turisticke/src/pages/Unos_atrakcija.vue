<template>
  <div class="bg-yellow">
    <q-page padding class="flex flex-center">
      <q-card style="width: 350px">
        <q-card-section>
          <div class="q-gutter-md full-with" style="max-width: 500px">
            <div class="full-with">
              <div class="q-gutter-md" style="max-width: 350px">
                <p class="text-h5 text-weight-light text-center" style="color: #2196f3">
                  Unos nove atrakcije
                </p>

                <!-- Naziv -->
                <q-input
                  ref="nazivRef"
                  v-model="inputNaziv"
                  label="Naziv"
                  placeholder="Naziv atrakcije"
                  :rules="[val => val && val.length >= 2 || 'Naziv mora imati najmanje 2 slova']"
                ></q-input>

                <!-- Opis -->
                <q-input
                  ref="opisRef"
                  v-model="inputOpis"
                  label="Opis"
                  placeholder="Opis atrakcije"
                  :rules="[val => val && val.length > 10 || 'Opis mora imati više od 10 znakova']"
                ></q-input>

                <!-- Adresa -->
                <q-input
                  ref="adresaRef"
                  v-model="inputAdresa"
                  label="Adresa"
                  placeholder="Adresa atrakcije"
                ></q-input>

                <!-- Upload slike -->
                <div>
                  <label for="file-upload" class="custom-file-upload">
                    Odaberi datoteku
                  </label>
                  <input id="file-upload" type="file" @change="onFileChange" style="display: none;" />
                  <q-btn @click="convertImage">Spremi sliku</q-btn>
                  <q-separator></q-separator>
                  <div v-if="previewImage">
                    <img :src="previewImage" style="max-width: 200px; height: auto;" />
                    <q-separator></q-separator>
                  </div>
                </div>

              </div>
            </div>
          </div>

          <!-- Dugme za slanje forme -->
          <div class="row justify-center q-pa-md">
            <q-btn label="Unesi" @click="submitForm" color="blue" class="q-ml-sm" />
          </div>

          <!-- Dijalog za uspješno dodavanje atrakcije -->
          <q-dialog v-model="showDialog">
            <q-card>
              <q-card-section> Atrakcija je uspješno dodana! </q-card-section>
              <q-card-actions align="right">
                <q-btn flat label="U redu" color="primary" v-close-popup @click="closeAndReload" />
              </q-card-actions>
            </q-card>
          </q-dialog>

        </q-card-section>
      </q-card>
    </q-page>
  </div>
</template>

<script>
import imageCompression from "browser-image-compression";
import { jwtDecode } from 'jwt-decode';
import axios from "axios";

export default {
  data() {
    return {
      inputNaziv: "",
      inputOpis: "",
      inputAdresa: "",
      file: null,
      base64Image: "",
      previewImage: "",
      showDialog: false
    };
  },
  methods: {
    async onFileChange(e) {
      this.file = e.target.files[0];
    },
    async convertImage() {
      if (!this.file) {
        return alert("Molimo odaberite sliku.");
      }

      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      };

      try {
        const compressedFile = await imageCompression(this.file, options);

        const reader = new FileReader();
        reader.readAsDataURL(compressedFile);
        reader.onload = () => {
          this.base64Image = reader.result;
          this.previewImage = reader.result;

          // Optionally, create a smaller preview image (e.g., 200px width)
          const img = new Image();
          img.src = reader.result;
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = 200;
            canvas.height = (200 / img.width) * img.height;
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            this.previewImage = canvas.toDataURL('image/jpeg');
          };
        };
        reader.onerror = (error) => {
          console.error(error);
        };
      } catch (error) {
        console.error(error);
      }
    },
    async submitForm() {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token nije pronađen. Molimo prijavite se.");
        return;
      }

      let userId;
      try {
        const decoded = jwtDecode(token);
        userId = decoded.id;
      } catch (error) {
        console.error('Greška pri dekodiranju tokena:', error);
        return;
      }

      const sampleData = {
        naziv: this.inputNaziv,
        opis: this.inputOpis,
        slika: this.base64Image,
        adresa: this.inputAdresa,
        id_korisnika: userId
      };

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      try {
        const response = await axios.post(
          "http://localhost:4200/unosAtrakcija",
          sampleData,
          config
        );
        console.log(response.data);
        this.showDialog = true;
        this.resetForm();
      } catch (error) {
        console.error(error);
      }
    },
    resetForm() {
      this.inputNaziv = "";
      this.inputOpis = "";
      this.inputAdresa = "";
      this.file = null;
      this.base64Image = "";
      this.previewImage = "";
    },
    closeAndReload() {
      this.showDialog = false;
      window.location.reload();
    }
  }
};
</script>

<style>
.bg-yellow {
  background-color: yellow;
}
.custom-file-upload {
  display: inline-block;
  padding: 6px 12px;
  cursor: pointer;
  color: #fff;
  background-color: #2196f3;
  border-radius: 4px;
}
.custom-file-upload:hover {
  background-color: #1976d2;
}
</style>
