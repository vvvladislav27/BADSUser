<script setup>
import { ref, onBeforeMount, onUnmounted, computed, watch } from 'vue';
import store from '@/store';
import { getImage, getPackageItemCountText, getStockItemCountText, vibrate, formatAmount, formatDate } from '@/utils';
import { getFoodSupById } from '@/api/food_sup';
import { router, lastRoute } from '@/router';
import { getReviews } from '@/api/reviews';
import MReview from './MReview.vue';
import { showTelegramPopUpWithKeyboard, mainButton, secondaryButton, backButton, copyTextAndShowPopUp, hideButton, setupButton } from '@/tg';
import { setAnimationForText } from '@/animation';

const cartFoodSups = computed(() => store.state.userCartItems);
const favFoodSups = computed(() => store.state.favFoodSups);
const photos = computed(() => store.state.foodSupsPhotos);
const foodSup = ref();
const reviews = ref([]);
const page = ref(1);

const hasMoreReviews = ref();

let mainButtonClickHandler;
let secondaryButtonClickHandler;
let backButtonClickHandler;


const props = defineProps({
    id: {
        type: String,
        required: true
    }
})


const removeCartItem = async(id) => {
    const result = await showTelegramPopUpWithKeyboard(`Удалить из корзины?`)
    if (result == "confirm"){
        await store.dispatch("REMOVE_CART_ITEM", id);
    }
};


watch(cartFoodSups, () => {
    setTgButtons()
},  {deep: true});


const setTgButtons = () => {
    mainButton.offClick(mainButtonClickHandler)
    hideButton(mainButton);
    if (secondaryButton.isVisible) {
        secondaryButton.offClick(secondaryButtonClickHandler);
        hideButton(secondaryButton)
    }
    const item = cartFoodSups.value[props.id];
    if (item) {
        mainButtonClickHandler = () => {
            router.push("/second-app/cart")
        }
        setupButton(mainButton, `В корзине - ${item.count}`, mainButtonClickHandler)
        secondaryButtonClickHandler = async() => {
            await removeCartItem(props.id)
        }
        setupButton(secondaryButton, "Удалить из корзины", secondaryButtonClickHandler)
        return
    } else {
        mainButtonClickHandler = async() => {
            await store.dispatch("INCREMENT_CART_ITEM", props.id);
        }
        setupButton(mainButton, `Добавить в корзину`, mainButtonClickHandler)
    }
}



onBeforeMount(async() => {
    const [food_sup, list_reviews] = await Promise.all([
        getFoodSupById(props.id),
        getReviews(props.id, page.value)
    ])
    foodSup.value = food_sup
    reviews.value = list_reviews
    if (reviews.value.length == 10) {
        hasMoreReviews.value = true;
    };
    await getImage(foodSup.value.photo_path);
    setAnimationForText('.m-food-sup-name-wrapper');
    setTgButtons();
    backButtonClickHandler = () => {
        if (lastRoute.name == "Cart") {
            if (router.currentRoute.value.name == "FavoriteFoodSup") {
                router.push("/second-app/food_sups/favorites")
            } else {
                router.push("/second-app/")
            }
        } else {
            router.back();
        }
    }
    backButton.onClick(backButtonClickHandler)
    if (!backButton.isVisible) {
        backButton.show();
    }
})



onUnmounted(() => {
    mainButton.offClick(mainButtonClickHandler);
    mainButton.hide();
    secondaryButton.offClick(secondaryButtonClickHandler);
    if (secondaryButton.isVisible){
        secondaryButton.hide();
    }
    backButton.offClick(backButtonClickHandler);
})




const isFavoriteFoodSup = (id) => {
  return favFoodSups.value[id];
};


const toggleFavoriteFoodSup = async(id) => {
    vibrate();
    await store.dispatch("TOGGLE_FAV_FOOD_SUP", id)
};



const showMoreReview = async() => {
    page.value ++ 
    const moreReviews = await getReviews(props.id, page.value)
    if (moreReviews.length < 10) {
        hasMoreReviews.value = false;
    } else {
        reviews.value.push(...moreReviews);
    }
}


</script>

