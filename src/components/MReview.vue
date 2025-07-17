<script setup>
import { formatDate } from '@/utils';
import { showTelegramPopUp } from '@/tg';


const props = defineProps({
    reviews: {
        type: Array,
        required: false
    }
})


const maxStars = 5;

const isTextTruncated = (element) => {
    return element.scrollWidth > element.clientWidth;
};

const showAllText = async(text, event) => {
    const target = event.target;
    if (isTextTruncated(target)) {
        await showTelegramPopUp(text)
    }
};


</script>

<template>
    <div v-for="(review, index) in reviews" :key="review.id">
        <div class="m-review-wrapper">
            <div>
                <img
                    v-if="!review.user.photo_url" 
                    src="/base-user.png" 
                    class="m-user-image"/>
                <img
                    v-else
                    :src="review.user.photo_url" 
                    class="m-user-image"/>
            </div>
            <div class="m-review-data">
                <div class="m-review-data-title-wrapper">
                    <div>{{ review.user.first_name }}</div>
                    <div>{{ formatDate(review.created_at) }}</div>
                </div>
                <div>
                    <span v-for="star in maxStars" :key="star" class="star" :class="{ filled: star <= review.mark }">★</span>
                </div>
                <div 
                    class="m-review-data-text"
                    v-if="review.text"
                    @click="showAllText(review.text, $event)">
                    {{ review.text }}
                </div>
                <div 
                    v-if="reviews.length > 1 && index < reviews.length - 1" 
                    class="m-order-item-bottom-border">
                </div>
            </div>
        </div>
    </div>
</template>



<style scoped>



.m-review-wrapper{
    display: flex;
    align-items: center;
    margin: 10px 0px;
}


.m-user-image{
    width: 60px;
    height: 60px;
    border-radius: 4px;
}

.m-review-data{
    height: 100%;
    width: 100%;
    margin-left: 30px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    overflow: hidden;
    text-overflow: ellipsis; 
    white-space: nowrap;
}


.m-review-data-title-wrapper{
    display: flex;
    justify-content: space-between;
}


.star {
    font-size: 20px;
    color: #ccc;
}

.star.filled {
    color: gold;
}


.m-order-item-bottom-border{
    border-bottom: 1px solid black;
    margin-top: 10px;
}

.m-client-review-data-text{
    overflow: hidden;
    text-overflow: ellipsis; 
    white-space: nowrap;
}


</style>