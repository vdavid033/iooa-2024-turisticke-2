<template>
  <div class="registration-form">
      <h2 class="form-title">Prijava</h2> <!-- Dodajemo naslov forme -->
    <input type="text" v-model="email" placeholder="Korisničko ime" class="input-field">
    <input type="password" v-model="password" placeholder="password" class="input-field">
    <button @click="login" class="submit-btn">Prijava</button>
    <router-link to="/registracijaputanja" class="link-btn">Registracija</router-link>
    <router-link to="/sve" class="link-btn">Odustani</router-link>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      email: '',
      password: ''
    };
  },
  methods: {
    async login() {
      try {
        const response = await axios.post("http://localhost:4200/prijavi", {
          username: this.email, // Obratite pažnju na ova polja
          password: this.password,
        });

        if (response.data.success) {
          localStorage.setItem("token", response.data.token);
          this.$router.push('/sve');
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
  height: 100vh;
  background-color: #ffffff;
}

.input-field {
  margin: 10px 0;
  padding: 10px;
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.submit-btn, .link-btn {
  padding: 10px 20px;
  margin-top: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  text-decoration: none;
  display: block;
  width: 100%;
  text-align: center;
}

.submit-btn:hover, .link-btn:hover {
  background-color: red;
}

.link-btn {
  background-color: transparent;
  color: #007bff;
  text-decoration: underline;
}
</style>
