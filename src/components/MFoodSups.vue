<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { router } from '@/router';
import store from '@/store';
import MContextMenu from './MContextMenu.vue';
import MFoodSupsItem from './MFoodSupsItem.vue';
import MSearch from './MSearch.vue';
import MFoodSupFilter from './MFoodSupFilter.vue';
import MReviewContextMenu from './MReviewContextMenu.vue';
import { getSortedNameText } from '@/utils';
import { insertReview } from '../api/reviews';
import { skipFoodSupReview } from '@/api/order';
import { showTelegramPopUp, mainButton, secondaryButton, backButton, setupButton, hideButton } from '@/tg';


const filters = computed(() => store.state.filters);
const search = computed(() => store.state.search);
const type = computed(() => store.state.type);
const sort = computed(() => store.state.sort);
const foodSups = computed(() => store.state.products);
const userCartItems = computed(() => store.state.userCartItems);
const favFoodSups = computed(() => store.state.favFoodSups);
const orderItemsForReviews = computed(() => store.state.orderItemsForReviews);
const isSearchInputActive = computed(() => store.state.isSearchInputActive);
const isContextMenuVisible = ref(false);
const isFoodSupFiltersVisible = ref(false);
const arrow = computed(() => (sort.value === "desc" ? "⬇" : "⬆"));
const isVideoVisible = computed(() => store.state.isVideoVisible);
const isVideoLoad = computed(() => store.state.isVideoLoaded);
const isDataLoaded = computed(() => store.state.isDataLoaded);

const buttons = ["name", "price", "rating"];
const searchFilters = ref(); 
const review = ref();


let mainButtonClickHandler;
let secondaryButtonClickHandler;


onMounted(() => {
    store.dispatch("GET_AND_SET_PRODUCTS")
    if (isVideoLoad.value) {
        updateTgButtons();
    }
});



onUnmounted(() =>{
    mainButton.offClick(mainButtonClickHandler);
    secondaryButton.offClick(secondaryButtonClickHandler);
    mainButton.hide();
    secondaryButton.hide();
    toogleIsSearchInputActive();
});

const openFilters = () => {
    isFoodSupFiltersVisible.value = true
    updateTgButtons()
}


const closeFilters = () => {
    isFoodSupFiltersVisible.value = false;
    updateTgButtons();
}

const updateFilters = (filters) => {
    searchFilters.value = filters
}


const setFilters = async() => {
    if (searchFilters.value) {
        await store.dispatch("SET_FILTERS", {"filters": searchFilters.value, "type": "food_sups"});
    }
    isFoodSupFiltersVisible.value = false;
    updateTgButtons();
}

const resetFilters = () => {
    store.dispatch("RESET_FILTERS", "food_sups")
    isFoodSupFiltersVisible.value = false;
    updateTgButtons();
}


const updateTgButtons = () => {
    hideButton(mainButton);
    hideButton(secondaryButton);
    hideButton(backButton);
    mainButton.offClick(mainButtonClickHandler);
    secondaryButton.offClick(secondaryButtonClickHandler);

    if (isFoodSupFiltersVisible.value) {
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
        return;
    } 
    if (orderItemsForReviews.value.length > 0) {
        mainButtonClickHandler = () => {
            addReview()
        }
        secondaryButtonClickHandler = () => {
            skipReview()
        }
        setupButton(mainButton, "Добавить", mainButtonClickHandler);
        setupButton(secondaryButton, "Пропустить", secondaryButtonClickHandler);
        return;
    }

    const hasFavorites = favFoodSups.value && Object.keys(favFoodSups.value).length >= 1;
    const hasCartItems = userCartItems.value && Object.keys(userCartItems.value).length >= 1;
    
    if (hasFavorites) {
        mainButtonClickHandler = () => {
            router.push('/second-app/cabinet');
        }
        setupButton(mainButton, "Кабинет", mainButtonClickHandler);
        if (hasCartItems) {
            secondaryButtonClickHandler = function() {
                store.dispatch("RESET_SELECTED_ITEMS")
                router.push("/second-app/cart");
            };
            setupButton(secondaryButton, "Корзина", secondaryButtonClickHandler);
        }
    } else if (hasCartItems) {
        mainButtonClickHandler = () => {
            store.dispatch("RESET_SELECTED_ITEMS")
            router.push("/second-app/cart");
        };
        setupButton(mainButton, "Корзина", mainButtonClickHandler);
    }
}

