<script setup>
import { ref, watch } from 'vue'
import { vibrate } from '@/utils'
import { secondaryButton, mainButton } from '@/tg';

const buttons = [1, 2, 3, 4, 5]
const isActive = ref(false);
const emit = defineEmits(["data"])


const props = defineProps({
    currentOrder: {
        type: Object,
        required: false
    },
    currentFoodItem: {
        type: Object,
        required: false
    }
})


watch(() => props.currentFoodItem, (newVal) => {
    if (newVal) {
        mark.value = null
        text.value = null
    }
});


const setFilterRating = (value_) => {
    if (mark.value == value_) {
        mark.value = null
    } else {
        vibrate()
        mark.value = value_
    }
    emitData()
}

const updateText = () => {
    emitData();
}



const mark = ref();
const text = ref();


const addActiveStyle = () => {
    isActive.value = true;
    secondaryButton.hide();
    mainButton.hide();
};

const removeActiveStyle = () => {
    isActive.value = false;
    secondaryButton.show();
    mainButton.show();
};


const emitData = () => {
    const data = {
        "mark": mark.value,
        "text": text.value
    }
    emit("data", data)
}


</script>

<template>
    <div class="m-review-context-menu-container">
        <div class="m-review-context-menu-header">
            Оставьте отзыв о {{ currentFoodItem.name }}
        </div>
        <div class="m-food-sup-card-filter-raiting-buttons-container">
            <div class="rating-text">Оценка</div>
            <div class="m-food-sup-card-filter-raiting-buttons">
                <button 
                    class="m-food-sup-card-filter-raiting-buttons-item"
                    :class="{active: mark == button}"
                    @click="setFilterRating(button)"
                    v-for="button in buttons" 
                    :key="button">
                        {{ button }}
                </button>
            </div>
            <div class="rating-text">Комментарий</div>
            <textarea class="rating-text-description" :class="{ 'active': isActive }" :rows="2" @focus="addActiveStyle($event)" @blur="removeActiveStyle($event)" v-model="text" maxlength="250" @input="updateText"></textarea>
        </div>
    </div>
</template>



<style scoped>


.m-review-context-menu-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 1);
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 2000;
  color: white;
}

.m-review-context-menu-header {
    width: 90%;
    margin-top: 90px;
    font-size: 20px;
    text-align: center;
}

.m-food-sup-card-filter-raiting-buttons-container {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    justify-content: center;
}

.rating-text {
    margin-top: 30px;
    font-size: 14px;
    font-weight: 700;
}

.m-food-sup-card-filter-raiting-buttons {
    display: flex;
    justify-content: center;
    margin: 10px 0px;
}

.m-food-sup-card-filter-raiting-buttons-item {
    background-color: white;
    border: none;
    height: 48px;
    width: 48px;
    font-size: 18px;
    cursor: pointer;
    border: 1px solid black;
    border-radius: 4px;
    color: black;
    margin-left: 5px;
}

.m-food-sup-card-filter-raiting-buttons-item:first-child {
    margin-left: 0px;
}

.m-food-sup-card-filter-raiting-buttons-item.active {
    border: 1px solid #013b45;
    box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.5);
    background-color: #c4dfe6;
    color: #013b45;
}

.rating-text-description{
    margin-top: 4px;
    padding-left: 4px;
    text-align: left;
    height: 64px;
    width: 100%;
    border: 2px solid black;
    font-size: 12px;
    outline: none;
    border-radius: 2px;
}

.active {
    box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.5);
    border: 2px solid #013b45;
}

</style>

