<template>
  <div class="registration-form">
    <h2 class="form-title">Registracija</h2>
    <input type="text" v-model="korisnicko_ime" placeholder="Korisničko ime (mora sadržavati @)" class="input-field">
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
      if (!this.korisnicko_ime.includes('@')) {
        alert('Korisničko ime mora sadržavati @.');
        return;
      }

      if (this.lozinka.length < 6) {
        alert('Lozinka mora biti minimalno 6 znakova.');
        return;
      }

      axios.post('http://localhost:4200/register', {
        korisnicko_ime: this.korisnicko_ime,
        lozinka: this.lozinka
      })
      .then(response => {
        alert(response.data.message);
        this.$router.push('/');
      })
      .catch(error => {
        alert(error.response.data.message);
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
  width: 100%;
  height: 100vh;
  background-color: #ffffff;
}

.form-title {
  margin-bottom: 20px;
}

.input-field {
  width: 90%;
  max-width: 400px;
  margin: 10px 0;
  padding: 15px;
  border: 1px solid #ccc;
  border-radius: 15px;
}

.submit-btn, .link-btn {
  width: 90%;
  max-width: 400px;
  padding: 15px;
  margin-top: 10px;
  background-color: yellow;
  color: black;
  border: none;
  border-radius: 15px;
  cursor: pointer;
  text-align: center;
  text-decoration: none;
}

.submit-btn:hover, .link-btn:hover {
  background-color: #f0e68c;
}

.link-btn {
  display: block;
}
</style>
