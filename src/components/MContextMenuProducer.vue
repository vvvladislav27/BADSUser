<script setup>
import { ref, onBeforeMount } from 'vue';
import { getProducers } from '@/api/producers';


const items = ref([]);

const emit = defineEmits(["producer"])


const props = defineProps({
    producer: {
        type: String,
        required: false
    }
})


onBeforeMount(async() => {
    items.value = await getProducers();
    items.value.unshift({"id": 0, "name": "Все"});
})


const updateUserDeliveryData = async (producer) => {
    emit("producer", producer)
};


</script>

<template>
    <div class="m-producers-container">
        <div
            v-for="item in items"
            :key="item"
            class="m-producers-data-wrapper">
            <button
                @click="updateUserDeliveryData(item)"
                :class="['m-producers-data-item', { active: item.name === producer }]">
                <p>{{ item.name }}</p>
            </button>
        </div>
    </div>
</template>



<style scoped>

.m-producers-container{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 1);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}


.m-producers-data-wrapper{
    display: flex;
    align-items: center;
    width: 100%;
    justify-content: center;
}


.m-producers-data-item{
    background-color: white;
    color: black;
    font-size: 24px;
    width: 70%;
    border: none;
    margin: 4px;
    border: 2px solid rgba(0, 0, 0, 1);
    border-radius: 4px;
    cursor: pointer;
}

.active{
    border: 2px solid #013b45;
    color: #013b45;
    background-color: #c4dfe6;
}


</style>