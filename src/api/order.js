import { API_BASE_URL } from "@/config";
import { initData, showTelegramPopUp } from "@/tg";


const getOrderById = async(orderId) => {
    const response = await fetch(`${API_BASE_URL}/v0/orders/${orderId}`, {
        method: "GET",
        headers: {
            "auth": initData,
            "app": "user"
        }
    });
    if (response.ok) {
        return await response.json();
    } else {
        console.error("Не удалось получить заказ")
    }
}


const createOrder = async(data) => {
    const response = await fetch(`${API_BASE_URL}/v0/orders/create_order`, {
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
    } else if (response.status === 400) {
        showTelegramPopUp("Не удалось создать заказ. Одна или несколько позиций в заказе превышают доступное количество на складе.")
    } else {
        showTelegramPopUp("Не удалось создать заказ, проверьте корзину!");
        return null;
    }
}


const updateOrder = async(orderId, state, address) => {
    const data = {
        "order_id": orderId,
        "state": state,
        "address": address
    }
    const response = await fetch(`${API_BASE_URL}/v0/orders/change_state`, {
        method: "PATCH",
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


const getOrdersForInsertReviews = async() => {
    const response = await fetch(`${API_BASE_URL}/v0/orders/insert_reviews`, {
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


const skipFoodSupReview = async(data) => {
    const response = await fetch(`${API_BASE_URL}/v0/orders/item/skip_review`, {
        method: "PATCH",
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


export {getOrderById, updateOrder, getOrdersForInsertReviews, skipFoodSupReview, createOrder}