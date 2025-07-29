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
    userCountOrders: 0,
    searchFiltersForOrders: [],
    searchSortForOrders: "desc",
    searchTypeForOrders: "created_date",
    searchQueryForOrders: "",
  }

  const vuexLocal = new VuexPersistence({
    key: 'reload-data',
    storage: window.localStorage,
    reducer: (state) => ({
      userCart: state.userCart,
      userCartItems: state.userCartItems,
      userCartFoodSups: state.userCartFoodSups,
      userOrderItems: state.userOrderItems,
      favFoodSups: state.favFoodSups,
      user: state.user,
      userCountOrders: state.userCountOrders
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