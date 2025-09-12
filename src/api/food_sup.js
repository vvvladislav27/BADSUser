import { API_BASE_URL } from "@/config";
import { initData, showTelegramPopUp } from "@/tg";



const getFoodSupById = async(foodSupId) => {
    const response = await fetch(`${API_BASE_URL}/v0/food_sups/${foodSupId}`, {
        method: "GET",
        headers: {
            "auth": initData,
            "app": "user"
        },
    });
    if (response.ok) {
        return await response.json();
    } else {
        await showTelegramPopUp("Не удалось найти товар")
        return null
    }
}

export {getFoodSupById}