import { API_BASE_URL } from "@/config";
import { initData } from "@/tg";
import { showTelegramPopUp } from "@/tg";



const getSelf = async() => {
    const response = await fetch(`${API_BASE_URL}/v0/users/self`, {
        method: "GET",
        headers: {
            "auth": initData,
            "app": "user"
        }
    });
    if (response.ok) {
        return await response.json();
    } else {
        return null
    }
}


const getByUserId = async(userId) => {
    const response = await fetch(`${API_BASE_URL}/v0/users/${userId}`, {
        method: "GET",
        headers: {
            "auth": initData,
            "app": "user"
        }
    });
    if (response.ok) {
        return await response.json();
    } else {
        await showTelegramPopUp("Не удалось получить данные для кабинета")
        return null
    }
}



const updateUser = async(data) => {
    const response = await fetch(`${API_BASE_URL}/v0/users/update`, {
        method: "PUT",
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
    }
}


export { getSelf, getByUserId, updateUser}