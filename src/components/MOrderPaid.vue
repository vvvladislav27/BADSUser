<script setup>
import { onBeforeMount, onBeforeUnmount } from 'vue';
import { getInvoiceLink } from '@/api/yookassa';
import { backButton, showTelegramPopUp } from '@/tg';
import { router } from '@/router';
import { updateOrder } from '@/api/order';

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
            error_callback: function(error) {
            }
        });
        checkout.on('success', async() => {
            await updateOrder(props.id, "paid")
            router.push(`/second-app/orders/${props.id}`)
            checkout.destroy();
        });
        checkout.on('fail', async() => {
            await showTelegramPopUp("Оплата не прошла, попробуйте снова")
        });
        checkout.render('payment-form')
        backButtonClickHandler = () => {
            router.push(`/second-app/orders/${props.id}`);
        }
        backButton.onClick(backButtonClickHandler);
    } else {
        router.push(`/second-app/orders/${props.id}`);
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

