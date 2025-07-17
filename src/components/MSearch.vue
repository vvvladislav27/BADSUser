<script setup>
import { ref, computed } from 'vue';
import store from '@/store'; 
import { getFilterButtonName } from '@/utils';

const emit = defineEmits(["openFilters"])


const props = defineProps({
    what: {
        type: String,
        required: true
    }
})


const typeSearch = ref(props.what);
const isSearchInputActive = computed(() => store.state.isSearchInputActive)


const search = computed(() => {
    if (typeSearch.value === "food_sup") {
        return store.state.search;
    } else if (typeSearch.value === "orders") {
        return store.state.searchQueryForOrders;
    } else {
        return null;
    }
});


const q = ref(search.value? search.value: "");


const filters = computed(() => {
    if (typeSearch.value === "food_sup") {
        return store.state.filters;
    } else if (typeSearch.value === "orders") {
        return store.state.searchFiltersForOrders;
    } else {
        return null;
    }
})




const toggleSearchInputActive = () => {
    store.dispatch("TOGGLE_SEARCH_INPUT_ACTIVE")
}


const removeFilter = (index) => {
    store.dispatch("REMOVE_FILTER", {"index": index, "type": typeSearch.value})
}


const clearSearch = () => {
    q.value = ''
    store.dispatch("UPDATE_SEARCH_VALUE", {"search": q.value, "type": typeSearch.value});
};

const onSearchInput = () => {
    store.dispatch("UPDATE_SEARCH_VALUE", {"search": q.value, "type": typeSearch.value});
};


</script>

<template>
    
    <div class="m-search-container">
        <div class="m-search-wrapper">
        <input 
            type="text"
            class="m-search-input"
            v-model="q"
            @input="onSearchInput"
            @click.stop="toggleSearchInputActive"
            :class="{active: isSearchInputActive}"
            :placeholder="q || isSearchInputActive? '': 'Поиск'"/>
        <span 
            v-if="q" 
            class="m-search-clear-icon" 
            @click="clearSearch">
            &times;
        </span>
        </div>
        <div class="m-search-filters-wrapper">
            <div 
                class="m-search-filters-item"
                v-for="(filter, index) in filters"
                @click="removeFilter(index)">
                <p>{{ getFilterButtonName(filter) }}</p>
            </div>
            <button 
                v-if="filters.length < 3"
                type="button"
                class="m-search-filters-item-add"
                @click="emit('openFilters')">
                + Фильтр
            </button>
        </div>
    </div>
</template>


<style scoped>


.m-search-container{
    display: flex;
    flex-direction: column;
}


.m-search-wrapper{
    width: 100%;
    position: relative;
}


.m-search-input{
    margin: 0px 0px 0px 0px;
    width: 100%;
    height: 38px;
    border-radius: 8px;
    border: 4px solid black;
    background-color: white;
    text-align: right;
    outline: none;
    color: black;
    font-size: 14px;
    padding: 0px 4px;
}


.m-search-clear-icon{
    position: absolute; 
    top: 50%; 
    left: 12px; 
    transform: translateY(-50%);
    width: 10px;
    cursor: pointer;
    font-size: 20px;
}

.m-search-input::placeholder{
    color: gray;
}

.m-search-input.active {
    box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.5);
    border-color: #013b45;
}


.m-search-filters-wrapper{
    display: flex;
    flex-wrap: wrap;
    padding-left: 6px;
    align-items: center;
}

.m-search-filters-item, .m-search-filters-item-add{
    box-sizing: border-box;
    font-size: 14px;
    border: 2px solid #013b45;
    border-radius: 2px;
    padding: 8px 10px 8px 10px;
    margin: 10px 0px 0px 6px;
    cursor: pointer;
    line-height: 1;
    background-color: white;
    color: #013b45;;
}


.m-search-filters-item p{
    font-weight: 700;
}


.m-search-filters-item-add{
    border: 2px solid transparent;
    color: black;
}

</style>