<script setup>

import { ref, computed, onBeforeMount, onBeforeUnmount } from 'vue';
import store from '@/store';
import { getOrderStateForOrders } from '@/utils';
import '@vuepic/vue-datepicker/dist/main.css';
import VueDatePicker from '@vuepic/vue-datepicker';
import MContextMenu from './MContextMenu.vue';
import { mainButton, secondaryButton, hideButton, setupButton, backButton } from '@/tg';
const format = "dd.MM.yyyy"

const filterList = ref([]);
const buttons = ["all", "created", "canceled", "processed"]
const filters = computed(() => store.state.orderFilters);

const isContextMenuStateVisible = ref(false);

let mainButtonClickHandler;
let secondaryButtonClickHandler;
let backButtonClickHandler

const emit = defineEmits(["close"])


const setFilters = async() => {
    const filterData = []
    const data = {
        state: currentState.value || null,
        from_date: fromDate.value || null,
        to_date: toDate.value || null
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
    filterList.value = filterData
    if (filterList.value) {
        await store.dispatch("SET_FILTERS", {"filters": filterList.value, "type": "orders"});
    }
    close();
}

const resetFilters = () => {
    store.dispatch("RESET_FILTERS", "orders")
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


const setCurrentValue = (data) => {
    currentState.value = data;
    toogleIsContextMenuStateVisible();
}



const initialValueStateOrder = computed(() => {
    const filter = filters.value.find(filter => filter.name === "Состояние заказа");
    return filter ? filter.state : buttons[0];
});


const initialValueFromDate = computed(() => {
    const filter = filters.value.find(filter => filter.name === "Дата");
    return filter ? filter.from_date : null;
})


const initialValueToDate = computed(() => {
    const filter = filters.value.find(filter => filter.name === "Дата");
    return filter ? filter.to_date : null;
})



const currentState = ref(initialValueStateOrder.value);
const fromDate = ref(initialValueFromDate.value);
const toDate = ref(initialValueToDate.value);




const toogleIsContextMenuStateVisible = () => {
    isContextMenuStateVisible.value = !isContextMenuStateVisible.value
}


</script>

<template>
    <div class="m-user-filter-container">
        <div class="m-user-filter-content">
            <div class="m-user-filter-title">Статус</div>
            <div class="m-user-filter-status">
                <button 
                    class="m-user-filter-status-btn"
                    type="button"
                    @click="toogleIsContextMenuStateVisible"
                    >{{  getOrderStateForOrders(currentState)  }}
                </button>
            </div>
            <div class="m-user-filter-title">Период</div>
            <div class="m-user-filter-radio">
                <div class="m-orders-filter-date">
                    <div>C</div>
                    <VueDatePicker
                        class="m-admin-orders-filter-date-picker"
                        locale="ru" 
                        cancelText="отменить" 
                        selectText="выбрать"
                        :enable-time-picker="false"
                        :format="format"
                        v-model="fromDate"
                    />
                </div>
                <div class="m-orders-filter-date">
                    <div class="m-orders-filter-date-text">До</div>
                    <VueDatePicker
                        class="m-admin-orders-filter-date-picker"
                        locale="ru" 
                        cancelText="отменить" 
                        selectText="выбрать"
                        :enable-time-picker="false"
                        :format="format"
                        v-model="toDate"
                    />
                </div>
            </div>
        </div>
  </div>
  <m-context-menu
    v-if="isContextMenuStateVisible"
    :cuurentValue="currentState"
    :buttons="buttons"
    :sort="'orders'"
    @type="setCurrentValue"
    @close="toogleIsContextMenuStateVisible"
  >
  </m-context-menu>
</template>

<style scoped>


.m-user-filter-container{
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

.m-user-filter-content{
    width: 90%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    position: relative;
}

.m-user-filter-title{
    font-size: 14px;
    font-weight: 700;
}


.m-user-filter-radio{
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 15px 0px 15px 0px;
}

.m-user-filter-status{
    margin: 15px 0px 15px 0px;
}

.m-user-filter-status-btn{
    border: none;
    border-radius: 2px;
    outline: none;
    cursor: pointer;
    padding: 5px;
    color:black;
    width: 156px;
    height: 38px;
    font-size: var(--dp-font-size);
}

.m-orders-filter-date{
    display: flex;
    justify-content: space-between;
    align-items: center;
}



.m-admin-orders-filter-date-picker, .m-orders-filter-date-text{
    margin-left: 5px;
}






</style>