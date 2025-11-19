<script setup>
import {ref, onMounted, onBeforeUnmount, computed, onBeforeMount } from 'vue';
import store from '@/store';
import { router } from '@/router';
import { formatAmount, getImage } from '@/utils';
import { createOrder } from '@/api/order';
import { showTelegramPopUp, mainButton, backButton, setupButton, hideButton } from '@/tg';
import MLegalPasport from './MLegalPasport.vue';
import { setAnimationForText } from '@/animation';

const photos = computed(() => store.state.foodSupsPhotos);
const orderItems = computed(() => Object.values(store.state.userOrderItems));
const orderItemsIds = ref([]);
const totalPrice = ref(0);
const isInsertLegalPassportVisible = ref(false);
const legalPassport = ref("");

let backButtonClickHandler;
let mainButtonClickHandler;



onBeforeMount(async() => {
    for (let item of orderItems.value) {
        await getImage(item.food_sup.photo_path)
    }
    setAnimationForText(".m-create-order-item-content-name-wrapper");
})


onMounted(async() => {
    calculateTotalPriceAndSetMainButton();
    backButtonClickHandler = async() => {
        await store.dispatch("RESET_SELECTED_ITEMS")
        router.push("/second-app/cart")
    }
    backButton.onClick(backButtonClickHandler);
})


onBeforeUnmount(() => {
    backButton.offClick(backButtonClickHandler);
    mainButton.offClick(mainButtonClickHandler);
    hideButton(mainButton);
})


const handleClickMainButton = async() => {
    if (!legalPassport.value) {
        isInsertLegalPassportVisible.value = true;
    } else {
        if (isInsertLegalPassportVisible.value) {
            isInsertLegalPassportVisible.value = false;
        };
        const data = {
            "legal_passport": legalPassport.value,
            "cart_items_ids": orderItemsIds.value
        }
        const result = await createOrder(data);
        if (result) {
            showTelegramPopUp("Cпасибо за заказ!\nОжидайте, скоро с вами свяжется представитель компании для завершения оформления")
            router.push("/second-app/")
        }
    }
}

const setLegalPassport = (data) => {
    legalPassport.value = data
}

/*const handleClickMainButton = async() => {
    let message = "Для оформления заказа необходимо указать";
    let insertData = false;
    if (!user.value.address) {
        message += " адрес";
        insertData = true;
    } else if (!user.value.full_name) {
        message += " ФИО";
        insertData = true;
    } else if (!user.value.email) {
        message += " email"
        insertData = true;
    }
    if (insertData) {
        await showTelegramPopUp(message)
        return
    }
    const data = {
        "address": user.value.address.full_address,
        "full_name": user.value.full_name.name,
        "email": user.value.email.name,
        "phone": user.value.phone? user.value.phone.number: null,
        "city": user.value.address.city,
        "cart_items_ids": orderItemsIds.value
    }
    if (totalPrice.value >= 1500) {
        await showTelegramPopUp("Поздравляем! Ваша доставка — бесплатна")
    } else {
        await showTelegramPopUp("Обратите внимание: стоимость доставки оплачивается  Вами при получении заказа")
    }
    const order = await createOrder(data)
    if (order) {
        router.push(`/second-app/order_paid/${order.id}`)
        await store.dispatch("GET_AND_SET_USER_CART_ITEMS_AFTER_PAID")
        await store.dispatch("RESET_SELECTED_ITEMS")
    }
}*/


const calculateTotalPriceAndSetMainButton = () => {
    const uniqueOrderItemsIds = new Set();
    for (let item of orderItems.value) {
        uniqueOrderItemsIds.add(item.id);
        totalPrice.value += item.count * item.food_sup.price;
    }
    orderItemsIds.value = Array.from(uniqueOrderItemsIds);
    mainButtonClickHandler = () => {
        handleClickMainButton();
    }
    setupButton(mainButton, `Оформить`, mainButtonClickHandler)
};





</script>

