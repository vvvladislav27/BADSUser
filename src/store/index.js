import { createStore } from "vuex";
import VuexPersistence from "vuex-persist";
import * as getters from './getters'
import * as actions from './actions'
import * as mutations from './mutations'


const state = {
    isVideoVisible: true,
    isVideoLoaded: false,
    isDataLoaded: false,
    products: [],
    isSearchInputActive: false,
    search: "",
    filters: [],
    sort: "desc",
    type: "rating",
    foodSupsPhotos: {},
    favFoodSups: {},
    user: {},
    userCart: {},
    userCartItems: {},
    userCartFoodSups: [],
    userOrderItems: {},
    searchFiltersForOrders: [],
    searchSortForOrders: "desc",
    searchTypeForOrders: "created_date",
    searchQueryForOrders: "",
    orderItemsForReviews: []
  }

  const vuexLocal = new VuexPersistence({
    key: 'reload-data',
    storage: window.localStorage,
    reducer: (state) => ({
      isVideoVisible: state.isVideoVisible,
      userCart: state.userCart,
      userCartItems: state.userCartItems,
      userCartFoodSups: state.userCartFoodSups,
      userOrderItems: state.userOrderItems,
      favFoodSups: state.favFoodSups,
      user: state.user,
    })
  })
  
const store = createStore({
    state,
    getters,
    actions,
    mutations,
    plugins: [vuexLocal.plugin]
  })

export default store;