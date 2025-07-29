<script setup>

import { ref, computed, onMounted, watch, onBeforeUnmount, onBeforeMount} from 'vue';
import store from '@/store';
import MContextMenu from './MContextMenu.vue';
import MFoodSupFilter from './MFoodSupFilter.vue';
import MSearch from './MSearch.vue';
import { searchData } from '@/api/search';

import { getSortedNameText, getImage, formatAmount } from '@/utils';
import { router } from '@/router';
import { mainButton, secondaryButton, backButton } from '@/tg';
import { setAnimationForText } from '@/animation';


const filters = computed(() => store.state.filters);
const search = computed(() => store.state.search);
const type = computed(() => store.state.type);
const sort = computed(() => store.state.sort);
const photos = computed(() => store.state.foodSupsPhotos);


const isSearchInputActive = computed(() => store.state.isSearchInputActive);
const arrow = computed(() => (sort.value === "desc" ? "⬇" : "⬆"));
const isContextMenuVisible = ref(false);
const isFoodSupFiltersVisible = ref(false);
const searchFilters = ref(); 
const buttons = ["name", "price", "rating"];


let mainButtonClickHandler;
let secondaryButtonClickHandler;
let backButtonClickHandler;


const foodSups = ref();

const getFoodSups = async() => {
    let data = await searchData("favorite_food_sups", filters.value, type.value, sort.value, search.value);
    foodSups.value = data.food_sups;
}



onBeforeMount(async() => {
    await getFoodSups()
    setAnimationForText(".m-food-sups-favorites-item-name-wrapper");
    for (let food_sup of foodSups.value) {
        await getImage(food_sup.photo_path)
    }
})


onMounted(() => {
    setBackButtonClickHandler();
    backButton.show();
    updateTgButtons();
});


onBeforeUnmount(() =>{
    mainButton.offClick(mainButtonClickHandler);
    secondaryButton.offClick(secondaryButtonClickHandler);
    mainButton.hide();
    secondaryButton.hide();
    backButton.offClick(backButtonClickHandler);
});



const setFilters = async() => {
    if (searchFilters.value) {
        await store.dispatch("SET_FILTERS", {"filters": searchFilters, "type": "food_sups"});
    }
    isFoodSupFiltersVisible.value = false;
    updateTgButtons();
}

const resetFilters = () => {
    store.dispatch("RESET_FILTERS", "food_sups")
    isFoodSupFiltersVisible.value = false;
    updateTgButtons();
}


const openFilters = () => {
    isFoodSupFiltersVisible.value = true
    if (isFoodSupFiltersVisible.value) {
        backButton.offClick(backButtonClickHandler)
        backButtonClickHandler = () => {
            isFoodSupFiltersVisible.value = false;
        }
        backButton.onClick(backButtonClickHandler)
    }
    updateTgButtons()
}



const updateTgButtons = () => {
    mainButton.offClick(mainButtonClickHandler);
    secondaryButton.offClick(secondaryButtonClickHandler);
    if (mainButton.isVisible) {
            mainButton.hide();
        };
    if (secondaryButton.isVisible) {
        secondaryButton.hide()
    }
    if (isFoodSupFiltersVisible.value) {
        mainButton.text = "Применить"
        mainButtonClickHandler = function () {
            setFilters();
        }
        mainButton.onClick(mainButtonClickHandler)
        mainButton.show();
        if (filters.value.length == 0) {
            return
        } else {
            secondaryButton.text = "Сбросить"
            secondaryButtonClickHandler = function () {
                resetFilters();
            }
            secondaryButton.onClick(secondaryButtonClickHandler)
            secondaryButton.show();
            return
        }
    }
}


watch([sort, type, filters, search], async() => {
    await getFoodSups();
},  {deep: true});


const setBackButtonClickHandler = () => {
    backButtonClickHandler = async() => {
        router.push("/second-app/cabinet")
    }
    backButton.onClick(backButtonClickHandler)
}

watch(isFoodSupFiltersVisible, () => {
    if(!isFoodSupFiltersVisible.value) {
        setBackButtonClickHandler();
        updateTgButtons();
    }
})


watch(isContextMenuVisible, () => {
    if(!isContextMenuVisible.value) {
        setBackButtonClickHandler();
    }
})



