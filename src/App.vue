<script setup>
import { onBeforeMount, ref } from 'vue';
import store from './store';

const tg = window.Telegram.WebApp
const isBlocked = ref()

onBeforeMount(async() => {
  isBlocked.value = await store.dispatch("GET_AND_SET_DATA")
})


</script>

<template>
  <router-view v-if="!isBlocked"></router-view>
</template>

<style scoped>
</style>
