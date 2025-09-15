import { API_BASE_URL } from "@/config";
import { initData } from "@/tg";
import store from "@/store";


const searchData = async(what, filters, type, sort, q) => {
    const data = {
        "what": what,
        "filters": filters,
        "type": type,
        "order": sort,
        "q": q,
        "uid": store.state.user.telegram_id
    }
    const response = await fetch(`${API_BASE_URL}/v0/search/`, {
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
};


export {searchData}