<script setup>
import { onBeforeMount, onBeforeUnmount } from 'vue';

import { getSortedNameText } from '@/utils';

let backButtonClickHandler

const props = defineProps({
    arrow: {
        type: String,
        required: false
    },
    buttons: {
        type: Array,
        required: true
    },
    cuurentValue: {
        type: String,
        required: false
    },
    sort: {
        type: String,
        required: true
    }
})

onBeforeMount(() => {
    backButtonClickHandler = () => {
        close();
    };
    backButton.onClick(backButtonClickHandler);
})

onBeforeUnmount(() => {
    backButton.offClick(backButtonClickHandler);
})


const emit = defineEmits(["close", "type"]);


const setSort = (type) => {
    emit("type", type)
}


const close = () => {
    emit('close');
};

</script>

<template>
    <div class="m-context-menu-container" @click="close">
        <button 
            v-for="b in buttons"
            :key="b"
            :class="['m-context-menu-btn', {active: cuurentValue == b,
                 'custom-width': cuurentValue == 'created_date'
                 || cuurentValue == 'costs'
                 || cuurentValue == 'item_count'
                 || cuurentValue == 'unique_item_count'
                 }]"
            @click="setSort(b)">
            {{ getSortedNameText(b) }}
            <span v-if="cuurentValue === b && sort != 'orders'" >{{ arrow }}</span> 
        </button>
    </div>
</template>



<style scoped>

.m-context-menu-container {
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



.m-context-menu-btn{
    background-color: white;
    color: black;
    font-size: 24px;
    height: 40px;
    width: 40%;
    width: 350px;
    border: none;
    margin: 4px;
    border: 2px solid rgba(0, 0, 0, 1);
    border-radius: 4px;
}


.custom-width {
    width: 350px;
}

.active{
    border: 2px solid #013b45;
    color: #013b45;
    background-color: #c4dfe6;
}

</style>