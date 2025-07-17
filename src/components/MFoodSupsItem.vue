<script setup>

import { ref, onMounted, computed, onBeforeMount } from 'vue';
import { formatAmount, vibrate, getReviewText, getQuantityText, getImage } from '@/utils';
import store from '@/store';
import { router } from '@/router';
import { showTelegramPopUpWithKeyboard } from '@/tg';
import { setAnimationForText } from '@/animation';



const favoriteFoodSups = computed(() => store.state.favFoodSups);
const cartFoodSups = computed(() => store.state.userCartItems);
const photos = computed(() => store.state.foodSupsPhotos);

const isCartActive = ref(false);




const props = defineProps({
    foodSup: {
        type: Object,
        require: true
    }
});


onBeforeMount(async() => {
    await getImage(props.foodSup.photo_path)
    setAnimationForText(".m-food-sups-item-data-name-wrapper")
})






const increment = async(id) => {
    vibrate();
    await store.dispatch("INCREMENT_CART_ITEM", id);
};


const decrement = async(id) => {
    const item = cartFoodSups.value[id]
    if (item.count != 1) {
        vibrate();
    };
    if (item.count == 1) {
        const result = await showTelegramPopUpWithKeyboard("Удалить товар из корзины?")
        if (result == "confirm"){
            toggleCartActive();
            await store.dispatch("DECREMENT_CART_ITEM", id);
        }
    }
    else {
        await store.dispatch("DECREMENT_CART_ITEM", id);
    };
};

const toggleCartActive = () => {
    isCartActive.value = !isCartActive.value;
};



const isFavoriteFoodSup = (id) => {
  return favoriteFoodSups.value[id];
};


const isItemInCart = (id) => {
    return cartFoodSups.value[id];
};


const toggleFavoriteFoodSup = async(id) => {
    vibrate();
    store.dispatch("TOGGLE_FAV_FOOD_SUP", id)
};


const navigateToFoodSup = (id) => {
    router.push(`/second-app/food_sups/${id}`)
}



</script>

<template>
    <div 
        class="m-food-sups-item-container" 
        @click.stop="navigateToFoodSup(foodSup.id)">
        <div class="m-food-sups-item-wrapper">
            <img 
                v-if="photos[foodSup.photo_path]"
                :src="photos[foodSup.photo_path]" 
                class="m-food-sups-item-image"/>
            <div 
                class="m-food-sups-item-button-favorite"
                @click.stop="toggleFavoriteFoodSup(foodSup.id)">
                    <img 
                        v-if="isFavoriteFoodSup(foodSup.id)"
                        src='/heart3.png'
                        alt="Heart icon"/>
                    <img
                        v-else
                        src="/heart.png"
                        alt="Heart icon"/>
            </div>
            <div class="m-food-sups-item-pagination">
                <img 
                    src="/cart1.png" 
                    class="m-food-sups-item-pagination-img" 
                    v-if="!isItemInCart(foodSup.id)"
                    @click.stop="increment(foodSup.id)"
                >
                <div :class="['m-food-sups-item-pagination-btns', {pagination_active: isCartActive }]">
                    <button 
                        v-if="isCartActive"
                        @click.stop="decrement(foodSup.id)">
                        -
                    </button>
                    <button 
                        @click.stop="toggleCartActive"
                        v-if="isItemInCart(foodSup.id)"
                        >
                            {{ cartFoodSups[foodSup.id].count }}
                    </button>
                    <button 
                        v-if="isCartActive" 
                        @click.stop="increment(foodSup.id)">
                        +
                    </button>
                </div>
            </div>
        </div>
        <div class="m-food-sups-item-data-wrapper">
            <div class="m-food-sups-item-data-name-wrapper" :id="foodSup.id">
                <div class="m-food-sups-item-data-name">{{ foodSup.name }}</div>
            </div>
            <div class="m-food-sups-item-data-count">{{ getQuantityText(foodSup) }}</div>
            <div class="m-food-sups-item-data-raiting">{{ getReviewText(foodSup) }}</div>
        </div>
        <div class="m-food-sups-item-data-price">{{ formatAmount(foodSup.price) }} ₽</div>
    </div>
</template>



<style scoped>


.m-food-sups-item-container {
    margin: 14px 9px 0px 9px;
    width: 144px;
    border-radius: 4px;
    box-shadow: 4px 4px 7px rgba(0, 0, 0, 0.5);
    position: relative;
    display: flex;
    flex-direction: column;
    color: black;
    cursor: pointer;
    border: 2px solid black;
    overflow: hidden;
}


.m-food-sups-item-wrapper{
    width: 142px;
    height: 120px;
    position: relative;
}


.m-food-sups-item-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    cursor: pointer;
}


.m-food-sups-item-button-favorite, .m-food-sups-item-pagination{
    position: absolute;
    border: none;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: transparent;
    height: 35px;
    top: 0px;
}


.m-food-sups-item-button-favorite{
    width: 35px;
    border-radius: 0px 4px 4px 4px;
    left: 0px;
}

.m-food-sups-item-pagination{
    border-radius: 4px;
    right: 0px;
    font-size: 18px;
}


.m-food-sups-item-pagination-img{
    padding: 5px;
}


.m-food-sups-item-pagination-btns{
    display: flex;
    height: 35px;
    text-align: center;
}

.m-food-sups-item-pagination-btns button{
    width: 35px;
    border-radius: 4px;
    border: none;
    cursor: pointer;
    font-size: 15px;
    color: #013b45;
    font-weight: 500;
    border-radius: 4px 0px 4px 4px;
    padding: 0px;
    margin: 0px;
    border-bottom: 2px solid #013b45;
    border-left: 2px solid #013b45;
}

.pagination_active button{
    border-radius: 0px 0px 0px 0px;
    border-bottom: 2px solid #013b45;
    border-right: 2px solid #013b45;
    border-left: 2px solid #013b45;
}

.pagination_active button:first-child{
    background-color: white;
    border-right: 0px;
    border-bottom-left-radius: 4px;
}

.pagination_active button:last-child{
    background-color: white;
    border-left: 0px;
}

.m-food-sup-card-pagination-btns-item{
    background-color: #c4dfe6;
}


.m-food-sups-item-data-wrapper{
    display: flex;
    flex-direction: column;
    width: 100%;
    margin-left: 4px;
    line-height: 1.3;
    white-space: nowrap;
    overflow: hidden;
    position: relative;
}

.m-food-sups-item-data-name-wrapper{
    width: 100%;
}

.m-food-sups-item-data-name{
    margin-right: 4px;
    display: inline-block;
    font-size: 20px;
    font-weight: 700;
}


.m-food-sups-item-data-count .m-food-sups-item-data-raiting{
    font-size: 14px;
    margin-bottom: 8px;
}


.m-food-sups-item-data-price{
    display: flex;
    align-items: center;
    margin-left: auto;
    font-size: 18px;
    font-weight: 700;
    padding-right: 4px;
}


</style>