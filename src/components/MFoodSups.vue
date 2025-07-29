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
import { DEBUG, FAKE_WEB_APP_DATA } from '@/config';
import { getOrdersForInsertReviews } from '@/api/order';
import { insertReview } from '../api/reviews';
import { skipFoodSupReview } from '@/api/order';
import { showTelegramPopUp, mainButton, secondaryButton, initData, backButton } from '@/tg';


const filters = computed(() => store.state.filters);
const search = computed(() => store.state.search);
const type = computed(() => store.state.type);
const sort = computed(() => store.state.sort);
const foodSups = computed(() => store.state.products);
const userCartItems = computed(() => store.state.userCartItems);
const favFoodSups = computed(() => store.state.favFoodSups);
const isSearchInputActive = computed(() => store.state.isSearchInputActive);
const isContextMenuVisible = ref(false);
const isFoodSupFiltersVisible = ref(false);
const arrow = computed(() => (sort.value === "desc" ? "⬇" : "⬆"));
const isVideoVisible = computed(() => store.state.isVideoVisible);
const isVideoLoad = computed(() => store.state.isVideoLoaded);
const isDataLoaded = computed(() => store.state.isDataLoaded);
const isInsertReviewsContextMenuVisible = ref(false);

const buttons = ["name", "price", "rating"];


let mainButtonClickHandler;
let secondaryButtonClickHandler;





const openCart = () => {
    store.dispatch("RESET_SELECTED_ITEMS")
    router.push("/second-app/cart")
}

const openCabinet = async() => {
    router.push('/second-app/cabinet')
}


const ordersForReviews = ref();

onMounted(async() => {
    let auth;
    if (!DEBUG) {
        auth = initData;
    } else {
        auth = FAKE_WEB_APP_DATA
    }
    await store.dispatch("SET_AUTH_DATA", auth);
    ordersForReviews.value = await getOrdersForInsertReviews();
    checkOrdersForReviews();
    await store.dispatch("GET_DATA");
});



onUnmounted(() =>{
    mainButton.offClick(mainButtonClickHandler);
    secondaryButton.offClick(secondaryButtonClickHandler);
    mainButton.hide();
    secondaryButton.hide();
    if (isSearchInputActive.value) {
        store.dispatch("TOGGLE_SEARCH_INPUT_ACTIVE")
    }
});


const closeFilters = () => {
    isFoodSupFiltersVisible.value = false;
    updateTgButtons(favFoodSups.value, userCartItems.value);
}

const setFilters = async() => {
    if (searchFilters.value) {
        await store.dispatch("SET_FILTERS", {"filters": searchFilters.value, "type": "food_sups"});
    }
    isFoodSupFiltersVisible.value = false;
    updateTgButtons(favFoodSups.value, userCartItems.value);
}

const resetFilters = () => {
    store.dispatch("RESET_FILTERS", "food_sups")
    isFoodSupFiltersVisible.value = false;
    updateTgButtons(favFoodSups.value, userCartItems.value);
}

const updateTgButtons = (f, u) => {
    if (mainButton.isVisible) {
            mainButton.hide();
        };
    if (secondaryButton.isVisible) {
        secondaryButton.hide();
    }
    if (backButton.isVisible) {
        backButton.hide();
    }
    if (isFoodSupFiltersVisible.value) {
        mainButton.offClick(mainButtonClickHandler);
        secondaryButton.offClick(secondaryButtonClickHandler);
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
    } else {
        mainButton.offClick(mainButtonClickHandler)
        secondaryButton.offClick(secondaryButtonClickHandler)
        if (mainButton.isVisible) {
            mainButton.hide();
        }
        if (secondaryButton.isVisible) {
            secondaryButton.hide();
        }
        if (ordersForReviews.value.length > 0) {
            mainButton.text = "Добавить"
            mainButtonClickHandler = () => {
                addReview()
            }
            mainButton.onClick(mainButtonClickHandler);
            mainButton.show()
            secondaryButton.text = "Пропустить"
            secondaryButtonClickHandler = () => {
                skipReview()
            }
            secondaryButton.onClick(secondaryButtonClickHandler);
            secondaryButton.show();
            return
        }
        const hasFavorites = f && Object.keys(f).length >= 1;
        const hasCartItems = u && Object.keys(u).length >= 1;
        if (hasFavorites) {
            mainButton.text = "Кабинет";
            mainButtonClickHandler = function() {
                openCabinet();
            }
            mainButton.onClick(mainButtonClickHandler)
            mainButton.show();
            if (hasCartItems) {
                secondaryButton.text = "Корзина";
                secondaryButtonClickHandler = function() {
                    openCart();
                };
            secondaryButton.onClick(secondaryButtonClickHandler);
            secondaryButton.show();
        }
        } else if (hasCartItems) {
            mainButton.text = "Корзина";
            mainButtonClickHandler = function() {
                openCart();
            };
            mainButton.onClick(mainButtonClickHandler);
            mainButton.show();
        }
    }
}

