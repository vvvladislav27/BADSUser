import { API_BASE_URL } from "@/config";
import store from "@/store";




const getReviews = async(foodSupId, page) => {
    const response = await fetch(`${API_BASE_URL}/v0/reviews/list_food_sup_reviews/${foodSupId}?page=${page}`, {
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
        return []
    }
}


const insertReview = async(review) => {
    const response = await fetch(`${API_BASE_URL}/v0/reviews/`, {
        method: "POST",
        headers: {
            'bypass-tunnel-reminder': 'true' ,
            'Content-Type': 'application/json',
            "auth": store.state.auth,
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