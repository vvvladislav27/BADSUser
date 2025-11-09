import store from "./store";
import { getPhoto } from "./api/images";


const formatAmount = (amount) => {
    let totalValue;
    const numericValue = parseFloat(amount) || 0;

    if (numericValue > 1e12 || numericValue < -1e12) {
        totalValue = "> " + (numericValue / 1e12).toFixed(0) + " трлн"; 
    }
    else if (numericValue === 1e12 || numericValue === -1e12) {
        totalValue = (numericValue / 1e12).toFixed(0) + " трлн"; 
    }
    else if (numericValue >= 1e9 || numericValue <= -1e9) {
        totalValue = (numericValue / 1e9).toFixed(2) + " млрд";
    } 
    else if (numericValue >= 1e6 || numericValue <= -1e6) {
        totalValue = (numericValue / 1e6).toFixed(2) + " млн";
    } 
    else {
        totalValue = numericValue.toLocaleString("ru-RU");
    }
    
    return totalValue;
};

const vibrate = () => {
    if (navigator.vibrate) {
        navigator.vibrate(200);
    }
}


const getFormatDate = (dateString) => {
    const [year, month, day] = dateString.split('-');
    return `${day}.${month}.${year}`;
}

const getSortedNameText = (b) => {
    const textMap = {
        price: "Цена",
        rating: "Рейтинг",
        name: "Название",
        cost: "Стоимость",
        created_date: "Дата создания",
        item_count: "Количество",
        unique_item_count: "Количество уникальных",
        all: "Все",
        created: "Созданные",
        packed: "Упакованные",
        send: "Отправленные",
        received: "Полученные",
        finished: "Завершённые",
        canceled: "Отменённые",
        arrived: "Прибывшие",
        paid: "Оплаченные"
    }
    return textMap[b] || null;
}


const getPackageItemCountText = (foodSup) => {
    let text= `${foodSup.package_item_count}`;
    if (foodSup.type_ == "pills") {
        text += foodSup.package_item_count == 24? " таблетки": " таблеток"
    } else {
        text += foodSup.package_item_count == 24? " капсулы": " капсул"
    };
    return text;
};



const getStockItemCountText = (foodSup) => {
    return foodSup.stock_item_count == 0? "Нет в наличии": `В наличии ${foodSup.stock_item_count} шт.`
}

const getImage = async(photo_path) => {
    let photo;
    photo = store.state.foodSupsPhotos[photo_path];
    if (photo) return photo
    photo = await getPhoto(photo_path)
    await store.dispatch("SET_FOOD_SUPS_PHOTOS", {"path": photo_path, "photo": photo})
    return photo
}

const formatDate = (dateString) => {
    const options = {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    };
    const date = new Date(dateString);
    return date.toLocaleString('ru-RU', options);
  };


const getOrderStateForOrder = (orderState) => {
    const stateMap = {
        created: "Создан",
        packed: "Упакован",
        send: "Отправленный",
        received: "Полученный",
        finished: "Завершённый",
        arrived: "Прибыл",
        paid: "Оплачен"
    };
    return stateMap[orderState] || "Отменённый";
}


const getOrderStateForOrders = (orderState) => {
    const stateMap = {
        created: "Созданные",
        packed: "Упакованные",
        send: "Отправленные",
        received: "Полученные",
        finished: "Завершённые",
        canceled: "Отменённые",
        arrived: "Прибывшие",
        paid: "Оплаченные"
    };
    return stateMap[orderState] || "Все";
}


const formatDateForOrder = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    if (date.toDateString() === today.toDateString()) {
        return 'Сегодня';
    } else if (date.toDateString() === yesterday.toDateString()) {
        return 'Вчера';
    } else {
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        return date.toLocaleDateString('ru-RU', options);
    }
}


const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
}


const getReviewText = (foodSup) => {
    let text = '';
    if (foodSup.rating) {
        text = `${foodSup.rating}`
    }
    if (foodSup.count_reviews === 0) {
        text += " (Нет отзывов)";
    } else if (foodSup.count_reviews === 1) {
        text += " (1 отзыв)";
    } else if (foodSup.count_reviews <=4 ) {
        text += ` (${foodSup.count_reviews} отзыва)`
    } else {
        text += ` (${foodSup.count_reviews} отзывов)`;
    }
    return text;
};



const getFilterButtonName = (filter) => {
    if (filter.name == "Количество") {
        return `${filter.package_item_count} в упаковке`
    } else if (filter.name == "Рейтинг") {
        return `Рейтинг > ${filter.rating}`
    } else if (filter.name == "Состояние заказа") {
        return getOrderStateForOrders(filter.state)
    } else if (filter.name == "Дата") {
        if (filter.from_date && filter.to_date) {
            return `С ${getFormatDate(filter.from_date)} по ${getFormatDate(filter.to_date)}`
        } else if (!filter.from_date && filter.to_date) {
            return `По ${getFormatDate(filter.to_date)}`
        } else if (filter.from_date && !filter.to_date) {
            return `С ${getFormatDate(filter.from_date)}`
        }
    }
    else {
        if (filter.price_from && filter.price_to) {
            return `Цена от ${formatAmount(filter.price_from)} руб до ${formatAmount(filter.price_to)} руб`
        } else if (!filter.price_from && filter.price_to) {
            return `Цена до ${formatAmount(filter.price_to)} руб`
        } else if (filter.price_from && !filter.price_to) {
            return `Цена от ${formatAmount(filter.price_from)} руб`
        }
    }
}


export {
    formatAmount, 
    vibrate, 
    getSortedNameText, 
    getStockItemCountText, 
    getPackageItemCountText, 
    getImage,
    formatDate,
    getOrderStateForOrder,
    getOrderStateForOrders,
    formatDateForOrder,
    getFormatDate,
    formatTime,
    getReviewText,
    getFilterButtonName
}