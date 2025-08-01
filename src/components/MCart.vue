<script setup>
import store from '@/store';
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { formatAmount } from '@/utils';
import { router, lastRoute } from '@/router';
import { vibrate, getImage } from '@/utils';
import { showTelegramPopUp, showTelegramPopUpWithKeyboard, mainButton, secondaryButton, backButton } from '@/tg';
import { setAnimationForText } from '@/animation';

const photos = computed(() => store.state.foodSupsPhotos);
const cartFoodSups = computed(() => store.state.userCartItems);
const orderFoodSups = computed(() => store.state.userOrderItems)

const text = ref("Выбрать все")
secondaryButton.text = "Очистить корзину"

let mainButtonClickHandler;
let secondaryButtonClickHandler;
let backButtonClickHandler;



const initButtons = () => {
    if (!backButton.isVisible) {
        backButton.show();
    }
    backButtonClickHandler = function() {
        if (lastRoute.name == "FoodSups" || !lastRoute.name || lastRoute.name == "CreateOrder") {
            router.push('/second-app/');
        } else {
            router.push(lastRoute.path)
        }
    };
    backButton.onClick(backButtonClickHandler);
    const text = getTextForMainButton();
    mainButton.text = text;
    mainButton.show();
    mainButtonClickHandler = function() {
        createOrder();
    };
    mainButton.onClick(mainButtonClickHandler);
    secondaryButtonClickHandler = function() {
        clearCartItems();
    };
    secondaryButton.onClick(secondaryButtonClickHandler);
    secondaryButton.show();
}


const getTextForMainButton = () => {
    const orderItems = orderFoodSups.value;
    const itemCount = Object.keys(orderItems).length;
    if (itemCount > 0) {
        const totalPrice = Object.values(orderItems).reduce((acc, value) => {
            return acc + value.food_sup.price * value.count;
        }, 0);
        return `Оформить - ${itemCount} (${formatAmount(totalPrice)}) руб`;
    } else {
        return "Оформить";
    }
}


onMounted(async() => {
    for (let item of Object.values(cartFoodSups.value) ) {
        await getImage(item.food_sup.photo_path)
    }
    initButtons();
    updateText();
    setAnimationForText('.m-cart-item-text-wrapper');
});


const updateText = () => {
    const userOrderKeys = Object.keys(orderFoodSups.value);
    const cartFoodKeys = Object.keys(cartFoodSups.value);
    text.value = (userOrderKeys.length === cartFoodKeys.length) ? "Отменить все" : "Выбрать все";
}


onUnmounted(() => {
    backButton.offClick(backButtonClickHandler);
    mainButton.offClick(mainButtonClickHandler);
    secondaryButton.offClick(secondaryButtonClickHandler);
    if (secondaryButton.isVisible) {
        secondaryButton.hide()
    }
})


const createOrder = async() => {
    if (Object.keys(orderFoodSups.value).length == 0) {
        await showTelegramPopUp("Выберите товар для оплаты")
        return
    } else {
        router.push("/second-app/create_order")
    }

}


const clearCartItems = async() => {
    const result = await showTelegramPopUpWithKeyboard(`Очистить содержимое корзины?`)
    if (result == "confirm") {
        store.dispatch("CLEAR_CART_ITEMS");
        router.push('/second-app/');
    }
};



const decrement = async(item) => {
    vibrate();
    const isOrderItem = orderFoodSups.value[item.food_sup.id];
    if (item.count == 1) {
        const result = await showTelegramPopUpWithKeyboard(`Удалить товар из корзины?`)
        if (result == "confirm"){
            await store.dispatch("DECREMENT_CART_ITEM", item.food_sup.id);
                if (isOrderItem) {
                    store.dispatch("REMOVE_ITEM_FROM_ORDER", item.food_sup.id);
                }
        }
    } else {
        if (isOrderItem) {
            await store.dispatch("UPDATE_ORDER_ITEM", isOrderItem)
        }
        await store.dispatch("DECREMENT_CART_ITEM", item.food_sup.id);
    }
    if (Object.keys(cartFoodSups.value).length == 0) {
        router.push("/second-app/")
    }
};


const increment = async(item) => {
    vibrate();
    await store.dispatch("INCREMENT_CART_ITEM", item.food_sup.id)
    const isOrderItem = orderFoodSups.value[item.id]
    if (isOrderItem) {
        await store.dispatch("UPDATE_ORDER_ITEM", isOrderItem)
    }
}



const toggleItems = async() => {
    const isSelectingAll = text.value === "Выбрать все";
    const items = isSelectingAll ? { ...cartFoodSups.value } : null;
    if (isSelectingAll) {
        await store.dispatch("ADD_ITEMS_TO_ORDER", items);
    } else {
        await store.dispatch("REMOVE_ITEMS_FROM_ORDER");
    }
    text.value = isSelectingAll ? "Отменить все" : "Выбрать все";
}


