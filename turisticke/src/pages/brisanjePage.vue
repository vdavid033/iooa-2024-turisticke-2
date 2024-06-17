<template>
  <div>
    <h1>Popis korisnika</h1>
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Korisničko ime</th>
          <th>Uloga</th>
          <th>Akcije</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id_korisnika">
          <td>{{ user.id_korisnika }}</td>
          <td>{{ user.korisnicko_ime }}</td>
          <td>{{ user.uloga }}</td>
          <td>
            <button @click="deleteUser(user.id_korisnika)">Obriši</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from 'axios';
import { ref } from 'vue';

export default {
  data() {
    return {
      users: ref([]),
    };
  },
  created() {
    this.fetchUsers();
  },
  methods: {
    fetchUsers() {
      axios.get('http://localhost:4200/users')
        .then(response => {
          console.log('Response data:', response.data);
          if (response.data.status === 'success') {
            this.users = response.data.data;
          } else {
            console.error('Error fetching users:', response.data.message);
          }
        })
        .catch(error => {
          console.error('HTTP error:', error);
        });
    },
    deleteUser(id) {
      axios.delete(`http://localhost:4200/users/${id}`)
        .then(response => {
          console.log('Response data:', response.data);
          if (response.data.status === 'success') {
            // Remove the deleted user from the local list
            this.users = this.users.filter(user => user.id_korisnika !== id);
            console.log(`Korisnik s ID ${id} je uspješno obrisan.`);
          } else {
            console.error('Error deleting user:', response.data.message);
          }
        })
        .catch(error => {
          console.error('HTTP error:', error);
        });
    },
  }
};
</script>

<style>
table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  border: 1px solid black;
  padding: 8px;
  text-align: left;
}

th {
  background-color:yellow;
}
</style>
