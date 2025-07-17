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
    let text;
    if (b == "price") {
        text = "Цена"
    } else if (b == "rating") {
        text = "Рейтинг"
    } else if (b == "name") {
        text = "Название"
    } else if (b == "cost") {
        text = "Стоимость" 
    } else if (b == "created_date") {
        text = "Дата создания"
    } else if (b == "item_count") {
        text = "Количество"
    } else if (b == "unique_item_count") {
        text = "Количество уникальных"
    } else if (b == "all") {
        text = "Все"
    } else if (b == "created") {
        text = "Созданные"
    } else if (b == "packed") {
        text = "Упакованные"
    } else if (b == "send") {
        text = "Отправленные"
    } else if (b == "received") {
        text = "Полученные"
    } else if (b == "finished") {
        text = "Завершённые"
    } else if (b == "canceled") {
        text = "Отменённые"
    }
    return text
}


const getPackageItemCountText = (foodSup) => {
    let text= `${foodSup.package_item_count}`;
    if (foodSup.type_ == "pills") {
        if (foodSup.package_item_count == 12) {
            text += " таблеток"
        } else {
            text += " таблетки"
        }
    } else {
        if (foodSup.package_item_count == 12) {
            text += " капсул"
        } else {
            text += " капсулы"
        }
    };
    return text;
};


const getStockItemCountText = (foodSup) => {
    if (foodSup.stock_item_count == 0) {
        return "Нет в наличии"
    } else {
        return `В наличии ${foodSup.stock_item_count} шт.`
    }
}

//сделать кэш как в админ приложении
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


  const getOrderStateTextRu = (orderState) => {
    let text 
    if (orderState == "created") {
        text = "Создан"
    } else if (orderState == "packed") {
        text = "Упакован"
    } else if (orderState == "send") {
        text = "Отправленный"
    } else if (orderState == "received") {
        text = "Полученный"
    } else if (orderState == "finished") {
        text = "Завершённый"
    } else {
        text = "Отменённый"
    }
    return text
}


const getOrderState = (orderState) => {
    let state;
    if (orderState == "Созданные") {
        state = "created"
    } else if (orderState == "Упакованные") {
        state = "packed"
    } else if (orderState == "Отправленные") {
        state = "send"
    } else if (orderState == "Полученные") {
        state = "received"
    } else if (orderState == "Завершённые") {
        state = "finished"
    } else if (orderState == "Отменённые") {
        state = "canceled"
    } else {
        state = null
    }
    return state
}


const getOrderStateEn = (orderState) => {
    let state;
    if (orderState == "created") {
        state = "Созданные"
    } else if (orderState == "packed") {
        state = "Упакованные"
    } else if (orderState == "send") {
        state = "Отправленные"
    } else if (orderState == "received") {
        state = "Полученные"
    } else if (orderState == "finished") {
        state = "Завершённые"
    } else if (orderState == "canceled") {
        state = "Отменённые"
    } else {
        state = "Все"
    }
    return state
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


const formatDateForPicker = (date) => {
    if (date == null) {
        return null;
    } 
    try {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
    } catch {
        const parsedDate = new Date(date);
        const day = String(parsedDate.getDate()).padStart(2, '0');
        const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
        const year = parsedDate.getFullYear();
        return `${day}.${month}.${year}`;
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
    } else {
        text = "0"
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


const getQuantityText = (foodSup) => {
    let text= `${foodSup.package_item_count}`;
    if (foodSup.type_ == "pills") {
        text += " таблеток"
    } else {
        text += " капсул"
    };
    return text;
};


const getFilterButtonName = (filter) => {
    if (filter.name == "Количество") {
        return `${filter.package_item_count} в упаковке`
    } else if (filter.name == "Рейтинг") {
        return `Рейтинг > ${filter.rating}`
    } else if (filter.name == "Состояние заказа") {
        return getOrderStateEn(filter.state)
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
    getOrderStateTextRu,
    getOrderState,
    getOrderStateEn,
    formatDateForOrder,
    formatDateForPicker,
    getFormatDate,
    formatTime,
    getReviewText,
    getQuantityText,
    getFilterButtonName
}