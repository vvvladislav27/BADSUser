import { API_BASE_URL } from "@/config";
import { initData } from "@/tg";
import { showTelegramPopUp } from "@/tg";


const getEninties = async(uid, entity) => {
    const response = await fetch(`${API_BASE_URL}/v0/delivery/list_${entity}/${uid}`, {
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


const updateEntity = async(entity_id, entity) => {
    const data = {"entity_id": entity_id}
    const response = await fetch(`${API_BASE_URL}/v0/delivery/${entity}`, {
        method: "PATCH",
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
        await showTelegramPopUp("Не удалось обновить данные")
        return null
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
    updateEntity,
    getEninties
}