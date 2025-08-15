<script setup>
import { ref, computed, onBeforeUnmount, onBeforeMount } from 'vue';
import { router } from '@/router';
import store from '@/store';
import { vibrate } from '@/utils';
import { backButton, mainButton, secondaryButton, setupButton, hideButton } from '@/tg';

const currentType = computed(() => router.currentRoute.value.name == "FoodSups"? "food_sups": "favorite_food_sup")

const activeInput = ref()
const filters = computed(() => currentType.value == "food_sups"? store.state.filters: store.state.favoriteFoodSupsFilters);
const buttons = [1, 2, 3, 4, 5]
const filtersList = ref([]); 

let mainButtonClickHandler;
let secondaryButtonClickHandler;
let backButtonClickHandler

const emit = defineEmits(["close"])


const setFilters = async() => {
    const filterData = [];
    const data = {
        rating: rating.value || null,
        priceFrom: priceFrom.value || null,
        priceTo: priceTo.value || null,
        package_item_count: package_item_count.value || null
    };
    const addFilter = (name, rating, priceFrom, priceTo, package_item_count) => {
        filterData.push({
            name: name,
            rating: rating,
            package_item_count: package_item_count,
            price_from: priceFrom,
            price_to: priceTo
        });
    };
    if (data.rating) {
        addFilter('Рейтинг', data.rating, null, null, null);
    };
    if (data.priceFrom || data.priceTo) {
        addFilter("Цена", null, data.priceFrom, data.priceTo, null);
    };
    if (data.package_item_count) {
        addFilter("Количество", null, null, null, data.package_item_count);
    };
    filtersList.value = filterData;
    if (filtersList.value) {
        await store.dispatch("SET_FILTERS", {"filters": filtersList.value, "type": currentType.value});
    };
    close();
}


const resetFilters = () => {
    store.dispatch("RESET_FILTERS", currentType.value);
    close();
}

const close = () => {
    mainButton.offClick(mainButtonClickHandler);
    secondaryButton.offClick(secondaryButtonClickHandler);
    hideButton(mainButton);
    hideButton(secondaryButton);
    emit("close");
}


onBeforeMount(() => {
    mainButtonClickHandler = () => {
        setFilters();
    }
    setupButton(mainButton, "Применить", mainButtonClickHandler);
    if (filters.value.length > 0) {
        secondaryButtonClickHandler = () => {
            resetFilters();
        }
        setupButton(secondaryButton, "Сбросить", secondaryButtonClickHandler);
    }
    backButtonClickHandler = () => {
        close();
    };
    backButton.onClick(backButtonClickHandler);
    backButton.show();
})


onBeforeUnmount(() => {
    backButton.offClick(backButtonClickHandler);
})


const setFilterRating = (value_) => {
    if (rating.value == value_) {
        rating.value = null
    } else {
        vibrate()
        rating.value = value_
    }
}

const setFilterPackageItemCount = (value_) => {
    if (package_item_count.value == value_) {
        package_item_count.value = null
    } else {
        vibrate()
        package_item_count.value = value_
    }
}

const updatePriceFrom = () => {
    priceFrom.value = Math.max(0, priceFrom.value)
}

const updatePriceTo = () => {
    priceTo.value = Math.max(0, priceTo.value);
}


const initialRating = computed(() => {
    const filter = filters.value.find(filter => filter.name === "Рейтинг");
    return filter ? filter.rating : null;
});


const initialPackageItemCount = computed(() => {
    const filter = filters.value.find(filter => filter.name === "Количество");
    return filter ? filter.package_item_count : null;
});


const initialPrice = computed(() => {
    return filters.value.find(filter => filter.name === "Цена") || {};
});


const rating = ref(initialRating.value);
const package_item_count = ref(initialPackageItemCount.value);
const priceFrom = ref(initialPrice.value.price_from || 0);
const priceTo = ref(initialPrice.value.price_to || 0);


const setActiveInput = (field) => {
    activeInput.value = field
}

</script>

