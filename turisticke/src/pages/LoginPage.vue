<template>
  <div class="registration-form">
    <h2 class="form-title">Registracija</h2> <!-- Dodajemo naslov forme -->
    <input type="text" v-model="email" placeholder="Korisničko ime" class="input-field">
    <input type="password" v-model="password" placeholder="Password" class="input-field">
    <button @click="register" class="submit-btn">Registracija</button>
    <br>
    <router-link to="/" class="link-btn">Odustani</router-link>
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
    register() {
      axios.post('http://localhost:4200/register', {
        email: this.email,
        password: this.password
      })
        .then(response => {
          alert(response.data.message);
          // Preusmjeravanje na /sve nakon uspješne registracije
          this.$router.push('/');
        })
        .catch(error => {
          console.error(error);
        });
    }
  }
}
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
  width: calc(100% - 20px); /* širina je 100% minus padding */
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
  width: calc(100% - 20px); /* širina je 100% minus padding */
  text-align: center;
}

.submit-btn:hover, .link-btn:hover {
  background-color: #0056b3;
}
</style>
