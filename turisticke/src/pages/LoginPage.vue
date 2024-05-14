<template>
  <div class="registration-form">
    <h2 class="form-title">Registracija</h2>
    <input type="text" v-model="korisnicko_ime" placeholder="Korisničko ime" class="input-field">
    <input type="password" v-model="lozinka" placeholder="Lozinka" class="input-field">
    <button @click="register" class="submit-btn">Registriraj se</button>
    <router-link to="/" class="link-btn">Odustani</router-link>
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
    register() {
      axios.post('http://localhost:4200/register', {
        korisnicko_ime: this.korisnicko_ime,
        lozinka: this.lozinka
      })
      .then(response => {
        alert(response.data.message);
        this.$router.push('/');
      })
      .catch(error => {
        console.error('Registration failed:', error);
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
  width: 100%; /* Ensures form takes the full width */
  height: 100vh; /* Viewport height for centering on screen */
  background-color: #ffffff;
}

.form-title {
  margin-bottom: 20px;
}

.input-field {
  width: 90%; /* Wider for better mobile experience */
  max-width: 400px; /* Max width for larger screens */
  margin: 10px 0;
  padding: 15px;
  border: 1px solid #ccc;
  border-radius: 15px; /* Rounded corners for inputs */
}

.submit-btn, .link-btn {
  width: 90%;
  max-width: 400px;
  padding: 15px;
  margin-top: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 15px; /* Rounded corners for buttons */
  cursor: pointer;
  text-align: center;
  text-decoration: none; /* Removes underline for router-link */
}

.submit-btn:hover, .link-btn:hover {
  background-color: #0056b3;
}

.link-btn {
  display: block; /* Ensures the button is block level to fill width */
}
</style>
