<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';
import { router } from '@/router';
import store from '@/store';
import MContextMenu from './MContextMenu.vue';
import MFoodSupsItem from './MFoodSupsItem.vue';
import MSearch from './MSearch.vue';
import MFoodSupFilter from './MFoodSupFilter.vue';
import { getSortedNameText } from '@/utils';
import { 
    mainButton, 
    secondaryButton, 
    backButton, 
    setupButton, 
    hideButton,
 } from '@/tg';

const isSearchInputActive = computed(() => store.state.isSearchInputActive);
const filters = computed(() => store.state.foodSupFilters);
const search = computed(() => store.state.foodSupSearchQuery);
const type = computed(() => store.state.foodSupSearchType);
const sort = computed(() => store.state.foodSupSearchSort);
const foodSups = computed(() => store.state.products);
const userCartItems = computed(() => store.state.userCartItems);
const favFoodSups = computed(() => store.state.favFoodSups);
/*const orderItemsForReviews = computed(() => store.state.orderItemsForReviews);*/
const isContextMenuVisible = ref(false);
const isFoodSupFiltersVisible = ref(false);

const arrow = computed(() => (sort.value === "desc" ? "⬇" : "⬆"));
const isVideoVisible = computed(() => store.state.isVideoVisible);
const isVideoLoad = computed(() => store.state.isVideoLoaded);
const isDataLoaded = computed(() => store.state.isDataLoaded);

const buttons = ["name", "price", "rating"];
const review = ref();


let mainButtonClickHandler;
let secondaryButtonClickHandler;
let backButtonClickHandler;

onMounted(() => {
    hideButton(backButton);
    if (isVideoLoad.value) {
        updateTgButtons();
    }
});



onBeforeUnmount(() =>{
    mainButton.offClick(mainButtonClickHandler);
    secondaryButton.offClick(secondaryButtonClickHandler);
    hideButton(mainButton);
    hideButton(secondaryButton);
});


watch(isFoodSupFiltersVisible, () => {
    if (!isFoodSupFiltersVisible.value) {
        hideButton(backButton);
        updateTgButtons();
    } else {
        hideButton(mainButton);
        hideButton(secondaryButton);
        mainButton.offClick(mainButtonClickHandler);
        secondaryButton.offClick(secondaryButtonClickHandler);  
    }
})



const updateTgButtons = () => {
    hideButton(secondaryButton)
    hideButton(mainButton)
    mainButton.offClick(mainButtonClickHandler);
    secondaryButton.offClick(secondaryButtonClickHandler);
    const hasFavorites = favFoodSups.value && Object.keys(favFoodSups.value).length >= 1;
    const hasCartItems = userCartItems.value && Object.keys(userCartItems.value).length >= 1;
    
    if (hasFavorites) {
        mainButtonClickHandler = () => {
            router.push('/second-app/cabinet');
        }
        setupButton(mainButton, "Кабинет", mainButtonClickHandler);
        if (hasCartItems) {
            secondaryButtonClickHandler = () => {
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


watch([sort, type, filters, search], async() => {
    await store.dispatch("GET_AND_SET_PRODUCTS")
},  {deep: true});



watch(isContextMenuVisible, () => {
    if (!isContextMenuVisible.value) {
        backButton.offClick(backButtonClickHandler);
        hideButton(backButton);
        updateTgButtons();
    } else {
        backButton.show();
        hideButton(mainButton);
        hideButton(secondaryButton);
    }
})



const toggleContextMenuVisible = () => {
    isContextMenuVisible.value = !isContextMenuVisible.value;
};



const onVideoEnded = () => {
    store.dispatch("SET_IS_VIDEO_LOADED")
}


const setSort = (type) => {
    store.dispatch("SET_SORT", {"type": type, "category": "food_sups"});
}



const updateData = (data) => {
    review.value = data
}


/*const skipReview = async() => {
    const data = {
        "order_id": review.value.order_id,
        "food_sup_id": review.value.food_sup_id,
        "skip_review": true
    }
    await skipFoodSupReview(data)
    store.dispatch("REMOVE_ORDER_ITEM_FOR_REVIEW", 0)
    updateTgButtons();
}*/


/*const addReview = async() => {
    if (!review.value || !review.value.mark) {
        await showTelegramPopUp("Укажите оценку!")
    } else {
        await insertReview(review.value)
        store.dispatch("REMOVE_ORDER_ITEM_FOR_REVIEW", 0)
        updateTgButtons();
    }
}*/


const toogleIsFilterVisible = () => {
    isFoodSupFiltersVisible.value = !isFoodSupFiltersVisible.value
}

const toogleIsSearchInputActive = () => {
    if (isSearchInputActive.value) {
        store.dispatch("TOGGLE_SEARCH_INPUT_ACTIVE")
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
    <!--<m-review-context-menu
        v-if="!isVideoVisible && orderItemsForReviews.length > 0"
        @data="updateData">
    </m-review-context-menu>-->
    <div 
        class="m-food-sups-container" 
        @click="toogleIsSearchInputActive"
        v-else-if="!isVideoVisible"
        >
        <m-search 
            :what="'food_sup'"
            @openFilters="toogleIsFilterVisible">
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
        @close="toggleContextMenuVisible"
        :arrow="arrow"
        :buttons="buttons"
        :cuurentValue="type"
        :sort="'food_sups'"
        @type="setSort"
        >
    </m-context-menu>
    <m-food-sup-filter 
        @close="toogleIsFilterVisible"
        v-if="isFoodSupFiltersVisible">
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