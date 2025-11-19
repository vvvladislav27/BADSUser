<script setup>
import { ref } from 'vue';

const legalPassport = ref("");

const emit = defineEmits(["legalPassport"])

const updateLegalPasport = () => {
    emit("legalPassport", legalPassport.value)
}

</script>

<template>
    <div class="m-insert-legal-passport-conteiner">
        <div class="m-insert-legal-passport-text">
            Укажите юридический адрес
        </div>
        <input 
            type="text" 
            class="m-insert-legal-passport-input"
            required
            v-model="legalPassport"
            @input="updateLegalPasport"
            >
        </input>

    </div>
</template>

<style scoped>

.m-insert-legal-passport-conteiner {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 1);
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    z-index: 2000;
    color: white;
}

.m-insert-legal-passport-text {
    color: white;
    font-size: 14px;
    margin-bottom: 10px;
    font-weight: 700;
}


.m-insert-legal-passport-input{
    border: none;
    outline: none;
    height: 20px;
    text-align: right;
    padding: 0px 4px;
    border-radius: 0px;
}

</style>