<template>
    <m-legal-pasport v-if="isInsertLegalPassportVisible" @legalPassport="setLegalPassport"></m-legal-pasport>
    <div class="m-create-order-container">
        <!--<div class="m-create-order-header">
            <div class="m-create-order-header-shipping-information">Информация о доставке</div>
            <div class="m-create-order-header-shipping-information-item">
                <div>АДРЕС</div>
                <div 
                    class="m-create-order-header-shipping-information-item-text"
                    @click="router.push({name: 'UpdateOrderData', params: { dataType: 'address' }})">
                    {{ user.address? user.address.full_address : 'Не указан'}}
                </div>
            </div>
            <div class="m-create-order-header-shipping-information-item">
                <div>ФИО</div>
                <div 
                    class="m-create-order-header-shipping-information-item-text"
                    @click="router.push({name: 'UpdateOrderData', params: { dataType: 'full_name' }})">
                    {{ user.full_name? user.full_name.name : 'Не указано'}}
                </div>
            </div>
            <div class="m-create-order-header-shipping-information-item">
                <div>Номер телефона</div>
                <div 
                    class="m-create-order-header-shipping-information-item-text"
                    @click="router.push({name: 'UpdateOrderData', params: { dataType: 'phone' }})">
                    {{ user.phone? user.phone.number : 'Не указан'}}
                </div>
            </div>
            <div class="m-create-order-header-shipping-information-item">
                <div>Email</div>
                <div 
                    class="m-create-order-header-shipping-information-item-text"
                    @click="router.push({name: 'UpdateOrderData', params: { dataType: 'email' }})">
                    {{ user.email? user.email.name : 'Не указан'}}
                </div>
            </div>
        </div>-->
        <div class="m-create-order-content-title">Содержимое заказа</div>
        <div class="m-create-order-items-container">
            <div 
                class="m-create-order-items-wrapper" 
                v-for="(item, index) in orderItems">
                <div 
                    class="m-create-order-item" 
                    :id="item.food_sup.id"
                    :class="{last_item: index === orderItems.length - 1}" >
                    <div class="m-create-order-item-image-wrapper">
                        <img 
                            v-if="photos[item.food_sup.photo_path]"
                            :src="photos[item.food_sup.photo_path]"
                            class="m-create-order-item-image"/>
                    </div>
                    <div class="m-create-order-item-content-wrapper">
                        <div 
                            class="m-create-order-item-content-name-wrapper"
                            :id="item.id"
                            >
                            <div class="m-create-order-item-content-name">{{ item.food_sup.name }}</div>
                        </div>
                        <div class="m-create-order-item-content-price">
                            {{ item.count }} шт.
                            {{ formatAmount(item.count * item.food_sup.price) }} Руб
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>

.m-create-order-container{
    width: 100%;
    height: 100vh;
    padding: 15px 10px 10px 10px;
    color: black;
}


.m-create-order-header{
    display: flex;
    flex-direction: column;
}


.m-create-order-header-shipping-information, .m-create-order-content-title{
    margin: 11px 0px 8px 0px;
    width: 100%;
    text-align: center;
    font-weight: 700;
}


.m-create-order-header-shipping-information-item, .m-create-order-header-shipping-cost{
    margin: 0px 20px 0px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}


.m-create-order-header-shipping-information-item{
    font-size: 14px;
    margin-bottom: 15px;
}


.m-create-order-header-shipping-cost{
    font-size: 12px;
    padding-bottom: 15px;
}


.m-create-order-header-shipping-information-item-text{
    cursor: pointer;
    width: 65%;
    text-align: right;
}


.m-create-order-items-container{
    width: 100%;
    padding: 0px 20px 10px 0px;
    display: flex;
    flex-direction: column;
    color: black;
    background-color: white;
}


.m-create-order-items-wrapper{
    display: flex;
    flex-direction: column;
    align-items: center;
}


.m-create-order-items-wrapper:first-child{
    margin-top: 20px;
}


.m-create-order-item{
    position: relative;
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


.m-create-order-item-image-wrapper{
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100px;
    width: 100px;
}


.m-create-order-item-image{
    display: block;
    width: 60px;
    height: 60px;
}


.m-create-order-item-content-wrapper{
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


.m-create-order-item-content-name-wrapper{
    width: 100%;
}


.m-create-order-item-content-name{
    margin-right: 4px;
    display: inline-block;
    font-weight: 700;
    font-size: 18px;
}


.m-create-order-item-content-price{
    font-size: 14px;
}


</style>
