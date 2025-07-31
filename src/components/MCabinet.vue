<script setup>
import { computed, onBeforeMount, onBeforeUnmount, ref } from 'vue';
import store from '@/store';
import { router } from '@/router';
import { getByUserId } from '@/api/user';
import { mainButton, secondaryButton, backButton, showTelegramPopUp } from '@/tg';

const user = computed(() => store.state.user)


mainButton.text = "Написать продавцу"
secondaryButton.text = "Удаление профиля"

let backButtonClickHandler;

const userData = ref();


const getUser = async() => {
    const data = await getByUserId(user.value.telegram_id);
    userData.value = data;
}


onBeforeMount(async() => {
    await getUser()
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
    if (userData.value.count_fav_food_sups == 0) {
        await showTelegramPopUp("Нет избранных товаров")
        return
    } else {
        router.push('/second-app/food_sups/favorites')
    }
}


const openOrders = async() => {
    if (userData.value.count_orders == 0) {
        await showTelegramPopUp("Нет заказов")
        return
    } else {
        router.push('/second-app/orders')
    }
}



</script>

<template>
    <div class="m-cabinet-container" v-if="userData">
        <img
            v-if="!userData.photo_url" 
            src="/base-user.png" 
            class="m-cabinet-image"/>
        <img
            v-else
            :src="userData.photo_url" 
            class="m-cabinet-image"/>
        <div class="m-cabinet-header">
            <div class="m-cabinet-header-hello">Здравствуйте,
                <p>{{ userData.first_name }} !</p>
            </div>
            <div class="m-cabinet-header-bonus">Бонусов · 0</div>
        </div>
        <div class="m-cabinet-body">
            <div @click="openOrders">{{userData.count_orders > 0? `Заказов · ${userData.count_orders}`: "Нет заказов"}}</div>
            <div @click="openFavoriteFoodSups">{{ userData.count_fav_food_sups > 0? `Избранное · ${userData.count_fav_food_sups}`: "Нет избранного" }}</div>
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
