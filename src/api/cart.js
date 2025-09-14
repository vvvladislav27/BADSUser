import { API_BASE_URL } from "@/config";
import { initData } from "@/tg";


const getCart = async () => {
    const response = await fetch(`${API_BASE_URL}/v0/carts/`, {
        method: "GET",
        headers: {
            "auth": initData,
            "app": "user"
        },
    });
    if (response.ok) {
        return await response.json()
    } else {
        return null
    }
}

const getCartItems = async() => {
    const response = await fetch(`${API_BASE_URL}/v0/carts/items`, {
        method: "GET",
        headers: {
            "auth": initData,
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
            "auth": initData,
            "app": "user"
        },
        body: JSON.stringify(data)
    });
    if (response.ok) {
        return await response.json()
    } else {
        return null
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
            "auth": initData,
            "app": "user"
        },
        body: JSON.stringify(data)
    });
    if (response.ok) {
        return await response.json()
    } else {
        return null
    }
}

const deleteCartItem = async(itemId) => {
    const response = await fetch(`${API_BASE_URL}/v0/carts/items/${itemId}`, {
        method: "DELETE",
        headers: {
            "auth": initData,
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
            "auth": initData,
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