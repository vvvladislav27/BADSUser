import { API_BASE_URL } from "@/config";
import store from "@/store";



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

export {getFoodSupById}