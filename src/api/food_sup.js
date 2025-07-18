import { API_BASE_URL } from "@/config";
import store from "@/store";


const getFoodSupsWithFilters = async(filters, type, sort, q) => {
    const data = {
        "filters": filters,
        "type": type,
        "sort": sort,
        "q": q
    }
    const response = await fetch(`${API_BASE_URL}/v0/food_sups/search_for_user`, {
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


const getFoodSupById = async(foodSupId) => {
    const response = await fetch(`${API_BASE_URL}/v0/food_sups/${foodSupId}`, {
        method: "GET",
        headers: {
            'bypass-tunnel-reminder': 'true' ,
            "auth": store.state.auth,
            "app": "user"
        },
    });
    if (response.ok) {
        return await response.json();
    } else {
        console.error("Не удалось получить БАД")
    }
}

export {getFoodSupsWithFilters, getFoodSupById}