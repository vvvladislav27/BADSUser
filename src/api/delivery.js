import { API_BASE_URL } from "@/config";
import { initData } from "@/tg";
import { showTelegramPopUp } from "@/tg";



const getDeliveryData = async(uid) => {
    const response = await fetch(`${API_BASE_URL}/v0/delivery/get_delivery_data/${uid}`, {
        method: "GET",
        headers: {
            "auth": initData,
            "app": "user"
        }
    });
    if (response.ok) {
        return await response.json()
    } else {
        await showTelegramPopUp("Не удалось получить данные доставки")
        return null
    }
}



const getListEmails = async(uid) => {
    const response = await fetch(`${API_BASE_URL}/v0/delivery/list_emails/${uid}`, {
        method: "GET",
        headers: {
            "auth": initData,
            "app": "user"
        }
    });
    if (response.ok) {
        return await response.json()
    } else {
        return []
    }
}



const getListPhones = async(uid) => {
    const response = await fetch(`${API_BASE_URL}/v0/delivery/list_phones/${uid}`, {
        method: "GET",
        headers: {
            "auth": initData,
            "app": "user"
        }
    });
    if (response.ok) {
        return await response.json()
    } else {
        return []
    }
}


const getListFullNames = async(uid) => {
    const response = await fetch(`${API_BASE_URL}/v0/delivery/list_full_names/${uid}`, {
        method: "GET",
        headers: {
            "auth": initData,
            "app": "user"
        }
    });
    if (response.ok) {
        return await response.json()
    } else {
        return []
    }
}


const getListAddress = async(uid) => {
    const response = await fetch(`${API_BASE_URL}/v0/delivery/list_addresses/${uid}`, {
        method: "GET",
        headers: {
            "auth": initData,
            "app": "user"
        }
    });
    if (response.ok) {
        return await response.json()
    } else {
        return []
    }
}


const deleteEntity = async(entityId, entity) => {
    const response = await fetch(`${API_BASE_URL}/v0/delivery/${entity}/${entityId}`, {
        method: "DELETE",
        headers: {
            "auth": initData,
            "app": "user"
        }
    });
    if (response.ok) {
        return await response.json();
    } else {
        await showTelegramPopUp("Не удалось удалить данные")
    }
}


const createEntity = async(payload, entity) => {
    const data = {"data": payload}
    const response = await fetch(`${API_BASE_URL}/v0/delivery/${entity}`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            "auth": initData,
            "app": "user"
        },
        body: JSON.stringify(data)
    });
    if (response.ok) {
        return await response.json();
    } else {
        await showTelegramPopUp("Не удалось добавить данные")
        return null
    }
}


export {
    createEntity,
    deleteEntity, 
    getListAddress, 
    getListEmails, 
    getListFullNames, 
    getListPhones, 
    getDeliveryData
}