const toggleContextMenuVisible = () => {
    isContextMenuVisible.value = !isContextMenuVisible.value;
    if (isContextMenuVisible.value) {
        backButton.offClick(backButtonClickHandler)
        backButtonClickHandler = () => {
            isContextMenuVisible.value = false;
        }
        backButton.onClick(backButtonClickHandler)
    }
};


const toogleIsSearchInputActive = () => {
    if (isSearchInputActive.value) {
        store.dispatch("TOGGLE_SEARCH_INPUT_ACTIVE")
    }
}


const updateFilters = (filters) => {
    searchFilters.value = filters
}


const setSort = (type) => {
    store.dispatch("SET_SORT", type)
}

const openFoodSup = (id) => {
    router.push(`/second-app/food_sups/${id}`)
}

</script>

<template>
    <div 
        class="m-food-sups-favorites-container" 
        @click="toogleIsSearchInputActive"
        >
        <m-search 
            @openFilters="openFilters"
            :what="'food_sup'">
        </m-search>
        <div class="m-food-sups-favorites-header">
            <div class="m-food-sups-favorites-header-name">БАД</div>
            <div @click="toggleContextMenuVisible">{{ getSortedNameText(type) }} {{ arrow }}</div>
        </div>
        <div class="m-food-sups-favorites-items-wrapper">
            <div 
                v-for="(foodSup, index) in foodSups"
                class="m-food-sups-favorites-item"
                :class="{last_item: index === foodSups.length - 1}" 
                @click="openFoodSup(foodSup.id)">
                <div class="m-food-sups-favorites-item-image-wrapper">
                    <img 
                        v-if="photos[foodSup.photo_path]"
                        :src="photos[foodSup.photo_path]" 
                        class="m-food-sup-card-image"/>
                </div>
                <div class="m-food-sups-favorites-item-content-wrapper">
                    <div class="m-food-sups-favorites-item-name-wrapper" :id="foodSup.id">
                        <div class="m-food-sups-favorites-item-content-text">{{ foodSup.name }}</div>
                    </div>
                    <div class="m-food-sups-favorites-item-content-text-price">{{ formatAmount(foodSup.price) }} Руб</div>
                </div>
            </div>
        </div>
    </div>
    <m-context-menu 
        v-if="isContextMenuVisible"
        @close="toggleContextMenuVisible()"
        :arrow="arrow"
        :buttons="buttons"
        :cuurentValue="type"
        :sort="'food_sups'"
        @type="setSort"
        >
    </m-context-menu>
    <m-food-sup-filter 
        v-if="isFoodSupFiltersVisible"
        @filter-updated="updateFilters"
        @set_filter="setFilters">
    </m-food-sup-filter>
</template>



<style scoped>


.m-food-sups-favorites-container{
    width: 100%;
    padding: 10px 20px;
    display: flex;
    flex-direction: column;
    color: black;
    background-color: white;
}


.m-food-sups-favorites-header{
    margin: 8px 0px 0px 0px;
    padding: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    line-height: 1;
}

.m-food-sups-favorites-header-name{
    font-weight: 700;
}


.m-food-sups-favorites-items-wrapper{
    display: flex;
    flex-direction: column;
    align-items: center;
}


.m-food-sups-favorites-item{
    margin-top: 10px;
    height: 100px;
    width: 95%;
    display: flex;
    align-items: center;
    border-bottom: 1px solid black;
    cursor: pointer;
}

.last_item{
    border-bottom: 0px;
}

.m-food-sups-favorites-item-image-wrapper:first-child{
    margin-top: 20px;
}


.m-food-sups-favorites-item-image-wrapper{
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100px;
    width: 100px;
}


.m-food-sup-card-image{
    display: block;
    width: 60px;
    height: 60px;
}


.m-food-sups-favorites-item-content-wrapper{
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-left: 10px;
    line-height: 1.3;
    white-space: nowrap;
    overflow: hidden;
    position: relative;
}


.m-food-sups-favorites-item-name-wrapper{
    width: 100%;
}


.m-food-sups-favorites-item-content-text{
    margin-right: 4px;
    display: inline-block;
    font-weight: 700;
    font-size: 18px;
}

.m-food-sups-favorites-item-content-text-price{
    font-size: 14px;
}


</style>
