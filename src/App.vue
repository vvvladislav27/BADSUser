<script setup>
import { onBeforeMount, ref } from 'vue';
import store from './store';

const tg = window.Telegram.WebApp
const isBlocked = ref()

onBeforeMount(async() => {
  isBlocked.value = await store.dispatch("GET_AND_SET_DATA")
  tg.onEvent("deactivated", eventHandler)
})

const eventHandler = () => {
  store.dispatch("RESET_VIDEO_LOADED")
}

</script>

<template>
  <router-view v-if="!isBlocked"></router-view>
</template>

<style scoped>
</style>