const toggleItem = (item) => {
    const itemExists = orderFoodSups.value[item.food_sup.id] !== undefined;
    if (!itemExists) {
         vibrate();
         store.dispatch("ADD_ITEM_TO_ORDER", item)
    } else {
        store.dispatch("REMOVE_ITEM_FROM_ORDER", item.food_sup.id)
    }
};


const isOrdered = (item) => {
    return orderFoodSups.value[item.food_sup.id] !== undefined;
}


watch(orderFoodSups, () => {
    if (mainButton.isVisible) {
        mainButton.hide();
    }
    const newText = getTextForMainButton()
    updateText();
    mainButton.text = newText
    mainButton.show();
},  {deep: true});



</script>

<template>
    <div 
        class="m-cart-text"
        @click="toggleItems">
        {{ text }}
    </div>
    <div class="m-cart-wrapper">
        <div 
            class="m-cart-item"
            @click="toggleItem(item)"
            v-for="item in Object.values(cartFoodSups)"
            :key="item.id"
            >
            <div 
                class="m-cart-item-image-wrapper"
                :class="{ selected: isOrdered(item)}"
                >
                <div 
                    class="m-cart-item-overlay" 
                    :class="{ selected: isOrdered(item)}">
                </div>
                <img 
                    v-if="photos[item.food_sup.photo_path]"
                    :src="photos[item.food_sup.photo_path]" 
                    class="m-cart-item-image"
                    :class="{ selected: isOrdered(item)}"
                />
            </div>
            <div class="m-cart-item-text">
                <div 
                    class="m-cart-item-text-wrapper" 
                    :id="item.id"
                    >
                    <div class="m-cart-item-text-name">{{ item.food_sup.name }}</div>
                </div>
                <div class="m-cart-item-text-quantity">{{ item.food_sup.package_item_count }} шт. в упаковке</div>
            </div>
            <div class="m-cart-item-info-wrapper">
                <div class="m-cart-info-quantity-wrapper">
                    <button 
                        class="m-cart-info-quantity-pagination"
                        @click.stop="decrement(item)"
                        >-
                    </button>
                    <div>{{ item.count }}</div>
                    <button 
                        class="m-cart-info-quantity-pagination"
                        @click.stop="increment(item)"
                        >+
                    </button>
                </div>
                <div class="m-cart-info-price">{{  formatAmount(item.food_sup.price * item.count) }} руб</div>
            </div>
        </div>
    </div>
</template>

<style scoped>


.m-cart-wrapper{
    display: flex;
    flex-direction: column;
    align-items: center;
}


.m-cart-item{
    width: 340px;
    height: 60px;
    display: flex;
    align-items: center;
    margin-bottom: 15px;
    cursor: pointer;
    box-sizing: border-box;
    border: 1px solid transparent;
}


.m-cart-text{
    display: inline-block;
    color: black;
    font-size: 14px;
    font-weight: 700;
    margin: 22px 0px 22px 18px;
    cursor: pointer;
}


.m-cart-item-image-wrapper{
    display: flex;
    align-items: center;
    justify-content: center;
    width: 60px;
    height: 60px;
    position: relative;
}


.m-cart-item-image{
    width: 54px;
    height: 54px;
    border: 2px solid black;
    border-radius: 2px;
}


.m-cart-item-overlay{
    position: absolute;
    top: 50%;
    left: 50%;
    width: 54px;
    height: 54px;
    background-color: rgba(196, 223, 230, 0.7);
    opacity: 0;
    transform: translate(-50%, -50%);
}


.m-cart-item-image-wrapper.selected .m-cart-item-overlay {
    border-radius: 1px;
    opacity: 1;
}


.m-cart-item-image.selected{
    border: 2px solid #013b45;
}

.m-cart-item-text{
    height: 60px;
    width: 180px;
    padding: 0px 4px 0px 0px;
    margin-left: 6px;
    color: black;
    white-space: nowrap;
    overflow: hidden;
}


.m-cart-item-text-wrapper{
    width: 100%;
}

.m-cart-item-text-name, .m-cart-item-text-quantity{
    display: flex;
    align-items: center;
    height: 50%;
    width: 150px;
}


.m-cart-item-text-name{
    font-size: 20px;
    font-weight: 700;
}


.m-cart-item-text-quantity{
    font-size: 14px;
}

.m-cart-item-info-wrapper{
    height: 60px;
    width: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    font-size: 14px;
    color: black;
}

.m-cart-info-quantity-wrapper{
    height: 50%;
    display: flex;
    align-items: center;
}

.m-cart-info-quantity-pagination{
    width: 22px;
    height: 22px;
    background-color: #c4dfe6;
    font-size: 8px;
    border: 3px solid #013b45;
    border-radius: 2px;
    margin: 0px 4px;
    color: #013b45;
}


.m-cart-info-price{
    display: flex;
    align-items: center;
    height: 50%;
    font-weight: 700;
}
</style>
