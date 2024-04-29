<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <img alt="Pokemon logo" class="logo" src="@/assets/img/International_Pokémon_logo.svg.png" width="auto" height="auto" />

    <!-- <div class="wrapper">
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </div> -->
  </header>
  <v-app class="w-100">
    <v-main class="w-100">
      <v-container fluid class="w-100">
        <RouterView />
      </v-container>
    </v-main>
  </v-app>
</template>

<style lang="scss">
@import "./assets/scss/style.scss";
</style>
