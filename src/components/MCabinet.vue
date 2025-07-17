<script setup>
import { computed, onMounted, onBeforeUnmount } from 'vue';
import store from '@/store';
import { router } from '@/router';
import { mainButton, secondaryButton, backButton, showTelegramPopUp } from '@/tg';

const user = computed(() => store.state.user)
const favoriteFoodSups = computed(() => store.state.favFoodSups);
const countUserOrders = computed(() => store.state.userCountOrders)


mainButton.text = "Написать продавцу"
secondaryButton.text = "Удаление профиля"

let backButtonClickHandler;


onMounted(async() => {
    await store.dispatch("RESET_SEARCH_FILTERS")
    backButtonClickHandler = () => {
        router.push("/second-app/")
    }
    backButton.onClick(backButtonClickHandler);
    if (!backButton.isVisible) {
        backButton.show();
    }
    mainButton.show();
    secondaryButton.show();
})


onBeforeUnmount(() => {
    backButton.offClick(backButtonClickHandler)
    mainButton.hide();
    secondaryButton.hide();
})


const openFavoriteFoodSups = async() => {
    if (Object.keys(favoriteFoodSups.value).length == 0) {
        await showTelegramPopUp("Нет избранных товаров")
        return
    } else {
        router.push('/second-app/food_sups/favorites')
    }
}


const openOrders = async() => {
    if (countUserOrders.value == 0) {
        await showTelegramPopUp("Нет заказов")
        return
    } else {
        router.push('/second-app/orders')
    }
}



</script>

<template>
    <div class="m-cabinet-container">
        <img
            v-if="!user.photo_url" 
            src="/base-user.png" 
            class="m-cabinet-image"/>
        <img
            v-else
            :src="user.photo_url" 
            class="m-cabinet-image"/>
        <div class="m-cabinet-header">
            <div class="m-cabinet-header-hello">Здравствуйте,
                <p>{{ user.first_name }} !</p>
            </div>
            <div class="m-cabinet-header-bonus">Бонусов · 0</div>
        </div>
        <div class="m-cabinet-body">
            <div @click="openOrders">{{countUserOrders > 0? `Заказов · ${countUserOrders}`: "Нет заказов"}}</div>
            <div @click="openFavoriteFoodSups">
                {{ Object.keys(favoriteFoodSups).length > 0? `Избранное · ${Object.keys(favoriteFoodSups).length}`: "Нет избранного" }}
            </div>
            <div>Нет обращений</div>
        </div>
    </div>


</template>

<style scoped>

.m-cabinet-container{
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-direction: column;
    color: black;
}

.m-cabinet-image{
    margin-top: 20px;
    width: 120px;
    height: 120px;
    border-radius: 4px;
}

.m-cabinet-header{
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 42px;
}

.m-cabinet-header-hello{
    display: flex;
    font-size: 20px;
    margin-top: 14px;
    align-items: center;
    font-weight: 700;
}

.m-cabinet-header-hello p{
    font-size: 24px;
    font-weight: 700;
}

.m-cabinet-header-bonus{
    font-size: 18px;
    margin-top: 14px;
}

.m-cabinet-body{
    margin-top: 0px;
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 24px;
}

.m-cabinet-body div{
    margin-top: 28px;
    cursor: pointer;
}



</style>
