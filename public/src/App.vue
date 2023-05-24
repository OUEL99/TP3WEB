<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { ref } from 'vue'


</script>

<template>
  
  <div class="app-container">¨
    <header>
      <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <RouterLink class="navbar-brand" to="/">Procrastination-zéro</RouterLink>
        <ul class="navbar-nav">
          <li class="nav-item">
            <RouterLink to="/" class="nav-link">Tableaux</RouterLink>
          </li>
        </ul>

        <ul class="navbar-nav ml-auto">
          <li class="nav-item" v-if="!isConnected">
            <RouterLink to="/inscription" class="nav-link">S'inscrire</RouterLink>
          </li>
          <li class="nav-item" v-if="!isConnected">
            <RouterLink to="/connexion" class="nav-link">Se connecter</RouterLink>
          </li>
          <li class="nav-item" v-if="isConnected">
            <button @click="disconnect" class="nav-link">Se déconnecter</button>
          </li>
        </ul>
      </nav>
    </header>
  </div>
  <div class="content">
    <RouterView />
  </div>
</template>

<script>
  const isConnected = ref(localStorage.getItem('token') !== null)
  export default{
    computed:{
      isConnected(){
        return isConnected.value
      }
    },
    methods:{
      // Déconnecte l'utilisateur
      disconnect(){
        localStorage.removeItem('token')
        localStorage.removeItem('userId')
        isConnected.value = false
        this.$router.push('/connexion')
      }
    },
    beforeMount(){
      isConnected.value = localStorage.getItem('token') !== null
    }
  }
</script>
<style>
@import '..\node_modules\bootstrap\dist\css\bootstrap.min.css';



</style>

