<template>
  <div>
    <h2>Comments</h2>
    <div v-if="loading">Loading...</div>
    <ul v-else>
      <li v-for="comment in comments" :key="comment.id">{{ comment.text }}</li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'CommentsSection',
  props: {
    attractionId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      comments: [],
      loading: true
    };
  },
  created() {
    this.fetchComments();
  },
  methods: {
    fetchComments() {
      axios.get(`/prikazikomentari/${this.attractionId}`)
        .then(response => {
          this.comments = response.data.data;
          this.loading = false;
        })
        .catch(error => {
          console.error("There was an error fetching the comments!", error);
          this.loading = false;
        });
    }
  }
};
</script>

<style scoped>
/* Dodajte stilove po potrebi */
</style>
