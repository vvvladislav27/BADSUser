import { API_BASE_URL } from "@/config";
import { initData } from "@/tg";




const getReviews = async(foodSupId, page) => {
    const response = await fetch(`${API_BASE_URL}/v0/reviews/items/${foodSupId}?page=${page}`, {
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


const insertReview = async(review) => {
    const response = await fetch(`${API_BASE_URL}/v0/reviews/`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            "auth": initData,
            "app": "user"
        },
        body: JSON.stringify(review)
    });
    if (response.ok) {
        return await response.json()
    } else {
        return []
    }
}



export {getReviews, insertReview}