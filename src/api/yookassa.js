import { initData } from "@/tg";
import { API_BASE_URL } from "@/config";
import { showTelegramPopUp } from "@/tg";


const getInvoiceLink = async(orderId) => {
    const data = {
        "order_id": orderId
    }
    try{
        const response = await fetch(`${API_BASE_URL}/v0/yookassa/create_payment`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                "auth": initData,
                "app": "user"
            },
            body: JSON.stringify(data)
        });
        if (response.ok) {
            return await response.json()
        } else {
            showTelegramPopUp("Не удалось получить ссылку на оплату. Повторите позже");
            return null;
        }
    } catch {
        showTelegramPopUp("Не удалось получить ссылку на оплату. Повторите позже");
    }
}


export {getInvoiceLink}