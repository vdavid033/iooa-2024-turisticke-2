<template>
  <!-- <q-header elevated class="bg-deep-purple text-white"> -->

  <q-tabs v-model="tab" class="bg-primary text-white ">
    <q-tab name="Prijava" label="Prijava" @click.prevent="register = false" />
    <q-tab name="Registracija" label="Registracija" @click.prevent="register = true" />
  </q-tabs>
  <!-- </q-header> -->

  <q-card class="my-card">
    <q-card-section>
      <form @submit.prevent="onSubmit">
        <div class="q-gutter-md full-with" style="max-width: 500px">
          <div class="loginText" style="text-align: center">{{ tab }}</div>

          <q-input v-model="credentials.email" class="input" outlined label="Email" />
          <div> </div>
          <q-input v-model="credentials.password" class="input" outlined type="password" label="Password" />


          <div class="row justify-between">
            <q-btn class="bg-primary text-white" to="/">Odustani</q-btn>
            <q-btn class="bg-primary text-white" type="submit">{{ tab }}</q-btn>
          </div>
        </div>

      </form>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref, reactive } from "vue"
//import { useStoreAuth } from "src/stores/storeAuth"


/*
store
*/
//const storeAuth = useStoreAuth()


const register = ref(false)
const tab = ref('')



if (!register.value) {
  tab.value = "Prijava"
}
else {
  tab.value = "Registracija"
}

/*
credentials
*/

const credentials = reactive({
  email: '',
  password: ''
})

/*
  submit
*/

const onSubmit = () => {
  console.log("forma potvrđana")

  if (!credentials.email || !credentials.password) {
    alert('Unesite email i lozinku')
  }
  else {
    if (register.value) {
      console.log('Registriraj korisnika sa:', credentials)
    }
    else {
      console.log('Prijavi korisnika sa:', credentials)
    }
  }


}

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

<!-- .loginText
text-align: center
font-size: 36px

.input,  -->


