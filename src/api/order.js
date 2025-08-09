import { API_BASE_URL } from "@/config";
import { initData } from "@/tg";

const getInvoiceLink = async(cartItemsIds) => {
    const data = {
        "items_ids": cartItemsIds
    }
    const response = await fetch(`${API_BASE_URL}/v0/orders/create_invoice_link`, {
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


const getOrdersWithFilters = async(filters, type, sort, q) => {
    const data = {
        "filters": filters,
        "type": type,
        "sort": sort,
        "q": q,
        "uid": null
    }
    const response = await fetch(`${API_BASE_URL}/v0/orders/search_user_orders`, {
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
}


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


const updateOrderStatus = async(orderId, state) => {
    const data = {
        "order_id": orderId,
        "state": state,
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
        return null
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


export {getInvoiceLink, getOrdersWithFilters, getOrderById, updateOrderStatus, getOrdersForInsertReviews, skipFoodSupReview}