import { API_BASE_URL } from "@/config";
import { initData } from "@/tg";

const getPhoto = async (photo_path) => {
    const response = await fetch(`${API_BASE_URL}/v0/images/${photo_path}`, {
        method: "GET",
        headers: {
            'bypass-tunnel-reminder': 'true',
            "auth": initData,
            "app": "user"
        }
    });
    if (response.ok) {
        const imageBlob = await response.blob();
        const photo = URL.createObjectURL(imageBlob); 
        return photo;
    } else {
        console.error('Ошибка при получении изображения:', response.statusText);
        return null;
    }
  };



export {getPhoto}