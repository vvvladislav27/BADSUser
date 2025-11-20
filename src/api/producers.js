import { API_BASE_URL } from "@/config";
import { initData } from "@/tg";


const getProducers = async() => {
    const response = await fetch(`${API_BASE_URL}/v0/producers/list`, {
        method: "GET",
        headers: {
            "auth": initData,
            "app": "user"
        }
    });
    if (response.ok) {
        return await response.json();
    } else {
        return []
    }
}


export {getProducers}