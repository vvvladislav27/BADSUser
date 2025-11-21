import { createRouter, createWebHistory } from "vue-router";
import MFoodSups from "./components/MFoodSups.vue";
import MCart from "./components/MCart.vue";
import MFoodSup from "./components/MFoodSup.vue";
import MCreateOrder from "./components/MCreateOrder.vue";
import MCabinet from "./components/MCabinet.vue";
import MFoodSupsFavorites from "./components/MFoodSupsFavorites.vue";
import MOrders from "./components/MOrders.vue";
import MOrder from "./components/MOrder.vue";
import MBlocked from "./components/MBlocked.vue";
import store from "./store";




const routes = [
    {path: '/second-app/', name: 'FoodSups', component: MFoodSups},
    {path: "/second-app/cart", name: "Cart", component: MCart},
    {path: "/second-app/cabinet", name: "Cabinet", component: MCabinet},
    {path: "/second-app/food_sups/favorites", name: "FoodSupsFavorites", component: MFoodSupsFavorites},
    {path: "/second-app/food_sups/:id", name: "FoodSup", component: MFoodSup, props: true},
    {path: "/second-app/favorite_food_sups/:id", name: "FavoriteFoodSup", component: MFoodSup, props: true},
    {path: "/second-app/orders", name: "Orders", component: MOrders},
    {path: "/second-app/orders/:id", name: "Order", component: MOrder, props: true},
    {path: "/second-app/create_order", name: "CreateOrder", component: MCreateOrder},
    {path: "/second-app/blocked", name: "Blocked", component: MBlocked}
]

const router = createRouter(
    {
        history: createWebHistory(),
        routes
    }
)

let lastRoute = null;


router.beforeEach(async (to, from, next) => {
    const isBlocked = store.state.user.is_blocked;
    if (isBlocked && to.path !== '/second-app/blocked') {
        return next({ path: '/second-app/blocked' });
    }
    lastRoute = from;
    next();
});


  
export { router, lastRoute };