<script setup>
import { onBeforeUnmount, ref, computed, watch, onBeforeMount } from 'vue';
import { getOrderById, updateOrderStatus } from '@/api/order';
import { formatAmount, formatTime, formatDateForOrder, getOrderStateTextRu } from '@/utils';
import store from '@/store';
import { router } from '@/router';
import { showTelegramPopUpWithKeyboard, mainButton, backButton, initData } from '@/tg';
import { setAnimationForText } from '@/animation';
import { DEBUG, FAKE_WEB_APP_DATA } from '@/config';

const authDate = computed(() => store.state.auth);
const photos = computed(() => store.state.foodSupsPhotos);
const order = ref();

let mainButtonClickHandler;
let backButtonClickHandler;


const props = defineProps({
    id: {
        type: String,
        required: true
    }
})


watch(order, () => {
    setTgButtons(order.value.state);
},  {deep: true});



const setTgButtons = () => {
    let buttonText;
    let newOrderState;
    if (mainButton.isVisible) {
        mainButton.hide();
    }
    mainButton.offClick(mainButtonClickHandler)
    if (order.value.state == "send") {
        buttonText = "Получен"
        newOrderState = "received"
    } else if (order.value.state == "created" || order.value.state == "packed") {
        buttonText = "Отменить"
        newOrderState = "canceled"
    }
    mainButton.text = buttonText;
    mainButtonClickHandler = async() => {
        if (newOrderState === "canceled") {
            const result = await showTelegramPopUpWithKeyboard("Хотите отменить заказ?")
            if (result === "confirm") {
                order.value = await updateOrderStatus(order.value.id, newOrderState);
            }
            return
        } else {
            order.value = await updateOrderStatus(order.value.id, newOrderState);
        }
    };
    if (order.value.state == "created" || order.value.state == "packed" || order.value.state == "send") {
        mainButton.onClick(mainButtonClickHandler);
        mainButton.show();
    }
}



onBeforeMount(async() => {
    if (!authDate.value) {
        let auth;
        if (!DEBUG) {
            auth = initData;
        } else {
            auth = FAKE_WEB_APP_DATA
        }
        await store.dispatch("SET_AUTH_DATA", auth);
    }
    order.value = await getOrderById(props.id);
    setAnimationForText('.m-admin-order-item-content-name-wrapper')
    setTgButtons(order.value.state);
    backButtonClickHandler = () => {
        router.push("/second-app/orders");
    };
    backButton.onClick(backButtonClickHandler);
    if (!backButton.isVisible) {
        backButton.show();
    }
})




onBeforeUnmount(() => {
    backButton.offClick(backButtonClickHandler);
    mainButton.offClick(mainButtonClickHandler);
    mainButton.hide()
});



</script>

