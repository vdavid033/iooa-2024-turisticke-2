<template>
  <q-tabs v-model="tab" class="bg-primary text-white">
    <q-tab name="Prijava" label="Prijava" @click.prevent="switchTab(false)" />
    <q-tab name="Registracija" label="Registracija" @click.prevent="switchTab(true)" />
  </q-tabs>

  <q-card class="my-card">
    <q-card-section>
      <form @submit.prevent="onSubmit">
        <div class="q-gutter-md full-with" style="max-width: 500px">
          <div class="loginText" style="text-align: center">{{ tab }}</div>

          <q-input v-model="credentials.email" class="input" outlined label="Email" />
          <div> </div>
          <q-input v-model="credentials.password" class="input" outlined type="password" label="Password" />

          <div class="row justify-between">
            <q-btn class="bg-primary text-white" @click.prevent="cancel">Odustani</q-btn>
            <q-btn class="bg-primary text-white" type="submit">{{ tab }}</q-btn>
          </div>
        </div>
      </form>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

const router = useRouter();

const register = ref(false);
const tab = ref("");

const switchTab = (value) => {
  register.value = value;
  tab.value = value ? "Registracija" : "Prijava";
};

const credentials = reactive({
  email: "",
  password: "",
});

const onSubmit = async () => {
  console.log("forma potvrđena");

  if (!credentials.email || !credentials.password) {
    alert("Unesite email i lozinku");
  } else {
    try {
      if (register.value) {
        const response = await axios.post('http://localhost:4200/register', {
          email: credentials.email,
          password: credentials.password
        });
        console.log(response.data.msg);
      } else {
        const response = await axios.post('http://localhost:4200/login', {
          email: credentials.email,
          password: credentials.password
        });
        console.log(response.data.msg);
      }
    } catch (error) {
      console.error(error);
      alert("Došlo je do greške prilikom komunikacije sa serverom.");
    }
  }
};

const cancel = () => {
  router.push("/");
};
</script>

<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 400px
  margin: 0 auto
  margin-top: 40px
  font-size: 36px
  width: 100%
</style>
