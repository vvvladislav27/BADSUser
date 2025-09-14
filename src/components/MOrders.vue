<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch, onBeforeMount, nextTick } from 'vue';

import {getSortedNameText, formatAmount, getOrderStateForOrder, getImage } from '@/utils';
import { searchData } from '@/api/search';
import MSearch from './MSearch.vue';
import MContextMenu from './MContextMenu.vue';
import MOrderFilter from './MOrderFilter.vue';
import { backButton} from '@/tg';
import { setAnimationForText } from '@/animation';


import store from '@/store';
import { router } from '@/router';


const filters = computed(() => store.state.orderFilters);
const search = computed(() => store.state.orderSearchQuery);
const type = computed(() => store.state.orderSearchType);
const sort = computed(() => store.state.orderSearchSort);
const photos = computed(() => store.state.foodSupsPhotos);


const arrow = computed(() => (sort.value === "desc" ? "⬇" : "⬆"));
const isContextMenuVisible = ref(false);
const isOrderFiltersVisible = ref(false);
const buttons = ["created_date", "cost", "item_count", "unique_item_count"];


let backButtonClickHandler;

const orders = ref();

const getOrders = async() => {
    const data = await searchData("orders", filters.value, type.value, sort.value, search.value);
    orders.value = data.orders;
}

onBeforeMount(async() => {
    await getOrders()
    for (let order of orders.value) {
        await getImage(order.items[0].food_sup.photo_path)
    }
})


onMounted(() => {
    setBackButtonClickHandler();
});


onBeforeUnmount(() =>{
    backButton.offClick(backButtonClickHandler);
});



watch([sort, type, filters, search], async() => {
    await getOrders();
},  {deep: true});


watch(orders, async() => {
    await nextTick();
    setAnimationForText(".m-order-item-content-name-wrapper");
});


const setBackButtonClickHandler = () => {
    backButtonClickHandler = () => {
        router.push("/second-app/cabinet");
    };
    backButton.onClick(backButtonClickHandler)
}


watch(isOrderFiltersVisible, () => {
    if(!isOrderFiltersVisible.value) {
        setBackButtonClickHandler();
    } else {
        backButton.offClick(backButtonClickHandler);
    }
})

watch(isContextMenuVisible, () => {
    if(!isContextMenuVisible.value) {
        setBackButtonClickHandler();
    } else {
        backButton.offClick(backButtonClickHandler);
    }
})

const toggleContextMenuVisible = () => {
    isContextMenuVisible.value = !isContextMenuVisible.value;
};


const toogleIsFilterVisible = () => {
    isOrderFiltersVisible.value = !isOrderFiltersVisible.value
}


const setSort = (type) => {
    store.dispatch("SET_SORT", {"type": type, "category": "orders"});
}

</script>

<template>
    <div 
        class="m-orders-container"
        @click="toogleIsSearchInputActive"
        >
        <m-search 
            :what="'orders'"
            @openFilters="toogleIsFilterVisible">
        </m-search>
        <div class="m-orders-header">
            <div @click="toggleContextMenuVisible">{{ getSortedNameText(type) }} {{ arrow }}</div>
        </div>
        <div class="m-orders-items-wrapper">
            <div 
                v-for="(order, index) in orders"
                class="m-order-item"
                :class="{last_item_order: index === orders.length - 1}"
                @click="router.push(`/second-app/orders/${order.id}`)">
                <div class="m-order-item-image-wrapper">
                    <img
                        v-if="photos[order.items[0].food_sup.photo_path]"
                        :src="photos[order.items[0].food_sup.photo_path]"
                        class="m-order-item-image"/>
                </div>
                <div class="m-order-item-content-wrapper">
                    <div class="m-order-item-content-name-wrapper">
                        <div class="m-order-item-content-text">Заказ №{{ order.id }} - {{ order.items.length }}шт ({{ formatAmount(order.cost) }}) руб</div>
                    </div>
                    <div class="m-order-item-state-text">{{ getOrderStateForOrder(order.state) }}</div>
                </div>
            </div>
        </div>
    </div>
    <m-context-menu 
        v-if="isContextMenuVisible"
        @close="toggleContextMenuVisible"
        :arrow="arrow"
        :buttons="buttons"
        :cuurentValue="type"
        :sort="'food_sups'"
        @type="setSort">
    </m-context-menu>
    <m-order-filter
        @close="toogleIsFilterVisible"
        v-if=isOrderFiltersVisible>
    </m-order-filter>
</template>



<style scoped>


.m-orders-container{
    width: 100%;
    padding: 10px 20px;
    display: flex;
    flex-direction: column;
    color: black;
    background-color: white;
}


.m-orders-header{
    margin: 8px 0px 0px 0px;
    padding: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    line-height: 1;
}



.m-orders-items-wrapper{
    display: flex;
    flex-direction: column;
    align-items: center;
}


.m-order-item{
    margin-top: 10px;
    height: 100px;
    width: 95%;
    display: flex;
    align-items: center;
    border-bottom: 1px solid black;
    cursor: pointer;
}

.last_item_order{
    border-bottom: 0px;
}

.m-order-item-image-wrapper:first-child{
    margin-top: 20px;
}


.m-order-item-image-wrapper{
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100px;
    width: 100px;
}


.m-order-item-image{
    display: block;
    width: 60px;
    height: 60px;
}


.m-order-item-content-wrapper{
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


.m-order-item-content-name-wrapper{
    width: 100%;
}


.m-order-item-content-text{
    margin-right: 4px;
    display: inline-block;
    font-weight: 700;
    font-size: 18px;
}

.m-order-item-state-text{
    font-size: 14px;
}

</style>