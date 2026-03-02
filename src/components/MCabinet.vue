<script setup>
import { computed, onBeforeMount, onBeforeUnmount, ref, onMounted } from 'vue';
import store from '@/store';
import { router } from '@/router';
import { getByUserId } from '@/api/user';
import { mainButton, secondaryButton, backButton, showTelegramPopUp, hideButton, setupButton, tg, initData } from '@/tg';

const user = computed(() => store.state.user)


let backButtonClickHandler;
let mainButtonClickHandler;

const u = ref();


onBeforeMount(async() => {
    u.value = await getByUserId(user.value.telegram_id);
    backButtonClickHandler = () => {
        router.push("/second-app/")
    }
    backButton.onClick(backButtonClickHandler);
})

onMounted(() => {
    mainButtonClickHandler = () => {
        tg.openTelegramLink("https://t.me/FlaskaTek")
    };
    setupButton(mainButton, "Написать продавцу", mainButtonClickHandler);
    secondaryButton.text = "Удаление профиля"
    backButton.show();
    mainButton.show();
    secondaryButton.show();
})


onBeforeUnmount(() => {
    backButton.offClick(backButtonClickHandler);
    mainButton.offClick(mainButtonClickHandler);
    hideButton(mainButton);
    hideButton(secondaryButton);
})


const navigateToFavoriteFoodSups = async() => {
    if (u.value.count_fav_food_sups == 0) {
        await showTelegramPopUp("Нет избранных товаров")
        return
    }
    router.push('/second-app/food_sups/favorites')
}


const navigateToOrders = async() => {
    if (u.value.count_orders == 0) {
        await showTelegramPopUp("Нет заказов")
        return
    }
    router.push('/second-app/orders')
}



</script>

<template>
    <div class="m-cabinet-container" v-if="u">
        <img
            v-if="!u.photo_url" 
            src="/base-user.png" 
            class="m-cabinet-image"/>
        <img
            v-else
            :src="u.photo_url" 
            class="m-cabinet-image"/>
        <div class="m-cabinet-header">
            <div class="m-cabinet-header-hello">Здравствуйте,
                <p>{{ u.first_name }} !</p>
            </div>
            <div class="m-cabinet-header-bonus">Бонусов · 0</div>
        </div>
        <div class="m-cabinet-body">
            <div @click="navigateToOrders">{{u.count_orders > 0? `Заказов · ${u.count_orders}`: "Нет заказов"}}</div>
            <div @click="navigateToFavoriteFoodSups">{{ u.count_fav_food_sups > 0? `Избранное · ${u.count_fav_food_sups}`: "Нет избранного" }}</div>
        </div>
        <div>{{ initData }}</div>
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