<template>
    <div class="m-food-sup-card-filter-container">
        <div class="m-food-sup-card-filter-content">
            <div class="m-food-sup-card-filter-title">Мин. рейтинг</div>
            <div class="m-food-sup-card-filter-raiting-buttons">
                <button 
                    class="m-food-sup-card-filter-raiting-buttons-item"
                    :class="{active: rating == button}"
                    @click="setFilterRating(button)"
                    v-for="button in buttons">
                {{ button }}
                </button>
            </div>
            <div class="m-food-sup-card-filter-title">Цена, ₽</div>
            <div class="m-food-sup-card-filter-price-pagination">
                <p>от</p>
                <input 
                    type="number" 
                    class="m-food-sup-card-filter-price-pagination-item"
                    :class="{ active: activeInput === 'from' }"
                    @focus="setActiveInput('from')"
                    v-model="priceFrom"
                    @input="updatePriceFrom">
                <p>до</p>
                <input 
                    type="number"
                    class="m-food-sup-card-filter-price-pagination-item"
                    :class="{ active: activeInput === 'to' }"
                    @focus="setActiveInput('to')"
                    v-model="priceTo"
                    @input="updatePriceTo">
            </div>
            <div class="m-food-sup-card-filter-title">Кол-во в упаковке</div>
            <div class="m-food-sup-card-filter-counter-pagination-radio">
                <input 
                    type="radio" 
                    name="package_item_count" 
                    value="12" 
                    @click="setFilterPackageItemCount(12)"
                    :checked="package_item_count === 12"/>
                <label>12</label>
                <input 
                    type="radio" 
                    name="package_item_count" 
                    value="24" 
                    @click="setFilterPackageItemCount(24)"
                    :checked="package_item_count === 24"/>
                <label>24</label>
            </div>
        </div>
  </div>
</template>

<style scoped>


.m-food-sup-card-filter-container{
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: rgba(0, 0, 0, 1);
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  overflow: auto; 
  position: fixed
}

.m-food-sup-card-filter-content{
    display: flex;
    flex-direction: column;
    justify-content: center;
    position: relative;
    overflow: auto; 
}

.m-food-sup-card-filter-title{
    font-size: 14px;
    font-weight: 700;
}


.m-food-sup-card-filter-raiting-buttons{
    display: flex;
    justify-content: space-between;
    margin: 10px 0px 18px 0px;
}

.m-food-sup-card-filter-raiting-buttons-item {
    background-color: white;
    border: none;
    height: 32px;
    width: 32px;
    font-size: 12px;
    cursor: pointer;
    border: 1px solid black;
    border-radius: 4px;
    color: black;
}

.m-food-sup-card-filter-raiting-buttons-item:first-child{
    margin-left: 0px;
}

.m-food-sup-card-filter-raiting-buttons-item.active{
    border: 1px solid #013b45;
    box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.5);
    background-color: #c4dfe6;
    color: #013b45;
}


.m-food-sup-card-filter-price-pagination{
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 10px 0px 18px 0px;
}


.m-food-sup-card-filter-price-pagination p{
    margin-left: 16px;
}


.m-food-sup-card-filter-price-pagination-item{
    display: block;
    background-color: white;
    margin-left: 8px;
    width: 96px;
    height: 24px;
    font-size: 18px;
    outline: none;
    border: 1px solid black;
    text-align: right;
    border-radius: 2px;
    padding-right: 4px;
}

.m-food-sup-card-filter-price-pagination-item.active{
    border: 1px solid #013b45;
}

.m-food-sup-card-filter-counter-pagination-radio{
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 5px 0px 0px 0px;
}

input[type='radio']{
    margin-left: 10px;
}

input[type='radio']:after {
    width: 16px;
    height: 16px;
    border-radius: 15px;
    top: 0px;
    left: 0px; 
    position: relative;
    background-color: white;
    content: '';
    display: inline-block;
    visibility: visible;
    border: 2px solid black;
}

    
input[type='radio']:checked:after {
    width: 16px;
    height: 16px;
    border-radius: 15px;
    top: 0px;
    left: 0px; 
    position: relative;
    background-color: #c4dfe6;
    content: '';
    display: inline-block;
    visibility: visible;
    border: 2px solid #013b45;
}

label{
    font-size: 24px;
    margin-left: 4px;
}

.m-food-sup-card-filter-main-button{
    background-color: white;
    border: 1px solid black;
    margin: 8px 10px;
    border-radius: 4px;
}


</style>


