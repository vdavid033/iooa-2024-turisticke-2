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
            <button @click="confirmDeleteUser(user.id_korisnika)">Obriši</button>
          </td>
        </tr>
      </tbody>
    </table>
    <div v-if="notification" class="notification">{{ notification }}</div>
  </div>
</template>

<script>
import axios from 'axios';
import { ref, onMounted } from 'vue';

export default {
  setup() {
    const users = ref([]);
    const notification = ref('');

    const fetchUsers = () => {
      axios.get('http://localhost:4200/users')
        .then(response => {
          if (response.data.status === 'success') {
            users.value = response.data.data;
          } else {
            console.error('Error fetching users:', response.data.message);
          }
        })
        .catch(error => {
          console.error('HTTP error:', error);
        });
    };

    const deleteUser = (id) => {
      axios.delete(`http://localhost:4200/users/${id}`)
        .then(response => {
          if (response.data.status === 'success') {
            fetchUsers();
            notification.value = `Korisnik s ID ${id} je uspješno obrisan.`;
            setTimeout(() => {
              notification.value = '';
            }, 3000);
          } else {
            console.error('Error deleting user:', response.data.message);
          }
        })
        .catch(error => {
          console.error('HTTP error:', error);
        });
    };

    const confirmDeleteUser = (id) => {
      if (window.confirm('Želite li izbrisati korisnika?')) {
        deleteUser(id);
      }
    };

    onMounted(fetchUsers);

    return {
      users,
      confirmDeleteUser,
      notification
    };
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
  background-color: yellow;
}

.notification {
  margin-top: 20px;
  padding: 10px;
  background-color: lightgreen;
  border: 1px solid green;
  border-radius: 5px;
}
</style>
