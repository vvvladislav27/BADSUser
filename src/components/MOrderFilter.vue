<script setup>

import { ref, computed } from 'vue';
import store from '@/store';
import { getOrderStateEn } from '@/utils';
import '@vuepic/vue-datepicker/dist/main.css';
import VueDatePicker from '@vuepic/vue-datepicker';
import MContextMenu from './MContextMenu.vue';
const format = "dd.MM.yyyy"


const filters = computed(() => store.state.searchFiltersForOrders);

const isContextMenuStateVisible = ref(false);


const buttons = ["all", "created", "packed", "send", "received", "finished", "canceled"]


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


defineExpose({
    currentState,
    fromDate,
    toDate
})


const toogleIsContextMenuStateVisible = () => {
    isContextMenuStateVisible.value = !isContextMenuStateVisible.value
}



const setCurrentValue = (data) => {
    currentState.value = data;
    toogleIsContextMenuStateVisible();
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
                    >{{  getOrderStateEn(currentState)  }}
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