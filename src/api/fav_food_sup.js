import { API_BASE_URL } from "@/config";
import { initData } from "@/tg";


const getFavFoodSups = async() => {
    const response = await fetch(`${API_BASE_URL}/v0/fav_food_sups/items`, {
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


const toggleFavFoodSup = async(foodSupId) => {
    const data = {
        "food_sup_id": foodSupId
    }
    const response = await fetch(`${API_BASE_URL}/v0/fav_food_sups/toggle_item`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            "auth": initData,
            "app": "user"
        },
        body: JSON.stringify(data)
    });
    if (response.ok) {
        return await response.json()
    } else {
        return []
    }
}




export {getFavFoodSups, toggleFavFoodSup}