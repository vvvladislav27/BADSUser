<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch, onBeforeMount, nextTick, useTemplateRef } from 'vue';

import {getSortedNameText, formatAmount, getOrderStateTextRu, getImage } from '@/utils';
import { searchData } from '@/api/search';
import MSearch from './MSearch.vue';
import MContextMenu from './MContextMenu.vue';
import MOrderFilter from './MOrderFilter.vue';
import { mainButton, secondaryButton, backButton, hideButton, setupButton} from '@/tg';
import { setAnimationForText } from '@/animation';


import store from '@/store';
import { router } from '@/router';


const filters = computed(() => store.state.searchFiltersForOrders);
const search = computed(() => store.state.searchQueryForOrders);
const type = computed(() => store.state.searchTypeForOrders);
const sort = computed(() => store.state.searchSortForOrders);
const photos = computed(() => store.state.foodSupsPhotos);


const isSearchInputActive = computed(() => store.state.isSearchInputActive);
const arrow = computed(() => (sort.value === "desc" ? "⬇" : "⬆"));
const isContextMenuVisible = ref(false);
const isOrderFiltersVisible = ref(false);
const searchFilters = ref([]); 
const buttons = ["created_date", "cost", "item_count", "unique_item_count"];

const filterRef = useTemplateRef('filter')

let mainButtonClickHandler;
let secondaryButtonClickHandler;
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
    backButton.show();
});


onBeforeUnmount(() =>{
    mainButton.offClick(mainButtonClickHandler);
    mainButton.hide();
    backButton.offClick(backButtonClickHandler);
});


const updateTgButtons = () => {
    mainButton.offClick(mainButtonClickHandler);
    secondaryButton.offClick(secondaryButtonClickHandler);
    hideButton(mainButton)
    hideButton(secondaryButton)
    if (isOrderFiltersVisible.value) {
        mainButtonClickHandler = () => {
            setFilters();
        }
        setupButton(mainButton, "Применить", mainButtonClickHandler);
        if(filters.value.length > 0) {
            secondaryButtonClickHandler = () => {
                resetFilters();
            }
            setupButton(secondaryButton, "Сбросить", secondaryButtonClickHandler);
        }
    }
}


const setFilters = async() => {
    const filterData = []
    const data = {
        state: filterRef.value.currentState || null,
        from_date: filterRef.value.fromDate || null,
        to_date: filterRef.value.toDate || null
    };
    const addFilter = (name, state, from_date, to_date) => {
        filterData.push({
            name: name,
            state: state,
            from_date: from_date,
            to_date: to_date
        });
    };
    if (data.state && data.state !== "all") {
        addFilter("Состояние заказа", data.state, null, null)
    }
    if (data.from_date || data.to_date) {
        addFilter(
            "Дата",
             null,
             typeof data.from_date === 'string' ? data.from_date : data.from_date ? data.from_date.toISOString().split('T')[0] : null,
             typeof data.to_date === 'string' ? data.to_date : data.to_date ? data.to_date.toISOString().split('T')[0] : null 
        )
    }
    searchFilters.value = filterData
    if (searchFilters.value) {
        await store.dispatch("SET_FILTERS", {"filters": searchFilters.value, "type": "orders"});
    }
    isOrderFiltersVisible.value = false;
    updateTgButtons();
}

const resetFilters = () => {
    store.dispatch("RESET_FILTERS", "orders")
    isOrderFiltersVisible.value = false;
    updateTgButtons();
}



const openFilters = () => {
    isOrderFiltersVisible.value = true
    if (isOrderFiltersVisible.value) {
        backButton.offClick(backButtonClickHandler)
        backButtonClickHandler = () => {
            isOrderFiltersVisible.value = false;
        }
        backButton.onClick(backButtonClickHandler)
    }
    updateTgButtons()
}



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


const setSort = (type) => {
    store.dispatch("SET_SORT_SEARCH_TYPE_FOR_ORDERS", type)
}

</script>

<template>
    <div 
        class="m-orders-container"
        @click="toogleIsSearchInputActive"
        >
        <m-search 
            :what="'orders'"
            @openFilters="openFilters">
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
                    <div class="m-order-item-state-text">{{ getOrderStateTextRu(order.state) }}</div>
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
        @type="setSort">
    </m-context-menu>
    <m-order-filter
        ref="filter"
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