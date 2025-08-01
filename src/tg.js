import { FAKE_WEB_APP_DATA, DEBUG } from "./config";

const tg = window.Telegram.WebApp

const mainButton = tg.MainButton;
mainButton.color = "#c4dfe6"
mainButton.textColor = "#013b45"

const secondaryButton = tg.SecondaryButton;
secondaryButton.position = "top";
secondaryButton.textColor = '#013b45';
secondaryButton.color = '#f0f0f0';

const backButton = tg.BackButton;

const initData = !DEBUG? tg.initData: FAKE_WEB_APP_DATA;


const showTelegramPopUp = async(message) => {
    try{
        const params = {
            message: message,
            buttons: [
                { id: 'confirm', text: 'Ок' }
            ]
        };
        await new Promise((resolve) => {
            tg.showPopup(params, resolve);
        });
    }
    catch{
        confirm(message)
    }
}


const showTelegramPopUpWithKeyboard = async(message) => {
    try{
        const params = {
            message: message,
            buttons: [
                { id: 'cancel', text: 'Нет' },
                { id: 'confirm', text: 'Да' }
            ]
        };
        const result = await new Promise((resolve) => {
            tg.showPopup(params, resolve);
        });
        return result;
    }
    catch{
        confirm(message);
        return "confirm"
    };
};

const copyTextAndShowPopUp = async(text) => {
    await navigator.clipboard.writeText(text);
    try{
        tg.showAlert("Скопированно") 
    } catch {
        console.error("Методы Telegram не поддерживаются")
    }
}


const setupButton = (button, text, handler) => {
    button.text = text;
    button.onClick(handler);
    button.show();
};

const hideButton = (button) => {
    if (button.isVisible) {
        button.hide();
    }
};


export {
    showTelegramPopUp,
    showTelegramPopUpWithKeyboard, 
    mainButton, 
    secondaryButton, 
    backButton, 
    initData, 
    copyTextAndShowPopUp,
    setupButton,
    hideButton
}