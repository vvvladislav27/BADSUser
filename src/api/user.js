import { API_BASE_URL } from "@/config";
import store from "@/store";



const getSelf = async() => {
    const response = await fetch(`${API_BASE_URL}/v0/users/self`, {
        method: "GET",
        headers: {
            'bypass-tunnel-reminder': 'true',
            "auth": store.state.auth,
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
            'bypass-tunnel-reminder': 'true',
            "auth": store.state.auth,
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
            'bypass-tunnel-reminder': 'true',
            "auth": store.state.auth,
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



const updateAddresses = async(address, remove) => {
    const data = {
        "address": address, 
        "remove": remove
    }
    const response = await fetch(`${API_BASE_URL}/v0/users/addresses`, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json',
            'bypass-tunnel-reminder': 'true',
            "auth": store.state.auth,
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

export { getSelf, updateAddresses, getFullAddress, updateUserOrderData}