watch([favFoodSups, userCartItems], () => {
    if (!isVideoVisible.value) {
        updateTgButtons()
    }
}, { deep: true });


watch([isVideoLoad, isDataLoaded], () => {
    if (isVideoLoad.value && isDataLoaded.value) {
        store.dispatch("SET_IS_VIDEO_VISIBLE")
        updateTgButtons()
    }
});


watch([sort, type, filters, search], () => {
    store.dispatch("GET_AND_SET_PRODUCTS")
},  {deep: true});



const toggleContextMenuVisible = () => {
    isContextMenuVisible.value = !isContextMenuVisible.value;
};



const toogleIsSearchInputActive = () => {
    if (isSearchInputActive.value) {
        store.dispatch("TOGGLE_SEARCH_INPUT_ACTIVE")
    }
}



const onVideoEnded = () => {
    store.dispatch("SET_IS_VIDEO_LOADED")
}


const setSort = (type) => {
    store.dispatch("SET_SORT", type)
}



const updateData = (data) => {
    review.value = data
}


const skipReview = async() => {
    const data = {
        "order_id": review.value.order_id,
        "food_sup_id": review.value.food_sup_id,
        "skip_review": true
    }
    await skipFoodSupReview(data)
    store.dispatch("REMOVE_ORDER_ITEM_FOR_REVIEW", 0)
    updateTgButtons();
}


const addReview = async() => {
    if (!review.value || !review.value.mark) {
        await showTelegramPopUp("Укажите оценку!")
    } else {
        await insertReview(review.value)
        store.dispatch("REMOVE_ORDER_ITEM_FOR_REVIEW", 0)
        updateTgButtons();
    }
}


</script>

<template>
   <video
        autoplay
        muted
        @ended="onVideoEnded"
        playsinline
        v-if=isVideoVisible>
        <source src="/c.mp4" type="video/mp4" />
        Ваш браузер не поддерживает анимацию.
    </video>
    <m-review-context-menu
        v-if="!isVideoVisible && orderItemsForReviews.length > 0"
        @data="updateData">
    </m-review-context-menu>
    <div 
        class="m-food-sups-container" 
        @click="toogleIsSearchInputActive"
        v-else-if="!isVideoVisible && orderItemsForReviews.length == 0"
        >
        <m-search 
            :what="'food_sup'"
            @openFilters="openFilters">
        </m-search>
        <div class="m-food-sups-header">
            <div class="m-food-sups-header-name">БАД</div>
            <div @click="toggleContextMenuVisible">{{ getSortedNameText(type) }} {{ arrow }}</div>
        </div>
        <div class="m-food-sups-content">
            <m-food-sups-item
                v-for="(foodSup) in foodSups" 
                :key="foodSup.id"
                :foodSup="foodSup"
            >
            </m-food-sups-item>
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
        @close="closeFilters"
        @set_filter="setFilters"
    </m-food-sup-filter>
</template>



<style scoped>


video {
    position: fixed;
    top: 50%;
    left: 50%;
    height: 100vh;
    width: auto;
    min-width: 100%;
    min-height: 100%;
    transform: translate(-50%, -50%);
    z-index: 1000;
    object-fit: cover;
}


.m-food-sups-container{
    width: 100%;
    padding: 10px 20px;
    display: flex;
    flex-direction: column;
    color: black;
    background-color: white;
}


.m-food-sups-header{
    margin: 8px 0px 0px 0px;
    padding: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    line-height: 1;
}


.m-food-sups-header-name{
    font-weight: 700;
}


.m-food-sups-content{
    display: grid;
    justify-content: center;
    grid-template-columns: min-content min-content;
}


</style>