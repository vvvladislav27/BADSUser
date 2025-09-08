<script setup>
import { onBeforeMount, onBeforeUnmount } from 'vue';
import { getInvoiceLink } from '@/api/yookassa';
import { backButton } from '@/tg';
import { router } from '@/router';

let backButtonClickHandler;


const props = defineProps({
    id: {
        type: String,
        required: true
    }
})


onBeforeMount(async() => {
    const payment = await getInvoiceLink(props.id)
    if (payment){
        const checkout = new window.YooMoneyCheckoutWidget({
            confirmation_token: payment.confirmation.confirmation_token,
            return_url: 'https://example.com',
            error_callback: function(error) {
            }
        });
        checkout.render('payment-form')
        backButtonClickHandler = () => {
            router.back();
        }
        backButton.onClick(backButtonClickHandler);
    } else {
        router.back();
    }
})


onBeforeUnmount(() => {
    backButton.offClick(backButtonClickHandler);
})



</script>

<template>
    <div id="payment-form"></div>
</template>



<style scoped>
</style>

