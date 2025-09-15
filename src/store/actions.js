import { searchData } from "@/api/search";
import { getFavFoodSups, toggleFavFoodSup } from "@/api/fav_food_sup";
import { getCartItems, addCartItem, getCart, updateCartItem, deleteCartItem, clearCart } from "@/api/cart";
import { getOrdersForInsertReviews } from "@/api/order";
import { getSelf, updateUser } from "@/api/user";
import { showTelegramPopUp } from "@/tg";


export const GET_AND_SET_DATA = async({commit}) => {
    const user = await getSelf();
    if (user.is_blocked) {
        await showTelegramPopUp("Вы заблокированы администратором приложения");
    }
    commit("SET_USER", user);
    if (user.is_blocked) {
        return true
    }
    const [cart, favoriteFoodSup, cartItems, orderItemsforReview] = await Promise.all([
        getCart(),
        getFavFoodSups(),
        getCartItems(),
        getOrdersForInsertReviews()
    ])
    commit("SET_USER_CART", cart);
    commit("SET_FAV_FOOD_SUPS", favoriteFoodSup);
    commit("SET_USER_CART_ITEMS", cartItems);
    commit("SET_ORDERS_FOR_REVIEWS", orderItemsforReview)
    commit("SET_IS_DATA_LOADED");
    return false
}


export const REMOVE_ORDER_ITEM_FOR_REVIEW = ({commit}, index) => {
    commit("REMOVE_ORDER_ITEM_FOR_REVIEW", index)
}


export const GET_AND_SET_USER_CART_ITEMS_AFTER_PAID = async({commit}) => {
    const [userCart, userCartItems] = await Promise.all([
        getCart(),
        getCartItems()
    ])
    commit("SET_USER_CART", userCart)
    commit("SET_USER_CART_ITEMS", userCartItems)
}


export const GET_AND_SET_PRODUCTS = async({commit, state}) => {
    const foodSups = await searchData("food_sups", state.foodSupFilters, state.foodSupSearchType, state.foodSupSearchSort, state.foodSupSearchQuery)
    commit("SET_PRODUCTS", foodSups.food_sups)
}


export const SET_FILTERS = ({commit}, {filters, type}) => {
    commit("SET_FILTERS", {filters, type})
}

export const RESET_FILTERS = ({commit}, type) => {
    commit("RESET_FILTERS", type)
}


export const REMOVE_FILTER = ({commit}, {index, type}) => {
    commit("REMOVE_FILTER",  {index, type})
}


export const SET_SORT = ({commit}, {type, category}) => {
    commit("SET_SORT", {type, category})
}


export const TOGGLE_FAV_FOOD_SUP = async({commit}, foodSupId) => {
    const result = await toggleFavFoodSup(foodSupId)
    commit("TOGGLE_FAV_FOOD_SUP", { foodSupId, result })
}


export const INCREMENT_CART_ITEM = async ({commit, state}, foodSupId) => {
    const item = state.userCartItems[foodSupId]
    if (item) {
        item.count++;
        const updatedItem = await updateCartItem(item.id, state.userCart.id, foodSupId, item.count)
        if (updatedItem) {
            commit("UPDATE_USER_CART_ITEM", item);
        }
    } else {
        const new_item = await addCartItem(state.userCart.id, foodSupId, 1)
        if (new_item) {
            commit("UPDATE_USER_CART_ITEM", new_item);
        }
    }
}

export const DECREMENT_CART_ITEM = async ({ commit, state }, foodSupId) => {
    const item = state.userCartItems[foodSupId]
    if (item) {
        if (item.count > 1) {
            item.count--;
            const updatedItem = await updateCartItem(item.id, state.userCart.id, foodSupId, item.count)
            if (updatedItem) {
                commit("UPDATE_USER_CART_ITEM", item);
            }
        } else {
            const sucsses = await deleteCartItem(item.id)
            if (sucsses) {
                commit("REMOVE_USER_CART_ITEM", foodSupId);
            }
        }
    }
}

export const REMOVE_CART_ITEM = async({commit, state}, foodSupId) => {
    const item = state.userCartItems[foodSupId]
    if (item) {
        const sucsses = await deleteCartItem(item.id)
        if (sucsses) {
            commit("REMOVE_USER_CART_ITEM", foodSupId);
        }
    }
}

export const CLEAR_CART_ITEMS = async({commit, state}) => {
    const sucsess = await clearCart(state.userCart.id)
    if (sucsess) {
        commit("CLEAR_CART_ITEMS")
    }
}

export const SET_FOOD_SUPS_PHOTOS = ({commit}, { path, photo }) => {
    commit("SET_FOOD_SUPS_PHOTOS", { path, photo })
}


export const TOGGLE_ORDER_ITEM = ({commit}, item) => {
    commit("TOGGLE_ORDER_ITEM", item)
}

export const TOGGLE_ORDER_ITEMS = ({commit}, items) => {
    commit("TOGGLE_ORDER_ITEMS", items)
}


export const UPDATE_ORDER_ITEM = ({commit},  item) => {
    commit("UPDATE_ORDER_ITEM",  item)
}

export const UPDATE_SEARCH_VALUE = ({commit}, {search, type}) => {
    commit("UPDATE_SEARCH_VALUE", { search, type })
}

export const SET_IS_VIDEO_LOADED = ({commit}) => {
    commit("SET_IS_VIDEO_LOADED")
}

export const SET_IS_VIDEO_VISIBLE = ({commit}) => {
    commit("SET_IS_VIDEO_VISIBLE")
}

export const UPDATE_USER_SHOW_INSTRUCTION = async({commit, state}) => {
    const u = state.user;
    u.show_instruction = true;
    const user = await updateUser(u)
    if (user) {
        commit("SET_USER", user);
    }
}

export const GET_AND_SET_USER = async({commit}) => {
    const user = await getSelf();
    if (user) {
        commit("SET_USER", user);
        return user;
    }

}

export const RESET_SELECTED_ITEMS = ({commit}) => {
    commit("RESET_SELECTED_ITEMS")
}


export const RESET_VIDEO_LOADED = ({commit}) => {
    commit("RESET_VIDEO_LOADED")
}

export const TOGGLE_SEARCH_INPUT_ACTIVE = ({commit}) => {
    commit("TOGGLE_SEARCH_INPUT_ACTIVE")
}