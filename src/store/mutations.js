export const SET_USER = (state, user) => {
    state.user = user;
}

export const SET_PRODUCTS = (state, foodSups) => {
    state.products = foodSups
}

export const SET_ORDERS_FOR_REVIEWS = (state, items) => {
    state.orderItemsForReviews = items
}


export const REMOVE_ORDER_ITEM_FOR_REVIEW = (state) => {
    state.orderItemsForReviews.splice(0, 1)
}


export const SET_FILTERS = (state, {filters, type}) => {
    if (type == "food_sups") {
        state.filters = filters
    } else if (type == "favorite_food_sup") {
        state.favoriteFoodSupsFilters = filters
    } else {
        state.searchFiltersForOrders = filters
    }
}


export const RESET_FILTERS = (state, type) => {
    if (type == "food_sups") {
        state.filters = []
    } else if (type == "favorite_food_sup") {
        state.favoriteFoodSupsFilters = []
    } else {
        state.searchFiltersForOrders = []
    }
}


export const REMOVE_FILTER = (state,  {index, type}) => {
    if (type == "food_sup") {
        if (index >= 0 && index < state.filters.length) {
            state.filters.splice(index, 1);
        }
    } else if (type == "favorite_food_sup") {
        if (index >=0 && index < state.favoriteFoodSupsFilters.length) {
            state.favoriteFoodSupsFilters.splice(index, 1)
        }
    } else {
        if (index >= 0 && index < state.searchFiltersForOrders.length) {
            state.searchFiltersForOrders.splice(index, 1)
        }
    }
}

export const TOGGLE_SEARCH_INPUT_ACTIVE = (state) => {
    state.isSearchInputActive = !state.isSearchInputActive
}


export const SET_SORT = (state, type) => {
    if (state.type == type) {
        state.sort = state.sort === "desc" ? "asc" : "desc";
    } else {
        state.sort = "desc"
    }
    state.type = type
}


export const SET_FAV_FOOD_SUPS = (state, favFoodSups) => {
    favFoodSups.forEach(favFoodSup => {
        state.favFoodSups[favFoodSup.food_sup_id] = favFoodSup;
    });
}


export const TOGGLE_FAV_FOOD_SUP = (state, {foodSupId, result}) => {
    if (result) {
        state.favFoodSups[foodSupId] = result
    } else {
        delete state.favFoodSups[foodSupId]
    }
}


export const SET_USER_CART_ITEMS = (state, userCartItems) => {
    state.userCartItems = {}
    userCartItems.forEach(userCartItem => {
        state.userCartItems[userCartItem.food_sup_id] = userCartItem
    })
}

export const UPDATE_USER_CART_ITEM = (state, userCartItem) => {
    state.userCartItems[userCartItem.food_sup_id] = userCartItem
}


export const SET_USER_CART = (state, userCart) => {
    state.userCart = userCart
}

export const CLEAR_CART_ITEMS = (state) => {
    state.userCartItems = {};
};


export const SET_FOOD_SUPS_PHOTOS =(state, { path, photo }) => {
    state.foodSupsPhotos[path] = photo
}

export const TOGGLE_SELECT_ITEM = (state, item) => {
    const index = state.selectedItems.findIndex(selectedItem => selectedItem.id === item.id);
    if (index !== -1) {
        state.selectedItems.splice(index, 1);
    } else {
        state.selectedItems.push(item);
    }
}

export const ADD_ITEM_TO_ORDER = (state, item) => {
    state.userOrderItems[item.food_sup.id] = item
}

export const REMOVE_ITEM_FROM_ORDER = (state, foodSupId) => {
    delete state.userOrderItems[foodSupId]
}

export const ADD_ITEMS_TO_ORDER = (state, userOrderItems) => {
    state.userOrderItems = userOrderItems
};

export const REMOVE_ITEMS_FROM_ORDER = (state) => {
    state.userOrderItems = {};
};

export const UPDATE_ORDER_ITEM = (state, userOrderItem) => {
    state.userOrderItems[userOrderItem.food_sup.id] = userOrderItem;
};

export const UPDATE_SEARCH_VALUE = (state, { search, type }) => {
    if (type == "food_sup") {
        state.search = search
    } else if (type == "favorite_food_sup") {
        state.favoriteFoodSupsSearch = search;
    } else {
        state.searchQueryForOrders = search;
    }
}


export const SET_IS_DATA_LOADED = (state) => {
    state.isDataLoaded = true;
}


export const SET_IS_VIDEO_LOADED = (state) => {
    state.isVideoLoaded = true;
}

export const SET_IS_VIDEO_VISIBLE = (state) => {
    state.isVideoVisible = false;
}

export const REMOVE_USER_CART_ITEM = (state, foodSupId) => {
    delete state.userCartItems[foodSupId];
}


export const RESET_SELECTED_ITEMS = (state) => {
    state.userOrderItems = []
}


export const SET_SORT_SEARCH_TYPE_FOR_ORDERS = (state, type) => {
    if (state.searchTypeForOrders == type) {
        state.searchSortForOrders = state.searchSortForOrders === "desc" ? "asc" : "desc";
    } else {
        state.searchSortForOrders = "desc"
    }
    state.searchTypeForOrders = type
}


export const SET_SORT_FOR_FAVORITES_FOOD_SUPS = (state, type) => {
    if (state.favoriteFoodSupsType == type) {
        state.favoriteFoodSupsSort = state.favoriteFoodSupsSort === "desc"? "asc": "desc";
    } else {
        state.favoriteFoodSupsSort = "desc"
    }
    state.favoriteFoodSupsType = type
}


export const RESET_VIDEO_LOADED = (state) => {
    state.isVideoVisible = false;
}