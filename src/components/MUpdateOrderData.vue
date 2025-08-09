<script setup>
import { computed, ref, onBeforeMount, onBeforeUnmount } from 'vue';
import store from '@/store';
import { router } from '@/router';
import { getFullAddress } from '@/api/user';
import { useTelInput } from 'vue3-headless-tel-input';
import { showTelegramPopUp, showTelegramPopUpWithKeyboard, mainButton, backButton } from '@/tg';

const user = computed(() => store.state.user);
const inputData = ref();
const inputText = ref("")


let backButtonClickHandler;
let mainButtonClickHandler;


const props = defineProps({
    dataType: {
        type: String,
        required: true
    }
})


const { inputRef } = useTelInput(inputData)


const items = computed(() => {
    if (props.dataType == "addresses") {
        inputText.value = "Введите адрес"
        return user.value.addresses
    } else if (props.dataType == "full_names") {
        inputText.value = "Введите ФИО"
        return user.value.full_names 
    } else if (props.dataType == "phones") {
        inputText.value = "Введите номер телефона"
        return user.value.phones
    } else {
        inputText.value = "Введите email"
        return user.value.emails
    }
})


const isCreateOrderDataInputVisible = ref(items.value.length == 0 ? true: false)




const insertNewData = async() => {
    if (!isCreateOrderDataInputVisible.value) {
        isCreateOrderDataInputVisible.value = true;
        return
    };
    if (props.dataType === 'phones') {
        const number = inputRef.value.value.replace(/[\s_]+/g, '').trim(); 
        inputData.value = '+7' + number;
        if (inputData.value.length < 12) {
            inputText.value = "Введите корректный номер телефона"
            inputData.value = null
        }
    }
    if (props.dataType === "emails") {
        const email = inputData.value.trim();
        const emailRegex = /^[^s@]+@[^s@]+.[^s@]+$/;
        if (!emailRegex.test(email)) {
            inputText.value = "Введите корректный email";
            inputData.value = null;
        }
    }
    if (!inputData.value) {
        await showTelegramPopUp(inputText.value)
        return
    } else {
        updateUserOrderData(inputData.value);
    }
}

const removeDataFromList = async(data) => {
    let message;
    if (props.dataType == 'addresses') {
        message = "Удалить адрес?"
    } else if (props.dataType == "full_names") {
        message = "Удалить ФИО?"
    } else if (props.dataType == "phones") {
        message = "Удалить телефон?"
    } else {
        message = "Удалить email?"
    }
    const result = await showTelegramPopUpWithKeyboard(message)
    if (result == "confirm") {
        await store.dispatch("UPDATE_USER", {"data": data, "field": props.dataType, "action": "remove"})
    }
}


onBeforeMount(async() => {
    backButtonClickHandler = () => {
        router.push("/second-app/create_order");
    }
    backButton.onClick(backButtonClickHandler);
    mainButton.text = "Добавить";
    mainButtonClickHandler = () => {
        insertNewData();
    };
    mainButton.onClick(mainButtonClickHandler);
    mainButton.show();
})


onBeforeUnmount(() => {
    backButton.offClick(backButtonClickHandler);
    mainButton.offClick(mainButtonClickHandler);
})


const setCurrentAddress = async(data) => {
    let addr;
    let result;
    if (user.value.addresses.includes(data)) {
        addr = data
    } else {
        result = await getFullAddress(data)
        if (result) {
            addr = result.address
        }
    }
    if (addr) {
        router.push("/second-app/create_order")
        await store.dispatch("UPDATE_USER", {"data": addr, "field": "addresses", "action": "insert"})
    } else {
        await showTelegramPopUp("Не удалось распознать адрес")
        return
    }
}


const updateUserField = async (data, field) => {
    router.push("/second-app/create_order");
    await store.dispatch("UPDATE_USER", { "data": data, "field": field, "action": "insert" });
};



const updateUserOrderData = (data) => {
    if (props.dataType == "addresses") {
        setCurrentAddress(data)
    } else if (props.dataType == "full_names") {
        updateUserField(data, "full_names")
    } else if (props.dataType == "phones") {
        updateUserField(data, "phones")
    } else {
        updateUserField(data, "emails")
    }
}


</script>

<template>
    <div class="m-update-order-data-container">
        <div
            v-if="!isCreateOrderDataInputVisible"
            v-for="item in items"
            :key="item"
            class="m-update-order-data-wrapper">
            <button
                @click="updateUserOrderData(item)"
                :class="['m-update-order-data-item', {active: item == items[0]}]">
                {{ item }}
            </button>
            <div 
                v-if="items.length > 1"
                class="m-update-order-data-remove-btn"
                :style="{ visibility: item === items[0] ? 'hidden' : 'visible' }" 
                @click="removeDataFromList(item)">
                X
            </div>
        </div>
        <div 
            v-if="isCreateOrderDataInputVisible"
            class="m-update-order-data-input-text">
            {{ inputText }}
        </div>
        <input 
            v-if="isCreateOrderDataInputVisible && dataType != 'phones'"
            required
            type="text"
            v-model="inputData"
            class="m-update-order-data-input"/>
        <div 
            class="m-update-order-data-phone"
            v-if="isCreateOrderDataInputVisible && dataType == 'phones'">
                <span>+7</span>
                <input ref="inputRef"/>
        </div>
    </div>
</template>



<style scoped>

.m-update-order-data-container{
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 1);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}


.m-update-order-data-wrapper{
    display: flex;
    align-items: center;
    width: 100%;
    justify-content: center;
}


.m-update-order-data-remove-btn{
    font-size: 16px;
    color: white;
    cursor: pointer;
}


.m-update-order-data-item{
    background-color: white;
    color: black;
    font-size: 24px;
    width: 70%;
    border: none;
    margin: 4px;
    border: 2px solid rgba(0, 0, 0, 1);
    border-radius: 4px;
    cursor: pointer;
}

.active{
    border: 2px solid #013b45;
    color: #013b45;
    background-color: #c4dfe6;
}

.m-update-order-data-input-text{
    color: white;
    font-size: 14px;
    margin-bottom: 10px;
    font-weight: 700;
}


.m-update-order-data-input{
    border: none;
    outline: none;
    height: 20px;
    text-align: right;
    padding: 0px 4px;
    border-radius: 0px;
}


.m-update-order-data-phone{
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    font-size: 14px;
    font-weight: 700;
}

.m-update-order-data-phone input{
    width: 50%;
    color: white;
    background-color: black;
    outline: none;
    border: none;
    font-size: 14px;
    margin-left: 2px;
}

</style>