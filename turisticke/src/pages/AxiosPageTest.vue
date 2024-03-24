<template>
  <div class="q-pa-md">
    <h5>AXIOS</h5>
  </div>

  <div class="q-pa-md">
    <q-table
      title="Podaci iz tablice ATRAKCIJE"
      :rows="posts"
      :columns="columns"
      row-key="name"
    />
  </div>


  <div class="q-pa-md">
    <q-table
      flat bordered
      title="Podaci iz tablice ATRAKCIJE + edit"
      :rows="posts"
      :columns="columns"
      row-key="name"
      binary-state-sort
    >
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="id_atrakcije" :props="props">{{ props.row.id_atrakcije }}</q-td>
          <q-td key="naziv" :props="naziv">
            {{ props.row.naziv }}
            <q-popup-edit v-model="props.row.naziv" title="Update naziva" buttons v-slot="scope">
              <q-input type="text" v-model="scope.value" dense autofocus />
            </q-popup-edit>
          </q-td>
          <q-td key="opis" :props="naziv">
            {{ props.row.opis }}
            <q-popup-edit v-model="props.row.opis" title="Update opisa" buttons v-slot="scope">
              <q-input type="text" v-model="scope.value" dense autofocus />
            </q-popup-edit>
          </q-td>
          <q-td key="slika" :props="props">{{ props.row.slika }}</q-td>
          <q-td key="prosjecna_ocjena" :props="props">{{ props.row.prosjecna_ocjena }}</q-td>
          <q-td key="geografska_sirina" :props="props">
            {{ props.row.geografska_sirina }}
            <q-popup-edit v-model="props.row.geografska_sirina" title="Update GEO širine" buttons persistent v-slot="scope">
              <q-input type="number" v-model="scope.value" dense autofocus hint="Use buttons to close" />
            </q-popup-edit>
          </q-td>
          <q-td key="geografska_duzina" :props="props">
            {{ props.row.geografska_duzina }}
            <q-popup-edit v-model="props.row.geografska_duzina" title="Update GEO dužine" buttons persistent v-slot="scope">
              <q-input type="number" v-model="scope.value" dense autofocus hint="Use buttons to close" />
            </q-popup-edit>
          </q-td>
          <q-td key="adresa" :props="props">{{ props.row.adresa }}</q-td>
        </q-tr>
      </template>
    </q-table>
  </div>


  <div class="q-pa-md q-gutter-sm">
    <q-btn color="primary" to="/" label="Natrag na početnu" />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import {api} from 'boot/axios';

const posts = ref([])

const columns = [
  { name: 'id_atrakcije', align: 'left', label: 'ID', field: 'id_atrakcije', sortable: true },
  { name: 'naziv', align: 'left', label: 'Naziv', field: 'naziv', sortable: true },
  { name: 'opis', align: 'left', label: 'Opis', field: 'opis', sortable: false },
  { name: 'slika', align: 'left', label: 'Slika', field: 'slika', sortable: false },
  { name: 'prosjecna_ocjena', align: 'left', label: 'Prosječna ocjena', field: 'prosjecna_ocjena', sortable: true },
  { name: 'geografska_sirina', align: 'left', label: 'GEO širina', field: 'geografska_sirina', sortable: true },
  { name: 'geografska_duzina', align: 'left', label: 'Geo dužina', field: 'geografska_duzina', sortable: true },
  { name: 'adresa', align: 'left', label: 'Adresa', field: 'adresa', sortable: false }
]


const getPosts = async () => {
  try{
    const response = await api.get('atrakcije')
    console.log(response.data)
    posts.value = response.data

  }catch (error){
    console.log(error)
  }

}

onMounted(() => {
  getPosts()
})

</script>
