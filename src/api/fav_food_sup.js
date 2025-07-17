import { API_BASE_URL } from "@/config";
import store from "@/store";


const getFavFoodSups = async() => {
    const response = await fetch(`${API_BASE_URL}/v0/fav_food_sups/items`, {
        method: "GET",
        headers: {
            'bypass-tunnel-reminder': 'true',
            "auth": store.state.auth,
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
            'bypass-tunnel-reminder': 'true',
            'Content-Type': 'application/json',
            "auth": store.state.auth,
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


const getFavFoodSupsWithFilters = async(filters, type, sort, q) => {
    const data = {
        "filters": filters,
        "type": type,
        "sort": sort,
        "q": q,
        "uid": null
    }
    const response = await fetch(`${API_BASE_URL}/v0/fav_food_sups/search_user_favorite_items`, {
        method: "POST",
        headers: {
            'bypass-tunnel-reminder': 'true' ,
            'Content-Type': 'application/json',
            "auth": store.state.auth,
            "app": "user"
        },
        body: JSON.stringify(data)
    });
    if (response.ok) {
        return await response.json()
    } else {
        return []
    }
};


export {getFavFoodSups, toggleFavFoodSup, getFavFoodSupsWithFilters}