<template>
    <div class="m-client-order-container" v-if="order">
        <div class="m-admin-order-data">
            <div class="m-admin-order-data-title">Информация о заказе</div>
            <div class="m-admin-order-data-wrapper">
                <div>Номер заказа</div>
                <div class="m-admin-order-data-content"> {{ order.id }} </div>
            </div>
            <div class="m-admin-order-data-wrapper">
                <div>Статус</div>
                <div class="m-admin-order-data-content"> {{ getOrderStateTextRu(order.state) }} </div>
            </div>
            <div class="m-admin-order-data-wrapper">
                <div>Дата создания</div>
                <div class="m-admin-order-data-content"> {{ formatDateForOrder(order.created_at) }} </div>
            </div>
            <div class="m-admin-order-data-wrapper">
                <div>Время создания</div>
                <div class="m-admin-order-data-content"> {{ formatTime(order.created_at) }} </div>
            </div>
            <div class="m-admin-order-data-title" style="margin-top: 0;">Информация о получателе</div>
            <div class="m-admin-order-data-wrapper">
                <div>АДРЕСС</div>
                <div class="m-admin-order-data-content">{{ order.delivery_address }}</div>
            </div>
            <div class="m-admin-order-data-wrapper">
                <div>Покупатель</div>
                <div class="m-admin-order-data-content">{{ order.full_name? order.full_name: "Не указан"}} </div>
            </div>
            <div class="m-admin-order-data-wrapper">
                <div>Номер телефона</div>
                <div class="m-admin-order-data-content">{{ order.phone? order.phone: "Не указан"}}</div>
            </div>
            <div class="m-admin-order-data-wrapper">
                <div>Email</div>
                <div class="m-admin-order-data-content"> {{order.email? order.email: "Не указан" }}  </div>
            </div>
        </div>
        <div class="m-admin-order-data-title">Содержимое заказа</div>
        <div class="m-order-container">
        <div class="m-admin-order-type-wrapper">
            <div class="m-admin-order-type-name">БАД</div>
        </div>
        <div class="m-admin-order-items-wrapper" 
            v-for="item in order.items"
            @click="router.push(`/first-app/food_sups/${item.food_sup.id}`)">
            <div 
                class="m-admin-order-item" 
                :id="item?.food_sup.id">
                <div class="m-order-item-image-wrapper">
                    <img 
                        v-if="photos[item.food_sup.photo_path]"
                        :src="photos[item.food_sup.photo_path]"
                        class="m-order-item-image"/>
                </div>
                <div class="m-admin-order-item-content-wrapper">
                    <div 
                        class="m-admin-order-item-content-name-wrapper"
                        :id="item.id"
                        >
                        <div class="m-admin-order-item-content-name">{{ item.food_sup.name }} {{ item.food_sup.barcode }}</div>
                    </div>
                    <div class="m-admin-order-item-content-price">
                        {{ item.count }} шт.
                        {{ formatAmount(item.count * item.food_sup.price) }} Руб
                    </div>
                </div>
            </div>
            <div class="m-admin-order-item-bottom-border"></div>
        </div>
    </div>
    </div>
</template>

<style scoped>


.m-client-order-container{
    width: 100%;
    height: 100vh;
    padding: 15px 10px 10px 10px;
    color: black;
}

.m-admin-order-data{
    display: flex;
    flex-direction: column;
}

.m-admin-order-data-title{
    margin: 11px 0px 8px 0px;
    width: 100%;
    text-align: center;
    font-weight: 700;
}



.m-admin-order-data-wrapper, .m-client-order-header-shipping-cost{
    margin: 0px 20px 0px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}


.m-admin-order-data-wrapper{
    font-size: 14px;
    margin-bottom: 15px;
}

.m-client-order-header-shipping-cost{
    font-size: 12px;
    padding-bottom: 15px;
}

.m-admin-order-data-content{
    cursor: pointer;
    width: 65%;
    text-align: right;
}



.m-order-container{
    width: 100%;
    padding: 0px 20px 10px 0px;
    display: flex;
    flex-direction: column;
    color: black;
    background-color: white;
}


.m-admin-order-type-wrapper{
    margin: 0px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    line-height: 1;
}

.m-admin-order-type-name{
    width: 95%;
    margin-left: 15.5px;
    font-weight: 700;
}

.m-order-list-header-sort{
    cursor: pointer;
}

.m-admin-order-items-wrapper{
    display: flex;
    flex-direction: column;
    align-items: center;
}


.m-admin-order-items-wrapper:first-child{
    margin-top: 20px;
}

.m-admin-order-item{
    position: relative;
    margin-top: 10px;
    height: 100px;
    width: 95%;
    display: flex;
    align-items: center;
    cursor: pointer;
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


.m-admin-order-item-content-wrapper{
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

.m-admin-order-item-content-name-wrapper{
    width: 100%;
}

.m-admin-order-item-content-name{
    margin-right: 4px;
    display: inline-block;
    font-weight: 700;
    font-size: 18px;
}


.m-admin-order-item-content-price{
    font-size: 14px;
}


.m-admin-order-item-bottom-border{
    border-bottom: 1px solid black;
    width: 95%;
    margin-left: 13.4px;
}





</style>
