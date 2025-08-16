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
    orderItemsForReviews: [],
    favoriteFoodSupsFilters: [],
    favoriteFoodSupsSort: "desc",
    favoriteFoodSupsType: "rating",
    favoriteFoodSupsSearch: ""
  }

  const vuexLocal = new VuexPersistence({
    key: 'reload-data',
    storage: window.sessionStorage,
    reducer: (state) => ({
      isVideoVisible: state.isVideoVisible,
      isVideoLoaded: state.isVideoLoaded,
      user: state.user,
      userCartItems: state.userCartItems
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