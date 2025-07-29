import { searchData } from "@/api/search";
import { getFavFoodSups, toggleFavFoodSup } from "@/api/fav_food_sup";
import { 
    getCartItems,
    addCartItem, 
    getCart, 
    updateCartItem, 
    deleteCartItem,
    clearCart
} from "@/api/cart";
import { getSelf, updateUserOrderData } from "@/api/user";
import { getNumberOrders } from "@/api/order";
import { showTelegramPopUp } from "@/tg";


export const CHEK_USER_STATUS = async({commit}) => {
    let is_blocked = false;
    const user = await getSelf();
    if (user.is_blocked) {
        await showTelegramPopUp("Вы заблокированы администратором приложения");
        is_blocked = true;
    }
    commit("SET_USER", user);
    return is_blocked
}


export const GET_DATA = async({commit, state}) => {
    const [userCart, favFoodSups, foodSups, userCartItems, userCountOrders] = await Promise.all([
        getCart(),
        getFavFoodSups(),
        searchData("food_sups", state.filters, state.type, state.sort, state.search),
        getCartItems(),
        getNumberOrders(),
    ])
    commit("SET_USER_CART", userCart);
    commit("SET_FAV_FOOD_SUPS", favFoodSups);
    commit("SET_PRODUCTS", foodSups.food_sups);
    commit("SET_USER_CART_ITEMS", userCartItems);
    commit("SET_IS_DATA_LOADED");
    commit("SET_COUNT_USER_ORDERS", userCountOrders)
}



export const GET_AND_SET_USER_CART_ITEMS = async({commit}) => {
    const user = await getSelf();
    commit("SET_USER", user);
    const [userCart, userCartItems] = await Promise.all([
        getCart(),
        getCartItems()
    ])
    commit("SET_USER_CART", userCart)
    commit("SET_USER_CART_ITEMS", userCartItems)
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
    const foodSups = await searchData("food_sups", state.filters, state.type, state.sort, state.search)
    commit("SET_PRODUCTS", foodSups.food_sups)
}

export const REMOVE_CART_PRODUCT = ({commit}, index) => {
    commit("REMOVE_CART_PRODUCT", index)
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

export const TOGGLE_SEARCH_INPUT_ACTIVE = ({commit}) => {
    commit("TOGGLE_SEARCH_INPUT_ACTIVE")
}


export const SET_SORT = ({commit}, type) => {
    commit("SET_SORT", type)
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

export const ADD_ITEM_TO_ORDER = ({commit}, item) => {
    commit("ADD_ITEM_TO_ORDER", item)
}

export const REMOVE_ITEM_FROM_ORDER = ({commit}, foodSupId) => {
    commit("REMOVE_ITEM_FROM_ORDER", foodSupId)
}

export const ADD_ITEMS_TO_ORDER = ({commit}, userOrderItems) => {
    commit("ADD_ITEMS_TO_ORDER", userOrderItems)
}

export const REMOVE_ITEMS_FROM_ORDER = ({commit}) => {
    commit("REMOVE_ITEMS_FROM_ORDER")
}

export const UPDATE_ORDER_ITEM = ({commit},  userOrderItem) => {
    commit("UPDATE_ORDER_ITEM",  userOrderItem)
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


export const UPDATE_USER = async({ commit, state }, { data, field, action }) => {
    const user = { ...state.user };
    const moveItemToFront = (array, item) => {
        const index = array.indexOf(item);
        if (index > -1) {
            array.splice(index, 1);
        }
        array.unshift(item);
    };
    if (action === "insert") {
        if (field === "address") {
            if (!user.addresses.includes(data)) {
                user.addresses.unshift(data);
            } else {
                moveItemToFront(user.addresses, data);
            }
        } else if (field === "full_names") {
            if (!user.full_names.includes(data)) {
                user.full_names.unshift(data);
            } else {
                moveItemToFront(user.full_names, data);
            }
        } else if (field === "phones") {
            if (!user.phones.includes(data)) {
                user.phones.unshift(data);
            } else {
                moveItemToFront(user.phones, data);
            }
        } else {
            if (!user.emails.includes(data)) {
                user.emails.unshift(data);
            } else {
                moveItemToFront(user.emails, data);
            }
        }
    } else {
        if (field === "address") {
            user.addresses = user.addresses.filter(address => address !== data);
        } else if (field === "full_names") {
            user.full_names = user.full_names.filter(name => name !== data);
        } else if (field === "phones") {
            user.phones = user.phones.filter(phone => phone !== data);
        } else {
            user.emails = user.emails.filter(email => email !== data);
        }
    }

    const response = await updateUserOrderData(user);
    if (response) {
        commit("SET_USER", response);
    }
}

export const RESET_SELECTED_ITEMS = ({commit}) => {
    commit("RESET_SELECTED_ITEMS")
}

export const RESET_SEARCH_FILTERS = ({commit}) => {
    commit("RESET_SEARCH_FILTERS")
}


export const SET_SORT_SEARCH_TYPE_FOR_ORDERS = ({commit}, type) => {
    commit("SET_SORT_SEARCH_TYPE_FOR_ORDERS", type)
}