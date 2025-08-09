import { API_BASE_URL } from "@/config";
import { initData } from "@/tg";



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
        return null
    }
}



const getFullAddress = async(address) => {
    const data = {
        "address": address
    }
    const response = await fetch(`${API_BASE_URL}/v0/users/full_address`, {
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
        return null
    }
}


const updateUserOrderData = async(data) => {
    const response = await fetch(`${API_BASE_URL}/v0/users/update_user_order_data`, {
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
        return null
    }
}


export { getSelf, getFullAddress, updateUserOrderData, getByUserId}