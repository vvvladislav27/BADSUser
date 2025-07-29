<script setup>
import { onBeforeMount } from 'vue';
import store from './store';

onBeforeMount(async() => {
  await store.dispatch("INIT_APP_DATA")
})

</script>

<template>
  <router-view></router-view>
</template>

<style scoped>
</style>
