import { API_BASE_URL } from "@/config";
import store from "@/store";


const getCart = async () => {
    const response = await fetch(`${API_BASE_URL}/v0/carts/`, {
        method: "GET",
        headers: {
            'bypass-tunnel-reminder': 'true',
            "auth": store.state.auth,
            "app": "user"
        },
    });
    if (response.ok) {
        return await response.json()
    } else {
        return []
    }
}

const getCartItems = async() => {
    const response = await fetch(`${API_BASE_URL}/v0/carts/items`, {
        method: "GET",
        headers: {
            'bypass-tunnel-reminder': 'true',
            "auth": store.state.auth,
            "app": "user"
        },
    });
    if (response.ok) {
        return await response.json()
    } else {
        return []
    }
}


const addCartItem = async (cartId, foodSupId, count) => {
    const data = {
        "cart_id": cartId,
        "item_type": "food_sup",
        "food_sup_id": foodSupId,
        "count": count
    }
    const response = await fetch(`${API_BASE_URL}/v0/carts/items`, {
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
        return await response.json()
    } else {
        return []
    }
}


const updateCartItem = async (cartItemId, cartId, foodSupId, count) => {
    const data = {
        "cart_id": cartId,
        "item_type": "food_sup",
        "food_sup_id": foodSupId,
        "count": count
    }
    const response = await fetch(`${API_BASE_URL}/v0/carts/items/${cartItemId}`, {
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
        return await response.json()
    } else {
        return []
    }
}

const deleteCartItem = async(itemId) => {
    const response = await fetch(`${API_BASE_URL}/v0/carts/items/${itemId}`, {
        method: "DELETE",
        headers: {
            'bypass-tunnel-reminder': 'true',
            "auth": store.state.auth,
            "app": "user"
        },
    });
    if (response.ok) {
        return true
    } else {
        return false
    }
}


const clearCart = async(cartId) => {
    const response = await fetch(`${API_BASE_URL}/v0/carts/clear_cart/${cartId}`, {
        method: "DELETE",
        headers: {
            'bypass-tunnel-reminder': 'true',
            "auth": store.state.auth,
            "app": "user"
        }
    })
    if (response.ok) {
        return true
    } else {
        return false
    }
}



export {
    getCartItems, 
    addCartItem, 
    getCart, 
    updateCartItem, 
    deleteCartItem,
    clearCart 
}