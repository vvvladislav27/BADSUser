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
        state.foodSupFilters = filters
    } else if (type == "favorite_food_sup") {
        state.favoriteFoodSupsFilters = filters
    } else {
        state.orderFilters = filters
    }
}


export const RESET_FILTERS = (state, type) => {
    if (type == "food_sups") {
        state.foodSupFilters = []
    } else if (type == "favorite_food_sup") {
        state.favoriteFoodSupsFilters = []
    } else {
        state.orderFilters = []
    }
}


export const REMOVE_FILTER = (state,  {index, type}) => {
    if (type == "food_sup") {
        if (index >= 0 && index < state.foodSupFilters.length) {
            state.foodSupFilters.splice(index, 1);
        }
    } else if (type == "favorite_food_sup") {
        if (index >=0 && index < state.favoriteFoodSupsFilters.length) {
            state.favoriteFoodSupsFilters.splice(index, 1)
        }
    } else {
        if (index >= 0 && index < state.orderFilters.length) {
            state.orderFilters.splice(index, 1)
        }
    }
}



export const SET_SORT = (state, { type, category }) => {
    const map = {
        "food_sups": { "searchType": "foodSupSearchType", "searchSort": "foodSupSearchSort" },
        "favorite_food_sups": { "searchType": "favoriteFoodSupsSearchType", "searchSort": "favoriteFoodSupsSearchSort" },
        "orders": { "searchType": "orderSearchType", "searchSort": "orderSearchSort" },
    };
    const { searchType, searchSort } = map[category];
    if (state[searchType] === type) {
        state[searchSort] = state[searchSort] === "desc" ? "asc" : "desc";
    } else {
        state[searchSort] = "desc";
    }
    state[searchType] = type;
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



export const TOGGLE_ORDER_ITEM = (state, item) => {
    if (typeof(item) === 'object') {
        state.userOrderItems[item.food_sup.id] = item;
    } else {
        delete state.userOrderItems[item];
    }
}


export const TOGGLE_ORDER_ITEMS = (state, items) => {
    if (items) {
        state.userOrderItems = items;
    } else {
        state.userOrderItems = {};
    }
}


export const UPDATE_ORDER_ITEM = (state, item) => {
    state.userOrderItems[item.food_sup.id] = item;
};

export const UPDATE_SEARCH_VALUE = (state, { search, type }) => {
    if (type == "food_sup") {
        state.foodSupSearchQuery = search
    } else if (type == "favorite_food_sup") {
        state.favoriteFoodSupsSearchQuery = search;
    } else {
        state.orderSearchQuery = search;
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


export const RESET_VIDEO_LOADED = (state) => {
    state.isVideoVisible = false;
}

export const TOGGLE_SEARCH_INPUT_ACTIVE = (state) => {
    state.isSearchInputActive = !state.isSearchInputActive
}
