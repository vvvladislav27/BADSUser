<script setup>
import { onBeforeMount, ref } from 'vue';
import store from './store';

const isBlocked = ref()

onBeforeMount(async() => {
  isBlocked.value = await store.dispatch("CHEK_USER_STATUS")
})

</script>

<template>
  <router-view v-if="!isBlocked"></router-view>
</template>

<style scoped>
</style>