<template>
    <div class="m-food-sup-container" v-if="foodSup">
        <div class="m-food-sup-image-container">
            <img 
                v-if="photos[foodSup.photo_path]"
                :src="photos[foodSup.photo_path]"
                class="m-user-food-sup-photo">
                <div class="m-user-food-sup-text-header">Не является лекарственным средством</div>
                <div class="m-user-food-sup-text-bottom">Данные о сертификации товара</div>
                <div 
                    class="m-user-food-sup-img-favorite-container"
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
        </div>
        <div class="m-user-food-sup-wrapper">
            <div class="m-user-food-sup-info-wrapper">
                <div class="m-user-food-sup-info">
                    <div class="m-food-sup-name-wrapper">
                        <div 
                            class="m-user-food-sup-info-name"
                            @click="copyTextAndShowPopUp(foodSup.name)">
                            {{ foodSup.name }}
                        </div>
                    </div>
                    <div class="m-user-food-sup-info-package-item-count">{{ getPackageItemCountText(foodSup) }}</div>
                </div>
                <div class="m-user-food-sup-info">
                    <div class="m-user-food-sup-info-price">{{ formatAmount(foodSup.price) }} Руб</div>
                    <div class="m-user-food-sup-info-box-item-count">{{ getStockItemCountText(foodSup) }} </div>
                </div>
            </div>
            <div 
                class="m-user-food-sup-barcode"
                @click="copyTextAndShowPopUp(foodSup.barcode)"
                >
                Артикул: {{ foodSup.barcode }}
            </div>
            <div class="m-user-food-sup-valid_until-wrapper">
                <div>Годен до: {{ formatDate(foodSup.valid_until) }}</div>
                <div>Срок годности: {{ foodSup.shelf_life }} года</div>
            </div>
            <div class="m-user-food-sup-box-item-count">{{ foodSup.box_item_count }} шт. в ящике</div>
            <div class="m-user-food-sup-description-wrapper">
                <div class="m-user-food-sup-description-active-substance">Действующее вещество:  {{ foodSup.active_substance }}</div>
                <div class="m-user-food-sup-description">{{ foodSup.description }}</div>
                <m-review :reviews="reviews"></m-review>
                <div 
                    v-if="hasMoreReviews"
                    @click="showMoreReview"
                    class="m-user-food-sup-review-more">
                    Показать еще
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>

.m-food-sup-container{
    height: 100vh;
    width: 100%;
    display: flex;
    flex-direction: column;
    color: black;
}



.m-food-sup-image-container {
    position: relative;
    display: inline-block;
}

.m-user-food-sup-photo {
    display: block;
    width: 100%;
    height: 300px;
}

.m-user-food-sup-text-header, .m-user-food-sup-text-bottom{
    color: black;
    font-size: 14px;
    right: 0;
    position: absolute;
}

.m-user-food-sup-text-header {
    padding: 10px 10px 0px 0px;
    top: 0;
}

.m-user-food-sup-text-bottom{
    padding: 0px 10px 10px 0px;
    bottom: 0;
}

.m-user-food-sup-img-favorite-container{
    position: absolute;
    bottom: 0;
    left: 0;
    padding: 10px 0px 0px 10px;
}

.m-user-food-sup-img-favorite-container img{
    width: 36px;
    height: 36px;
}

.m-user-food-sup-wrapper{
    padding: 10px 10px 0px 10px;
}

.m-user-food-sup-info-wrapper{
    width: 100%;
    height: 50px;
    display: flex;
    margin-bottom: 10px;
}

.m-user-food-sup-info{
    display: flex;
    flex-direction: column;
    justify-content: center;
    line-height: 1.3;
    white-space: nowrap;
    overflow: hidden;
    position: relative;
}

.m-user-food-sup-info:first-child{
    width: 65%;
}

.m-user-food-sup-info:last-child{
    width: 35%;
}



.m-food-sup-name-wrapper{
    width: 100%;
}

.m-user-food-sup-info-name{
    display: inline-block;
    cursor: pointer;
}

.m-user-food-sup-info-name, .m-user-food-sup-info-price{
    font-size: 20px;
    height: 30px;
    overflow: hidden;
    font-weight: 700;
}

.m-user-food-sup-info-package-item-count, .m-user-food-sup-info-box-item-count{
    font-size: 14px;
}

.m-user-food-sup-info-box-item-count, .m-user-food-sup-info-price{
    text-align: right;
}

.m-user-food-sup-barcode{
    height: 30px;
    display: flex;
    align-items: center;
    font-size: 20px;
    font-weight: 700;
    margin-bottom: 10px;
}

.m-user-food-sup-valid_until-wrapper{
    display: flex;
    flex-direction: column;
    height: 40px;
    justify-content: center;
    font-size: 14px;
    margin-bottom: 10px;
}


.m-user-food-sup-box-item-count{
    height: 20px;
    display: flex;
    align-items: center;
    font-size: 14px;
    font-weight: 700;
    margin-bottom: 10px;
}

.m-user-food-sup-description-wrapper{
    margin: 6px 0px
}

.m-user-food-sup-description-active-substance{
    margin-bottom: 10px;
}


.m-user-food-sup-description{
    margin-bottom: 20px;
}

.m-user-food-sup-review-more{
    margin: 17px 0px;
    text-align: center;
    font-size: 16px;
}

</style>


