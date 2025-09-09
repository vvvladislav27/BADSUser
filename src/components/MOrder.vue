<script setup>
import { onBeforeUnmount, ref, computed, watch, onBeforeMount } from 'vue';
import { getOrderById, updateOrder } from '@/api/order';
import { formatAmount, formatTime, formatDateForOrder, getOrderStateTextRu, getImage } from '@/utils';
import store from '@/store';
import { router } from '@/router';
import { showTelegramPopUpWithKeyboard, mainButton, backButton, hideButton, setupButton, secondaryButton } from '@/tg';
import { setAnimationForText } from '@/animation';

const photos = computed(() => store.state.foodSupsPhotos);
const order = ref();
const addressPickUpPoint = ref("");

let mainButtonClickHandler;
let backButtonClickHandler;
let secondaryButtonClickHandler;
let secondaryButtonState = "canceled"


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
    mainButton.offClick(mainButtonClickHandler);
    secondaryButton.offClick(secondaryButtonClickHandler);
    hideButton(mainButton);
    hideButton(secondaryButton);
    if (order.value.state == "created") {
        buttonText = `Оплатить - ${formatAmount(order.value.cost)} руб`
        newOrderState = "paid"
        secondaryButtonClickHandler = async() => {
            const result = await showTelegramPopUpWithKeyboard("Хотите отменить заказ?")
            if (result === "confirm") {
                order.value = await updateOrder(order.value.id, secondaryButtonState, addressPickUpPoint.value);
            }
        }
        setupButton(secondaryButton, "Отменить", secondaryButtonClickHandler)
    } else if (order.value.state == "packed") {
        buttonText = "Отменить"
        newOrderState = "canceled"
    } else if (order.value.state == "arrived") {
        buttonText = "Заказ получен"
        newOrderState = "received"
    } else if (order.value.state == "received") {
        buttonText = "Завершить"
        newOrderState = "finished"
    }
    mainButton.text = buttonText;
    mainButtonClickHandler = async() => {
        if (newOrderState === "canceled") {
            const result = await showTelegramPopUpWithKeyboard("Хотите отменить заказ?")
            if (result === "confirm") {
                order.value = await updateOrder(order.value.id, newOrderState, addressPickUpPoint.value);
            }
            return
        } else if (newOrderState == "paid") {
            router.push(`/second-app/order_paid/${order.value.id}`)
        } else {
            order.value = await updateOrder(order.value.id, newOrderState, addressPickUpPoint.value);
        }
    };
    if (
        order.value.state == "created" || 
        order.value.state == "packed" || 
        order.value.state == "arrived" || 
        order.value.state == "received"
    ) {
        mainButton.onClick(mainButtonClickHandler);
        mainButton.show();
    }
}



onBeforeMount(async() => {
    order.value = await getOrderById(props.id);
    addressPickUpPoint.value = order.value.address_pick_up_point;
    setTgButtons(order.value.state);
    backButtonClickHandler = () => {
        router.push("/second-app/orders");
    };
    backButton.onClick(backButtonClickHandler);
    for (let item of order.value.items) {
        await getImage(item.food_sup.photo_path)
    }
    setAnimationForText('.m-order-item-content-name-wrapper');
})




onBeforeUnmount(() => {
    backButton.offClick(backButtonClickHandler);
    mainButton.offClick(mainButtonClickHandler);
    secondaryButton.offClick(secondaryButtonClickHandler);
    hideButton(secondaryButton);
    hideButton(mainButton);
});



</script>

<template>
    <div class="m-order-container" v-if="order">
        <div class="m-order-data-title">Информация о заказе</div>
        <div class="m-order-wrapper">
            <div class="m-order-data-wrapper">
                <div>Номер заказа</div>
                <div class="m-order-data-content"> {{ order.id }} </div>
            </div>
            <div class="m-order-data-wrapper">
                <div>Статус</div>
                <div class="m-order-data-content"> {{ getOrderStateTextRu(order.state) }} </div>
            </div>
            <div class="m-order-data-wrapper">
                <div>Дата создания</div>
                <div class="m-order-data-content"> {{ formatDateForOrder(order.created_at) }} </div>
            </div>
            <div class="m-order-data-wrapper">
                <div>Время создания</div>
                <div class="m-order-data-content"> {{ formatTime(order.created_at) }} </div>
            </div>
            <div class="m-order-data-title" style="margin-top: 0;">Информация о получателе</div>
            <div class="m-order-data-wrapper">
                <div>АДРЕС</div>
                <div class="m-order-data-content">{{ order.delivery_address }}</div>
            </div>
            <div class="m-order-data-wrapper" v-if="addressPickUpPoint">
                <div>Адрес пункта выдачи CDEK</div>
                <div 
                    class="m-order-data-content">
                    {{ addressPickUpPoint }}
                </div>
            </div>
            <div class="m-order-data-wrapper">
                <div>Получатель</div>
                <div class="m-order-data-content">{{ order.full_name? order.full_name: "Не указан"}} </div>
            </div>
            <div class="m-order-data-wrapper">
                <div>Номер телефона</div>
                <div class="m-order-data-content">{{ order.phone? order.phone: "Не указан"}}</div>
            </div>
            <div class="m-order-data-wrapper">
                <div>Email</div>
                <div class="m-order-data-content"> {{order.email? order.email: "Не указан" }}  </div>
            </div>
            <div class="m-order-data-title">Содержимое заказа</div>
            <div class="m-order-container">
                <div class="m-order-type-name">БАД</div>
                <div class="m-order-items-wrapper"
                    v-for="(item, index) in order.items">
                    <div 
                        class="m-order-item" 
                        :id="item.food_sup.id"
                        :class="{last_item: index === order.items.length - 1}">
                        <div class="m-order-item-image-wrapper">
                            <img 
                                v-if="photos[item.food_sup.photo_path]"
                                :src="photos[item.food_sup.photo_path]"
                                class="m-order-item-image"/>
                        </div>
                        <div class="m-order-item-content-wrapper">
                            <div 
                                class="m-order-item-content-name-wrapper"
                                :id="item.id">
                                <div class="m-order-item-content-name">{{ item.food_sup.name }} {{ item.food_sup.barcode }}</div>
                            </div>
                            <div class="m-order-item-content-price">
                                {{ item.count }} шт.
                                {{ formatAmount(item.count * item.food_sup.price) }} Руб
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>


.m-order-container{
    color: black;
}

.m-order-data-title{
    margin: 15px 0px;
    text-align: center;
    font-weight: 700;
}

.m-order-wrapper{
    padding: 0px 20px;
}


.m-order-data-wrapper{
    font-size: 14px;
    margin-bottom: 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.m-order-data-content{
    text-align: right;
}


.m-order-type-name{
    font-weight: 700;
}

.m-order-items-wrapper{
    display: flex;
    flex-direction: column;
    align-items: center;
}


.m-order-items-wrapper:first-child{
    margin-top: 20px;
}

.m-order-item{
    margin-top: 10px;
    height: 100px;
    width: 100%;
    display: flex;
    align-items: center;
    border-bottom: 1px solid black;
    cursor: pointer;
}


.last_item{
    border-bottom: none;
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

.m-order-item-content-name{
    margin-right: 4px;
    display: inline-block;
    font-weight: 700;
    font-size: 18px;
}

.m-order-item-content-price{
    font-size: 14px;
}





</style>
