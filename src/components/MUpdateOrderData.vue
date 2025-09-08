<script setup>
import { computed, ref, onBeforeMount, onBeforeUnmount } from 'vue';
import store from '@/store';
import { router } from '@/router';
import { 
    getListAddress, 
    getListEmails, 
    getListFullNames, 
    getListPhones, 
    deleteEntity,
    createEntity
} from '@/api/delivery';
import { useTelInput } from 'vue3-headless-tel-input';
import { showTelegramPopUp, showTelegramPopUpWithKeyboard, mainButton, backButton } from '@/tg';


const user = computed(() => store.state.user);
const inputData = ref();
const inputText = ref("")
const items = ref([]);
const getItems = ref(false);
const { inputRef } = useTelInput(inputData)
const isCreateOrderDataInputVisible = ref();
const fieldId = ref();


let backButtonClickHandler;
let mainButtonClickHandler;


const props = defineProps({
    dataType: {
        type: String,
        required: true
    }
})


onBeforeMount(async() => {
    await getData();
    isCreateOrderDataInputVisible.value = (items.value.length > 0? false: true);
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


const getData = async() => {
    if (props.dataType == "address") {
        inputText.value = "Введите адрес"
        fieldId.value = user.value.address_id;
        items.value = await getListAddress(user.value.telegram_id);
    } else if (props.dataType == "full_name") {
        inputText.value = "Введите ФИО"
        fieldId.value = user.value.full_name_id;
        items.value = await getListFullNames(user.value.telegram_id);
    } else if (props.dataType == "phone") {
        inputText.value = "Введите номер телефона"
        fieldId.value = user.value.phone_id;
        items.value = await getListPhones(user.value.telegram_id);
    } else {
        inputText.value = "Введите email"
        fieldId.value = user.value.email_id;
        items.value = await getListEmails(user.value.telegram_id);
    }
    getItems.value = true;
}



const insertNewData = async() => {
    if (!isCreateOrderDataInputVisible.value) {
        isCreateOrderDataInputVisible.value = true;
        return
    };
    if (props.dataType === 'phone') {
        const number = inputRef.value.value.replace(/[\s_]+/g, '').trim(); 
        inputData.value = '+7' + number;
        if (inputData.value.length < 12) {
            await showTelegramPopUp("Введите корректный номер телефона")
            inputData.value = null
            return
        }
    } else if (props.dataType === "email") {
        if (inputData.value) {
            const email = inputData.value.trim();
            const emailRegex = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu;
            if (!emailRegex.test(email)) {
                await showTelegramPopUp("Введите корректный email")
                inputData.value = null;
                return
            }
        } else {
            await showTelegramPopUp("Введите корректный email")
        }
    }
    if (inputData.value) {
        const result = await createEntity(inputData.value, props.dataType)
        if (result) {
            updateUserDeliveryData(result.id);
        }
    }
}


const removeDataFromList = async (itemId) => {
    const messages = {
        'address': "Удалить адрес?",
        'full_name': "Удалить ФИО?",
        'phone': "Удалить телефон?",
        'email': "Удалить email?"
    };
    const message = messages[props.dataType] || "Удалить данные?";
    const result = await showTelegramPopUpWithKeyboard(message);
    if (result === "confirm") {
        await deleteEntity(itemId, props.dataType);
        router.push("/second-app/create_order");
    }
}

const updateUserDeliveryData = async (id) => {
    const u = user.value;
    const fieldMapping = {
        address: 'address_id',
        phone: 'phone_id',
        email: 'email_id',
        full_name: 'full_name_id'
    };
    const field = fieldMapping[props.dataType];
    if (field) {
        u[field] = id;
        const result = await store.dispatch("UPDATE_USER_DELIVERY_DATA", u)
        if (result) {
            router.push("/second-app/create_order");
        }
        
    }
};


</script>

<template>
    <div class="m-update-order-data-container" v-if="getItems">
    <button style="width: 30px; height: 30px;" @click="mainButtonClickHandler"></button>
        <div
            v-if="!isCreateOrderDataInputVisible"
            v-for="item in items"
            :key="item"
            class="m-update-order-data-wrapper">
            <button
                @click="updateUserDeliveryData(item.id)"
                :class="['m-update-order-data-item', {active: item.id === fieldId}]">
                <p v-if="dataType == 'address'">{{ item.full_address }}</p>
                <p v-else-if="dataType == 'full_name' || dataType == 'email'"> {{ item.name }}</p>
                <p v-else-if="dataType == 'phone'"> {{ item.number }}</p>
            </button>
            <div 
                v-if="items.length > 1"
                class="m-update-order-data-remove-btn"
                :style="{ visibility: item.id === fieldId ? 'hidden' : 'visible' }" 
                @click="removeDataFromList(item.id)">
                X
            </div>
        </div>
        <div 
            v-if="isCreateOrderDataInputVisible"
            class="m-update-order-data-input-text">
            {{ inputText }}
        </div>
        <input 
            v-if="isCreateOrderDataInputVisible && dataType != 'phone'"
            required
            type="text"
            v-model="inputData"
            class="m-update-order-data-input"/>
        <div 
            class="m-update-order-data-phone"
            v-if="isCreateOrderDataInputVisible && dataType == 'phone'">
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