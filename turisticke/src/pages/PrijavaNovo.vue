<template>
  <div class="registration-form">
    <h2 class="form-title">Prijava</h2>
    <input type="text" v-model="korisnicko_ime" placeholder="Korisničko ime" class="input-field">
    <input type="password" v-model="lozinka" placeholder="Lozinka" class="input-field">
    <button @click="login" class="submit-btn">Prijava</button>
    <div class="links">
      <router-link to="/registracijaputanja" class="link-btn">Registracija</router-link>
      <router-link to="/" class="link-btn">Odustani</router-link>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      korisnicko_ime: '',
      lozinka: ''
    };
  },
  methods: {
    async login() {
      try {
        const response = await axios.post("http://localhost:4200/prijavi", {
          korisnicko_ime: this.korisnicko_ime,
          lozinka: this.lozinka,
        });

        if (response.data.success) {
          localStorage.setItem("token", response.data.token);
          this.$router.push('/');
        } else {
          this.$q.notify({
            color: "negative",
            position: "top",
            message: response.data.message,
            icon: "warning",
          });
        }
      } catch (error) {
        console.error("Login failed:", error);
        this.$q.notify({
          color: "negative",
          position: "top",
          message: "Prijava nije uspjela. Provjerite podatke i pokušajte ponovno.",
          icon: "warning",
        });
      }
    },
  },
};
</script>

<style scoped>
.registration-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;  /* Osigurava da obrazac zauzima cijelu širinu */
  height: 100vh; /* Visina viewporta za centriranje na ekranu */
  background-color: #ffffff;
}

.form-title {
  margin-bottom: 20px;
}

.input-field {
  width: 90%; /* Veća širina za bolje iskustvo na mobilnim uređajima */
  max-width: 400px; /* Maksimalna širina za veće ekrane */
  margin: 10px 0;
  padding: 15px;
  border: 1px solid #ccc;
  border-radius: 15px; /* Zaobljeni rubovi za input polja */
}

.submit-btn, .link-btn {
  width: 90%;
  max-width: 400px;
  padding: 15px;
  margin-top: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 15px; /* Zaobljeni rubovi za gumbove */
  cursor: pointer;
  text-align: center;
  text-decoration: none; /* Uklanja podcrtavanje za router-link */
}

.submit-btn:hover, .link-btn:hover {
  background-color: #0056b3;
}

.links {
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center; /* Centriranje linkova */
}
</style>