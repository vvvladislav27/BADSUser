<script setup>
import { onBeforeMount, ref } from 'vue';
import store from './store';

const isBlocked = ref()

onBeforeMount(async() => {
  isBlocked.value = await store.dispatch("INIT_APP_DATA")
})

</script>

<template>
  <router-view v-if="!isBlocked"></router-view>
</template>

<style scoped>
</style>