watch([favFoodSups, userCartItems], () => {
    if (!isVideoVisible.value) {
        updateTgButtons(favFoodSups.value, userCartItems.value)
    }
}, { deep: true });


watch([sort, type, filters, search], () => {
    store.dispatch("GET_AND_SET_PRODUCTS")
},  {deep: true});



const toggleContextMenuVisible = () => {
    isContextMenuVisible.value = !isContextMenuVisible.value;
};


const openFilters = () => {
    isFoodSupFiltersVisible.value = true
    updateTgButtons(favFoodSups.value, userCartItems.value)
}



const toogleIsSearchInputActive = () => {
    if (isSearchInputActive.value) {
        store.dispatch("TOGGLE_SEARCH_INPUT_ACTIVE")
    }
}

const searchFilters = ref(); 

const updateFilters = (filters) => {
    searchFilters.value = filters
}


watch([isVideoLoad, isDataLoaded], ([isVideoLoadNewValue, isDataLoadedNewValue]) => {
      if (isVideoLoad.value && isDataLoaded.value) {
        store.dispatch("SET_IS_VIDEO_VISIBLE")
        updateTgButtons(favFoodSups.value, userCartItems.value)
      }
    });


const onVideoEnded = () => {
    store.dispatch("SET_IS_VIDEO_LOADED")
}


const setSort = (type) => {
    store.dispatch("SET_SORT", type)
}

const currentOrder = ref();
const currentFoodItem = ref();


const showReviewModal = (order, foodItem) => {
    currentOrder.value = order;
    currentFoodItem.value = foodItem;
    isInsertReviewsContextMenuVisible.value = true;
}


const checkOrdersForReviews = () => {
    let foundReviewableItem = false;
    ordersForReviews.value.forEach(order => {
        order.food_sups.forEach(foodItem => {
            if (foodItem) {
                showReviewModal(order, foodItem);
                foundReviewableItem = true;
            }
        });
    });
    if (!foundReviewableItem) {
        store.dispatch("GET_AND_SET_PRODUCTS")
        if (isVideoLoad.value){
            updateTgButtons(favFoodSups.value, userCartItems.value); 
        }
        isInsertReviewsContextMenuVisible.value = false;
    }
}

const review = ref();

const updateData = (data) => {
    review.value = {
        "mark": data.mark,
        "text": data.text,
        "food_sup_id": currentFoodItem.value.id,
        "order_id": currentOrder.value.id,
    }
}

const skipReview = async() => {
    const data = {
        "order_id": currentOrder.value.id,
        "food_sup_id": currentFoodItem.value.id,
        "skip_review": true
    }
    await skipFoodSupReview(data)
    ordersForReviews.value = await getOrdersForInsertReviews();
    checkOrdersForReviews();
}


const addReview = async() => {
    if (!review.value || !review.value.mark) {
        await showTelegramPopUp("Укажите оценку!")
    } else {
        await insertReview(review.value)
        ordersForReviews.value = await getOrdersForInsertReviews();
        checkOrdersForReviews();
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
        v-if="!isVideoVisible && isInsertReviewsContextMenuVisible"
        :currentOrder="currentOrder"
        :currentFoodItem="currentFoodItem"
        @data="updateData">
    </m-review-context-menu>
    <div 
        class="m-food-sups-container" 
        @click="toogleIsSearchInputActive"
        v-else-if="!isVideoVisible && !isInsertReviewsContextMenuVisible"
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